import { Controller } from "../router";
import { authContrller } from "./auth/auth.controller";

// Routes
export const controllers: Controller[] = [
  {
    slug: "auth",
    controller: authContrller,
  },
];
