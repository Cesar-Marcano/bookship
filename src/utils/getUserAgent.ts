import { Request } from "express";

export const getUserAgent = (req: Request): string => {
  return req.headers["user-agent"] || "Unknown user agent.";
};
