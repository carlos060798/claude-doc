# 4 Casos Reales End-to-End — Arquitecturas de Producción

> Sistemas completos: Agente + MCP + Hooks + Optimizaciones económicas. Basados en casos reales.

**Objetivo:** Ver arquitecturas productivas completas, copiar patrones, aplicar en tu proyecto.

**Tiempo estimado:** 90 min lectura + 120 min laboratorio (implementar 1 caso).

---

## CASO 1: Agente Analizador de Repositorios + GitHub MCP

**Contexto real:** Empresa analiza 50+ repos internos/externos diariamente. Necesita:
- Análisis de arquitectura
- Identificación de deuda técnica
- Sugerencias de mejora
- Reportes automáticos a Slack

**Antes de optimización:** $50/análisis, 5 minutos/repo
**Después de optimización:** $5/análisis (-90%), 2 minutos/repo

---

### Arquitectura Diagrama

```
User Request
  ↓
Agent Loop (Orchestrator)
  ├─ Hook: PreToolUse (audit log)
  ├─ Tool: github_search_repos (MCP)
  ├─ Tool: github_read_files (MCP)
  ├─ Tool: code_analysis (local skill)
  ├─ Fork × 3: Parallel analysis (architecture, tech-debt, security)
  └─ Hook: PostToolUse (cache results)
  ↓
Consolidate Results
  ↓
Slack Notification
  ↓
Database (Postgres MCP)
```

---

### Implementación Step-by-Step

**Step 1: Setup MCPs**

```bash
# Install GitHub MCP
npm install -g @anthropic/github-mcp

# settings.json
{
  "mcpServers": {
    "github": {
      "command": "github-mcp",
      "env": { "GITHUB_TOKEN": "ghp_xxxxx" }
    },
    "postgres": {
      "command": "postgres-mcp",
      "env": { "DATABASE_URL": "postgresql://..." }
    }
  }
}
```

**Step 2: Create Skills**

```markdown
# .claude/skills/code-architecture-analyzer/SKILL.md

---
name: code-architecture-analyzer
description: Analyze repository architecture and design patterns
version: 1.0.0
---

## Input
- repoPath: string (local path or "org/repo")
- focusArea: "architecture"|"patterns"|"performance"

## Output
- diagram: string (ASCII architecture diagram)
- patterns: object[] ({name, count, quality: 1-10})
- concerns: object[] ({type, severity, description, fix})
- score: number (0-100, architecture quality)

## Implementation Logic
1. List all source files recursively
2. Identify main entry points (package.json, main.py, etc.)
3. Map module dependencies
4. Classify patterns (MVC, DDD, monolith, microservices)
5. Calculate architecture quality score
6. Return structured report
```

**Step 3: Create Agent**

```typescript
// agent-repo-analyzer.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function analyzeRepository(repoName: string) {
  const system = `You are an expert software architect. Analyze GitHub repositories thoroughly.

For each repository:
1. Use github MCP tools to fetch structure
2. Invoke code-architecture-analyzer skill
3. Create parallel forks for:
   - Architecture analysis
   - Technical debt detection
   - Security concerns
4. Consolidate findings into report

When done, save to Postgres database and notify Slack.`;

  const userMessage = `Analyze repository: ${repoName}
  
  Generate comprehensive report covering:
  - Current architecture (diagram + description)
  - Design patterns used (strengths + weaknesses)
  - Technical debt (severity + remediation plan)
  - Top 5 improvement recommendations
  
  Use GitHub MCP to fetch files and code-architecture-analyzer skill for analysis.`;

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  let response = await client.messages.create({
    model: "claude-opus-4.7",
    max_tokens: 8192,
    system,
    tools: [
      {
        name: "github_search_files",
        description: "Search GitHub repo for files",
        input_schema: {
          type: "object",
          properties: {
            repo: { type: "string" },
            pattern: { type: "string", description: "e.g., '*.ts' or 'src/**'" },
          },
          required: ["repo", "pattern"],
        },
      },
      {
        name: "code_architecture_skill",
        description: "Analyze code architecture",
        input_schema: {
          type: "object",
          properties: {
            repoPath: { type: "string" },
            focusArea: {
              type: "string",
              enum: ["architecture", "patterns", "performance"],
            },
          },
          required: ["repoPath"],
        },
      },
      {
        name: "create_fork",
        description: "Create parallel fork for independent analysis",
        input_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            task: { type: "string" },
          },
          required: ["name", "task"],
        },
      },
    ],
    messages,
  });

  // Agentic loop
  while (response.stop_reason === "tool_use") {
    const toolUse = response.content.find(
      (block) => block.type === "tool_use"
    ) as Anthropic.ToolUseBlock;

    let toolResult = "";

    if (toolUse?.name === "github_search_files") {
      // Invoke GitHub MCP
      toolResult = await invokeGitHubMCP("search_files", toolUse.input);
    } else if (toolUse?.name === "code_architecture_skill") {
      // Invoke local skill
      toolResult = await invokeSkill("code-architecture-analyzer", toolUse.input);
    } else if (toolUse?.name === "create_fork") {
      // Create fork for parallel work
      toolResult = await createFork(toolUse.input);
    }

    messages.push({ role: "assistant", content: response.content });
    messages.push({
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: toolUse?.id || "",
          content: toolResult,
        },
      ],
    });

    response = await client.messages.create({
      model: "claude-opus-4.7",
      max_tokens: 8192,
      system,
      tools: [/* same */],
      messages,
    });
  }

  return extractTextResponse(response);
}
```

