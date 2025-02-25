import { NextFunction, Response } from "express";
import { TwoFactorAuthDTO } from "../../../../dto/auth/twoFactorAuth.dto";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { authService } from "../../../../services";
import { getUserIp } from "../../../../utils/getUserIp";
import { getUserAgent } from "../../../../utils/getUserAgent";

/**
 * @swagger
 * /api/auth/two-factor-auth:
 *   post:
 *     summary: Verify two-factor authentication code
 *     description: Validates the two-factor authentication code provided by the user and returns access tokens if successful.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TwoFactorAuthDTO'
 *     responses:
 *       200:
 *         description: Tokens successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The access token for authenticated user
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token for the user session
 *       400:
 *         description: Bad request, invalid or expired code
 *       401:
 *         description: Unauthorized, invalid temporary session UUID or code
 *       500:
 *         description: Internal server error
 */
export const twoFactorAuthHandler = async (
  req: HydratedRequest<TwoFactorAuthDTO>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clientUUID = req.cookies["clientUUID"];

    const tokens = await authService.handle2FA(
      req.body,
      getUserIp(req),
      getUserAgent(req),
      clientUUID
    );

    res.status(200).json(tokens);
    return;
  } catch (error) {
    next(error);

    return;
  }
};
