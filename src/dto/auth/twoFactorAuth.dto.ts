import { IsString, IsUUID, Length } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     TwoFactorAuthDTO:
 *       type: object
 *       required:
 *         - tempSessionUUID
 *         - code
 *       properties:
 *         tempSessionUUID:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the temporary session used in two-factor authentication.
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         code:
 *           type: string
 *           description: The 6-digit code provided for two-factor authentication.
 *           example: "123456"
 */
export class TwoFactorAuthDTO {
  @IsString()
  @IsUUID()
  tempSessionUUID!: string;

  @IsString()
  @Length(6, 6)
  code!: string;
}