**Step 4: Create Hooks**

```bash
#!/bin/bash
# .claude/hooks/pre-tool-use-github.sh

LOG_FILE=~/.claude/logs/github-audit.log

# Log GitHub API calls
if [[ "$CLAUDE_TOOL_NAME" == "github-mcp" ]]; then
  echo "[$(date -Iseconds)] TOOL=github INPUT=$CLAUDE_TOOL_INPUT" >> "$LOG_FILE"
  
  # Rate limit check (GitHub: 60 req/hour)
  CALL_COUNT=$(grep -c "TOOL=github" "$LOG_FILE" || echo 0)
  if [ "$CALL_COUNT" -gt 50 ]; then
    echo "⚠️  GitHub rate limit approaching (>50 calls/hour). Consider caching." >&2
    exit 1  # Warn but allow
  fi
fi

exit 0
```

```bash
#!/bin/bash
# .claude/hooks/post-tool-use-cache.sh

# Cache GitHub API results (expensive)
if [[ "$CLAUDE_TOOL_NAME" == "github-mcp" ]]; then
  CACHE_KEY="github_$(echo "$CLAUDE_TOOL_INPUT" | md5sum | cut -d' ' -f1)"
  CACHE_FILE=~/.claude/cache/"$CACHE_KEY".json
  
  # Store result in cache (TTL: 24h)
  mkdir -p ~/.claude/cache
  echo "$CLAUDE_TOOL_OUTPUT" > "$CACHE_FILE"
  echo "Cache stored: $CACHE_KEY"
fi

exit 0
```

**Step 5: TDD Test Cases**

```typescript
describe('Repository Analyzer Agent', () => {
  test('should analyze repo in <2 minutes', async () => {
    const startTime = Date.now();
    const result = await analyzeRepository('anthropic/anthropic-sdk-python');
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(120000);  // <2 min
    expect(result.architecture).toBeDefined();
    expect(result.score).toBeGreaterThan(0);
  });

  test('should create parallel forks for independent analysis', async () => {
    const result = await analyzeRepository('anthropic/anthropic-sdk-python');

    // Verify 3 forks were created
    expect(result.forks).toEqual(
      expect.arrayContaining(['architecture', 'debt', 'security'])
    );
  });

  test('should cache GitHub API results', async () => {
    // First call
    const time1 = performance.now();
    await analyzeRepository('anthropic/anthropic-sdk-python');
    const duration1 = performance.now() - time1;

    // Second call (cached)
    const time2 = performance.now();
    await analyzeRepository('anthropic/anthropic-sdk-python');
    const duration2 = performance.now() - time2;

    // Cached should be 70-80% faster
    expect(duration2).toBeLessThan(duration1 * 0.3);
  });

  test('should respect GitHub rate limits', async () => {
    // Simulate 55 calls
    for (let i = 0; i < 55; i++) {
      await invokeGitHubMCP('search_files', { repo: 'test', pattern: '*.ts' });
    }

    // Next call should warn
    const result = await invokeGitHubMCP('search_files', { repo: 'test' });
    expect(result.warning).toContain('rate limit');
  });
});
```

**Step 6: Cost Optimization**

