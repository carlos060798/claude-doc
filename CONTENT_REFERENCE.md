# Content Reference: All Restored Sections

## File Location
`lib/allSectionsContent-expanded.js`

## Quick Navigation

### Agent SDK (`agente-sdk`)
| Code Block | Lines | Purpose | Language |
|-----------|-------|---------|----------|
| `sdk-basic-agent` | 105 | Complete agent with file/bash tools | TypeScript |
| `sdk-streaming` | 35 | Real-time streaming responses | TypeScript |
| `sdk-multi-agent` | 55 | Parallel sub-agents orchestration | TypeScript |
| `sdk-vision` | 45 | Image and screenshot analysis | TypeScript |

**Workflows**: 1 (PR reviewer with 4 stages)  
**Pitfalls**: 4 documented

### Anthropic API (`api-anthropic`)
| Code Block | Lines | Purpose | Language |
|-----------|-------|---------|----------|
| `api-tool-use` | 80 | Complete tool use loop pattern | TypeScript |
| `api-streaming` | 40 | Stream event handling | TypeScript |
| `api-batch-processing` | 60 | 10K request batch processing | TypeScript |
| `api-files` | 55 | File upload and persistence | TypeScript |
| `api-prompt-caching` | 50 | 90% cost savings with caching | TypeScript |
| `api-vision` | 45 | Image and document analysis | TypeScript |
| `api-error-handling` | 50 | Exponential backoff retry | TypeScript |

**Workflows**: 1 (batch classification pipeline)  
**Pitfalls**: 6 documented

### Level 4: Mastery (`nivel-4`)
| Section | Items | Purpose |
|---------|-------|---------|
| Production patterns | 3 patterns | Multi-region, rate limiting, observability |
| Scaling strategies | 3 strategies | Vertical, horizontal, hybrid approaches |
| Security hardening | 8 checklist items | Complete security verification |
| Code blocks | 2 | Production agent with logging, rate limiting |

## Code Block Details

### Agent SDK Blocks

#### 1. Basic Agent (`sdk-basic-agent`)
**What it demonstrates:**
- Tool definition with proper JSON schemas
- Tool use loop (while response.stop_reason === 'tool_use')
- Result handling and iteration
- Error handling in tool execution

**When to use:**
- Starting point for custom agents
- Learning tool use pattern
- Building file/command-based agents

**Key lines:**
- Line 35-55: Tool definitions
- Line 64-75: Main loop with tool result handling
- Line 78-95: Result processing

---

#### 2. Streaming Responses (`sdk-streaming`)
**What it demonstrates:**
- Real-time streaming of responses
- Using process.stdout for live updates
- Accumulating full response while streaming

**When to use:**
- Web applications needing real-time feedback
- CLI tools showing progress
- Long-running operations

**Key patterns:**
```typescript
for await (const event of stream) {
  if (event.type === 'content_block_delta') {
    process.stdout.write(event.delta.text);
  }
}
```

---

#### 3. Multi-Agent Orchestration (`sdk-multi-agent`)
**What it demonstrates:**
- Launching parallel agents with `Promise.all`
- Specialist agents with custom system prompts
- Consolidating results from multiple sources

**When to use:**
- Code review (security + quality + performance)
- Document analysis (content + structure + metadata)
- Any task requiring multiple perspectives

**Performance:**
- Run in parallel: 3 agents complete in ~3 seconds
- Sequential: same agents take ~9 seconds
- Speedup: 3x faster

---

#### 4. Vision-Capable Agent (`sdk-vision`)
**What it demonstrates:**
- Base64 image encoding
- Media type detection
- Image analysis in messages

**When to use:**
- UI/UX review from screenshots
- Diagram interpretation
- Document scanning
- Error diagnosis from screenshots

**Supported formats:**
- PNG (image/png)
- JPEG (image/jpeg)
- GIF (image/gif)
- WebP (image/webp)

---

### Anthropic API Blocks

#### 1. Tool Use Loop (`api-tool-use`)
**What it demonstrates:**
- Tool definition with JSON schemas
- Complete iteration pattern
- Type-safe tool use with TypeScript

