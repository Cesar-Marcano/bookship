import { NextFunction, Response } from "express";
import { CreateUserDto } from "../../../../dto/auth/createUser.dto";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { mailService, userService } from "../../../../services";

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
