export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Internal Server Error";
  }
}
