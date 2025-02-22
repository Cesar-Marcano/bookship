import { plainToInstance, ClassConstructor } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";

export interface HydratedRequest<T> extends Request {
  body: T;
}

export const bodyValidator =
  <T>(dto: ClassConstructor<T>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dtoInstance = plainToInstance(dto, req.body);

    const errors: ValidationError[] = await validate(dtoInstance as object);

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
        value: error.value,
      }));

      res.status(400).json({
        message: "Validation failed",
        errors: formattedErrors,
      });

      return;
    }

    next();
  };
