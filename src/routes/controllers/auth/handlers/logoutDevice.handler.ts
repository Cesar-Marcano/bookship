import { NextFunction, Response } from "express";
import { LogoutDeviceDTO } from "../../../../dto/auth/logoutDevice.dto";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { getUser } from "../../../../utils/getUser";
import { authService } from "../../../../services";

/**
 * @swagger
 * /api/auth/logout-device:
 *   post:
 *     summary: Logout from a specific device
 *     description: Logs out the user from a specific device by revoking the associated refresh token. Requires the user to be authenticated and provide a valid session UUID.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutDeviceDTO'
 *     responses:
 *       200:
 *         description: Successfully logged out from the device
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully logged out"
 *       400:
 *         description: Bad request, user was not logged in or session UUID is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User was not logged in"
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Internal server error
 */
export const logoutDeviceHandler = async (
  req: HydratedRequest<LogoutDeviceDTO>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = getUser(req);

    const result = await authService.revokeRefreshToken(
      user.userData.id!,
      req.body.sessionUUID
    );

    if (result) {
      res.status(200).json({ message: "Successfully logged out" });
      return;
    }

    res.status(400).json({ message: "User was not logged in" });

    return;
  } catch (error) {
    next(error);

    return;
  }
};
