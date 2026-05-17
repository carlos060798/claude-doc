# Agent SDK Integration Architecture (FASE 7)
## Claude Code Mastery — Future Roadmap

**Last Updated**: 2026-05-17  
**Status**: ✅ Design Complete — Ready for Implementation  
**Phase**: FASE 7 (Future Roadmap)

---

## Executive Summary

This document specifies a comprehensive Agent SDK integration architecture for Claude Code Mastery that enables intelligent, multi-agent learning orchestration. The system coordinates 5 specialized agents (Evaluator, Coach, Generator, Orchestrator, Validator) to provide real-time quiz evaluation, personalized learning coaching, adaptive question generation, and automated content validation.

**Key Metrics**:
- Expected completion rate increase: +40%
- User satisfaction improvement: +50%
- Time to proficiency reduction: -30%
- Agent latency target: <2s per query
- Uptime goal: >99.9%

---

# PART 1: AGENT SPECIFICATIONS

## 1A. EVALUATOR AGENT (High Priority) 🎯

### Purpose
Validates quiz answers with intelligent feedback, explaining **why** answers are correct/incorrect using official documentation as the source of truth.

### Responsibilities
- Check user answer against official sources (Anthropic docs, MCP registry, code)
- Provide nuanced feedback explaining misconceptions
- Generate teaching points from errors
- Suggest remedial resources

### System Prompt

```markdown
You are Claude Code Mastery Evaluator Agent. Your role is to validate quiz answers 
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
   - If source unclear: mark as "needs review"
   - Never guess or invent documentation
   - Flag ambiguities for human review

OUTPUT FORMAT:
{
  "verdict": "correct|incorrect|needs_review",
  "confidence": 0.95,
  "explanation": "Why this answer is right/wrong",
  "source": "official docs URL or reference",
  "remedial": {
    "gap": "Identified knowledge gap",
    "resource": "Link to lesson/doc",
    "practice": "1-2 suggestions"
  }
}
```

### Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `validateAnswer` | Core validation logic | {userAnswer, correctAnswer, questionContext} | {verdict, confidence, explanation} |
| `generateFeedback` | Explain answer to user | {verdict, explanation, level, topic} | {humanReadableFeedback, emoji_mood} |
| `suggestResources` | Find remedial content | {knowledgeGap, currentLevel} | [{resourceType, url, description}] |
| `checkOfficialDocs` | Verify answer against docs | {claimToVerify, category} | {verified, source, quote} |

### Input Schema

```typescript
interface EvaluatorInput {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  questionContext: {
    level: 1 | 2 | 3 | 4;
    topic: string;
    category: string;
    expectedKeywords?: string[];
  };
  options?: string[];  // Multiple choice options
  metadata?: {
    userId: string;
    timestamp: number;
    attemptNumber: number;
  };
}
```

### Output Schema

```typescript
interface EvaluatorOutput {
  questionId: string;
  verdict: "correct" | "incorrect" | "partial" | "needs_review";
  confidence: number;  // 0-1
  explanation: string;
  sourceUrl?: string;
  keyPoints: string[];
  remedial?: {
    gap: string;
    resources: {
      type: "lesson" | "docs" | "example" | "practice";
      url: string;
      description: string;
    }[];
    practiceHint: string;
  };
  processingTimeMs: number;
}
```

### Example Flow

```
Input:
{
  "questionId": "q-L2-mcp-001",
  "userAnswer": "/mcp add github sets up a new MCP connection",
  "correctAnswer": "claude mcp add github -e GITHUB_TOKEN -- npx -y @modelcontextprotocol/server-github",
  "questionContext": {
    "level": 2,
    "topic": "MCP Commands",
    "category": "advanced",
    "expectedKeywords": ["mcp add", "stdio", "environment", "server"]
  }
}

Agent Processing:
1. Check: Is "claude mcp add github" the correct syntax?
   → Verify in official MCP docs → YES, correct command
2. Check: Is "/mcp add" valid?
   → Search docs → NO, slash commands are SPA features, not CLI
3. Generate feedback explaining the distinction
4. Return verdict: incorrect (partial credit for recognizing MCP setup)

Output:
{
  "verdict": "incorrect",
  "confidence": 0.98,
  "explanation": "The slash command /mcp is for the Claude Code SPA interface only. 
    In the CLI, you use 'claude mcp add'. Your answer conflates the two interfaces.",
  "sourceUrl": "https://modelcontextprotocol.io/docs/installation",
  "remedial": {
    "gap": "CLI vs SPA command interfaces",
    "resources": [
      {
        "type": "docs",
        "url": "claude-code-mastery/#nivel-2-avanzado",
        "description": "CLI commands section"
      }
    ],
    "practiceHint": "Try: 'claude --help' to see CLI commands; compare with /help in SPA"
  }
}
```

### Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Response time | <1.5s | 80% of responses |
| Confidence accuracy | >95% | Validated manually quarterly |
| Source verification | 100% | Must cite official sources |
| User satisfaction | >4.5/5 | From feedback surveys |

---

## 1B. COACH AGENT (Medium Priority) 🏆

### Purpose
Analyzes learning progress and provides personalized, motivational coaching to help users stay on track and achieve mastery.

### Responsibilities
- Track progress across levels and topics
- Identify knowledge gaps and weak areas
- Recommend next learning steps
- Provide motivation and celebrate milestones
- Adapt recommendations to learning pace

### System Prompt

```markdown
You are Claude Code Mastery Coach Agent. Your role is to be a supportive, 
insightful learning coach that helps users succeed.

PRINCIPLES:
1. PERSONALIZATION
   - Know the user's current level, pace, strengths
   - Tailor recommendations to learning style
   - Celebrate progress genuinely

2. GAP IDENTIFICATION
   - Analyze quiz performance patterns
   - Identify topics with <70% accuracy
   - Suggest root cause (conceptual, syntax, practice)

3. MOTIVATION
   - Acknowledge effort and progress
   - Break down large goals into achievable steps
   - Use data-driven encouragement (e.g., "You've completed 60% of Level 2!")

4. ADAPTATION
   - Offer accelerated path if performing well
   - Suggest extra practice if struggling
   - Adjust based on user feedback

OUTPUT FORMAT:
{
  "status": "on_track|needs_support|accelerating|struggling",
  "progressSummary": "60% Level 2 complete, strong in MCP, needs work on Hooks",
  "recommendations": [
    {
      "action": "Complete next checkpoint",
      "reason": "Ready for challenge",
      "topic": "Advanced Hooks",
      "estimatedTime": "45 min"
    }
  ],
  "motivation": "You've mastered MCP! Your foundation is solid.",
  "nextMilestone": "Level 3 Expert unlock (3 lessons away)"
}
```

### Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `analyzeProgress` | Calculate overall progress metrics | {userId, allScores, completedQuizes} | {currentLevel, percentComplete, trends} |
| `identifyGaps` | Find weak topics | {allScores, quizHistory} | [{topic, accuracy%, recommendation}] |
| `recommendNextSteps` | Suggest next learning actions | {currentProgress, gaps, pace} | [{action, reason, estimatedTime}] |
| `generateMotivation` | Create personalized encouragement | {progress, achievements, struggles} | {message, tone, milestone} |

### Input Schema

```typescript
interface CoachInput {
  userId: string;
  currentLevel: number;
  completedQuizzes: {
    id: string;
    score: number;
    topic: string;
    timestamp: number;
  }[];
  quizHistory: {
    totalAttempts: number;
    averageScore: number;
    improvementTrend: number;  // -1 to +1
    streakDays: number;
  };
  preferences?: {
    pace: "slow" | "medium" | "fast";
    learningStyle: "conceptual" | "practical" | "balanced";
    focusAreas?: string[];
  };
}
```

### Output Schema

```typescript
interface CoachOutput {
  userId: string;
  status: "on_track" | "needs_support" | "accelerating" | "struggling";
  progressSummary: {
    currentLevel: number;
    percentComplete: number;
    strengths: string[];
    weaknesses: string[];
  };
  recommendations: {
    action: string;
    reason: string;
    topic?: string;
    estimatedTimeMin: number;
    priority: "high" | "medium" | "low";
  }[];
  motivation: {
    message: string;
    tone: "celebratory" | "encouraging" | "supportive" | "challenging";
    milestone?: string;
    progressBar: {
      current: number;
      total: number;
      percent: number;
    };
  };
  suggestedResources: {
    type: "lesson" | "practice" | "challenge" | "project";
    title: string;
    url: string;
    relevance: number;  // 0-1
  }[];
}
```

### Example Flow

```
Input:
{
  "userId": "user-42",
  "currentLevel": 2,
  "completedQuizzes": [
    { "id": "q-L2-mcp-001", "score": 95, "topic": "MCP add", "timestamp": ... },
    { "id": "q-L2-mcp-002", "score": 85, "topic": "MCP get", "timestamp": ... },
    { "id": "q-L2-hooks-001", "score": 45, "topic": "Git hooks", "timestamp": ... },
    { "id": "q-L2-hooks-002", "score": 50, "topic": "Hooks config", "timestamp": ... }
  ],
  "quizHistory": {
    "totalAttempts": 8,
    "averageScore": 68,
    "improvementTrend": 0.12,
    "streakDays": 5
  },
  "preferences": { "pace": "medium", "learningStyle": "practical" }
}

Agent Processing:
1. Analyze: 90% average on MCP, 47% average on Hooks
2. Identify gap: User struggles with Git hooks (conceptual)
3. Note: User is improving (+12% trend), good streak
4. Recommend: Extra practice on hooks + MCP challenge
5. Motivation: Celebrate MCP mastery, encourage hooks focus

Output:
{
  "status": "on_track",
  "progressSummary": {
    "currentLevel": 2,
    "percentComplete": 55,
    "strengths": ["MCP commands", "CLI navigation"],
    "weaknesses": ["Git hooks integration", "Hook event lifecycle"]
  },
  "recommendations": [
    {
      "action": "Complete 2x Git hooks practice quiz",
      "reason": "Only 47% accuracy; needs reinforcement",
      "topic": "Git Hooks",
      "estimatedTimeMin": 30,
      "priority": "high"
    },
    {
      "action": "Take MCP advanced challenge",
      "reason": "Master-level performance on MCP topics",
      "topic": "Advanced MCP",
      "estimatedTimeMin": 45,
      "priority": "medium"
    }
  ],
  "motivation": {
    "message": "Impressive MCP mastery! Your 90% average shows real understanding. 
      Now let's strengthen your hooks foundation.",
    "tone": "encouraging",
    "milestone": "3 more lessons until Level 3 Expert unlock!",
    "progressBar": { "current": 55, "total": 100, "percent": 55 }
  }
}
```

### Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Recommendation relevance | >85% | User finds suggestions helpful |
| Motivation impact | +30% engagement | Measured by continued activity |
| Gap identification accuracy | >90% | Cross-validated with quiz performance |

---

## 1C. GENERATOR AGENT (Medium Priority) ⚡

### Purpose
Creates adaptive practice questions based on user errors, generating variations and new content to reinforce weak areas and prevent memorization.

### Responsibilities
- Analyze failed quiz answers to understand error patterns
- Generate 3 similar questions testing the same concept
- Create variations (multiple choice, open-ended, scenario-based)
- Validate generated questions against official sources
- Track generated questions for analytics

### System Prompt

```markdown
You are Claude Code Mastery Generator Agent. Your role is to create high-quality, 
validated practice questions that reinforce learning.

RULES FOR QUESTION GENERATION:
1. ANALYZE WRONG ANSWER
   - Identify the misconception (e.g., confusing CLI vs SPA)
   - Understand the knowledge gap
   - Plan 3 variations targeting different angles

2. CREATE 3 VARIATIONS
   - Question 1: Similar scenario, different command
   - Question 2: Slightly harder (add a complexity)
   - Question 3: Scenario-based (real-world context)

3. VALIDATE AGAINST SOURCES
   - Check correct answers in official docs
   - Verify examples are executable
   - Ensure no hallucinations

4. METADATA
   - Link to original failed question
   - Tag with difficulty level
   - Include learning objectives

OUTPUT FORMAT:
{
  "generatedQuestions": [
    {
      "id": "gen-q-{uuid}",
      "original_question_id": "q-L2-mcp-002",
      "type": "multiple_choice|open_ended|scenario",
      "difficulty": "easy|medium|hard",
      "question": "...",
      "options": ["A", "B", "C", "D"],  // if multiple_choice
      "correctAnswer": "...",
      "explanation": "Official docs say...",
      "sourceUrl": "...",
      "learningObjective": "Distinguish CLI vs SPA commands"
    }
  ],
  "targetedGap": "Confusing slash commands with CLI syntax",
  "rationale": "Generated to specifically address the misconception"
}
```

### Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `analyzeWrongAnswer` | Understand error pattern | {failedQuestion, userAnswer, correctAnswer} | {misconception, gap, complexity} |
| `generateVariations` | Create 3 similar questions | {misconception, topic, level} | [{question, options, correctAnswer}] |
| `validateAgainstDocs` | Verify generated content | {generatedQuestions} | [{valid: bool, sourceUrl?, issues?}] |
| `trackGeneratedQuestions` | Store for analytics | {generatedQuestions, userId} | {trackingId, status} |

### Input Schema

```typescript
interface GeneratorInput {
  failedQuestionId: string;
  userAnswer: string;
  correctAnswer: string;
  questionData: {
    question: string;
    options?: string[];
    level: number;
    topic: string;
    category: string;
  };
  userId: string;
  metadata?: {
    attemptNumber: number;
    confidenceOnAttempt: number;
  };
}
```

### Output Schema

```typescript
interface GeneratorOutput {
  sourceQuestionId: string;
  targetedGap: string;
  rationale: string;
  generatedQuestions: {
    id: string;
    type: "multiple_choice" | "open_ended" | "scenario" | "code_challenge";
    difficulty: "easy" | "medium" | "hard";
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    sourceUrl: string;
    learningObjective: string;
    estimatedTimeMin: number;
  }[];
  validationStatus: {
    allValid: boolean;
    issues?: string[];
  };
}
```

### Example Flow

```
Input:
{
  "failedQuestionId": "q-L2-mcp-002",
  "userAnswer": "/mcp add github sets up MCP",
  "correctAnswer": "claude mcp add github -e GITHUB_TOKEN -- npx -y ...",
  "questionData": {
    "question": "How do you register a new MCP server in Claude Code CLI?",
    "level": 2,
    "topic": "MCP Commands",
    "category": "CLI"
  }
}

Agent Processing:
1. Analyze: User confused slash commands (SPA) with CLI syntax
2. Gap: Doesn't understand CLI vs SPA interface distinction
3. Generate 3 questions:
   - Q1: "What's the difference between /mcp and claude mcp?"
   - Q2: "Register an MCP with environment variables (harder)"
   - Q3: "Real scenario: You need GitHub access in a project"

Validation:
4. Check: All commands verified against official docs
5. Check: All explanations cite sources

Output:
{
  "targetedGap": "Confusing slash commands (SPA) with CLI commands",
  "rationale": "User showed misconception about interface boundaries",
  "generatedQuestions": [
    {
      "id": "gen-q-uuid-1",
      "type": "multiple_choice",
      "difficulty": "easy",
      "question": "Which interface uses slash commands like /mcp add?",
      "options": [
        "A) Claude Code CLI",
        "B) Claude Code SPA web app",
        "C) Both",
        "D) Neither"
      ],
      "correctAnswer": "B",
      "explanation": "Slash commands are SPA features. CLI uses 'claude mcp add'.",
      "sourceUrl": "https://claude.ai/docs/claude-code",
      "learningObjective": "Distinguish CLI vs SPA interfaces"
    },
    // ... Q2, Q3 follow
  ]
}
```

### Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Question quality | >4.0/5 | User ratings on generated questions |
| Validation accuracy | 100% | All generated answers verified |
| Gap relevance | >85% | Questions address actual misconception |
| Time to generate | <3s | Per question set (3 questions) |

---

## 1D. ORCHESTRATOR AGENT (High Priority) 🎼

### Purpose
Coordinates all 3 agents (Evaluator, Coach, Generator) in parallel, merges results intelligently, and returns a unified learning response with evaluation, personalized coaching, and adaptive questions.

### Responsibilities
- Route quiz submission to appropriate agents
- Coordinate parallel execution (E + C + G)
- Merge results into coherent response
- Handle failures gracefully (fallback to static data)
- Track performance metrics across agents

### System Prompt

```markdown
You are Claude Code Mastery Orchestrator Agent. Your role is to coordinate 
evaluation, coaching, and question generation into a seamless learning experience.

ORCHESTRATION FLOW:
1. RECEIVE quiz submission with metadata
2. VALIDATE input (quiz exists, answer format valid)
3. SPAWN PARALLEL TASKS:
   - Task A: Call Evaluator Agent (validate answer)
   - Task B: Call Coach Agent (analyze progress)
   - Task C: Call Generator Agent (create practice questions)
4. WAIT for all tasks (timeout: 8s total, 2.5s per agent)
5. MERGE RESULTS:
   - Combine evaluation with coaching context
   - Include generated questions only if answer incorrect
   - Prioritize recommendations by impact
6. RETURN unified response

ERROR HANDLING:
- If Evaluator fails: Return static evaluation + mark for review
- If Coach fails: Omit coaching section
- If Generator fails: Skip practice questions
- Log all failures for monitoring

OUTPUT FORMAT:
{
  "evaluation": { ... from Evaluator },
  "coaching": { ... from Coach },
  "practice": {
    "generatedQuestions": [ ... from Generator ],
    "ifIncluded": "Only if answer incorrect OR user requested practice"
  },
  "orchestration": {
    "totalTimeMs": 1850,
    "agentResults": {
      "evaluator": { "status": "success", "timeMs": 1200 },
      "coach": { "status": "success", "timeMs": 450 },
      "generator": { "status": "success", "timeMs": 600 }
    }
  }
}
```

### Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `callEvaluator` | Invoke Evaluator Agent | {quizSubmission} | {evaluation, timeMs} |
| `callCoach` | Invoke Coach Agent | {userId, progress} | {coaching, timeMs} |
| `callGenerator` | Invoke Generator Agent | {failedQuestion, if answer incorrect} | {practiceQuestions, timeMs} |
| `mergeResults` | Combine agent outputs | {evaluation, coaching, practice} | {unifiedResponse} |
| `handleTimeout` | Fallback if agent slow | {agentName, fallbackData} | {fallbackResponse} |

### Input Schema

```typescript
interface OrchestratorInput {
  quizSubmission: {
    questionId: string;
    userAnswer: string;
    userId: string;
    timestamp: number;
  };
  questionData: {
    question: string;
    correctAnswer: string;
    level: number;
    topic: string;
    category: string;
    options?: string[];
  };
  userProgress?: {
    completedQuizzes: number;
    averageScore: number;
    currentLevel: number;
  };
  config?: {
    includeCoaching: boolean;
    includeGeneratedQuestions: boolean;
    generateOnlyOnWrong: boolean;
    timeoutMs: number;
  };
}
```

### Output Schema

```typescript
interface OrchestratorOutput {
  quizSubmissionId: string;
  evaluation: EvaluatorOutput;
  coaching?: CoachOutput;
  practice?: {
    generatedQuestions: GeneratorOutput["generatedQuestions"];
    reason: "answer_incorrect" | "requested" | "remedial";
  };
  orchestration: {
    totalTimeMs: number;
    coordinatedAt: string;
    agentResults: {
      evaluator: { status: "success" | "timeout" | "error"; timeMs: number };
      coach: { status: "success" | "timeout" | "error" | "skipped"; timeMs: number };
      generator: { status: "success" | "timeout" | "error" | "skipped"; timeMs: number };
    };
    warnings?: string[];
  };
}
```

### Example Flow

