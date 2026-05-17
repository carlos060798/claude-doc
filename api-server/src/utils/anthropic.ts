/**
 * Anthropic SDK Client Setup
 * Manages connection to Claude API with error handling
 */

import Anthropic from "@anthropic-ai/sdk";
import { Logger } from "pino";

let client: Anthropic | null = null;

export function initializeAnthropicClient(): Anthropic {
  if (client) return client;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY not set in environment variables"
    );
  }

  client = new Anthropic({
    apiKey,
    defaultHeaders: {
      "User-Agent": "claude-code-mastery-api/1.0",
    },
  });

  return client;
}

export function getAnthropicClient(): Anthropic {
  if (!client) {
    return initializeAnthropicClient();
  }
  return client;
}

/**
 * Verify API key is valid by making test call
 */
export async function verifyApiKey(logger: Logger): Promise<boolean> {
  try {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 10,
      messages: [
        {
          role: "user",
          content: "test",
        },
      ],
    });

    logger.info("Anthropic API key verified successfully");
    return true;
  } catch (error) {
    logger.error({ error }, "Failed to verify Anthropic API key");
    return false;
  }
}
