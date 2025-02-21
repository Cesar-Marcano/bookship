import { Request, Response } from "express";
import { Route } from "../router";

// Routes
export const routes: Route[] = [
  {
    path: "/",
    method: "get",
    handler: (_req: Request, res: Response): void => {
      res.send("Hello World!");
    },
  },
];
