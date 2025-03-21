import { v4 as uuidv4 } from "uuid";

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
import { JwtService } from "./jwt.service";
import { UserService } from "./user.service";
import { redis } from "../config/redis";
import { TwoFactorAuthDTO } from "../dto/auth/twoFactorAuth.dto";
import { TwoFactorAuthService } from "./twoFactorAuth.service";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { MailService } from "./mail.service";

export class AuthService extends Service {
  constructor(
    private readonly userService: UserService,
    private readonly sessionRepository: SessionRepository,
    private readonly jwtService: JwtService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly mailService: MailService
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
    userAgent: string,
    clientUUID: string
  ): Promise<string> {
    let sessionUuid: string | null = null;

    try {
      sessionUuid = await this.sessionRepository.createSession(
        user.id!,
        userIp,
        userAgent,
        calculateExpiresAt(refreshTokenExpiry),
        clientUUID,
      );

      const payload: RawJwtPayload = {
        uuid: sessionUuid,
        disabled: false,
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

  public async generateAccessToken(token: string): Promise<string> {
    const payload = await this.jwtService.verifyRefreshToken(token);

    const session = await this.sessionRepository.getActiveSession(payload.userData.id, payload.uuid);

    payload.disabled = session!.disabled_session;

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

  public async handleLogin(
    user: UserWihtoutPassword,
    userIp: string,
    userAgent: string,
    clientUUID: string
  ): Promise<{
    accessToken?: string;
    refreshToken?: string;
    tempSessionUUID?: string;
  }> {
    if (!user.is_2fa_enabled) {
      const refreshToken = await this.generateRefreshToken(
        user,
        userIp,
        userAgent,
        clientUUID
      );

      const accessToken = await this.generateAccessToken(refreshToken);

      return { accessToken, refreshToken };
    }

    this.mailService.send2FAAuthEmail(user.email, userIp, userAgent);

    const tempSessionUUID = uuidv4();

    redis.set("2fa:" + tempSessionUUID, user.email, "EX", 60 * 5);

    return { tempSessionUUID };
  }

  public async handle2FA(
    { tempSessionUUID, code }: TwoFactorAuthDTO,
    userIp: string,
    userAgent: string,
    clientUUID: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const email = await redis.get("2fa:" + tempSessionUUID);

    if (!email) {
      throw new BadRequestError("Invalid tempSessionUUID");
    }

    const isOtpValid = await this.twoFactorAuthService.verifyOtp(email, code);

    if (!isOtpValid) {
      throw new UnauthorizedError("Invalid OTP");
    }

    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    const refreshToken = await this.generateRefreshToken(
      user,
      userIp,
      userAgent,
      clientUUID
    );
    const accessToken = await this.generateAccessToken(refreshToken);

    redis.del("2fa:" + tempSessionUUID);

    return { accessToken, refreshToken };
  }
}
