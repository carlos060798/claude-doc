# HTML Structure Samples — Detailed Breakdown

This document shows actual HTML patterns from each major section for React component mapping.

---

## 1. DASHBOARD Section Sample

```html
<section class="content-section active" data-section="dashboard" data-mode="both">
    <div class="section-header">
        <span class="breadcrumb">Inicio / Dashboard</span>
        <h2>Bienvenido a la Guía de Claude Code</h2>
        <p class="section-lead">
            Domina la herramienta agéntica de Anthropic desde principiante hasta experto...
        </p>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <span class="stat-label">Comandos cubiertos</span>
            <span class="stat-value" id="stat-commands">—</span>
            <span class="stat-trend">Built-in + Custom</span>
        </div>
        <!-- 5 more stat-card elements -->
    </div>

    <div class="card-grid">
        <a href="#nivel-1" class="path-card path-card--1" data-jump="nivel-1">
            <span class="path-level">Nivel 1</span>
            <h3>Fundamentos</h3>
            <p>Instalación con npm, comandos básicos...</p>
            <span class="path-arrow">→</span>
        </a>
        <!-- 5 more path-card elements -->
    </div>

    <div class="info-banner">
        <strong>💡 Tip de senior:</strong> Lee el archivo <code>CLAUDE.md</code>...
    </div>
</section>
```

**React Component Structure:**
```tsx
<Dashboard>
  <SectionHeader
    breadcrumb="Inicio / Dashboard"
    title="Bienvenido a la Guía de Claude Code"
    lead="Domina la herramienta..."
  />
  <StatsGrid stats={[...]} />
  <CardGrid cards={[...]} />
  <InfoBanner type="tip" text="..." />
</Dashboard>
```

---

## 2. CURSO Section Sample

```html
<section class="content-section" data-section="curso" data-mode="technical">
    <div class="section-header">...</div>

    <div class="course-hero">
        <div class="course-hero-stats">
            <div class="hero-stat">
                <span class="hero-stat-num">7</span>
                <span class="hero-stat-label">Módulos</span>
            </div>
            <!-- 4 more hero-stat elements -->
        </div>
        <div class="course-progress-summary" id="course-progress-summary">
            <div class="progress-track">
                <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
            </div>
            <span class="progress-label" id="progress-label">0 / 7 módulos completados</span>
        </div>
    </div>

    <h3 class="block-title">🗺️ El Roadmap Completo</h3>

    <div class="roadmap">
        <div class="roadmap-module" data-module="1">
            <div class="roadmap-marker">01</div>
            <div class="roadmap-content">
                <div class="roadmap-meta">
                    <span class="roadmap-tag roadmap-tag--easy">Principiante</span>
                    <span class="roadmap-time">~30 min</span>
                </div>
                <h4>Setup & Primer Contacto</h4>
                <p>Instalación multiplataforma...</p>
                <ul class="roadmap-bullets">
                    <li>Instalar Claude Code en tu sistema</li>
                    <li>Configurar OAuth o API Key</li>
                    <!-- more bullets -->
                </ul>
                <div class="roadmap-project">🎯 <strong>Proyecto:</strong> Configurar Claude Code...</div>
                <a href="#nivel-1" class="roadmap-cta" data-jump="nivel-1">Comenzar Módulo 1 →</a>
            </div>
        </div>
        <!-- 6 more roadmap-module elements -->
    </div>

    <h3 class="block-title">📚 Cómo aprovechar este curso</h3>
    <div class="course-tips-grid">
        <div class="course-tip-card">
            <div class="course-tip-icon">🛠️</div>
            <h4>Aprende haciendo</h4>
            <p>Cada módulo tiene un proyecto real...</p>
        </div>
        <!-- 3 more course-tip-card elements -->
    </div>
</section>
```

**React Component Structure:**
```tsx
<Curso>
  <SectionHeader {...} />
  <CourseHero stats={[...]} progress={{ completed: 0, total: 7 }} />
  <h3>El Roadmap Completo</h3>
  <Roadmap modules={[
    { num: 1, title: "Setup...", difficulty: "easy", time: "~30 min", ... },
    // 6 more
  ]} />
  <h3>Cómo aprovechar</h3>
  <CourseTipsGrid tips={[...]} />
</Curso>
```

---

## 3. FLUJOS-DEV Section Sample

