/**
 * Quiz Routes
 * API endpoints for quiz evaluation and feedback
 */

import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Logger } from "pino";
import {
  evaluateAnswer,
  validateEvaluatorInput,
} from "@agents/evaluator";
import { getCacheService } from "@services/cache.service";
import { EvaluatorInput } from "@types/evaluator";
import { createHash } from "crypto";

const router = Router();

// Zod schema for request validation
const EvaluateRequestSchema = z.object({
  questionId: z.string(),
  userAnswer: z.string(),
  correctAnswer: z.string(),
  questionContext: z.object({
    level: z.enum(["1", "2", "3", "4"]).transform(Number),
    topic: z.string(),
    category: z.string(),
    expectedKeywords: z.array(z.string()).optional(),
  }),
  options: z.array(z.string()).optional(),
  metadata: z
    .object({
      userId: z.string().optional(),
      timestamp: z.number().optional(),
      attemptNumber: z.number().optional(),
    })
    .optional(),
});

/**
 * POST /api/quiz/evaluate
 * Evaluate a quiz answer using Evaluator Agent
 */
router.post(
  "/evaluate",
  async (req: Request, res: Response, next: NextFunction) => {
    const logger = (req as any).logger as Logger;
    const startTime = Date.now();

    try {
      // Validate request schema
      const validated = EvaluateRequestSchema.parse(req.body);
      const input: EvaluatorInput = {
        ...validated,
        questionContext: {
          ...validated.questionContext,
          level: validated.questionContext.level as 1 | 2 | 3 | 4,
        },
      };

      // Create cache key
      const cacheKey = createHash("sha256")
        .update(`${input.questionId}:${input.userAnswer}`)
        .digest("hex");

      const cache = getCacheService();

      // Check cache first
      const cached = await cache.get(cacheKey);
      if (cached) {
        logger.info({ cacheKey }, "Cache hit");
        return res.json({
          ...cached,
          fromCache: true,
          requestTimeMs: Date.now() - startTime,
        });
      }

      logger.info({ questionId: input.questionId }, "Evaluating answer");

      // Call Evaluator Agent
      const result = await evaluateAnswer(input);

      // Store in cache
      await cache.set(cacheKey, result, 24 * 60 * 60); // 24 hours TTL

      res.json({
        ...result,
        fromCache: false,
        requestTimeMs: Date.now() - startTime,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/quiz/health
 * Health check for evaluator service
 */
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/quiz/cache-stats
 * Get cache performance statistics
 */
router.get("/cache-stats", async (req: Request, res: Response) => {
  const cache = getCacheService();
  const stats = await cache.getStats();

  res.json({
    ...stats,
    timestamp: new Date().toISOString(),
  });
});

export default router;
