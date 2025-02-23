import { NextFunction, Response } from "express";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { LoginUserDto } from "../../../../dto/auth/loginUser.dto";
import passport from "passport";
import { UserWihtoutPassword } from "../../../../repositories/user.repository";
import { getUserIp } from "../../../../utils/getUserIp";
import { getUserAgent } from "../../../../utils/getUserAgent";
import { authService } from "../../../../services";

/**
 * Handles user login requests using passport local strategy.
 * 
 * @param req - The request object containing user credentials.
 * @param res - The response object used to send back HTTP responses.
 * @param next - The next middleware function in the stack.
 * 
 * The function authenticates the user using passport's local strategy.
 * If authentication is successful, it retrieves the user's IP and user agent,
 * then calls `authService.handleLogin` to handle further login processes.
 * If the user has two-factor authentication enabled, it sends a 2FA email.
 * Otherwise, it returns access and refresh tokens.
 * 
 * If authentication fails, it responds with a 400 status and an error message.
 * Errors during the login process are passed to the next middleware.
 */
export const loginHandler = (
  req: HydratedRequest<LoginUserDto>,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate(
    "local",
    { session: false },
    async (
      err: Error | null,
      user: UserWihtoutPassword | null,
      info: { message?: string }
    ) => {
      if (err) return next(err);
      if (!user) return res.status(400).json({ message: info.message });

      try {
        const userIp = getUserIp(req);
        const userAgent = getUserAgent(req);

        const loginInfo = await authService.handleLogin(
          user,
          userIp,
          userAgent
        );

        res.status(200).json(loginInfo);
        return;
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
};
