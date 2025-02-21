import { Request, Response, Router } from "express";
import { routes } from "./routes";

export type Handler = (req: Request, res: Response) => void;

export interface Route {
  path: string;
  method: "get" | "post" | "put" | "delete";
  handler: Handler;
}

// Router Instance
const router = Router();

// Register Routes
routes.forEach((route) => {
  router[route.method](route.path, route.handler);
});

export { router };
