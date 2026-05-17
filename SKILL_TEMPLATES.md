# Claude Code Skill Templates & Quick Start

Copy-paste ready templates for common skill patterns.

---

## Table of Contents

1. [Minimal Skill Template](#minimal-skill-template)
2. [Standard Skill Template](#standard-skill-template)
3. [Production Skill Template](#production-skill-template)
4. [Language-Specific Templates](#language-specific-templates)
5. [Quick Install Scripts](#quick-install-scripts)

---

## Minimal Skill Template

**Use this to get started in 5 minutes**

```bash
#!/bin/bash
# Create skill directory
mkdir -p ~/.claude/skills/my-skill

# Create SKILL.md
cat > ~/.claude/skills/my-skill/SKILL.md <<'SKILLEOF'
---
name: my-skill
description: Brief description of what your skill does
author: Your Name
version: 1.0.0
instructions: |
  You are a specialized assistant for [DOMAIN].
  
  Your mission:
  [Describe what you do in 2-3 sentences]
  
  Your approach:
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
  
  Tools available:
  - Bash: Execute commands
  - Read: Load files
  - Write: Save files
  
  Output format:
  [Specify how you structure results]
  
allowed-tools: Bash, Read, Write
scope: session
tags: [tag1, tag2]
---

# My Skill Name

## What This Skill Does

[Explain in 1-2 sentences]

## Usage

/my-skill [arguments]

## Example

```bash
/my-skill example-argument
```

Expected output:
[Show what user should see]

## Limitations

- [Limitation 1]
- [Limitation 2]
SKILLEOF

echo "Skill created at ~/.claude/skills/my-skill/SKILL.md"
echo "Test with: /my-skill"
```

---

## Standard Skill Template

**For well-structured, production-ready skills**

```bash
#!/bin/bash

SKILL_NAME="your-skill-name"
AUTHOR_NAME="Your Name"
AUTHOR_EMAIL="your.email@example.com"

mkdir -p ~/.claude/skills/$SKILL_NAME

# Create main SKILL.md
cat > ~/.claude/skills/$SKILL_NAME/SKILL.md <<'SKILLEOF'
---
name: SKILL_NAME_PLACEHOLDER
description: [One-line description]
author: AUTHOR_PLACEHOLDER <AUTHOR_EMAIL_PLACEHOLDER>
version: 1.0.0
instructions: |
  You are a specialized expert in [DOMAIN].
  
  ## PRIMARY MISSION
  [Clear statement of what you do]
  
  ## KEY PRINCIPLES
  1. [Principle 1: what you always do]
  2. [Principle 2: what you always avoid]
  3. [Principle 3: preferred approach]
  
  ## TOOLS & CAPABILITIES
  - Read: Load and analyze files
  - Write: Create and save files
  - Bash: Run shell commands for validation
  
  ## OUTPUT STRUCTURE
  
  For each result, provide:
  1. Summary (1-2 sentences)
  2. Details (structured list)
  3. Recommendations (numbered)
  4. Next steps
  
  Example output format:
  ```
  ## Summary
  [1-2 sentence summary]
  
  ## Findings
  - [Finding 1]
  - [Finding 2]
  
  ## Recommendations
  1. [Action 1]
  2. [Action 2]
  ```
  
  ## EDGE CASES & CONSTRAINTS
  - [Constraint 1: e.g., "Requires input file < 10MB"]
  - [Constraint 2: e.g., "Only works with Python files"]
  - [Edge case 1: how to handle]
  
  ## ERROR HANDLING
  If something goes wrong:
  1. Explain what failed
  2. Suggest why it happened
  3. Recommend fix or next step
  
allowed-tools: Read, Write, Bash
scope: session
tags: [primary-tag, secondary-tag]
---

# [Skill Display Name]

## Overview

[What problem does this solve?]
[Who should use it?]

## When to Use This Skill

- Scenario 1: [Use case 1]
- Scenario 2: [Use case 2]
- Scenario 3: [Use case 3]

## Usage

### Basic Usage

```bash
/SKILL_NAME_PLACEHOLDER [arguments]
```

### With File Input

```bash
/SKILL_NAME_PLACEHOLDER @/path/to/file.ext
```

### With Options

```bash
/SKILL_NAME_PLACEHOLDER --option1 value1 --option2 value2
```

## Examples

### Example 1: [Scenario Name]

**Input:**
```
/SKILL_NAME_PLACEHOLDER [example input]
```

**Output:**
```
[Expected output]
```

### Example 2: [Another Scenario]

**Input:**
```
/SKILL_NAME_PLACEHOLDER @file.txt --with-option
```

**Output:**
```
[Expected output]
```

## Limitations & Constraints

- [Known limitation 1]
- [Known limitation 2]
- [Requires: condition]

## Configuration

Optional: Add configuration section if the skill reads `.claude/settings.json`:

```json
{
  "skills": {
    "SKILL_NAME_PLACEHOLDER": {
      "option1": "value",
      "option2": false
    }
  }
}
```

## Troubleshooting

**Problem: [Issue]**
→ Solution: [How to fix]

**Problem: [Issue]**
→ Solution: [How to fix]

---

*Created: 2026-05-17*
*Version: 1.0.0*
SKILLEOF

# Replace placeholders
sed -i "s/SKILL_NAME_PLACEHOLDER/$SKILL_NAME/g" ~/.claude/skills/$SKILL_NAME/SKILL.md
sed -i "s/AUTHOR_PLACEHOLDER/$AUTHOR_NAME/g" ~/.claude/skills/$SKILL_NAME/SKILL.md
sed -i "s/AUTHOR_EMAIL_PLACEHOLDER/$AUTHOR_EMAIL/g" ~/.claude/skills/$SKILL_NAME/SKILL.md

# Create optional README.md
cat > ~/.claude/skills/$SKILL_NAME/README.md <<'READMEEOF'
# [Skill Name]

## Installation

1. The skill is already in `~/.claude/skills/$SKILL_NAME/`
2. Verify with: `/doctor skill $SKILL_NAME`
3. Start using: `/$SKILL_NAME`

## Quick Start

[Add quick start guide]

## Documentation

See `SKILL.md` for complete documentation.

## Version History

- v1.0.0: Initial release
READMEEOF

echo "✅ Skill created successfully!"
echo "📝 Files created:"
echo "   - ~/.claude/skills/$SKILL_NAME/SKILL.md"
echo "   - ~/.claude/skills/$SKILL_NAME/README.md"
echo ""
echo "🚀 Test with:"
echo "   /$SKILL_NAME"
echo ""
echo "🔍 Diagnose with:"
echo "   /doctor skill $SKILL_NAME"
```

---

## Production Skill Template

**For critical, well-tested, team-shared skills**

```markdown
---
name: production-skill-template
description: [One-liner: action verb + what users get]
author: Team Name <team.email@company.com>
version: 2.1.0
instructions: |
  ## ROLE & MISSION
  
  You are [specialist role] with [X years/expertise in domain].
  
  Your ONLY job is to: [primary mission in one sentence]
  
  ## CONSTRAINTS & GUARANTEES
  
  ### What This Skill WILL Do
  ✅ [Capability 1]
  ✅ [Capability 2]
  ✅ [Capability 3]
  
  ### What This Skill Will NOT Do
  ❌ [Anti-capability 1]
  ❌ [Anti-capability 2]
  
  ### Performance Guarantees
  - Processing time: [X seconds for typical input]
  - Max file size: [X MB]
  - Context cost: [low/medium/high for token usage]
  
  ## ALGORITHM / APPROACH
  
  For each input, follow these steps in order:
  
  1. **Validate** — Check input format, required fields, constraints
     - If invalid: explain what's wrong, suggest fix, stop
     - If valid: proceed
  
  2. **Analyze** — Extract key information
     - Use [tool/pattern] to identify [what]
     - Cross-reference with [data/rules]
  
  3. **Process** — Execute core logic
     - Apply [algorithm/pattern] from step X
     - Handle [edge case 1], [edge case 2]
  
  4. **Validate Results** — Check for errors or anomalies
     - If results look wrong: explain concern, suggest reverification
     - If results look right: proceed to output
  
  5. **Format Output** — Structure results clearly
     - Use [specified format from OUTPUT section]
     - Include [required metadata]
  
  6. **Summarize** — Provide context for user
     - Explain what was done and why
     - Call out [important findings]
     - Suggest next steps if relevant
  
  ## OUTPUT FORMAT
  
  Structure every output as:
  
  ```
  ## Summary
  [1-2 sentence summary of what you did and found]
  
  ## [Primary Results Section]
  [Structured list or table of main findings]
  
  ## [Secondary Results Section]
  [Additional findings, caveats, or options]
  
  ## Recommendations
  1. [Action 1] — [Why this matters]
  2. [Action 2] — [Why this matters]
  
  ## Next Steps
  - [Follow-up action 1]
  - [Follow-up action 2]
  - [Related skill to use: /other-skill]
  ```
  
  ## EDGE CASES & ERROR HANDLING
  
  **If input is ambiguous:**
  → Ask 1-2 clarifying questions before proceeding
  
  **If input is invalid/corrupted:**
  → Show what's wrong (file excerpt + error)
  → Suggest how to fix it
  → Stop processing
  
  **If operation takes too long:**
  → Implement timeout (T seconds)
  → Show progress so far
  → Suggest breaking into smaller chunks
  
  **If result is unexpected:**
  → Explain what seems odd
  → Ask user for clarification or confirmation
  → Offer to reverify
  
  ## QUALITY STANDARDS
  
  Before returning results, verify:
  - ✅ All required findings are present
  - ✅ Examples are accurate and runnable
  - ✅ Recommendations are actionable
  - ✅ Edge cases are mentioned
  - ✅ Links/references are valid
  - ✅ No placeholder text remains
  
  ## CONVERSATION STYLE
  
  - Be direct: Lead with most important info
  - Be specific: Include concrete examples and code
  - Be humble: Flag uncertainty, suggest verification
  - Be helpful: Suggest next steps and related skills
  
allowed-tools: Read, Write, Bash, Grep
scope: global
tags: [category-tag, primary-domain, sub-domain]
hooks: PreToolUse, PostToolUse
---

# [Full Skill Title]

## What This Skill Solves

[Problem statement]: [How this skill helps]

## When to Use It

✅ Use when:
- [Scenario 1]
- [Scenario 2]
- [Scenario 3]

❌ Don't use when:
- [Anti-scenario 1]
- [Anti-scenario 2]

## Installation & Setup

### Step 1: Install

```bash
# Already installed at ~/.claude/skills/[name]/
# Verify with:
/doctor skill production-skill-template
```

### Step 2: Configure (Optional)

Edit `~/.claude/settings.json`:

```json
{
  "skills": {
    "production-skill-template": {
      "strictMode": true,
      "maxFileSize": "10MB",
      "includeRiskAssessment": true
    }
  }
}
```

### Step 3: Test

```bash
# Test with provided examples
/production-skill-template --example 1
```

## Usage

### Basic Usage

```bash
/production-skill-template [input]
```

### With Options

```bash
/production-skill-template @file.ext --strict --include-recommendations
```

### Advanced: Chaining with Other Skills

```bash
# First: Use this skill to analyze
/production-skill-template @input.txt

# Then: Use result with another skill
/code-review @[output-from-above.txt]

# Or: Use in a workflow
/my-workflow-skill --include-analysis-from production-skill-template
```

## Examples

### Example 1: Basic Scenario

**Input:**
```bash
/production-skill-template @example.txt
```

**Output:**
```
## Summary
[Output for this scenario]
```

### Example 2: Advanced Scenario

**Input:**
```bash
/production-skill-template @complex-example.txt --strict --detailed
```

**Output:**
```
[Detailed output for advanced scenario]
```

## Performance Notes

- First run: ~5 seconds (cold start)
- Subsequent runs: <2 seconds (cached)
- Memory usage: ~50MB typical
- Max context: 100 concurrent sessions

## Configuration Options

| Option | Default | Effect |
|--------|---------|--------|
| `strictMode` | false | Fail on warnings instead of continuing |
| `maxFileSize` | "50MB" | Max input size to process |
| `includeRiskAssessment` | false | Add risk/impact analysis to output |
| `cacheResults` | true | Cache results for identical inputs |

## Troubleshooting

### Problem: Skill Returns Generic Result

**Cause**: Input was too vague
**Solution**: Provide more context or use `/doctor` to diagnose

### Problem: Execution Timeout

**Cause**: Input too large or complex
**Solution**: Break into smaller chunks or reduce `maxFileSize`

### Problem: Permission Denied

**Cause**: Tool not in allow list
**Solution**: Grant permission in UI or add to `~/.claude/settings.json`

## Related Skills

- `/other-skill` — Complements this skill for [workflow]
- `/third-skill` — For [related domain]

## Version History

- **v2.1.0** (2026-05-17): Added caching, improved error messages
- **v2.0.0** (2026-05-10): Breaking change - new output format
- **v1.0.0** (2026-04-01): Initial release

## Feedback & Contributions

Found a bug or want a feature? Let us know:
- Email: team@example.com
- GitHub Issues: [repo-link]/issues
- Slack: #skills-feedback

---

**Last Updated**: 2026-05-17  
**Maintained By**: [Team Name]  
**License**: [MIT/Apache/etc]
```

---

## Language-Specific Templates

### Python Code Review Skill

```markdown
---
name: python-code-review
description: Review Python code for PEP 8 compliance, type hints, and best practices
author: Your Name
version: 1.0.0
instructions: |
  You are a Python code quality expert with 10+ years experience.
  
  Review Python code for:
  1. **PEP 8 Compliance** — Style, naming, formatting
  2. **Type Hints** — Completeness and correctness
  3. **Error Handling** — Exception catching, validation
  4. **Performance** — Algorithm choice, N+1 queries
  5. **Testing** — Test coverage recommendations
  6. **Security** — Input validation, auth/crypto issues
  
  Process:
  1. Parse Python syntax (check for syntax errors first)
  2. Scan against PEP 8 rules
  3. Check type hint coverage
  4. Identify performance issues
  5. Recommend improvements
  
  Output format:
  ## Issues by Category
  
  ### Critical (Security/Crashes)
  - [Issue]: [Code] → [Explanation] → [Fix]
  
  ### High (Performance/Testing)
  - [Issue]: [Explanation] → [Suggestion]
  
  ### Medium (Style/Best Practices)
  - [Issue]: [Explanation] → [Pattern]
  
  ## Summary
  Quality: [Low|Medium|High]
  Time to fix: [Estimate]
  Estimated impact: [% improvement if fixed]

allowed-tools: Read, Bash, Write
scope: global
tags: [python, code-review, quality, pep8]
---

# Python Code Review

## What It Does

Reviews Python code for quality, security, and best practices.

## Usage

```bash
/python-code-review @src/main.py
/python-code-review @src/  # Review entire directory
```
```

### JavaScript/TypeScript Linter Skill

```markdown
---
name: ts-linter
description: Lint and analyze TypeScript/JavaScript code for errors and improvements
author: Your Name
version: 1.0.0
instructions: |
  You are a TypeScript/JavaScript expert.
  
  Analyze code for:
  1. Type safety (any types, type errors)
  2. Runtime errors (undefined checks, null safety)
  3. Modern patterns (async/await, destructuring)
  4. Testing coverage
  5. Performance (bundle size, re-renders for React)
  
  For TypeScript files:
  - Check strict mode compliance
  - Identify type errors
  - Suggest type improvements
  
  For JavaScript files:
  - Identify potential runtime errors
  - Suggest type hints (JSDoc)
  - Check for best practices
  
  Output style:
  - Grouped by severity
  - Include before/after code
  - Explain why it matters

allowed-tools: Read, Bash, Write
scope: global
tags: [typescript, javascript, linting, quality]
---

# TypeScript/JavaScript Linter

## What It Does

Analyzes TypeScript/JavaScript files for errors and improvements.

## Usage

```bash
/ts-linter @src/api.ts
/ts-linter @src/components/*.tsx
```
```

### Rust Analyzer Skill

```markdown
---
name: rust-analyzer
description: Analyze Rust code for ownership errors, performance, and idioms
author: Your Name
version: 1.0.0
instructions: |
  You are a Rust expert with deep understanding of ownership, lifetimes, and idioms.
  
  Analyze code for:
  1. Ownership/borrowing issues (even if it compiles)
  2. Performance (allocations, clones)
  3. Idiomatic patterns (iterator chains, pattern matching)
  4. Error handling (Result<T,E> propagation)
  5. Unsafe code (when needed, when not)
  6. Dependency bloat
  
  For each issue:
  - Explain the problem
  - Show the code
  - Provide idiomatic fix
  
  Format output as:
  ### [Issue Category]
  - [Issue]: [Explanation] → [Idiomatic Fix]

allowed-tools: Read, Bash, Write
scope: global
tags: [rust, code-review, performance, idioms]
---

# Rust Code Analyzer

## What It Does

Reviews Rust code for ownership, idioms, and performance.

## Usage

```bash
/rust-analyzer @src/lib.rs
```
```

---

## Quick Install Scripts

### One-Command Install

```bash
#!/bin/bash
# Quick install: Creates and tests a new skill

if [ $# -lt 2 ]; then
  echo "Usage: ./install-skill.sh <skill-name> <description>"
  echo "Example: ./install-skill.sh code-review 'Review code for quality'"
  exit 1
fi

SKILL_NAME=$1
DESCRIPTION=$2
SKILL_DIR="$HOME/.claude/skills/$SKILL_NAME"

# Create directory
mkdir -p "$SKILL_DIR"

# Create SKILL.md with minimal template
cat > "$SKILL_DIR/SKILL.md" <<EOF
---
name: $SKILL_NAME
description: $DESCRIPTION
author: \$(whoami)
version: 1.0.0
instructions: |
  You are a specialized assistant for [domain].
  Your mission: [describe what you do]
  
  Process:
  1. Understand the request
  2. Perform analysis
  3. Return structured results
  
allowed-tools: Read, Write, Bash
scope: session
tags: [skill]
---

# $SKILL_NAME

## What This Skill Does

$DESCRIPTION

## Usage

/$SKILL_NAME [arguments]

## Example

/$SKILL_NAME example-input
EOF

# Test the skill
echo "✅ Skill created: $SKILL_DIR"
echo ""
echo "🧪 Testing skill..."
echo "---"
echo "Try running: /$SKILL_NAME"
echo "Or: /doctor skill $SKILL_NAME"
```

### Multi-Skill Setup Script

```bash
#!/bin/bash
# Install multiple skills at once

SKILLS=(
  "code-review:Review code for quality and security"
  "doc-generator:Generate documentation from code"
  "bug-triage:Categorize and prioritize bugs"
  "perf-analyzer:Find performance bottlenecks"
  "project-setup:Initialize new projects"
)

for skill_config in "${SKILLS[@]}"; do
  IFS=':' read -r skill_name skill_desc <<< "$skill_config"
  
  skill_dir="$HOME/.claude/skills/$skill_name"
  mkdir -p "$skill_dir"
  
  echo "Installing: $skill_name..."
  # [Create SKILL.md for each]
done

echo "✅ All skills installed!"
echo ""
echo "Available skills:"
for skill_config in "${SKILLS[@]}"; do
  IFS=':' read -r skill_name skill_desc <<< "$skill_config"
  echo "  /$skill_name — $skill_desc"
done
```

---

## Environment Variables for Skill Setup

Create skills that read environment configuration:

```bash
# In your skill directory, create .env.example

cat > ~/.claude/skills/my-skill/.env.example <<'EOF'
# Skill configuration
SKILL_ENABLED=true
LOG_LEVEL=info
MAX_FILE_SIZE=10MB
OUTPUT_FORMAT=markdown
CACHE_RESULTS=true
EOF

# Users can copy and customize
cp ~/.claude/skills/my-skill/.env.example ~/.claude/skills/my-skill/.env
```

---

## Skill Initialization Checklist

Use this checklist when creating a new skill:

```markdown
# Skill Creation Checklist

## Pre-Creation
- [ ] Skill purpose is clear
- [ ] Target users identified
- [ ] Tools needed listed
- [ ] Examples prepared

## SKILL.md Creation
- [ ] name: kebab-case, unique
- [ ] description: <100 chars
- [ ] author: filled in
- [ ] version: starts at 1.0.0
- [ ] instructions: role + mission + process
- [ ] allowed-tools: only needed tools
- [ ] scope: session/global chosen
- [ ] tags: 2-4 relevant tags

## Documentation
- [ ] README.md created (if needed)
- [ ] Examples section complete
- [ ] Limitations clearly stated
- [ ] Configuration documented

## Testing
- [ ] Skill discovered: /doctor skill [name]
- [ ] Basic invocation works: /[name]
- [ ] Examples run successfully
- [ ] Error handling works

## Refinement
- [ ] Instructions clear and specific
- [ ] Output format matches docs
- [ ] Performance acceptable
- [ ] No unnecessary permissions required

## Publication
- [ ] Version bumped (if updating)
- [ ] CHANGELOG updated
- [ ] Shared with team/documented
- [ ] Feedback mechanism in place
```

---

## Summary

**Fast Track:**
1. Copy Minimal Skill Template
2. Replace placeholders
3. Test with `/[name]`
4. Iterate

**Production Track:**
1. Copy Production Skill Template
2. Fill all sections thoroughly
3. Create README.md
4. Comprehensive testing
5. Document edge cases
6. Version control

**By Language:**
- Python → Use Python Code Review template
- TypeScript → Use TS Linter template
- Rust → Use Rust Analyzer template
- Custom → Use Standard Skill template

**Installation Options:**
- Manual: Create directory + file
- One-liner: Use install scripts
- Multi: Setup multiple skills at once

---

**Last Updated**: 2026-05-17  
**Version**: 1.0.0
