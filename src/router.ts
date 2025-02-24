import { Router } from "express";
import { controllers } from "./routes";
import { isAuthenticated, isAuthorized } from "./middleware/authMiddleware";

export interface Controller {
  slug: string;
  controller: Router;
  requiresAuthorization?: boolean;
}

// Router Instance
const router = Router();

// Register Controllers
controllers.forEach((controller) => {
  const sanitizedSlug = controller.slug.replace(/^\/|\/$/g, "");

  if (controller.requiresAuthorization) {
    router.use(`/${sanitizedSlug}`, isAuthenticated, isAuthorized, controller.controller);
  } else {
    router.use(`/${sanitizedSlug}`, controller.controller);
  }
});

export { router };
