import { IsString, IsUUID } from "class-validator";

export class LogoutDeviceDTO {
  @IsString()
  @IsUUID()
  sessionUUID!: string;
}
