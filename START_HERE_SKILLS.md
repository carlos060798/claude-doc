# Claude Code Skills — START HERE

Welcome! This is your entry point to comprehensive Skill development documentation.

---

## What Are Skills?

**Skills** are custom Claude Code commands that extend functionality. Examples:

```bash
/code-review @file.py          # Review code for security/quality
/doc-generator @api.ts         # Generate API documentation
/project-setup python fastapi  # Create new project boilerplate
```

---

## The Fastest Path: 60 Seconds

### For Complete Beginners

```bash
# 1. Create skill directory
mkdir -p ~/.claude/skills/my-skill

# 2. Create SKILL.md (copy-paste this)
cat > ~/.claude/skills/my-skill/SKILL.md <<'EOF'
---
name: my-skill
description: What your skill does in one line
author: Your Name
version: 1.0.0
instructions: |
  You are a specialized assistant.
  Your mission: [what you do]
  
  Process:
  1. Understand the request
  2. Perform analysis
  3. Return results
  
allowed-tools: Read, Write, Bash
scope: session
tags: [tag1, tag2]
---

# My Skill

/my-skill [arguments]
EOF

# 3. Test
/my-skill hello
/doctor skill my-skill
```

Done! Your skill is ready.

---

## Which Document Should I Read?

### 1-Page Overview
**Want just the essentials in 5 minutes?**
→ You're reading it! Also see [Quick Reference Card](#quick-reference-card) below

### Practical Quick Start
**Want copy-paste templates and examples?**
→ **Read: SKILL_TEMPLATES.md**
- Minimal template (fastest start)
- Standard template (professional)
- Production template (enterprise-grade)
- Language-specific templates (Python, TypeScript, Rust)
- Installation scripts

### Learn Everything
**Want the complete guide from concept to mastery?**
→ **Read: SKILL_DEVELOPMENT_GUIDE.md**
- Frontmatter specification (all 9 fields explained)
- Step-by-step workflow (7 steps from idea to published skill)
- Debugging guide (how to fix common issues)
- Best practices (naming, error handling, testing, docs, performance)
- 5 real working examples (code review, project setup, docs, bug triage, perf analysis)
- Advanced techniques (chaining skills, settings integration)
- Troubleshooting (Q&A)

### Quick Lookup Reference
**Need to look something up fast?**
→ **Read: SKILL_REFERENCE.md**
- Syntax reference (YAML, field examples)
- Tool reference (what tools do)
- Common patterns (file processing, analysis, automation, integration)
- Testing checklist
- Frequently asked questions
- 60-second quick start

### Navigation & Cross-References
**Need to find something specific?**
→ **Read: SKILL_DOCUMENTATION_INDEX.md**
- Complete table of contents for all files
- Learning paths (beginner → advanced)
- Cross-reference index (by concept)
- Common workflows (with file links)
- FAQ quick links

---

## Your Learning Path

### Path 1: Just Make It Work (1 hour)

```
1. Copy 60-second example above ✓ (You're done!)
2. Read: SKILL_TEMPLATES.md - Minimal Template
3. Read: SKILL_DEVELOPMENT_GUIDE.md - Step 3 (Testing)
4. Test your skill with /doctor
```

### Path 2: Build Professional Skills (3 hours)

```
1. Do Path 1 above
2. Read: SKILL_DEVELOPMENT_GUIDE.md - Complete guide
3. Copy: SKILL_TEMPLATES.md - Standard template
4. Follow: SKILL_DEVELOPMENT_GUIDE.md - Full workflow (Steps 1-7)
5. Create: README.md documentation
```

### Path 3: Master Skill Development (1 day)

```
1. Do Path 2 above
2. Deep dive: SKILL_DEVELOPMENT_GUIDE.md - All 5 examples
3. Study: SKILL_DEVELOPMENT_GUIDE.md - Advanced techniques
4. Create: Your own advanced skill
5. Reference: SKILL_REFERENCE.md - Patterns & best practices
6. Optimize: Performance & error handling
7. Share: Publish with full documentation
```

---

## Common Scenarios

### "I want to create a Python code review skill"

