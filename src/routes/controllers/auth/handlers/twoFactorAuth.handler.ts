import { NextFunction, Response } from "express";
import { TwoFactorAuthDTO } from "../../../../dto/auth/twoFactorAuth.dto";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { authService } from "../../../../services";
import { getUserIp } from "../../../../utils/getUserIp";
import { getUserAgent } from "../../../../utils/getUserAgent";

export const twoFactorAuthHandler = async (
  req: HydratedRequest<TwoFactorAuthDTO>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clientUUID = req.cookies["clientUUID"];
    
    const tokens = await authService.handle2FA(
      req.body,
      getUserIp(req),
      getUserAgent(req),
      clientUUID
    );

    res.status(200).json(tokens);
    return;
  } catch (error) {
    next(error);

    return;
  }
};
