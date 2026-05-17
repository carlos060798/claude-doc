# Claude Code: Quick Reference Checklists

Use these checklists while working through each practical use case. Print or bookmark for quick reference.

---

## ✅ Nivel 1 — Fundamentos

### Checklist 1: Setup First Project

- [ ] Navigate to project: `cd my-project && claude --version`
- [ ] Start session: `claude`
- [ ] Generate CLAUDE.md: `/init`
- [ ] Review generated file and understand stack
- [ ] Load context with @file mentions
- [ ] Edit CLAUDE.md to add:
  - [ ] ## Architecture section
  - [ ] ## Frequent Commands section
  - [ ] ## Key Files section
- [ ] Verify setup: `/doctor`
- [ ] Commit CLAUDE.md: `git add CLAUDE.md && git commit -m "docs: init CLAUDE.md"`

**Done when:** CLAUDE.md is committed and next session loads it automatically

---

### Checklist 2: First Code Review

- [ ] Get PR diff: `git show <hash> > /tmp/pr-diff.txt`
- [ ] Start session: `claude`
- [ ] Rename session: `/rename "PR-review-auth"`
- [ ] Load files: `@auth/login.ts @tests/auth.spec.ts`
- [ ] Request review with format:
  - [ ] Security issues?
  - [ ] Convention compliance?
  - [ ] Test coverage?
  - [ ] Simplifications?
- [ ] Receive structured feedback
- [ ] Post to GitHub:
  - [ ] Group by category (Security, Style, Tests)
  - [ ] Include specific line numbers
  - [ ] Suggest improvements with examples
- [ ] Wait for author changes
- [ ] Rename session: `/rename "PR-review-auth-UPDATED"`
- [ ] Verify fixes: `@auth/login.ts — Did you fix my comments?`

**Done when:** PR merged after your feedback was addressed

---

### Checklist 3: Prod Bug Fix

- [ ] Extract error: `tail -100 /var/log/app.log | grep -A 5 "ERROR_TYPE"`
- [ ] Start session: `claude`
- [ ] Rename: `/rename "PROD-BUG-FIX-userService"`
- [ ] Load context:
  - [ ] @src/services/userService.ts
  - [ ] @src/api/users.ts
  - [ ] Full stack trace in prompt
- [ ] Get diagnosis: "What's broken? Minimal fix."
- [ ] Apply fix to file
- [ ] Test locally:
  - [ ] `npm run dev`
  - [ ] Verify endpoint returns 200
- [ ] Commit: `git commit -m "fix: undefined function in userService line 42"`
- [ ] Push and deploy: `git push`
- [ ] Verify in prod: Check logs, no new errors

**Done when:** Error is fixed in production and users can access endpoint

---

## ✅ Nivel 2 — Intermedio

### Checklist 1: GitHub MCP Auto-Review Setup

- [ ] Create GitHub PAT:
  - [ ] Go to GitHub Settings → Developer settings → Personal access tokens
  - [ ] Select scopes: `repo`, `workflow`
  - [ ] Copy token: `ghp_xxxxx`
- [ ] Add MCP: `claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxx ...`
- [ ] Verify: `claude` → `/mcp` → confirm github listed
- [ ] Create Skill directory: `mkdir -p ~/.claude/skills/github-pr-review`
- [ ] Create SKILL.md with:
  - [ ] Parameters section
  - [ ] Execution logic
  - [ ] GitHub API calls
- [ ] Test Skill: `claude` → `/github-pr-review owner/repo 123`
- [ ] Verify comment posted on GitHub
- [ ] Create GitHub Actions workflow (.github/workflows/auto-review.yml)
- [ ] Push workflow to repo
- [ ] Test with new PR

**Done when:** Every new PR automatically gets reviewed with comments posted

---

### Checklist 2: CI/CD Risk Detection

- [ ] Create Slack Bot Token:
  - [ ] https://api.slack.com/apps → Create New App
  - [ ] Name: "Claude Code Guardian"
  - [ ] OAuth & Permissions → Add scopes: `chat:write`, `files:write`
  - [ ] Copy token: `xoxb_xxxxx`
