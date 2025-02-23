import { IsJWT } from "class-validator";

export class GetAccessTokenDto {
  @IsJWT()
  refreshToken!: string;
}
