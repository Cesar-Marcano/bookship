import { UserWihtoutPassword } from "../repositories/user.repository";
import { Role } from "./role";

export enum TokenType {
  Refresh,
  Access,
}

export interface JwtPayload {
  uuid: string;
  type: TokenType;
  disabled: boolean;
  userData: {
    email: string;
    id: number;
    name: string;
    role: Role;
  };
}

export type RawJwtPayload = Omit<JwtPayload, "type">;

export interface ReqUser {
  userData: UserWihtoutPassword;
  disabled: boolean,
  tokenUuid: string;
}
