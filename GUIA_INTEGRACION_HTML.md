# Guía de Integración: 4 Secciones en HTML

Este documento explica cómo agregar las 4 nuevas secciones al index.html existente.

## Resumen de Cambios

### 1. Agregar navegación en sidebar
### 2. Agregar secciones en HTML main
### 3. Actualizar COMMANDS_DATA en script.js (opcional)
### 4. Agregar CSS para nuevos componentes (si necesario)

---

## PASO 1: Agregar en Sidebar Navigation

Busca esta sección en `index.html` (alrededor de línea 88-99):

```html
<p class="nav-group-title">Profundización</p>
<ul class="nav-list">
    <li><a href="#agente-sdk" class="nav-link" data-section="agente-sdk" data-mode="technical">
```

AGREGA DESPUÉS, un nuevo grupo:

```html
<p class="nav-group-title">🔧 Producción Avanzada</p>
<ul class="nav-list">
    <li><a href="#git-workflows" class="nav-link" data-section="git-workflows" data-mode="technical">
        <span class="nav-icon">🌿</span> Git Workflows Reales</a></li>
    <li><a href="#mcp-use-cases" class="nav-link" data-section="mcp-use-cases" data-mode="technical">
        <span class="nav-icon">🔗</span> MCPs por Caso de Uso</a></li>
    <li><a href="#hooks-production" class="nav-link" data-section="hooks-production" data-mode="technical">
        <span class="nav-icon">🎣</span> Hooks en Producción</a></li>
    <li><a href="#multi-mcp-orchestration" class="nav-link" data-section="multi-mcp-orchestration" data-mode="technical">
        <span class="nav-icon">🎼</span> Multi-MCP Orchestration</a></li>
</ul>
```

---

## PASO 2: Agregar Secciones en Main Content

Busca el cierre de `</main>` en index.html (final del archivo).

ANTES DE `</main>`, AGREGA estas 4 secciones:

### SECCIÓN 1: Git Workflows Reales

