import otpGenerator from "otp-generator";

import { redis } from "../config/redis";
import { Service } from "../utils/service";

export class TwoFactorAuthService extends Service {
  constructor() {
    super();
  }

  async generateOtp(
    userEmail: string
  ): Promise<{ code: string; expiresInMinutes: number }> {
    const otpCode = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: true,
    });

    const expirationInMinutes = 5;
    const expirationInSeconds = expirationInMinutes * 60;

    redis.set("otp:" + userEmail, otpCode, "EX", expirationInSeconds);

    return {
      code: otpCode,
      expiresInMinutes: expirationInMinutes,
    };
  }

  async verifyOtp(userEmail: string, otpCode: string): Promise<boolean> {
    const storedOtpCode = await redis.get("otp:" + userEmail);

    if (storedOtpCode === otpCode) {
      return true;
    }

    return false;
  }
}
