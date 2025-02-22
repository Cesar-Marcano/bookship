export class DuplicateKeyError extends Error {
  public readonly fieldName: string;
  /**
   * Creates a new `DuplicateKeyError` object.
   * @param {string} keyName The name of the parameter that already exists.
   */
  constructor(keyName: string) {
    super(`Field ${keyName} is already taken.`);
    this.fieldName = keyName;
    this.name = "DuplicateKey Error";
  }
}
