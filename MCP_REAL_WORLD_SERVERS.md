# 5 Real-World MCP Servers You Can Install TODAY

This guide covers **5 officially maintained MCP servers** from the Model Context Protocol team and partners, with complete installation instructions, configuration examples, and real-world usage patterns.

---

## 1. FILESYSTEM MCP (@modelcontextprotocol/server-filesystem)

**Official Repository**: [github.com/modelcontextprotocol/servers/tree/main/src/filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)

### What It Does

Provides secure file and directory operations for Claude with configurable access controls:
- Read files (text & binary)
- Write and create files
- Create, list, delete directories
- Search files by pattern (recursive)
- Move/rename files and directories
- View file metadata and directory trees

### Installation

**NPX (Recommended)**:
```bash
npx -y @modelcontextprotocol/server-filesystem /path/to/allowed/directory
```

**Docker**:
```bash
docker run -i --rm --mount type=bind,src=/path/to/dir,dst=/projects/dir mcp/filesystem /projects
```

### Official .mcp.json Configuration

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Projects",
        "/Users/username/Documents"
      ]
    }
  }
}
```

**Multiple directories**: List as many allowed paths as needed. The server will deny access to any path outside these directories.

### Real-World Examples

**Example 1**: "Find all TODO comments in my src/ directory"
```
Claude: I'll search for TODO comments across your codebase.
[Uses: search_files tool with pattern /(TODO|FIXME)/]
```

**Example 2**: "Create a new configuration file in my project"
```
Claude: I'll create a new .env.example file with template values.
[Uses: write_file tool to create new file]
```

**Example 3**: "Show me the structure of my project"
```
Claude: Let me generate a directory tree.
[Uses: list_directory and get_file_metadata tools]
```

### Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| **Permission denied** | Path not in allowed list | Add directory to filesystem args |
| **ENOENT** | File/directory doesn't exist | Verify path is correct |
| **Read-only filesystem** | Write operation on protected dir | Check file permissions |
| **Path traversal blocked** | Attempting `../../../etc` | Access control is working as designed |

**Setup verification**:
```bash
# Test filesystem access by asking Claude:
"What files are in my home directory?"
# If it returns nothing, the path isn't configured
```

### Tools Available

**Read-Only (10 tools)**:
- `read_file` — Read text/binary file content
- `read_multiple_files` — Read multiple files in one call
- `list_directory` — List directory contents with sizes
- `get_file_metadata` — File info (size, type, modified)
- `search_files` — Recursive pattern search
- `get_directory_tree` — ASCII tree visualization

**Write-Capable (4 tools)**:
- `write_file` — Create or overwrite file
- `create_directory` — Create new directory
- `move_file` — Move/rename files
- `delete_file` / `delete_directory` — Remove files/dirs (idempotent: false)

---

## 2. GIT MCP (mcp-server-git)

**Official Repository**: [github.com/modelcontextprotocol/servers/tree/main/src/git](https://github.com/modelcontextprotocol/servers/tree/main/src/git)

### What It Does

Enables Claude to read, search, and manipulate Git repositories:
- View repository status and diffs
- Commit, stage, and reset changes
- View commit history and details
- Create, checkout, and manage branches
- Search git logs

### Installation

**UV (Recommended)** — No installation required:
```bash
uvx mcp-server-git
```

**PIP**:
```bash
pip install mcp-server-git
python -m mcp_server_git
```

**Docker**:
```bash
docker run -i --rm -v /path/to/repo:/repo mcp/git /repo
```

### Official .mcp.json Configuration

```json
{
  "mcpServers": {
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git"],
      "env": {
        "GIT_DIR": "/path/to/repo/.git"
      }
    }
  }
}
```

Or with docker:
```json
{
  "mcpServers": {
    "git": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "/path/to/repo:/repo",
        "mcp/git",
        "/repo"
      ]
    }
  }
}
```

### Real-World Examples

**Example 1**: "What changes have I made since last commit?"
```
Claude: I'll show you the unstaged changes in your repository.
[Uses: git_diff_unstaged]
Output: Shows modified files and line-by-line diffs
```

**Example 2**: "Create a feature branch and make a commit"
```
Claude: I'll create a new branch called 'add-auth' and stage changes.
[Uses: git_create_branch, git_add, git_commit]
```

**Example 3**: "Show me commits from the last 7 days"
```
Claude: Fetching recent commits...
[Uses: git_log with since: "7 days ago"]
Output: List of recent commits with dates and messages
```

### Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| **No git repository** | .git directory not found | Run `git init` first, or provide correct path |
| **Permission denied** | User can't write to repo | Check file permissions, use sudo if needed |
| **Merge conflict** | Can't auto-merge changes | Manual resolution required |
| **Detached HEAD** | Not on a branch | Use `git_checkout` to switch to branch |

**Troubleshooting**:
```bash
# Verify git is installed and repo exists
git status  # Should show "On branch main" or similar

