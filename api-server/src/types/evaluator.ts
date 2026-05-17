/**
 * Evaluator Agent Types
 * Quiz answer validation with intelligent feedback
 */

export interface QuestionContext {
  level: 1 | 2 | 3 | 4;
  topic: string;
  category: string;
  expectedKeywords?: string[];
}

export interface EvaluatorInput {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  questionContext: QuestionContext;
  options?: string[];
  metadata?: {
    userId: string;
    timestamp: number;
    attemptNumber: number;
  };
}

export interface RemedialsResource {
  type: "lesson" | "docs" | "example" | "practice";
  url: string;
  description: string;
}

export interface RemedialsInfo {
  gap: string;
  resources: RemedialsResource[];
  practiceHint: string;
}

export interface EvaluatorOutput {
  questionId: string;
  verdict: "correct" | "incorrect" | "partial" | "needs_review";
  confidence: number;
  explanation: string;
  sourceUrl?: string;
  keyPoints: string[];
  remedials?: RemedialsInfo;
  processingTimeMs: number;
}

export interface EvaluationCacheEntry {
  key: string;
  value: EvaluatorOutput;
  timestamp: number;
  ttl: number;
}