```html
<!-- ==================== GIT WORKFLOWS REALES ==================== -->
<section class="content-section" data-section="git-workflows">
    <h2>🌿 Git Workflows Reales en Producción</h2>
    <p class="section-intro">Tres flujos probados: Trunk-based, Gitflow, Worktrees. Con commits reales del repo y comandos copy-paste.</p>

    <!-- FLUJO A: TRUNK-BASED -->
    <article class="card workflow-card">
        <h3>Flujo A: Trunk-Based Development</h3>
        <p class="badge-small">✅ Recomendado para: Equipos 2-8, ciclos cortos</p>
        
        <div class="info-block">
            <strong>¿Cuándo usar?</strong>
            <ul>
                <li>Equipos pequeños (2-8 personas)</li>
                <li>Ciclos de release cortos (diarios/semanales)</li>
                <li>CI/CD sólido y tests confiables</li>
            </ul>
        </div>

        <div class="code-example">
            <strong>Workflow típico:</strong>
            <pre><code data-lang="bash">
# 1. Sincroniza master
git checkout master && git pull origin master

# 2. Feature branch corta (max 1 día)
git checkout -b fix/auth-token-refresh

# 3. Commits atómicos
git commit -m "fix: refresh token antes de expiración
- Valida expiration en middleware
- Usa /refresh endpoint
- Tests en auth.spec.ts"

# 4. Push + PR
git push -u origin fix/auth-token-refresh
# → Crear PR, code review
# → Merge vía GitHub cuando CI pasa

# 5. Cleanup
git checkout master
git pull origin master
git branch -d fix/auth-token-refresh
            </code></pre>
        </div>

        <div class="pros-cons">
            <div class="pros">
                <strong>✓ Ventajas:</strong>
                <ul>
                    <li>Integración continua = menos conflictos</li>
                    <li>Deploy más seguro (cambios pequeños)</li>
                    <li>Feedback rápido en code review</li>
                </ul>
            </div>
            <div class="cons">
                <strong>✗ Desventajas:</strong>
                <ul>
                    <li>Requiere CI/CD sólido</li>
                    <li>Tests deben ser confiables</li>
                    <li>Presión para merge rápido</li>
                </ul>
            </div>
        </div>
    </article>

    <!-- FLUJO B: GITFLOW -->
    <article class="card workflow-card">
        <h3>Flujo B: Feature Branches + Gitflow</h3>
        <p class="badge-small">📊 Recomendado para: Equipos 8-20, releases planeadas</p>
        
        <div class="info-block">
            <strong>Estructura de branches:</strong>
            <pre><code data-lang="text">
master              # Producción (tagged: v1.0.0)
staging             # Pre-producción
develop             # Integración (siempre releasable)
├── feature/*       # Nuevas features
├── hotfix/*        # Fixes urgentes
└── release/*       # Preparar release
            </code></pre>
        </div>

        <div class="code-example">
            <strong>Workflow completo (feature → release → production):</strong>
            <pre><code data-lang="bash">
# STEP 1: Feature branch desde develop
git checkout -b feature/otp-auth develop

# ... trabajo normal ...
git commit -m "feat: agregar TOTP authentication"
git push origin feature/otp-auth
# → PR develop ← feature/otp-auth

# STEP 2: Code freeze para release
git checkout -b release/2.5.0 develop
# Edita package.json, CHANGELOG.md
git commit -m "chore: bump to v2.5.0"

# STEP 3: Tests finales + tag
npm test && npm run build
git tag -a v2.5.0 -m "Release 2.5.0"

# STEP 4: Merge a master + back a develop
git checkout master && git pull origin master
git merge --no-ff release/2.5.0
git push origin master v2.5.0

git checkout develop
git merge --no-ff master
git push origin develop

# CLEANUP
git branch -d release/2.5.0
            </code></pre>
        </div>
    </article>

    <!-- FLUJO C: WORKTREES -->
    <article class="card workflow-card">
        <h3>Flujo C: Git Worktrees (Paralelismo)</h3>
        <p class="badge-small">⚡ Recomendado para: Trabajar en múltiples branches en paralelo</p>
        
        <div class="info-block">
            <strong>Ventaja clave:</strong>
            <p>Cada worktree = directorio separado, trabaja en 2-3 cosas en paralelo sin "git checkout".</p>
        </div>

        <div class="code-example">
            <strong>Setup y uso:</strong>
            <pre><code data-lang="bash">
# Opción 1: Manual git worktree
git worktree add ~/work/auth-refactor -b feature/auth-refactor
cd ~/work/auth-refactor
# ... edita, commit, push ...

# Opción 2: Automático con Claude Code
claude --worktree feature/auth-refactor
> Refactoriza @src/auth/ (en ese worktree aislado)

# Listing
git worktree list
# /home/user/work/auth-refactor  abc1234 [feature/auth-refactor]
# /home/user/work/ui-redesign    def5678 [feature/ui-redesign]

# Cleanup
git worktree remove ~/work/auth-refactor
            </code></pre>
        </div>
    </article>

    <!-- TABLA COMPARATIVA -->
    <article class="card">
        <h3>Tabla Comparativa: ¿Cuál elegir?</h3>
        <div class="responsive-table">
            <table>
                <thead>
                    <tr>
                        <th>Aspecto</th>
                        <th>Trunk-Based</th>
                        <th>Gitflow</th>
                        <th>Worktrees</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Complejidad</strong></td>
                        <td>Baja</td>
                        <td>Media</td>
                        <td>Media (intuitiva)</td>
                    </tr>
                    <tr>
                        <td><strong>Release cycle</strong></td>
                        <td>Diario/semanal</td>
                        <td>Cada 2-4 sem</td>
                        <td>Variable</td>
                    </tr>
                    <tr>
                        <td><strong>Equipo ideal</strong></td>
                        <td>2-8</td>
                        <td>8-20+</td>
                        <td>Cualquiera</td>
                    </tr>
                    <tr>
                        <td><strong>CI/CD req</strong></td>
                        <td>Sólido</td>
                        <td>Moderado</td>
                        <td>Sólido</td>
                    </tr>
                    <tr>
                        <td><strong>Merge conflicts</strong></td>
                        <td>Frecuentes (pequeños)</td>
                        <td>Menos frecuentes</td>
                        <td>Cero (isolated)</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </article>

    <!-- COMANDOS COPY-PASTE -->
    <article class="card">
        <h3>📋 Comandos Copy-Paste Listos</h3>

        <div class="code-block">
            <p><strong>1. Merge safety checks (PRE-MERGE):</strong></p>
            <pre><code data-lang="bash">
# Antes de mergear a master, validar:
git checkout master && git pull origin master

# ¿Hay cambios que no están en mi rama?
git log origin/master..HEAD

# ¿Mi rama tiene tests pasando?
npm test && npm run build

# ¿Quién committeó en master mientras yo trabajaba?
git log --oneline master...feature/mi-rama

# Safe merge
git merge --no-ff feature/mi-rama
git push origin master
            </code></pre>
        </div>

        <div class="code-block">
            <p><strong>2. Rebase limpio (squash commits):</strong></p>
            <pre><code data-lang="bash">
# Si hiciste 15 commits pero querés 1 limpio
git rebase -i origin/master
# → pick (primer commit)
# → squash (resto)
# → editar message

git push --force-with-lease origin feature/mi-rama
            </code></pre>
        </div>

        <div class="code-block">
            <p><strong>3. Iniciar worktree con Claude Code:</strong></p>
            <pre><code data-lang="bash">
claude --worktree feature/$(date +%s)-descripcion

# En la sesión:
# > Refactoriza @src/auth/login.ts y agrega tests
            </code></pre>
        </div>
    </article>
</section>

<!-- ==================== MCP SERVERS BY USE CASE ==================== -->
<section class="content-section" data-section="mcp-use-cases">
    <h2>🔗 MCP Servers by Use Case</h2>
    <p class="section-intro">GitHub, PostgreSQL, Slack y otros MCPs configurados para casos reales. Setup copy-paste listo.</p>

    <!-- GITHUB MCP -->
    <article class="card mcp-card">
        <h3>GitHub MCP: PR Reviews & Issue Creation</h3>
        <p class="badge-small">Perfect for: Code review automation, issue tracking</p>

        <div class="info-block">
            <strong>¿Por qué?</strong>
            <ul>
                <li>Automaticar code review línea-por-línea</li>
                <li>Crear issues desde sesión Claude</li>
                <li>Query PR diffs sin salir del CLI</li>
                <li>Integrar feedback en tiempo real</li>
            </ul>
        </div>

        <div class="code-example">
            <strong>Setup (copy-paste):</strong>
            <pre><code data-lang="bash">
# Opción 1: User scope (global, todos tus proyectos)
claude mcp add --scope user github \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxxx \
  -- npx -y @modelcontextprotocol/server-github

# Opción 2: Project scope (solo este repo)
# Edita .mcp.json en raíz con:
            </code></pre>
        </div>

        <div class="code-example">
            <strong>.mcp.json (GitHub):</strong>
            <pre><code data-lang="json">
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
            </code></pre>
        </div>

        <div class="code-example">
            <strong>Comandos en sesión Claude:</strong>
            <pre><code data-lang="bash">
# Ver PRs abiertos
> Muéstrame los PRs abiertos en este repo

# Crear issue
> Crea un issue: "Refactor authentication module"
  Con labels: enhancement, auth
  Assignee: mi usuario

# Code review automático
> Revisa el PR #247 línea-por-línea con comentarios detallados

# Buscar issues
> Encuentra issues con label "bug" sin asignar

# Mergear + cerrar
> Mergea el PR #245 con squash commits
            </code></pre>
        </div>
    </article>

    <!-- POSTGRESQL MCP -->
    <article class="card mcp-card">
        <h3>PostgreSQL MCP: Data Exploration</h3>
        <p class="badge-small">Perfect for: Database debugging, schema analysis</p>

        <div class="info-block">
            <strong>¿Por qué?</strong>
            <ul>
                <li>Ejecutar queries sin psql CLI</li>
                <li>Explorar schema de la DB en tiempo real</li>
                <li>Debugging de datos en producción</li>
                <li>Backups y exports automáticos</li>
            </ul>
        </div>

        <div class="code-example">
            <strong>Setup (local y remoto):</strong>
            <pre><code data-lang="bash">
# Local database
claude mcp add --scope project postgres \
  -e DATABASE_URL=postgresql://user:pass@localhost:5432/mydb \
  -- npx -y @modelcontextprotocol/server-postgres

# Remote database (con SSL)
claude mcp add --scope project postgres-prod \
  -e DATABASE_URL="postgresql://user:pass@prod.db.com:5432/mydb?sslmode=require" \
  -- npx -y @modelcontextprotocol/server-postgres
            </code></pre>
        </div>

        <div class="code-example">
            <strong>Comandos en sesión:</strong>
            <pre><code data-lang="bash">
# Explorar tablas
> Muéstrame el schema de la tabla "users"

# Ejecutar query
> SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL 7 day;

# Debugging
> ¿Cuál es el usuario con más compras? Muéstrame detalles

# Export a CSV
> Exporta todos los usuarios activos a CSV
            </code></pre>
        </div>
    </article>

    <!-- SLACK MCP -->
    <article class="card mcp-card">
        <h3>Slack MCP: Notifications & Audit Trail</h3>
        <p class="badge-small">Perfect for: Team notifications, audit logging</p>

        <div class="info-block">
            <strong>¿Por qué?</strong>
            <ul>
                <li>Notificar al equipo desde Claude automáticamente</li>
                <li>Crear audit trail en Slack para decisiones</li>
                <li>Alertas de CI/CD failures</li>
                <li>Integración con workflows</li>
            </ul>
        </div>

        <div class="code-example">
            <strong>Setup (obtener credenciales):</strong>
            <pre><code data-lang="bash">
# 1. Ir a https://api.slack.com/apps
# 2. Create New App → From scratch
# 3. App name: "Claude Code Bot"
# 4. OAuth & Permissions → Scopes: chat:write, files:write
# 5. Copy Bot Token

claude mcp add --scope user slack \
  -e SLACK_BOT_TOKEN=xoxb-xxxxx \
  -e SLACK_SIGNING_SECRET=xxxxx \
  -- npx -y @modelcontextprotocol/server-slack
            </code></pre>
        </div>

        <div class="code-example">
            <strong>Comandos en sesión:</strong>
            <pre><code data-lang="bash">
# Notificación simple
> Envía a #dev-team: "Deploy completed: v2.5.0 in production"

# Con detalles
> Post a #incidents:
  🚨 Incident: Database slow queries
  Time: 2025-05-15 14:23 UTC
  Duration: 8 minutes
  Action: Index added

# Archivo (logs)
> Sube @deployment.log a #devops
            </code></pre>
        </div>
    </article>

    <!-- TABLA DE MCPS -->
    <article class="card">
        <h3>MCPs Populares & Registro</h3>
        <div class="responsive-table">
            <table>
                <thead>
                    <tr>
                        <th>MCP</th>
                        <th>Uso</th>
                        <th>Setup</th>
                        <th>Scope</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>GitHub</strong></td>
                        <td>PRs, Issues, Code</td>
                        <td>Environment token</td>
                        <td>User/Project</td>
                    </tr>
                    <tr>
                        <td><strong>PostgreSQL</strong></td>
                        <td>DB queries, Debugging</td>
                        <td>DATABASE_URL</td>
                        <td>Project</td>
                    </tr>
                    <tr>
                        <td><strong>Slack</strong></td>
                        <td>Notifications, Logs</td>
                        <td>Bot token</td>
                        <td>User/Project</td>
                    </tr>
                    <tr>
                        <td><strong>Docker</strong></td>
                        <td>Container management</td>
                        <td>Socket /var/run/docker.sock</td>
                        <td>Project</td>
                    </tr>
                    <tr>
                        <td><strong>AWS</strong></td>
                        <td>EC2, S3, Lambdas</td>
                        <td>AWS credentials</td>
                        <td>User</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </article>

    <!-- CONEXIÓN PASO-A-PASO -->
    <article class="card">
        <h3>Conexión Paso-a-Paso</h3>
        <ol class="steps">
            <li>
                <strong>Setup en ~/.claude/mcp.json o .mcp.json</strong>
                <pre><code data-lang="json">
{
  "mcpServers": {
    "github": { "command": "npx", ... }
  }
}
                </code></pre>
            </li>
            <li>
                <strong>Verificar conexión</strong>
                <pre><code data-lang="bash">
claude /mcp
# Output: github, postgres, slack conectados
                </code></pre>
            </li>
            <li>
                <strong>Usar en sesión</strong>
                <pre><code data-lang="bash">
# Los MCPs están disponibles automáticamente
> Muéstrame los PRs abiertos
> SELECT * FROM users LIMIT 5
                </code></pre>
            </li>
        </ol>
    </article>
</section>

<!-- ==================== HOOKS IN PRODUCTION ==================== -->
<section class="content-section" data-section="hooks-production">
    <h2>🎣 Hooks in Production</h2>
    <p class="section-intro">5 hooks reales que automatizan seguridad, tests, y monitoreo. Configuración lista para copiar.</p>

    <!-- HOOK 1: SECURITY AUDIT -->
    <article class="card hook-card">
        <h3>Hook 1: Security Audit (PreToolUse)</h3>
        <p class="description">Valida cada acción antes de ejecutarla — bloquea comandos peligrosos.</p>

        <div class="code-example">
            <strong>Configuración en .claude/settings.json:</strong>
            <pre><code data-lang="json">
{
  "hooks": {
    "PreToolUse": {
      "enabled": true,
      "rules": [
        {
          "name": "Block dangerous commands",
          "pattern": "(rm -rf|eval|curl.*\\||sh -c|sudo)",
          "action": "block",
          "message": "Comando potencialmente peligroso. Requiere aprobación."
        },
        {
          "name": "Block PII exposure",
          "pattern": "(password|token|secret|API_KEY)\\s*=",
          "action": "block",
          "message": "Detectado intento de escribir credenciales. No permitido."
        },
        {
          "name": "Database destructive check",
          "pattern": "^(DELETE|DROP|TRUNCATE)",
          "action": "confirm",
          "message": "Acción destructiva. ¿Confirmas?"
        }
      ]
    }
  }
}
            </code></pre>
        </div>

        <div class="example-block">
            <strong>Ejemplo en acción:</strong>
            <pre><code data-lang="bash">
USUARIO:
> Ejecuta rm -rf node_modules

HOOK INTERCEPTA:
❌ Security Alert
   Comando bloqueado: rm -rf
   Patrón: "dangerous commands"
   Solución: Usa npm clean-install

USUARIO ACEPTA:
> Usa npm clean-install entonces
✓ Acción permitida
            </code></pre>
        </div>
    </article>

    <!-- HOOK 2: AUTO-FORMAT + TESTS -->
    <article class="card hook-card">
        <h3>Hook 2: Auto-Format + Tests (PostToolUse)</h3>
        <p class="description">Después de escribir código, formatea automáticamente y corre tests.</p>

        <div class="code-example">
            <strong>Configuración:</strong>
            <pre><code data-lang="json">
{
  "hooks": {
    "PostToolUse": {
      "enabled": true,
      "sequence": [
        {
          "name": "Format code",
          "command": "npm run format",
          "onError": "warn"
        },
        {
          "name": "Lint check",
          "command": "npm run lint",
          "onError": "warn"
        },
        {
          "name": "Run tests",
          "command": "npm test -- --watch=false",
          "onError": "abort"
        }
      ]
    }
  }
}
            </code></pre>
        </div>
    </article>

    <!-- HOOK 3: CONTEXT INJECTION -->
    <article class="card hook-card">
        <h3>Hook 3: Context Injection (UserPromptSubmit)</h3>
        <p class="description">Inyecta automáticamente contexto relevante (git status, memory) antes de procesar prompts.</p>

        <div class="code-example">
            <strong>Configuración:</strong>
            <pre><code data-lang="json">
{
  "hooks": {
    "UserPromptSubmit": {
      "enabled": true,
      "injections": [
        {
          "name": "Git status",
          "command": "git status -s",
          "inject": true
        },
        {
          "name": "Session memory",
          "command": "head -20 ~/.claude/memory",
          "inject": true
        }
      ]
    }
  }
}
            </code></pre>
        </div>
    </article>

    <!-- HOOK 4: COST WARNING -->
    <article class="card hook-card">
        <h3>Hook 4: Cost Warning (PreToolUse)</h3>
        <p class="description">Advierte si una acción va a consumir muchos tokens o hacer muchas API calls.</p>

        <div class="code-example">
            <strong>Configuración:</strong>
            <pre><code data-lang="json">
{
  "hooks": {
    "PreToolUse": {
      "enabled": true,
      "costWarnings": [
        {
          "name": "Large file",
          "pattern": "@.*(\\.log|\\.csv)",
          "fileSize": "10MB",
          "action": "warn",
          "message": "Archivo >10MB estimado 500 tokens. ¿Continúo?"
        },
        {
          "name": "Database bulk op",
          "pattern": "DELETE|DROP|TRUNCATE",
          "action": "warn",
          "message": "Operación potencialmente costosa. Requiere confirmación."
        }
      ]
    }
  }
}
            </code></pre>
        </div>
    </article>

    <!-- HOOK 5: PERFORMANCE MONITORING -->
    <article class="card hook-card">
        <h3>Hook 5: Performance Monitoring (PostToolUse)</h3>
        <p class="description">Registra timing, tokens, y recursos de cada acción para análisis posterior.</p>

        <div class="code-example">
            <strong>Configuración:</strong>
            <pre><code data-lang="json">
{
  "hooks": {
    "PostToolUse": {
      "enabled": true,
      "monitoring": {
        "logFile": "~/.claude/performance.log",
        "metrics": ["duration", "tokensUsed", "errorsEncountered"],
        "alerts": [
          {
            "metric": "duration",
            "threshold": "60s",
            "action": "log"
          }
        ]
      }
    }
  }
}
            </code></pre>
        </div>

        <div class="example-block">
            <strong>Output esperado:</strong>
            <pre><code data-lang="bash">
[2025-05-15 14:23:45] Tool: bash (npm test)
  Duration: 32.4s
  Tokens: 2,100
  Status: ✓ success

[2025-05-15 14:24:10] Tool: mcp/postgres (query)
  Duration: 0.8s
  Tokens: 450
  Status: ✓ success
            </code></pre>
        </div>
    </article>

    <!-- SETUP COMPLETO -->
    <article class="card">
        <h3>Setup Completo (Copy-Paste)</h3>
        <pre><code data-lang="json">
{
  "version": "1.0",
  "hooks": {
    "PreToolUse": {
      "enabled": true,
      "rules": [
        {
          "id": "block-dangerous",
          "pattern": "(rm -rf|eval|curl.*sh)",
          "action": "block"
        },
        {
          "id": "block-credentials",
          "pattern": "(password|token|secret)\\s*=",
          "action": "block"
        }
      ]
    },
    "PostToolUse": {
      "enabled": true,
      "sequence": [
        { "name": "Format", "command": "npm run format" },
        { "name": "Tests", "command": "npm test -- --watch=false" }
      ]
    }
  }
}
        </code></pre>
    </article>
</section>

<!-- ==================== MULTI-MCP ORCHESTRATION ==================== -->
<section class="content-section" data-section="multi-mcp-orchestration">
    <h2>🎼 Multi-MCP Orchestration</h2>
    <p class="section-intro">Patrones de coordinación: Fork-Join para paralelismo, Cascading Validation para secuencias. Ejemplo completo: Parallel PR Analysis.</p>

    <!-- FORK-JOIN PATTERN -->
    <article class="card orchestration-card">
        <h3>Patrón 1: Fork-Join (Paralelismo con MCPs)</h3>
        <p class="description">Ejecuta múltiples MCPs en paralelo y agrega resultados. Ideal para análisis multi-fuente.</p>

        <div class="diagram-block">
            <strong>Diagrama:</strong>
            <pre><code data-lang="text">
┌─────────────────────────────────────┐
│ Main Claude Session                 │
│ "Analiza PR #247 completamente"     │
└──────────────┬──────────────────────┘
               │
         ┌─────┴─────────┐
         ▼               ▼
    [FORK 1]        [FORK 2]
   GitHub MCP      PostgreSQL MCP
   ├─ Get PR        ├─ Query affected
   └─ Code diff     └─ Data impact

     Aggregate
    Results
            </code></pre>
        </div>

        <div class="code-example">
            <strong>SKILL ejemplo:</strong>
            <pre><code data-lang="markdown">
# skill-parallel-analysis/SKILL.md

## Análisis Paralelo de PR

/fork "Analizar code changes"
  → Code review automático
  → Security check
  → Tests impact

/fork "Analizar database impact"
  → Query affected tables
  → Check migrations
  → Performance impact

# Consolida resultados
Resumen ejecutivo:
- Code: 7.5/10 (fixable)
- Security: 6/10 (API key leak)
- Data: 9/10 (safe)
            </code></pre>
        </div>
    </article>

    <!-- CASCADING VALIDATION PATTERN -->
    <article class="card orchestration-card">
        <h3>Patrón 2: Cascading Validation</h3>
        <p class="description">Validaciones secuenciales: cada paso ejecuta solo si anterior pasó.</p>

        <div class="diagram-block">
            <strong>Flujo:</strong>
            <pre><code data-lang="text">
Nuevo commit
    ↓
[1] Code Quality
    └─ Lint → Format → Typecheck
        ↓ (OK)
[2] Security
    └─ SAST → Dependencies → Secrets
        ↓ (OK)
[3] Tests
    └─ Unit → Integration → E2E
        ↓ (OK)
[4] Build
    └─ Bundle → Size check
        ↓ (OK)
✅ READY FOR MERGE
            </code></pre>
        </div>

        <div class="code-example">
            <strong>Implementation en SKILL:</strong>
            <pre><code data-lang="bash">
#!/bin/bash
set -e  # Fail on first error

echo "🔍 STEP 1: Code Quality"
npm run lint || exit 1
npm run format:check || exit 1

echo "🔐 STEP 2: Security"
npm audit || exit 1

echo "🧪 STEP 3: Tests"
npm test -- --coverage || exit 1

echo "✅ All validations passed!"
            </code></pre>
        </div>
    </article>

    <!-- EJEMPLO COMPLETO: PARALLEL PR REVIEW -->
    <article class="card orchestration-card">
        <h3>Ejemplo Completo: Parallel PR Review (3 Agentes)</h3>
        <p class="description">PR #247 toca auth + payments + database. 3 sesiones paralelas analizan en paralelo y consolidar resultados.</p>

        <div class="info-block">
            <strong>Setup previo:</strong>
            <pre><code data-lang="bash">
claude mcp add --scope project github -e GITHUB_TOKEN=...
claude mcp add --scope project postgres -e DATABASE_URL=...
            </code></pre>
        </div>

        <div class="code-example">
            <strong>Main Orchestrator SKILL:</strong>
            <pre><code data-lang="markdown">
# skill-parallel-pr-review/SKILL.md

## Parallel PR #247 Review

### PASO 1: Obtén info de PR
```bash
PR_NUM=247
gh pr view $PR_NUM --json title,body,changedFiles,commits
```

### PASO 2: Inicia 3 forks paralelos

/fork code_reviewer
  Tarea: Code review línea-por-línea
  Output: Score + comentarios

/fork security_auditor
  Tarea: Security + dependencies
  Output: Hallazgos críticos

/fork data_analyzer
  Tarea: Database impact
  Output: Risk assessment

### PASO 3: Consolida en main session
- Combina scores
- Prioriza acciones
- Genera resumen ejecutivo
            </code></pre>
        </div>

        <div class="code-example">
            <strong>Session 1: Code Reviewer</strong>
            <pre><code data-lang="markdown">
# Review PR #247 código

## Hallazgos:

### 🟢 Strengths
- Buen naming de variables
- Tests coexisten

### 🟡 Warnings
- `src/auth/tokens.ts:42` función 600+ líneas
- Error handling incompleto en payments

### 🔴 Blockers
- Ninguno

**Score: 7.5/10**
            </code></pre>
        </div>

        <div class="code-example">
            <strong>Session 2: Security Auditor</strong>
            <pre><code data-lang="markdown">
# Security check PR #247

## Critical Issues

🔴 Hardcoded API key en `src/payments/stripe.ts:18`
   Fix: Usa env var

## Medium Issues

🟡 SQL query sin parameterized statements (2 lugares)
   Fix: Prepared statements

## Recommendations
1. Remove hardcoded secrets
2. Use parameterized queries
3. Add rate limiting

**Score: 6/10**
            </code></pre>
        </div>

        <div class="code-example">
            <strong>Session 3: Data Analyzer</strong>
            <pre><code data-lang="markdown">
# Database impact PR #247

/mcp postgres

## Schema Changes
- ALTER TABLE transactions ADD COLUMN metadata JSONB
- CREATE INDEX idx_charges_user_id (needed)

## Performance
- Current: 0.02s
- With index: 0.001s (20x faster)

## Risks
- ⚠ Index falta
  Fix: CREATE INDEX antes deploy
- ✓ No data loss
- ✓ Rollback plan OK

**Score: 9/10**
            </code></pre>
        </div>

        <div class="example-block">
            <strong>Resultado Consolidado:</strong>
            <pre><code data-lang="text">
┌─────────────────────────────────────────┐
│         CONSOLIDATED PR #247 REVIEW     │
├─────────────────────────────────────────┤
│ Code Quality:      7.5/10  ⚠ Minors    │
│ Security:          6.0/10  🔴 API key  │
│ Data Impact:       9.0/10  ✅ Safe     │
│ ─────────────────────────────────────   │
│ OVERALL:           7.5/10               │
│                                         │
│ ❌ NEEDS FIXES BEFORE MERGE             │
│                                         │
│ Actions:                                │
│ 1. ✅ Remove hardcoded stripe key       │
│ 2. ✅ Use parameterized queries (2x)    │
│ 3. ⏳ Create index (post-merge OK)      │
│ 4. ✅ Refactor 600-line function        │
│                                         │
│ Est. time: 30 min                       │
│ Status: Request changes                 │
└─────────────────────────────────────────┘
            </code></pre>
        </div>

        <div class="code-example">
            <strong>Post-Review Actions:</strong>
            <pre><code data-lang="bash">
# GitHub review automático
gh pr review 247 --request-changes \
  --body "See parallel review. 4 items to fix."

# Crear issue para post-merge
gh issue create \
  --title "Create index: idx_charges_user_id" \
  --labels "performance" \
  --body "Post-merge optimization from PR #247"
            </code></pre>
        </div>
    </article>

    <!-- RECOMENDACIONES POR ESCALA -->
    <article class="card">
        <h3>Recomendaciones por Tamaño de Equipo</h3>
        <div class="responsive-table">
            <table>
                <thead>
                    <tr>
                        <th>Tamaño</th>
                        <th>Workflow</th>
                        <th>MCPs Clave</th>
                        <th>Paralelismo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Solo tú</strong></td>
                        <td>Trunk-based</td>
                        <td>GitHub</td>
                        <td>Worktrees</td>
                    </tr>
                    <tr>
                        <td><strong>2-5</strong></td>
                        <td>Trunk-based</td>
                        <td>GitHub + Slack</td>
                        <td>Forks</td>
                    </tr>
                    <tr>
                        <td><strong>5-15</strong></td>
                        <td>Gitflow</td>
                        <td>GitHub + PostgreSQL + Slack</td>
                        <td>Cascading + Forks</td>
                    </tr>
                    <tr>
                        <td><strong>15+</strong></td>
                        <td>Multi-repo</td>
                        <td>↑ + Custom MCPs</td>
                        <td>Orchestration avanzado</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </article>
</section>
```

