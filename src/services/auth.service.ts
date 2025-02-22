import { BadRequestError } from "../errors/badRequest.error";
import { NotFoundError } from "../errors/notFound.error";
import { SessionRepository } from "../repositories/session.repository";
import { UserWihtoutPassword } from "../repositories/user.repository";
import { RawJwtPayload } from "../types/jwtPayload";
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
    user: UserWihtoutPassword
  ): Promise<string> {
    let sessionUuid: string | null = null;

    try {
      sessionUuid = await this.sessionRepository.createSession(user.id!);

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
        this.sessionRepository.removeSession(user.id!, sessionUuid);

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
}
