import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/notFound.error";
import { BadRequestError } from "../errors/badRequest.error";

export const errorFilter = (
  error: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (error instanceof NotFoundError) {
    res.status(404).json({
      message: error.message,
    });

    return;
  } else if (error instanceof BadRequestError) {
    res.status(400).json({
      message: error.message,
    });

    return;
  }

  res.status(500).json({
    message: "Internal server error.",
  });
};
