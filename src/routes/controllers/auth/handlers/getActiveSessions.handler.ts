import { NextFunction, Request, Response } from "express";
import { getUser } from "../../../../utils/getUser";
import { authService } from "../../../../services";

/**
 * @swagger
 * /api/auth/active-sessions:
 *   get:
 *     summary: Retrieve active sessions for the authenticated user
 *     description: Retrieves a list of active sessions associated with the authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved active sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionId:
 *                     type: string
 *                     example: "123"
 *                   device:
 *                     type: string
 *                     example: "Chrome on Windows"
 *                   ip:
 *                     type: string
 *                     example: "192.168.1.1"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-24T12:00:00Z"
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Internal server error
 */
export const getActiveSessionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = getUser(req);

    const sessions = await authService.getActiveSessions(user.userData.id!);

    res.status(200).json(sessions);

    return;
  } catch (error) {
    next(error);

    return;
  }
};