```html
<section class="content-section" data-section="flujos-dev" data-mode="technical">
    <div class="section-header">...</div>

    <article class="flow-card" data-flow="onboarding">
        <header class="flow-header">
            <div class="flow-tag">Flujo 01</div>
            <h3>🆕 Onboarding a un repo legacy de 5 años</h3>
            <p class="flow-context">
                <strong>Situación:</strong> Te incorporas a un equipo. El repo tiene 200 archivos...
            </p>
        </header>

        <div class="flow-steps">
            <div class="flow-step">
                <div class="flow-step-num">1</div>
                <div class="flow-step-body">
                    <strong>Mapa inicial del repo</strong>
                    <pre class="flow-prompt">> Eres un senior engineer haciendo onboarding. Sin leer nada en detalle:
  1. Lista los directorios principales con `ls` y describe el propósito de cada uno
  2. Lee @README.md y @package.json
  ...</pre>
                    <span class="flow-tip">💡 No le pidas leer todo al principio — hace consumo brutal de tokens.</span>
                </div>
            </div>
            <!-- 3-4 more flow-step elements -->
        </div>

        <div class="flow-pitfalls">
            <strong>⚠ Errores comunes:</strong>
            <ul>
                <li>Pedir "léete todo el repo" — saturas el contexto sin sacar valor</li>
                <li>No actualizar CLAUDE.md después del onboarding — pierdes el aprendizaje</li>
                <li>Mezclar onboarding con tareas reales — cada cosa en su sesión</li>
            </ul>
        </div>
    </article>

    <!-- 9 more flow-card articles -->
</section>
```

**React Component Structure:**
```tsx
<FlujosDev>
  <SectionHeader {...} />
  {flows.map(flow => (
    <FlowCard key={flow.id} flow={flow}>
      <FlowHeader tag={flow.tag} title={flow.title} context={flow.context} />
      <FlowSteps steps={flow.steps.map(step => (
        <FlowStep
          number={step.num}
          title={step.title}
          prompt={step.prompt}
          tip={step.tip}
        />
      ))} />
      <FlowPitfalls pitfalls={flow.pitfalls} />
    </FlowCard>
  ))}
</FlujosDev>
```

---

## 4. NIVEL-1 Section Sample

```html
<section class="content-section" data-section="nivel-1" data-mode="technical">
    <div class="section-header">
        <span class="breadcrumb">Niveles / Nivel 1</span>
        <h2><span class="level-tag level-tag--1">Nivel 1</span> Fundamentos</h2>
        <p class="section-lead">Tu primera sesión productiva...</p>
    </div>

    <div class="lesson-intro" data-lesson="1"></div>

    <h3 class="block-title">1.1 — Instalación</h3>
    <p>Claude Code requiere <strong>Node.js 18+</strong>...</p>

    <div class="code-block" data-lang="bash" data-title="Instalación vía npm (multiplataforma)">
        <pre><code># Instalación global con npm
npm install -g @anthropic-ai/claude-code

# Verificar la instalación
claude --version

# Iniciar la primera sesión
cd mi-proyecto/
claude</code></pre>
    </div>

    <div class="code-block" data-lang="bash" data-title="Instalador rápido (alternativa oficial)">
        <pre><code># macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex</code></pre>
    </div>

    <h3 class="block-title">1.2 — Autenticación</h3>
    <p>Antes de tu primera sesión...</p>

    <div class="code-block" data-lang="bash" data-title="Autenticación vía OAuth (recomendado)">
        <pre><code>claude auth login
claude --version</code></pre>
    </div>

    <div class="info-banner info-banner--warn">
        <strong>🔐 Seguridad:</strong> Nunca escribas tu API Key en archivos versionados...
    </div>

    <h3 class="block-title">1.3 — Comandos esenciales (slash commands)</h3>
    <div class="commands-table-wrapper" id="commands-table-nivel-1">
        <!-- Renderizado por JS desde COMMANDS_DATA -->
    </div>

    <h3 class="block-title">1.4 — Navegación de archivos con <code>@</code></h3>
    <div class="code-block" data-lang="text" data-title="Ejemplo de navegación contextual">
        <pre><code>> Lee @src/auth/login.ts y compáralo con @src/auth/register.ts...</code></pre>
    </div>

    <div class="lesson-outro" data-lesson="1"></div>
</section>
```

