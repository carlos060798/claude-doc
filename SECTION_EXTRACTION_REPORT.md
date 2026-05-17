# HTML Content Sections Extraction Report

**Generated:** 2026-05-16  
**Source:** `c:\Users\usuario\claude doc\index.html` (5,439 lines, 275KB)  
**Total Sections:** 31

---

## Summary

The `index.html` is a data-driven SPA with clearly structured sections. Each section follows a consistent pattern:
1. `<section class="content-section" data-section="ID">`
2. `<div class="section-header">` (with h2, breadcrumb, lead)
3. Content blocks (cards, code, tables, lists)

All sections use semantic HTML with custom CSS classes for styling. The architecture is component-based and easy to convert to React.

---

## Full Section Directory

### PRIMARY LEARNING PATH (Main Content)

#### 1. **dashboard** (Line 183 | 5.2KB)
- **Purpose:** Entry point & learning path overview
- **Structure:**
  - `section-header` with breadcrumb "Inicio / Dashboard"
  - `stats-grid` (6 stat cards with metrics)
  - `card-grid` (6 path cards for learning levels)
  - `info-banner` (callout tip)
- **Key Elements:** 
  - Stat cards (rendered dynamically with JS IDs: `#stat-commands`, `#stat-cases`, `#stat-skills`)
  - Path cards (data-jump attributes for navigation)
- **React Components Needed:**
  - StatCard
  - PathCard
  - Banner
  
---

#### 2. **curso** (Line 274 | 14.5KB) - Course Interactive Guide
- **Purpose:** 7-module learning roadmap
- **Structure:**
  - `section-header` with H2 & lead
  - `course-hero` (hero stats + progress bar)
  - `.roadmap` (7 roadmap-module cards, each with)
    - `roadmap-marker` (01-07)
    - `roadmap-content` (h4, p, ul.roadmap-bullets, .roadmap-project, .roadmap-cta)
  - `course-tips-grid` (4 course-tip-cards)
  - `info-banner` (author advice)
- **Key Elements:**
  - Course progress bar (dynamic width with `#progress-fill`, `#progress-label`)
  - Roadmap modules with tags (easy/medium/hard)
  - Inline CTAs linking to sections
- **React Components Needed:**
  - CourseHero
  - RoadmapModule
  - CourseTipCard
  - ProgressBar

---

#### 3. **desafios** (Line 486 | 2.4KB) - Interactive Challenges
- **Purpose:** 25 progressive challenges for self-assessment
- **Structure:**
  - `section-header` with stats grid
  - `challenges-stats` (4 stat cards: correct, attempted, accuracy, reset button)
  - `challenges-filter` (7 filter buttons: all, basics, context, mcp, skills, sdk, security)
  - `#challenges-container` (empty, rendered by JS from CHALLENGES_DATA)
- **Key Elements:**
  - Stats dynamically updated via JS: `#challenges-correct`, `#challenges-attempted`, `#challenges-accuracy`
  - Filter buttons with `data-filter` attribute
  - Container for rendered challenges
- **React Components Needed:**
  - ChallengeStat
  - ChallengeFilter
  - ChallengeCard (rendered from CHALLENGES_DATA)

---

#### 4. **flujos-dev** (Line 531 | 35.3KB) - Real Development Workflows
- **Purpose:** 10 real-world developer scenarios with step-by-step prompts
- **Structure:**
  - `section-header`
  - `.flow-card` (repeated 10x, each with)
    - `flow-header` (flow-tag, h3, flow-context)
    - `flow-steps` (4-5 steps each)
      - `flow-step` (div with number, title, flow-prompt pre block, flow-tip)
    - `flow-pitfalls` (ul of common errors)
  - Articles tagged `data-flow="onboarding"`, `data-flow="tdd-feature"`, etc.
- **Key Elements:**
  - Nested step structure with flow-step-num, flow-step-body
  - `<pre class="flow-prompt">` blocks with example prompts
  - Interactive tips (.flow-tip elements)
- **React Components Needed:**
  - FlowCard
  - FlowStep
  - FlowPrompt
  - FlowTipBox
  - FlowPitfalls

---

