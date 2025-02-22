import { TokenType } from "../types/jwtPayload";

export class TokenTypeError extends Error {
  constructor(tokenTypeExpected: TokenType, tokenTypeReceived: TokenType) {
    super(
      `Token type expected: ${tokenTypeExpected}, token type received: ${tokenTypeReceived}`
    );

    this.name = "TokenTypeError";
  }
}