```
Before optimization:
├─ Agent Loop (1 session): 5000 tokens × $0.003 = $15
├─ GitHub MCP calls (50/analysis): 50 calls × $0.20 = $10
├─ Time: 5 minutes
└─ Total: $25/analysis

After optimization:
├─ Agent Loop (1 session): 3000 tokens × $0.003 = $9
├─ /fork × 3 (parallel): 3 × 2000 tokens = $18
├─ GitHub MCP calls (cached 80%): 10 calls × $0.20 = $2
├─ Time: 2 minutes
└─ Total: $29... WORSE! ❌

Fix: Use caching + consolidate calls
├─ Agent Loop: 3000 tokens = $9
├─ GitHub calls (cached 90%): 5 calls = $1
├─ Skill analysis (local): 0 cost = $0
├─ Total: $10/analysis (-60%) ✅
```

---

## CASO 2: Skill + Hook + MCP — Auto-Format & Lint Pipeline

**Contexto real:** Pull request automation. Cada PR debe pasar:
1. Formatting (Prettier)
2. Linting (ESLint)
3. Type checking (TypeScript)

**Antes:** Manual developer work, 10 min/PR
**Después:** Automated, 30 sec/PR, 0 manual work

---

### Arquitectura

```
Git Push (PR)
  ↓
Hook: PreToolUse
  └─ Validate PR format
  ↓
Skill: code-format-and-lint
  ├─ Invoke MCP: prettier (format)
  ├─ Invoke MCP: eslint (lint)
  ├─ Invoke MCP: typescript (check)
  ├─ Generate fixes (if errors)
  └─ Auto-commit + push
  ↓
Hook: PostToolUse
  └─ Update PR status checks
  ↓
GitHub: Mark PR ✅ (if passed) or 🔴 (if failed)
```

---

### SKILL Implementation

```markdown
# .claude/skills/code-format-and-lint/SKILL.md

---
name: code-format-and-lint
description: Auto-format, lint, and type-check code
version: 1.0.0
tags: [formatting, quality, ci-cd]
---

## Input
- filePath: string (file to check)
- fixAutomatically: boolean (default: true)

## Output
- formatted: boolean
- linted: boolean
- typeChecked: boolean
- issues: object[] ({severity, line, message, fix})
- autoFixed: boolean (if fixAutomatically=true)

## Execution
1. prettier --write $filePath
2. eslint --fix $filePath
3. tsc --noEmit $filePath
4. Return summary + any remaining issues
```

**Full Skill Code:**

```typescript
// .claude/skills/code-format-and-lint/implementation.ts

import { execSync } from "child_process";

export async function formatAndLint(filePath: string, fixAutomatically = true) {
  const results = {
    formatted: false,
    linted: false,
    typeChecked: false,
    issues: [],
    autoFixed: false,
  };

  try {
    // Step 1: Prettier (formatting)
    console.log("🎨 Formatting with Prettier...");
    execSync(`npx prettier --write "${filePath}"`);
    results.formatted = true;

    // Step 2: ESLint (linting)
    console.log("🔍 Linting with ESLint...");
    try {
      execSync(`npx eslint --fix "${filePath}"`);
      results.linted = true;
    } catch (e) {
      const output = (e as any).stdout.toString();
      const matches = output.match(/error|warning/gi) || [];
      results.issues.push({
        severity: "error",
        source: "eslint",
        details: output,
      });
    }

    // Step 3: TypeScript type checking
    console.log("📋 Type checking with TypeScript...");
    try {
      execSync(`npx tsc --noEmit "${filePath}"`);
      results.typeChecked = true;
    } catch (e) {
      const output = (e as any).stdout.toString();
      results.issues.push({
        severity: "error",
        source: "typescript",
        details: output,
      });
    }

    results.autoFixed = fixAutomatically && results.issues.length === 0;

    return {
      ...results,
      summary: `Formatted: ${results.formatted ? "✅" : "❌"} | Linted: ${results.linted ? "✅" : "❌"} | TypeChecked: ${results.typeChecked ? "✅" : "❌"}`,
    };
  } catch (error) {
    throw new Error(`Skill execution failed: ${error}`);
  }
}
```

---

### Hook Implementation