#### 5. **nivel-1** (Line 1526 | 4.4KB) - Foundations Level
- **Purpose:** Installation, auth, essential commands, file navigation
- **Structure:**
  - `section-header`
  - H3 subsections: "1.1 — Instalación", "1.2 — Autenticación", "1.3 — Comandos", "1.4 — Navegación"
  - `.code-block` (with data-lang="bash", data-title attributes)
  - `#commands-table-nivel-1` (empty, rendered by JS)
  - `.lesson-intro` & `.lesson-outro` (data-lesson="1")
  - `.info-banner` callouts
- **Key Elements:**
  - Code blocks with syntax highlighting (data-lang, data-title)
  - Dynamic command table placeholder
  - Lesson intro/outro (rendered by JS)
- **React Components Needed:**
  - CodeBlock
  - LessonIntro/LessonOutro
  - CommandTable
  - InfoBanner

---

#### 6. **nivel-2** (Line 1622 | 6.5KB) - Advanced Level
- **Purpose:** Context mastery, MCP servers, tokens, memory
- **Structure:**
  - Similar to nivel-1: section-header, h3 subsections, code-blocks, command table, lesson sections
  - Subsections: "2.1 — /context & /usage", "2.2 — /compact", "2.3 — /memory", "2.4 — MCP Basics"
  - Multiple `.code-block` with language-specific examples
- **React Components:**
  - Same as nivel-1 + context-specific content

---

#### 7. **nivel-3** (Line 1766 | 7KB) - Expert Level
- **Purpose:** Skills, hooks, sub-agents, advanced MCP
- **Structure:**
  - section-header, h3 subsections, code-blocks, command table, lesson sections
  - Subsections: "3.1 — Skills & Hooks", "3.2 — Sub-Agentes", "3.3 — MCP Orquestación"
- **React Components:**
  - Same pattern as nivel-1 & nivel-2

---

#### 8. **nivel-4** (Line 2095 | 28.5KB) - Practical Mastery
- **Purpose:** Production-ready systems (MCP packaging, skills, hooks, agents)
- **Structure:**
  - `section-header`
  - `lesson-intro` (data-lesson="4")
  - H3 "4.0 — Comandos del Nivel 4" (command table)
  - **4.1 — MCP Server Development:**
    - Multiple code-block sections (TypeScript, JSON, bash)
    - Manifest examples
    - `.terminal-simulator` with data-scenario="mcpBuild"
  - **4.2 — Custom Skills con Hooks:**
    - SKILL.md example (code-block data-lang="markdown")
    - settings.json hooks example
  - **4.3 — Agentes Paralelos:**
    - Code examples for multi-agent orchestration
  - **4.4 — Configuración de Producción:**
    - Deployment examples, best practices
  - **4.5 — Casos de Uso Avanzados:**
    - Multiple `.flow-card` similar to flujos-dev
- **Key Elements:**
  - Large terminal simulator for visual demos
  - Complex nested code-blocks with multiple languages
  - 26 cards, 2 tables, extensive examples
- **React Components Needed:**
  - All from flujos-dev
  - TerminalSimulator
  - SkillCard
  - HooksConfiguration

---

### PROFUNDIZACIÓN (Deep Dives)

#### 9. **agente-sdk** (Line 2803 | 17.7KB) - Claude Agent SDK
- **Purpose:** Building autonomous agents programmatically
- **Structure:**
  - `section-header`
  - H3 "¿Por qué usar el SDK vs Claude Code directamente?"
    - `comparison-grid` (2 comparison-card elements)
  - H3 "SDK-1 — Instalación" through "SDK-6 — Multi-Agent Orchestration"
  - Multiple `.code-block` with TypeScript and Python examples
  - Each subsection has code examples + explanatory text
- **Key Elements:**
  - Comparison cards (CSS grid with bullet lists)
  - Language-specific code tabs/blocks
  - Integration examples
- **React Components Needed:**
  - CodeBlock
  - ComparisonCard
  - TabContainer (for lang-specific code)
  - LessonSection

---

