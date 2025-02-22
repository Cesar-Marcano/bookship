import { Pool } from "pg";
import dotenv from "dotenv";
import logger from "./logger";
import { loadSQL } from "../utils/sqlLoader";

dotenv.config();

class Database {
  private static instance: Pool;

  private constructor() {}

  public static getInstance(): Pool {
    if (!Database.instance) {
      Database.instance = new Pool({
        connectionString: process.env["DATABASE_URL"],
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
