import { bookRepository, sessionRepository, userRepository } from "../repositories";
import { AuthService } from "./auth.service";
import { BookService } from "./book.service";
import { JwtService } from "./jwt.service";
import { MailService } from "./mail.service";
import { TwoFactorAuthService } from "./twoFactorAuth.service";
import { UserService } from "./user.service";

export const jwtService = JwtService.getInstance();
export const userService = UserService.getInstance(userRepository);
export const twoFactorAuthService = TwoFactorAuthService.getInstance();
export const mailService = MailService.getInstance(
  userService,
  twoFactorAuthService
);
export const authService = AuthService.getInstance(
  userService,
  sessionRepository,
  jwtService,
  twoFactorAuthService,
  mailService
);

export const bookService = BookService.getInstance(bookRepository);

mailService.setAuthService(authService);