```
Timeline:
T=0ms: Receive quiz submission
  {
    questionId: "q-L2-mcp-002",
    userAnswer: "/mcp add github sets up MCP",
    userId: "user-42"
  }

T=5ms: Spawn parallel tasks
  Task A: → Evaluator Agent
  Task B: → Coach Agent  
  Task C: → Generator Agent (conditional on answer incorrect)

T=600ms: Evaluator returns {verdict: "incorrect", confidence: 0.98, ...}
  → Coach priority increases (needs motivation)
  → Generator spawned (answer was wrong)

T=1050ms: Coach returns {status: "on_track", recommendations: [...], ...}

T=1700ms: Generator returns {generatedQuestions: [...], ...}

T=1850ms: Orchestrator merges results
  - Evaluation: Clear explanation of why wrong
  - Coaching: Encouragement + next steps (hook practice)
  - Practice: 3 generated questions on CLI vs SPA
  
T=1850ms: Return unified response

Output:
{
  "evaluation": {
    "verdict": "incorrect",
    "explanation": "The slash command /mcp is for the SPA interface. 
      The CLI uses 'claude mcp add'.",
    "sourceUrl": "https://...",
    "remedial": { ... }
  },
  "coaching": {
    "status": "on_track",
    "recommendations": [
      {
        "action": "Complete 2x Git hooks practice",
        "priority": "high"
      }
    ]
  },
  "practice": {
    "generatedQuestions": [
      { "id": "gen-q-1", "question": "...", "type": "multiple_choice" },
      { "id": "gen-q-2", "question": "...", "type": "scenario" },
      { "id": "gen-q-3", "question": "...", "type": "code_challenge" }
    ]
  },
  "orchestration": {
    "totalTimeMs": 1850,
    "agentResults": {
      "evaluator": { "status": "success", "timeMs": 600 },
      "coach": { "status": "success", "timeMs": 450 },
      "generator": { "status": "success", "timeMs": 600 }
    }
  }
}
```

### Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Total response time | <2s | P90 latency |
| Agent timeout rate | <2% | If any agent slow |
| Merge error rate | <0.1% | Fallback mechanisms tested |
| User perception | >4.2/5 | From satisfaction surveys |

---

## 1E. VALIDATOR AGENT (Low Priority) 🔍

### Purpose
Ensures all curriculum content (commands, examples, quiz questions, generated content) validates against official Anthropic documentation and MCP registry in an automated CI/CD pipeline.

### Responsibilities
- Validate all quiz questions against official sources
- Check command syntax and examples
- Verify links are live and accurate
- Audit generated questions for hallucinations
- Run on CI/CD before content deployment
- Generate validation reports

### System Prompt

```markdown
You are Claude Code Mastery Validator Agent. Your role is to ensure zero 
hallucinations and 100% accuracy in curriculum content.

VALIDATION RULES:
1. OFFICIAL SOURCES ONLY
   ✅ Anthropic official docs (claude.ai, anthropic.com)
   ✅ MCP Registry (modelcontextprotocol.io)
   ✅ Official GitHub repos
   ❌ Blogs, videos, unofficial sources

2. COMMAND VALIDATION
   - Syntax must exist in official docs
   - Examples must be executable
   - Flags/options must be current
   - Error: Flag deprecated? Mark as ⚠️ Needs Review

3. LINK VALIDATION
   - Check all docUrls are live (HTTP 200)
   - Verify links point to correct section
   - Track redirect chains

4. CONTENT AUDIT
   - Scan quiz questions for unverified claims
   - Check generated questions for hallucinations
   - Verify all quotes are accurate (max 15 words)

5. REPORT GENERATION
   - ✅ Valid: Proceed to deploy
   - ⚠️ Needs Review: Flag for human validation
   - ❌ Invalid: Block deployment

OUTPUT FORMAT:
{
  "validationResult": "pass|needs_review|fail",
  "contentCount": {
    "quizzes": 12,
    "commands": 39,
    "links": 150,
    "examples": 45
  },
  "issues": [
    {
      "severity": "critical|warning|info",
      "type": "invalid_command|broken_link|unverified_claim",
      "content": "...",
      "location": "file:line",
      "remediation": "..."
    }
  ],
  "checksums": {
    "curriculum.json": "sha256:abc123...",
    "quiz.json": "sha256:def456...",
    "commands.json": "sha256:ghi789..."
  }
}
```

### Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `fetchOfficialDocs` | Get current docs from sources | {docUrl, topic} | {content, lastModified, source} |
| `validateCommand` | Check command syntax/flags | {command, expectedFlags} | {valid: bool, source, lastVerified} |
| `searchMCPRegistry` | Query MCP Registry for info | {mcpName, version} | {registered: bool, details, source} |
| `auditQuizContent` | Scan questions for issues | {allQuizzes} | [{questionId, issues}] |
| `generateValidationReport` | Create summary report | {allValidationResults} | {reportHtml, checksums, timestamp} |

### Input Schema

```typescript
interface ValidatorInput {
  contentType: "quizzes" | "commands" | "generated_questions" | "all";
  contentData: {
    quizzes?: Quiz[];
    commands?: Command[];
    generatedQuestions?: Question[];
    links?: string[];
  };
  config?: {
    checkLinks: boolean;
    verifyExamples: boolean;
    validateTimestamps: boolean;
  };
}
```

### Output Schema

```typescript
interface ValidatorOutput {
  validationResult: "pass" | "needs_review" | "fail";
  timestamp: string;
  contentCount: {
    [key: string]: number;  // Count of each content type
  };
  issues: {
    severity: "critical" | "warning" | "info";
    type: string;
    content: string;
    location: string;
    remediation: string;
    sourceUrl?: string;
  }[];
  checksums: {
    [filename: string]: string;  // sha256 hash
  };
  summary: {
    totalChecked: number;
    validCount: number;
    reviewCount: number;
    failCount: number;
    passRate: number;  // 0-1
  };
  reportUrl?: string;
  nextSteps: string[];
}
```

### Example Flow

```
Input:
{
  "contentType": "quizzes",
  "contentData": {
    "quizzes": [
      {
        "id": "q-L2-mcp-001",
        "question": "How do you add a GitHub MCP?",
        "correctAnswer": "claude mcp add github -e GITHUB_TOKEN -- ...",
        "topic": "MCP Commands"
      },
      ...
    ]
  }
}

Agent Processing:
1. For each quiz question:
   - Extract claims (e.g., "claude mcp add" syntax)
   - Search official docs for verification
   - Check examples are executable
   - Verify links are live

2. Audit quiz question q-L2-mcp-001:
   - Claim: "claude mcp add github -e GITHUB_TOKEN -- ..."
   - Search: MCP docs → Found: Command is official ✅
   - Check: Flag "-e" → Verified in docs ✅
   - Verify: Example is complete ✅

3. Scan generated questions:
   - "gen-q-uuid-1": "Which interface uses /mcp?"
   - Verify: SPA indeed uses slash commands ✅
   - Source: Official Claude Code docs ✅

4. Generate report:
   - Total checked: 12 quizzes
   - Valid: 11
   - Needs review: 1 (deprecated hook event name)
   - Failed: 0

Output:
{
  "validationResult": "needs_review",
  "contentCount": {
    "quizzes": 12,
    "claims": 45,
    "links": 150
  },
  "issues": [
    {
      "severity": "warning",
      "type": "deprecated_api",
      "content": "Hook event 'on-command-submit' - deprecated in v2.1",
      "location": "q-L3-hooks-005",
      "remediation": "Update to 'on-command-execution'"
    }
  ],
  "checksums": {
    "quizzes.json": "sha256:abc123def456...",
    "curriculum.json": "sha256:xyz789..."
  },
  "summary": {
    "totalChecked": 12,
    "validCount": 11,
    "reviewCount": 1,
    "failCount": 0,
    "passRate": 0.917
  },
  "nextSteps": [
    "Review issue in q-L3-hooks-005",
    "Update hook event name to 'on-command-execution'",
    "Re-run validation",
    "Approve for deployment"
  ]
}
```

### Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Content coverage | 100% | All quizzes, commands, links checked |
| False positive rate | <1% | Minimize review burden |
| Hallucination detection | 100% | Never miss unverified claims |
| CI/CD integration | Pre-deploy | Automated before content push |

---

# PART 2: ARCHITECTURE DIAGRAM

## 2A. System Architecture Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                        CLAUDE CODE MASTERY                         │
│                    Agent SDK Integration (FASE 7)                  │
└────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐
│   USER INTERFACE        │
│  (React SPA Frontend)   │
│  - Quiz Component       │
│  - Progress Dashboard   │
│  - Practice Section     │
└────────────┬────────────┘
             │
             │ (HTTP POST /api/quiz-submit)
             ↓
┌──────────────────────────────────────────────────────────────────────┐
│              BACKEND API (Node.js/Express)                           │
│  - Endpoint: POST /api/agents/orchestrate                            │
│  - Rate limiting: 10 evals/day free, higher for premium              │
│  - Auth: API key (server-side only, never exposed to client)         │
│  - Request validation: Input sanitization, schema validation         │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                 ┌───────────┼───────────┐
                 │           │           │
                 ↓           ↓           ↓
        ┌──────────────────────────────────┐
        │   ORCHESTRATOR AGENT             │
        │  - Route & coordinate            │
        │  - Parallel task spawning        │
        │  - Result merging                │
        │  - Error handling & fallback     │
        └────┬────────────────┬────────────┘
             │                │
    ┌────────┴────┬───────────┴──────┬───────────┐
    ↓             ↓                   ↓           ↓
┌─────────┐  ┌──────────┐      ┌──────────┐  ┌────────────┐
│EVALUATOR│  │  COACH   │      │GENERATOR │  │ VALIDATOR  │
│ Agent   │  │  Agent   │      │  Agent   │  │  Agent (CI)│
│         │  │          │      │          │  │            │
│ ✓ Verify│  │ ✓ Analyze│      │ ✓ Create │  │✓ Validate  │
│ ✓ Explain│ │Progress  │      │Practice  │  │✓ Audit     │
│         │  │ ✓ Recommend      │ ✓ Verify │  │✓ Report    │
└────┬────┘  └────┬─────┘      └────┬─────┘  └────────────┘
     │            │                 │
     │            │        (only if answer wrong)
     └────────────┴─────────────────┘
               │
               ↓
        ┌─────────────────┐
        │ RESULT MERGER   │
        │ - Combine outputs
        │ - Order by priority
        │ - Format response
        └────────┬────────┘
                 │
                 ↓
        ┌────────────────────┐
        │  RESPONSE BUILDER  │
        │ - Serialize JSON   │
        │ - Add metadata     │
        │ - Cache headers    │
        └────────┬───────────┘
                 │
                 ↓ (HTTP 200 JSON)
        ┌────────────────────────┐
        │   FRONTEND RECEIVES    │
        │ - Evaluation + feedback │
        │ - Coaching guidance    │
        │ - Generated questions  │
        │ - Progress update      │
        └────────────────────────┘
