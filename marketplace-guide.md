# Guía Completa del Marketplace MCP — De 0 a 100% Extensibilidad

> Domina los marketplaces, descubre MCP servers, integra sin fricciones. De usuario básico a arquitecto de integración.

**Objetivo:** Conocer 5 marketplaces, instalar servers, usarlos en agentes productivos.

**Tiempo estimado:** 120 min lectura + 90 min laboratorio práctico.

---

## SECCIÓN 1: Los 5 Marketplaces Explicados

### 1.1 Smithery — El UI-First Marketplace

**URL:** https://smithery.ai

**Característica principal:** Visual, ratings, trending, discovery.

**Tabla Comparativa — Smithery vs Otros:**

| Aspecto | Smithery | MCP Registry | MCP Hunt | mpak | MCPFinder |
|---------|----------|-------------|----------|------|-----------|
| **UI/UX** | ⭐⭐⭐⭐⭐ Gráfico | ⭐⭐ CLI-style | ⭐⭐⭐ Cards | — | ⭐⭐⭐⭐ |
| **Autoridad** | Comunidad | Oficial Anthropic | GitHub | GitHub | Independiente |
| **Total Servers** | 120+ | 50+ | 200+ | 30 | 150+ |
| **Ratings/Reviews** | ✅ Sí | ❌ No | ✅ Básico | ❌ No | ✅ Sí |
| **Trending** | ✅ Sí | ❌ No | ✅ Weekly | ❌ No | ✅ Sí |
| **Installation** | npm/script | npm/HTTP/SSE | npm | GitHub CI | Local CLI |
| **Community** | Activa | Oficial | Muy activa | Activa | Moderada |
| **Best for** | Discovery | Official tools | Community gems | CI/CD | Testing |

**Cómo usar Smithery:**

```
1. Visita https://smithery.ai
2. Busca: "postgresql" (en search bar)
3. Resultado típico:

   PostgreSQL Database MCP [⭐⭐⭐⭐⭐ 340 reviews]
   ├─ Instalations: 3.2K
   ├─ Maintainer: Anthropic
   ├─ Tags: database, sql, production-ready
   ├─ Description: Query PostgreSQL with AI
   ├─ Tools: query, insert, update, schema, analyze
   ├─ Verified: ✅
   └─ Install command: npm install @anthropic/postgresql-mcp

4. Click "Copy Install Command"
5. Run: npm install @anthropic/postgresql-mcp
6. Auto-add a settings.json
```

**Trust Scoring en Smithery:**

```
⭐⭐⭐⭐⭐ (4.5+)
├─ 100+ downloads
├─ 20+ reviews positivos
├─ Maintainer verificado
├─ Tests passing
└─ "Production Ready" badge → Safe to use

⭐⭐⭐⭐ (3.5-4.4)
├─ 50+ downloads
├─ Bien mantenido
└─ Minor issues reported

⭐⭐⭐ (2.5-3.4)
├─ Experimental
├─ <50 downloads
└─ "Use with caution" flag
```

---

### 1.2 MCP Registry (Oficial Anthropic)

**URL:** https://registry.modelcontextprotocol.io

**Característica principal:** Official source, 50+ curated servers.

**Servidores destacados:**
```
🔵 OFFICIAL SERVERS (Anthropic-maintained)
├─ @anthropic/postgres — SQL queries
├─ @anthropic/brave-search — Web search
├─ @anthropic/github — GitHub API integration
├─ @anthropic/slack — Slack workspace access
├─ @anthropic/stripe — Payment processing
├─ @anthropic/linear — Linear issue tracker
├─ @anthropic/notion — Notion database access
├─ @anthropic/gitub-api — Low-level GitHub
├─ @anthropic/filesystem — File operations
└─ 15 más...

🟢 COMMUNITY VERIFIED (partner organizations)
├─ PromptCraft/sqlite — SQLite database
├─ Smithery/redis — Redis operations
├─ HuggingFace/transformer-inference
└─ 30+ partners
```

**Instalación desde Registry:**
```bash
# Método 1: Copiar URL del registro
https://registry.modelcontextprotocol.io/@anthropic/postgres

# Método 2: Direct CLI
npm install @anthropic/postgres-mcp

# Verificar instalación
/mcp list
# → @anthropic/postgres ✅ (4 tools)
```

---

