import { app } from "./app";
import logger from "./config/logger";

const defaultPort: number = 3000;

const portFromEnv = parseInt(process.env["PORT"] || "", 10);
const port: number = isNaN(portFromEnv) ? defaultPort : portFromEnv;

if (process.env["NODE_ENV"] === "production") {
  if (isNaN(portFromEnv)) {
    logger.error(
      `Invalid environment variable value for "PORT". Expected a number, Actual: "${process.env["PORT"]}".`
    );
    throw new Error('Invalid environment variable value for "PORT"');
  }

  if (port === defaultPort && portFromEnv !== defaultPort) {
    logger.warn(`Using default port "${defaultPort}".`);
  }
}

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
