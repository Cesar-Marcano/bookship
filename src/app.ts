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
import { isProduction } from "./config";
import "./config/passport";
import passport from "passport";

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

// Passport
app.use(passport.initialize());

// Development Middlewares

if (isProduction) {
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