### 1.3 MCP Hunt — Comunidad Activa

**GitHub:** https://github.com/punkpeye/awesome-mcp-servers

**Característica principal:** Crowdsourced, trending, reviews.

**Cómo navegar:**
```
Stars ranking (weekly):
1. roo-k/roo-cline (3.2K ⭐)  → VSCode integration
2. smithery/smithery-cli (2.1K) → Discovery tool
3. punkpeye/awesome-mcp (1.8K)  → Index
4. anthropic/mcp-go (1.5K)      → Go SDK

By category:
├─ 🗄️  Database (8 servers)
├─ 🌐 Web (12 servers)
├─ 💬 Messaging (6 servers)
├─ 📊 Analytics (9 servers)
└─ 🎨 Design (5 servers)

Recent (Last 7 days):
├─ anthropic/claude-client-python (new)
├─ punkpeye/kubernetes-mcp (updated)
└─ smithery/local-file-access (v2.0)
```

**Search example:**
```bash
# En GitHub, busca: "awesome-mcp-servers"
# O en terminal:
curl https://api.github.com/repos/punkpeye/awesome-mcp-servers | jq '.description'

# Output: "Curated list of MCP servers"
```

---

### 1.4 mpak — GitHub Actions Publishing

**GitHub:** https://github.com/modelcontextprotocol/mpak

**Característica principal:** Auto-publish MCP servers via GitHub Actions.

**Flujo:**
```
1. Escribe MCP server (Node.js, Python, Rust)
2. Add GitHub Action workflow
3. Commit + push
4. GitHub Action:
   ├─ Testa con test suite
   ├─ Construye binarios
   ├─ Publica a npm registry
   ├─ Submite a Smithery
   └─ Crea release en GitHub
5. Auto-instalable vía /plugin
```

**Ejemplo workflow.yml:**
```yaml
name: Publish MCP Server
on: [push, tags]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npx mpak publish  # ← Key step
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          SMITHERY_API_KEY: ${{ secrets.SMITHERY_API_KEY }}
```

**Best for:** Desarrolladores que quieren publicar servidores con 0 config.

---

### 1.5 MCPFinder — Discovery + Local Testing

**URL:** https://mcpfinder.com

**Característica principal:** Test antes de instalar, ratings, categorización.

**Features:**
```
✅ Try online (sin instalar)
├─ PostgreSQL → Query test database
├─ GitHub → Test con repo público
└─ Slack → Test sin conectar workspace

✅ Compare (2 servers lado-a-lado)
├─ PostgreSQL vs MongoDB
├─ GitHub vs GitLab
└─ Brave Search vs Google Custom Search

✅ Benchmark
├─ Latency
├─ Success rate
├─ Error handling
└─ Cost estimation

✅ Rating system
├─ User reviews (5-star)
├─ Maintainer responsiveness
├─ Documentation quality
└─ Production-readiness score
```

**TDD Test Case:**
```typescript
describe('MCPFinder integration', () => {
  test('should allow testing server before installation', async () => {
    const testResult = await mcpFinder.testServer('postgresql-mcp');
    expect(testResult.latency).toBeLessThan(500); // <500ms
    expect(testResult.success_rate).toBeGreaterThan(0.95);
  });

  test('should provide accurate benchmarks', async () => {
    const benchmark = await mcpFinder.benchmark('postgres', 'mongodb');
    expect(benchmark.postgres.latency).toBeDefined();
    expect(benchmark.mongodb.latency).toBeDefined();
  });
});
```

---

## SECCIÓN 2: Instalación Paso-a-Paso (4 Métodos)

### Método 1: npm Global (Recomendado para Principiantes)

**Ejemplo: Instalar Brave Search MCP**

**Paso 1: Buscar en Smithery**
```
https://smithery.ai → Busca "brave search"
Resultado: @anthropic/brave-search-mcp
```

**Paso 2: Install**
```bash
npm install -g @anthropic/brave-search-mcp

# Output esperado:
# ✅ Instalado en /usr/local/lib/node_modules/@anthropic/brave-search-mcp
# ✅ Ejecutable: brave-search-mcp
```

**Paso 3: Configurar en settings.json**
```json
{
  "mcpServers": {
    "brave-search": {
      "command": "brave-search-mcp",
      "args": [],
      "env": {
        "BRAVE_SEARCH_API_KEY": "YOUR_KEY_HERE"  ← Get from https://api.search.brave.com
      }
    }
  }
}
```