1. **Copy template**: SKILL_TEMPLATES.md → Python Code Review Skill
2. **See example**: SKILL_DEVELOPMENT_GUIDE.md → Example 1: Code Review
3. **Follow workflow**: SKILL_DEVELOPMENT_GUIDE.md → Step-by-step workflow
4. **Test & debug**: SKILL_DEVELOPMENT_GUIDE.md → Debugging Guide
5. **Optimize**: SKILL_DEVELOPMENT_GUIDE.md → Best Practices

**Time**: 2 hours

### "My skill isn't working"

1. **Run diagnosis**: `/doctor skill [name]`
2. **Check file**: Is it at `~/.claude/skills/[name]/SKILL.md`?
3. **Check YAML**: Use online validator, or read SKILL_REFERENCE.md → Quick Syntax
4. **Search docs**: SKILL_DEVELOPMENT_GUIDE.md → Debugging Guide
5. **Search FAQ**: SKILL_REFERENCE.md → Frequently Asked Questions

**Time**: 30 minutes

### "I need to share a skill with my team"

1. **Finalize skill**: Follow SKILL_DEVELOPMENT_GUIDE.md → Step 6 (Publish)
2. **Document**: Use SKILL_TEMPLATES.md → Production template + README
3. **Check**: Use checklist in SKILL_DOCUMENTATION_INDEX.md → Before Publishing
4. **Share**: Send SKILL.md + README.md + install script
5. **Support**: Include troubleshooting section

**Time**: 2-3 hours

### "I want to create a complex skill with multiple tools"

1. **Study patterns**: SKILL_REFERENCE.md → Common Patterns
2. **Design**: Plan tool usage and workflow
3. **Copy template**: SKILL_TEMPLATES.md → Production template
4. **Implement**: Follow SKILL_DEVELOPMENT_GUIDE.md → Full workflow
5. **Advanced**: Read SKILL_DEVELOPMENT_GUIDE.md → Advanced Techniques
6. **Test thoroughly**: SKILL_REFERENCE.md → Testing Checklist

**Time**: 4-6 hours

---

## Quick Reference Card

**Print or bookmark this:**

```
FILE LOCATION:        ~/.claude/skills/[name]/SKILL.md
REQUIRED FIELDS:      name, description, instructions, allowed-tools
FIELD REFERENCE:      SKILL_REFERENCE.md → Frontmatter Fields
TEST COMMAND:         /doctor skill [name]
EXAMPLES:             SKILL_DEVELOPMENT_GUIDE.md → Real Examples
TEMPLATES:            SKILL_TEMPLATES.md (multiple options)
BEST PRACTICES:       SKILL_DEVELOPMENT_GUIDE.md → Best Practices
DEBUGGING:            SKILL_DEVELOPMENT_GUIDE.md → Debugging Guide
TOOLS LIST:           SKILL_REFERENCE.md → Tool Reference
FAQ:                  SKILL_REFERENCE.md → FAQ section
PATTERN IDEAS:        SKILL_REFERENCE.md → Common Patterns
WORKFLOW STEPS:       SKILL_DEVELOPMENT_GUIDE.md → 7-step process
QUICK LOOKUP:         SKILL_REFERENCE.md (fastest answers)
LEARNING PATHS:       SKILL_DOCUMENTATION_INDEX.md
```

---

## The 4 Documents Explained

### 1. SKILL_DEVELOPMENT_GUIDE.md (50 KB)
**The textbook. Read this to understand how it all works.**

Contains:
- Complete frontmatter specification with examples
- 7-step workflow from idea to publication
- 10+ debugging scenarios and solutions
- 5 working real-world examples
- Best practices and patterns
- Advanced techniques
- Troubleshooting Q&A

**When to read**: You want to understand the complete picture

---

### 2. SKILL_TEMPLATES.md (20 KB)
**The cookbook. Copy-paste templates and follow recipes.**

Contains:
- Minimal template (60-second start)
- Standard template (professional)
- Production template (enterprise)
- Language-specific templates:
  - Python code review
  - TypeScript/JavaScript linter
  - Rust analyzer
- Quick-start bash scripts
- Installation checklist

**When to read**: You want to start quickly, not learn deeply

---

### 3. SKILL_REFERENCE.md (19 KB)
**The dictionary. Fast lookup for specific topics.**