# Check MCP configuration
claude /mcp  # List connected MCPs in Claude Code
```

### Tools Available (12 Total)

- `git_status` — Repository status
- `git_diff_unstaged` — View unstaged changes
- `git_diff_staged` — View staged changes
- `git_add` — Stage files
- `git_reset` — Unstage files
- `git_commit` — Create commit with message
- `git_log` — View commit history (supports date filtering: ISO 8601, relative, absolute)
- `git_show` — Show specific commit details
- `git_create_branch` — Create new branch
- `git_checkout` — Switch branches
- `git_branch` — List branches
- `git_diff` — Compare arbitrary commits

---

## 3. FETCH MCP (@modelcontextprotocol/server-fetch)

**Official Repository**: [github.com/modelcontextprotocol/servers/tree/main/src/fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch)

### What It Does

Retrieves and converts web content into Markdown for efficient LLM processing:
- Fetch HTML pages and convert to Markdown
- Configurable content length limits
- Chunked reading (start_index for pagination)
- Optional raw mode (unformatted content)
- Supports robots.txt, custom user-agents, proxies

### Installation

**UV (Recommended)**:
```bash
uvx mcp-server-fetch
```

**PIP**:
```bash
pip install mcp-server-fetch
python -m mcp_server_fetch
```

**Docker**:
```bash
docker run -i --rm mcp/fetch
```

### Official .mcp.json Configuration

```json
{
  "mcpServers": {
    "fetch": {
      "command": "uvx",
      "args": ["mcp-server-fetch"]
    }
  }
}
```

With custom settings:
```json
{
  "mcpServers": {
    "fetch": {
      "command": "uvx",
      "args": [
        "mcp-server-fetch",
        "--max-length",
        "10000"
      ]
    }
  }
}
```

### Real-World Examples

**Example 1**: "What's the latest news on GitHub Actions?"
```
Claude: I'll fetch the GitHub Actions documentation page.
[Uses: fetch with url: "https://github.com/features/actions"]
Output: Markdown-formatted content, up to 5000 characters (default)
```

**Example 2**: "Extract the pricing table from this SaaS landing page"
```
Claude: Retrieving the pricing page...
[Uses: fetch with url: "https://example.com/pricing"]
Output: Clean Markdown table with pricing tiers and features
```

**Example 3**: "Get the full content of a long article in chunks"
```
Claude: Fetching article (part 1 of 3)...
[Uses: fetch with start_index: 0, max_length: 5000]
Claude: Continuing (part 2)...
[Uses: fetch with start_index: 5000, max_length: 5000]
```

### Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| **Connection refused** | Website unreachable or timeout | Verify URL is correct, check internet connection |
| **403 Forbidden** | Site blocks MCP's user-agent | Server respects robots.txt; use legitimate user-agent |
| **SSL error** | HTTPS certificate issue | Ensure URL uses valid HTTPS |
| **Security warning** | Local/internal IP access | This is intentional; be cautious with private networks |

**Security Note**: This server can access local/internal IP addresses (`127.0.0.1`, `192.168.x.x`). Do not expose to untrusted clients.

### Tools Available

**Single Tool**: `fetch`

Parameters:
- `url` (required) — Full URL including protocol
- `max_length` (optional, default: 5000) — Character limit for response
- `start_index` (optional, default: 0) — Starting position for chunked reading
- `raw` (optional, default: false) — Return unformatted HTML instead of Markdown

---

## 4. MEMORY MCP (@modelcontextprotocol/server-memory)

**Official Repository**: [github.com/modelcontextprotocol/servers/tree/main/src/memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory)

### What It Does

Implements persistent memory using a knowledge graph (entities, relations, observations):
- Create and manage entities (knowledge nodes)
- Establish relationships between entities
- Add discrete observations/facts
- Search and retrieve knowledge
- Maintain conversation context across sessions

**Use Case**: Remember user preferences, project context, personal information across conversations.

### Installation

**NPX (Recommended)**:
```bash
npx -y @modelcontextprotocol/server-memory
```

**Docker**:
```bash
docker run -i -v claude-memory:/app/dist --rm mcp/memory
```

**PIP** (if available):
```bash
pip install mcp-server-memory
python -m mcp_server_memory
```

### Official .mcp.json Configuration

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

With custom storage location:
```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_FILE_PATH": "/path/to/memory.jsonl"
      }
    }
  }
}
```

### Real-World Examples

**Example 1**: "Remember that I prefer dark mode and use TypeScript"
```
Claude: I'll remember your preferences.
[Uses: create_entities {"type": "User", "observation": "Prefers dark mode"}]
[Uses: create_relations from User to TypeScript {"type": "uses_language"}]
Result: Stored in knowledge graph for future reference
```

**Example 2**: "What do you know about my project?"
```
Claude: Searching memory...
[Uses: search_nodes with query: "project"]
Output: Lists all entities and relations related to your projects
```

**Example 3**: "Add a new fact to my profile"
```
Claude: Updating your profile information...
[Uses: add_observations to existing entity]
Result: New fact appended to your knowledge graph
```

### Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| **MEMORY_FILE_PATH not writable** | Permission issue | Check directory ownership: `chmod 755 /path/to/dir` |
| **Knowledge graph corruption** | Malformed JSONL | Restore from backup or start fresh |
| **Search returns empty** | Entity doesn't exist yet | Create the entity first with `create_entities` |

**Persistence Check**:
```bash
# Verify memory storage
ls -la ~/.memory/ # or check MEMORY_FILE_PATH
# File should be .jsonl format (one JSON object per line)
```

### Tools Available (8 Total)

**Creation**:
- `create_entities` — Add knowledge graph nodes with type and observations
- `create_relations` — Establish directed connections (active voice, e.g., "uses_language")
- `add_observations` — Append facts to existing entities

**Deletion**:
- `delete_entities` — Remove nodes (cascades to relations)
- `delete_relations` — Remove specific connections
- `delete_observations` — Remove facts from entities

**Retrieval**:
- `read_graph` — Export entire knowledge graph
- `search_nodes` — Query by name, type, or observation content

### System Prompt Recommendation

Add this to your CLAUDE.md for better memory usage:
```
When the user shares personal information, preferences, or context:
1. Use memory/create_entities to store the information
2. Categorize into: identity, behaviors, preferences, goals, relationships
3. Use memory/search_nodes at conversation start to retrieve relevant context
4. Update memory/add_observations with new facts throughout conversation
```

---

## 5. GITHUB MCP (Official - ghcr.io/github/github-mcp-server)

**Official Repository**: [github.com/github/github-mcp-server](https://github.com/github/github-mcp-server)

**Status**: ⚠️ IMPORTANT: The npm package `@modelcontextprotocol/server-github` was deprecated in April 2025. Use the Docker image instead.

### What It Does

Connects Claude to GitHub with full repository and workflow management:
- Browse code, search files, view commits
- Manage issues and pull requests
- Monitor GitHub Actions workflows
- View security findings and Dependabot alerts
- Access discussions and manage notifications
- Create and update workflows

### Installation

**Option 1: Remote Server (Easiest, Recommended)**
```bash
# No installation needed - uses GitHub's hosted server
# Requires OAuth authentication via GitHub
```

**Option 2: Docker (Local)**
```bash
docker pull ghcr.io/github/github-mcp-server:latest
docker run ghcr.io/github/github-mcp-server:latest
```

**Option 3: Claude Code CLI**
```bash
# Create .env file with token
echo "GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxx" > .env

