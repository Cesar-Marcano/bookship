import { appName, emailVerificationUrl } from "../config";
import { sendEmail } from "../utils/mailer";
import { Service } from "../utils/service";
import { AuthService } from "./auth.service";
import { TwoFactorAuthService } from "./twoFactorAuth.service";
import { UserService } from "./user.service";

export class MailService extends Service {
  private authService: AuthService | null = null;

  constructor(
    private readonly userService: UserService,
    private readonly twoFactorAuthService: TwoFactorAuthService
  ) {
    super();
  }

  public setAuthService(authService: AuthService): void {
    this.authService = authService;
  }

  public async send2FAAuthEmail(
    userEmail: string,
    userIp: string,
    userAgent: string
  ): Promise<string> {
    const otpCode = await this.twoFactorAuthService.generateOtp(userEmail);

    const user = await this.userService.getUserByEmail(userEmail);

    sendEmail(
      userEmail,
      appName + " Two-Factor Authentication",
      "twoFactorAuth",
      {
        otp_code: otpCode.code,
        otp_expiry: otpCode.expiresInMinutes,
        app_name: appName,
        user_name: user.name,
        user_ip: userIp,
        user_agent: userAgent,
      }
    );

    return otpCode.code;
  }

  public async sendEmailVerificationEmail(
    userEmail: string,
    userName: string
  ): Promise<void> {
    if (!this.authService) {
      throw new Error("AuthService has not been set");
    }

    const emailVerificationToken =
      await this.authService.generateEmailVerificationToken(userEmail);

    sendEmail(userEmail, appName + " Email Verification", "emailVerification", {
      email_verification_token: emailVerificationToken,
      app_name: appName,
      user_name: userName,
      verification_link: emailVerificationUrl + emailVerificationToken,
    });
  }
}