- [ ] Add to GitHub Secrets: `SLACK_BOT_TOKEN`
- [ ] Add MCP: `claude mcp add slack -e SLACK_BOT_TOKEN=xoxb_xxxxx ...`
- [ ] Create Skill: ~/.claude/skills/risk-analysis/SKILL.md
  - [ ] Define "risky files" (auth/*, database/*, etc)
  - [ ] Add analysis logic
  - [ ] Include Slack posting
- [ ] Test Skill: `claude` → `/risk-analysis <commit-hash>`
- [ ] Verify message in Slack #deployments
- [ ] Create GitHub Actions workflow (.github/workflows/claude-risk-check.yml)
- [ ] Add to repo
- [ ] Make test commit to main
- [ ] Verify workflow runs and Slack alert posts

**Done when:** Every merge to main triggers analysis and team gets alerted of risks

---

### Checklist 3: Team Knowledge Sharing

- [ ] Update CLAUDE.md with:
  - [ ] ## Architecture section (detailed overview)
  - [ ] ## Historical Bugs section (with solutions)
  - [ ] ## Design Decisions section (with rationale)
  - [ ] ## Code Patterns section (conventions)
- [ ] Use /memory in session:
  - [ ] `/memory add "Team: [Names]"`
  - [ ] `/memory add "Current status: [Project state]"`
  - [ ] `/memory add "Deadline: [Date]"`
- [ ] Generate team onboarding: `claude` → `/team-onboarding`
- [ ] Review generated TEAM_ONBOARDING.md
- [ ] Edit for clarity and accuracy
- [ ] Commit both files: `git add CLAUDE.md TEAM_ONBOARDING.md`
- [ ] Push to repo
- [ ] Test with new developer:
  - [ ] Clone repo
  - [ ] `claude`
  - [ ] `@CLAUDE.md @TEAM_ONBOARDING.md`
  - [ ] Ask about project → should get instant overview

**Done when:** New dev understands project in 15 minutes via documents

---

## ✅ Nivel 3 — Avanzado

### Checklist 1: Custom Refactor Skill

- [ ] Plan Skill:
  - [ ] What transformation? (CommonJS → ES modules)
  - [ ] How to detect? (grep patterns)
  - [ ] How to validate? (npm build, tests)
- [ ] Create directory: `mkdir -p ~/.claude/skills/refactor-to-esm`
- [ ] Create SKILL.md with:
  - [ ] ## Usage section (with examples)
  - [ ] ## Parameters (what's $1, $2?)
  - [ ] ## Execution (step-by-step logic)
  - [ ] Include bash commands with !`...`
- [ ] Test on single file: `claude` → `/refactor-to-esm src/file.js`
- [ ] Verify:
  - [ ] File transforms correctly
  - [ ] Tests still pass
  - [ ] Diff looks good
- [ ] Test on batch with /fork:
  - [ ] `/fork "Batch 1"` → `/refactor-to-esm src/services/*.js`
  - [ ] `/fork "Batch 2"` → `/refactor-to-esm src/utils/*.js`
- [ ] All files refactored successfully
- [ ] Share with team: `git add ~/.claude/skills/refactor-to-esm/`
- [ ] Document in README or SKILLS.md how to use

**Done when:** Skill is reusable, shareable, and handles 100+ files without manual intervention

---

### Checklist 2: Multi-Agent Orchestration

- [ ] Create spec document (API design, architecture, etc)
- [ ] Review spec to ensure completeness
- [ ] Start main session: `claude` → `@spec-file`
- [ ] Launch Agent 1 (Backend):
  - [ ] `/fork "Backend Validation"`
  - [ ] Load spec: `@spec-file`
  - [ ] Request backend feasibility analysis
- [ ] Launch Agent 2 (Frontend):
  - [ ] `/fork "Frontend Usability"`
  - [ ] Load spec: `@spec-file`
  - [ ] Request UX/ergonomics analysis
- [ ] Launch Agent 3 (Security):
  - [ ] `/fork "Security Review"`
  - [ ] Load spec: `@spec-file`
  - [ ] Request security & compliance analysis
- [ ] Back in main session, copy feedback from each agent
- [ ] Synthesize: "Give me final design incorporating all three perspectives"
- [ ] Review integrated design for:
  - [ ] Backend feasibility: ✓
  - [ ] Frontend usability: ✓
  - [ ] Security compliance: ✓
- [ ] Commit final design: `git add final-design.md && git commit`

**Done when:** Design has 360° validation from backend/frontend/security

---

### Checklist 3: Cost Optimization

- [ ] Baseline measurement:
  - [ ] `claude` → `/usage`
  - [ ] Note tokens and cost
  - [ ] Document in COST_OPTIMIZATION.md
- [ ] Implement /compact:
  - [ ] Every 500 messages: `/compact keep architecture, discard logs`
  - [ ] Verify history shrinks
- [ ] Implement /fork inheritance:
  - [ ] Create main session with expensive setup
  - [ ] Launch multiple forks: `/fork "Task A"`, `/fork "Task B"`
  - [ ] Verify forks reuse cache (cheaper than main)
  - [ ] Compare tokens used vs non-fork approach
- [ ] Implement /memory:
  - [ ] Create 5-10 memory entries for common context
  - [ ] Verify next session loads them
  - [ ] Check that prompts don't repeat context
- [ ] Optimize model selection:
  - [ ] Haiku: simple tasks (code review, minor debug)
  - [ ] Sonnet: medium tasks (refactoring, feature design)
  - [ ] Opus: complex tasks (architecture, orchestration)
  - [ ] Track tokens per model
- [ ] Create summary table in COST_OPTIMIZATION.md:
  - [ ] Before optimization: X tokens/month
  - [ ] After (expected): Y tokens/month
  - [ ] Actual savings after 1 month
- [ ] Monitor /usage weekly
- [ ] Adjust tactics if drift detected

**Done when:** Tokens reduced by 50%+ with no quality loss

---

## Quick Commands Reference

### Essential Commands (Level 1)

```bash
claude --version           # Verify installation
claude                     # Start session
/init                      # Generate CLAUDE.md
/doctor                    # Diagnose issues
/clear                     # Start fresh
/model claude-sonnet-4-6   # Change model
/help                      # List commands
```

### MCP Commands (Level 2)

```bash
claude mcp add github -e TOKEN -- ...    # Add GitHub MCP
claude mcp add slack -e TOKEN -- ...     # Add Slack MCP
claude mcp list                          # List connected MCPs
/mcp                                     # Show MCP tools in session
/memory add "text"                       # Save persistent context
```

### Advanced Commands (Level 3)

```bash
/fork "description"        # Launch parallel session
/compact [instructions]    # Compress history
/usage                     # Check token usage
/rename "name"            # Name current session
/resume                   # List named sessions
/rewind                   # Restore checkpoint
/team-onboarding          # Generate onboarding doc
```

---

## Common Patterns

### Pattern: Setup + Context

```bash
claude
/init                      # Generate CLAUDE.md
@package.json @README.md   # Load key files
# Ask question about project
```

### Pattern: Code Review

```bash
claude
/rename "PR-review-X"
@file1.ts @file2.ts        # Load changed files
"Professional code review: 1) Security? 2) Style? 3) Tests?"
# Post feedback to GitHub
/rename "PR-review-X-UPDATED"
@file1.ts                  # Verify changes
```

### Pattern: Automation with /fork

```bash
claude
# Expensive setup here

/fork "Task A"
# Task A here

/fork "Task B"
# Task B here

/fork "Task C"
# Task C here
# All 3 run in parallel, sharing cache
```

### Pattern: Long Session Maintenance

```bash
claude
# Do work...
/usage                     # Check cost
/compact keep X, discard Y # Compress if >500 msgs
# More work...
/memory add "Key learnings"
/usage                     # Final check
```

---

## Troubleshooting Matrix

| Problem | Solution |
|---------|----------|
| `claude` command not found | Install: `npm install -g @anthropic-ai/claude-code` |
| "Not authenticated" | Run: `claude auth login` |
| `/init` returns nothing | Ensure `package.json` or `README.md` exists |
| MCP not connecting | Check: `claude mcp list`, verify token, check scopes |
| High token usage | Use: `/compact`, `/fork`, `/memory` |
| Feedback sounds generic | Load `@CLAUDE.md` so Claude knows conventions |
| Production error unclear | Paste full stack trace, not description |
| New dev confused | Share `@CLAUDE.md` and `@TEAM_ONBOARDING.md` |

---

## Print This!

### For Your Desk

```
┌─────────────────────────────────────────┐
│  LEVEL 1 QUICK COMMANDS                 │
├─────────────────────────────────────────┤
│  claude --version                       │
│  claude                                 │
│  /init                                  │
│  /doctor                                │
│  /help                                  │
│                                         │
│  LEVEL 2 QUICK COMMANDS                 │
├─────────────────────────────────────────┤
│  claude mcp add github ...               │
│  /mcp                                   │
│  /memory add "text"                     │
│                                         │
│  LEVEL 3 QUICK COMMANDS                 │
├─────────────────────────────────────────┤
│  /fork "description"                    │
│  /compact [instructions]                │
│  /usage                                 │
└─────────────────────────────────────────┘
```

---

## Progress Tracker

Mark off as you complete each case:

### Level 1
- [ ] Case 1: Setup First Project
- [ ] Case 2: Code Review
- [ ] Case 3: Prod Bug Fix

### Level 2
- [ ] Case 1: GitHub MCP Auto-Review
- [ ] Case 2: CI/CD Risk Detection
- [ ] Case 3: Team Knowledge Sharing

### Level 3
- [ ] Case 1: Custom Refactor Skill
- [ ] Case 2: Multi-Agent Orchestration
- [ ] Case 3: Cost Optimization

**Level 1 Complete:** _____ | **Level 2 Complete:** _____ | **Level 3 Complete:** _____

---

Last updated: 2024-05-17