**Paso 4: Test**
```bash
/mcp list
# → brave-search ✅ (3 tools: search, news, images)

# Use it:
"Using brave-search tool, search for 'Claude Code 2026'"
# Claude invoca: tool_call(name='search', input={query: 'Claude Code 2026'})
# Returns: Top 10 results con metadata
```

**TDD Test:**
```typescript
test('should install and register MCP globally', async () => {
  const installed = await isInstalled('@anthropic/brave-search-mcp');
  expect(installed).toBe(true);
  
  const listed = await runCommand('/mcp list');
  expect(listed.mcps).toContain('brave-search');
});
```

---

### Método 2: Local Path (Development)

**Para desarrolladores que crean MCP servers.**

**Estructura proyecto:**
```
my-mcp-project/
├── src/
│   └── index.ts           (server implementation)
├── dist/                  (build output)
├── package.json
├── tsconfig.json
├── test/
│   └── server.test.ts
└── manifest.json          (MCP metadata)
```

**Paso 1: Construir**
```bash
cd my-mcp-project
npm install
npm run build

# Output: dist/index.js listo
```

**Paso 2: Registrar locally**
```bash
/mcp register --name=my-custom-tool \
  --type=stdio \
  --path="node /full/path/to/dist/index.js"

# ✅ Registrado local
```

**Paso 3: Test en isolation**
```bash
/fork --name=test-mcp --memory=shallow

"Using my-custom-tool server, test the 'analyze' function with input='hello world'"

# En fork:
# Tool call → my-custom-tool.analyze('hello world')
# Response: { result: ..., latency: 45ms }

# Si falla:
# Error message + auto-capture en logs
```

**Paso 4: Integrar a settings.json (cuando estable)**
```json
{
  "mcpServers": {
    "my-custom-tool": {
      "command": "node",
      "args": ["/full/path/to/dist/index.js"],
      "env": {}
    }
  }
}
```

---

### Método 3: URL Remota (Seguridad/Auditoría)

**Para servidores en servidor remoto o Docker.**

**Ejemplo: PostgreSQL en servidor AWS**

**Paso 1: Deploy server HTTP**
```bash
# En servidor EC2 o Docker
docker run -p 3000:3000 @anthropic/postgresql-mcp
# Server escucha en http://ec2-52-1-2-3.compute-1.amazonaws.com:3000
```

**Paso 2: Registrar URL en settings.json**
```json
{
  "mcpServers": {
    "postgres-remote": {
      "type": "http",
      "url": "http://ec2-52-1-2-3.compute-1.amazonaws.com:3000",
      "auth": {
        "type": "bearer",
        "token": "sk-mcp-1234567890"  ← Security token
      },
      "env": {
        "DATABASE_URL": "postgresql://user:pass@db.example.com:5432/prod"
      }
    }
  }
}
```

**Paso 3: Test connection**
```bash
/doctor --deep

Output:
✅ postgres-remote (HTTP)
   ├─ URL: http://ec2-52-1-2-3.compute-1.amazonaws.com:3000
   ├─ Latency: 145ms (network + DB)
   ├─ Tools: query, insert, update, schema
   ├─ Auth: ✅ Valid token
   └─ Last check: 2.3s ago
```

**Seguridad:**
- ✅ Token authentication (API key)
- ✅ HTTPS recommended (no http bare)
- ✅ Rate-limiting en servidor
- ✅ Audit logs en /logs

---

### Método 4: Git Repository (Development Tracking)

**Para seguir cambios de repositorio MCP durante desarrollo.**

**Paso 1: Clone repo**
```bash
git clone https://github.com/anthropic/mcp-postgres.git ~/.claude/mcp/postgres-dev
cd ~/.claude/mcp/postgres-dev
npm install
npm run build
```

**Paso 2: Registrar con path relativo**
```json
{
  "mcpServers": {
    "postgres-dev": {
      "command": "npm",
      "args": ["start"],
      "cwd": "~/.claude/mcp/postgres-dev"
    }
  }
}
```

**Paso 3: Auto-rebuild on changes**
```bash
# En background (terminal separado)
cd ~/.claude/mcp/postgres-dev
npm run watch

# Automático rebuilds + reloads cuando editas src/
```

