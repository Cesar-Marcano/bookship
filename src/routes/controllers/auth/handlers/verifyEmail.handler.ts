import { NextFunction, Request, Response } from "express";
import { authService } from "../../../../services";

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
