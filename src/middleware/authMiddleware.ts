import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Role } from "../types/role";
import { getUser } from "../utils/getUser";
import { getUserAgent } from "../utils/getUserAgent";
import { sessionRepository } from "../repositories";
import { redis } from "../config/redis";

export const isAuthenticated = passport.authenticate("jwt", { session: false });

export const hasRole =
  (roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const user = getUser(req);

    if (!roles.includes(user.userData.role!)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };

export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = getUser(req);

  const isUserSessionDisabled =
    (await redis.get(`account-disabled:${user.userData.email}`)) == "yes";

  const session = isUserSessionDisabled
    ? await sessionRepository.getActiveSession(
        user.userData.id!,
        user.tokenUuid
      )
    : null;

  if (session?.disabled_session || user.disabled || isUserSessionDisabled) {
    res.status(401).json({
      message:
        "Session has been disabled by the server. Reason: Unknown client. Review your email to secure your account.",
    });
    return;
  }

  const clientUUID = req.cookies["clientUUID"];
  const userAgent = getUserAgent(req);

  if (!clientUUID) {
    res.status(401).json({
      message: "Invalid session. Check your device.",
    });
    return;
  }

  const hasSentInsecureEmail =
    (await redis.get(`account-insecure-email:${user.userData.email}`)) ==
    "sent";

  const isCommonClient = await sessionRepository.isCommonClient(
    clientUUID,
    userAgent,
    user.tokenUuid,
    user.userData.id!
  );

  if (isCommonClient.session_disabled) {
    // TODO: send session disabled email

    await redis.set(`account-disabled:${user.userData.email}`, "yes");
  } else if (isCommonClient.session_insecure && hasSentInsecureEmail) {
    // TODO: send unknown user agent email
    await redis.set(
      `account-insecure-email:${user.userData.email}`,
      "sent",
      "EX",
      3600 * 24 * 7 // 7 days
    );
  }

  next();
};