**React Component Structure:**
```tsx
<Nivel1>
  <SectionHeader {...} />
  <LessonIntro lesson={1} />
  
  <h3>1.1 — Instalación</h3>
  <p>...</p>
  <CodeBlock lang="bash" title="..." code={`...`} />
  <CodeBlock lang="bash" title="..." code={`...`} />

  <h3>1.2 — Autenticación</h3>
  <p>...</p>
  <CodeBlock lang="bash" title="..." code={`...`} />
  <CodeBlock lang="bash" title="..." code={`...`} />
  <InfoBanner type="warn" text="..." />

  <h3>1.3 — Comandos esenciales</h3>
  <CommandTable commands={filteredCommands} />

  <h3>1.4 — Navegación</h3>
  <CodeBlock lang="text" title="..." code={`...`} />

  <LessonOutro lesson={1} />
</Nivel1>
```

---

## 5. NIVEL-4 Section Sample (Major Section)

```html
<section class="content-section" data-section="nivel-4" data-mode="technical">
    <div class="section-header">...</div>
    <div class="lesson-intro" data-lesson="4"></div>

    <!-- 4.0 — Commands -->
    <h3 class="block-title">4.0 — Comandos del Nivel 4</h3>
    <div class="commands-table-wrapper" id="commands-table-nivel-4"></div>

    <!-- 4.1 — MCP Server Development -->
    <h3 class="block-title">4.1 — MCP Server Development</h3>
    <p>Un <strong>MCP Server</strong> expone herramientas...</p>

    <h4>Estructura mínima de un MCP Server (Node.js)</h4>
    <div class="code-block" data-lang="bash" data-title="Scaffolding MCP Server">
        <pre><code>mkdir weather-mcp && cd weather-mcp
npm init -y
npm install @modelcontextprotocol/sdk
...</code></pre>
    </div>

    <h4>manifest.json — requerido para empaquetar</h4>
    <div class="code-block" data-lang="json" data-title="manifest.json">
        <pre><code>{
  "name": "weather-mcp",
  "version": "1.0.0",
  ...
}</code></pre>
    </div>

    <h4>Ciclo completo: init → pack → install</h4>
    <div class="code-block" data-lang="bash" data-title="Empaquetar y usar el MCP server">
        <pre><code>mcpb init
mcpb validate
npm run build
mcpb pack
claude mcp add weather ./weather-mcp-1.0.0.mcpb
claude mcp list</code></pre>
    </div>

    <div class="terminal-simulator" data-scenario="mcpBuild">
        <div class="terminal-header">
            <span class="terminal-dot dot-red"></span>
            <span class="terminal-dot dot-yellow"></span>
            <span class="terminal-dot dot-green"></span>
            <span class="terminal-title">MCP Build → Pack → Install</span>
        </div>
        <div class="terminal-body"></div>
        <button class="terminal-play">▶ Ejecutar demo</button>
    </div>

    <!-- 4.2 — Custom Skills & Hooks -->
    <h3 class="block-title">4.2 — Custom Skills con Hooks integrados</h3>
    <p>Las Skills avanzadas combinan...</p>

    <h4>SKILL.md avanzada con contexto de herramientas</h4>
    <div class="code-block" data-lang="markdown" data-title=".claude/skills/parallel-review/SKILL.md">
        <pre><code>---
name: parallel-review
description: Revisa PR con 3 agentes paralelos...
---
# Review Paralelo de PR
...</code></pre>
    </div>

    <h4>Hooks en settings.json para la Skill</h4>
    <div class="code-block" data-lang="json" data-title=".claude/settings.json">
        <pre><code>{
  "model": "claude-opus-4-7",
  "permissions": {...},
  "hooks": {...}
}</code></pre>
    </div>

    <!-- 4.3 — Parallel Agents -->
    <h3 class="block-title">4.3 — Agentes Paralelos (Sub-Agents)</h3>
    <!-- Similar structure -->

    <!-- 4.4 — Production Config -->
    <h3 class="block-title">4.4 — Configuración de Producción</h3>
    <!-- Similar structure -->

    <!-- 4.5 — Advanced Use Cases -->
    <h3 class="block-title">4.5 — Casos de Uso Avanzados</h3>
    <article class="flow-card" data-flow="multi-agent-audit">
        <!-- Flow card structure similar to flujos-dev -->
    </article>

    <div class="lesson-outro" data-lesson="4"></div>
</section>
```

