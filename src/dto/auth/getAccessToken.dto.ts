import { IsJWT } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     GetAccessTokenDto:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *           format: jwt
 *           description: The refresh token used to generate a new access token.
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       required:
 *         - refreshToken
 */
export class GetAccessTokenDto {
  @IsJWT()
  refreshToken!: string;
}
