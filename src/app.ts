import compression from "compression";
import cors from "cors";
import express, { json, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";

import { morganFormat } from "./config/morgan-format";

// Express App Instance
export const app = express();

// =====================
//       MIDDLEWARES
// =====================

// Parses incoming requests with JSON payloads
app.use(json({ limit: "1mb" }));

// Security
app.use(helmet());
app.use(cors());
app.use(hpp());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Compression
app.use(compression());

// Development Middlewares

if (process.env["NODE_ENV"] !== "production") {
  // Logs HTTP requests
  app.use(morganFormat);
}

// TODO: REMOVE THIS
// Sample Routes
app.get("/api/books", (_req: Request, res: Response) => {
  res.json([]);
});

app.post("/api/books", (req: Request, res: Response) => {
  res.status(201).json(req.body);
});
