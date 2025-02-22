import { app } from "./app";
import logger from "./config/logger";
import { defaultPort, isProduction, port } from "./config";

const portFromEnv = parseInt(port ?? "");
const appPort: number = isNaN(portFromEnv) ? defaultPort : portFromEnv;

if (isProduction) {
  if (isNaN(portFromEnv)) {
    logger.error(
      `Invalid environment variable value for "PORT". Expected a number, Actual: "${port}".`
    );
    throw new Error('Invalid environment variable value for "PORT"');
  }

  if (appPort === defaultPort && portFromEnv !== defaultPort) {
    logger.warn(`Using default port "${defaultPort}".`);
  }
}

app.listen(appPort, () => {
  logger.info(`Server listening on port ${appPort}`);
});
