import { Router } from "express";

import { UserWihtoutPassword } from "../repositories/user.repository";
import passport from "passport";
import { authService, userService } from "../services";
import { bodyValidator, HydratedRequest } from "../middleware/bodyValidator";
import { LoginUserDto } from "../dto/auth/loginUser.dto";
import { CreateUserDto } from "../dto/auth/createUser.dto";

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
          const refreshToken = await authService.generateRefreshToken(user);
          const accessToken =
            await authService.generateAccessToken(refreshToken);

          return res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);

authController.post(
  "/register",
  bodyValidator(CreateUserDto),
  async (req: HydratedRequest<CreateUserDto>, res, next) => {
    try {
      const user = await userService.createUser(req.body);

      res.status(201).json(user);

      return;
    } catch (error) {
      next(error);

      return;
    }
  }
);
