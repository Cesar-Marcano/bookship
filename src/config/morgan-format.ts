import chalk from "chalk";
import dayjs from "dayjs";
import morgan from "morgan";

import { timestampFormat } from "./";

export const morganFormat = morgan((tokens, req, res) => {
  const status = parseInt(
    (tokens["status"] && tokens["status"](req, res)) || "0",
    10
  );

  const color =
    status >= 500
      ? chalk.red.bold
      : status >= 400
        ? chalk.yellow
        : status >= 300
          ? chalk.cyan
          : chalk.green;

  const timestamp = dayjs().format(timestampFormat);

  return [
    chalk.gray(timestamp),
    chalk.blue.bold((tokens["method"] && tokens["method"](req, res)) || ""),
    chalk.yellow((tokens["url"] && tokens["url"](req, res)) || ""),
    color(status),
    chalk.magenta(
      `${(tokens["response-time"] && tokens["response-time"](req, res)) || 0} ms`
    ),
    chalk.cyan(
      `(${(tokens["res"] && tokens["res"](req, res, "content-length")) || 0} bytes)`
    ),
  ].join(" ");
});
