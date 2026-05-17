# Claude Code Skill Development Reference Guide

Complete index and quick reference for skill development.

---

## File Index

This skill documentation consists of three main files:

| File | Purpose | Best For |
|------|---------|----------|
| **SKILL_DEVELOPMENT_GUIDE.md** | Comprehensive guide with workflow, debugging, best practices | Learning how to create skills; understanding concepts |
| **SKILL_TEMPLATES.md** | Copy-paste templates and quick-start scripts | Getting started fast; building from templates |
| **SKILL_REFERENCE.md** | This file — Quick reference and checklists | Quick lookup; remembering syntax |

---

## Quick Start (60 seconds)

1. **Create skill directory**:
   ```bash
   mkdir -p ~/.claude/skills/my-skill
   ```

2. **Create SKILL.md**:
   ```bash
   cat > ~/.claude/skills/my-skill/SKILL.md <<'EOF'
   ---
   name: my-skill
   description: What your skill does in one line
   author: Your Name
   version: 1.0.0
   instructions: |
     You are [specialist].
     Your job: [what you do]
     Tools: Bash, Read, Write
     Process: [steps]
   allowed-tools: Bash, Read, Write
   scope: session
   tags: [tag1, tag2]
   ---
   
   # Skill Title
   
   /my-skill [arguments]
   EOF
   ```

3. **Test**:
   ```bash
   /my-skill hello
   /doctor skill my-skill
   ```

---

## Frontmatter Quick Reference

### Required Fields

```yaml
---
name: skill-name                    # kebab-case, 2-64 chars
description: One-liner description  # <100 chars
instructions: |                     # Your role + mission
  [Multi-line instructions]
allowed-tools: Tool1, Tool2, Tool3  # Comma-separated
---
```

### Recommended Fields

```yaml
author: Your Name <email@example.com>
version: 1.0.0                      # semver
tags: [tag1, tag2]                  # 2-4 tags
scope: session                      # or global, workspace
```

### Optional Fields

```yaml
hooks: PreToolUse, PostToolUse      # Lifecycle events
```

---

## Tool Reference

### Built-In Tools

| Tool | Use Case | Example |
|------|----------|---------|
| `Bash` | Run shell commands | `bash npm test` |
| `Read` | Load file contents | `Read(/path/file.py)` |
| `Write` | Create/save files | `Write(/path/output.md)` |
| `Edit` | Modify files (diffs) | `Edit(/path/file.py) change X to Y` |
| `Glob` | Fast file search | `Glob(src/**/*.js)` |
| `Grep` | Content search | `Grep(pattern,/path/*.log)` |
| `WebFetch` | Fetch web pages | `WebFetch(https://example.com)` |
| `WebSearch` | Search the web | `WebSearch(topic)` |

### MCP Tools

If MCPs are connected, you can use their tools:

```yaml
allowed-tools: github, slack, jira, github-copilot
```

### Tool Usage in Instructions

```markdown
instructions: |
  Available tools:
  - Bash: Run shell commands
    Example: bash git log --oneline
  - Read: Load files
    Example: Read(path/to/file.py)
  - Write: Create files
    Example: Write(output.md) with content
```

---

## Frontmatter Fields Explained

### `name` Field

```yaml
# ✅ CORRECT
name: code-review
name: python-linter
name: api-validator

# ❌ WRONG
name: Code Review           # Contains spaces
name: code_review           # Contains underscore
name: code-review-tool-v2   # Too long or weird format
name: cr                    # Too short/unclear
```

**Rules:**
- Lowercase letters, numbers, hyphens only
- 2-64 characters
- Unique across all installed skills
- Matches directory name: `~/.claude/skills/{name}/`

### `description` Field

```yaml
# ✅ CORRECT: Action + domain + outcome
description: Review Python code for security and performance
description: Generate database migration scripts from SQL diffs
description: Analyze git commits and create team standup updates

# ❌ WRONG: Too generic or too long
description: Helper tool for developers
description: This is a skill that helps you review code files for many different purposes
```

