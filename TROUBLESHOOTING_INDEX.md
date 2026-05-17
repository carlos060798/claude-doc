# Troubleshooting Quick Index

## Emergency Issues (Read These First!)

**🔴 CRITICAL - Installation Blocking**
| Issue | Error Message | Quick Fix |
|-------|---------------|-----------|
| [install-001](#install-001-windows) | "Unsupported OS" or "not supported on Windows" | Use WSL or native installer, not Windows CMD |
| [install-003](#install-003-command-not-found) | "claude command not found" | Add `~/.local/bin` or `npm-global/bin` to PATH |
| [native-installer-001](#native-installer-windows) | Native installer freezes in VS Code | Use npm version instead: `npm install -g @anthropic-ai/claude-code` |

**🔴 CRITICAL - MCP/Authentication**
| Issue | Error Message | Quick Fix |
|-------|---------------|-----------|
| [mcp-002](#mcp-002-github-token) | "token not found" or "401 Unauthorized" | Use correct var name: `GITHUB_PERSONAL_ACCESS_TOKEN` (not `GITHUB_TOKEN`) |
| [mcp-005](#mcp-005-stdio-malformed) | "malformed message" or "invalid JSON" | Ensure MCP only writes to stdout; redirect logging to stderr |

**🔴 CRITICAL - Data Loss Risk**
| Issue | Error Message | Quick Fix |
|-------|---------------|-----------|
| [cli-003](#cli-003-compact-loses-info) | Claude forgets context after /compact | Save critical info to CLAUDE.md before /compact |
| [memory-001](#memory-compaction-regression) | Memory forgotten after /compact | Upgrade: `npm install -g @anthropic-ai/claude-code@latest` |

---

## By Category

### 🔧 Installation & Setup (6 Issues)

| ID | Title | Severity | Root Cause |
|----|-------|----------|-----------|
| [install-001](#install-001-windows) | Won't install on Windows | HIGH | Running from Windows CMD, need WSL/native installer |
| [install-002](#install-002-npm-permission) | npm permission denied | HIGH | Running with sudo or wrong npm config |
| [install-003](#install-003-command-not-found) | 'claude' command not found | HIGH | Installation directory not in PATH |
| [install-004](#install-004-vercel-auth) | Vercel CLI auth fails | MEDIUM | Can't open browser for OAuth, or token expired |
| [install-005](#install-005-node-version) | Node.js version conflicts | MEDIUM | Claude Code requires v18+, you have older |

---

### 🔗 MCP Issues (5 Issues)

| ID | Title | Severity | Root Cause |
|----|-------|----------|-----------|
| [mcp-001](#mcp-001-failed-but-running) | MCP shows 'failed' but server running | MEDIUM | Wrong transport type, wrong URL, or server not flushing output |
| [mcp-002](#mcp-002-github-token) | GITHUB_TOKEN not picked up | HIGH | Wrong variable name or token has insufficient permissions |
| [mcp-003](#mcp-003-connection-timeout) | Connection timeout (>60s) | HIGH | Server too slow, hung, or network issue |
| [mcp-004](#mcp-004-permission-denied) | Tool returns 'permission denied' | MEDIUM | Token lacks required scopes or user lacks access |
| [mcp-005](#mcp-005-stdio-malformed) | Stdio communication broken | HIGH | Server writing unintended output to stdout |

---

### 💻 CLI & Commands (5 Issues)

| ID | Title | Severity | Root Cause |
|----|-------|----------|-----------|
| [cli-001](#cli-001-fork-undefined-context) | /fork context fails | MEDIUM | Wrong syntax or context doesn't exist |
| [cli-002](#cli-002-memory-not-persisting) | /memory not persisting | MEDIUM | MEMORY.md exceeds 200-line limit or format wrong |
| [cli-003](#cli-003-compact-loses-info) | /compact loses information | HIGH | Summary loses nuance; critical info not in CLAUDE.md |
| [cli-004](#cli-004-init-no-claude-md) | /init doesn't generate CLAUDE.md | LOW | Ran in wrong directory or file already deleted |
| [cli-005](#cli-005-slash-autocomplete) | Slash commands don't autocomplete | LOW | Version doesn't support autocomplete or terminal doesn't support ANSI |

---

### 🎯 Skills Development (3 Issues)

| ID | Title | Severity | Root Cause |
|----|-------|----------|-----------|
| [skills-001](#skills-001-frontmatter-error) | Skill frontmatter syntax error | HIGH | YAML syntax errors (special chars, multi-line, invalid fields) |
| [skills-002](#skills-002-skill-not-discoverable) | Skill doesn't appear in autocomplete | MEDIUM | Frontmatter invalid, wrong location, or cache stale |
| [skills-003](#skills-003-context-bleeding) | Skill context bleeds into main session | MEDIUM | Skill modifies global state or files unexpectedly |

---

### ⚡ Performance & Behavior (3 Issues)

| ID | Title | Severity | Root Cause |
|----|-------|----------|-----------|
| [perf-001](#perf-001-cache-miss) | Prompt cache miss every time | HIGH | Prefix doesn't match; system prompt/tools changed |
| [perf-002](#perf-002-search-slow) | Search slow with large codebases | MEDIUM | Search query too vague, too many files scanned |
| [memory-001](#memory-compaction-regression) | Memory forgotten after /compact | HIGH | Stale context regression in v2.1.62+ |

---

## Problem Index by Error Message

### Error: "Claude Code is not supported on Windows"
→ [install-001: Windows Installation](#install-001-windows)

### Error: "command not found" or "is not recognized"
→ [install-003: Command Not Found](#install-003-command-not-found)

### Error: "npm ERR! code EPERM" or "permission denied"
→ [install-002: npm Permission](#install-002-npm-permission)

### Error: "Unsupported Node.js version" or "module not found"
→ [install-005: Node.js Version](#install-005-node-version)

### Error: "Environment variable X is not set" (GitHub MCP)
→ [mcp-002: GITHUB_TOKEN](#mcp-002-github-token)

### Error: "401 Unauthorized" or "authentication failed" (MCP)
→ [mcp-002: GITHUB_TOKEN](#mcp-002-github-token)

### Error: "malformed message" or "invalid JSONRPC" (MCP)
→ [mcp-005: Stdio Malformed](#mcp-005-stdio-malformed)

### Error: "request timeout" or "operation timed out" (MCP)
→ [mcp-003: Connection Timeout](#mcp-003-connection-timeout)

### Error: "SkillInvalidError" or "frontmatter parsing failed"
→ [skills-001: Frontmatter Error](#skills-001-frontmatter-error)

### Error: "undefined context" (/fork)
→ [cli-001: Fork Context Error](#cli-001-fork-undefined-context)

### Native installer freezes in VS Code on Windows
→ [native-installer-001: Windows Freeze](#native-installer-windows)

### Claude forgets instructions after /compact
→ [memory-001: Stale Context Regression](#memory-compaction-regression) or [cli-003: Compact Loses Info](#cli-003-compact-loses-info)

### Memory not persisting between sessions
→ [cli-002: Memory Not Persisting](#cli-002-memory-not-persisting)

---

## Severity Breakdown

### 🔴 HIGH SEVERITY (Fix Immediately)
- install-001: Windows won't install
- install-002: npm permission denied
- install-003: claude command not found
- mcp-002: GITHUB_TOKEN not working
- mcp-003: Connection timeout
- mcp-005: Stdio communication broken
- cli-003: /compact loses info
- skills-001: Frontmatter syntax error
- perf-001: Cache miss every time
- native-installer-001: Windows freezes
- memory-001: Stale context regression

### 🟡 MEDIUM SEVERITY (Fix Soon)
- install-004: Vercel auth fails
- install-005: Node version conflicts
- mcp-001: MCP shows failed but running
- mcp-004: Permission denied (MCP)
- cli-001: /fork context fails
- cli-002: Memory not persisting
- perf-002: Search slow
- skills-002: Skill not discoverable
- skills-003: Context bleeding
- env-var-001: Env vars not expanding

### 🟢 LOW SEVERITY (Fix When Convenient)
- cli-004: /init no CLAUDE.md
- cli-005: Slash autocomplete doesn't work

---

## Quick Diagnosis Flowchart

### Problem: Claude Code won't start or commands don't work
```
Is it "command not found"?
├─ YES → Check install-003 (PATH)
└─ NO ─┬─ Is it "permission denied"?
       ├─ YES → Check install-002 (npm perms)
       └─ NO ─┬─ Is it "Unsupported OS"?
              ├─ YES → Check install-001 (Windows)
              └─ NO → Check install-005 (Node version)
```

### Problem: MCP (GitHub, etc.) not working
```
Is it "token not found" or "401"?
├─ YES → Check mcp-002 (GitHub token)
└─ NO ─┬─ Is it "malformed message" or "invalid JSON"?
       ├─ YES → Check mcp-005 (Stdio)
       └─ NO ─┬─ Is it "timeout"?
              ├─ YES → Check mcp-003 (Timeout)
              └─ NO ─┬─ Is it "connection failed"?
                     ├─ YES → Check mcp-001 (Failed but running)
                     └─ NO → Check mcp-004 (Permission denied)
```

### Problem: Claude forgetting things or losing context
```
Is it after /compact?
├─ YES ─┬─ Are instructions being ignored?
        ├─ YES → Check memory-001 (Stale context) - UPGRADE!
        └─ NO → Check cli-003 (Compact loses info)
└─ NO ─┬─ Are MEMORY.md settings not persisting?
       └─ YES → Check cli-002 (Memory not persisting)
```

### Problem: Skills not working
```
Is it "SkillInvalidError" or frontmatter error?
├─ YES → Check skills-001 (Frontmatter)
└─ NO ─┬─ Skill doesn't appear in /skill-name?
       ├─ YES → Check skills-002 (Not discoverable)
       └─ NO → Check skills-003 (Context bleeding)
```

### Problem: Performance is slow
```
Is it search that's slow?
├─ YES → Check perf-002 (Search slow)
└─ NO ─┬─ Is context getting large?
       ├─ YES → Use /compact or check perf-001 (Cache)
       └─ NO → Check /context show to diagnose
```

---

## Most Common Solutions (Apply These First)

### 1. "Command Not Found" After Installation
```bash
# Add installation directory to PATH
[Environment]::SetEnvironmentVariable('PATH', "$env:PATH;$env:USERPROFILE\.local\bin", [EnvironmentVariableTarget]::User)
# Then restart terminal completely
```

### 2. GitHub Token Not Working
```bash
# Use correct variable name
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxx
# Then restart Claude Code
```

### 3. Memory Not Persisting
```bash
# Use CLAUDE.md instead (persistent, in git)
# Put this in CLAUDE.md:
## Preferences
- Use async/await over promises
- Prefer TypeScript strict mode
```

### 4. Native Installer Freezes on Windows
```bash
# Just use npm version instead
npm install -g @anthropic-ai/claude-code
# It works perfectly in VS Code terminal
```

### 5. /compact Loses Important Info
```bash
# Save critical info to CLAUDE.md BEFORE compacting
# Then compact with focus request:
/compact focus: 'Project architecture, authentication, known bugs'
```

### 6. MCP Shows "Failed" But Server Works
```bash
# Check MCP logs first
# Ctrl+Shift+U → Select "MCP Logs"
# Look for connection or output errors
```

### 7. Skill Frontmatter Error
```yaml
---
name: my-skill  # lowercase, no spaces, max 64 chars
description: "Clear, single line description."  # max 1024 chars, quoted if has special chars
---
# Skills Instructions
```

### 8. Claude Ignores Instructions After /compact
```bash
# UPGRADE immediately - known regression in v2.1.62+
npm install -g @anthropic-ai/claude-code@latest
```

---

## When to Escalate

### Contact Support If:
1. Problem still exists after all troubleshooting steps
2. Error message is not in this guide
3. Issue is reproducible on latest version
4. Multiple problems combined

### Provide These Details:
1. Full error message and stack trace
2. Your Claude Code version: `claude --version`
3. Your OS: `uname -a` (Linux/Mac) or `Get-ComputerInfo` (Windows)
4. Steps to reproduce (exact commands)
5. Relevant config: `cat CLAUDE.md` (first 50 lines)
6. MCP logs if MCP-related: Ctrl+Shift+U → copy entire log

### Report Bug To:
- GitHub: https://github.com/anthropics/claude-code/issues
- Support: https://support.claude.com/en/
- Include all details above in bug report

---

## Prevention Checklist

Before starting a new project:
- [ ] Update Claude Code: `npm install -g @anthropic-ai/claude-code@latest`
- [ ] Verify Node.js v18+: `node --version`
- [ ] Create CLAUDE.md: `/init` (or manually)
- [ ] Add critical instructions to CLAUDE.md (not MEMORY.md)
- [ ] Document all environment variables needed
- [ ] Set up MCP tokens in settings.json (not code)

During development:
- [ ] Compact proactively every 30-60 minutes: `/compact`
- [ ] Save important findings to CLAUDE.md
- [ ] Monitor cache performance: `/context show`
- [ ] Check MCP logs regularly: Ctrl+Shift+U
- [ ] Keep skills simple and isolated

Before important work:
- [ ] Backup CLAUDE.md to version control
- [ ] Create fork session: `/fork` (safe copy)
- [ ] Test new MCPs in isolation first
- [ ] Verify memory is loaded: `/context show`

---

## Version Tracking

If reporting issues, always include version:
```bash
claude --version
```

**Known Issues by Version**:
- **v2.1.62+**: Stale context regression after /compact (FIXED in latest)
- **v2.1.31**: Interactive mode freezes on Windows 11
- **Native installer + VS Code Windows**: Freezes (use npm instead)

**Recommendation**: Always use latest version for bug fixes and improvements.

---

## Related Resources

- **Full Guide**: See TROUBLESHOOTING_GUIDE.md or TROUBLESHOOTING_GUIDE.json
- **Installation**: https://code.claude.com/docs/en/troubleshoot-install
- **MCP Docs**: https://modelcontextprotocol.io
- **Skills Guide**: https://code.claude.com/docs/en/skills
- **Support Center**: https://support.claude.com

---

*This index is for quick navigation. See TROUBLESHOOTING_GUIDE.md for complete solutions.*