```

## 2B. Agent Coordination Flow (Parallel Execution)

```
User Submits Quiz Answer
        │
        ↓
┌───────────────────────────────────────┐
│ 1. VALIDATE INPUT (100ms)             │
│    - Check format                     │
│    - Sanitize data                    │
│    - Load question context            │
└───────────┬─────────────────────────┬─┘
            │                         │
    ┌───────┴──────┐          ┌──────────────┐
    │ Answer wrong?│          │Log submission│
    └───────┬──────┘          └──────────────┘
            │
        ┌───┴────────────────────────────────┐
        │ YES → Spawn Generator               │
        │ NO → Skip Generator                 │
        └───┬────────────────────────────────┘
            │
T=0ms   ┌───┴─────────────────────────────────────────┐
        │ 2. SPAWN PARALLEL AGENTS (T=0-5ms)          │
        └───┬────────────┬────────────┬───────────────┘
            │            │            │
    T=0ms   │            │            │
        ┌───┴──┐    ┌────┴──┐  ┌──────┴───┐
        │  E   │    │  C    │  │  G (*)   │
        │      │    │       │  │          │
        └───┬──┘    └────┬──┘  └──────┬───┘
            │            │            │
T=600ms ┌───┴──────┐    │            │
        │  Results:│    │            │
        │ - Verdict    │            │
        │ - Confidence │            │
        │ - Feedback   │    │        │
        └───┬──────┘    │ (waiting)  │
            │           │            │
    (continue)     T=1050ms      T=1700ms
                    │            │
                ┌───┴──┐     ┌───┴──┐
                │ Coach│     │ Gen  │
                │ done │     │ done │
                └───┬──┘     └───┬──┘
                    │            │
        T=1850ms    └────┬───────┘
                         │
                    ┌────┴──────────────────┐
                    │ 3. MERGE RESULTS      │
                    │ - Combine evaluations │
                    │ - Reorder by priority │
                    │ - Include practice (?) │
                    └────┬─────────────────┘
                         │
                    ┌────┴──────────────┐
                    │ 4. BUILD RESPONSE │
                    │ - Serialize JSON  │
                    │ - Add timestamps  │
                    │ - Cache metadata  │
                    └────┬──────────────┘
                         │
                    ┌────┴─────────────┐
                    │ 5. SEND TO CLIENT│
                    │ (< 2s elapsed)   │
                    └──────────────────┘

TIMEOUT HANDLING:
- Evaluator: 2500ms max (critical path)
- Coach: 2000ms max (optional)
- Generator: 2000ms max (optional)
- Total: 8000ms hard timeout

If Evaluator times out: Return static evaluation + flag
If Coach times out: Omit coaching section
If Generator times out: Skip practice questions
```

## 2C. Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                      CLIENT-SIDE (React)                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Quiz Component                                             │ │
│  │ - Displays question                                        │ │
│  │ - Captures user answer                                     │ │
│  │ - Shows loading spinner during evaluation                 │ │
│  └────────┬─────────────────────────────────────────────────┬─┘ │
│           │ Submits {questionId, userAnswer}               │    │
│           ↓                                                  ↓    │
│  ┌────────────────────┐                         ┌──────────────┐ │
│  │ Quiz Service       │ ──→ API Call ──→        │ Network Req  │ │
│  │ - Validation       │                         │              │ │
│  │ - Loading state    │                         └──────┬───────┘ │
│  │ - Error handling   │                                │          │
│  └────────────────────┘                                ↓          │
│                                                  (Pending...)     │
│           ↑                                                       │
│           │ Response: {evaluation, coaching, practice}           │
│           │                                                       │
│  ┌────────┴──────────────────────────────────────────────────┐  │
│  │ Result Display Component                                 │  │
│  │ ┌──────────────────────────────────────────────────────┐ │  │
│  │ │ Evaluation Card: ✓/✗ + Explanation + Resources     │ │  │
│  │ ├──────────────────────────────────────────────────────┤ │  │
│  │ │ Coaching Card: "You're on track! Next steps..."    │ │  │
│  │ ├──────────────────────────────────────────────────────┤ │  │
│  │ │ Practice Cards: "Try these 3 similar questions"    │ │  │
│  │ └──────────────────────────────────────────────────────┘ │  │
│  │                                                           │  │
│  │ Updates:                                                 │  │
│  │ - localStorage: progress, scores, streak               │  │
│  │ - Context state: currentLevel, unlocked features       │  │
│  │ - Analytics: track quiz performance, engagement       │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      SERVER-SIDE (Node.js)                       │
│                                                                  │
│  POST /api/agents/orchestrate                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 1. Input Processing                                       │ │
│  │   - Validate JWT/API key                                  │ │
│  │   - Sanitize user input (no injection attacks)           │ │
│  │   - Rate limit check (user ID, IP)                       │ │
│  │   - Load question from DB                                │ │
│  └────────────┬──────────────────────────────────────────────┤ │
│               ↓                                               │ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 2. Orchestrator Agent Execution                          │ │
│  │   - Fork 3 parallel processes:                           │ │
│  │     * Evaluator (max 2500ms)                             │ │
│  │     * Coach (max 2000ms)                                 │ │
│  │     * Generator (max 2000ms, if answer wrong)            │ │
│  │   - Collect results as they complete                     │ │
│  │   - Implement timeouts with fallbacks                    │ │
│  └────────────┬──────────────────────────────────────────────┤ │
│               ↓                                               │ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 3. Agent Calls to Claude API                            │ │
│  │                                                           │ │
│  │   Evaluator Request:                                     │ │
│  │   {                                                      │ │
│  │     "system": "You are evaluator agent...",            │ │
│  │     "messages": [{"role": "user",                       │ │
│  │       "content": "{userAnswer, correctAnswer, ...}"}]  │ │
│  │   }                                                      │ │
│  │                                                           │ │
│  │   Coach Request: Similar with coach system prompt       │ │
│  │   Generator Request: Similar with generator prompt      │ │
│  │                                                           │ │
│  │   [Similar for Coach and Generator]                     │ │
│  └────────────┬──────────────────────────────────────────────┤ │
│               ↓                                               │ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 4. Caching Layer                                         │ │
│  │   - Cache key: hash(questionId + userAnswer)            │ │
│  │   - TTL: 24 hours                                        │ │
│  │   - Hit rate: ~40% (reduces API calls)                  │ │
│  │   - Redis/in-memory store                               │ │
│  └────────────┬──────────────────────────────────────────────┤ │
│               ↓                                               │ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 5. Result Merging & DB Storage                          │ │
│  │   - Merge 3 agent outputs into unified response         │ │
│  │   - Store submission: {userId, questionId, verdict...}  │ │
│  │   - Update user stats: {score, progress, streak}        │ │
│  │   - Log agent metrics: {latency, cost, confidence}      │ │
│  └────────────┬──────────────────────────────────────────────┤ │
│               ↓                                               │ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 6. Response Serialization                               │ │
│  │   - Format: {evaluation, coaching, practice, meta}      │ │
│  │   - Add timestamps, request IDs for tracking            │ │
│  │   - Set cache headers (client-side caching)             │ │
│  └────────────┬──────────────────────────────────────────────┤ │
│               ↓                                               │ │
│  HTTP 200 JSON Response                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    MONITORING & ANALYTICS                        │
│                                                                  │
│  - Agent latency (per agent, per request)                       │
│  - Cache hit rate (reduce API calls)                            │
│  - Error rates (timeouts, failures)                             │
│  - User satisfaction (quiz completion, rating)                 │
│  - Cost tracking (tokens per evaluation)                        │
│  - Performance trends (dashboards)                              │
└──────────────────────────────────────────────────────────────────┘
```

---

# PART 3: IMPLEMENTATION ROADMAP

## 3A. Phased Implementation (4 Weeks)

### PHASE 1: Setup & Evaluator Agent (Week 1)

**Week 1 Objectives**:
- Setup Agent SDK environment
- Implement Evaluator Agent
- Build API endpoint
- Achieve 95%+ accuracy on Evaluator responses

**Deliverables**:

| Task | Effort | Owner | Dependencies |
|------|--------|-------|--------------|
| 1.1 Setup Node.js backend + Express server | 2d | Backend | Environment |
| 1.2 Implement Agent SDK integration | 2d | Backend | Node.js |
| 1.3 Build Evaluator Agent system prompt | 1d | AI/Product | Agent SDK |
| 1.4 Create quiz evaluation endpoint | 1.5d | Backend | Evaluator Agent |
| 1.5 Implement input validation & sanitization | 1d | Backend | API design |
| 1.6 Build caching layer (Redis/in-memory) | 1.5d | Backend | API endpoint |
| 1.7 Write unit tests (Evaluator) | 1d | QA | Evaluator Agent |
| 1.8 Manual validation (sample quizzes) | 1d | QA | Tests |

**Success Metrics**:
- ✅ Evaluator Agent responds in <1.5s
- ✅ 95%+ accuracy on 100 manual test cases
- ✅ 0 hallucinations detected (validated manually)
- ✅ API handles 50+ concurrent requests

**Testing Checklist**:
- [ ] Unit tests for evaluator prompt
- [ ] Integration tests for API endpoint
- [ ] Load test (50 concurrent requests)
- [ ] Manual validation (10 different question types)
- [ ] Error handling (invalid inputs, timeouts)

**Risk Mitigation**:
- Risk: Evaluator accuracy low
  - Mitigation: Start with simpler questions, iterate on prompt
- Risk: API performance degradation
  - Mitigation: Implement caching early, load test

---

### PHASE 2: Coach Agent + Integration (Week 2)

**Week 2 Objectives**:
- Implement Coach Agent
- Integrate Evaluator + Coach
- Build progress analytics backend
- Achieve 85%+ recommendation relevance

**Deliverables**:

| Task | Effort | Owner | Dependencies |
|------|--------|-------|--------------|
| 2.1 Build Coach Agent system prompt | 1d | AI/Product | Phase 1 complete |
| 2.2 Design progress tracking schema | 1d | Backend | Database |
| 2.3 Implement Coach Agent handler | 2d | Backend | Schema |
| 2.4 Build progress analytics engine | 1.5d | Backend | Coach Agent |
| 2.5 Create /api/agents/coach endpoint | 1d | Backend | Coach Agent |
| 2.6 Integrate Evaluator + Coach in Orchestrator | 1.5d | Backend | Both agents |
| 2.7 Build user dashboard (backend data) | 1.5d | Backend | Analytics |
| 2.8 Write tests (Coach + integration) | 1d | QA | Integration |