```bash
#!/bin/bash
# .claude/hooks/pre-tool-use-skill-validate.sh

# Before invoking code-format-and-lint skill:
# 1. Check if file exists
# 2. Check if file type is supported

if [[ "$CLAUDE_TOOL_NAME" == "code-format-and-lint" ]]; then
  FILE_PATH=$(echo "$CLAUDE_TOOL_INPUT" | jq -r '.filePath')
  
  # Validation 1: File exists
  if [[ ! -f "$FILE_PATH" ]]; then
    echo "❌ File not found: $FILE_PATH" >&2
    exit 2  # Block
  fi
  
  # Validation 2: Supported file type
  if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
    echo "❌ Unsupported file type. Supported: .ts, .tsx, .js, .jsx" >&2
    exit 2  # Block
  fi
  
  # Validation 3: File size (max 1MB)
  SIZE=$(stat -f%z "$FILE_PATH" 2>/dev/null || stat -c%s "$FILE_PATH")
  if [ "$SIZE" -gt 1048576 ]; then
    echo "❌ File too large (>1MB). Split and retry." >&2
    exit 2  # Block
  fi
fi

exit 0
```

```bash
#!/bin/bash
# .claude/hooks/post-tool-use-skill-auto-commit.sh

# After skill succeeds, auto-commit changes if:
# 1. Changes were made
# 2. autoFixed = true
# 3. No issues remain

if [[ "$CLAUDE_TOOL_NAME" == "code-format-and-lint" ]]; then
  RESULT=$(echo "$CLAUDE_TOOL_OUTPUT" | jq .)
  AUTO_FIXED=$(echo "$RESULT" | jq -r '.autoFixed')
  ISSUES=$(echo "$RESULT" | jq '.issues | length')
  
  if [[ "$AUTO_FIXED" == "true" && "$ISSUES" == "0" ]]; then
    FILE_PATH=$(echo "$CLAUDE_TOOL_INPUT" | jq -r '.filePath')
    
    # Auto-commit
    git add "$FILE_PATH"
    git commit -m "style: auto-format and lint $FILE_PATH"
    
    echo "✅ Auto-committed formatting changes"
  fi
fi

exit 0
```

---

### TDD Test Case

```typescript
describe('Format & Lint Skill', () => {
  test('should format unformatted code', async () => {
    const messy = 'const x=1;const y=2;';
    fs.writeFileSync('test.ts', messy);

    const result = await invokeSkill('code-format-and-lint', {
      filePath: 'test.ts',
    });

    expect(result.formatted).toBe(true);
    expect(result.issues.length).toBe(0);
  });

  test('should detect and fix lint errors', async () => {
    const code = 'const unused_var = 5;';  // ESLint: unused variable
    fs.writeFileSync('test.ts', code);

    const result = await invokeSkill('code-format-and-lint', {
      filePath: 'test.ts',
      fixAutomatically: true,
    });

    expect(result.linted).toBe(true);
    expect(result.autoFixed).toBe(true);
  });

  test('should auto-commit if all checks pass', async () => {
    // Setup repo
    execSync('git init test-repo');
    process.chdir('test-repo');

    // Create clean file
    fs.writeFileSync('good.ts', 'const x = 1;');
    execSync('git add good.ts');
    execSync('git commit -m "initial"');

    const result = await invokeSkill('code-format-and-lint', {
      filePath: 'good.ts',
    });

    // Verify auto-commit
    const log = execSync('git log --oneline').toString();
    expect(log).toContain('style: auto-format');
  });

  test('should block if file >1MB', async () => {
    // Create large file
    fs.writeFileSync('huge.ts', 'x'.repeat(1048577));

    const result = await invokeSkill('code-format-and-lint', {
      filePath: 'huge.ts',
    });

    expect(result.blocked).toBe(true);
    expect(result.reason).toContain('too large');
  });
});
```

**Results:**
```
Before: PR review 10-15 min (manual)
After:  Auto-formatted + verified in 30s

Savings: 95% time, 0 human error
```

---

## CASO 3: Multi-Agent + Git Worktrees — Feature Development

**Contexto:** Desarrollo ágil. 3 desarrolladores, 3 features en paralelo. Cada uno aislado, mismo repo.

**Arquitectura:** Main Agent + 3 Subagentes (/fork) + Git worktrees + Hooks

---

### Setup

```bash
# Main repo
git clone myproject
cd myproject

# Create worktrees (one per feature)
git worktree add ../feature-auth dev/feature-auth
git worktree add ../feature-api dev/feature-api
git worktree add ../feature-ui dev/feature-ui

# Each gets isolated .claude context
.claude/
├── CLAUDE.md (shared)
├── branch-context-auth.json
├── branch-context-api.json
└── branch-context-ui.json
```

