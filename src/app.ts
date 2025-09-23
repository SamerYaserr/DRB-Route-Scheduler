import express from "express";
import bodyParser from "body-parser";
import { rateLimit } from "express-rate-limit";

import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import routes from "./routes";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 400,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "You reached your limit, Please try again later.",
  validate: { xForwardedForHeader: false },
});

const app = express();

// Rate Limiting
app.use(limiter);

app.use(bodyParser.json());
app.use(express.json());

// API Routes
app.use("/api", routes);

// 404 catcher — should come after routes
app.use(notFound);

// Global error handler — LAST middleware
app.use(errorHandler);

export default app;
