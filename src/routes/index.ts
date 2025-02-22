import { Controller } from "../router";
import { authController } from "./auth.controller";

// Routes
export const controllers: Controller[] = [
  {
    slug: "auth",
    controller: authController,
  },
];
