import { NextFunction, Response } from "express";
import { LogoutDeviceDTO } from "../../../../dto/auth/logoutDevice.dto";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { getUser } from "../../../../utils/getUser";
import { authService } from "../../../../services";

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
