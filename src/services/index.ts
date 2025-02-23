import { sessionRepository, userRepository } from "../repositories";
import { AuthService } from "./auth.service";
import { JwtService } from "./jwt.service";
import { TwoFactorAuthService } from "./two-factor.auth.service";
import { UserService } from "./user.service";

export const userService = UserService.getInstance(userRepository);
export const authService = AuthService.getInstance(
  userService,
  sessionRepository
);
export const jwtService = JwtService.getInstance();
export const twoFactorAuth = TwoFactorAuthService.getInstance();
