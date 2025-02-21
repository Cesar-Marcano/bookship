import { Router } from "express";

export const authContrller = Router();

authContrller.get("/", (_req, res) => {
  res.send("Auth Controller");
});
