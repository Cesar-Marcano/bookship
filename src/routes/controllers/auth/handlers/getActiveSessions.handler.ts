import { NextFunction, Request, Response } from "express";
import { getUser } from "../../../../utils/getUser";
import { authService } from "../../../../services";

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
