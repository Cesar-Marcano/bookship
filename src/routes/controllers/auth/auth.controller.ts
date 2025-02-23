import { Router } from "express";

import { CreateUserDto } from "../../../dto/auth/createUser.dto";
import { GetAccessTokenDto } from "../../../dto/auth/getAccessToken.dto";
import { LoginUserDto } from "../../../dto/auth/loginUser.dto";
import { LogoutDeviceDTO } from "../../../dto/auth/logoutDevice.dto";
import { TwoFactorAuthDTO } from "../../../dto/auth/twoFactorAuth.dto";
import { isAuthenticated } from "../../../middleware/authMiddleware";
import { bodyValidator } from "../../../middleware/bodyValidator";
import { accessTokenHandler } from "./handlers/accessToken.handler";
import { getActiveSessionsHandler } from "./handlers/getActiveSessions.handler";
import { loginHandler } from "./handlers/login.handler";
import { logoutHandler } from "./handlers/logout.handler";
import { logoutDeviceHandler } from "./handlers/logoutDevice.handler";
import { registerHandler } from "./handlers/register.handler";
import { twoFactorAuthHandler } from "./handlers/twoFactorAuth.handler";
import { verifyEmailHandler } from "./handlers/verifyEmail.handler";

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

authController.get("/verify-email/:id", verifyEmailHandler);