---

## PASO 3: (OPCIONAL) Actualizar COMMANDS_DATA

Si quieres que la búsqueda encuentre comandos de estas nuevas secciones, agrega a `script.js` (alrededor de línea 200+):

```javascript
// --- Nivel 4: Git Workflows & MCPs ---
{ cmd: 'git worktree add', level: 4, category: 'git',
  desc: 'Crea un directorio aislado para trabajar en otra rama en paralelo.',
  example: 'git worktree add ~/work/feature-auth -b feature/auth' },

{ cmd: 'claude --worktree', level: 4, category: 'shell',
  desc: 'Inicia sesión en un git worktree aislado — para paralelismo sin conflictos.',
  example: 'claude --worktree feature-payment' },

{ cmd: 'claude mcp add --scope user', level: 2, category: 'mcp',
  desc: 'Registra MCP a nivel de usuario (disponible en todos tus proyectos).',
  example: 'claude mcp add --scope user github -e GITHUB_TOKEN=...' },

{ cmd: 'claude mcp add --scope project', level: 2, category: 'mcp',
  desc: 'Registra MCP a nivel de proyecto (compartible en git via .mcp.json).',
  example: 'claude mcp add --scope project postgres -e DATABASE_URL=...' },

{ cmd: '/fork', level: 3, category: 'built-in',
  desc: 'Bifurca la sesión en paralelo (comparte contexto + caché).',
  example: '/fork "Analizar código en paralelo"' },
```

