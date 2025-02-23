import Redis from "ioredis";
import { redisHost, redisPort } from ".";
import logger from "./logger";

class RedisDB {
  private static instance: Redis;

  constructor() {}

  public static getInstance(): Redis {
    if (!RedisDB.instance) {
      RedisDB.instance = new Redis({
        host: redisHost,
        port: redisPort,
      });
    }

    RedisDB.instance.on("connect", () => logger.info("Redis connected."));
    RedisDB.instance.on("error", (err) => logger.error("Error en Redis:", err));

    return RedisDB.instance;
  }
}

export const redis = RedisDB.getInstance();
