import { readFileSync } from "fs";
import { join } from "path";

export const loadSQL = (filename: string): string => {
  return readFileSync(join(__dirname, "../sql", filename), "utf8");
};
