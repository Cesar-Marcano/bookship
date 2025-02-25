import { NextFunction, Request, Response } from "express";
import { getUser } from "../../../../utils/getUser";
import { authService } from "../../../../services";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the authenticated user by revoking their refresh token. Requires the user to be logged in.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully logged out"
 *       400:
 *         description: Bad request, user was not logged in
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
export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = getUser(req);

    const result = await authService.revokeRefreshToken(
      user.userData.id!,
      user.tokenUuid
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
