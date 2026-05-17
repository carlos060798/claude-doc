# Índice de Temas Cubiertos

Referencia completa de todos los temas tratados en las 4 secciones de contenido práctico.

---

## 📂 SECCIÓN 1: Real-World Git Workflows

### Flujo A: Trunk-Based Development
- Cuándo usar (equipos 2-8, ciclos cortos)
- Workflow típico (branch corta, commits atómicos, PR, merge)
- Ventajas (integración continua, deploy seguro, feedback rápido)
- Desventajas (CI/CD sólido necesario, tests confiables, presión merge)
- Commits reales del repo como ejemplo
- Checklist pre-merge

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 1.1)

---

### Flujo B: Gitflow (Feature Branches + Release)
- Estructura de branches (master, develop, feature/*, release/*, hotfix/*)
- Workflow completo (feature → develop → release → master)
- Code freeze y QA process
- Tagging y versionamiento
- Hotfix para bugs urgentes
- Merge back a develop

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 1.1)
- COPY_PASTE_CHECKLISTS.md (Workflow Gitflow Completo)

---

### Flujo C: Git Worktrees
- Paralelismo sin "git checkout"
- Setup manual vs automático (claude --worktree)
- Directorio aislado por rama
- Workflow paralelo (2-3 features en paralelo)
- Cleanup (git worktree remove)

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 1.1)
- COPY_PASTE_CHECKLISTS.md (Git Workflows — Snippets)

---

### Tabla Comparativa
- Trunk vs Gitflow vs Worktrees
- Dimensiones: complejidad, integración, conflicts, release cycle, equipo ideal, CI/CD req, hotfix flow

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Tabla 1.2)

---

### Comandos Copy-Paste Listos
1. **Merge safety checks (pre-flight)**
   - Check 1-5: master sync, commits, tests, build, diffs
   - Localización: COPY_PASTE_CHECKLISTS.md (Merge Safety Pre-Flight)

2. **Rebase limpio (squash commits)**
   - git rebase -i, pick/squash, force-with-lease
   - Localización: COPY_PASTE_CHECKLISTS.md (Rebase Limpio)

3. **Workflow Gitflow completo**
   - Crear release branch, bump version, tag, merge a master, merge back
   - Localización: COPY_PASTE_CHECKLISTS.md (Workflow Gitflow Completo)

4. **Iniciar worktree con Claude Code**
   - claude --worktree, sesión aislada, parallelismo
   - Localización: CONTENIDO_PRACTICO_NIVEL4.md (Sección 1.3)

---

## 🔗 SECCIÓN 2: MCP Servers by Use Case

### GitHub MCP
- Qué es y por qué (PR reviews, issue creation, code diff)
- Configuración JSON (.mcp.json)
- Configuración CLI (user scope / project scope)
- Comandos en sesión (PR list, create issue, code review, merge)
- Tokens y credenciales (GITHUB_PERSONAL_ACCESS_TOKEN)

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 2.1)
- COPY_PASTE_CHECKLISTS.md (.mcp.json example, CLI setup)

---

### PostgreSQL MCP
- Qué es y por qué (queries, debugging, schema analysis)
- Setup local vs remoto (con SSL)
- Comandos (explorar tables, ejecutar queries, export CSV)
- Debugging en producción (queries lentas, missing indexes)
- DATABASE_URL configuration

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 2.2)
- COPY_PASTE_CHECKLISTS.md (.mcp.json example, CLI setup)

---

### Slack MCP
- Qué es y por qué (notifications, audit trail, team alerts)
- Setup (API app creation, OAuth, bot token)
- Comandos (post message, post file, search history)
- Integration con workflows
- SLACK_BOT_TOKEN + SLACK_SIGNING_SECRET

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 2.3)
- COPY_PASTE_CHECKLISTS.md (.mcp.json example, CLI setup)

---

### MCPs Populares (Tabla)
- GitHub, PostgreSQL, Slack, Docker, AWS
- Uso, setup, scope (user/project)

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Tabla 2.1)

---

### Configuración Copy-Paste
1. **.mcp.json (3 MCPs)**
   - GitHub, PostgreSQL, Slack configurados
   - Localización: COPY_PASTE_CHECKLISTS.md

2. **CLI Setup Commands**
   - claude mcp add --scope user/project
   - Localización: COPY_PASTE_CHECKLISTS.md

3. **Env Vars Setup**
   - GITHUB_TOKEN, DATABASE_URL, SLACK_BOT_TOKEN
   - Localización: COPY_PASTE_CHECKLISTS.md

---

### Conexión Paso-a-Paso
1. Setup en .mcp.json o CLI
2. Verificar con claude /mcp
3. Usar en sesión automáticamente

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 2.4)

---

## 🎣 SECCIÓN 3: Hooks in Production

### Hook 1: Security Audit (PreToolUse)
- Bloquea comandos peligrosos (rm -rf, eval, curl|sh, sudo)
- Detecta credenciales (password=, token=, secret=)
- Confirma acciones destructivas (DELETE, DROP, TRUNCATE)
- Configurable con regex patterns
- Action: block, confirm, warn

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 3.1)
- COPY_PASTE_CHECKLISTS.md (Hook 1 en settings.json)

---

### Hook 2: Auto-Format + Tests (PostToolUse)
- Ejecuta npm run format automáticamente
- Ejecuta npm run lint
- Ejecuta npm test con --watch=false
- Sequence: formato → lint → tests
- onError: warn (formato/lint) vs abort (tests)

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 3.2)
- COPY_PASTE_CHECKLISTS.md (Hook 2 en settings.json)

---

### Hook 3: Context Injection (UserPromptSubmit)
- Inyecta git status automáticamente
- Inyecta git log (últimos commits)
- Inyecta memory context (sesión anterior)
- Enriquece prompts con contexto relevante

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 3.3)
- COPY_PASTE_CHECKLISTS.md (Hook 3 en settings.json)

---

### Hook 4: Cost Warning (PreToolUse)
- Advierte sobre archivos grandes (>10MB)
- Advierte sobre bulk operations (100+ API calls)
- Advierte sobre queries sin LIMIT
- Estima tokens y costo
- Action: warn, confirm

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 3.4)
- COPY_PASTE_CHECKLISTS.md (Hook 4 en settings.json)

---

### Hook 5: Performance Monitoring (PostToolUse)
- Registra duration de cada tool call
- Registra tokens usados
- Registra errores
- Log file: ~/.claude/performance.log
- Alerts en threshold (>60s, >5000 tokens)

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 3.5)
- COPY_PASTE_CHECKLISTS.md (Hook 5 en settings.json)

---

### Setup Completo (Copy-Paste)
- Archivo ~/.claude/settings.json con todos los hooks
- Per-project .claude/settings.json
- Configuración paso-a-paso

**Localización**:
- COPY_PASTE_CHECKLISTS.md (Complete Hook Setup)

---

## 🎼 SECCIÓN 4: Multi-MCP Orchestration

### Patrón 1: Fork-Join
- Ejecuta múltiples MCPs en paralelo
- /fork para bifurcar sesión
- Agregar resultados en main session
- Ideal para análisis multi-fuente
- Diagrama: main → fork1, fork2 → aggregate

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 4.1)

---

### Patrón 2: Cascading Validation
- Validaciones secuenciales
- Cada paso solo si anterior pasó
- set -e en bash (fail on error)
- Pasos: lint → security → tests → build
- Ideal para CI pipelines

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 4.2)
- COPY_PASTE_CHECKLISTS.md (SKILL: ci-validation)

---

### Ejemplo Completo: Parallel PR Review (3 Agentes)
- PR #247 analizado por 3 sesiones:
  - **Code Reviewer**: Code quality, DRY, testing
  - **Security Auditor**: Hardcoded secrets, SQL injection, CVEs
  - **Data Analyzer**: Schema changes, performance, migrations
- Consolidar results en main session
- GitHub review automático + issue creation

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Sección 4.3)
- COPY_PASTE_CHECKLISTS.md (SKILL: parallel-pr-review)

---

### Recomendaciones por Escala
- **1 developer**: Trunk-based + worktrees + GitHub
- **2-5 people**: Trunk-based + forks + GitHub + Slack
- **5-15 people**: Gitflow + cascading CI + parallel review + (GitHub + PostgreSQL + Slack)
- **15+ people**: Multi-repo + orchestration avanzado + custom MCPs

**Localización**:
- CONTENIDO_PRACTICO_NIVEL4.md (Tabla 4.1)
- RESUMEN_EJECUTIVO.md (Sección correspondiente)

---

## 🎯 SKILL Templates

### skill-parallel-pr-review
- Analiza PR con 3 agentes en paralelo
- GitHub MCP + (optional PostgreSQL)
- Output: consolidar scores + recomendaciones
- Localización: COPY_PASTE_CHECKLISTS.md

---

### skill-ci-validation
- Cascading validation pipeline
- Lint → Format → Security → Tests → Build
- Bash script con set -e
- Localización: COPY_PASTE_CHECKLISTS.md

---

### skill-morning-brief
- Resumen diario (PRs, issues, memory, recomendación)
- Git status + GitHub CLI + memory
- Output: 5-10 líneas con plan del día
- Localización: COPY_PASTE_CHECKLISTS.md

---

## 📊 Comandos Indexados

### Git Comandos
- git worktree add
- git worktree list
- git worktree remove
- git rebase -i
- git merge --no-ff
- git push --force-with-lease
- git log
- git status

**Dónde**: COPY_PASTE_CHECKLISTS.md (Git Workflows section)

---

### Claude Code Comandos
- claude --worktree
- claude /mcp
- /fork
- /memory
- /permissions
- /btw

**Dónde**: CONTENIDO_PRACTICO_NIVEL4.md (en ejemplos)

---

### MCP CLI
- claude mcp add --scope user
- claude mcp add --scope project
- claude mcp list
- claude mcp get

**Dónde**: COPY_PASTE_CHECKLISTS.md (MCP Setup section)

---

### NPM Comandos
- npm test
- npm run format
- npm run lint
- npm run build
- npm audit

**Dónde**: COPY_PASTE_CHECKLISTS.md (en scripts)

---

### GitHub CLI
- gh pr view
- gh pr list
- gh pr review
- gh issue create
- gh issue list

**Dónde**: COPY_PASTE_CHECKLISTS.md (SKILL templates)

---

## 📚 Referencias Externas

### Documentación Oficial
- Claude Code Docs
- MCP Servers Registry
- Agent SDK Docs
- GitHub API

**Dónde**: CONTENIDO_PRACTICO_NIVEL4.md (Sección Recursos)

---

### Tools Mencionados
- Git (version control)
- GitHub CLI (gh)
- npm (package manager)
- Slack API
- PostgreSQL

**Dónde**: Distribuido en todas las secciones

---

## ✅ Mapeo Rápido: Tema → Archivo

| Tema | Archivo Principal | Archivo Secundario |
|------|-------------------|-------------------|
| Git Workflows | CONTENIDO (1.1-1.3) | COPY_PASTE (Workflows) |
| Trunk-Based | CONTENIDO (1.1) | COPY_PASTE (Merge checks) |
| Gitflow | CONTENIDO (1.1) | COPY_PASTE (Release script) |
| Worktrees | CONTENIDO (1.1) | COPY_PASTE (Workflows) |
| GitHub MCP | CONTENIDO (2.1) | COPY_PASTE (CLI setup) |
| PostgreSQL MCP | CONTENIDO (2.2) | COPY_PASTE (.mcp.json) |
| Slack MCP | CONTENIDO (2.3) | COPY_PASTE (Setup) |
| Security Hook | CONTENIDO (3.1) | COPY_PASTE (settings.json) |
| Format Hook | CONTENIDO (3.2) | COPY_PASTE (settings.json) |
| Context Hook | CONTENIDO (3.3) | COPY_PASTE (settings.json) |
| Cost Warning | CONTENIDO (3.4) | COPY_PASTE (settings.json) |
| Perf Monitor | CONTENIDO (3.5) | COPY_PASTE (settings.json) |
| Fork-Join | CONTENIDO (4.1) | COPY_PASTE (SKILL templates) |
| Cascading | CONTENIDO (4.2) | COPY_PASTE (SKILL ci-validation) |
| PR Review | CONTENIDO (4.3) | COPY_PASTE (SKILL pr-review) |
| Morning Brief | — | COPY_PASTE (SKILL morning-brief) |

---

## 🎓 Secuencia de Aprendizaje Recomendada

### Paso 1: Entender Workflows (1 hora)
- Leer: CONTENIDO_PRACTICO_NIVEL4.md (Sección 1)
- Decidir: Cuál flujo es mejor para tu equipo

### Paso 2: Configurar MCPs (1 hora)
- Leer: CONTENIDO_PRACTICO_NIVEL4.md (Sección 2)
- Setup: COPY_PASTE_CHECKLISTS.md (.mcp.json)
- Test: claude /mcp para verificar

### Paso 3: Implementar Hooks (30 min)
- Leer: CONTENIDO_PRACTICO_NIVEL4.md (Sección 3)
- Setup: COPY_PASTE_CHECKLISTS.md (settings.json)
- Test: Intenta comando peligroso (debe bloquearse)

### Paso 4: Orquestar MCPs (1 hora)
- Leer: CONTENIDO_PRACTICO_NIVEL4.md (Sección 4)
- Implementar: COPY_PASTE_CHECKLISTS.md (SKILL templates)
- Practica: /parallel-pr-review en PR real

### Tiempo Total: ~3.5 horas (aprendizaje + hands-on)

---

## 🔍 Búsqueda Rápida

**Busco cómo**: Usar `Ctrl+F` en tu editor con:

| Pregunta | Buscar en | Término |
|----------|----------|---------|
| Cómo hacer merge seguro | COPY_PASTE | "merge safety" |
| Cómo configurar GitHub MCP | COPY_PASTE | ".mcp.json" |
| Cómo bloquear comandos peligrosos | COPY_PASTE | "PreToolUse" |
| Cómo hacer parallel review | COPY_PASTE | "parallel-pr-review" |
| Cómo elegir workflow | CONTENIDO | "Tabla Comparativa" |
| Cómo ejecutar tests automáticos | CONTENIDO | "PostToolUse" |

---

## 📝 Licencia & Uso

Todos los contenidos:
- ✅ Open para uso interno
- ✅ Libre para adaptar
- ✅ Libre para redistribuir (con atribución)
- ✅ Basado en best practices industry

---

**FIN DEL ÍNDICE**

Para cualquier duda, localiza el tema arriba y sigue el "Localización" para el archivo correcto.
