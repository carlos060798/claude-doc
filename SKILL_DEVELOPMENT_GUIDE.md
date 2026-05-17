# Comprehensive Claude Code Skill Development Workflow

A complete guide to designing, building, debugging, and deploying custom Skills in Claude Code.

---

## Table of Contents

1. [Skill Frontmatter Specification](#skill-frontmatter-specification)
2. [Skill Template (Copy-Paste Ready)](#skill-template-copy-paste-ready)
3. [Skill Development Workflow](#skill-development-workflow)
4. [Debugging Guide](#debugging-guide)
5. [Best Practices](#best-practices)
6. [Real Examples](#real-examples)
7. [Advanced Techniques](#advanced-techniques)
8. [Troubleshooting](#troubleshooting)

---

## Skill Frontmatter Specification

Every skill MUST begin with YAML frontmatter enclosed in `---` delimiters. This metadata drives skill discovery, permissions, and behavior.

### Complete Frontmatter Fields Reference

```yaml
---
name: unique-skill-identifier                    # REQUIRED: kebab-case, 2-64 chars, no spaces
description: One-line description of skill       # REQUIRED: <100 chars, user-facing
author: Your Name                                # RECOMMENDED: Creator attribution
version: 1.0.0                                   # RECOMMENDED: semver, helps with updates
instructions: |                                  # REQUIRED: Role + mission definition
  You are a specialized assistant for [domain].
  Your job is to [specific tasks].
  Use tools strategically; explain your approach.
allowed-tools: [Tool1, Tool2, Tool3]            # REQUIRED: List of tools this skill uses
scope: session                                   # OPTIONAL: session|global|workspace (default: session)
tags: [productivity, code-review, automation]    # RECOMMENDED: 2-4 tags for discoverability
hooks: PreToolUse, PostToolUse                  # OPTIONAL: Lifecycle events (see hooks section)
---
```

### Field Definitions

#### `name` (REQUIRED)
- **Format**: `kebab-case-identifier`
- **Length**: 2-64 characters
- **Rules**:
  - Lowercase letters, numbers, hyphens only
  - No spaces or special characters
  - Unique across all installed skills
  - Matches directory name: `~/.claude/skills/{name}/SKILL.md`
- **Example**: `code-review`, `db-schema-analyzer`, `pr-summarizer`

#### `description` (REQUIRED)
- **Format**: Plain text, single line
- **Length**: <100 characters (soft limit)
- **Purpose**: Shown in skill autocomplete and skill browser
- **Tips**:
  - Lead with action verb: "Review", "Generate", "Analyze"
  - Be specific about domain: "for Python projects" vs generic
  - Include audience hint: "for developers", "for data analysts"
- **Examples**:
  - `Review code changes for security, performance, and correctness.`
  - `Generate database migration scripts from schema diffs.`
  - `Analyze git history and create team standup updates.`

#### `author` (RECOMMENDED)
- **Format**: Name or email
- **Purpose**: Attribution and contact
- **Example**: `author: Danilo Angarita <daniloangaritagarcia@gmail.com>`

#### `version` (RECOMMENDED)
- **Format**: Semantic versioning (`MAJOR.MINOR.PATCH`)
- **Purpose**: Track skill updates; allows version pinning
- **Examples**: `1.0.0`, `2.1.3`, `0.9.0-beta`
- **Practices**:
  - Start at `1.0.0` when stable
  - Bump PATCH for bug fixes
  - Bump MINOR for new features
  - Bump MAJOR for breaking changes to tool requirements or output format

#### `instructions` (REQUIRED)
- **Format**: Multi-line YAML string (use `|` for block literal)
- **Length**: 200-2000 words typical
- **Contents**:
  1. **Role definition**: `You are a [specialist] for [domain].`
  2. **Primary mission**: Clear statement of what the skill does
  3. **Key principles**: 3-5 guiding principles
  4. **Tools available**: List tools and their use cases
  5. **Output format**: How results should be structured
  6. **Edge cases**: Known limitations and how to handle them
- **Best practices**:
  - Be prescriptive: "Always show error handling" vs vague
  - Use second person: "Your job is to..." (clearer intent)
  - Include examples of desired vs undesired output
  - Mention token/cost constraints for expensive skills

#### `allowed-tools` (REQUIRED)
- **Format**: Comma or space-separated list of tool names
- **Valid built-in tools**:
  - `Bash` — Run shell commands (Unix syntax on all platforms)
  - `Read` — Read file contents
  - `Write` — Write/create files
  - `Edit` — Modify existing files (diffs only)
  - `Glob` — Fast file pattern matching
  - `Grep` — Content search with regex
- **MCP tools** (if MCP servers connected):
  - Tool names from connected MCPs (e.g., `github`, `slack`, `jira`)
- **Pseudo-tools**:
  - `WebSearch` — Search the public web
  - `WebFetch` — Fetch and analyze web pages
- **Examples**:
  ```yaml
  allowed-tools: Read, Bash, Write
  allowed-tools: Bash, Grep, Glob, Edit
  allowed-tools: Read, WebSearch, WebFetch
  ```
- **Permissions**: User must approve tool use; tools listed here become permission requests

#### `scope` (OPTIONAL)
- **Values**:
  - `session` (default) — Active only in current Claude Code session
  - `global` — Available across all sessions (persistent)
  - `workspace` — Shared with team in workspace
- **Guidance**:
  - Use `session` for experimental/personal skills
  - Use `global` for production skills you reuse
  - Use `workspace` for team-standardized skills
- **Default**: `session`

#### `tags` (RECOMMENDED)
- **Format**: Comma-separated or YAML list
- **Purpose**: Help users discover skills via search/browse
- **Suggested tags**:
  - **Category**: `productivity`, `code-review`, `documentation`, `debugging`
  - **Language**: `python`, `javascript`, `rust`, `go`
  - **Domain**: `web`, `mobile`, `data`, `devops`, `security`
  - **Feature**: `automation`, `analysis`, `generation`, `testing`
- **Best practices**:
  - Use 2-4 tags per skill
  - Prefer existing tags over new ones
  - Include one category tag
- **Example**: `tags: code-review, security, automation`

#### `hooks` (OPTIONAL)
- **Format**: Comma-separated list of hook names
- **Available hooks** (fired in order):
  - `PreToolUse` — Before any tool execution
  - `PostToolUse` — After tool completes
  - `PreOutput` — Before Claude sends response to user
  - `PostOutput` — After response sent (logging only)
  - `PreFork` — Before context fork created
  - `PostFork` — After fork completes
  - Custom hooks — Defined in `.claude/settings.json`
- **Use case**: Register callbacks for event-driven behavior
- **Example**: `hooks: PreToolUse, PostToolUse`
- **Note**: Requires configuration in `.claude/settings.json` to actually trigger

---

## Skill Template (Copy-Paste Ready)

### Minimal Skill (Getting Started)

```markdown
---
name: my-first-skill
description: Brief one-liner describing what this skill does
author: Your Name
version: 1.0.0
instructions: |
  You are a specialized assistant for [DOMAIN].
  
  Your primary mission:
  - [Goal 1]
  - [Goal 2]
  - [Goal 3]
  
  Key principles:
  1. Always [principle 1]
  2. Never [anti-pattern]
  3. Prefer [approach] over [alternative]
  
  Available tools:
  - Bash: Execute shell commands
  - Read: Load files into context
  - Write: Create/save files
  - Edit: Modify files (diffs only)
  
  Output format:
  Structure your response as:
  1. Summary (1-2 sentences)
  2. Key findings (bullet list)
  3. Recommendations (numbered)
  4. Next steps
allowed-tools: Bash, Read, Write, Edit
scope: session
tags: [tag1, tag2]
---

# [Skill Name]

## Your Role

You are [specialist description]. Your job is to help users [accomplish task] by [approach].

## How You Operate

1. **Understand the context**: Ask clarifying questions if needed
2. **Plan your approach**: Explain what you'll do before doing it
3. **Execute systematically**: Use tools in logical order
4. **Validate results**: Check for errors or edge cases
5. **Summarize findings**: Provide clear, actionable results

## Example Usage

```
User: [Use case example]
You: [Your response following the pattern above]
```

## Constraints

- [Constraint 1, e.g., "Works best with Python 3.8+"]
- [Constraint 2, e.g., "Requires git repository"]
```

### Production-Grade Skill Template

```markdown
---
name: production-skill-name
description: Generate Rust structs from TypeScript interfaces with full validation
author: Your Name <your.email@example.com>
version: 2.1.0
instructions: |
  You are an expert polyglot developer and type system specialist.
  
  PRIMARY MISSION:
  Convert TypeScript type definitions to Rust struct code with semantic equivalence.
  
  CONSTRAINTS:
  - Only process valid TypeScript interfaces (reject union types, function overloads)
  - Preserve optionality: TS `field?: string` → Rust `Option<String>`
  - Map TS types to idiomatic Rust:
    * string → String (or &str if documented as borrowed)
    * number → i32 or f64 (infer from usage context)
    * boolean → bool
    * array[T] → Vec<T>
    * object → struct or enum (as appropriate)
  - Generate #[derive(Debug, Clone, Serialize, Deserialize)]
  - Add field-level documentation: /// doc comments
  
  EDGE CASES:
  1. Recursive types → Use Box<T> with explanation
  2. Branded types (e.g., `UserId: string`) → Suggest newtype pattern
  3. TS any → Reject with explanation; ask user to specify type
  4. Generic constraints → Translate <T extends Constraint> to Rust trait bounds
  
  OUTPUT FORMAT:
  ```rust
  // Converted from: [TS file path]
  // Conversion date: [ISO date]
  // Manual review required: [Yes/No]
  
  use serde::{Deserialize, Serialize};
  
  /// [Field docs from original]
  #[derive(Debug, Clone, Serialize, Deserialize)]
  pub struct StructName {
      pub field_name: FieldType,
  }
  ```
  
  ALWAYS:
  - Explain any inferred decisions (type choices, patterns used)
  - Call out manual review required (generics, recursive types, complex patterns)
  - Offer to iterate if user requests changes
  
  NEVER:
  - Generate unsafe code without explicit user approval
  - Use deprecated Rust idioms (old serde syntax, pre-2018 edition)
  - Skip field documentation
  
allowed-tools: Read, Write, Bash
scope: global
tags: [code-generation, typescript, rust, type-systems]
hooks: PreToolUse, PostToolUse
---

# TypeScript-to-Rust Converter

## What This Skill Does

Translates TypeScript interfaces and type definitions into idiomatic Rust struct definitions, handling type mapping, optionality, and edge cases.

## Usage Examples

### Example 1: Simple Interface

**Input** (TypeScript):
```typescript
interface User {
  id: number;
  name: string;
  email?: string;
  createdAt: Date;
}
```

**Output** (Rust):
```rust
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

/// User account information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    /// Unique user identifier
    pub id: i32,
    /// User's full name
    pub name: String,
    /// Optional email address
    pub email: Option<String>,
    /// Account creation timestamp
    pub created_at: DateTime<Utc>,
}
```

### Example 2: Complex Types (with Notes)

**Input** (TypeScript):
```typescript
interface Response<T> {
  status: 'success' | 'error';
  data?: T;
  errors: string[];
}
```

**Output** (Rust):
```rust
use serde::{Deserialize, Serialize};

/// API response wrapper with generic data type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Response<T> {
    /// Response status
    pub status: ResponseStatus,
    /// Payload (only on success)
    pub data: Option<T>,
    /// Error messages (if any)
    pub errors: Vec<String>,
}

/// Response status enum
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ResponseStatus {
    #[serde(rename = "success")]
    Success,
    #[serde(rename = "error")]
    Error,
}
```

**Note**: TS union types → Rust enums (semantic equivalent, better pattern-matching)

## When to Use This Skill

- Converting TS/JS server code to Rust backend
- Generating data models from shared type definitions
- Migrating API contracts between languages
- Creating FFI bindings from TS schemas

## Limitations

- Does not handle complex build-time transforms (decorators, compiler plugins)
- Requires unambiguous TS definitions (use `--strict` mode)
- Manual review needed for generic constraints and recursive types
```

---

## Skill Development Workflow

Follow this step-by-step process to build, test, and deploy a new skill.

### Step 1: Define What Your Skill Does

Before writing code, clarify the skill's purpose and scope.

**Worksheet**:
```
Name: ____________________________
(kebab-case, unique, descriptive)

Domain: ___________________________
(e.g., "Python code quality", "AWS infrastructure")

Primary Use Case:
_____________________________________________
_____________________________________________

Typical User:
_____________________________________________
(e.g., "Python developers", "DevOps engineers")

Key Actions (list 3-5):
[ ] _________________________________________
[ ] _________________________________________
[ ] _________________________________________

Tools Needed:
[ ] Bash   [ ] Read   [ ] Write   [ ] Edit
[ ] Glob   [ ] Grep   [ ] WebFetch
[ ] MCP tool: _____________________________

Success Criteria (how will user know it worked?):
_____________________________________________
_____________________________________________

Known Constraints/Limitations:
_____________________________________________
_____________________________________________
```

### Step 2: Create SKILL.md with Frontmatter

Create the skill file in the proper location:

```bash
# Create skill directory
mkdir -p ~/.claude/skills/your-skill-name

# Create SKILL.md file
cat > ~/.claude/skills/your-skill-name/SKILL.md <<'EOF'
---
name: your-skill-name
description: Your one-line description
author: Your Name
version: 1.0.0
instructions: |
  [Your instructions here]
allowed-tools: Bash, Read, Write
scope: session
tags: [tag1, tag2]
---

# Your Skill Title

[Your implementation content here]
EOF
```

**Key Points**:
- Skill name matches directory name exactly
- Frontmatter must come first (before any other content)
- Use `|` in YAML for multi-line `instructions` field
- All REQUIRED fields must be present

### Step 3: Test Locally with `/your-skill-name`

Once your SKILL.md is in place, test it in Claude Code:

```bash
# In Claude Code terminal:
/your-skill-name test the skill

# The skill should:
1. Be discovered by Claude Code
2. Appear in autocomplete (Ctrl+K)
3. Execute when invoked
4. Have access to listed tools
```

**Debugging if not found**:
- Check file location: `~/.claude/skills/your-skill-name/SKILL.md`
- Verify YAML syntax: No quotes around string values
- Check skill name format: lowercase, hyphens only
- Restart Claude Code if recently added

### Step 4: Debug with `/doctor skill`

Use the built-in diagnostic command to verify skill setup:

```bash
/doctor skill your-skill-name
```

**Output will show**:
- Skill metadata (name, version, description)
- Tool permissions (approved/pending)
- Execution environment
- Recent errors (if any)

**What to look for**:
- ✅ Metadata parses correctly
- ✅ All required tools are available
- ✅ No permission errors
- ✅ No syntax errors in instructions

### Step 5: Iterate Based on User Feedback

Test with real workflows and refine:

```bash
# Test case 1: Simple execution
/your-skill-name do something simple

# Test case 2: With file context
@important-file /your-skill-name analyze this

# Test case 3: Complex scenario
# [Set up context, then invoke skill]
/your-skill-name solve the complex problem

# Iterate: Edit SKILL.md → test → repeat
```

**Common iterations**:
- **Refine instructions**: Too vague? Add examples to instructions field
- **Add tools**: Missing capability? Add tool to allowed-tools
- **Improve output**: Not structured right? Specify format in instructions
- **Add error handling**: What happens on edge cases?

### Step 6: Publish/Share with Team

Once stable, make it available to teammates:

#### For Global Use (Your All Sessions)
```bash
# Change scope in SKILL.md
scope: global

# Move to standard location (Claude Code finds it automatically)
~/.claude/skills/skill-name/SKILL.md
```

#### For Team/Workspace Sharing
```bash
# 1. Document the skill (README.md)
cat > ~/.claude/skills/skill-name/README.md <<'EOF'
# [Skill Name]

## Installation

1. Copy `SKILL.md` to `~/.claude/skills/[skill-name]/`
2. Verify with `/doctor skill [skill-name]`

## Usage

/skill-name [arguments]

## Examples

[Provide 2-3 real examples]

## Configuration

[If skill reads .claude/settings.json, document options]
EOF

# 2. Create installation script (optional)
cat > install.sh <<'EOF'
#!/bin/bash
mkdir -p ~/.claude/skills/skill-name
cp SKILL.md ~/.claude/skills/skill-name/
echo "Skill installed! Test with: /skill-name"
EOF
chmod +x install.sh

# 3. Share files + documentation
# - Email SKILL.md + README.md + install.sh
# - OR: Push to git repo with setup instructions
```

### Step 7: Monitor Usage & Iterate

Track how the skill is used and improve it:

```bash
# Check execution logs (in Claude Code UI or via shell)
# Look for patterns:
# - What arguments do users pass?
# - What errors occur most?
# - Which features are actually used?

# Iterate version number
version: 1.0.0  # Initial release
version: 1.1.0  # Added feature X
version: 1.1.1  # Fixed edge case Y
version: 2.0.0  # Breaking change: tool requirements changed
```

**Example Iteration Cycle**:
```
v1.0.0 → Initial release (basic feature set)
  ↓ [User feedback: "Needs better error messages"]
v1.1.0 → Improved error handling + examples
  ↓ [User feedback: "Also need X feature"]
v1.2.0 → Added X feature, fixed 2 bugs
  ↓ [User request: "Integrate with MCP server Y"]
v2.0.0 → Added MCP server Y (new tool requirement)
```

---

## Debugging Guide

### Issue: Skill Not Appearing in Autocomplete

**Symptom**: `/your-skill-name` not found even though directory exists

**Diagnosis**:
```bash
# Verify file structure
ls -la ~/.claude/skills/
# Should show: your-skill-name/SKILL.md

# Verify YAML syntax
head -20 ~/.claude/skills/your-skill-name/SKILL.md
# Should show valid YAML between --- markers
```

**Solutions**:
1. **Restart Claude Code** — New skills are discovered on startup
2. **Check file path** — Must be `~/.claude/skills/[NAME]/SKILL.md` exactly
3. **Validate YAML** — Use online YAML validator (no syntax errors)
4. **Check permissions** — File readable: `chmod 644 SKILL.md`

---

### Issue: Frontmatter Parsing Errors

**Symptom**: Error like "Invalid frontmatter" or "Missing required fields"

**Diagnosis**:
```bash
# Common YAML mistakes:
# ❌ Unquoted colons in values
name: my-skill: analyzer  # Invalid (: in value)

# ❌ Missing quotes in special strings
description: "Process file://localhost paths"  # Needs quotes

# ❌ Inconsistent indentation
instructions: |
  First line
    Inconsistent indent  # This will break parsing
  Back to base level

# ❌ Forbidden characters in name
name: my-skill_name  # Underscore not allowed

# ❌ Missing required fields
# name, description, instructions, allowed-tools must be present
```

**Solutions**:
1. **Validate YAML structure** — Every string value with special chars needs quotes
2. **Use `|` for multi-line** — Use `|` (literal block) or `>` (folded block) for instructions
3. **Check indentation** — Indent 2 spaces per level; never tabs
4. **Test with `/doctor skill`** — Shows detailed parsing errors

**Correct Examples**:
```yaml
---
name: my-skill                                  # ✅ No special chars
description: "Extract file://localhost paths"  # ✅ Quoted
instructions: |                                # ✅ Literal block
  Line 1
  Line 2 (same indent)
allowed-tools: Bash, Read                       # ✅ Comma-separated
---
```

---

### Issue: Tool Access Denied

**Symptom**: "Permission denied for tool Bash" or similar

**Diagnosis**:
```bash
# Check tool is in allowed-tools
grep allowed-tools ~/.claude/skills/your-skill-name/SKILL.md

# Check settings.json permissions
cat ~/.claude/settings.json | grep -A 10 '"permissions"'
```

**Solutions**:
1. **Add tool to allowed-tools** — If you use `Bash`, declare it explicitly
2. **Request permission** — First use asks user; grant permission in UI
3. **Update settings.json** — For repeated use, add allow rule:
   ```json
   {
     "permissions": {
       "allow": [
         "Bash(find /path *)",
         "Read(/path/**)"
       ]
     }
   }
   ```

---

### Issue: Context Bleeding / Variable Leakage

**Symptom**: Information from previous skill invocations appears in new skill runs

**Diagnosis**:
```
Session scope:     [Skill A runs] → [Skill B runs] (sees A's context?)
Global scope:      [Session 1] → [Session 2] (persistent state?)
```

**Root Causes**:
1. **Using global variables** in instructions → Becomes part of system prompt
2. **Persisting state in filesystem** → Shared across sessions
3. **Overwriting shared memory** → CLAUDE.md sections conflict

**Solutions**:
1. **Use session scope** (default) — Limits to current session only
2. **Use isolated forks** — `/fork skill:your-skill` creates isolated context
3. **Namespace state files** — Use unique filenames: `.claude/skill-your-skill-state.json`
4. **Clear state explicitly** — Add cleanup in instructions: "Clear any previous context before starting"

---

### Issue: Permission Issues (Unauthorized Actions)

**Symptom**: "Unauthorized tool use" or "Permission required"

**Diagnosis**:
```bash
# Check what tools skill uses
grep allowed-tools ~/.claude/skills/your-skill-name/SKILL.md

# Check user permissions
cat ~/.claude/settings.json | grep -A 20 '"permissions"'
```

**Solutions**:
1. **First use** — Grant permission when prompted in UI
2. **Repeated use** — Add to settings.json allow list
3. **Remove unnecessary tools** — Reduce allowed-tools to what's actually needed
4. **Use `/doctor`** — Shows which permissions are pending/granted

**Example settings.json addition**:
```json
{
  "permissions": {
    "allow": [
      "Read(~/.claude/skills/**)",
      "Bash(find ~/.claude -type f)",
      "Write(~/.claude/skill-output/**)"
    ]
  }
}
```

---

### Issue: Skill Stops Responding Mid-Execution

**Symptom**: Skill starts but never completes; hangs indefinitely

**Diagnosis**:
```bash
# Check logs
tail -50 ~/.claude/debug/latest.log 2>/dev/null

# Common causes:
# 1. Tool hangs (e.g., Bash waiting for input)
# 2. Infinite loop in instructions
# 3. Missing response terminator
# 4. Tool timeout (default 30s per tool call)
```

**Solutions**:
1. **Add timeouts to Bash commands**:
   ```bash
   timeout 10 some-long-running-command
   ```
2. **Avoid interactive prompts** — Use non-interactive flags:
   ```bash
   # ❌ Wrong: Waits for user input
   npm publish
   
   # ✅ Right: Non-interactive
   npm publish --access public
   ```
3. **Break into smaller steps** — Multiple tool calls instead of one mega command
4. **Add progress indicators** — Log status periodically
5. **Test tool independently** — Run command directly in shell first

---

## Best Practices

### Naming Conventions

**Skill Names**:
- Use verb-noun pattern: `code-review`, `bug-triage`, `doc-generate`
- Avoid generic names: ❌ `assistant`, `helper`, `tool`
- Use domain-specific names: ✅ `python-linter`, `sql-optimizer`, `react-debugger`
- Examples of good names:
  - `pr-reviewer` — What it does (reviews PRs)
  - `database-migrator` — What domain (database)
  - `api-contract-validator` — Specific use case
  - `slack-notifier` — What channel (Slack)

**Directory Structure**:
```
~/.claude/skills/
├── my-skill/
│   ├── SKILL.md              # Required: Skill definition
│   ├── README.md             # Recommended: Documentation
│   ├── examples.md           # Optional: Usage examples
│   └── lib/                  # Optional: Helper scripts
│       ├── util.js
│       └── config.json
```

---

### Error Handling

**Pattern 1: Graceful Failures**
```markdown
instructions: |
  If the required files don't exist:
  1. Explain what's missing
  2. Suggest how user can provide it
  3. Don't proceed without explicit confirmation

  If you encounter an error:
  1. Show the full error message
  2. Explain what went wrong (not just "Error!")
  3. Suggest fixes or next steps
```

**Pattern 2: Validation Before Execution**
```markdown
instructions: |
  Before running any analysis:
  1. Validate input files exist and are readable
  2. Check file format is supported (e.g., .py for Python files)
  3. Verify sufficient context (don't process 10MB files without warning)
  4. Ask for permission if operation is expensive (slow, costly)
```

**Pattern 3: Progressive Degradation**
```markdown
instructions: |
  Preferred approach:
  1. Try using MCP tool (most accurate)
  2. Fall back to shell parsing if MCP unavailable
  3. Fall back to regex pattern matching if shell parsing fails
  4. Provide results with confidence level noted
```

---

### Testing Patterns

**Unit Test Pattern**:
```bash
# Create test scenarios directly in SKILL.md or separate file

# Test 1: Minimal viable input
/your-skill minimal-input

# Test 2: Complex input
/your-skill @large-file complex-scenario

# Test 3: Error cases
/your-skill invalid-input  # Should fail gracefully

# Test 4: Edge cases
/your-skill empty-file
/your-skill very-large-file
/your-skill special-characters-in-file-path
```

**Integration Test Pattern**:
```bash
# Test with real workflows

# Scenario 1: Code review workflow
cd /real-project
/code-review @src/main.py

# Scenario 2: Documentation workflow
/doc-generator --from src/api.ts --to docs/api.md

# Scenario 3: Cross-tool workflow
/my-skill-1 | /my-skill-2 | /my-skill-3
```

**Regression Test Pattern**:
```bash
# Keep expected outputs from previous versions
# Compare new outputs against baseline

# Example for Python code review skill:
# Before: /code-review @old-project/bad-code.py
# Issues found: [list of X issues]
#
# After: /code-review @old-project/bad-code.py
# Issues found: [should still be X issues, maybe improved descriptions]
```

---

### Documentation Standards

**Include in SKILL.md**:
1. **Frontmatter** — All required + recommended fields
2. **Role statement** — Who the skill is and who it helps
3. **Usage examples** — 2-3 concrete examples with expected output
4. **Constraints** — What it does and doesn't do
5. **Instructions** — Detailed behavioral rules

**Include in README.md** (if published):
1. **Overview** — What problem it solves
2. **Installation** — Step-by-step setup
3. **Quick start** — Minimal example to get working
4. **Advanced usage** — Tips and tricks
5. **Troubleshooting** — Common issues + fixes
6. **Configuration** — How to customize behavior
7. **Examples** — Real-world use cases

**Example README.md Structure**:
```markdown
# Code Review Skill

## What It Does

Analyzes code changes for security vulnerabilities, performance issues, and best practice violations.

## Installation

```bash
mkdir -p ~/.claude/skills/code-review
cp SKILL.md ~/.claude/skills/code-review/
```

## Quick Start

```bash
/code-review @path/to/file.py

# Or review git diff
/code-review --git-diff

# Or review PR
/code-review --pr https://github.com/owner/repo/pull/123
```

## Usage Examples

### Example 1: Review Python File
```bash
/code-review @src/database.py

# Output:
# - 3 security issues found
# - 2 performance improvements
# - 1 style violation
```

## Configuration

Edit `~/.claude/settings.json`:
```json
{
  "skills": {
    "code-review": {
      "language": "python",
      "strict": true,
      "check-security": true,
      "check-performance": true
    }
  }
}
```
```

---

### Performance Optimization

**Minimize Context Usage**:
```markdown
instructions: |
  Before processing large files (>100KB):
  1. Ask user if they want sampling (first 50 lines + last 50 lines)
  2. Offer to process specific sections instead of whole file
  3. Consider breaking into multiple skill invocations
  
  Use @file mentions strategically:
  - ✅ Include key file for context
  - ❌ Don't include huge logs or vendored code
  
  Prefer command results over file content:
  - ✅ Run: git log --oneline --max-count=10
  - ❌ Include entire: git log output (can be huge)
```

**Cache Expensive Operations**:
```markdown
instructions: |
  If a computation is expensive:
  1. Check if result already exists locally
  2. Cache result in ~/.claude/skill-cache/[skill-name]/
  3. Reuse cache if input hasn't changed
  4. Invalidate cache explicitly if requested
```

**Example Cache Implementation**:
```bash
# In your instructions, reference caching logic:
# If user runs same analysis twice:
# Run 1: 30s (computes and caches)
# Run 2: <1s (uses cache)
```

---

## Real Examples

### Example 1: Code Review Skill

**Purpose**: Review code changes for security, performance, and correctness

**File**: `~/.claude/skills/code-review/SKILL.md`

```markdown
---
name: code-review
description: Review code changes for security, performance, and correctness
author: Your Name
version: 1.2.0
instructions: |
  You are a code review expert across multiple languages.
  
  YOUR MISSION:
  Review code for:
  1. Security vulnerabilities (injection, exposure, auth issues)
  2. Performance bottlenecks (N+1 queries, inefficient algorithms)
  3. Maintainability (style, testing, documentation)
  4. Best practices (language idioms, frameworks, patterns)
  
  PROCESS:
  1. Identify the language/framework from file extension
  2. Scan for common vulnerability patterns
  3. Analyze performance characteristics
  4. Check code organization and style
  5. Provide prioritized recommendations
  
  OUTPUT FORMAT:
  ## Issues Found: [N]
  
  ### Critical (Security/Crashes)
  - [Issue 1]: [File:Line] [Code snippet] → [Explanation] → [Fix]
  - [Issue 2]: ...
  
  ### High (Performance/Maintainability)
  - [Issue]: [Explanation] → [Improvement]
  
  ### Medium (Best Practices)
  - [Issue]: [Explanation] → [Pattern to use]
  
  ## Summary
  Overall quality: [Low/Medium/High]
  Time to fix: [Estimate]
  
  CONSTRAINTS:
  - Only review actual code, not comments or docs
  - Suggest fixes, don't rewrite entire functions
  - Be constructive: explain "why" not just "what"
  - Flag uncertain findings as "Investigate: [reason]"
  
  EDGE CASES:
  - Generated code: Flag for manual review
  - Framework-specific patterns: Recognize and validate against framework docs
  - Complex algorithms: Ask for explanation before review
  
allowed-tools: Read, Bash, Grep
scope: global
tags: [code-review, security, quality, performance]
---

# Code Review Skill

## What This Does

Reviews code for security issues, performance problems, best practices, and maintainability concerns.

## When to Use It

- Before merging PRs
- After architectural changes
- To learn better coding patterns
- Security audits
- Performance optimization

## Usage Examples

### Example 1: Review a Python File

```bash
/code-review @src/payment_handler.py
```

Expected output:
```
## Issues Found: 3

### Critical (Security/Crashes)
- SQL Injection vulnerability: Line 42
  Code: query = f"SELECT * FROM users WHERE id={user_id}"
  → SQL parameters not escaped
  → Fix: Use parameterized queries: cursor.execute("... WHERE id=?", (user_id,))

### High (Performance/Maintainability)
- N+1 query pattern: Line 78
  → Each iteration runs a separate DB query
  → Fix: Use JOIN or load all user data upfront

## Summary
Overall quality: Medium
Time to fix: ~1 hour
```

### Example 2: Review Git Diff

```bash
cd /project
/code-review --git-diff

# Reviews all changes in current branch
```

### Example 3: Review JavaScript with Focus

```bash
/code-review @src/api.js --focus security

# Only checks security issues, ignores style
```

## Configuration

In `~/.claude/settings.json`, add:
```json
{
  "skills": {
    "code-review": {
      "languages": ["python", "javascript", "rust"],
      "severity": "medium",
      "check": ["security", "performance", "style"]
    }
  }
}
```
```

---

### Example 2: Project Setup Skill

**Purpose**: Initialize new project with best practices boilerplate

**File**: `~/.claude/skills/project-setup/SKILL.md`

```markdown
---
name: project-setup
description: Initialize new projects with language-specific boilerplate and best practices
author: Your Name
version: 1.0.0
instructions: |
  You are a project scaffolding expert.
  
  YOUR MISSION:
  Given a project type and language, create complete boilerplate including:
  - Directory structure (src/, tests/, docs/, etc.)
  - Package/dependency files (package.json, pyproject.toml, Cargo.toml, etc.)
  - Configuration files (.gitignore, .editorconfig, etc.)
  - CI/CD setup (GitHub Actions, example workflows)
  - Documentation (README, CONTRIBUTING, etc.)
  - Environment templates (.env.example)
  
  SUPPORTED LANGUAGES:
  - Python (FastAPI, Flask, Django)
  - JavaScript/TypeScript (Express, Next.js, Vue)
  - Rust (axum, actix-web)
  - Go (gin, echo)
  
  PROCESS:
  1. Ask clarifying questions if ambiguous (framework choice, deployment target)
  2. Create directory structure
  3. Generate language-specific config files
  4. Add CI/CD workflows
  5. Create documentation templates
  6. Summarize what was created
  
  OUTPUT:
  Show file tree of created structure + brief description of each component
  
  EDGE CASES:
  - Monorepo: Ask about services/modules structure
  - Existing project: Ask if you should skip existing files
  - Custom requirements: Ask what's special about this project
  
allowed-tools: Write, Bash, Read
scope: global
tags: [setup, scaffolding, project-init, automation]
---

# Project Setup Skill

## What This Does

Creates production-ready project boilerplate for any language/framework combo.

## Usage Examples

### Example 1: Python FastAPI Project

```bash
/project-setup python fastapi my-api-service
```

Creates:
```
my-api-service/
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py
│   └── models/
│       ├── __init__.py
│       └── schemas.py
├── tests/
│   ├── __init__.py
│   ├── test_api.py
│   └── conftest.py
├── docs/
│   ├── README.md
│   ├── CONTRIBUTING.md
│   └── API.md
├── pyproject.toml
├── .gitignore
├── .env.example
├── .github/workflows/
│   ├── tests.yml
│   └── deploy.yml
└── Dockerfile
```

### Example 2: TypeScript Next.js App

```bash
/project-setup typescript nextjs ecommerce-frontend
```

Creates full Next.js app with:
- App router structure
- ESLint + Prettier config
- Jest test setup
- GitHub Actions workflows
- Tailwind CSS setup
- Environment templates

## Features

✅ Language auto-detection  
✅ Framework best practices  
✅ CI/CD workflows included  
✅ Test setup ready to go  
✅ Documentation templates  
✅ Docker support  
```

---

### Example 3: Documentation Generator Skill

**Purpose**: Auto-generate API documentation from code

**File**: `~/.claude/skills/doc-generator/SKILL.md`

```markdown
---
name: doc-generator
description: Generate markdown documentation from code comments and docstrings
author: Your Name
version: 1.1.0
instructions: |
  You are a technical documentation specialist.
  
  YOUR MISSION:
  Extract docstrings, comments, and type hints from code to generate:
  - API reference documentation
  - Usage examples
  - Type signatures
  - Parameter descriptions
  - Return value documentation
  
  SUPPORTED LANGUAGES:
  - Python: Extract from docstrings (Google/NumPy style)
  - JavaScript/TypeScript: Extract from JSDoc comments
  - Rust: Extract from doc comments (///)
  - Go: Extract from comment conventions
  
  RULES:
  1. Preserve original formatting (code examples, formatting)
  2. Group by module/package
  3. Generate table of contents
  4. Include type information
  5. Link between related functions/classes
  
  OUTPUT FORMAT:
  # [Module Name] API Reference
  
  ## Overview
  [Brief module description]
  
  ## Table of Contents
  - [Class/Function 1](#class-function-1)
  - [Class/Function 2](#class-function-2)
  
  ### ClassName
  [Description]
  
  #### Method: method_name
  ```typescript
  method_name(param: Type): ReturnType
  ```
  Description...
  
  **Parameters:**
  - `param` (Type): Description
  
  **Returns:** ReturnType - Description
  
  **Example:**
  ```code
  // Example usage
  ```

allowed-tools: Read, Bash, Write
scope: global
tags: [documentation, api-docs, code-generation]
---

# Documentation Generator Skill

## What This Does

Auto-generates API documentation from source code docstrings and comments.

## Usage Examples

### Example 1: Generate Python API Docs

```bash
/doc-generator @src/database.py --output docs/api.md
```

Creates:
```markdown
# database Module API Reference

## Overview
Database connection and query utilities.

## Classes

### DatabaseConnection
Manages PostgreSQL connections with connection pooling.

#### Method: query
```python
def query(sql: str, params: List = None) -> List[Dict]:
```
Execute a SQL query and return results.

**Parameters:**
- `sql` (str): SQL query string
- `params` (List, optional): Query parameters

**Returns:** List[Dict] - Query results as list of dicts

**Example:**
```python
db = DatabaseConnection()
results = db.query("SELECT * FROM users WHERE active = ?", [True])
```
```

### Example 2: Generate TypeScript Docs

```bash
/doc-generator @src/api.ts --format markdown --output docs/api.md
```

## Configuration

```json
{
  "skills": {
    "doc-generator": {
      "docstyle": "google",
      "include-examples": true,
      "include-types": true
    }
  }
}
```
```

---

### Example 4: Bug Triage Skill

**Purpose**: Categorize and prioritize bugs automatically

**File**: `~/.claude/skills/bug-triage/SKILL.md`

```markdown
---
name: bug-triage
description: Analyze bug reports and categorize by severity, frequency, and impact
author: Your Name
version: 1.0.0
instructions: |
  You are a QA triage expert.
  
  YOUR MISSION:
  Given bug reports/issues, assign:
  1. Severity: Critical | High | Medium | Low
  2. Category: UI | Performance | Security | API | Data | Other
  3. Frequency: Reproducible | Intermittent | One-time
  4. Estimated effort: Trivial | Small | Medium | Large
  5. Recommended action: Fix immediately | Schedule | Monitor | Defer
  
  SEVERITY CRITERIA:
  - CRITICAL: Crashes, data loss, security breach, service down
  - HIGH: Major feature broken, significant perf issue, workaround needed
  - MEDIUM: Feature partially broken, confusing UX, minor perf issue
  - LOW: Polish, edge case, nice-to-have improvement
  
  OUTPUT:
  | Issue | Severity | Category | Freq | Effort | Action |
  |-------|----------|----------|------|--------|--------|
  | [Issue] | [Sev] | [Cat] | [Freq] | [Est] | [Action] |
  
  After table, provide:
  - Fix suggestions for top 3 critical issues
  - Recommended sprint breakdown

allowed-tools: Read, Write
scope: session
tags: [qa, triage, bug-management, process]
---

# Bug Triage Skill

## What This Does

Automatically categorizes and prioritizes bug reports.

## Usage Example

```bash
/bug-triage @bug-reports.md
```

Outputs:
```markdown
## Bug Triage Report

| Issue | Severity | Category | Freq | Effort | Action |
|-------|----------|----------|------|--------|--------|
| Login page not responsive on Safari | HIGH | UI | Reproducible | Small | Fix immediately |
| Typo in settings page | LOW | UI | One-time | Trivial | Defer |
| API timeout after 10k requests | CRITICAL | Performance | Intermittent | Large | Fix immediately |

## Top 3 Critical Issues

### 1. API timeout after 10k requests (Effort: Large)
**Root cause:** Connection pool exhaustion
**Fix:** Increase pool size in config.yaml from 100 → 500

### 2. Login page not responsive on Safari (Effort: Small)
**Root cause:** CSS flexbox compatibility issue
**Fix:** Use `-webkit-flex` fallback in styles.css
```
```

---

### Example 5: Performance Analyzer Skill

**Purpose**: Profile code and identify optimization opportunities

**File**: `~/.claude/skills/perf-analyzer/SKILL.md`

```markdown
---
name: perf-analyzer
description: Analyze code for performance bottlenecks and optimization opportunities
author: Your Name
version: 1.0.0
instructions: |
  You are a performance optimization specialist.
  
  YOUR MISSION:
  Analyze code for:
  1. Time complexity (O(n), O(n²), etc.)
  2. Space complexity
  3. N+1 query patterns
  4. Unnecessary allocations
  5. Inefficient algorithms
  6. Missing caches/memoization
  
  OUTPUT:
  For each issue:
  - Location (file:line)
  - Current approach (code snippet)
  - Complexity analysis
  - Optimization suggestion
  - Expected improvement (faster by X%, uses X% less memory)
  
  EXAMPLE OUTPUT:
  ## Bottleneck 1: N+1 Query Pattern (Line 42-50)
  
  Current:
  ```python
  for user in users:
    orders = db.query("SELECT * FROM orders WHERE user_id = ?", user.id)
  ```
  Current complexity: O(n) queries for n users
  
  Optimized:
  ```python
  user_ids = [u.id for u in users]
  orders = db.query("SELECT * FROM orders WHERE user_id IN (?)", user_ids)
  ```
  New complexity: O(1) query
  
  Impact: 100x faster for 1000 users

allowed-tools: Read, Bash, Write
scope: global
tags: [performance, optimization, analysis]
---

# Performance Analyzer Skill

## What This Does

Identifies performance bottlenecks and suggests optimizations.

## Usage Example

```bash
/perf-analyzer @src/database_handler.py
```

Output:
```markdown
## Performance Analysis: database_handler.py

### Bottleneck 1: N+1 Query Pattern (Line 78-85)
Severity: HIGH | Impact: 100x slowdown for large datasets

Location: `get_user_orders()` function

**Current approach:**
```python
for user in users:
    orders = db.query("SELECT * FROM orders WHERE user_id = ?", [user.id])
```

**Issue:** Runs N+1 database queries (1 for users + N for each user's orders)

**Optimized approach:**
```python
user_ids = [u.id for u in users]
orders_by_user = defaultdict(list)
orders = db.query("SELECT * FROM orders WHERE user_id IN (?)", [user_ids])
for order in orders:
    orders_by_user[order.user_id].append(order)
```

**Impact:** Reduces from N+1 queries → 2 queries (100x faster for N=100)

### Bottleneck 2: Inefficient List Comprehension (Line 120)
Severity: MEDIUM | Impact: 2x slowdown

Current:
```python
[x for x in items if x not in large_list]
```

**Issue:** O(n²) search (for each x, searches entire large_list)

Optimized:
```python
large_set = set(large_list)
[x for x in items if x not in large_set]
```

**Impact:** O(n) time, 10x faster for large lists

## Summary
- 2 HIGH severity issues found
- Total potential speedup: 50x
- Estimated fix time: 1-2 hours
```
```

---

## Advanced Techniques

### Skill Communication Patterns

**Pattern 1: Request More Information**
```markdown
instructions: |
  If the user's request is ambiguous, ask clarifying questions:
  
  "I'd like to generate SQL migrations. To help better:
  1. What's your current database schema? (Can you share a sample?)
  2. What's the target schema you want to reach?
  3. Is this PostgreSQL, MySQL, or something else?
  4. Do you need rollback migrations too?"
  
  Don't proceed until you have enough context.
```

**Pattern 2: Progressive Disclosure**
```markdown
instructions: |
  Present results layered:
  
  Level 1 (Quick Summary):
  "Found 3 issues: 1 critical, 1 medium, 1 low"
  
  Level 2 (Details on Request):
  "Want detailed analysis? I can show you each one"
  
  Level 3 (Full Deep Dive):
  "Ready for implementation? Here's step-by-step fix for each"
```

**Pattern 3: Teach as You Help**
```markdown
instructions: |
  When finding issues, explain the underlying principle:
  
  ❌ "This is slow because of N+1 queries"
  
  ✅ "This is slow because of N+1 queries. This happens when:
     - You load a parent record (1 query)
     - Then for each parent, load children (N queries)
     - Total: 1+N queries instead of 1.
     
     The fix is to load all children in a single query using IN clause
     or a JOIN, reducing it to 1-2 queries total."
```

---

### Skill Composition (Skill Chains)

Chain multiple skills together for complex workflows:

```bash
# Example: Full code review + optimization flow

# Step 1: Code review
/code-review @src/handler.py > /tmp/review.txt

# Step 2: Performance analysis on same file
/perf-analyzer @src/handler.py > /tmp/perf.txt

# Step 3: Generate report
/report-generator --from /tmp/review.txt /tmp/perf.txt --output final-report.md
```

**In SKILL.md, recommend next skills**:
```markdown
instructions: |
  After this skill completes:
  1. For security issues → Run /code-review --focus security
  2. For performance issues → Run /perf-analyzer
  3. For testing → Run /test-generator
```

---

### Integration with Settings.json

Configure skill behavior via `.claude/settings.json`:

```json
{
  "skills": {
    "code-review": {
      "languages": ["python", "javascript"],
      "strict": true,
      "max-file-size": "1MB"
    },
    "doc-generator": {
      "format": "markdown",
      "include-examples": true
    }
  }
}
```

In your SKILL.md instructions:
```markdown
instructions: |
  Read configuration from ~/.claude/settings.json
  
  Use settings.skills.[skill-name].[key]:
  - languages: What languages to support
  - strict: Whether to fail on warnings
  - max-file-size: Max file size to process
```

---

## Troubleshooting

### Skill Invocation Doesn't Recognize Arguments

**Symptom**: `/my-skill arg1 arg2` doesn't pass arguments to instructions

**Solution**: Arguments are part of the message context, not frontmatter. In instructions, reference them as context:

```markdown
instructions: |
  The user will provide arguments as part of their message.
  
  If they say: "/my-skill analyze @file.py --deep"
  Then in your response, parse and use those arguments.
  
  Examples:
  - @file.py → Load the file
  - --deep → Run thorough analysis
  - --json → Output as JSON
```

---

### Skill Can't Find Its Own Config File

**Symptom**: Skill tries to read config but file not found

**Solution**: Use absolute paths and check existence:

```markdown
instructions: |
  Before reading config:
  1. Check if ~/.claude/settings.json exists
  2. Use fallback defaults if missing
  3. Log warnings if config is invalid
  
  Example in your workflow:
  - Read ~/.claude/settings.json
  - Extract skills.[skill-name].settings
  - Use defaults if not found
```

---

### Skill Performance Degrades Over Time

**Symptom**: First execution fast, subsequent ones slow

**Common causes**:
1. **Accumulating context** — Each run adds to session history
2. **Growing result files** — Outputs not cleaned up
3. **Token cache** — Large cached contexts

**Solutions**:
```markdown
instructions: |
  Implement cleanup:
  1. Delete temporary files after use
  2. Clear large intermediate results
  3. Work with file paths, not full content when possible
  
  Example:
  ✅ Pass file path: "Analyze /path/to/file.py"
  ❌ Include full file: "Here's the code:\n[5000 lines]"
```

---

### Can't Use Multiple MCPs in One Skill

**Symptom**: `allowed-tools: github, slack` but only one works

**Solution**: List them separately and ensure both are connected:

```yaml
allowed-tools: Read, Bash, Write, github, slack
```

Then in instructions, explain which tool does what:

```markdown
instructions: |
  This skill uses multiple tools:
  
  - Read/Write: For local files
  - Bash: For git operations
  - github: For accessing GitHub API (repos, issues, PRs)
  - slack: For posting notifications
```

**Verify MCPs connected**:
```bash
/mcp
# Should show all MCPs you're trying to use
```

---

## Quick Reference

### Frontmatter Checklist

```yaml
---
[ ] name: unique-kebab-case-name
[ ] description: One-liner <100 chars
[ ] author: Your Name (optional but recommended)
[ ] version: 1.0.0 (optional but recommended)
[ ] instructions: Multi-line block with role + mission (required)
[ ] allowed-tools: Bash, Read, Write, etc. (required)
[ ] scope: session|global|workspace (optional, default: session)
[ ] tags: [tag1, tag2] (optional but recommended)
[ ] hooks: PreToolUse, PostToolUse (optional)
---
```

### Tool Reference

| Tool | Purpose | Example |
|------|---------|---------|
| `Bash` | Run shell commands | `bash git log --oneline` |
| `Read` | Load file content | `Read(/path/to/file.py)` |
| `Write` | Create/save files | `Write(/path/output.json)` |
| `Edit` | Modify with diffs | `Edit(/path/file.py)` changes |
| `Glob` | Fast file search | `Glob(src/**/*.py)` |
| `Grep` | Content search | `Grep(error,/path/*.log)` |
| `WebFetch` | Fetch web pages | `WebFetch(https://example.com)` |
| `WebSearch` | Search the web | `WebSearch(python async patterns)` |
| MCP tools | Connected services | `github`, `slack`, etc. |

### Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Special chars in `name` | Not discovered | Use only `a-z0-9-` |
| Missing `instructions` | Incomplete skill | Add full instructions field |
| Unquoted YAML values | Parse error | Quote strings with special chars |
| Too-long `description` | Truncated in UI | Keep under 100 chars |
| No examples in docs | Users confused | Add 2-3 real examples |
| Unused tools in `allowed-tools` | Permission clutter | Only list tools you actually use |

---

## Summary

**To create a skill**:

1. Define purpose (Step 1)
2. Create `SKILL.md` with frontmatter (Step 2)
3. Test with `/skill-name` (Step 3)
4. Debug with `/doctor skill` (Step 4)
5. Iterate based on feedback (Step 5)
6. Publish and share (Step 6)
7. Monitor and improve (Step 7)

**Key files**:
- `~/.claude/skills/[name]/SKILL.md` — Required skill definition
- `~/.claude/skills/[name]/README.md` — Optional documentation
- `~/.claude/settings.json` — Configuration and permissions

**Debugging tools**:
- `/doctor skill [name]` — Diagnose skill issues
- Check YAML syntax with online validator
- Test tools individually before combining
- Use `/fork skill:name` to isolate context

**Best practices**:
- Verb-noun naming (`code-review`, not `reviewer`)
- Explicit error handling
- Clear documentation with examples
- Progressive iteration and testing
- Version control with semver

---

**Last Updated**: 2026-05-17  
**Version**: 1.0.0  
**Author**: Claude Code Mastery Team