**Rules:**
- Start with action verb
- Include domain/context
- <100 characters (soft limit)
- Clear about what user gets

### `instructions` Field

```yaml
# ✅ CORRECT: Role + mission + process
instructions: |
  You are a security-focused code reviewer.
  
  Your mission: Find vulnerabilities, performance issues, and anti-patterns.
  
  Process:
  1. Identify language/framework
  2. Scan for common vulnerabilities
  3. Check performance
  4. Output findings by severity

# ❌ WRONG: Too vague or incomplete
instructions: |
  Review code.
```

**Tips:**
- Use `|` for multi-line (literal block)
- Be prescriptive: "Always do X"
- Include examples
- State constraints
- 200-2000 words typical

### `allowed-tools` Field

```yaml
# ✅ CORRECT: List only tools you use
allowed-tools: Read, Bash, Write
allowed-tools: Bash, Grep, Glob
allowed-tools: github, slack
allowed-tools: Read, WebFetch, WebSearch

# ❌ WRONG: Including unnecessary tools
allowed-tools: Read, Write, Bash, Edit, Glob, Grep, WebFetch, WebSearch, github
```

**Principle:** List ONLY tools the skill actually needs.

### `scope` Field

```yaml
# session (default) — Only in current session
scope: session
# Usage: Temporary skill, experimental, single user

# global — Across all sessions
scope: global
# Usage: Production skill, personal use, always available

# workspace — Team shared
scope: workspace
# Usage: Team standard skill, org-wide best practices
```

### `tags` Field

```yaml
# ✅ RECOMMENDED: Specific, discoverable
tags: [code-review, security, python]
tags: [documentation, api-docs, code-generation]
tags: [productivity, automation, testing]

# ❌ AVOID: Too generic or too many
tags: [tool]
tags: [skill, code, analysis, review, quality, python, testing, automation]
```

**Common Tags:**
- **Categories**: `productivity`, `code-review`, `documentation`, `debugging`, `automation`, `testing`
- **Languages**: `python`, `javascript`, `rust`, `go`, `java`
- **Domains**: `web`, `mobile`, `data`, `devops`, `security`, `performance`

### `version` Field

```yaml
version: 1.0.0      # Initial stable release
version: 1.1.0      # Added feature
version: 1.1.1      # Bug fix
version: 2.0.0      # Breaking change
version: 0.9.0-beta # Pre-release
```

**Semantic Versioning Rules:**
- MAJOR.MINOR.PATCH
- PATCH: Bug fixes only
- MINOR: New features (backward compatible)
- MAJOR: Breaking changes

### `author` Field

```yaml
# ✅ RECOMMENDED FORMATS
author: Your Name
author: Your Name <your.email@example.com>
author: Team Name <team.email@company.com>

# ❌ NOT RECOMMENDED
author: anonymous
```

### `hooks` Field

```yaml
# Optional: Register lifecycle event handlers
hooks: PreToolUse, PostToolUse
hooks: PreOutput, PostOutput

# Available hooks:
# - PreToolUse: Before executing any tool
# - PostToolUse: After tool completes
# - PreOutput: Before sending response
# - PostOutput: After response sent
# - PreFork: Before context fork
# - PostFork: After fork completes
```

---

## Common Patterns

### Pattern 1: File Processing Skill

```yaml
instructions: |
  You process files of type [TYPE].
  
  Process:
  1. Read file with Read tool
  2. Parse/analyze content
  3. Generate output
  4. Write results with Write tool
  
  Constraints:
  - Max file size: [SIZE]
  - Supported formats: [FORMATS]
  - Required dependencies: [DEPS]
```

### Pattern 2: Analysis Skill

```yaml
instructions: |
  You analyze [DOMAIN] for [ASPECTS].
  
  For each analysis:
  1. Validate input
  2. Run analysis
  3. Structure findings by severity
  4. Provide actionable recommendations
  
  Output structure:
  - Critical issues first
  - Each issue: explanation + fix
  - Summary + next steps
```

