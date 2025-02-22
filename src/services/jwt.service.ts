import * as jwt from "jsonwebtoken";
import { StringValue } from "ms";

import { accessTokenExpiry, jwtSecret, refreshTokenExpiry } from "../config";
import { TokenTypeError } from "../errors/tokenType.error";
import { JwtPayload, RawJwtPayload, TokenType } from "../types/jwtPayload";
import { Service } from "../utils/service";
import { BadRequestError } from "../errors/badRequest.error";

export class JwtService extends Service {
  constructor() {
    super();
  }

  public async generateAccessToken({userData, uuid}: RawJwtPayload): Promise<string> {
    return jwt.sign({ userData, uuid, type: TokenType.Access }, jwtSecret, {
      expiresIn: accessTokenExpiry as StringValue,
    });
  }

  public async generateRefreshToken(payload: RawJwtPayload): Promise<string> {
    return jwt.sign({ ...payload, type: TokenType.Refresh }, jwtSecret, {
      expiresIn: refreshTokenExpiry as StringValue,
    });
  }

  public async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      const payload = jwt.verify(token, jwtSecret) as JwtPayload;

      if (payload.type !== TokenType.Access)
        throw new TokenTypeError(TokenType.Access, payload.type);

      return payload;
    } catch {
      throw new BadRequestError("Invalid or expired access token");
    }
  }

  public async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      const payload = jwt.verify(token, jwtSecret) as JwtPayload;

      if (payload.type !== TokenType.Refresh)
        throw new TokenTypeError(TokenType.Refresh, payload.type);

      return payload;
    } catch {
      throw new BadRequestError("Invalid or expired access token");
    }
  }
}
