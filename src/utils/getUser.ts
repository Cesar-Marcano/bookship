import { Request } from "express";
import { ReqUser } from "../types/jwtPayload";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const getUser = (req: Request): ReqUser => {
  const user = req.user as unknown as ReqUser;

  if (!user) {
    throw new UnauthorizedError("No user.");
  }

  return user;
};
