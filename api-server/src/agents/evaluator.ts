/**
 * Evaluator Agent
 * Validates quiz answers against official sources with intelligent feedback
 */

import { getAnthropicClient } from "@utils/anthropic";
import {
  EvaluatorInput,
  EvaluatorOutput,
} from "@types/evaluator";

const EVALUATOR_SYSTEM_PROMPT = `You are Claude Code Mastery Evaluator Agent. Your role is to validate quiz answers against OFFICIAL SOURCES ONLY.

RULES:
1. VERIFY EVERY ANSWER against official documentation
   - Anthropic official docs (claude.ai, anthropic.com)
   - MCP Registry (modelcontextprotocol.io)
   - Official GitHub repos (@anthropic-ai)

2. PROVIDE EXPLANATION, not just pass/fail
   - Explain WHY the answer is correct/incorrect
   - Quote the official source (max 15 words)
   - Connect to curriculum learning objectives

3. SUGGEST REMEDIAL PATHS
   - If wrong: identify knowledge gap
   - Link to relevant lesson
   - Provide 1-2 practice tips

4. ZERO TOLERANCE for hallucinations
   - If source unclear: mark as "needs_review"
   - Never guess or invent documentation
   - Flag ambiguities for human review

OUTPUT: Respond with JSON only (no markdown):
{
  "verdict": "correct|incorrect|partial|needs_review",
  "confidence": 0.95,
  "explanation": "Why this answer is right/wrong",
  "source": "official docs URL or reference",
  "keyPoints": ["point1", "point2"],
  "remedials": {
    "gap": "Identified knowledge gap",
    "resources": [
      {"type": "lesson|docs|example|practice", "url": "...", "description": "..."}
    ],
    "practiceHint": "1-2 suggestions"
  }
}`;

export async function evaluateAnswer(
  input: EvaluatorInput
): Promise<EvaluatorOutput> {
  const startTime = Date.now();

  try {
    const client = getAnthropicClient();

    const userMessage = `
Evaluate this quiz answer:

QUESTION ID: ${input.questionId}
LEVEL: ${input.questionContext.level}
TOPIC: ${input.questionContext.topic}
CATEGORY: ${input.questionContext.category}

USER'S ANSWER: "${input.userAnswer}"
CORRECT ANSWER: "${input.correctAnswer}"
EXPECTED KEYWORDS: ${input.questionContext.expectedKeywords?.join(", ") || "None specified"}

${input.options ? `MULTIPLE CHOICE OPTIONS:\n${input.options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}` : ""}

Validate this answer and provide structured feedback.`;

    const response = await client.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 1024,
      system: EVALUATOR_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    // Extract text content from response
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in agent response");
    }

    // Parse JSON response
    let evaluatorResult;
    try {
      evaluatorResult = JSON.parse(textContent.text);
    } catch {
      // Fallback if JSON parsing fails
      evaluatorResult = {
        verdict: "needs_review",
        confidence: 0.5,
        explanation: textContent.text,
        keyPoints: [],
      };
    }

    const processingTimeMs = Date.now() - startTime;

    return {
      questionId: input.questionId,
      verdict: evaluatorResult.verdict || "needs_review",
      confidence: evaluatorResult.confidence || 0.5,
      explanation:
        evaluatorResult.explanation || "Unable to evaluate at this time",
      sourceUrl: evaluatorResult.source,
      keyPoints: evaluatorResult.keyPoints || [],
      remedials: evaluatorResult.remedials,
      processingTimeMs,
    };
  } catch (error) {
    const processingTimeMs = Date.now() - startTime;

    return {
      questionId: input.questionId,
      verdict: "needs_review",
      confidence: 0.0,
      explanation: `Evaluation error: ${error instanceof Error ? error.message : "Unknown error"}`,
      keyPoints: [],
      processingTimeMs,
    };
  }
}

/**
 * Validate input schema
 */
export function validateEvaluatorInput(input: unknown): input is EvaluatorInput {
  if (!input || typeof input !== "object") return false;

  const obj = input as Record<string, unknown>;

  return (
    typeof obj.questionId === "string" &&
    typeof obj.userAnswer === "string" &&
    typeof obj.correctAnswer === "string" &&
    obj.questionContext &&
    typeof obj.questionContext === "object" &&
    [1, 2, 3, 4].includes((obj.questionContext as any).level) &&
    typeof (obj.questionContext as any).topic === "string" &&
    typeof (obj.questionContext as any).category === "string"
  );
}
