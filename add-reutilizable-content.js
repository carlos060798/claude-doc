#!/usr/bin/env node

/**
 * Script para inyectar contenido reutilizable dormido en HTML
 * Contenido extraído de lib/data.js y lib/practicalUseCases.js
 * Sin modificar código, solo HTML estático
 */

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// Contenido reutilizable: 850 líneas dormidas → HTML estático
const reutilizableContent = `
            <!-- GIT WORKFLOWS REALES SECTION -->
            <section class="content-section" data-section="git-workflows-detail" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Producción / Git Workflows Detallado</span>
                    <h2>🌿 Git Workflows Reales en Producción</h2>
                    <p class="section-lead">Tres flujos probados: Trunk-based, Gitflow, Worktrees. Con comandos copy-paste.</p>
                </div>

                <article class="card">
                    <h3>Flujo A: Trunk-Based Development</h3>
                    <p><strong>Para:</strong> Equipos 2-8 personas, ciclos cortos (diarios/semanales)</p>
                    <pre><code class="language-bash"># 1. Sincroniza master
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

# 5. Cleanup
git checkout master
git pull origin master
git branch -d fix/auth-token-refresh</code></pre>
                    <p><strong>Pros:</strong> Integración continua = menos conflictos, deploy seguro, feedback rápido</p>
                    <p><strong>Contras:</strong> Requiere CI/CD sólido, tests confiables, presión para merge rápido</p>
                </article>

                <article class="card">
                    <h3>Flujo B: Feature Branches + Gitflow</h3>
                    <p><strong>Para:</strong> Equipos 8-20 personas, releases planeadas cada 2-4 semanas</p>
                    <pre><code class="language-bash"># STEP 1: Feature branch desde develop
git checkout -b feature/otp-auth develop
git commit -m "feat: agregar TOTP authentication"
git push origin feature/otp-auth

# STEP 2: Code freeze para release
git checkout -b release/2.5.0 develop
git commit -m "chore: bump to v2.5.0"

# STEP 3: Tests finales + tag
npm test && npm run build
git tag -a v2.5.0 -m "Release 2.5.0"

# STEP 4: Merge a master + back a develop
git checkout master && git pull origin master
git merge --no-ff release/2.5.0
git push origin master v2.5.0</code></pre>
                    <p><strong>Pros:</strong> Estructura clara (develop ≠ production), releases controladas, hotfixes sin afectar features</p>
                    <p><strong>Contras:</strong> Más complicado, merge frequentes, riesgo de divergencia</p>
                </article>

                <article class="card">
                    <h3>Flujo C: Git Worktrees (Paralelismo)</h3>
                    <p><strong>Para:</strong> Trabajar en 2-3 branches en paralelo sin conflictos</p>
                    <pre><code class="language-bash"># Opción 1: Manual git worktree
git worktree add ~/work/auth-refactor -b feature/auth-refactor
cd ~/work/auth-refactor

# Opción 2: Automático con Claude Code
claude --worktree feature/auth-refactor

# Listing
git worktree list

# Cleanup
git worktree remove ~/work/auth-refactor</code></pre>
                    <p><strong>Pros:</strong> Paralelismo sin conflictos, contexto aislado, sin "git checkout"</p>
                    <p><strong>Contras:</strong> Requiere más storage, puede ser confuso con directorios, cleanup manual</p>
                </article>

                <article class="card">
                    <h3>Comparativa Rápida</h3>
                    <table class="comparison-table">
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
                                <td>Complejidad</td>
                                <td>Baja</td>
                                <td>Media</td>
                                <td>Media (intuitiva)</td>
                            </tr>
                            <tr>
                                <td>Release cycle</td>
                                <td>Diario/semanal</td>
                                <td>Cada 2-4 sem</td>
                                <td>Variable</td>
                            </tr>
                            <tr>
                                <td>Equipo ideal</td>
                                <td>2-8</td>
                                <td>8-20+</td>
                                <td>Cualquiera</td>
                            </tr>
                            <tr>
                                <td>CI/CD requerido</td>
                                <td>Sólido</td>
                                <td>Moderado</td>
                                <td>Sólido</td>
                            </tr>
                            <tr>
                                <td>Merge conflicts</td>
                                <td>Frecuentes (pequeños)</td>
                                <td>Menos frecuentes</td>
                                <td>Cero (isolated)</td>
                            </tr>
                        </tbody>
                    </table>
                </article>
            </section>

            <!-- MCP SERVERS SETUP SECTION -->
            <section class="content-section" data-section="mcp-setup" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Producción / MCPs por Caso de Uso</span>
                    <h2>🔗 MCP Servers: Setup Copy-Paste</h2>
                    <p class="section-lead">GitHub, PostgreSQL, Slack y otros MCPs. Configuración lista para copiar.</p>
                </div>

                <article class="card">
                    <h3>GitHub MCP: PR Reviews & Issue Creation</h3>
                    <p><strong>Para:</strong> Code review automation, issue tracking, PR diff queries</p>
                    <p><strong>Permite:</strong> Automatizar reviews línea-por-línea, crear issues, query PRs sin salir del CLI</p>
                    <pre><code class="language-bash"># Opción 1: User scope (global, en todos tus proyectos)
claude mcp add --scope user github \\
  -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxx \\
  -- npx -y @modelcontextprotocol/server-github

# Opción 2: Project scope (compartible en git)
claude mcp add --scope project github \\
  -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxx \\
  -- npx -y @modelcontextprotocol/server-github

# Verificar conexión
claude
/mcp</code></pre>
                    <p><strong>Nota:</strong> Obtén token en GitHub → Settings → Developer settings → Personal access tokens</p>
                </article>

                <article class="card">
                    <h3>PostgreSQL MCP: Data Exploration</h3>
                    <p><strong>Para:</strong> Database debugging, schema analysis, query sin psql</p>
                    <p><strong>Permite:</strong> Ejecutar queries directamente, explorar schema, debugging de datos en prod</p>
                    <pre><code class="language-bash"># Local database
claude mcp add --scope project postgres \\
  -e DATABASE_URL=postgresql://user:pass@localhost:5432/mydb \\
  -- npx -y @modelcontextprotocol/server-postgres

# Con variables de entorno
claude mcp add --scope project postgres \\
  -e DATABASE_URL=\$DATABASE_URL \\
  -- npx -y @modelcontextprotocol/server-postgres</code></pre>
                    <p><strong>Nota:</strong> DATABASE_URL debe ser accesible desde tu máquina (local o con tunnel SSH)</p>
                </article>

                <article class="card">
                    <h3>Slack MCP: Notifications & Audit Trail</h3>
                    <p><strong>Para:</strong> Team notifications, audit logging, CI/CD alerts</p>
                    <p><strong>Permite:</strong> Notificar al equipo desde Claude, crear audit trail, alertas automáticas</p>
                    <pre><code class="language-bash"># 1. Crear Slack Bot Token
# Ir a https://api.slack.com/apps
# Create New App → From scratch
# App name: "Claude Code Bot"
# OAuth & Permissions → Scopes: chat:write, files:write
# Copy Bot User OAuth Token

# 2. Agregar MCP
claude mcp add --scope user slack \\
  -e SLACK_BOT_TOKEN=xoxb-xxxxx \\
  -- npx -y @modelcontextprotocol/server-slack

# 3. Verificar
/mcp</code></pre>
                    <p><strong>Nota:</strong> Agregar bot al canal antes de usarlo: /invite @Claude Code Bot</p>
                </article>

                <article class="card">
                    <h3>Verificar Todos tus MCPs Conectados</h3>
                    <pre><code class="language-bash">claude
/mcp
# Lista todos los MCPs registrados y su estado:
# ✓ github (connected)
# ✓ postgres (connected)
# ✓ slack (connected)
# ✗ custom-mcp (not found)</code></pre>
                </article>
            </section>

            <!-- PRODUCTION HOOKS SECTION -->
            <section class="content-section" data-section="hooks-detail" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Producción / Hooks en Producción</span>
                    <h2>🎣 Hooks para Seguridad & Automación</h2>
                    <p class="section-lead">5 hooks reales que automatizan seguridad, tests y monitoreo.</p>
                </div>

                <article class="card">
                    <h3>Hook 1: Security Audit (PreToolUse)</h3>
                    <p>Valida cada acción antes de ejecutarla — bloquea comandos peligrosos.</p>
                    <pre><code class="language-json">{
  "hooks": {
    "PreToolUse": {
      "enabled": true,
      "rules": [
        {
          "name": "Block dangerous commands",
          "pattern": "(rm -rf|eval|curl.*\\\\||sh -c|sudo)",
          "action": "block",
          "message": "Comando potencialmente peligroso."
        },
        {
          "name": "Block PII exposure",
          "pattern": "(password|token|secret)\\\\s*=",
          "action": "block",
          "message": "No se permite escribir credenciales."
        }
      ]
    }
  }
}</code></pre>
                </article>

                <article class="card">
                    <h3>Hook 2: Auto-Format + Tests (PostToolUse)</h3>
                    <p>Después de escribir código, formatea automáticamente y corre tests.</p>
                    <pre><code class="language-json">{
  "hooks": {
    "PostToolUse": {
      "enabled": true,
      "sequence": [
        { "name": "Format code", "command": "npm run format", "onError": "warn" },
        { "name": "Lint check", "command": "npm run lint", "onError": "warn" },
        { "name": "Run tests", "command": "npm test -- --watch=false", "onError": "abort" }
      ]
    }
  }
}</code></pre>
                </article>

                <article class="card">
                    <h3>Hook 3: Context Injection (UserPromptSubmit)</h3>
                    <p>Inyecta automáticamente contexto relevante antes de procesar prompts.</p>
                    <pre><code class="language-json">{
  "hooks": {
    "UserPromptSubmit": {
      "enabled": true,
      "injections": [
        { "name": "Git status", "command": "git status -s", "inject": true },
        { "name": "Session memory", "command": "head -20 ~/.claude/memory", "inject": true }
      ]
    }
  }
}</code></pre>
                </article>

                <article class="card">
                    <h3>Hook 4: Cost Warning (PreToolUse)</h3>
                    <p>Advierte si una acción va a consumir muchos tokens o hacer muchas API calls.</p>
                    <pre><code class="language-json">{
  "hooks": {
    "PreToolUse": {
      "enabled": true,
      "costWarnings": [
        { "name": "Large file", "pattern": "@.*(\\\\.log|\\\\.csv)", "fileSize": "10MB", "action": "warn" },
        { "name": "Database bulk op", "pattern": "DELETE|DROP|TRUNCATE", "action": "warn" }
      ]
    }
  }
}</code></pre>
                </article>

                <article class="card">
                    <h3>Hook 5: Performance Monitoring (PostToolUse)</h3>
                    <p>Registra timing, tokens y recursos de cada acción para análisis posterior.</p>
                    <pre><code class="language-json">{
  "hooks": {
    "PostToolUse": {
      "enabled": true,
      "monitoring": {
        "logFile": "~/.claude/performance.log",
        "metrics": ["duration", "tokensUsed", "errorsEncountered"],
        "alerts": [{ "metric": "duration", "threshold": "60s", "action": "log" }]
      }
    }
  }
}</code></pre>
                </article>

                <article class="card">
                    <h3>Cómo Aplicar Hooks</h3>
                    <pre><code class="language-bash"># Crea archivo .claude.json en raíz de tu proyecto
cat > .claude.json << 'EOF'
{
  "hooks": {
    "PreToolUse": { ... },
    "PostToolUse": { ... }
  }
}
EOF

# Claude Code los carga automáticamente en cada sesión
cd tu-proyecto && claude
# Los hooks están activos</code></pre>
                </article>
            </section>

            <!-- MULTI-MCP ORCHESTRATION SECTION -->
            <section class="content-section" data-section="multi-mcp-orchestration" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Producción / Orquestación Multi-MCP</span>
                    <h2>🎼 Orquestar Múltiples MCPs en Paralelo</h2>
                    <p class="section-lead">Patrones de coordinación: Fork-Join para paralelismo, Cascading Validation para secuencias.</p>
                </div>

                <article class="card">
                    <h3>Patrón 1: Fork-Join (Paralelismo con MCPs)</h3>
                    <p>Ejecuta múltiples MCPs en paralelo y agrega resultados. Ideal para análisis multi-fuente.</p>
                    <pre><code>Análisis PR #247 en paralelo:

┌─────────────────────┐
│ Main Claude Session │
└──────────┬──────────┘
           │
     ┌─────┴────────┐
     ▼              ▼
  FORK 1        FORK 2
  GitHub MCP    PostgreSQL MCP
  ├─ Get PR     ├─ Query tables
  └─ Code diff  └─ Data impact

  Resultados agregados
  ✅ REPORTE FINAL</code></pre>
                    <p><strong>Caso:</strong> Revisar PR que modifica DB. Simultáneamente: diff del código + análisis de datos afectados.</p>
                </article>

                <article class="card">
                    <h3>Patrón 2: Cascading Validation</h3>
                    <p>Validaciones secuenciales: cada paso ejecuta solo si anterior pasó (fail-fast).</p>
                    <pre><code>Nuevo commit

[1] Code Quality (Lint → Format → Typecheck)
    ↓ (OK o FAIL)
[2] Security (SAST → Dependencies → Secrets)
    ↓ (OK o FAIL)
[3] Tests (Unit → Integration → E2E)
    ↓ (OK o FAIL)
[4] Build (Bundle → Size check)
    ↓ (OK)
✅ READY FOR MERGE</code></pre>
                    <p><strong>Beneficio:</strong> Si Code Quality falla, no gastas tokens en Security. Fail-fast.</p>
                </article>

                <article class="card">
                    <h3>Recomendaciones por Tamaño de Equipo</h3>
                    <table class="comparison-table">
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
                                <td>Solo tú</td>
                                <td>Trunk-based</td>
                                <td>GitHub</td>
                                <td>Worktrees</td>
                            </tr>
                            <tr>
                                <td>2-5</td>
                                <td>Trunk-based</td>
                                <td>GitHub + Slack</td>
                                <td>Forks</td>
                            </tr>
                            <tr>
                                <td>5-15</td>
                                <td>Gitflow</td>
                                <td>GitHub + PostgreSQL + Slack</td>
                                <td>Cascading + Forks</td>
                            </tr>
                            <tr>
                                <td>15+</td>
                                <td>Multi-repo</td>
                                <td>↑ + Custom MCPs</td>
                                <td>Orchestration avanzado</td>
                            </tr>
                        </tbody>
                    </table>
                </article>
            </section>

            <!-- NIVEL 2 CASOS PRÁCTICOS -->
            <section class="content-section" data-section="nivel2-casos" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Casos Prácticos / Nivel 2: Avanzado</span>
                    <h2>🚀 Nivel 2: Flujos de Equipo e Integración MCP</h2>
                    <p class="section-lead">Escalas más allá de proyectos individuales. Integras Claude Code en CI/CD, usas MCPs para GitHub/Slack/DB.</p>
                </div>

                <article class="card">
                    <h3>Caso 1: Code Review Automático vía GitHub MCP</h3>
                    <p><strong>Situación:</strong> Cada PR abierto se revisa automáticamente. Comentarios postean directamente en GitHub.</p>
                    <p><strong>Beneficio:</strong> 5 horas/semana ahorradas si tienes 15 PRs/semana</p>

                    <div class="steps">
                        <div class="step">
                            <h4>1. GitHub Personal Access Token</h4>
                            <pre><code>GitHub Settings → Developer settings → Personal access tokens
Scopes: repo (full), workflow
Token: ghp_xxxxxxxxxxxxx</code></pre>
                        </div>
                        <div class="step">
                            <h4>2. Agregar GitHub MCP</h4>
                            <pre><code class="language-bash">claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxx</code></pre>
                        </div>
                        <div class="step">
                            <h4>3. GitHub Actions Workflow</h4>
                            <pre><code class="language-bash">Cada PR abierto → GitHub Actions dispara → Claude revisa → comenta automáticamente

Tiempo ahorrado: 20 min/PR vs 30 min manual review</code></pre>
                        </div>
                    </div>

                    <p><strong>Resultado:</strong> Code review profesional automático ✅</p>
                </article>

                <article class="card">
                    <h3>Caso 2: Integración CI/CD — Risk Analysis Post-Merge</h3>
                    <p><strong>Situación:</strong> Cada commit mergeado a main ejecuta análisis profundo. Claude detecta cambios riesgosos y alerta via Slack.</p>

                    <div class="steps">
                        <div class="step">
                            <h4>1. Slack Bot Token</h4>
                            <pre><code>https://api.slack.com/apps → Create New App
OAuth Scopes: chat:write, files:write
Bot Token: xoxb_xxxxx</code></pre>
                        </div>
                        <div class="step">
                            <h4>2. Workflow Automático</h4>
                            <pre><code class="language-bash">Push a main → Risk analysis → Alerta en Slack si cambios riesgosos
(auth, database, sin tests nuevos, etc)</code></pre>
                        </div>
                    </div>

                    <p><strong>Alerta esperada:</strong> Mensaje Slack: "⚠️ Risk HIGH: cambios en auth, no hay tests nuevos" ✅</p>
                </article>

                <article class="card">
                    <h3>Caso 3: Compartir Contexto en Equipo</h3>
                    <p><strong>Situación:</strong> Nuevo developer se une. Necesita acceso a decisiones arquitectónicas y bugs históricos.</p>

                    <div class="steps">
                        <div class="step">
                            <h4>Centralizar en CLAUDE.md</h4>
                            <pre><code class="language-markdown">## Arquitectura
[Overview]

## Bugs Históricos
- Race condition en auth → SOLUCIÓN: mutex
- N+1 query en list_users → SOLUCIÓN: aggregation

## Decisiones de Diseño
Por qué Postgres, por qué este stack, etc</code></pre>
                        </div>
                        <div class="step">
                            <h4>Onboarding Rápido</h4>
                            <pre><code class="language-bash">cd mi-repo && claude

@CLAUDE.md
Voy a empezar. Explícame la arquitectura y primeros pasos.

# Claude lee CLAUDE.md y explica todo en 15 min</code></pre>
                        </div>
                    </div>

                    <p><strong>Resultado:</strong> Nuevo dev entiende proyecto sin re-explicar nada ✅</p>
                </article>
            </section>
`;

// Buscar dónde insertar (antes del cierre de </main>)
const mainCloseTag = '</main>';
const insertPosition = html.lastIndexOf(mainCloseTag);

if (insertPosition === -1) {
    console.error('❌ No se encontró </main> en index.html');
    process.exit(1);
}

// Insertar el contenido
html = html.slice(0, insertPosition) + reutilizableContent + '\n        ' + html.slice(insertPosition);

// Guardar
fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('✅ Contenido reutilizable inyectado en index.html');
console.log('✅ 5 secciones nuevas agregadas (ESTÁTICO, sin JavaScript dinámico):');
console.log('   - git-workflows-detail: 3 flujos reales con comandos copy-paste');
console.log('   - mcp-setup: GitHub, PostgreSQL, Slack MCPs listos');
console.log('   - hooks-detail: 5 hooks de producción con JSON');
console.log('   - multi-mcp-orchestration: Patrones Fork-Join y Cascading');
console.log('   - nivel2-casos: 3 casos prácticos de equipo/CI-CD');
console.log('\n📝 Contenido extraído de lib/data.js y lib/practicalUseCases.js');
console.log('🎯 ~850 líneas dormidas → HTML estático reutilizable.\n');
