import { Controller } from "../router";
import { authController } from "./controllers/auth/auth.controller";

// Routes
export const controllers: Controller[] = [
  {
    slug: "auth",
    controller: authController,
  },
];