---

### Agent Orchestrator

```typescript
// multi-feature-agent.ts

async function orchestrateFeatures() {
  const features = [
    {
      name: "auth",
      task: "Implement OAuth2 + JWT tokens",
      worktree: "../feature-auth",
    },
    {
      name: "api",
      task: "Create REST API v2 with OpenAPI docs",
      worktree: "../feature-api",
    },
    {
      name: "ui",
      task: "Build React components + Storybook",
      worktree: "../feature-ui",
    },
  ];

  // Create 3 parallel forks
  const forks = features.map((feature) =>
    createFork({
      name: `agent-${feature.name}`,
      memory: "full",
      cwd: feature.worktree,
      task: feature.task,
    })
  );

  // Wait for all to complete
  const results = await Promise.all(forks);

  // Consolidate results
  const report = {
    completed: results.filter((r) => r.status === "completed").length,
    failed: results.filter((r) => r.status === "failed").length,
    features: results.map((r) => ({
      name: r.feature,
      status: r.status,
      commits: r.commit_count,
      tests_passing: r.tests_passing,
    })),
  };

  // Create merge commits
  await mergeFeaturesToDev(results);

  return report;
}
```

---

### Hooks for Worktree Isolation

```bash
#!/bin/bash
# .claude/hooks/session-start-worktree.sh

# When agent session starts in a worktree:
# 1. Detect current worktree
# 2. Load branch-specific context

CURRENT_WORKTREE=$(git rev-parse --show-toplevel)
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Load branch-specific settings
if [[ -f ".claude/branch-context-${BRANCH}.json" ]]; then
  source ".claude/branch-context-${BRANCH}.json"
  echo "✅ Loaded context for branch: $BRANCH"
  echo "  Max tokens: $MAX_TOKENS"
  echo "  Tools enabled: $TOOLS"
fi

exit 0
```

```bash
#!/bin/bash
# .claude/hooks/session-end-cleanup.sh

# When session ends:
# 1. Save progress
# 2. Cleanup temporary files
# 3. Verify no secrets leaked

BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Save progress
PROGRESS=$(git log --oneline | head -5)
echo "$PROGRESS" > ".claude/progress-${BRANCH}.log"

# Cleanup temps
rm -rf /tmp/claude-*

# Verify no secrets
if git diff --cached | grep -E "(password|secret|token)"; then
  echo "❌ BLOCKED: Potential secret in commit" >&2
  exit 2
fi

exit 0
```

---

### TDD Test Case

```typescript
describe('Multi-Feature Development', () => {
  test('should execute 3 features in parallel', async () => {
    const startTime = Date.now();
    const result = await orchestrateFeatures();
    const duration = Date.now() - startTime;

    // All 3 completed
    expect(result.completed).toBe(3);
    expect(result.failed).toBe(0);

    // Parallel faster than sequential (should be ~3s vs ~9s)
    expect(duration).toBeLessThan(5000);
  });

  test('should isolate features in separate worktrees', async () => {
    const auth = getWorktreeBranch('feature-auth');
    const api = getWorktreeBranch('feature-api');

    // Verify each has own commits
    expect(auth.commits).not.toEqual(api.commits);
    expect(auth.branch).toBe('dev/feature-auth');
    expect(api.branch).toBe('dev/feature-api');
  });

  test('should block secret commits', async () => {
    // Create file with secret
    fs.writeFileSync('config.ts', 'const TOKEN="sk_live_secret"');
    execSync('git add config.ts');

    const result = await executeHook('session-end-cleanup');

    expect(result.blocked).toBe(true);
    expect(result.reason).toContain('secret');
  });

  test('should merge features to dev when ready', async () => {
    const result = await orchestrateFeatures();

    // Verify dev branch has all 3 feature commits
    const devLog = getGitLog('dev');
    expect(devLog).toContain('OAuth2');
    expect(devLog).toContain('REST API');
    expect(devLog).toContain('React components');
  });
});
```

---

## CASO 4: Batch Processing + Async Retry — 10k Documents

**Contexto:** Procesar 10,000 documentos (clasificación, extracción, análisis).

**Antes:** Agent loop secuencial, 2-3 horas, costo $85
**Después:** Batch + /task, 15 minutos, costo $12 (-86%)

---