# Add to .claude/settings.json
```

### Official .mcp.json Configuration

**Docker Local Installation**:
```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "ghcr.io/github/github-mcp-server:latest"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    }
  }
}
```

**Claude Code (with token in .env)**:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "github-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

### Setup Instructions

#### Step 1: Create GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: **repo**, **read:user**, **read:org** (minimum required)
4. Create token and copy it (you won't see it again)

#### Step 2: Store Token Securely

**Option A: .env file**
```bash
# In your project root
echo "GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here" > .env
# DO NOT commit .env to git - add to .gitignore
```

**Option B: Environment variable**
```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
```

#### Step 3: Add to .claude/settings.json

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "ghcr.io/github/github-mcp-server:latest"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

#### Step 4: Test Connection

```bash
# In Claude Code
/mcp

# Should list "github" as connected
# Then ask Claude: "List my recent repositories"
```

### Real-World Examples

**Example 1**: "Search for open bugs labeled 'critical' in my repo"
```
User: "Find all critical bugs in my repo"
Claude: Searching github.com/username/my-repo for open issues...
[Uses: search_issues with labels: "critical", state: "open"]
Output: List of 3 critical issues with descriptions and links
```

**Example 2**: "Create a pull request from this branch"
```
User: "Create a PR for the feature branch I'm working on"
Claude: Creating pull request from feature/auth to main...
[Uses: create_pull_request with title, body, branch names]
Output: PR created at github.com/username/repo/pull/123
```

**Example 3**: "Check why GitHub Actions is failing"
```
User: "Why did my latest workflow fail?"
Claude: Fetching workflow run details...
[Uses: get_workflow_run_logs]
Output: Shows failed step with error message and logs
```

**Example 4**: "Review code in a pull request"
```
User: "Summarize the changes in PR #456"
Claude: Fetching PR details and file changes...
[Uses: get_pull_request, list_pull_request_files, get_file_content]
Output: Summary of changed files and key modifications
```

### Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| **401 Unauthorized** | Invalid or expired token | Regenerate GitHub PAT, verify token in env |
| **403 Forbidden** | Token lacks required scopes | Regenerate with "repo" scope included |
| **Repository not found** | Wrong repo name or no access | Verify you have access to the repository |
| **Docker permission denied** | Docker not running or permissions | `docker ps` to verify, use `sudo` if needed |
| **Rate limit exceeded** | GitHub API rate limit hit | Wait 1 hour or authenticate (higher limits) |

**Token Verification**:
```bash
# Test your token (outside of Claude)
curl -H "Authorization: token ghp_xxxx" https://api.github.com/user

