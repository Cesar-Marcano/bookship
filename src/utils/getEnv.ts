export function getEnv<T>(key: string, defaultValue: T): T;

export function getEnv<T>(key: string): T | null;

/**
 * Retrieves the value of an environment variable as a specific type.
 *
 * @param key - The name of the environment variable to retrieve.
 * @param defaultValue - The default value to return if the environment variable is not set. Defaults to null.
 * @returns The value of the environment variable as type T if set, otherwise the provided default value.
 */

export function getEnv<T>(key: string, defaultValue: T | null = null): T | null {
  const value = process.env[key];
  if (value !== undefined) {
    return value as T;
  }
  return defaultValue;
}
