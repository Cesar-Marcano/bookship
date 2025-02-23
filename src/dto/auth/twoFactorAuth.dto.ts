import { IsString, IsUUID, Length } from "class-validator";

export class TwoFactorAuthDTO {
  @IsString()
  @IsUUID()
  tempSessionUUID!: string;

  @IsString()
  @Length(6, 6)
  code!: string;
}