---

## PASO 4: (OPCIONAL) CSS Adicional

Las secciones heredan CSS existente, pero si quieres estilos específicos, agrega a `styles.css`:

```css
/* MCP Cards */
.mcp-card {
  border-left: 4px solid var(--color-accent);
}

.hook-card {
  border-left: 4px solid var(--color-warning);
}

.workflow-card {
  border-left: 4px solid var(--color-success);
}

.orchestration-card {
  border-left: 4px solid var(--color-info);
}

/* Code examples con lenguaje */
.code-example {
  margin: 1.5rem 0;
}

.code-example strong {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
}

/* Diagrams */
.diagram-block {
  background: var(--color-bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  overflow-x: auto;
}

/* Steps */
.steps {
  counter-reset: step-counter;
  padding-left: 0;
}

.steps li {
  counter-increment: step-counter;
  margin-bottom: 1.5rem;
  padding-left: 2rem;
  position: relative;
}

.steps li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--color-accent);
  color: var(--color-bg);
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.85rem;
}

/* Pros/Cons */
.pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.pros, .cons {
  padding: 1rem;
  border-radius: 8px;
}

.pros {
  background: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4caf50;
}

.cons {
  background: rgba(244, 67, 54, 0.1);
  border-left: 4px solid #f44336;
}
```

---

## Resumen de cambios

| Archivo | Cambio | Líneas |
|---------|--------|--------|
| `index.html` | Agregar nav items + 4 `<section>` | ~500 líneas |
| `script.js` | (Opcional) Agregar COMMANDS_DATA | ~10 líneas |
| `styles.css` | (Opcional) Estilos específicos | ~60 líneas |

**Tiempo estimado de integración:** 30 minutos (copy-paste + ajustes)

---

## Testing Post-Integration

1. Abre `index.html` en navegador
2. Verifica que nav items aparecen
3. Clickea cada sección y valida contenido
4. Busca (Ctrl+K) un comando nuevo, ej: "worktree"
5. Verifica que code blocks son copyables

Done! 🎉