**Paso 4: Test después de cambios**
```bash
# Tu agente detecta cambios
/mcp list
# postgres-dev 🟡 (rebuilding...)
# postgres-dev ✅ (updated 0.5s ago)

# Ahora con tus cambios locales
```

---

### Schema completo: settings.json

```json
{
  "mcpServers": {
    "brave-search": {
      "type": "stdio",
      "command": "npx",
      "args": ["@anthropic/brave-search-mcp"],
      "enabled": true,
      "timeout": 30,
      "retryAttempts": 3,
      "env": {
        "BRAVE_API_KEY": "sk-xxx"
      }
    },
    
    "postgres": {
      "type": "http",
      "url": "http://localhost:3000",
      "timeout": 60,
      "auth": {
        "type": "bearer",
        "token": "sk-mcp-xxx"
      }
    },
    
    "my-custom": {
      "type": "stdio",
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/project"
    },
    
    "streaming-api": {
      "type": "sse",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer sk-xxx",
        "X-Custom-Header": "value"
      }
    }
  },
  
  "mcpSettings": {
    "maxConcurrent": 5,
    "defaultTimeout": 30,
    "logLevel": "info",
    "cacheResults": true,
    "cacheTTL": 300
  }
}
```

---

## SECCIÓN 3: Búsqueda y Evaluación de Servidores

### 3.1 Cómo Buscar Efectivamente

**Estrategia 1: Keyword-based**
```
Quiero: "Consultar base de datos PostgreSQL"
Búsqueda: "postgresql", "postgres", "database", "sql"
Resultado esperado: 3-5 opciones diferentes

Top hits:
1. @anthropic/postgres (official, ⭐⭐⭐⭐⭐)
2. @smithery/postgres-pro (community, ⭐⭐⭐⭐)
3. local-postgres (deprecated, ⚠️ don't use)
```

**Estrategia 2: By category**
```
Smithery browse → "Database" category
├─ PostgreSQL (120+ reviews)
├─ MongoDB (85+ reviews)
├─ SQLite (45+ reviews)
├─ Firebase (32+ reviews)
└─ Redis (28+ reviews)

Pick top-rated, latest version
```

**Estrategia 3: Trending**
```
MCPFinder → "Trending This Week"
├─ 🔥 kubernetes-mcp (new, 50 ⭐ in 7 days)
├─ 🔥 anthropic-pdf-mcp (updated, 40 ⭐)
└─ 🔥 datadog-integration (50 installs)

Good for discovering hidden gems
```

**Estrategia 4: Compare + Benchmark**
```
MCPFinder → Compare tools side-by-side

PostgreSQL vs MongoDB:
├─ Latency: Postgres 120ms, MongoDB 85ms
├─ Success rate: Postgres 99.2%, MongoDB 97.8%
├─ Tools count: Postgres 8, MongoDB 6
├─ Community reviews: Postgres 340, MongoDB 210
└─ Recommendation: Postgres for stability, MongoDB for flexibility
```

---

### 3.2 Trust Scoring — L1 a L4

**L1 — EXPERIMENTAL (Use with extreme caution)**
```
Características:
├─ <10 downloads total
├─ No reviews o 1-2 negativas
├─ Unmaintained (>3 meses sin update)
├─ "Alpha/Beta" tag
└─ Single-author, unverified

Riesgo: 🔴 ALTO
└─ Data loss
└─ Security vulnerabilities
└─ Abandoned maintenance

Uso: Solo testing local, no producción
```

**L2 — COMMUNITY (Use with testing)**
```
Características:
├─ 50-500 downloads
├─ 5-20 reviews, mostly positive
├─ Maintained (updates last 30 days)
├─ Community-maintained
└─ Some production usage reported

Riesgo: 🟡 MEDIO
└─ Minor bugs
└─ Inconsistent maintenance

Uso: Testing + staging, producción con caution
```

**L3 — VERIFIED (Safe for production)**
```
Características:
├─ 500+ downloads
├─ 20+ reviews, 4.5+ stars
├─ Active maintenance
├─ Tests + CI/CD
├─ Org-backed (company/foundation)

Riesgo: 🟢 BAJO
└─ Rare bugs
└─ Good response time

Uso: Producción, con monitoring
```

