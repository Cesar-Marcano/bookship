import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Role } from "../types/role";
import { getUser } from "../utils/getUser";

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

export const isAuthorized = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  next();
};