# Should return your GitHub user info
```

### Tools Available

**Repository & Code**:
- `search_repositories` — Find repos by name/topic
- `search_code` — Search code across repositories
- `get_repository_details` — Repo info, stats, languages
- `list_repository_files` — Directory listing
- `search_issues` — Find issues and PRs
- `list_commits` — View commit history

**Issues & PRs**:
- `create_issue` — File new issue
- `create_pull_request` — Create PR
- `update_issue` — Modify issue status/labels
- `update_pull_request` — Update PR details
- `add_issue_comment` — Comment on issue/PR
- `review_pull_request` — Add PR review

**Workflows & Actions**:
- `get_workflow_runs` — List action runs
- `get_workflow_run_logs` — Download logs
- `trigger_workflow` — Run workflow manually

---

## 6. TIME MCP (Bonus: @modelcontextprotocol/server-time)

**Official Repository**: [github.com/modelcontextprotocol/servers/tree/main/src/time](https://github.com/modelcontextprotocol/servers/tree/main/src/time)

### What It Does

Provides current time and timezone conversion capabilities:
- Get current time in any IANA timezone
- Convert times between timezones
- Automatic system timezone detection

### Installation

**UV (Recommended)**:
```bash
uvx mcp-server-time
```

**PIP**:
```bash
pip install mcp-server-time
python -m mcp_server_time
```

### Configuration

```json
{
  "mcpServers": {
    "time": {
      "command": "uvx",
      "args": ["mcp-server-time"]
    }
  }
}
```

With custom timezone:
```json
{
  "mcpServers": {
    "time": {
      "command": "uvx",
      "args": ["mcp-server-time", "--local-timezone", "America/New_York"]
    }
  }
}
```

### Real-World Examples

**Example 1**: "What time is it in Tokyo right now?"
```
Claude: Checking current time in Tokyo...
[Uses: get_current_time with timezone: "Asia/Tokyo"]
Output: 2026-05-17 14:32:45 JST
```

**Example 2**: "Convert 3 PM New York time to London time"
```
Claude: Converting time zones...
[Uses: convert_time from "America/New_York" to "Europe/London"]
Output: 3:00 PM EDT → 8:00 PM BST
```

### Tools Available

- `get_current_time` — Current time in specified IANA timezone
- `convert_time` — Convert time between two timezones (24-hour format)

---

## Quick Comparison Table

| Server | Type | Installation | Auth Required | Best For |
|--------|------|--------------|---------------|----------|
| **Filesystem** | File ops | `npx` | No | Reading/writing project files |
| **Git** | VCS | `uvx` | No | Repo management, commits, diffs |
| **Fetch** | Web | `uvx` | No | Fetching web content, scraping |
| **Memory** | Database | `npx` | No | Persistent knowledge across sessions |
| **GitHub** | API | Docker | Yes (PAT) | Repository, issues, workflows, PRs |
| **Time** | Utility | `uvx` | No | Timezone conversions, scheduling |

---

## How to Install Multiple Servers

Edit `~/.claude/settings.json` (or project `.claude/settings.json`):

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/code"]
    },
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git"]
    },
    "fetch": {
      "command": "uvx",
      "args": ["mcp-server-fetch"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "github": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "ghcr.io/github/github-mcp-server:latest"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    },
    "time": {
      "command": "uvx",
      "args": ["mcp-server-time"]
    }
  }
}
```

