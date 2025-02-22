import chalk from "chalk";
import dotenv from "dotenv";

import { getEnv } from "../utils/getEnv";
import logger from "./logger";

dotenv.config();

export const timestampFormat = "YYYY-MM-DD HH:mm:ss";

export const getLevelStyle = (level: string): chalk.Chalk => {
  switch (level) {
    case "error":
      return chalk.bgRed.white.bold;
    case "warn":
      return chalk.bgYellow.black.bold;
    case "info":
      return chalk.bgBlue.white.bold;
    case "debug":
      return chalk.bgMagenta.white.bold;
    default:
      return chalk.bgGray.white.bold;
  }
};

export const port = getEnv<string | undefined>("PORT", undefined);

export const defaultPort = 3000;

export const dbUrl = getEnv<string | null>("DATABASE_URL");

export const isProduction = getEnv("NODE_ENV") === "production";

export const jwtSecret = ((): string => {
  const secret = getEnv<string>("JWT_SECRET", "default-secret");

  if (secret === "default-secret") {
    logger.warn(chalk.yellow("Using default secret for JWT."));
  }

  return secret;
})();

export const accessTokenExpiry: string | number = getEnv<string | number>(
  "ACCESS_TOKEN_EXPIRY",
  "15m"
);

export const refreshTokenExpiry = getEnv<string>("REFRESH_TOKEN_EXPIRY", "7d");

export const usesLoadBalancer: boolean =
  getEnv<string>("USES_LOAD_BALANCER", "false") === "true";
