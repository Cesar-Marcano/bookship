import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const isAuthenticated = passport.authenticate("jwt", { session: false });

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