**Success Metrics**:
- ✅ Coach Agent responds in <2s
- ✅ 85%+ of recommendations marked helpful (user survey)
- ✅ Progress tracking captures 100% of quiz submissions
- ✅ Dashboard accurately shows level, score trends

**Testing Checklist**:
- [ ] Unit tests for coach prompt
- [ ] Integration tests (Evaluator → Coach flow)
- [ ] Progress tracking accuracy
- [ ] Dashboard data consistency
- [ ] Edge cases (new users, failed quizzes, streaks)

**Risk Mitigation**:
- Risk: Coach recommendations seem generic
  - Mitigation: Use more user context, iterate on prompt
- Risk: Progress data inconsistency
  - Mitigation: Database transactions, audit logs

---

### PHASE 3: Generator Agent + Orchestrator (Week 3)

**Week 3 Objectives**:
- Implement Generator Agent
- Build full Orchestrator
- Setup parallel execution
- Achieve <2s end-to-end latency (P90)

**Deliverables**:

| Task | Effort | Owner | Dependencies |
|------|--------|-------|--------------|
| 3.1 Build Generator Agent system prompt | 1d | AI/Product | Phase 2 complete |
| 3.2 Design question generation schema | 1d | Backend | Database |
| 3.3 Implement Generator Agent handler | 2d | Backend | Schema |
| 3.4 Build orchestration logic (parallel execution) | 2d | Backend | All agents |
| 3.5 Implement timeout + fallback mechanisms | 1.5d | Backend | Orchestrator |
| 3.6 Build result merger + formatter | 1d | Backend | Orchestrator |
| 3.7 Create frontend components (React) | 2d | Frontend | Orchestrator API |
| 3.8 Stress test + latency optimization | 1.5d | DevOps | All components |
| 3.9 Write comprehensive tests | 1d | QA | All components |

**Success Metrics**:
- ✅ Orchestrator responds in <2s (P90 latency)
- ✅ 0% timeout failures (all agents complete)
- ✅ Generated questions pass validation 100%
- ✅ Client perceives smooth UX (no jank)

**Testing Checklist**:
- [ ] Parallel execution timing tests
- [ ] Timeout + fallback scenarios
- [ ] Generated question validation
- [ ] Load test (100+ concurrent users)
- [ ] End-to-end flow (full orchestration)

**Risk Mitigation**:
- Risk: Orchestrator latency > 2s
  - Mitigation: Cache aggressively, optimize agent calls
- Risk: Generated questions not validated
  - Mitigation: Validator Agent runs synchronously

---

### PHASE 4: Validator Agent + Production Hardening (Week 4)

**Week 4 Objectives**:
- Implement Validator Agent
- Setup CI/CD pipeline
- Production hardening
- Achieve >99.9% uptime

**Deliverables**:

| Task | Effort | Owner | Dependencies |
|------|--------|-------|--------------|
| 4.1 Build Validator Agent system prompt | 1d | AI/Product | Phase 3 complete |
| 4.2 Implement CI/CD validation hooks | 1.5d | DevOps | Validator Agent |
| 4.3 Build content audit system | 1d | Backend | Validator Agent |
| 4.4 Setup monitoring + alerting | 2d | DevOps | Orchestrator |
| 4.5 Implement rate limiting + quotas | 1d | Backend | API |
| 4.6 Security audit + penetration testing | 1.5d | Security | API |
| 4.7 Performance optimization (final pass) | 1.5d | Backend | All components |
| 4.8 Documentation + runbooks | 1.5d | Tech Docs | All components |
| 4.9 Production deployment + monitoring | 1d | DevOps | All above |

**Success Metrics**:
- ✅ 99.9% uptime (measured over 7 days)
- ✅ All content passes Validator Agent (0 issues)
- ✅ 0 security vulnerabilities found
- ✅ <100ms P99 latency after optimization

**Testing Checklist**:
- [ ] Chaos engineering (kill agents, restart services)
- [ ] Security testing (injection, auth bypass)
- [ ] Validator audit (all curriculum content)
- [ ] Canary deployment (10% traffic)
- [ ] Incident response drill

**Risk Mitigation**:
- Risk: Validator too strict, blocks valid content
  - Mitigation: Tune thresholds, human review for "needs review"
- Risk: Security vulnerability missed
  - Mitigation: Third-party security audit

---

## 3B. Detailed Task Breakdown (Sample: Evaluator Agent)

### Task 1.3: Build Evaluator Agent System Prompt

**Objective**: Create a system prompt that reliably validates quiz answers against official sources.

**Steps**:

1. **Research Phase** (2 hours)
   - Read Anthropic official docs
   - Study MCP Registry structure
   - Review existing quiz answers for patterns

2. **Prompt Design** (3 hours)
   - Draft system prompt (rules, validation logic)
   - Define output schema (JSON format)
   - Add source citation requirements

3. **Testing Phase** (2 hours)
   - Test on 10 sample quiz questions
   - Validate all outputs match schema
   - Check accuracy against known answers

4. **Iteration** (1 hour)
   - Refine based on test results
   - Add clarifications or edge cases
   - Finalize for implementation

**Output**:
```markdown
# Evaluator Agent System Prompt (Final)

You are Claude Code Mastery Evaluator Agent...
[As specified in Section 1A]
```

**Success Criteria**:
- ✅ Prompt is 400-600 words (concise but complete)
- ✅ Output schema is JSON-valid
- ✅ 10/10 test cases produce correct verdict
- ✅ All responses cite official sources

---

# PART 4: TECHNICAL REQUIREMENTS

## 4A. Backend Stack

### Architecture

```
Frontend (React)
     ↓ HTTP
API Layer (Express.js)
     ↓
Agent Orchestration Layer
     ↓ Claude API calls
Claude API (Agents)
     ↓
Data Layer
     ├── PostgreSQL (user data, quiz submissions, progress)
     ├── Redis (caching, rate limiting)
     └── S3 (generated question logs, exports)
```

### Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Runtime** | Node.js 18+ | ES modules, native async |
| **Framework** | Express.js 4.x | Lightweight, well-tested |
| **Agent SDK** | @anthropic-ai/sdk (Agent SDK) | Official, well-supported |
| **Database** | PostgreSQL 14+ | ACID, JSON support, scalable |
| **Cache** | Redis 7.x | Fast key-value, pub/sub |
| **ORM** | Prisma | Type-safe, migrations |
| **Validation** | Zod | Schema validation, TypeScript |
| **Logging** | Pino + CloudWatch | Structured, searchable |
| **Auth** | JWT + API keys | Stateless, scalable |

### Folder Structure

```
api-server/
├── src/
│   ├── agents/
│   │   ├── evaluator.ts          # Evaluator Agent
│   │   ├── coach.ts              # Coach Agent
│   │   ├── generator.ts          # Generator Agent
│   │   ├── orchestrator.ts       # Orchestrator (coordinator)
│   │   └── validator.ts          # Validator Agent (CI/CD)
│   ├── routes/
│   │   ├── quiz.routes.ts        # POST /api/quiz/submit
│   │   ├── progress.routes.ts    # GET /api/progress
│   │   └── admin.routes.ts       # POST /api/admin/validate
│   ├── services/
│   │   ├── cache.service.ts      # Redis caching
│   │   ├── user.service.ts       # User data management
│   │   ├── analytics.service.ts  # Progress tracking
│   │   └── validator.service.ts  # Content validation
│   ├── middleware/
│   │   ├── auth.ts               # JWT verification
│   │   ├── rate-limit.ts         # Rate limiting
│   │   ├── error-handler.ts      # Error handling
│   │   └── logger.ts             # Request logging
│   ├── utils/
│   │   ├── anthropic.ts          # Claude API client
│   │   ├── validators.ts         # Input validation
│   │   └── formatters.ts         # Response formatting
│   ├── db/
│   │   ├── schema.prisma         # Database schema
│   │   ├── migrations/           # Prisma migrations
│   │   └── seed.ts               # Test data
│   └── main.ts                   # App entry point
├── tests/
│   ├── agents/
│   ├── routes/
│   ├── services/
│   └── integration/
├── .env.example                  # Environment variables template
├── docker-compose.yml            # Local dev environment
├── package.json
└── tsconfig.json
```

### Key Endpoints

#### POST /api/agents/orchestrate

**Purpose**: Submit quiz answer and receive evaluation + coaching + practice questions

**Request**:
```typescript
{
  // Authentication
  Authorization: "Bearer {jwt-token}" | "X-API-Key: {api-key}",

  // Body
  {
    questionId: string;
    userAnswer: string;
    userId?: string;  // Optional if authenticated via token
  }
}
```

**Response** (200 OK):
```typescript
{
  evaluation: {
    questionId: string;
    verdict: "correct" | "incorrect" | "partial" | "needs_review";
    confidence: number;
    explanation: string;
    sourceUrl?: string;
    remedial?: { ... };
  };
  coaching?: {
    status: "on_track" | "needs_support" | "accelerating" | "struggling";
    recommendations: [...];
    motivation: { ... };
  };
  practice?: {
    generatedQuestions: [...];
    reason: string;
  };
  orchestration: {
    totalTimeMs: number;
    agentResults: { ... };
  };
}
```

#### GET /api/progress/:userId

**Purpose**: Retrieve user progress, scores, and learning analytics

**Response**:
```typescript
{
  userId: string;
  currentLevel: number;
  totalScore: number;
  completedQuizzes: number;
  progression: {
    level1: { complete: true, score: 92, time: "3.5h" };
    level2: { complete: false, score: 68, progress: 55 };
  };
  strengths: ["MCP commands", "CLI basics"];
  weaknesses: ["Git hooks"];
  nextMilestone: "Complete Level 2 Hooks practice";
}
```

#### POST /api/admin/validate-content

**Purpose**: Trigger Validator Agent to audit all curriculum content

**Request**:
```typescript
{
  Authorization: "Bearer {admin-token}",
  contentType: "quizzes" | "commands" | "all",
  config?: { checkLinks: true, verifyExamples: true }
}
```