**React Component Structure:**
```tsx
<Nivel4>
  <SectionHeader {...} />
  <LessonIntro lesson={4} />

  <h3>4.0 — Comandos</h3>
  <CommandTable commands={filteredCommands} />

  <h3>4.1 — MCP Server Development</h3>
  <p>...</p>
  <h4>Estructura mínima...</h4>
  <CodeBlock lang="bash" title="..." code={`...`} />
  <h4>manifest.json...</h4>
  <CodeBlock lang="json" title="..." code={`...`} />
  <h4>Ciclo completo...</h4>
  <CodeBlock lang="bash" title="..." code={`...`} />
  <TerminalSimulator scenario="mcpBuild" />

  <h3>4.2 — Custom Skills</h3>
  <p>...</p>
  <h4>SKILL.md avanzada...</h4>
  <CodeBlock lang="markdown" title="..." code={`...`} />
  <h4>Hooks en settings.json...</h4>
  <CodeBlock lang="json" title="..." code={`...`} />

  <h3>4.3 — Agentes Paralelos</h3>
  {/* Similar blocks */}

  <h3>4.4 — Configuración de Producción</h3>
  {/* Similar blocks */}

  <h3>4.5 — Casos de Uso Avanzados</h3>
  {flows.map(flow => <FlowCard key={flow.id} flow={flow} />)}

  <LessonOutro lesson={4} />
</Nivel4>
```

---

## 6. AGENTE-SDK Section Sample

```html
<section class="content-section" data-section="agente-sdk" data-mode="technical">
    <div class="section-header">
        <span class="breadcrumb">Profundización / Agent SDK</span>
        <h2>🤖 Claude Agent SDK <span style="font-size:0.6em;...">@anthropic-ai/claude-agent-sdk</span></h2>
        <p class="section-lead">El Agent SDK te permite construir agentes autónomos programáticamente...</p>
    </div>

    <h3 class="block-title">¿Por qué usar el SDK vs Claude Code directamente?</h3>
    <div class="comparison-grid">
        <div class="comparison-card">
            <h4>Claude Code CLI</h4>
            <ul class="bullet-list">
                <li>Sesiones interactivas en terminal</li>
                <li>Ideal para desarrollo diario del equipo</li>
                <li>Skills y hooks sin código</li>
                <li>El agente controla el flujo</li>
            </ul>
        </div>
        <div class="comparison-card comparison-card--accent">
            <h4>Agent SDK (programático)</h4>
            <ul class="bullet-list">
                <li>Integración en apps y servicios</li>
                <li>Control total del flujo y herramientas</li>
                <li>Multi-agente coordinado en código</li>
                <li>Ideal para productos y automatizaciones</li>
            </ul>
        </div>
    </div>

    <h3 class="block-title">SDK-1 — Instalación</h3>
    <div class="code-block" data-lang="bash" data-title="Instalación del SDK oficial">
        <pre><code>npm install @anthropic-ai/sdk
pip install anthropic
npm install @anthropic-ai/sdk @anthropic-ai/claude-code</code></pre>
    </div>

    <h3 class="block-title">SDK-2 — Agente básico con herramientas</h3>
    <p>Un agente que puede leer archivos y ejecutar comandos bash:</p>
    <div class="code-block" data-lang="bash" data-title="TypeScript — agente con tool_use" data-note="typescript">
        <pre><code>import Anthropic from '@anthropic-ai/sdk';
// ... full agent example
const response = await client.messages.create({...});</code></pre>
    </div>

    <!-- SDK-3 through SDK-6 with similar patterns -->
</section>
```

**React Component Structure:**
```tsx
<AgenteSDK>
  <SectionHeader {...} />

  <h3>¿Por qué usar el SDK?</h3>
  <ComparisonGrid items={[
    { title: "Claude Code CLI", features: [...] },
    { title: "Agent SDK (programático)", features: [...], accent: true }
  ]} />

  <h3>SDK-1 — Instalación</h3>
  <CodeBlock lang="bash" title="..." code={`...`} />

  <h3>SDK-2 — Agente básico</h3>
  <p>...</p>
  <CodeBlock lang="typescript" title="..." code={`...`} />

  {/* SDK-3 through SDK-6 */}
</AgenteSDK>
```

---

## 7. API-ANTHROPIC Section Sample

