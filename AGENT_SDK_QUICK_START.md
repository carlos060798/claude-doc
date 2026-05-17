# Agent SDK Quick Start Guide
## Claude Code Mastery (FASE 7) — Implementation Fast-Track

**Purpose**: Get Evaluator Agent running in <3 hours  
**Target Audience**: Backend engineers starting Phase 1  
**Last Updated**: 2026-05-17

---

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Evaluator Agent Skeleton](#evaluator-agent-skeleton)
3. [API Endpoint](#api-endpoint)
4. [Testing Checklist](#testing-checklist)
5. [Troubleshooting](#troubleshooting)

---

## Environment Setup

### 1. Clone & Install

```bash
# Clone the main repo
cd ~/projects
git clone <repo-url> claude-code-mastery
cd claude-code-mastery

# Create api-server subdirectory
mkdir -p api-server
cd api-server

# Initialize Node.js project
npm init -y
npm install express zod dotenv @anthropic-ai/sdk
npm install --save-dev typescript @types/express @types/node ts-node
```

### 2. Create .env

```bash
# api-server/.env
ANTHROPIC_API_KEY=sk-...  # Get from https://console.anthropic.com
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/claude_mastery
REDIS_URL=redis://localhost:6379
```

### 3. Project Structure

```
api-server/
├── src/
│   ├── agents/
│   │   └── evaluator.ts          # ← You'll create this
│   ├── routes/
│   │   └── quiz.routes.ts        # ← You'll create this
│   └── main.ts                   # ← You'll create this
├── .env                          # ← You'll create this
├── package.json
├── tsconfig.json
└── README.md
```

### 4. TypeScript Config

```bash
# Create tsconfig.json
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
EOF
```

---

## Evaluator Agent Skeleton

### 1. Create src/agents/evaluator.ts

```typescript
// src/agents/evaluator.ts
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface EvaluatorInput {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  question: string;
  level: number;
  topic: string;
  category: string;
  options?: string[];
}

export interface EvaluatorOutput {
  questionId: string;
  verdict: "correct" | "incorrect" | "partial" | "needs_review";
  confidence: number;
  explanation: string;
  sourceUrl?: string;
  keyPoints: string[];
  remedial?: {
    gap: string;
    resources: Array<{
      type: "lesson" | "docs" | "example" | "practice";
      url: string;
      description: string;
    }>;
    practiceHint: string;
  };
  processingTimeMs: number;
}

const EVALUATOR_SYSTEM_PROMPT = `You are Claude Code Mastery Evaluator Agent. Your role is to validate quiz answers 
against OFFICIAL SOURCES ONLY.

RULES:
1. VERIFY EVERY ANSWER against official documentation
   - Anthropic official docs (claude.ai, anthropic.com)
   - MCP Registry (modelcontextprotocol.io)
   - Official GitHub repos (@anthropic-ai, @anthropics)
   
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

OUTPUT FORMAT (JSON):
{
  "verdict": "correct|incorrect|partial|needs_review",
  "confidence": 0.95,
  "explanation": "Why this answer is right/wrong",
  "sourceUrl": "official docs URL or reference",
  "keyPoints": ["key point 1", "key point 2"],
  "remedial": {
    "gap": "Identified knowledge gap",
    "resources": [{"type": "docs", "url": "...", "description": "..."}],
    "practiceHint": "Suggestion"
  }
}`;

export async function evaluateAnswer(
  input: EvaluatorInput
): Promise<EvaluatorOutput> {
  const startTime = Date.now();

  try {
    // Build context for Claude
    const contextPrompt = `
Question ID: ${input.questionId}
Level: ${input.level}
Topic: ${input.topic}
Category: ${input.category}

Question: ${input.question}

User's Answer: ${input.userAnswer}

Correct Answer: ${input.correctAnswer}

${input.options ? `Options: ${input.options.join(", ")}` : ""}

Please evaluate this answer. Output ONLY valid JSON.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: EVALUATOR_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: contextPrompt,
        },
      ],
    });

    // Parse response
    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const processingTime = Date.now() - startTime;

    return {
      questionId: input.questionId,
      verdict: parsed.verdict || "needs_review",
      confidence: parsed.confidence || 0.5,
      explanation:
        parsed.explanation || "Unable to evaluate this answer clearly.",
      sourceUrl: parsed.sourceUrl,
      keyPoints: parsed.keyPoints || [],
      remedial: parsed.remedial,
      processingTimeMs: processingTime,
    };
  } catch (error) {
    console.error("Evaluator error:", error);

    return {
      questionId: input.questionId,
      verdict: "needs_review",
      confidence: 0.0,
      explanation:
        "An error occurred during evaluation. Please try again later.",
      keyPoints: [],
      processingTimeMs: Date.now() - startTime,
    };
  }
}
```

### 2. Create src/routes/quiz.routes.ts

```typescript
// src/routes/quiz.routes.ts
import { Router, Request, Response } from "express";
import { z } from "zod";
import { evaluateAnswer } from "../agents/evaluator";