#### 10. **api-anthropic** (Line 3251 | 15.4KB) - Anthropic API Guide
- **Purpose:** REST API reference for Messages, tool use, streaming, vision, batch
- **Structure:**
  - `section-header`
  - H3 "API-1 — Selección de modelos"
    - `models-grid` (3 model-card elements: opus, sonnet, haiku)
      - Each card has: model-name, model-tier, model-features (ul), model-use
  - H3 "API-2 — Messages API"
    - cURL example + TypeScript example (code-blocks)
  - H3 "API-3 — Tool Use"
    - Large TypeScript example with tool definitions
  - H3 "API-4 — Vision API"
  - H3 "API-5 — Streaming"
  - H3 "API-6 — Prompt Caching"
  - H3 "API-7 — Batch API"
  - H3 "API-8 — Model Selection Guide" (table)
- **Key Elements:**
  - Model cards with color-coded tiers (--opus, --sonnet, --haiku)
  - Table for model comparison
  - Multi-language code examples
  - Pricing/performance callouts
- **React Components Needed:**
  - ModelCard
  - CodeBlock
  - ComparisonTable
  - InfoBanner

---

#### 11. **skills-avanzados** (Line 3670 | 11.3KB) - Advanced Skills Templates
- **Purpose:** Production-ready skill templates for common tasks
- **Structure:**
  - `section-header`
  - Introduction paragraph
  - **Skill cards (7 templates):**
    - `/fork` — Clone & experiment with codebase
    - `/review` — Automated code review with parallel agents
    - `/test-cover` — Generate tests + coverage report
    - `/security-audit` — Security review
    - `/deploy` — Automated deployment + verification
    - `/team-onboarding` — Team-wide configuration
    - `/monitoring` — Observability & alerts
  - Each skill has: name, description, frontmatter block, usage example
  - Code-blocks showing skill configuration
- **Key Elements:**
  - Skill cards with icon/badge
  - SKILL.md examples
  - settings.json hooks
  - Command invocation examples
- **React Components Needed:**
  - SkillCard
  - FrontmatterBlock
  - CodeBlock

---

#### 12. **ci-cd** (Line 3942 | 11KB) - CI/CD & Headless Mode
- **Purpose:** Running Claude Code in automation (GitHub Actions, cron, pipelines)
- **Structure:**
  - `section-header`
  - H3 "CI-1 — Modo headless básico"
    - Code-block with headless flags (claude -p)
  - H3 "CI-2 — GitHub Actions: revisión automática de PRs"
    - YAML workflow file (code-block data-lang="bash")
  - H3 "CI-3 — GitHub Actions: seguridad en cada push"
    - Another YAML workflow
  - H3 "CI-4 — Cron jobs en producción"
  - H3 "CI-5 — Resultados y reportes"
  - Includes real-world examples with error handling, permissions, environment variables
- **Key Elements:**
  - GitHub Actions YAML examples
  - Bash scripts with env vars
  - Permission configuration
  - Output format options (JSON, stream-json)
- **React Components Needed:**
  - CodeBlock
  - WorkflowExample
  - PermissionTable

---

### REFERENCE & CHEATSHEETS

#### 13. **cheatsheet** (Line 1124 | 14.2KB) - Quick Reference
- **Purpose:** Condensed command/concept reference
- **Structure:**
  - Multiple sections with tables (8 total)
  - Tables include: Commands by Level, Contexts, MCP Concepts, Hooks, Security, etc.
  - Each table is `<table class="reference-table">` with thead/tbody
- **Key Elements:**
  - Multiple reference tables
  - Color-coded rows
  - Print-friendly layout
- **React Components Needed:**
  - ReferenceTable
  - TableBody/TableRow

---

#### 14. **capstone** (Line 1331 | 12.9KB) - Final Project
- **Purpose:** Capstone project for course completion
- **Structure:**
  - `section-header`
  - Project overview
  - 5-8 main deliverable sections
  - Each section outlines requirements, evaluation criteria, time estimate
  - Code examples and scaffolding
- **Key Elements:**
  - Project cards with completion criteria
  - Rubric sections
  - Time estimates
- **React Components Needed:**
  - ProjectCard
  - DeliverableSection
  - RubricItem

---

#### 15. **recursos** (Line 4487 | 4.2KB) - Resources & Links
- **Purpose:** External references, documentation links, tools
- **Structure:**
  - `section-header`
  - 8 resource cards in grid
  - Each card: title, description, link (href)
- **Key Elements:**
  - Link cards
  - Category badges
  - External resource icons