```html
<section class="content-section" data-section="api-anthropic" data-mode="technical">
    <div class="section-header">
        <span class="breadcrumb">Profundización / Anthropic API</span>
        <h2>⚡ Anthropic API — Guía Completa</h2>
        <p class="section-lead">La API de Anthropic expone toda la capacidad de Claude...</p>
    </div>

    <h3 class="block-title">API-1 — Selección de modelos</h3>
    <div class="models-grid">
        <div class="model-card model-card--opus">
            <div class="model-name">claude-opus-4-7</div>
            <div class="model-tier">Máxima capacidad</div>
            <ul class="model-features">
                <li>Razonamiento complejo y análisis</li>
                <li>Computer Use habilitado</li>
                <li>Modo "Fast" disponible</li>
                <li>200K tokens de contexto</li>
            </ul>
            <div class="model-use">Mejor para: auditorías críticas, diseño arquitectónico</div>
        </div>

        <div class="model-card model-card--sonnet">
            <div class="model-name">claude-sonnet-4-6</div>
            <div class="model-tier">Balance ideal</div>
            <ul class="model-features">
                <li>Alto rendimiento a menor costo</li>
                <li>Ideal para producción general</li>
                <li>Tool use optimizado</li>
                <li>200K tokens de contexto</li>
            </ul>
            <div class="model-use">Mejor para: APIs, chatbots, generación de código</div>
        </div>

        <div class="model-card model-card--haiku">
            <div class="model-name">claude-haiku-4-5-20251001</div>
            <div class="model-tier">Ultrarrápido</div>
            <ul class="model-features">
                <li>Menor latencia disponible</li>
                <li>Costo mínimo por token</li>
                <li>Ideal para volumen alto</li>
                <li>200K tokens de contexto</li>
            </ul>
            <div class="model-use">Mejor para: clasificación, extracción, RAG</div>
        </div>
    </div>

    <h3 class="block-title">API-2 — Messages API (endpoint principal)</h3>
    <div class="code-block" data-lang="bash" data-title="cURL — llamada básica">
        <pre><code>curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  ...</code></pre>
    </div>

    <div class="code-block" data-lang="bash" data-title="TypeScript — Messages API completa">
        <pre><code>import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic({...});
const message = await client.messages.create({...});</code></pre>
    </div>

    <!-- API-3 through API-8 with similar patterns -->
</section>
```

**React Component Structure:**
```tsx
<ApiAnthropicGuide>
  <SectionHeader {...} />

  <h3>API-1 — Selección de modelos</h3>
  <ModelsGrid models={[
    { name: "claude-opus-4-7", tier: "Máxima capacidad", features: [...], ... },
    { name: "claude-sonnet-4-6", tier: "Balance ideal", features: [...], ... },
    { name: "claude-haiku-4-5-20251001", tier: "Ultrarrápido", features: [...], ... }
  ]} />

  <h3>API-2 — Messages API</h3>
  <CodeBlock lang="bash" title="cURL — llamada básica" code={`...`} />
  <CodeBlock lang="typescript" title="TypeScript — Messages API completa" code={`...`} />

  {/* API-3 through API-8 */}
</ApiAnthropicGuide>
```

---

## 8. CI-CD Section Sample

```html
<section class="content-section" data-section="ci-cd" data-mode="technical">
    <div class="section-header">...</div>

    <h3 class="block-title">CI-1 — Modo headless básico</h3>
    <p>El flag <code>-p</code> (prompt) activa el modo no-interactivo...</p>
    <div class="code-block" data-lang="bash" data-title="Modo headless — flags esenciales">
        <pre><code>claude -p "Revisa si este código tiene vulnerabilidades" < src/api.ts
claude -p "..." --output-format json
claude -p "..." --output-format stream-json
claude -p "..." --dangerously-skip-permissions
ANTHROPIC_API_KEY=$SECRET claude -p "Audita el PR" --output-format json</code></pre>
    </div>

    <h3 class="block-title">CI-2 — GitHub Actions: revisión automática de PRs</h3>
    <div class="code-block" data-lang="bash" data-title=".github/workflows/claude-review.yml">
        <pre><code>name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  code-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run Code Review
        id: review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          DIFF=$(git diff origin/${{ github.base_ref }}...HEAD)
          REVIEW=$(echo "$DIFF" | claude -p \
            "Revisa este diff..." \
            --output-format json \
            --dangerously-skip-permissions)
          echo "review=$REVIEW" >> $GITHUB_OUTPUT

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            const review = JSON.parse('${{ steps.review.outputs.review }}');
            const body = `## 🤖 Claude Code Review\n...`;
            await github.rest.issues.createComment({...})</code></pre>
    </div>

    <!-- CI-3, CI-4, CI-5 with similar patterns -->
