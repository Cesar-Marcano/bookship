import otpGenerator from "otp-generator";

import { redis } from "../config/redis";
import { Service } from "../utils/service";
import { InternalServerError } from "../errors/internalServer.error";
import logger from "../config/logger";

export class TwoFactorAuthService extends Service {
  constructor() {
    super();
  }

  async generateOtp(
    userEmail: string
  ): Promise<{ code: string; expiresInMinutes: number }> {
    try {
      const otpCode = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: true,
        specialChars: false,
      });

      const expirationInMinutes = 5;
      const expirationInSeconds = expirationInMinutes * 60;

      await redis.set("otp:" + userEmail, otpCode, "EX", expirationInSeconds);

      return {
        code: otpCode,
        expiresInMinutes: expirationInMinutes,
      };
    } catch (error) {
      logger.error(error);

      throw new InternalServerError(
        "Unexpected error while generating One-Time Password (OTP)."
      );
    }
  }

  async verifyOtp(userEmail: string, otpCode: string): Promise<boolean> {
    try {
      const storedOtpCode = await redis.get("otp:" + userEmail);

      if (storedOtpCode === otpCode) {
        await redis.del("otp:" + userEmail);

        return true;
      }

      return false;
    } catch (error) {
      logger.error(error);

      throw new InternalServerError(
        "Unexpected error while verifying One-Time Password (OTP)."
      );
    }
  }
}
