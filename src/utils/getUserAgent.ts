import { Request } from "express";
import { UAParser } from "ua-parser-js";
import { isProduction } from "../config";

export const getUserAgent = (req: Request): string => {
  const userAgent = req.headers["user-agent"] || "Unknown user agent.";

  if (userAgent.startsWith("Unknown")) {
    return userAgent;
  } else if (!isProduction && userAgent.startsWith("Postman")) {
    return userAgent;
  }

  const parser = new UAParser();
  const result = parser.setUA(userAgent).getResult();

  const normalizedUserAgent = `${result.browser.name} ${result.browser.major} (${result.os.name} ${result.os.version})`;

  return normalizedUserAgent;
};
