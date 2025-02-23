import { Controller } from "../router";
import { authController } from "./controllers/auth/auth.controller";
import { bookController } from "./controllers/books/book.controller";

// Routes
export const controllers: Controller[] = [
  {
    slug: "auth",
    controller: authController,
  },
  {
    slug: "books",
    requiresAuthorization: true,
    controller: bookController,
  },
];
