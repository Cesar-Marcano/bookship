import { NextFunction, Response } from "express";
import { GetAccessTokenDto } from "../../../../dto/auth/getAccessToken.dto";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { authService } from "../../../../services";

/**
 * @swagger
 * /api/auth/access-token:
 *   post:
 *     summary: Generate a new access token
 *     description: Generates a new access token using the provided refresh token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetAccessTokenDto'
 *     responses:
 *       200:
 *         description: Access token successfully generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request, invalid refresh token
 *       401:
 *         description: Unauthorized, refresh token is invalid or expired
 *       500:
 *         description: Internal server error
 */
export const accessTokenHandler = async (
  req: HydratedRequest<GetAccessTokenDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = await authService.generateAccessToken(
      req.body.refreshToken
    );

    res.status(200).json({ accessToken });

    return;
  } catch (error) {
    next(error);

    return;
  }
};
