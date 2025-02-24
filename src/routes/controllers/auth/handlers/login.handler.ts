import { NextFunction, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { LoginUserDto } from "../../../../dto/auth/loginUser.dto";
import passport from "passport";
import { UserWihtoutPassword } from "../../../../repositories/user.repository";
import { getUserIp } from "../../../../utils/getUserIp";
import { getUserAgent } from "../../../../utils/getUserAgent";
import { authService } from "../../../../services";
import dayjs from "dayjs";
import { isProduction } from "../../../../config";

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

        const clientUUID = req.cookies["clientUUID"] || uuidv4();

        res.cookie("clientUUID", clientUUID, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "lax" : "none",
          expires: dayjs().add(6, "months").toDate(),
        });

        const loginInfo = await authService.handleLogin(
          user,
          userIp,
          userAgent,
          clientUUID
        );

        res.status(200).json(loginInfo);
        return;
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
};
