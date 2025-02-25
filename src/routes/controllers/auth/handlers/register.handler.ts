import { NextFunction, Response } from "express";
import { CreateUserDto } from "../../../../dto/auth/createUser.dto";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { mailService, userService } from "../../../../services";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and sends a verification email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: User successfully registered and verification email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the user.
 *                 email:
 *                   type: string
 *                   description: The email of the registered user.
 *                 name:
 *                   type: string
 *                   description: The name of the registered user.
 *       400:
 *         description: Bad request, invalid data
 *       500:
 *         description: Internal server error
 */
export const registerHandler = async (
  req: HydratedRequest<CreateUserDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.createUser(req.body);

    mailService.sendEmailVerificationEmail(req.body.email, req.body.name);

    res.status(201).json(user);

    return;
  } catch (error) {
    next(error);

    return;
  }
};
