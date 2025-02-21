import { QueryResult } from "pg";
import { db } from "../config/db";
import { loadSQL } from "./sqlLoader";
import { DuplicateKeyError } from "../errors/duplicateKey.error";

/**
 * Returns a function that executes a SQL query loaded from a file.
 *
 * The returned function takes an optional array of parameters to be passed to the query.
 *
 * The function returns a promise that resolves with the result of the query.
 *
 * @param filename The name of the file containing the SQL query.
 * @returns A function that takes an optional array of parameters and returns a promise with the result of the query.
 */
export const executeSQLFile = (filename: string) => {
  return async (
    params?: (string | number | boolean | null)[]
  ): Promise<QueryResult> => {
    const query = loadSQL(filename);

    try {
      return await db.query(query, params);
    } catch (error) {
      throw handleDatabaseError(error);
    }
  };
};

const handleDatabaseError = (error: unknown): void => {
  if (isDuplicateKeyError(error)) {
    const { table, constraint } = error as { table: string; constraint: string };
    const keyName = constraint.replace(`${table}_`, "").replace("_key", "");
    throw new DuplicateKeyError(keyName);
  }

  throw error;
};

const isDuplicateKeyError = (
  error: unknown
): error is { code: string; constraint: string; table: string } => {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof error.code === "string" &&
    "constraint" in error &&
    typeof error.constraint === "string" &&
    "table" in error &&
    typeof error.table === "string" &&
    error.code === "23505"
  );
};
