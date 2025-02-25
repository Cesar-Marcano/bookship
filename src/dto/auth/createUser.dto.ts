import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user, must be a valid email address.
 *         name:
 *           type: string
 *           description: The name of the user, cannot be empty.
 *         password:
 *           type: string
 *           description: The password for the user account, must be a strong password.
 *           minLength: 8
 *           example: "P@ssw0rd!"
 */
export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsStrongPassword()
  password!: string;
}
