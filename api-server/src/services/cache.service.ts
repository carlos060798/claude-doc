/**
 * Cache Service
 * Redis-backed caching for evaluation results
 */

import { createClient, RedisClientType } from "redis";
import { EvaluatorOutput } from "@types/evaluator";
import { Logger } from "pino";

let redisClient: RedisClientType | null = null;
let cacheStats = {
  hits: 0,
  misses: 0,
  errors: 0,
};

export async function initializeCache(logger: Logger): Promise<void> {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
      password: process.env.REDIS_PASSWORD,
    });

    redisClient.on("error", (err) => {
      logger.error({ error: err }, "Redis client error");
    });

    redisClient.on("connect", () => {
      logger.info("Redis client connected");
    });

    await redisClient.connect();
    logger.info("Cache service initialized");
  } catch (error) {
    logger.error({ error }, "Failed to initialize cache service");
    // Continue without cache if Redis unavailable
  }
}

export class CacheService {
  constructor(private logger: Logger) {}

  async get(key: string): Promise<EvaluatorOutput | null> {
    if (!redisClient) return null;

    try {
      const cached = await redisClient.get(key);
      if (cached) {
        cacheStats.hits++;
        return JSON.parse(cached);
      }
      cacheStats.misses++;
      return null;
    } catch (error) {
      cacheStats.errors++;
      this.logger.error({ error, key }, "Cache get error");
      return null;
    }
  }

  async set(
    key: string,
    value: EvaluatorOutput,
    ttlSeconds: number
  ): Promise<boolean> {
    if (!redisClient) return false;

    try {
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      cacheStats.errors++;
      this.logger.error({ error, key }, "Cache set error");
      return false;
    }
  }

  async clear(): Promise<void> {
    if (!redisClient) return;

    try {
      await redisClient.flushDb();
      this.logger.info("Cache cleared");
    } catch (error) {
      this.logger.error({ error }, "Cache clear error");
    }
  }

  getStats() {
    const total = cacheStats.hits + cacheStats.misses;
    const hitRate = total > 0 ? (cacheStats.hits / total) * 100 : 0;

    return {
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      errors: cacheStats.errors,
      total,
      hitRate: hitRate.toFixed(2) + "%",
    };
  }

  resetStats(): void {
    cacheStats = {
      hits: 0,
      misses: 0,
      errors: 0,
    };
  }
}

let cacheServiceInstance: CacheService | null = null;

export function getCacheService(): CacheService {
  if (!cacheServiceInstance) {
    throw new Error("Cache service not initialized. Call initializeCache first.");
  }
  return cacheServiceInstance;
}

export function createCacheService(logger: Logger): CacheService {
  cacheServiceInstance = new CacheService(logger);
  return cacheServiceInstance;
}
