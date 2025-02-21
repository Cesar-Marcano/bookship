import { Router } from "express";

import logger from "../../config/logger";
import { DuplicateKeyError } from "../../errors/duplicateKey.error";
import { UserRepository } from "../../repositories/user.repository";

export const authContrller = Router();

authContrller.get("/", async (_req, res) => {
  // Sample code to create a user
  try {
    console.log(
      await new UserRepository().create({
        email: "test",
        name: "test",
        password: "test",
      })
    );
  } catch (error) {
    logger.error(error instanceof DuplicateKeyError ? error.message : error);
  }
  res.send("Auth Controller");
});