### Pattern 3: Automation Skill

```yaml
instructions: |
  You automate [TASK] by [APPROACH].
  
  Workflow:
  1. Understand the request
  2. Validate prerequisites
  3. Execute automation steps
  4. Verify results
  5. Report what was done
  
  Safety:
  - Always ask before destructive operations
  - Show what will be changed
  - Provide rollback instructions
```

### Pattern 4: Integration Skill

```yaml
instructions: |
  You integrate [SYSTEM A] with [SYSTEM B].
  
  You have access to:
  - [Tool A]: For interacting with System A
  - [Tool B]: For interacting with System B
  
  Workflow:
  1. Connect to System A
  2. Extract/transform data
  3. Connect to System B
  4. Load/validate data
  5. Report integration status
```

---

## Error Handling Patterns

### Pattern 1: Validation

```markdown
Before processing:
1. Check input type and format
2. Verify required fields present
3. Check file/resource exists
4. Validate against constraints

If invalid:
- Explain what's wrong specifically
- Show example of correct format
- Stop processing
```

### Pattern 2: Graceful Degradation

```markdown
Try preferred approach:
1. Use MCP tool if available
2. Fall back to Bash command
3. Fall back to regex parsing
4. Provide result with confidence level

Example:
- "High confidence" (MCP used)
- "Medium confidence" (Bash parsing)
- "Low confidence" (Regex only)
```

### Pattern 3: Progressive Feedback

```markdown
For long operations:
1. Acknowledge request
2. Show progress updates
3. Display partial results if taking time
4. Final summary when complete

Example:
"Processing file... [50% complete]"
"Found 15 issues so far..."
"Analysis complete: 30 issues found"
```

---

## Testing Checklist

Use this to verify your skill works:

```bash
# 1. Syntax check
/doctor skill my-skill
# Should show: ✅ Metadata valid, Tools available

# 2. Basic invocation
/my-skill
# Should execute without error

# 3. With arguments
/my-skill test argument
# Should accept and process arguments

# 4. With file context
/my-skill @/path/to/file.txt
# Should read and process file

# 5. Error handling
/my-skill invalid-input
# Should fail gracefully with explanation

# 6. Performance
# Should complete in reasonable time (seconds, not minutes)

# 7. Output format
# Should match documented format

# 8. Permissions
# All required tools should be in allowed-tools
```

---

## Quick Syntax Reference

### YAML Syntax in Frontmatter

```yaml
---
# String (no quotes needed unless special chars)
name: my-skill
author: John Doe

# String with special chars (use quotes)
description: "Review code for security, performance, and best practices"

# Multi-line string (use | for literal blocks)
instructions: |
  Line 1
  Line 2
  Line 3

# List (square brackets)
allowed-tools: Bash, Read, Write

# List (YAML syntax)
allowed-tools:
  - Bash
  - Read
  - Write

# Number
version: 1.0.0

# Boolean
enabled: true

# Nested object (for reference)
config:
  option1: value1
  option2: value2
---
```

### Common YAML Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| `name: my-skill: v2` | Colon in value | Quote: `"my-skill: v2"` |
| `description: "Unterminated string` | Missing quote | Add closing quote |
| `instructions: Do this` | Not multiline block | Use `\|` prefix |
| `allowed-tools: [Bash Read Write]` | Missing commas | Use `Bash, Read, Write` |
| Mixed indentation | YAML parse error | Use consistent 2-space indent |

---

## File Structure

### Minimal Skill

```
~/.claude/skills/my-skill/
└── SKILL.md              # REQUIRED: Skill definition only
```

### Standard Skill

```
~/.claude/skills/my-skill/
├── SKILL.md              # Skill definition
└── README.md             # Documentation (recommended)
```

### Production Skill