Then verify:
```bash
# In Claude Code
/mcp
# Should list all 6 servers as connected
```

---

## Important Notes

### Archived Servers (No Longer Maintained)

The following servers were archived on May 29, 2025 and should **NOT** be used in production:
- GitHub (old @modelcontextprotocol version) → Use official `ghcr.io/github/github-mcp-server` instead
- PostgreSQL → Use community alternatives like pgvector MCP
- Slack → Archived; no official replacement yet
- Brave Search → Archived
- Redis, Sentry, Puppeteer, etc. → See [servers-archived](https://github.com/modelcontextprotocol/servers-archived)

### Security Best Practices

1. **Never hardcode tokens** in configuration files
2. **Use environment variables** or `.env` files
3. **Restrict file system access** to only necessary directories
4. **Audit GitHub PAT scopes** — use minimum required permissions
5. **Rotate tokens regularly** — generate new ones, delete old ones
6. **Don't commit credentials** to git — add to `.gitignore`

### Performance Considerations

- **Filesystem**: Scales to large codebases; pattern matching is fast
- **Git**: Handles 10k+ commits efficiently with caching
- **Fetch**: Default 5000-character limit prevents memory bloat
- **Memory**: Knowledge graph stays reasonably fast up to 10k+ entities
- **GitHub**: Uses API; rate limited by GitHub (5000 req/hour with auth)

---

## Next Steps

1. **Pick 2-3 servers** that match your workflow (Filesystem + Git is a great start)
2. **Follow the installation** section for each
3. **Test with simple prompts** (e.g., "List my files" or "What's my git status")
4. **Add to CLAUDE.md** usage examples for your team
5. **Monitor logs** with `/mcp` command in Claude Code

---

## Sources

- [Model Context Protocol Official Examples](https://modelcontextprotocol.io/examples)
- [Official MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
- [Archived Servers (No Longer Maintained)](https://github.com/modelcontextprotocol/servers-archived)
- [GitHub Official MCP Server](https://github.com/github/github-mcp-server)
- [Official MCP Registry](https://registry.modelcontextprotocol.io/)
- [MCP Servers List 2026: Complete Directory](https://tokenmix.ai/blog/mcp-servers-list-2026-complete-directory)
- [Best MCP servers in 2026: top picks by category](https://openclawmcp.com/blog/best-mcp-servers-2026)
