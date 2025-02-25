import { NextFunction, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { LoginUserDto } from "../../../../dto/auth/loginUser.dto";
import passport from "passport";
import { UserWihtoutPassword } from "../../../../repositories/user.repository";
import { getUserIp } from "../../../../utils/getUserIp";
import { getUserAgent } from "../../../../utils/getUserAgent";
import { authService } from "../../../../services";
import dayjs from "dayjs";
import { isProduction } from "../../../../config";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns login information. It may return either access and refresh tokens or a temporary session UUID for two-step authentication.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserDto'
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   accessToken:
 *                     type: string
 *                     example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refreshToken:
 *                     type: string
 *                     example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               - type: object
 *                 properties:
 *                   tempSessionUUID:
 *                     type: string
 *                     format: uuid
 *                     description: A temporary session UUID for two-step authentication, valid for 5 minutes.
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *       400:
 *         description: Bad request, invalid credentials
 *       401:
 *         description: Unauthorized, user not found
 *       500:
 *         description: Internal server error
 */
export const loginHandler = (
  req: HydratedRequest<LoginUserDto>,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate(
    "local",
    { session: false },
    async (
      err: Error | null,
      user: UserWihtoutPassword | null,
      info: { message?: string }
    ) => {
      if (err) return next(err);
      if (!user) return res.status(400).json({ message: info.message });

      try {
        const userIp = getUserIp(req);
        const userAgent = getUserAgent(req);

        const clientUUID = req.cookies["clientUUID"] || uuidv4();

        res.cookie("clientUUID", clientUUID, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "lax" : "none",
          expires: dayjs().add(6, "months").toDate(),
        });

        const loginInfo = await authService.handleLogin(
          user,
          userIp,
          userAgent,
          clientUUID
        );

        res.status(200).json(loginInfo);
        return;
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
};