- **React Components Needed:**
  - ResourceCard
  - LinkGrid

---

### SUPPORTING SECTIONS

#### 16. **branching** (Line 4820 | 2.6KB) - Git Branching Patterns
#### 17. **rules** (Line 4858 | 2.6KB) - Rule Configuration
#### 18. **memory** (Line 4912 | 3.2KB) - Persistent Memory System
#### 19. **patrones** (Line 4960 | 3.4KB) - Code Patterns & Best Practices
#### 20. **memoria** (Line 1936 | 2.6KB) - Memory Management
#### 21. **seguridad** (Line 1985 | 4.8KB) - Security Best Practices
#### 22. **terminal** (Line 4443 | 2.6KB) - Terminal Simulator Guide

**Common Structure for Support Sections:**
- `section-header`
- 2-4 h3 subsections
- Small code examples or bullet lists
- Brief descriptions
- Links to related sections

---

### ADVANCED TOPICS

#### 23. **git-workflows** (Line 5046 | 7.8KB)
- **Structure:**
  - Workflow diagrams in ASCII/Mermaid
  - 4 workflow examples (team collaboration, feature branching, release, hotfix)
  - Code-block examples with git commands
  - Tables showing workflow steps

#### 24. **mcp-use-cases** (Line 5235 | 2.7KB)
- **Structure:**
  - 3 use-case cards
  - Code snippets showing MCP server usage
  - Integration examples

#### 25. **multi-mcp-orchestration** (Line 5366 | 3.2KB)
- **Structure:**
  - Orchestration patterns
  - Configuration examples
  - Parallel execution diagrams

#### 26. **hooks-production** (Line 5292 | 2.9KB)
- **Structure:**
  - Hook definition cards (5 types)
  - Configuration examples
  - Lifecycle diagrams

---

### ACCESSIBILITY MODE (Hidden by Default)

#### 27. **intro-acc** (Line 4561 | 6.3KB)
- **Purpose:** Accessible introduction mode for screen readers
- **Structure:**
  - Accessible navigation
  - Semantic HTML-heavy
  - Text alternatives for visual elements

#### 28. **casos-rol** (Line 4647 | 8.5KB)
- **Purpose:** Role-based learning paths
- **Structure:**
  - Role cards (frontend, backend, devops, etc.)
  - Each role has curated learning path
  - Progress tracking per role

#### 29. **glosario** (Line 4768 | 4.3KB)
- **Purpose:** Glossary of terms
- **Structure:**
  - Definition list (`<dl>`)
  - Terms with descriptions
  - Cross-references

---

### ADDITIONAL SECTIONS

#### 30. **casos-uso** (Line 2671 | 5.7KB)
- **Purpose:** Real-world use cases
- **Structure:**
  - 6 use-case cards
  - Each with: title, description, code example, time estimate

#### 31. **mejores-practicas** (Line 4243 | 11.1KB)
- **Purpose:** Best practices guide
- **Structure:**
  - 12 practice cards in grid
  - Each with: icon, title, description, code example
  - Divided into sections: Foundation, Context, MCP, Skills, Production

---

## Key HTML Patterns Used

### 1. Section Headers (Consistent Across All Sections)
```html
<section class="content-section" data-section="section-id" data-mode="technical">
    <div class="section-header">
        <span class="breadcrumb">Path / To / Section</span>
        <h2>Section Title with Icon</h2>
        <p class="section-lead">Lead paragraph describing the section...</p>
    </div>
    <!-- Content -->
</section>
```

### 2. Card Grids
```html
<div class="card-grid">
    <div class="card">
        <h3>Title</h3>
        <p>Description</p>
    </div>
</div>
```
- Variants: `path-card`, `stat-card`, `flow-card`, `skill-card`, `resource-card`

### 3. Code Blocks
```html
<div class="code-block" data-lang="bash|json|typescript" data-title="Optional Title">
    <pre><code><!-- code here --></code></pre>
</div>
```
- Auto-gets copy button via JS
- Syntax highlighting via data-lang attribute

### 4. Info Banners
```html
<div class="info-banner info-banner--tip|warn|error">
    <strong>Icon + Label:</strong> Message text with <code>inline code</code>
</div>
```

