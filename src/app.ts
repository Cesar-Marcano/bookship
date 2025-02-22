import "./config/db";

import compression from "compression";
import cors from "cors";
import express, { json } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";

import { morganFormat } from "./config/morgan-format";
import { router } from "./router";
import { errorFilter } from "./middleware/filter";

// Express App Instance
export const app = express();

// =====================
//       MIDDLEWARES
// =====================

// Parses incoming requests with JSON payloads
app.use(json({ limit: "1mb" }));

// Security
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Compression
app.use(compression());

// Development Middlewares

if (process.env["NODE_ENV"] !== "production") {
  // Logs HTTP requests
  app.use(morganFormat);
}

// =====================
//         ROUTER
// =====================
app.use("/api", router);

// =====================
//      Error Filter
// =====================
app.use(errorFilter);
