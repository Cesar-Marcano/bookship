import { QueryResult } from "pg";
import { db } from "../config/db";
import { loadSQL } from "./sqlLoader";
import { DuplicateKeyError } from "../errors/duplicateKey.error";

export const executeSQLFile = (filename: string) => {
  return async (
    params?: (string | number | boolean | null)[]
  ): Promise<QueryResult> => {
    try {
      const query = loadSQL(filename);
      return await db.query(query, params);
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        typeof error.code === "string" &&
        "constraint" in error &&
        typeof error.constraint === "string" &&
        "table" in error &&
        typeof error.table === "string" &&
        error.code === "23505"
      ) {
        throw new DuplicateKeyError(
          error.constraint.replace(`${error.table}_`, "").replace("_key", "")
        );
      }

      throw error;
    }
  };
};