const router = Router();

// Input validation schema
const QuizSubmissionSchema = z.object({
  questionId: z.string().uuid(),
  userAnswer: z.string().min(1).max(10000),
  correctAnswer: z.string().min(1).max(10000),
  question: z.string().min(1).max(2000),
  level: z.number().int().min(1).max(4),
  topic: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  options: z.array(z.string()).optional(),
});

type QuizSubmission = z.infer<typeof QuizSubmissionSchema>;

/**
 * POST /api/quiz/evaluate
 *
 * Submit a quiz answer for evaluation
 */
router.post("/evaluate", async (req: Request, res: Response) => {
  try {
    // Validate input
    const validated = QuizSubmissionSchema.parse(req.body);

    // Call evaluator agent
    const result = await evaluateAnswer(validated);

    // Return result
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid input",
        details: error.errors,
      });
    }

    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;
```

### 3. Create src/main.ts

```typescript
// src/main.ts
import express from "express";
import "dotenv/config";
import quizRoutes from "./routes/quiz.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/quiz", quizRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
```

---

## API Endpoint

### Test the Evaluator

#### 1. Start the server

```bash
# Terminal 1: Start the server
cd api-server
npm install  # If not done yet
npx ts-node src/main.ts
# Output: Server running on http://localhost:3000
```

#### 2. Test with curl

```bash
# Terminal 2: Test the endpoint
curl -X POST http://localhost:3000/api/quiz/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "123e4567-e89b-12d3-a456-426614174000",
    "userAnswer": "/mcp add github sets up an MCP",
    "correctAnswer": "claude mcp add github -e GITHUB_TOKEN -- npx -y @modelcontextprotocol/server-github",
    "question": "How do you register a new MCP server in Claude Code CLI?",
    "level": 2,
    "topic": "MCP Commands",
    "category": "advanced",
    "options": [
      "Option A: /mcp add github",
      "Option B: claude mcp add github ...",
      "Option C: mcp register github",
      "Option D: claude register-mcp github"
    ]
  }'
