export class DuplicateKeyError extends Error {
  /**
   * Creates a new `DuplicateKeyError` object.
   * @param {string} keyName The name of the parameter that already exists.
   */
  constructor(keyName: string) {
    super(`Parameter ${keyName} already exists.`);
    this.name = "DuplicateKey Error";
  }
}
