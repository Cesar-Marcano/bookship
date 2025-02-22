import { Request } from "express";
import { usesLoadBalancer } from "../config";

export const getUserIp = (req: Request): string => {
  if (!usesLoadBalancer) {
    return req.socket.remoteAddress || "Unknown ip.";
  } else {
    return req.ip || "Unknown ip.";
  }
};