</section>
```

**React Component Structure:**
```tsx
<CICD>
  <SectionHeader {...} />

  <h3>CI-1 — Modo headless básico</h3>
  <p>...</p>
  <CodeBlock lang="bash" title="..." code={`...`} />

  <h3>CI-2 — GitHub Actions: revisión automática de PRs</h3>
  <CodeBlock lang="yaml" title=".github/workflows/claude-review.yml" code={`...`} />

  {/* CI-3, CI-4, CI-5 */}
</CICD>
```

---

## 9. CHEATSHEET Section Sample (Tables Only)

```html
<section class="content-section" data-section="cheatsheet" data-mode="technical">
    <div class="section-header">
        <span class="breadcrumb">Referencia / Cheat Sheet</span>
        <h2>📋 Cheat Sheet — Referencia Rápida</h2>
        <p class="section-lead">Imprime esta página o consérvala abierta mientras trabajas...</p>
    </div>

    <h3 class="block-title">Comandos por Nivel</h3>
    <table class="reference-table">
        <thead>
            <tr>
                <th>Comando</th>
                <th>Nivel</th>
                <th>Uso</th>
                <th>Ejemplo</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><code>/help</code></td>
                <td>1</td>
                <td>Ver ayuda completa</td>
                <td><code>/help</code></td>
            </tr>
            <tr>
                <td><code>/init</code></td>
                <td>1</td>
                <td>Generar CLAUDE.md</td>
                <td><code>/init</code></td>
            </tr>
            <!-- many more rows -->
        </tbody>
    </table>

    <h3 class="block-title">Conceptos Clave</h3>
    <table class="reference-table">
        <!-- Similar structure -->
    </table>

    <!-- 7 more reference tables -->
</section>
```

**React Component Structure:**
```tsx
<Cheatsheet>
  <SectionHeader {...} />

  {sections.map(section => (
    <div key={section.id}>
      <h3>{section.title}</h3>
      <ReferenceTable 
        columns={section.columns}
        rows={section.rows}
      />
    </div>
  ))}
</Cheatsheet>
```

---

## CSS Classes Used (for Component Styling)

### Layout & Structure
- `.content-section` — Main section container
- `.section-header` — Header with breadcrumb, title, lead
- `.block-title` — H3 subsection titles
- `.card-grid` — Grid of cards
- `.stats-grid` — Grid of stat cards
- `.roadmap` — Roadmap container

### Card Variants
- `.path-card`, `.stat-card`, `.flow-card`, `.course-tip-card`, `.skill-card`, `.resource-card`
- `.comparison-card`, `.model-card`, `.challenge-stat-card`

### Code & Content
- `.code-block` — Code container with optional title & language
- `.info-banner` — Callout boxes (--tip, --warn, --error variants)
- `.terminal-simulator` — Terminal UI wrapper
- `.flow-prompt` — Code block within flow steps
- `.flow-tip` — Inline tips

### Typography
- `.breadcrumb` — Navigation breadcrumb
- `.section-lead` — Lead paragraph
- `.level-tag` — Level badge (1, 2, 3, 4)
- `.roadmap-tag` — Difficulty tags (--easy, --medium, --hard)
- `.hero-stat-*` — Stats in hero sections

### Interactive
- `.terminal-play` — Play button for terminal simulators
- `.roadmap-cta` — Call-to-action links
- `.filter-btn` — Filter buttons in challenges
- `.nav-link` — Sidebar navigation links

---

## Data Attributes Used (for JS/React Routing)

- `data-section="section-id"` — Section identifier for routing
- `data-mode="technical|accessible|both"` — Content mode
- `data-jump="section-id"` — Link to jump to section
- `data-lesson="1-4"` — Lesson number for intro/outro
- `data-flow="flow-id"` — Flow identifier
- `data-module="1-7"` — Module number in roadmap
- `data-filter="category"` — Filter category for challenges
- `data-lang="bash|json|typescript|markdown|text"` — Language for code highlighting
- `data-title="..."` — Title for code blocks
- `data-scenario="scenarioName"` — Scenario identifier for terminal simulator

---

## Summary for React Migration

**Total unique CSS classes:** ~80  
**Data attributes used:** ~12  
**Component nesting depth:** 4-6 levels  
**Typical section structure:**
1. Section wrapper + data-section + data-mode
2. Section header (breadcrumb, h2, lead)
3. Content (cards, tables, code, text)
4. Interactive elements (buttons, forms, simulators)

**Conversion challenge level:** Medium-High
- Consistent structure makes conversion straightforward
- Large number of code blocks requires efficient component handling
- Terminal simulator needs animation logic
- Command/Challenge tables need dynamic rendering from data
