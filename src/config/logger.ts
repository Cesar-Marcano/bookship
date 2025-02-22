import chalk from "chalk";
import fs from "fs";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { getLevelStyle, isProduction, timestampFormat } from "./";

const consoleFormat = format.combine(
  format.timestamp({ format: timestampFormat }),
  format.printf(({ timestamp, level, message }) => {
    return `${chalk.gray(timestamp)} ${getLevelStyle(level)(` ${level.toUpperCase()} `)}: ${message}`;
  })
);

const loggerTransports = [];

loggerTransports.push(new transports.Console({ format: consoleFormat }));

if (isProduction) {
  const logDir = "./logs";
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const fileFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level.toUpperCase()}: ${message}`;
    })
  );

  loggerTransports.push(
    new DailyRotateFile({
      filename: "logs/%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: fileFormat,
    })
  );
}

const logger = createLogger({
  level: "info",
  transports: loggerTransports,
});

export default logger;
