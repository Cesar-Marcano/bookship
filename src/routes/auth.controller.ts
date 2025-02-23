import { Router } from "express";
import passport from "passport";
import { v4 as uuidv4 } from "uuid";

import { CreateUserDto } from "../dto/auth/createUser.dto";
import { LoginUserDto } from "../dto/auth/loginUser.dto";
import { isAuthenticated } from "../middleware/authMiddleware";
import { bodyValidator, HydratedRequest } from "../middleware/bodyValidator";
import { UserWihtoutPassword } from "../repositories/user.repository";
import {
  authService,
  mailService,
  twoFactorAuthService,
  userService,
} from "../services";
import { getUser } from "../utils/getUser";
import { getUserIp } from "../utils/getUserIp";
import { getUserAgent } from "../utils/getUserAgent";
import { LogoutDeviceDTO } from "../dto/auth/logoutDevice.dto";
import { redis } from "../config/redis";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const authController = Router();

authController.post(
  "/login",
  bodyValidator(LoginUserDto),
  (req: HydratedRequest<LoginUserDto>, res, next) => {
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

          if (!user.is_2fa_enabled) {
            const refreshToken = await authService.generateRefreshToken(
              user,
              userIp,
              userAgent
            );
            const accessToken =
              await authService.generateAccessToken(refreshToken);

            return res.status(200).json({ accessToken, refreshToken });
          }

          mailService.send2FAAuthEmail(user.email, userIp, userAgent);

          const tempSessionUUID = uuidv4();

          redis.set("2fa:" + tempSessionUUID, user.email, "EX", 60 * 5);

          return res.status(200).json({ tempSessionUUID });
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);

authController.post("/2fa", async (req, res, next) => {
  try {
    const { tempSessionUUID, code } = req.body as {
      tempSessionUUID: string;
      code: string;
    };

    const email = await redis.get("2fa:" + tempSessionUUID);

    if (!email) {
      res.status(400).json({ message: "Invalid tempSessionUUID" });
      return;
    }

    const isOtpValid = await twoFactorAuthService.verifyOtp(email, code);

    if (!isOtpValid) {
      throw new UnauthorizedError("Invalid OTP");
    }

    const user = await userService.getUserByEmail(email);

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const userIp = getUserIp(req);
    const userAgent = getUserAgent(req);

    const refreshToken = await authService.generateRefreshToken(
      user,
      userIp,
      userAgent
    );
    const accessToken = await authService.generateAccessToken(refreshToken);

    redis.del("2fa:" + tempSessionUUID);

    res.status(200).json({ accessToken, refreshToken });
    return;
  } catch (error) {
    next(error);

    return;
  }
});

authController.post(
  "/register",
  bodyValidator(CreateUserDto),
  async (req: HydratedRequest<CreateUserDto>, res, next) => {
    try {
      const user = await userService.createUser(req.body);

      mailService.sendEmailVerificationEmail(req.body.email, req.body.name);

      res.status(201).json(user);

      return;
    } catch (error) {
      next(error);

      return;
    }
  }
);

authController.post("/logout", isAuthenticated, async (req, res, next) => {
  try {
    const user = getUser(req);

    const result = await authService.revokeRefreshToken(
      user.userData.id!,
      user.tokenUuid
    );

    if (result) {
      res.status(200).json({ message: "Successfully logged out" });
      return;
    }

    res.status(400).json({ message: "User was not logged in" });

    return;
  } catch (error) {
    next(error);

    return;
  }
});

authController.get(
  "/active-sessions",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const user = getUser(req);

      const sessions = await authService.getActiveSessions(user.userData.id!);

      res.status(200).json(sessions);

      return;
    } catch (error) {
      next(error);

      return;
    }
  }
);

authController.post(
  "/logout-device",
  bodyValidator(LogoutDeviceDTO),
  isAuthenticated,
  async (req: HydratedRequest<LogoutDeviceDTO>, res, next) => {
    try {
      const user = getUser(req);

      const result = await authService.revokeRefreshToken(
        user.userData.id!,
        req.body.sessionUUID
      );

      if (result) {
        res.status(200).json({ message: "Successfully logged out" });
        return;
      }

      res.status(400).json({ message: "User was not logged in" });

      return;
    } catch (error) {
      next(error);

      return;
    }
  }
);

authController.get("/verify-email/:id", async (req, res, next) => {
  try {
    await authService.verifyEmailVerificationToken(req.params.id);

    res.status(200).json({ message: "Email verified" });

    return;
  } catch (error) {
    next(error);

    return;
  }
});
