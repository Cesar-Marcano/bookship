import { IsString, IsUUID } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     LogoutDeviceDTO:
 *       type: object
 *       required:
 *         - sessionUUID
 *       properties:
 *         sessionUUID:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the session to be logged out.
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 */
export class LogoutDeviceDTO {
  @IsString()
  @IsUUID()
  sessionUUID!: string;
}
