import { refreshTokenExpiry } from "../config";
import { BadRequestError } from "../errors/badRequest.error";
import { NotFoundError } from "../errors/notFound.error";
import {
  SessionRepository,
  SessionType,
} from "../repositories/session.repository";
import { UserWihtoutPassword } from "../repositories/user.repository";
import { RawJwtPayload } from "../types/jwtPayload";
import { calculateExpiresAt } from "../utils/calculateExpiresAt";
import { comparePassword } from "../utils/hasher";
import { Service } from "../utils/service";
import { jwtService } from "./";
import { UserService } from "./user.service";

export class AuthService extends Service {
  constructor(
    private readonly userService: UserService,
    private readonly sessionRepository: SessionRepository
  ) {
    super();
  }

  public async loginUser(
    email: string,
    password: string
  ): Promise<UserWihtoutPassword> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new NotFoundError("User not found");

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new BadRequestError("Invalid password");

    return await this.userService.getUserById(user.id!);
  }

  public async generateRefreshToken(
    user: UserWihtoutPassword,
    userIp: string,
    userAgent: string
  ): Promise<string> {
    let sessionUuid: string | null = null;

    try {
      sessionUuid = await this.sessionRepository.createSession(
        user.id!,
        userIp,
        userAgent,
        calculateExpiresAt(refreshTokenExpiry)
      );

      const payload: RawJwtPayload = {
        uuid: sessionUuid,
        userData: {
          id: user.id as number,
          email: user.email,
          name: user.name,
          role: user.role!,
        },
      };

      return await jwtService.generateRefreshToken(payload);
    } catch (error) {
      if (sessionUuid)
        await this.sessionRepository.removeSession(user.id!, sessionUuid);

      throw error;
    }
  }

  public async verifyRefreshToken(token: string): Promise<RawJwtPayload> {
    return await jwtService.verifyRefreshToken(token);
  }

  public async verifyAccessToken(token: string): Promise<RawJwtPayload> {
    return await jwtService.verifyAccessToken(token);
  }

  public async generateAccessToken(token: string): Promise<string> {
    const payload = await this.verifyRefreshToken(token);

    return await jwtService.generateAccessToken(payload);
  }

  public async revokeRefreshToken(
    userId: number,
    tokenUuid: string
  ): Promise<boolean> {
    return await this.sessionRepository.removeSession(userId, tokenUuid);
  }

  public async getActiveSessions(userId: number): Promise<SessionType[]> {
    return await this.sessionRepository.getSessions(userId);
  }

  public async generateEmailVerificationToken(email: string): Promise<string> {
    return await jwtService.generateEmailVerificationToken(email);
  }

  public async verifyEmailVerificationToken(token: string): Promise<boolean> {
    const email = await jwtService.verifyEmailVerificationToken(token);

    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new NotFoundError("User not found");

    if (user.email_verified)
      throw new BadRequestError("Email already verified");

    await this.userService.updateUserById(user.id!, {
      email_verified: true,
    });

    return true;
  }
}
