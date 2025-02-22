import { Pool } from "pg";
import dotenv from "dotenv";
import logger from "./logger";
import { loadSQL } from "../utils/sqlLoader";
import { getEnv } from "../utils/getEnv";

dotenv.config();

class Database {
  private static instance: Pool;

  private constructor() {}

  public static getInstance(): Pool {
    const dbUrl = getEnv<string | null>("DATABASE_URL");

    if (!dbUrl) {
      throw new Error("DATABASE_URL is not defined.");
    }

    if (!Database.instance) {
      Database.instance = new Pool({
        connectionString: dbUrl,
        max: 10,
        idleTimeoutMillis: 30000,
      });

      Database.instance.on("error", (err) => {
        logger.error("PostgreSQL Pool Error:", err);
      });

      logger.info("Database (PostgreSQL) connected.");

      this.instance.query(loadSQL("init"));
    }

    return Database.instance;
  }
}

export const db = Database.getInstance();