**Response**:
```typescript
{
  validationResult: "pass" | "needs_review" | "fail";
  issues: [...];
  summary: { ... };
  checksums: { ... };
}
```

---

## 4B. Frontend Integration

### React Components

```
<QuizComponent>
  ├── <QuestionDisplay>
  ├── <AnswerInput>
  ├── <SubmitButton>
  └── <ResultsDisplay>
       ├── <EvaluationCard>        // From Evaluator Agent
       ├── <CoachingCard>          // From Coach Agent
       ├── <PracticeQuestionsCard> // From Generator Agent
       └── <ProgressBar>           // Updated with coaching data
```

### Key Features

#### 1. Quiz Submission & Loading

```typescript
// quizService.ts
async function submitQuiz(questionId: string, userAnswer: string) {
  setLoading(true);
  
  try {
    const response = await fetch('/api/agents/orchestrate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ questionId, userAnswer })
    });
    
    if (!response.ok) throw new Error(response.statusText);
    
    const data = await response.json();
    setResults(data);
    
    // Update local progress
    updateLocalProgress(data.coaching?.status);
    
  } finally {
    setLoading(false);
  }
}
```

#### 2. Result Display

```typescript
<ResultsDisplay results={results}>
  {/* Evaluation Section */}
  <div className={`evaluation ${results.evaluation.verdict}`}>
    <h3>{results.evaluation.verdict === 'correct' ? '✓' : '✗'}</h3>
    <p>{results.evaluation.explanation}</p>
    {results.evaluation.sourceUrl && (
      <a href={results.evaluation.sourceUrl}>See official docs</a>
    )}
  </div>

  {/* Coaching Section */}
  {results.coaching && (
    <div className="coaching">
      <h4>💡 Learning Coach</h4>
      <p>{results.coaching.motivation.message}</p>
      {results.coaching.recommendations.map(rec => (
        <div key={rec.action} className="recommendation">
          <strong>{rec.action}</strong>
          <p>{rec.reason}</p>
        </div>
      ))}
    </div>
  )}

  {/* Practice Section */}
  {results.practice?.generatedQuestions && (
    <div className="practice">
      <h4>⚡ Practice Similar Questions</h4>
      {results.practice.generatedQuestions.map(q => (
        <PracticeQuestion key={q.id} question={q} />
      ))}
    </div>
  )}
</ResultsDisplay>
```

#### 3. Progress Dashboard

```typescript
// progressDashboard.tsx
function ProgressDashboard({ userId }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetch(`/api/progress/${userId}`)
      .then(r => r.json())
      .then(setProgress);
  }, [userId]);

  if (!progress) return <Loading />;

  return (
    <div className="dashboard">
      <h2>Your Progress</h2>
      
      {/* Level Progress */}
      <div className="level-progress">
        <p>Level {progress.currentLevel} • {progress.progression[`level${progress.currentLevel}`].progress}%</p>
        <ProgressBar value={progress.progression[`level${progress.currentLevel}`].progress} max={100} />
      </div>

      {/* Strengths & Weaknesses */}
      <div className="analysis">
        <div>
          <h4>Strengths</h4>
          {progress.strengths.map(s => <Tag key={s}>{s}</Tag>)}
        </div>
        <div>
          <h4>Focus Areas</h4>
          {progress.weaknesses.map(w => <Tag key={w} variant="warning">{w}</Tag>)}
        </div>
      </div>

      {/* Next Steps */}
      <div className="next-steps">
        <h4>Next Milestone</h4>
        <p>{progress.nextMilestone}</p>
      </div>
    </div>
  );
}
```

#### 4. LocalStorage Persistence

```typescript
// progressStore.ts (Zustand)
const useProgress = create((set) => ({
  scores: [],
  completedLevels: [],
  streak: 0,
  
  recordScore: (questionId, score) => set((state) => ({
    scores: [...state.scores, { questionId, score, timestamp: Date.now() }]
  })),
  
  recordCompletion: (levelId) => set((state) => ({
    completedLevels: [...state.completedLevels, { levelId, timestamp: Date.now() }]
  })),
  
  updateStreak: () => set((state) => ({
    streak: state.streak + 1
  })),
  
  // Persist to localStorage
  persist: (getState, setstate, api) => ({
    getState,
    setstate,
    version: 0
  })
}), {
  name: 'claude-mastery-progress'  // localStorage key
});
```

---

## 4C. Database Schema

### PostgreSQL Schema (Prisma)

```prisma
// schema.prisma

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  createdAt DateTime  @default(now())
  
  quizSubmissions QuizSubmission[]
  progress        Progress[]
  
  @@index([email])
}

model Quiz {
  id        String   @id
  level     Int
  topic     String
  question  String
  options   String[] // JSON array
  correctAnswer String
  category  String
  verified  Boolean  @default(false)
  docUrl    String?
  
  submissions QuizSubmission[]
  
  @@index([level, topic])
}

model QuizSubmission {
  id          String   @id @default(cuid())
  userId      String
  quizId      String
  userAnswer  String
  submitted   DateTime @default(now())
  
  // Evaluator results
  verdict     String   // "correct" | "incorrect" | "partial"
  confidence  Float
  explanation String   @db.Text
  sourceUrl   String?
  
  // Coaching context
  coachStatus String?  // "on_track" | "needs_support"
  
  // Practice questions (if generated)
  practiceQuestionIds String[] // JSON array of generated question IDs
  
  // Performance metrics
  latencyMs   Int      // Total latency
  cacheHit    Boolean  @default(false)
  
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  quiz  Quiz  @relation(fields: [quizId], references: [id])
  
  @@index([userId, quizId])
  @@index([submitted])
}

model Progress {
  id              String   @id @default(cuid())
  userId          String
  currentLevel    Int
  totalScore      Int      @default(0)
  completedQuizzes Int     @default(0)
  streak          Int      @default(0)
  lastQuizDate    DateTime?
  
  levelProgress   Json     // { "level1": { complete: true, score: 92 }, ... }
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId])
  @@index([userId])
}

model GeneratedQuestion {
  id              String   @id @default(cuid())
  sourceQuestionId String
  userId          String
  generatedAt     DateTime @default(now())
  
  type            String   // "multiple_choice" | "scenario"
  question        String   @db.Text
  options         String[] // JSON array
  correctAnswer   String
  difficulty      String
  
  // Tracking
  usedInSubmissions Int @default(0)
  userScore       Float?
  
  @@index([sourceQuestionId])
  @@index([userId])
}

model AgentMetrics {
  id          String   @id @default(cuid())
  timestamp   DateTime @default(now())
  
  agentName   String   // "evaluator" | "coach" | "generator"
  latencyMs   Int
  costTokens  Int
  status      String   // "success" | "timeout" | "error"
  errorMsg    String?
  
  @@index([agentName, timestamp])
}

model ValidationReport {
  id          String   @id @default(cuid())
  timestamp   DateTime @default(now())
  
  contentType String   // "quizzes" | "commands" | "all"
  result      String   // "pass" | "needs_review" | "fail"
  issues      Json     // Array of issue objects
  checksums   Json     // { filename: hash }
  
  @@index([timestamp])
}
```

---

## 4D. API Key & Authentication

### Server-Side Only

```typescript
// utils/anthropic.ts
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY  // Server env only, NEVER exposed to client
});

export async function callAgent(agentConfig: AgentConfig, input: unknown) {
  return await anthropic.messages.create({
    model: "claude-opus-4-1-20250805",  // Latest model
    max_tokens: agentConfig.maxTokens,
    system: agentConfig.systemPrompt,
    messages: [{ role: "user", content: JSON.stringify(input) }]
  });
}
```

### Client Authentication

```typescript
// Frontend (React)
const response = await fetch('/api/agents/orchestrate', {
  method: 'POST',
  headers: {
    // Client only sends JWT, NOT API key
    'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ questionId, userAnswer })
});
```

### Rate Limiting

```typescript
// middleware/rate-limit.ts
import RedisStore from "rate-limit-redis";

const store = new RedisStore({
  client: redis,
  prefix: "rl:",  // Redis key prefix
});

const evaluationLimiter = rateLimit({
  store,
  windowMs: 24 * 60 * 60 * 1000,  // 24 hours
  max: 10,  // 10 evals/day free tier
  keyGenerator: (req) => req.user.id,  // Per-user limit
  skip: (req) => req.user.isPremium,   // Skip for premium
});

router.post('/agents/orchestrate', evaluationLimiter, handleOrchestrate);
```

---

# PART 5: COST ANALYSIS

## 5A. Token Consumption per Operation

### Per Evaluation (Evaluator Agent)

```
Input tokens:
  - System prompt:     ~200 tokens
  - Question context:  ~150 tokens
  - User answer:       ~50 tokens
  - Correct answer:    ~50 tokens
  ────────────────────────────────
  Total input:         ~450 tokens

Output tokens:
  - Explanation:       ~200 tokens
  - Resources:         ~100 tokens
  ────────────────────────────────
  Total output:        ~300 tokens

Total per evaluation:  ~750 tokens
```

### Per Coaching Session (Coach Agent)

```
Input tokens:
  - System prompt:     ~200 tokens
  - User progress:     ~300 tokens (history of 20 quizzes)
  - Preferences:       ~50 tokens
  ────────────────────────────────
  Total input:         ~550 tokens

Output tokens:
  - Recommendations:   ~400 tokens
  - Motivation:        ~200 tokens
  ────────────────────────────────
  Total output:        ~600 tokens

Total per session:     ~1150 tokens
```

### Per Practice Question Set (Generator Agent)

```
Input tokens:
  - System prompt:     ~200 tokens
  - Failed question:   ~100 tokens
  - Misconception:     ~100 tokens
  ────────────────────────────────
  Total input:         ~400 tokens

Output tokens (3 questions):
  - Question 1:        ~200 tokens
  - Question 2:        ~200 tokens
  - Question 3:        ~200 tokens
  - Explanations:      ~200 tokens
  ────────────────────────────────
  Total output:        ~800 tokens

Total per set:        ~1200 tokens
```

## 5B. Pricing Model

### Claude API Pricing (2026 rates)