**Key pattern:**
```
1. Create message with tools
2. While stop_reason === 'tool_use':
   a. Extract tool calls
   b. Execute tools
   c. Add results to messages
   d. Call API again
3. Extract final text response
```

**Critical:** Must handle stop_reason correctly

---

#### 2. Streaming (`api-streaming`)
**What it demonstrates:**
- Using .stream() method
- Event listeners (text, message)
- Async iteration

**Three patterns shown:**
1. Event listener: `stream.on('text', ...)`
2. Message event: `stream.on('message', ...)`
3. Async iterator: `for await (const chunk of stream)`

---

#### 3. Batch Processing (`api-batch-processing`)
**What it demonstrates:**
- Creating batch with 1000s of requests
- Polling for completion
- Streaming results

**Cost advantage:**
- Regular API: $0.003 per 1K input tokens
- Batch API: $0.0015 per 1K input tokens
- **50% savings** on large volumes

**Ideal for:**
- Classification tasks
- Overnight processing
- Batch transformations

---

#### 4. Files API (`api-files`)
**What it demonstrates:**
- Upload once, reference by ID
- Using file_id in multiple messages
- Cleanup with delete

**Cost comparison:**
- No files API: upload 1000 PDFs = expensive tokens
- With files API: upload 1000 PDFs, reuse 1000 times

**Supports:**
- PDF documents
- Images
- Text files
- Structured documents

---

#### 5. Prompt Caching (`api-prompt-caching`)
**What it demonstrates:**
- Adding cache_control to system prompts
- Metrics: `cache_creation_input_tokens`, `cache_read_input_tokens`
- Massive cost savings

**Example savings:**
- System prompt: 10,000 tokens
- First call: create cache (10K tokens billed)
- Second call: read from cache (1K tokens billed, 90% off)
- 100 calls: save $40+ on that prompt alone

**Best practices:**
```typescript
system: [
  { type: 'text', text: 'Short instruction' },
  {
    type: 'text',
    text: 'Large specification',
    cache_control: { type: 'ephemeral' }  // Cache this!
  }
]
```

---

#### 6. Vision API (`api-vision`)
**What it demonstrates:**
- Image encoding from file
- Media type detection
- Image + text together

**Capabilities:**
- Describe visual content
- Extract text from images
- Analyze diagrams
- Review UI/UX
- Read charts and graphs

---

#### 7. Error Handling (`api-error-handling`)
**What it demonstrates:**
- Exponential backoff: `2^attempt * 1000ms`
- Status-code specific handling
- Distinguishing retryable vs terminal errors

