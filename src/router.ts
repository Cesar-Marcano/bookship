import { Router } from "express";
import { controllers } from "./routes";

export interface Controller {
  slug: string;
  controller: Router;
}

// Router Instance
const router = Router();

// Register Controllers
controllers.forEach((controller) => {
  const sanitizedSlug = controller.slug.replace(/^\/|\/$/g, "");

  router.use(`/${sanitizedSlug}`, controller.controller);
});

export { router };