```
~/.claude/skills/my-skill/
├── SKILL.md              # Skill definition
├── README.md             # User documentation
├── .env.example          # Configuration template
└── lib/                  # Optional helper scripts
    ├── util.js
    └── validators.sh
```

---

## Permission Management

### Declaring Tool Usage

```yaml
allowed-tools: Bash, Read, Write, Edit

# In instructions, explain what each tool does:
instructions: |
  Tools used:
  - Bash: Run git commands to analyze history
  - Read: Load file contents for analysis
  - Write: Save analysis results
  - Edit: (Not actually used, should remove from allowed-tools)
```

### Requesting Permissions

First use of a tool:
1. User is prompted
2. User clicks "Allow" or "Block"
3. Permission granted for that skill in that session

For repeated use:
1. Add to ~/.claude/settings.json
2. Create allow rules for common patterns

Example settings.json:

```json
{
  "permissions": {
    "allow": [
      "Read(~/.claude/skills/**)",
      "Bash(git *)",
      "Write(~/.claude/skill-cache/**)"
    ]
  }
}
```

---

## Version Management

### Version Numbers

```
1.0.0  Initial stable release
1.0.1  Bug fix
1.1.0  New feature
2.0.0  Breaking change
```

### When to Update Version

**PATCH** (1.0.X):
- Bug fixes
- Error message improvements
- Documentation updates
- Internal refactoring (no external change)

**MINOR** (1.X.0):
- New features
- New options (backward compatible)
- Tool additions (new optional capability)

**MAJOR** (X.0.0):
- Tool removal (breaking)
- Output format change
- Instruction logic change that affects behavior

### Version Update Example

```yaml
# Before
version: 1.2.3
instructions: |
  Output format:
  [Old format description]

# After: New feature (MINOR bump)
version: 1.3.0
instructions: |
  Output format:
  [Old format description]
  
  New output option:
  Use --json flag for JSON output

# Before
version: 2.0.0

# After: Breaking change (MAJOR bump)
version: 3.0.0
instructions: |
  NOTE: v3.0.0 requires Python 3.8+ (was 3.6+)
  Output format changed to [new format]
```

---

## Debugging Quick Guide

### Skill Not Found

**Check**:
```bash
ls -la ~/.claude/skills/my-skill/SKILL.md
```

**Fix**:
- Create `~/.claude/skills/[name]/` directory
- Create `SKILL.md` in that directory
- Restart Claude Code

### YAML Parse Error

**Check**:
```bash
head -20 ~/.claude/skills/my-skill/SKILL.md
```

**Common issues**:
- Missing quotes on values with special chars
- Inconsistent indentation
- Unmatched brackets or quotes

**Fix**: Use online YAML validator to check syntax

### Tool Permission Denied

**Check**:
```bash
grep allowed-tools ~/.claude/skills/my-skill/SKILL.md
cat ~/.claude/settings.json | grep -A 20 permissions
```

**Fix**:
- Add tool to `allowed-tools`
- Grant permission when prompted
- Add to settings.json allow list if repeated use

### Skill Hangs

**Check**:
- Is a Bash command waiting for input?
- Is there an infinite loop in logic?
- Is context too large (out of memory)?

**Fix**:
- Add `timeout 10` to Bash commands
- Use non-interactive flags (--assume-yes, etc.)
- Break into smaller operations

---

## Performance Tips

### Context Efficiency

```markdown
✅ DO:
- Pass file paths, not file contents
- Use --head for large files (first 50 lines)
- Reference specific sections
- Cache intermediate results

❌ DON'T:
- Include entire 10MB log files
- Load all dependencies into context
- Process same data multiple times
```

### Tool Usage

```markdown
✅ DO:
- Use Bash for complex operations
- Use Grep for content search
- Use Glob for file discovery
- Use Read only when you need content

❌ DON'T:
- Read entire files when you only need line count
- Use Bash for simple string operations
- Chain 10 tools when 2 would do
```