**L4 — OFFICIAL (Anthropic-maintained)**
```
Características:
├─ @anthropic/ namespace
├─ 1000+ downloads
├─ Official documentation
├─ SLA commitment
├─ Security audits

Riesgo: 🟢 MÍNIMO
└─ Production-grade
└─ Full support

Uso: Producción crítica
```

**TDD Test Case:**
```typescript
test('should classify server trust level correctly', async () => {
  const levels = {
    'experimental': { downloads: 5, stars: 2.0, maintained: false },
    'community': { downloads: 200, stars: 4.2, maintained: true },
    'verified': { downloads: 800, stars: 4.7, maintained: true },
    'official': { downloads: 5000, stars: 4.9, org: '@anthropic' },
  };
  
  Object.entries(levels).forEach(([name, data]) => {
    const trust = calculateTrustLevel(data);
    expect(trust.level).toBe(name);
  });
});
```

---

### 3.3 Checklist — "Is This Server Production-Ready?"

```
□ Descarga & Usage
  ├─ [ ] 500+ total downloads
  ├─ [ ] 50+ installs last 30 days
  └─ [ ] Growing trend (not declining)

□ Reviews & Ratings
  ├─ [ ] 4.5+ stars (minimum)
  ├─ [ ] 20+ reviews
  ├─ [ ] No critical bugs reported
  └─ [ ] Recent reviews positive (not outdated)

□ Maintenance
  ├─ [ ] Updated last 30 days
  ├─ [ ] Issues closed <7 days
  ├─ [ ] Maintainer responsive
  └─ [ ] Roadmap public (if available)

□ Testing & Quality
  ├─ [ ] Tests included (npm test passes)
  ├─ [ ] CI/CD (GitHub Actions or similar)
  ├─ [ ] Error handling good
  └─ [ ] Linting passes

□ Documentation
  ├─ [ ] README clear + complete
  ├─ [ ] Installation steps provided
  ├─ [ ] Examples + use cases
  ├─ [ ] API documentation
  └─ [ ] Troubleshooting section

□ Security
  ├─ [ ] No known vulnerabilities (npm audit)
  ├─ [ ] Handles secrets properly
  ├─ [ ] Rate-limiting support
  └─ [ ] Security contact available

□ Compatibility
  ├─ [ ] Supports current Node/Python version
  ├─ [ ] Compatible with latest Claude API
  ├─ [ ] OS support (Linux/Mac/Windows)
  └─ [ ] Dependency versions recent

SCORING:
12-14 checks → ✅ Ready for production
10-11 checks → ⚠️  Proceed with caution + monitoring
<10 checks   → ❌ Not recommended for production yet
```

---

## SECCIÓN 4: Uso en Agentes — 3 Ejemplos End-to-End

### Caso 1: Agente + PostgreSQL MCP — Query Builder

**Arquitectura:**
```
Agent Loop
└─ PreToolUse Hook (audit log)
└─ Tool: @anthropic/postgres
    ├─ query() — SELECT statements
    ├─ insert() — INSERT data
    ├─ schema() — Describe tables
    └─ analyze() — Query performance
└─ PostToolUse Hook (cache results)
```

**Paso 1: Instalar MCP**
```bash
npm install -g @anthropic/postgres-mcp

# Agregar a settings.json
{
  "mcpServers": {
    "postgres": {
      "command": "postgres-mcp",
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb"
      }
    }
  }
}
```

**Paso 2: Crear Agent con SDK**
```typescript
// agent-query-builder.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

async function queryAgent(userQuestion: string) {
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: userQuestion,
    },
  ];

  // Agentic loop
  let response = await client.messages.create({
    model: "claude-opus-4.7",
    max_tokens: 4096,
    tools: [
      {
        name: "postgres_query",
        description: "Execute SQL query",
        input_schema: {
          type: "object",
          properties: {
            sql: { type: "string" },
          },
          required: ["sql"],
        },
      },
    ],
    messages: messages,
  });

  // Loop hasta que model no pida tools
  while (response.stop_reason === "tool_use") {
    const toolUse = response.content.find(
      (block) => block.type === "tool_use"
    ) as Anthropic.ToolUseBlock;

    if (toolUse?.name === "postgres_query") {
      const input = toolUse.input as { sql: string };
      
      // Invoke MCP server (auto via SDK)
      const result = await executeMCPTool("postgres_query", {
        sql: input.sql,
      });

      // Add tool result to messages
      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: JSON.stringify(result),
          },
        ],
      });

      // Continue conversation
      response = await client.messages.create({
        model: "claude-opus-4.7",
        max_tokens: 4096,
        tools: [/* same tools */],
        messages: messages,
      });
    }
  }

  // Return final text response
  const textBlock = response.content.find(
    (block) => block.type === "text"
  ) as Anthropic.TextBlock;
  return textBlock?.text;
}

// Usage
const result = await queryAgent(
  "How many users signed up last week? Use database query."
);
console.log(result);
// → "Based on the query results, 342 users signed up last week..."
```

