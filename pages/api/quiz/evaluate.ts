/**
 * POST /api/quiz/evaluate
 * Evaluator Agent for intelligent quiz feedback
 * Next.js API Route
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

interface QuestionContext {
  level: 1 | 2 | 3 | 4;
  topic: string;
  category: string;
  expectedKeywords?: string[];
}

interface EvaluatorInput {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  questionContext: QuestionContext;
  options?: string[];
}

interface EvaluatorOutput {
  questionId: string;
  verdict: 'correct' | 'incorrect' | 'partial' | 'needs_review';
  confidence: number;
  explanation: string;
  sourceUrl?: string;
  keyPoints: string[];
  remedials?: {
    gap: string;
    resources: {
      type: 'lesson' | 'docs' | 'example' | 'practice';
      url: string;
      description: string;
    }[];
    practiceHint: string;
  };
  processingTimeMs: number;
}

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

OUTPUT: Respond with JSON only:
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EvaluatorOutput | { error: string }>
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const startTime = Date.now();
    const input = req.body as EvaluatorInput;

    // Validate input
    if (!input.questionId || !input.userAnswer || !input.correctAnswer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize Anthropic client
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Build user message
    const userMessage = `
Evaluate this quiz answer:

QUESTION ID: ${input.questionId}
LEVEL: ${input.questionContext.level}
TOPIC: ${input.questionContext.topic}
CATEGORY: ${input.questionContext.category}

USER'S ANSWER: "${input.userAnswer}"
CORRECT ANSWER: "${input.correctAnswer}"
EXPECTED KEYWORDS: ${input.questionContext.expectedKeywords?.join(', ') || 'None specified'}

${input.options ? `MULTIPLE CHOICE OPTIONS:\n${input.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}` : ''}

Validate this answer and provide structured feedback.`;

    // Call Claude API
    const response = await client.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1024,
      system: EVALUATOR_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    // Extract and parse response
    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in agent response');
    }

    let evaluatorResult;
    try {
      evaluatorResult = JSON.parse(textContent.text);
    } catch {
      evaluatorResult = {
        verdict: 'needs_review',
        confidence: 0.5,
        explanation: textContent.text,
        keyPoints: [],
      };
    }

    const processingTimeMs = Date.now() - startTime;

    const result: EvaluatorOutput = {
      questionId: input.questionId,
      verdict: evaluatorResult.verdict || 'needs_review',
      confidence: evaluatorResult.confidence || 0.5,
      explanation: evaluatorResult.explanation || 'Unable to evaluate',
      sourceUrl: evaluatorResult.source,
      keyPoints: evaluatorResult.keyPoints || [],
      remedials: evaluatorResult.remedials,
      processingTimeMs,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : 'Evaluation failed',
    });
  }
}
