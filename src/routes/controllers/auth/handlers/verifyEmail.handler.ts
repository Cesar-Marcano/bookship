import { NextFunction, Request, Response } from "express";
import { authService } from "../../../../services";

/**
 * @swagger
 * /api/auth/verify-email/{id}:
 *   get:
 *     summary: Verify email address
 *     description: Verifies the email address using the provided verification token.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The email verification token.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email successfully verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email verified"
 *       400:
 *         description: Bad request, invalid or expired token
 *       404:
 *         description: Token not found
 *       500:
 *         description: Internal server error
 */
export const verifyEmailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authService.verifyEmailVerificationToken(req.params["id"] as string);

    res.status(200).json({ message: "Email verified" });

    return;
  } catch (error) {
    next(error);

    return;
  }
};