**Paso 3: Hooks para auditoría + caché**
```bash
# .claude/hooks/pre-tool-use-postgres.sh
#!/bin/bash

# Log every query attempt
echo "[$(date -Iseconds)] TOOL=$CLAUDE_TOOL_NAME INPUT=$CLAUDE_TOOL_INPUT" \
  >> ~/.claude/logs/postgres-audit.log

# Block destructive queries (not needed in prod, but good safety)
if [[ "$CLAUDE_TOOL_INPUT" == *"DROP TABLE"* ]] || \
   [[ "$CLAUDE_TOOL_INPUT" == *"DELETE FROM"* ]]; then
  echo "BLOCKED: Destructive SQL detected. Use /confirm to override." >&2
  exit 2
fi

exit 0  # Allow query
```

**TDD Test Case:**
```typescript
describe('Agent + PostgreSQL MCP', () => {
  test('should execute SELECT query via MCP', async () => {
    const result = await queryAgent("Count all users in database");
    expect(result).toMatch(/\d+ users/);
    expect(result).not.toContain('error');
  });

  test('should block DELETE query in hook', async () => {
    const result = await queryAgent("Delete all inactive users");
    expect(result).toContain('BLOCKED');
  });

  test('should cache query results', async () => {
    const time1 = performance.now();
    await queryAgent("Show me all tables");
    const duration1 = performance.now() - time1;

    const time2 = performance.now();
    await queryAgent("Show me all tables");  // Same query
    const duration2 = performance.now() - time2;

    // Cached should be <50% of original time
    expect(duration2).toBeLessThan(duration1 * 0.5);
  });
});
```

---

### Caso 2: Agente + GitHub MCP — Repository Analyzer

**Setup:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@anthropic/github-mcp"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxx"
      }
    }
  }
}
```

**Ejemplo: Analizar repositorio**
```typescript
const analysis = await queryAgent(`
Analiza el repo: anthropic/anthropic-sdk-python
1. Count files by type (py, json, yaml, md)
2. Identify main contributors (top 5)
3. List recent issues (unresolved)
4. Suggest improvements

Use GitHub MCP tools.
`);

// Output esperado:
// ✅ Python files: 320
// ✅ JSON configs: 12
// ✅ Main contributors: @dario-amodei, @jacksonwchen, ...
// ✅ Unresolved issues: 23 (bugs: 5, features: 18)
// ✅ Improvements: Add type hints to 50 functions, update docs
```

---

### Caso 3: Multi-MCP Setup (Postgres + GitHub + Slack)

**Architecture:**
```
Agent
├─ /mcp postgres      (database queries)
├─ /mcp github        (repo analysis)
└─ /mcp slack         (send notifications)

