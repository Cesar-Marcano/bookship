import { Router, Request, Response, NextFunction } from "express";

import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { bodyValidator, HydratedRequest } from "../middleware/bodyValidator";
import { CreateUserDto } from "../dto/auth/createUser.dto";

export const authController = Router();

authController.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction) => {
    // Sample code to create a user
    try {
      const service = UserService.getInstance(new UserRepository());
      const newUser = await service.createUser({
        email: "test",
        name: "test",
        password: "test",
      });

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

authController.post(
  "/",
  bodyValidator(CreateUserDto),
  async (req: HydratedRequest<CreateUserDto>, res: Response) => {
    res.json(req.body.email);
  }
);
