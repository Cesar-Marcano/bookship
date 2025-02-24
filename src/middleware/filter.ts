import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/notFound.error";
import { BadRequestError } from "../errors/badRequest.error";
import { UnauthorizedError } from "../errors/unauthorized.error";
import logger from "../config/logger";
import { InternalServerError } from "../errors/internalServer.error";
import { DuplicateKeyError } from "../errors/duplicateKey.error";

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
  } else if (error instanceof UnauthorizedError) {
    res.status(401).json({
      message: error.message,
    });

    return;
  } else if (error instanceof InternalServerError) {
    res.status(500).json({
      message: error.message,
    });

    return;
  } else if (error instanceof DuplicateKeyError) {
    res.status(409).json({
      message: error.message,
    });

    return;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    "stack" in error
  ) {
    logger.error(
      `Unexpected Error:\nmessage: ${error.message},\nroute: ${_req.path},\nmethod: ${_req.method},\nstack: ${error.stack}`
    ); // Save unexpected errors to the log system
  } else logger.error("FATAL: Unknown error occurred, no details provided.");

  res.status(500).json({
    message: "Internal server error.",
  });
};