Workflow:
1. Agent queries GitHub (get open issues)
2. Agent queries Postgres (check resolution time history)
3. Agent posts summary to Slack (#devops)
```

**settings.json:**
```json
{
  "mcpServers": {
    "postgres": { "command": "postgres-mcp", "env": { "DATABASE_URL": "..." } },
    "github": { "command": "github-mcp", "env": { "GITHUB_TOKEN": "..." } },
    "slack": { "command": "slack-mcp", "env": { "SLACK_BOT_TOKEN": "..." } }
  }
}
```

**Agent prompt:**
```
You are a DevOps reporter. Every day:
1. Query GitHub (repo: acme-corp/api) → Get unresolved issues
2. Query Postgres (table: issue_metrics) → Get avg resolution time
3. Post to Slack #devops with summary

Format: 
{count} issues unresolved
Avg resolution: {days} days
Trend: {↑ trending up | ↓ trending down}
```

**Error handling:**
```typescript
// If Slack post fails, retry with exponential backoff
try {
  await mcpClient.call("slack_send_message", { channel: "#devops", text: summary });
} catch (error) {
  // Fallback: Send to email instead
  await fallbackNotification(summary);
}
```

**TDD Test Case — Multi-MCP:**
```typescript
describe('Multi-MCP orchestration', () => {
  test('should coordinate postgres + github + slack', async () => {
    // Setup: 5 open issues in GitHub
    mockGitHub.issues.open = 5;
    mockPostgres.avgResolutionDays = 3.2;

    const result = await multiMCPAgent();

    // Verify all MCPs called
    expect(mockGitHub.called).toBe(true);
    expect(mockPostgres.called).toBe(true);
    expect(mockSlack.called).toBe(true);

    // Verify Slack message format
    expect(mockSlack.lastMessage).toMatch(/5 issues/);
    expect(mockSlack.lastMessage).toMatch(/3.2 days/);
  });

  test('should handle slack failure + fallback', async () => {
    mockSlack.throwError = true;  // Simula fallo

    const result = await multiMCPAgent();

    expect(result.slackFailed).toBe(true);
    expect(result.emailSent).toBe(true);  // Fallback worked
  });
});
```

---

## SECCIÓN 5: Solución de Problemas — Decision Tree

### "Server no responde"

```
¿Server error?
├─ "Server not found in registry"
│  ├─ Check Smithery (typo en nombre?)
│  ├─ Check npm registry: npm search query
│  └─ Try alternative: /plugin search [similar-name]
│
├─ "Connection refused (127.0.0.1:3000)"
│  ├─ Check if server running: lsof -i :3000
│  ├─ Restart server: npm start
│  └─ Check firewall: sudo ufw allow 3000
│
├─ "Timeout after 30s"
│  ├─ Slow network? Check latency: ping -c 3 server
│  ├─ Slow database? Add index, optimize query
│  ├─ Increase timeout: settings.json → mcpSettings.timeout = 60
│  └─ Use /task with retry
│
├─ "Invalid manifest JSON"
│  ├─ Check manifest file: cat manifest.json
│  ├─ Validate JSON: jq . < manifest.json
│  └─ Regenerate: npm run build
│
└─ "401 Unauthorized"
   ├─ Check API key: echo $API_KEY_VAR
   ├─ Verify in settings.json: env variables present?
   ├─ Check expiry: Is token valid? (tokens expire)
   └─ Regenerate token in provider dashboard
```

### "Tool call fails silently"

```
Tool invocación falla + no error visible?
├─ Check MCP logs: /logs --filter="mcp"
├─ Verify tool name matches: /mcp list → check exact name
├─ Test tool directly:
│  /fork --name=test
│  "Using [server-name], call [tool-name] with input={...}"
└─ If fork fails:
   ├─ Tool input schema error? (wrong type)
   ├─ Network timeout? (see above)
   └─ Server crash? (check server logs)
```

---

## Validación Final — Quick Reference

### Tabla Rápida: Cuándo Usar Cada Marketplace

| Marketplace | Si quieres | Mejor cuando |
|-------------|-----------|--------------|
| **Smithery** | Descubrir visualmente | No sabes qué existe, quieres trending |
| **MCP Registry** | Official source | Necesitas garantía de calidad |
| **MCP Hunt** | Community gems | Quieres algo niche o experimental |
| **MCPFinder** | Test primero, instalar después | Risk-averse, quieres benchmarks |
| **mpak** | Publicar tu server | Eres developer que quiere distribuir |

### Installation Cheatsheet

```bash
# Método npm (más común)
npm install -g @anthropic/postgres-mcp

# Método local (development)
/mcp register --path="node dist/index.js" --name=my-tool

# Método HTTP (remote server)
# Edita settings.json con URL

# Método GitHub (tracking development)
npm install --save-dev my-mcp-repo@github:user/repo
```

### Trust Levels Quick Guide

```
L1 (Experimental)  → Local testing only
L2 (Community)     → Staging environment
L3 (Verified)      → Production with monitoring
L4 (Official)      → Production critical path
```

---

**Próximos pasos:**
1. Visita Smithery.ai, descubre 3 servidores
2. Instala 1 y testa localmente
3. Lee: nivel4-mcp-servers.md (profundización arquitectura)
4. Lee: nivel4-integration-examples.md (casos multi-MCP)

**Certificación:** Instala + usa 3 MCP servers diferentes = ✅ Complete
