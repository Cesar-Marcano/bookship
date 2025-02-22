import { Request } from "express";

export const getUserIp = (req: Request): string => {
  return req.ip || "Unknown ip.";
};