```

#### 3. Expected response

```json
{
  "success": true,
  "data": {
    "questionId": "123e4567-e89b-12d3-a456-426614174000",
    "verdict": "incorrect",
    "confidence": 0.98,
    "explanation": "The slash command /mcp is for the Claude Code SPA interface only. In the CLI, you use 'claude mcp add'. Your answer conflates the two interfaces.",
    "sourceUrl": "https://modelcontextprotocol.io/docs/installation",
    "keyPoints": [
      "CLI uses 'claude mcp add' syntax",
      "SPA uses slash commands like '/mcp'",
      "Environment variables passed with -e flag"
    ],
    "remedial": {
      "gap": "CLI vs SPA command interfaces",
      "resources": [
        {
          "type": "docs",
          "url": "https://claude.ai/docs/claude-code",
          "description": "CLI commands reference"
        }
      ],
      "practiceHint": "Try: 'claude --help' to see CLI commands; compare with /help in SPA"
    },
    "processingTimeMs": 1247
  }
}
```

---

## Testing Checklist

### ✅ Phase 1 Testing

- [ ] **Server starts without errors**
  ```bash
  npx ts-node src/main.ts
  # Should print: Server running on http://localhost:3000
  ```

- [ ] **Health check works**
  ```bash
  curl http://localhost:3000/health
  # Should return: {"status":"ok"}
  ```

- [ ] **Evaluator responds to valid input**
  ```bash
  # See API Endpoint section above
  # Should return verdict + explanation
  ```

- [ ] **Evaluator validates input**
  ```bash
  curl -X POST http://localhost:3000/api/quiz/evaluate \
    -H "Content-Type: application/json" \
    -d '{"questionId": "invalid"}'
  # Should return 400 with validation errors
  ```

- [ ] **Evaluator handles errors gracefully**
  ```bash
  # Temporarily invalidate API key in .env
  npx ts-node src/main.ts
  # Should return: {"success":false,"error":"Internal server error"}
  # NOT a crash
  ```

### 📊 Sample Test Cases

**Test Case 1: Correct Answer**

```json
{
  "questionId": "550e8400-e29b-41d4-a716-446655440001",
  "userAnswer": "claude --version",
  "correctAnswer": "claude --version",
  "question": "What command shows your Claude Code CLI version?",
  "level": 1,
  "topic": "CLI Basics",
  "category": "installation"
}
```

Expected: `"verdict": "correct"`

---

**Test Case 2: Incorrect Answer**

```json
{
  "questionId": "550e8400-e29b-41d4-a716-446655440002",
  "userAnswer": "claude add mcp github",
  "correctAnswer": "claude mcp add github -e GITHUB_TOKEN -- npx -y @modelcontextprotocol/server-github",
  "question": "How do you add a GitHub MCP in the CLI?",
  "level": 2,
  "topic": "MCP Commands",
  "category": "advanced"
}
```

Expected: `"verdict": "incorrect", "confidence": 0.95+`

---

**Test Case 3: Partial Answer**

```json
{
  "questionId": "550e8400-e29b-41d4-a716-446655440003",
  "userAnswer": "claude mcp add github",
  "correctAnswer": "claude mcp add github -e GITHUB_TOKEN -- npx -y @modelcontextprotocol/server-github",
  "question": "How do you add a GitHub MCP in the CLI?",
  "level": 2,
  "topic": "MCP Commands",
  "category": "advanced"
}
```

Expected: `"verdict": "partial"` (command syntax correct, but missing environment flag)

---

## Troubleshooting

### Issue: "ANTHROPIC_API_KEY is not set"

**Solution**:

```bash
# Make sure .env has the key
cat api-server/.env | grep ANTHROPIC_API_KEY

# If missing, add it
echo "ANTHROPIC_API_KEY=sk-..." >> api-server/.env

# Reload environment
npx ts-node src/main.ts
```

---

### Issue: "Cannot find module '@anthropic-ai/sdk'"

**Solution**:

```bash
cd api-server
npm install @anthropic-ai/sdk
```

---

### Issue: Evaluator returns "needs_review" for all answers

**Possible causes**:

1. **API quota exceeded**: Check Anthropic console
2. **Invalid API key**: Verify in .env
3. **Prompt too aggressive**: Try different question type
4. **JSON parsing failed**: Check response format

**Debug**:

```typescript
// In src/agents/evaluator.ts, add logging
console.log("Raw response:", responseText);
console.log("JSON match:", jsonMatch);
```

---

### Issue: "uuid" validation error

**Solution**:

Make sure `questionId` is a valid UUID:

```bash
# Valid UUID examples:
550e8400-e29b-41d4-a716-446655440000
123e4567-e89b-12d3-a456-426614174000
```

---

## Next Steps

1. **Get Evaluator working** (this guide)
2. **Build evaluation endpoint** (this guide)
3. **Test 10 sample quizzes** (See Testing Checklist)
4. **Setup caching** (See AGENT_SDK_ARCHITECTURE_FASE7.md, Section 4B)
5. **Implement Coach Agent** (See AGENT_SDK_ARCHITECTURE_FASE7.md, Section 1B)

---

## Resources

- **Full Architecture**: See `AGENT_SDK_ARCHITECTURE_FASE7.md`
- **Agent API Reference**: https://docs.anthropic.com/
- **TypeScript Guide**: https://www.typescriptlang.org/docs/
- **Express Documentation**: https://expressjs.com/

---

**Need Help?**

1. Check troubleshooting section above
2. Review the failing test case in Testing Checklist
3. Check agent logs (added via `console.log`)
4. Reach out to the team with:
   - Error message
   - Test case used
   - Server logs (last 20 lines)