| Model | Input | Output |
|-------|-------|--------|
| **Claude 3.5 Sonnet** | $3/M tokens | $15/M tokens |
| **Claude 3 Opus** | $15/M tokens | $75/M tokens |
| **Claude 3 Haiku** | $0.80/M tokens | $4/M tokens |

*Recommended: Use Sonnet (best balance of cost & performance)*

### Average Cost per Quiz Submission

```
Orchestrator flow:
- Evaluator:   750 tokens × $3/$15 = $0.0225
- Coach:       1150 tokens × $3/$15 = $0.0345
- Generator:   1200 tokens × $3/$15 = $0.036 (if wrong answer)
───────────────────────────────────────────────
Average cost per submission (if 70% wrong):
= $0.0225 + $0.0345 + (0.70 × $0.036)
= $0.0225 + $0.0345 + $0.0252
= $0.0822 per submission

Average cost per submission (if 30% wrong):
= $0.0225 + $0.0345 + (0.30 × $0.036)
= $0.0225 + $0.0345 + $0.0108
= $0.0678 per submission
```

### Free Tier Budget

```
Assumption: Free tier budget = $20/month

Cost per submission: ~$0.07 (average)
Submissions per month: $20 / $0.07 = ~285 submissions

For 100 users:
- 285 submissions / 100 users = 2.85 submissions/user/month
- If user does 5 quizzes/day over 5 days = 25 submissions
- Can support: 1-2 active free users only

Recommendation:
- Free tier: 10 evaluations/month (not per day)
- Premium tier: Unlimited, $9.99/month
```

## 5C. Cost Optimization Strategies

### 1. Caching (Reduces API calls 60-70%)

```typescript
// Cache key: hash(questionId + userAnswer)
const cacheKey = crypto
  .createHash('sha256')
  .update(questionId + userAnswer)
  .digest('hex');

// Check cache first
const cached = await redis.get(`eval:${cacheKey}`);
if (cached) {
  metrics.cacheHit = true;
  return JSON.parse(cached);
}

// If miss, call agent
const result = await evaluatorAgent.call(input);

// Store in cache (24h TTL)
await redis.setex(`eval:${cacheKey}`, 86400, JSON.stringify(result));

return result;

// Impact: 60% of quiz submissions are duplicates or near-duplicates
// Savings: 60% × $0.0225 per agent × 3 agents = ~$0.009/month per user
```

### 2. Prompt Compression

```typescript
// Use Claude's /compact command during agent design
// Compress system prompts: 200 → 120 tokens

// Before: "You are Claude Code Mastery Evaluator Agent..."
// After: "Validate quiz answers. Official sources only. Output JSON."

// Token savings: ~80 tokens per evaluation
// Cost savings: 80 × $3/1M = $0.00024 per eval
```

### 3. Selective Agent Invocation

```typescript
// Skip Coach if user just started
if (user.quizCount < 5) {
  skipCoach = true;
}

// Skip Generator if answer correct
if (verdict === "correct") {
  skipGenerator = true;
}

// Cost reduction: ~50% for new users, ~30% for advanced users
```

### 4. Batch Processing (CI/CD Validator)

```typescript
// Instead of validating 50 quizzes separately:
// Validate all 50 in one agent call (batch mode)

// Before: 50 calls × 400 tokens = 20K tokens
// After: 1 call × 2K tokens = 2K tokens
// Savings: 90%

// Run nightly, not on every push
```

## 5D. Cost Projections

### Small Scale (100 active users)

```
Scenario 1: Free tier (10 evals/month)
- Evaluations/month: 100 × 10 = 1000
- Cost: 1000 × $0.0225 = $22.50
- Status: OVER BUDGET ($20/month cap)

Recommendation:
- Reduce to 5 evals/month free tier
- Cost: 500 × $0.0225 = $11.25/month ✅

Scenario 2: Premium tier ($9.99/month)
- Subscription revenue: 100 × $9.99 = $999/month
- Assume 20 premium users doing 20 quizzes/month each:
- Submissions: 20 × 20 = 400
- Agent cost per submission: ~$0.08
- Total agent cost: 400 × $0.08 = $32/month
- Profit margin: ($9.99 × 20) - $32 = $199.80 - $32 = $167.80/month
```

### Medium Scale (10K active users)

```
Scenario: Hybrid model (80% free, 20% premium)
- Free users: 8000 × 5 evals/month = 40,000
- Premium users: 2000 × 20 evals/month = 40,000
- Total evaluations: 80,000/month

Cost breakdown:
- Evaluations: 80,000 × $0.0225 = $1,800
- Coaching (60% of evals): 48,000 × $0.0345 = $1,656
- Generation (30% of evals): 24,000 × $0.036 = $864
- Total agent cost: $4,320/month

Revenue:
- Premium subscriptions: 2000 × $9.99 = $19,980/month
- Margin: $19,980 - $4,320 = $15,660/month (78% margin)

Infrastructure costs (estimate):
- API server: $500/month (on Vercel)
- PostgreSQL: $100/month (managed)
- Redis: $50/month (managed)
- Monitoring: $100/month
- Total infra: $750/month

Net profit: $15,660 - $750 = $14,910/month
```

---

# PART 6: SECURITY CONSIDERATIONS

## 6A. API Key Protection

### ❌ NEVER do this:

```typescript
// BAD: API key in client-side code
const response = await fetch('/api/quiz', {
  headers: {
    'X-API-Key': 'sk-...'  // ← EXPOSED to attacker
  }
});
```

### ✅ DO this:

```typescript
// GOOD: API key server-side only
// File: api-server/utils/anthropic.ts (server-side only)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY  // ← From environment, never logged
});

// Client only uses JWT
const response = await fetch('/api/agents/orchestrate', {
  headers: {
    'Authorization': `Bearer ${jwtToken}`  // ← Signed token, no secrets
  }
});
```

### Environment Variable Protection

```bash
# .env.local (NEVER commit)
ANTHROPIC_API_KEY=sk-...
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...

# .env.example (commit this)
ANTHROPIC_API_KEY=your_key_here
DATABASE_URL=your_db_here
REDIS_URL=your_redis_here
JWT_SECRET=your_secret_here
```

## 6B. Input Validation & Sanitization

```typescript
// middleware/validate-quiz-input.ts
import { z } from "zod";

const QuizSubmissionSchema = z.object({
  questionId: z.string().uuid(),
  userAnswer: z.string().min(1).max(10000),
  userId: z.string().uuid().optional()
});

router.post('/agents/orchestrate', (req, res, next) => {
  try {
    const validated = QuizSubmissionSchema.parse(req.body);
    req.validatedData = validated;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});
```

## 6C. Rate Limiting & DDoS Protection

```typescript
// middleware/rate-limit.ts
import RedisStore from "rate-limit-redis";

// Per-user limit (authenticated)
const evaluationLimiter = rateLimit({
  store: new RedisStore({ client: redis, prefix: "eval:" }),
  windowMs: 24 * 60 * 60 * 1000,  // 24 hours
  max: 10,  // 10 per day free tier
  keyGenerator: (req) => req.user.id,
  skip: (req) => req.user.isPremium
});

// Global limit (unauthenticated)
const globalLimiter = rateLimit({
  store: new RedisStore({ client: redis, prefix: "global:" }),
  windowMs: 60 * 1000,  // 1 minute
  max: 100,  // 100 requests/minute global
  keyGenerator: (req) => req.ip
});

app.use(globalLimiter);
app.post('/agents/orchestrate', evaluationLimiter, handleOrchestrate);
```

## 6D. Data Privacy & GDPR Compliance

### Data Retention Policy

```typescript
// Remove old data after 30 days
async function cleanupOldSubmissions() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  await db.quizSubmission.deleteMany({
    where: { submitted: { lt: thirtyDaysAgo } }
  });
}

// Schedule: Run daily
schedule.scheduleJob('0 2 * * *', cleanupOldSubmissions);  // 2 AM daily
```

### User Data Export (GDPR Right to Access)

```typescript
// GET /api/user/export-data
async function exportUserData(req: Request) {
  const userId = req.user.id;
  
  const data = {
    user: await db.user.findUnique({ where: { id: userId } }),
    progress: await db.progress.findUnique({ where: { userId } }),
    submissions: await db.quizSubmission.findMany({ where: { userId } }),
    generatedQuestions: await db.generatedQuestion.findMany({ where: { userId } })
  };
  
  // Return as JSON or CSV
  res.json(data);
}
```

### User Data Deletion (GDPR Right to be Forgotten)

```typescript
// DELETE /api/user/delete-account
async function deleteUserAccount(req: Request) {
  const userId = req.user.id;
  
  // Delete all user data
  await db.user.delete({ where: { id: userId } });  // Cascade deletes submissions, progress
  
  res.json({ message: 'Account deleted' });
}
```

## 6E. Monitoring & Alerting

```typescript
// services/monitoring.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.CloudWatch({
      logGroupName: 'claude-mastery-api',
      awsAccessKeyId: process.env.AWS_ACCESS_KEY,
      awsSecretKey: process.env.AWS_SECRET_KEY
    })
  ]
});

// Log all agent calls
async function callAgent(agentName: string, input: unknown) {
  logger.info('Agent call', {
    agent: agentName,
    inputSize: JSON.stringify(input).length,
    timestamp: new Date()
  });
  
  const start = Date.now();
  const result = await anthropic.messages.create({...});
  const latency = Date.now() - start;
  
  logger.info('Agent result', {
    agent: agentName,
    latency,
    outputTokens: result.usage.output_tokens,
    cost: result.usage.output_tokens * PRICE_PER_TOKEN
  });
  
  return result;
}

// Alert on errors
logger.on('error', (error) => {
  // Send to Slack/PagerDuty
  alerting.notify({
    level: 'error',
    message: error.message,
    timestamp: new Date()
  });
});
```

## 6F. Security Checklist

- [ ] API keys stored server-side only in environment variables
- [ ] All inputs validated with Zod schema
- [ ] Rate limiting implemented per user + global
- [ ] HTTPS enforced (TLS 1.3+)
- [ ] CORS configured (whitelist only claude-code-mastery.com)
- [ ] JWT tokens have short expiry (15 minutes)
- [ ] Refresh tokens have medium expiry (7 days)
- [ ] All agent calls logged with user ID stripped from logs
- [ ] Database credentials in separate vault (not env vars)
- [ ] Secrets rotated monthly
- [ ] Penetration testing completed (Q3 2026)
- [ ] GDPR data retention policies implemented
- [ ] User data export/deletion endpoints functional