Contains:
- 60-second quick start
- Frontmatter field reference (all 9 fields)
- Tool reference table
- Common patterns and examples
- Testing checklist
- YAML syntax guide with mistakes
- File structure options
- Permission management
- Version management
- FAQ with 10 questions
- Quick reference card

**When to read**: You need to remember something specific, not learn it

---

### 4. SKILL_DOCUMENTATION_INDEX.md (19 KB)
**The map. Navigation, cross-references, learning paths.**

Contains:
- File index and navigation
- Quick navigation by task
- Learning levels (beginner → advanced)
- Complete table of contents
- Cross-reference index
- Learning roadmap (3 phases)
- Common workflows with links
- Pre-publishing checklist
- Document statistics

**When to read**: You're looking for something and don't know which file has it

---

## Skill Anatomy

Every skill has this structure:

```
SKILL.md
├── FRONTMATTER (YAML metadata)
│   ├── name: unique identifier
│   ├── description: one-liner
│   ├── author: who created it
│   ├── version: 1.0.0
│   ├── instructions: role + mission + process
│   ├── allowed-tools: list of tools
│   ├── scope: session|global|workspace
│   └── tags: categorization
│
└── CONTENT (Markdown documentation)
    ├── # Skill Title
    ├── What this skill does
    ├── When to use it
    ├── Usage examples (2-3)
    ├── Limitations
    └── Configuration (if applicable)
```

**Total size**: Usually 200-500 lines

---

## Core Concepts

### name
- Unique identifier for your skill
- Format: `kebab-case-name`
- Examples: `code-review`, `doc-generator`, `bug-triage`

### description
- One-line summary shown in autocomplete
- <100 characters
- Examples: "Review code for security and performance"

### instructions
- Your skill's personality and behavior
- What it does, how it thinks, what tools it uses
- Detailed enough to guide the skill
- 200-2000 words typical

### allowed-tools
- Which tools the skill can use
- `Bash`, `Read`, `Write`, `Edit`, `Glob`, `Grep`, `WebSearch`, `WebFetch`
- Plus any MCP tools (github, slack, etc.)

### scope
- `session`: Only in current Claude Code session
- `global`: Available across all sessions
- `workspace`: Team/workspace shared

### tags
- Categories for discoverability
- Examples: `security`, `python`, `automation`
- Use 2-4 tags

---

## The 5 Real Examples Included

**In SKILL_DEVELOPMENT_GUIDE.md:**

1. **Code Review Skill**
   - Analyzes code for security, performance, best practices
   - Multi-language support
   - Severity-based output

2. **Project Setup Skill**
   - Scaffolds new projects
   - Language and framework support
   - Complete boilerplate generation

3. **Documentation Generator Skill**
   - Extracts docstrings from code
   - Multi-language support
   - API reference generation

4. **Bug Triage Skill**
   - Categorizes bugs by severity
   - Impact analysis
   - Priority recommendations

5. **Performance Analyzer Skill**
   - Identifies bottlenecks
   - Complexity analysis
   - Optimization suggestions

**Each example includes**:
- Complete SKILL.md with frontmatter
- Real usage examples
- Expected output
- Features and configuration

---

## Troubleshooting: Getting Unstuck

| Problem | Solution |
|---------|----------|
| Skill not found | Check `~/.claude/skills/[name]/SKILL.md` exists, restart Claude Code |
| YAML parse error | Validate YAML (use online tool), check indentation, quote special chars |
| Tool permission denied | Add tool to `allowed-tools`, grant permission in UI |
| Skill hangs | Add `timeout` to bash commands, use non-interactive flags |
| Output format wrong | Check `instructions` field specifies output format, review examples |

**Full debugging guide**: SKILL_DEVELOPMENT_GUIDE.md → Debugging Guide

---

## Next Steps

### Option 1: Learn by Doing (Fastest)
```
1. Copy 60-second example above
2. Run: /my-skill hello
3. Run: /doctor skill my-skill
4. Read: SKILL_TEMPLATES.md for more examples
5. Create your own skill!
```

### Option 2: Understand First (Safest)
```
1. Read: SKILL_DEVELOPMENT_GUIDE.md (1 hour)
2. Copy: SKILL_TEMPLATES.md - Standard template (5 min)
3. Follow: SKILL_DEVELOPMENT_GUIDE.md - 7-step workflow
4. Create your skill
5. Test and iterate
```