### 5. Tables
```html
<table class="reference-table|comparison-table">
    <thead>
        <tr><th>Header 1</th><th>Header 2</th></tr>
    </thead>
    <tbody>
        <tr><td>Data</td><td>Data</td></tr>
    </tbody>
</table>
```

### 6. Terminal Simulators
```html
<div class="terminal-simulator" data-scenario="scenarioName">
    <div class="terminal-header"><!-- ... --></div>
    <div class="terminal-body"></div>
    <button class="terminal-play">▶ Execute</button>
</div>
```
- Animated by JS based on SCENARIOS object

---

## Data Flow & Dynamic Elements

### Elements Rendered by JavaScript
1. **Command Tables:** `#commands-table-nivel-1`, etc. (from COMMANDS_DATA array)
2. **Challenge Container:** `#challenges-container` (from CHALLENGES_DATA array)
3. **Terminal Animations:** `.terminal-simulator` (from SCENARIOS object)
4. **Stats:** `#stat-commands`, `#stat-cases`, `#stat-skills` (calculated counts)
5. **Progress:** `#progress-fill`, `#progress-label` (from localStorage)

### Data Structures (in script.js)
- **COMMANDS_DATA:** Array of { cmd, level, category, desc, example }
- **SCENARIOS:** Object with terminal animations { type, text, delay }
- **CHALLENGES_DATA:** Array of interactive challenges with options
- **SYNTAX_RULES:** Regex patterns for code highlighting

---

## React Migration Strategy

### Component Hierarchy Recommended

```
<App>
  <Sidebar>
    <NavLink /> (x31)
  </Sidebar>
  <MainContent>
    <Dashboard />
    <Curso />
    <Desafios />
    <FlujosDev />
    <Nivel1 />
    <Nivel2 />
    <Nivel3 />
    <Nivel4 />
    <AgenteSDK />
    <ApiAnthropicGuide />
    <SkillsAvanzados />
    <CICD />
    <Cheatsheet />
    <Capstone />
    <CasosUso />
    <MejoresPracticas />
    <GitWorkflows />
    <MCPUseCases />
    <HooksProduction />
    <MultiMCPOrchestration />
    <!-- ... more -->
  </MainContent>
</App>
```

### Base Components to Create
1. **SectionHeader** — Breadcrumb, h2, lead
2. **CodeBlock** — With copy button & syntax highlighting
3. **Card** — Generic card container (path, stat, skill, resource variants)
4. **InfoBanner** — Contextual alerts/tips
5. **Table** — Reference & comparison tables
6. **TerminalSimulator** — Animated terminal demos
7. **CommandTable** — Dynamic tables from COMMANDS_DATA
8. **FlowStep** — Multi-step procedures with prompts
9. **ComparisonGrid** — Side-by-side comparisons

### State Management Needed
- **localStorage:** Progress tracking, challenge answers, completed sections
- **URL/Router:** Navigation between sections
- **Search:** Real-time command search from COMMANDS_DATA
- **Terminal Animations:** Interval-based updates for typing effects

---

## Files & Asset Paths

**Main HTML:** `c:\Users\usuario\claude doc\index.html`
**CSS:** (Embedded in HTML)
**JavaScript:** (Embedded in HTML, includes script.js content)

Related files in the repo:
- **CLAUDE.md** — Project documentation (referenced in sections)
- **lib/commandsData.js** — Commands database (if extracted)
- **app/** — Next.js app files (from git status, possibly for future build)

---

## Summary for Conversion

**Total Sections:** 31  
**Total Content Size:** ~280KB  
**Largest Sections:**
1. flujos-dev (35.3KB) — 10 workflow cards
2. nivel-4 (28.5KB) — 4 major subsections, 26 cards
3. curso (14.5KB) — 7 module roadmap
4. cheatsheet (14.2KB) — 9 reference tables

**Estimated React Component Count:** 40-50 unique components  
**Estimated Lines of Code (React):** 3,000-4,500 lines

**Conversion Complexity:** Medium
- Most sections are content-heavy, not complex logic
- Key challenges: Terminal simulators, dynamic data tables, search functionality
- Opportunity to improve: Extract data (COMMANDS_DATA, CHALLENGES_DATA) to JSON files