---

# PART 7: SUCCESS METRICS & MONITORING

## 7A. Key Performance Indicators (KPIs)

### User Engagement

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Quiz completion rate** | +40% | (Completed quizzes) / (Started quizzes) |
| **Daily active users** | 50% of registered | Users with activity in last 24h |
| **User satisfaction** | 4.5+ / 5.0 | In-app survey after each quiz |
| **Streak continuity** | 3+ day average | Users maintaining daily streaks |

### Learning Outcomes

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time to proficiency** | -30% | Days to complete Level 1 (vs 15d baseline) |
| **Quiz accuracy trend** | +15% improvement | Moving average of scores across all users |
| **Remedial success rate** | 70%+ | Users who improve on generated practice questions |
| **Level unlock rate** | 60%+ reach Level 3 | Of users who start Level 1 |

### Agent Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Evaluator accuracy** | 95%+ | Manual validation of 100 random evaluations |
| **Coach recommendation relevance** | 85%+ | User feedback: "Helpful" rating |
| **Generator question quality** | 4.0+ / 5.0 | User ratings on generated questions |
| **Orchestrator latency** | <2s (P90) | Response time per quiz submission |
| **Agent reliability** | 99.9% | Uptime measured over 30 days |

### Cost Efficiency

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Cost per evaluation** | <$0.08 | (Total API costs) / (Evaluations) |
| **Cache hit rate** | 60%+ | (Cache hits) / (Total requests) |
| **Token efficiency** | <1000 tokens/eval | Prompt optimization over time |
| **Infrastructure cost** | <$1.5K/month | Combined server + database + cache |

## 7B. Monitoring Dashboard

### Real-Time Metrics (Updated every 60s)

```
┌────────────────────────────────────────────────────────┐
│       Claude Code Mastery — Agent Performance          │
├────────────────────────────────────────────────────────┤
│                                                        │
│  AGENT STATUS                     LATENCY (ms)        │
│  ✅ Evaluator    5432 today       P50: 850            │
│  ✅ Coach        3421 today       P90: 1450           │
│  ✅ Generator    1203 today       P99: 2100           │
│  ✅ Validator    4 runs today     Max: 2450           │
│                                                        │
│  ERROR RATE                       CACHE HIT           │
│  Evaluator:    0.1%               58%                 │
│  Coach:        0.2%               ┌─────────┐         │
│  Generator:    0.3%               │ 58%     │         │
│  Orchestrator: 0.0%               └─────────┘         │
│                                                        │
│  API COSTS (Today)                PREDICTION (Month)   │
│  Tokens used:    450K              Budget: $20.00      │
│  Cost:           $6.75             Run rate: $18.50    │
│  Remaining:      $13.25            ✅ On budget        │
│                                                        │
│  UPTIME THIS WEEK                 USER SATISFACTION   │
│  99.97%                           ⭐⭐⭐⭐⭐ 4.6 / 5  │
│  Last incident: 14h ago           (2340 ratings)      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## 7C. Alerts & Thresholds

| Alert | Condition | Action |
|-------|-----------|--------|
| **High latency** | P90 > 3s | Page on-call engineer, check agent quota |
| **High error rate** | Agent errors > 5% | Investigate; rollback if needed |
| **Cache degradation** | Hit rate < 40% | Review cache policy, increase TTL |
| **Budget overrun** | Daily cost > $30 | Disable Generator until next day, alert ops |
| **Uptime drop** | <99.0% in 24h | Investigate; notify stakeholders |
| **Cost spike** | >100% of baseline | Check for abuse/bot activity |

## 7D. Analytics Queries

### Quiz Performance by Level

```sql
SELECT 
  level,
  COUNT(*) as total_submissions,
  AVG(CASE WHEN verdict = 'correct' THEN 1 ELSE 0 END) as accuracy,
  AVG(confidence) as avg_confidence
FROM quiz_submission
GROUP BY level
ORDER BY level;
```

### Agent Latency Distribution

```sql
SELECT 
  agent_name,
  COUNT(*) as calls,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY latency_ms) as p50,
  PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY latency_ms) as p90,
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY latency_ms) as p99,
  MAX(latency_ms) as max_latency
FROM agent_metrics
WHERE timestamp > NOW() - INTERVAL 7 DAY
GROUP BY agent_name;
```

### User Progress Cohort Analysis

```sql
SELECT 
  DATE(created_at) as signup_date,
  COUNT(DISTINCT user_id) as cohort_size,
  COUNT(DISTINCT CASE WHEN current_level >= 2 THEN user_id END) as reached_level2,
  COUNT(DISTINCT CASE WHEN current_level >= 3 THEN user_id END) as reached_level3,
  AVG(avg_score) as cohort_avg_score
FROM progress
GROUP BY signup_date
ORDER BY signup_date DESC;
```

---

# PART 8: SUCCESS CRITERIA & COMPLETION

## 8A. Phase-by-Phase Success Criteria

### PHASE 1: Evaluator (Week 1) ✅

**Success Criteria**:
- [ ] Evaluator Agent responds in <1.5s average
- [ ] Accuracy >95% on 100 validation cases
- [ ] Zero hallucinations (manual validation)
- [ ] API endpoint returns valid JSON
- [ ] Cache layer reduces API calls by 40%+
- [ ] Unit tests: >85% code coverage
- [ ] Load test passes: 50 concurrent requests

**Sign-Off**: Product Manager + Engineering Lead

---

### PHASE 2: Coach Agent (Week 2) ✅

**Success Criteria**:
- [ ] Coach Agent responds in <2s average
- [ ] 85%+ recommendation relevance (user feedback)
- [ ] Progress tracking captures 100% of submissions
- [ ] Dashboard displays accurate user data
- [ ] Integration tests: Evaluator → Coach flow
- [ ] Edge cases handled (new users, streaks, etc.)

**Sign-Off**: Product Manager + Data Analytics Lead

---

### PHASE 3: Generator + Orchestrator (Week 3) ✅

**Success Criteria**:
- [ ] Generator Agent responds in <2s average
- [ ] Generated questions pass validation 100%
- [ ] Orchestrator latency <2s (P90) end-to-end
- [ ] Parallel execution working correctly
- [ ] Timeout/fallback mechanisms tested
- [ ] React components display results correctly
- [ ] Stress test: 100+ concurrent users

**Sign-Off**: Product Manager + Frontend Lead + DevOps

---

### PHASE 4: Validator + Production (Week 4) ✅

**Success Criteria**:
- [ ] Validator Agent audits all curriculum (100% coverage)
- [ ] CI/CD integration prevents deployment of invalid content
- [ ] Uptime >99.9% measured over 7 days
- [ ] Security audit completed, 0 critical issues
- [ ] Penetration testing passed
- [ ] Documentation complete + runbooks created
- [ ] Monitoring + alerting functional

**Sign-Off**: CTO + Security Lead + Operations Lead

---

## 8B. Post-Launch Monitoring (Weeks 5-8)

### Week 5: Stabilization

- Monitor error rates daily
- Track agent latency (maintain <2s P90)
- Validate user satisfaction (maintain >4.2/5)
- Address any bugs or edge cases

### Week 6: Optimization

- Tune prompts based on real-world usage
- Optimize caching strategy
- Analyze cost per user, adjust pricing
- A/B test coaching messages

### Week 7: Expansion

- Enable premium tier ($9.99/month)
- Launch Coach Agent feedback loop
- Add more generated question scenarios

### Week 8: Scale

- Increase free tier limit (if cost permits)
- Add new agent types (Quiz Creator Agent)
- Plan next features (FASE 8)

---

# PART 9: FUTURE ENHANCEMENTS (FASE 8+)

## 9A. Quiz Creator Agent

**Purpose**: Auto-generate quiz questions from curriculum content

**Capabilities**:
- Analyze lesson content, extract learning objectives
- Generate 5 multiple-choice questions per lesson
- Create scenario-based questions (real-world context)
- Validate against official sources automatically

**Timeline**: Q4 2026

---

## 9B. Analytics Agent

**Purpose**: Generate insights on user learning patterns

**Capabilities**:
- Cohort analysis (signup date, progression rate)
- Skill gap analysis (which topics struggle most)
- Predict user likely to churn
- Recommend curriculum improvements

**Timeline**: Q4 2026

---

## 9C. Multi-Language Support

**Purpose**: Translate curriculum and agent responses to Spanish, Portuguese, etc.

**Approach**: Use Claude's translation API, validate with native speakers

**Timeline**: Q1 2027

---

# PART 10: CONCLUSION & NEXT STEPS

## Summary

This document specifies a comprehensive Agent SDK integration architecture for Claude Code Mastery featuring:

1. **5 Agent Types** with clear responsibilities and system prompts
2. **Parallel Orchestration** achieving <2s end-to-end latency
3. **4-Week Implementation Roadmap** with detailed tasks and success criteria
4. **Production Hardening** including security, monitoring, and scale
5. **Cost Optimization** strategies achieving 60-70% cache efficiency
6. **Success Metrics** aligned with business goals

## Immediate Next Steps

### Week 1 Actions

1. **Setup Node.js Backend**
   - Clone starter template
   - Setup PostgreSQL + Redis
   - Implement Express server

2. **Build Evaluator Agent**
   - Write system prompt (referencing Section 1A)
   - Create evaluation endpoint
   - Test on 10 sample quizzes

3. **Setup CI/CD**
   - Create GitHub Actions workflow
   - Deploy to staging environment
   - Setup monitoring

### Week 2 Actions

4. **Implement Coach Agent**
   - Write system prompt (Section 1B)
   - Build progress analytics
   - Integrate with Evaluator

5. **Frontend Integration**
   - Create React components for results display
   - Implement localStorage progress tracking
   - Test end-to-end flow

### Approval & Sign-Off

**Ready for Implementation**: ✅ YES

**Approval Needed From**:
- [ ] Product Manager (confirm user value)
- [ ] Engineering Lead (confirm technical feasibility)
- [ ] Finance (confirm budget $20K/month for first 6 months)

---

**Document Status**: Complete & Ready for Implementation  
**Version**: 1.0  
**Last Updated**: 2026-05-17  
**Next Review**: After PHASE 1 completion (2026-05-24)
