import { Router, Request, Response, NextFunction } from "express";

import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";

export const authController = Router();

authController.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  // Sample code to create a user
  try {
    const service = UserService.getInstance(new UserRepository());
    const newUser = await service.createUser({
      email: "test",
      name: "test",
      password: "test",
    });

    // Responde con el nuevo usuario creado
    res.status(201).json(newUser);
  } catch (error) {
    next(error); // Pasa el error al manejador de errores
  }
});
