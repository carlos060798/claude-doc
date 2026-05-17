/**
 * Main Server Entry Point
 * Claude Code Mastery Agent SDK API Server
 */

import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import { config } from "dotenv";
import pino from "pino";
import quizRoutes from "@routes/quiz.routes";
import {
  initializeAnthropicClient,
  verifyApiKey,
} from "@utils/anthropic";
import {
  initializeCache,
  createCacheService,
} from "@services/cache.service";

// Load environment variables
config();

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      singleLine: false,
    },
  },
});

// Initialize Express app
const app: Express = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:8000",
    credentials: true,
  })
);

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).logger = logger.child({
    requestId: req.id || Math.random().toString(36).substr(2, 9),
  });

  (req as any).logger.info(
    {
      method: req.method,
      path: req.path,
      ip: req.ip,
    },
    "Incoming request"
  );

  res.on("finish", () => {
    (req as any).logger.info(
      {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
      },
      "Request completed"
    );
  });

  next();
});

// Request ID middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  next();
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "claude-code-mastery-api",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/quiz", quizRoutes);

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const logger = (req as any).logger || pino();

  logger.error(
    {
      error: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
    },
    "Unhandled error"
  );

  // Handle Zod validation errors
  if (error.name === "ZodError") {
    return res.status(400).json({
      error: "Validation error",
      details: (error as any).errors,
    });
  }

  // Handle Anthropic API errors
  if (error.message.includes("Anthropic") || error.message.includes("API")) {
    return res.status(503).json({
      error: "Service unavailable",
      message: "Evaluation service temporarily unavailable",
    });
  }

  // Default error response
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
  });
});

/**
 * Startup function
 */
async function startup() {
  try {
    logger.info("Starting Claude Code Mastery API Server...");

    // Verify Anthropic API key
    logger.info("Verifying Anthropic API key...");
    initializeAnthropicClient();
    const keyVerified = await verifyApiKey(logger);
    if (!keyVerified) {
      throw new Error("Failed to verify Anthropic API key");
    }

    // Initialize cache
    logger.info("Initializing cache service...");
    await initializeCache(logger);
    createCacheService(logger);

    // Start server
    const PORT = parseInt(process.env.PORT || "3000", 10);
    const server = app.listen(PORT, () => {
      logger.info(`✅ Server running on http://localhost:${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🧠 API endpoint: http://localhost:${PORT}/api/quiz/evaluate`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received, shutting down gracefully...");
      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT received, shutting down gracefully...");
      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error({ error }, "Startup failed");
    process.exit(1);
  }
}

// Run startup
startup();

export default app;
