import { Role } from "./role";

export enum TokenType {
  Refresh,
  Access,
}

export interface JwtPayload {
  uuid: string;
  type: TokenType;
  userData: {
    email: string;
    id: number;
    name: string;
    role: Role;
  };
}

export type RawJwtPayload = Omit<JwtPayload, "type">;