### Option 3: Get Help on Demand (Efficient)
```
1. Copy a template from SKILL_TEMPLATES.md
2. Test it: /doctor skill [name]
3. Hit a problem? Check:
   - SKILL_REFERENCE.md for quick answers
   - SKILL_DEVELOPMENT_GUIDE.md for deep dives
   - SKILL_DOCUMENTATION_INDEX.md to find what you need
```

---

## File Locations

All files are in: `/c/Users/usuario/claude doc/`

```
├── SKILL_DEVELOPMENT_GUIDE.md      Main textbook (50 KB)
├── SKILL_TEMPLATES.md              Copy-paste templates (20 KB)
├── SKILL_REFERENCE.md              Quick reference (19 KB)
├── SKILL_DOCUMENTATION_INDEX.md    Navigation (19 KB)
└── START_HERE_SKILLS.md            This file (this one)
```

Total: **4,400 lines, 15,000+ words, 50+ examples**

---

## Your Questions Answered

**Q: How long does it take to create a skill?**
A: 5 minutes (minimal), 1 hour (professional), or 1 day (enterprise-grade)

**Q: Do I need to know anything special?**
A: No. Basic understanding of your domain is enough. Syntax learned from examples.

**Q: Can I modify it later?**
A: Yes! Edit SKILL.md, bump version, test again. Simple.

**Q: Can I share it?**
A: Yes! Give others the SKILL.md file + README.md + setup instructions.

**Q: What if I mess up?**
A: Delete the skill directory and start over. Safe to experiment.

**Q: Can I use it without the docs?**
A: Copy a template and try. But docs help when stuck.

---

## Common First Skills to Build

**Ranked by difficulty:**

1. **Text Processor** ⭐ Easiest
   - Take input text, process it, return result
   - Example: uppercase, remove duplicates, format

2. **File Analyzer** ⭐⭐ Easy
   - Read a file, analyze content, return findings
   - Example: count lines, find patterns, check syntax

3. **Code Reviewer** ⭐⭐⭐ Medium
   - Analyze code for issues, structured output
   - Requires domain knowledge (security, performance)

4. **Generator** ⭐⭐⭐ Medium
   - Take input, generate output (docs, boilerplate, code)
   - Requires good templates and examples

5. **Automation** ⭐⭐⭐⭐ Hard
   - Orchestrate multiple steps, handle errors, provide feedback
   - Requires robust error handling and validation

---

## Success Metrics

Your skill is successful when:

✅ **Discovered**: Appears in `/doctor skill [name]`  
✅ **Invoked**: Responds to `/[name]`  
✅ **Works**: Produces expected output  
✅ **Handles errors**: Fails gracefully with explanations  
✅ **Documented**: README.md explains how to use it  
✅ **Tested**: Works for typical use cases  
✅ **Shared**: Team can install and use it  
✅ **Iterated**: Improved based on feedback  

---

## Remember

> **Skills are powerful because they're simple.**
>
> - One SKILL.md file
> - Clear instructions
> - Available tools
> - Expected output
>
> That's it. Start small, iterate often, share widely.

---

## Final Checklist: Ready to Start?

- [ ] I understand what a skill is
- [ ] I know where skills live (`~/.claude/skills/[name]/`)
- [ ] I've seen the 60-second example
- [ ] I know which document to read first
- [ ] I'm ready to create my first skill

**When all checked: Pick one of the "Next Steps" above and go!**

---

## Where to Go From Here

- **Want the 60-second example?** ↑ See above
- **Want templates?** → Read: SKILL_TEMPLATES.md
- **Want to understand everything?** → Read: SKILL_DEVELOPMENT_GUIDE.md
- **Want quick answers?** → Read: SKILL_REFERENCE.md
- **Want to find something?** → Read: SKILL_DOCUMENTATION_INDEX.md
- **Got stuck?** → SKILL_DEVELOPMENT_GUIDE.md → Debugging Guide

---

**Created**: 2026-05-17  
**Version**: 1.0.0  
**Total Docs**: 4 files, 15,000+ words, ready to use

**Happy skill building!** 🚀
