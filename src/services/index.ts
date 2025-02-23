import { sessionRepository, userRepository } from "../repositories";
import { AuthService } from "./auth.service";
import { JwtService } from "./jwt.service";
import { MailService } from "./mail.service";
import { TwoFactorAuthService } from "./twoFactorAuth.service";
import { UserService } from "./user.service";

export const userService = UserService.getInstance(userRepository);
export const authService = AuthService.getInstance(
  userService,
  sessionRepository
);
export const jwtService = JwtService.getInstance();
export const twoFactorAuthService = TwoFactorAuthService.getInstance();
export const mailService = MailService.getInstance(
  userService,
  twoFactorAuthService,
  authService
);
