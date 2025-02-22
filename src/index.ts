import dotenv from "dotenv";

import { app } from "./app";
import logger from "./config/logger";
import { getEnv } from "./utils/getEnv";

dotenv.config();

const defaultPort: number = 3000;

const portFromEnv = parseInt(getEnv("PORT") || "", 10);
const port: number = isNaN(portFromEnv) ? defaultPort : portFromEnv;

if (getEnv("NODE_ENV") === "production") {
  if (isNaN(portFromEnv)) {
    logger.error(
      `Invalid environment variable value for "PORT". Expected a number, Actual: "${getEnv("PORT")}".`
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
