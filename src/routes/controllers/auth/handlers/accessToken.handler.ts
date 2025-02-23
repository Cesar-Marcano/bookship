import { NextFunction, Response } from "express";
import { GetAccessTokenDto } from "../../../../dto/auth/getAccessToken.dto";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { authService } from "../../../../services";

export const accessTokenHandler = async (
  req: HydratedRequest<GetAccessTokenDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = await authService.generateAccessToken(
      req.body.refreshToken
    );

    res.status(200).json({ accessToken });

    return;
  } catch (error) {
    next(error);

    return;
  }
};
