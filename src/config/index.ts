import chalk from "chalk";

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
