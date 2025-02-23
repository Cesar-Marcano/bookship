import { Router } from "express";

import { CreateUserDto } from "../../../dto/auth/createUser.dto";
import { LoginUserDto } from "../../../dto/auth/loginUser.dto";
import { isAuthenticated } from "../../../middleware/authMiddleware";
import { bodyValidator } from "../../../middleware/bodyValidator";
import { authService } from "../../../services";
import { LogoutDeviceDTO } from "../../../dto/auth/logoutDevice.dto";
import { TwoFactorAuthDTO } from "../../../dto/auth/twoFactorAuth.dto";
import { GetAccessTokenDto } from "../../../dto/auth/getAccessToken.dto";
import { loginHandler } from "./handlers/login.handler";
import { twoFactorAuthHandler } from "./handlers/twoFactorAuth.handler";
import { accessTokenHandler } from "./handlers/accessToken.handler";
import { registerHandler } from "./handlers/register.handler";
import { logoutHandler } from "./handlers/logout.handler";
import { getActiveSessionsHandler } from "./handlers/getActiveSessions.handler";
import { logoutDeviceHandler } from "./handlers/logoutDevice.handler";

export const authController = Router();

authController.post("/login", bodyValidator(LoginUserDto), loginHandler);

authController.post(
  "/2fa",
  bodyValidator(TwoFactorAuthDTO),
  twoFactorAuthHandler
);

authController.post(
  "/access-token",
  bodyValidator(GetAccessTokenDto),
  accessTokenHandler
);

authController.post("/register", bodyValidator(CreateUserDto), registerHandler);

authController.post("/logout", isAuthenticated, logoutHandler);

authController.get(
  "/active-sessions",
  isAuthenticated,
  getActiveSessionsHandler
);

authController.post(
  "/logout-device",
  bodyValidator(LogoutDeviceDTO),
  isAuthenticated,
  logoutDeviceHandler
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