**Status codes:**
- 429: Rate limited (retry)
- 529: Overloaded (retry)
- 401: Auth failed (DON'T retry)
- 500+: Server error (retry with longer wait)

---

### Level 4 Code Blocks

#### 1. Production Agent (`level4-production-agent`)
**What it demonstrates:**
- Winston logging integration
- Metrics tracking (tokens, cost, duration)
- Observable agent for production

**Metrics captured:**
- User ID
- Token usage (input/output)
- Estimated cost
- Execution time
- Success/failure status

**Observability integration:**
- Logs to file (error.log, combined.log)
- Sends metrics to monitoring service
- Tracks cost per user

---

#### 2. Rate Limiting (`level4-rate-limiting`)
**What it demonstrates:**
- Per-user quota tracking
- Daily limits with auto-reset
- Tier-based quotas (VIP, standard)

**Features:**
- 24-hour rolling window
- VIP tier: 1M tokens/day
- Standard tier: 100K tokens/day
- Real-time quota checking

---

## Common Pitfalls & Solutions

### Agent SDK

1. **Timeout in slow agents**
   - ❌ Don't: Wait indefinitely for agent response
   - ✅ Do: Set timeout per agent, handle gracefully

2. **Ignoring stop_reason**
   - ❌ Don't: Assume stop_reason is always 'end_turn'
   - ✅ Do: Check for 'tool_use', 'max_tokens', other values

3. **Not forcing tool use**
   - ❌ Don't: Hope agent uses a tool when optional
   - ✅ Do: Use `tool_choice: {"type": "any"}` when needed

4. **Losing state between calls**
   - ❌ Don't: Create new agent for each message
   - ✅ Do: Keep message history in memory or DB

### Anthropic API

1. **Tool use infinite loop**
   - ❌ Don't: Loop forever on tool_use responses
   - ✅ Do: Check stop_reason, max iteration count

2. **Streaming without buffering**
   - ❌ Don't: Process partial text immediately
   - ✅ Do: Accumulate and process full response

3. **Cache control on all prompts**
   - ❌ Don't: Cache small or frequently-changing prompts
   - ✅ Do: Cache only stable, reusable content

4. **Ignoring Batch API queuing**
   - ❌ Don't: Call API immediately for batch
   - ✅ Do: Implement proper polling/webhook

### Level 4 / Production

1. **No rate limiting**
   - ❌ Don't: Let users consume unlimited quota
   - ✅ Do: Implement soft limits with warnings, hard limits with blocks

2. **No observability**
   - ❌ Don't: Fire and forget API calls
   - ✅ Do: Track metrics, log errors, monitor costs

3. **API key in code**
   - ❌ Don't: Hardcode `ANTHROPIC_API_KEY`
   - ✅ Do: Use environment variables, rotate regularly

4. **No error recovery**
   - ❌ Don't: Crash on 429/529
   - ✅ Do: Exponential backoff with jitter

---

## Usage Examples

### Import and Use
```javascript
import { EXPANDED_SECTIONS } from './lib/allSectionsContent-expanded.js';

// Get all code blocks for Agent SDK
const blocks = EXPANDED_SECTIONS['agente-sdk'].codeBlocks;
blocks.forEach(block => console.log(block.title, block.lang));

// Get specific code block
const basicAgent = EXPANDED_SECTIONS['agente-sdk'].codeBlocks.find(
  b => b.id === 'sdk-basic-agent'
);
console.log(basicAgent.code);

// Get pitfalls
const pitfalls = EXPANDED_SECTIONS['agente-sdk'].commonPitfalls;
pitfalls.forEach(p => console.warn('Pitfall:', p));

// Get production patterns
const patterns = EXPANDED_SECTIONS['nivel-4'].sections[0].patterns;
patterns.forEach(p => console.log(p.name, p.description));
```

### Render in UI
```javascript
function renderCodeBlock(id) {
  let section = null;
  let block = null;
  
  // Find block in all sections
  for (const [sectionId, content] of Object.entries(EXPANDED_SECTIONS)) {
    if (content.codeBlocks) {
      block = content.codeBlocks.find(b => b.id === id);
      if (block) {
        section = sectionId;
        break;
      }
    }
  }
  
  if (!block) return 'Block not found';
  
  return `
    <div class="code-block">
      <h4>${block.title}</h4>
      <p>${block.description}</p>
      <pre><code class="language-${block.lang}">${block.code}</code></pre>
    </div>
  `;
}
```

---

## Statistics

- **Total Code Blocks**: 13
- **Total Lines of Code**: ~1,200
- **Languages**: TypeScript (primary), Bash, Python
- **Workflows**: 4 documented
- **Production Patterns**: 11
- **Security Checklist Items**: 8
- **Common Pitfalls**: 20+
- **File Size**: ~65KB uncompressed

---

## What's NOT Included

These topics are covered in the main `allSectionsContent.js`:
- Basic installation
- Slash commands reference
- CLAUDE.md structure
- Skills creation
- MCP basics
- Git workflows
- Level 1-3 fundamentals

This file (`allSectionsContent-expanded.js`) is specifically for:
- ✓ Advanced Agent SDK usage
- ✓ Anthropic API deep dive
- ✓ Production patterns & scaling
- ✓ Real-world code examples
- ✓ Error handling strategies
- ✓ Cost optimization techniques

---

**Last Updated**: 2026-05-17  
**Recovered from**: Original `index.html` SPA  
**Status**: Production-ready with safety checks