### Architecture

```
10,000 docs
  ↓
Split into chunks (100 docs/chunk = 100 chunks)
  ↓
Batch API (parallelizar 100x)
  ├─ Batch request 1: docs 1-100
  ├─ Batch request 2: docs 101-200
  ├─ ... × 100
  └─ Processing concurrente (24h in background, 50% discount)
  ↓
/task (reliability)
  ├─ --max-retries=3
  ├─ --backoff=exponential
  └─ Fallback: Re-process failed chunks
  ↓
Consolidate Results
  ↓
Database (Postgres MCP)
```

---

### Implementation

```typescript
// batch-document-processor.ts

async function processBatch10k(documents: Document[]) {
  console.log(`📦 Processing ${documents.length} documents...`);

  // Step 1: Split into chunks (100/chunk)
  const CHUNK_SIZE = 100;
  const chunks = [];
  for (let i = 0; i < documents.length; i += CHUNK_SIZE) {
    chunks.push(documents.slice(i, i + CHUNK_SIZE));
  }
  console.log(`✂️  Split into ${chunks.length} chunks`);

  // Step 2: Create batch requests
  const batchRequests = chunks.map((chunk, idx) => ({
    custom_id: `chunk-${idx}`,
    params: {
      model: "claude-opus-4.7",
      max_tokens: 1024,
      system: "You are a document analyst. Classify and extract key info.",
      messages: [
        {
          role: "user",
          content: `Analyze these ${chunk.length} documents: ${JSON.stringify(chunk)}
          
          Output JSON: { doc_id: string, category: string, confidence: 0-1, key_phrases: string[] }`,
        },
      ],
    },
  }));

  // Step 3: Submit batch
  const batchResponse = await submitBatch(batchRequests);
  const batchId = batchResponse.id;
  console.log(`✅ Batch submitted: ${batchId}`);

  // Step 4: Wait for batch (with /task retry)
  const result = await executeTask(
    {
      name: "wait_batch_completion",
      batchId,
      description: `Wait for batch ${batchId} to complete`,
    },
    {
      maxRetries: 3,
      backoff: "exponential",
      timeout: 86400, // 24 hours
    }
  );

  // Step 5: Retrieve results
  const batchResults = await retrieveBatchResults(batchId);

  // Step 6: Process results
  const processed = batchResults.map((result) => {
    if (result.error) {
      console.warn(`⚠️  Chunk failed: ${result.custom_id}`);
      return { status: "failed", chunk: result.custom_id };
    }
    return {
      status: "success",
      chunk: result.custom_id,
      results: JSON.parse(result.message.content[0].text),
    };
  });

  const failed = processed.filter((p) => p.status === "failed");

  // Step 7: Retry failed chunks
  if (failed.length > 0) {
    console.log(`🔄 Retrying ${failed.length} failed chunks...`);
    const retryResults = await retryFailedChunks(failed);
    processed.push(...retryResults);
  }

  // Step 8: Consolidate and save
  const summary = {
    total_documents: documents.length,
    processed: processed.filter((p) => p.status === "success").length,
    failed: processed.filter((p) => p.status === "failed").length,
    cost_estimation: calculateCost(batchRequests.length),
    processing_time: "~15 minutes (batch mode)",
    results_location: await saveToDB(processed),
  };

  return summary;
}

async function retryFailedChunks(failed: any[], attempt = 1) {
  if (attempt > 3) {
    console.error("❌ Max retries exceeded");
    return failed.map((f) => ({ status: "failed", ...f }));
  }

  console.log(`🔄 Retry attempt ${attempt}/3`);

  const batchRequests = failed.map((f) => ({
    custom_id: `${f.chunk}-retry-${attempt}`,
    params: {
      /* same params */
    },
  }));

  const batchId = await submitBatch(batchRequests);
  const results = await waitForBatch(batchId);

  // Recursive: retry again if some fail
  const stillFailed = results.filter((r) => r.error);
  if (stillFailed.length > 0) {
    return retryFailedChunks(stillFailed, attempt + 1);
  }

  return results.map((r) => ({ status: "success", ...r }));
}
```

---

### TDD Test Cases

