import { IsEmail, IsStrongPassword, IsString } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginUserDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address used for authentication.
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           description: The user's password, which must be a strong password.
 *           example: "StrongP@ssw0rd!"
 *       required:
 *         - email
 *         - password
 */
export class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsStrongPassword()
  password!: string;
}