---

## Frequently Asked Questions

### Q: Can a skill call another skill?

**A**: Not directly. But you can chain skills in workflows:
```bash
# User runs first skill
/skill-1 input

# User copies output and runs second skill
/skill-2 @output.txt
```

### Q: Can I use environment variables in a skill?

**A**: Environment variables are read-only and available via Bash:
```bash
echo $HOME
echo $PATH
```

But creating/setting variables for the skill isn't supported.

### Q: How do I make a skill team-shareable?

**A**: Set `scope: workspace` and document thoroughly:
```yaml
scope: workspace    # Available in team workspace
```

Then share `SKILL.md` with README.md and setup instructions.

### Q: Can I schedule a skill to run automatically?

**A**: Not directly. But you can use `/schedule` command to run things on intervals.

### Q: How do I persist state between skill runs?

**A**: Write to `.claude/skill-[name]-state.json`:
```markdown
instructions: |
  State file: ~/.claude/skill-my-skill-state.json
  
  On each run:
  1. Read existing state
  2. Update with new data
  3. Write back to state file
```

### Q: What's the max file size a skill can handle?

**A**: No hard limit, but practical constraints:
- **<1MB**: Fast processing, full context
- **1-10MB**: Slower, consider streaming/chunking
- **>10MB**: Break into smaller pieces

### Q: Can a skill require authentication?

**A**: If using MCP tools (github, slack), authentication is handled by Claude Code.
For custom APIs, include API key setup in README.

### Q: How many tools can a skill use?

**A**: No limit. List all tools you use in `allowed-tools`.

### Q: Can I test a skill without Claude Code?

**A**: Not directly. You need to be in Claude Code to test.
For testing logic, separate your actual code from the SKILL.md wrapper.

---

## Common Skill Patterns

### Command Pattern
Skill that accepts a command/verb:
```yaml
instructions: |
  Commands user can invoke:
  - /skill-name analyze [file]
  - /skill-name report [option]
  - /skill-name fix [issue]
```

### Interactive Pattern
Skill that asks clarifying questions:
```yaml
instructions: |
  1. Ask user what they want to do
  2. Ask for clarifications
  3. Execute once context is clear
  4. Iterate if user requests changes
```

### Batch Pattern
Skill that processes multiple items:
```yaml
instructions: |
  Process multiple items:
  - User provides: list of files, list of commits, etc.
  - For each: apply analysis
  - Aggregate results
  - Show summary
```

### Transform Pattern
Skill that converts between formats:
```yaml
instructions: |
  Input: Format A
  Output: Format B
  
  Process:
  1. Parse input
  2. Transform
  3. Validate output
  4. Return results
```

---

## Resources

### Official Documentation
- **Claude Code Docs**: See CLAUDE.md in project
- **MCP Registry**: modelcontextprotocol.io
- **Anthropic Docs**: docs.anthropic.com

### Related Files
- `SKILL_DEVELOPMENT_GUIDE.md` — Full workflow guide
- `SKILL_TEMPLATES.md` — Ready-to-copy templates
- `.claude/skills/` — Installed skills on your system

### External Tools
- YAML Validator: yamllint.com
- Regex Tester: regex101.com
- JSON Formatter: jsoncrack.com

---

## Summary

**Key Takeaways:**

1. **Create**: Directory + SKILL.md file
2. **Define**: Frontmatter (8 fields, 2 required)
3. **Implement**: Instructions with role + process
4. **Test**: Use `/doctor skill [name]`
5. **Iterate**: Refine based on usage
6. **Share**: Document + version control

**Always Remember:**
- Keep instructions clear and specific
- List only tools you actually use
- Include examples in documentation
- Test before sharing
- Use semantic versioning
- Provide error handling

---

**Last Updated**: 2026-05-17  
**Version**: 1.0.0  
**Questions?**: Check SKILL_DEVELOPMENT_GUIDE.md or SKILL_TEMPLATES.md