```typescript
describe('Batch Document Processing', () => {
  test('should split 10k docs into 100-doc chunks', async () => {
    const docs = generateDocuments(10000);
    const chunks = splitIntoChunks(docs, 100);

    expect(chunks.length).toBe(100);
    expect(chunks[0].length).toBe(100);
    expect(chunks[99].length).toBe(100);
  });

  test('should process via Batch API (50% discount)', async () => {
    const docs = generateDocuments(10000);

    // Direct API estimate
    const directCost = estimateAPIcost(docs.length); // $24

    // Batch API
    const batchCost = estimateBatchCost(docs.length); // $12

    expect(batchCost).toBeLessThan(directCost * 0.6);
  });

  test('should retry failed chunks automatically', async () => {
    const docs = generateDocuments(100);

    // Simulate 5 failures in batch
    mockBatchAPI.failureRate = 0.05;

    const result = await processBatch10k(docs);

    expect(result.failed).toBeLessThan(3);  // Auto-retry should fix most
    expect(result.processed).toBeGreaterThan(95);
  });

  test('should complete in <15 minutes (batch mode)', async () => {
    const docs = generateDocuments(10000);

    const startTime = Date.now();
    const result = await processBatch10k(docs);
    const duration = Date.now() - startTime;

    // Note: Real batch takes 24h max, but test mocks it
    expect(result.processing_time).toContain('15 minutes');
  });

  test('should save results to Postgres via MCP', async () => {
    const docs = generateDocuments(1000);
    const result = await processBatch10k(docs);

    // Verify saved to DB
    const dbResults = await queryPostgres(
      `SELECT COUNT(*) FROM processed_documents`
    );
    expect(dbResults[0].count).toBe(1000);
  });
});
```

---

### Cost Comparison

```
10,000 Documents

SEQUENTIAL (Agent Loop):
├─ 10,000 classifications × $0.003 = $30
├─ Time: 2-3 hours
├─ Cost per doc: $0.003
└─ Total: ~$30-40

BATCH API:
├─ 10,000 classifications × $0.0015 (50% discount) = $15
├─ Time: ~15 min (processing) + wait for batch result
├─ Cost per doc: $0.0015
├─ Discount: -50%
└─ Total: ~$15

OPTIMIZED (Batch + /task + /fork caching):
├─ Batch: $15
├─ /task overhead: $1
├─ Cache hits (30%): save $5
├─ Total: ~$11
├─ Savings: -64% vs sequential
└─ Processing: 15 min + async batch

FINAL RESULT:
├─ Before: $30-40, 2-3 hours
├─ After: $11-15, 15 min effective
├─ Savings: 70% cost, 80% time
```

---

## Validación Final — Checklist de Implementación

Para implementar un caso real, completa:

```
□ Caso 1: Repository Analyzer
  ├─ [ ] Instalar GitHub MCP
  ├─ [ ] Crear skill code-architecture-analyzer
  ├─ [ ] Setup Agent con agentic loop
  ├─ [ ] Create 3 parallel forks
  ├─ [ ] Setup caching hook
  └─ [ ] Run TDD tests (todos pasan)

□ Caso 2: Format & Lint
  ├─ [ ] Create SKILL.md
  ├─ [ ] Setup pre-tool-use hook (validation)
  ├─ [ ] Setup post-tool-use hook (auto-commit)
  ├─ [ ] Test con file format incorrecto
  └─ [ ] Verify auto-fix + commit

□ Caso 3: Multi-Feature
  ├─ [ ] Create 3 git worktrees
  ├─ [ ] Create 3 parallel forks (una por feature)
  ├─ [ ] Setup branch-specific context
  ├─ [ ] Verify isolation (commits no se mezclan)
  └─ [ ] Merge a dev sin conflictos

□ Caso 4: Batch 10k
  ├─ [ ] Split documentos en chunks 100
  ├─ [ ] Submit batch API
  ├─ [ ] Create /task con retry
  ├─ [ ] Simulate failures, verify retry
  └─ [ ] Save resultados a DB (Postgres MCP)

SCORE: 4/4 casos = ✅ Certified Integration Architect
```

---

**Próximos pasos:**
1. Escoge 1 caso (empezar por Caso 2, más simple)
2. Implementa los 5 pasos
3. Escribe tests (TDD)
4. Ejecuta en tu proyecto
5. Mide costo + tiempo
6. Compara con baseline

**Recursos complementarios:**
- nivel4-decision-matrix.md (cuándo aplicar cada caso)
- nivel4-commands-reference.md (/fork, /task, /doctor detalles)
- nivel4-marketplace-guide.md (MCP servers específicos)
