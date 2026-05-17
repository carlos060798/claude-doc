# Copy-Paste Checklists & Code Snippets

Todos los comandos, configuraciones y scripts que necesitas. Copy-paste directamente en terminal o archivo.

---

## SECCIÓN 1: Git Workflows — Snippets

### Checklist: Merge Safety Pre-Flight

**Copia y pega antes de hacer merge a master:**

```bash
#!/bin/bash
set -e

echo "🔍 Pre-Merge Safety Checks"
echo "=========================="

# Check 1: Master actualizado
echo "[1/5] Sincronizando master..."
git checkout master
git pull origin master

# Check 2: Mi rama contiene todos mis cambios
echo "[2/5] Verificando que rama tiene cambios..."
COMMITS=$(git log origin/master..HEAD | wc -l)
if [ "$COMMITS" -eq 0 ]; then
  echo "❌ Tu rama no tiene commits nuevos. ¿Estás en la rama correcta?"
  exit 1
fi
echo "✓ $COMMITS commits encontrados"

# Check 3: Tests pasando
echo "[3/5] Corriendo tests..."
npm test -- --watch=false || {
  echo "❌ Tests fallan. Arregla antes de merge."
  exit 1
}
echo "✓ Tests passed"

# Check 4: Build OK
echo "[4/5] Chequeando build..."
npm run build || {
  echo "❌ Build falla. Arregla antes de merge."
  exit 1
}
echo "✓ Build success"

# Check 5: Ver cambios finales
echo "[5/5] Cambios a mergear:"
git diff --stat master..HEAD

echo ""
echo "✅ Todos los checks pasaron"
echo "Siguiente: git merge --no-ff feature/mi-rama"
```

**Cómo usar:**
```bash
# 1. Guarda el script
cat > /tmp/pre-merge-check.sh << 'EOF'
[pega el script arriba]
EOF

# 2. Ejecuta
bash /tmp/pre-merge-check.sh

# 3. Si todo OK:
git merge --no-ff feature/mi-rama
git push origin master
```

---

### Snippet: Rebase Limpio (Squash Commits)

Si hiciste 15 commits pero quieres 1 limpio:

```bash
# Rebase interactivo
git rebase -i origin/master

# En el editor, cambia:
# pick abc123 primeiro commit
# squash def456 segundo commit
# squash ghi789 tercero
# ... (squash el resto)

# Salva y edita el commit message

# Force-push (OK porque es tu rama)
git push --force-with-lease origin feature/mi-rama
```

---

### Snippet: Workflow Gitflow Completo (Release)

Copia y adapta para tu versión:

```bash
#!/bin/bash
set -e

VERSION="2.5.0"  # CAMBIA ESTO

echo "🚀 Gitflow Release: $VERSION"

# STEP 1: Feature branches → develop
echo "Step 1: Merging features to develop..."
git checkout develop
git pull origin develop

# STEP 2: Code freeze
echo "Step 2: Creating release branch..."
git checkout -b release/$VERSION develop

# STEP 3: Bump version
echo "Step 3: Bumping version..."
npm version $VERSION --no-git-tag-version
# Edita CHANGELOG.md manualmente
git commit -am "chore: bump to v$VERSION"

# STEP 4: Final QA
echo "Step 4: Running final tests..."
npm test -- --watch=false
npm run build
echo "✓ QA passed"

# STEP 5: Tag y merge a master
echo "Step 5: Tagging and merging to master..."
git checkout master
git pull origin master
git merge --no-ff release/$VERSION
git tag -a v$VERSION -m "Release $VERSION"
git push origin master
git push origin v$VERSION

# STEP 6: Merge back a develop
echo "Step 6: Merging back to develop..."
git checkout develop
git merge --no-ff master
git push origin develop

# CLEANUP
echo "Step 7: Cleaning up..."
git branch -d release/$VERSION
git push origin --delete release/$VERSION

echo "✅ Release complete: v$VERSION"
```

---

## SECCIÓN 2: MCP Setup — Configuration Files

### .mcp.json: GitHub + PostgreSQL + Slack

**Copia esto a la raíz de tu proyecto como `.mcp.json`:**

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "slack": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_SIGNING_SECRET": "${SLACK_SIGNING_SECRET}"
      }
    }
  }
}
```

**Setup de variables de entorno:**

```bash
# En ~/.bashrc o ~/.zshrc, agrega:
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxx"
export DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"
export SLACK_BOT_TOKEN="xoxb-xxxxx"
export SLACK_SIGNING_SECRET="xxxxx"
```

**Verificar conexión:**

```bash
claude /mcp
# Debe mostrar: github, postgres, slack connected
```

---

### CLI: Agregar MCPs a User Scope (Global)

Copia y ejecuta en terminal:

```bash
# GitHub (user scope)
echo "Adding GitHub MCP..."
claude mcp add --scope user github \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token) \
  -- npx -y @modelcontextprotocol/server-github

# PostgreSQL (project scope)
echo "Adding PostgreSQL MCP..."
claude mcp add --scope project postgres \
  -e DATABASE_URL=postgresql://localhost:5432/mydb \
  -- npx -y @modelcontextprotocol/server-postgres

# Slack (user scope)
echo "Adding Slack MCP..."
claude mcp add --scope user slack \
  -e SLACK_BOT_TOKEN=xoxb-xxxxx \
  -e SLACK_SIGNING_SECRET=xxxxx \
  -- npx -y @modelcontextprotocol/server-slack

echo "✓ MCPs added. Verify with: claude /mcp"
```

---

## SECCIÓN 3: Hooks — Configuration

### ~/.claude/settings.json: Complete Hook Setup

**Copia esto completo a tu archivo de configuración:**

```json
{
  "version": "1.0",
  "hooks": {
    "PreToolUse": {
      "enabled": true,
      "rules": [
        {
          "id": "block-dangerous-commands",
          "pattern": "(rm -rf|eval|curl.*sh|sudo.*rm)",
          "action": "block",
          "message": "❌ Comando peligroso detectado. Esta acción está bloqueada por seguridad."
        },
        {
          "id": "block-credentials-exposure",
          "pattern": "(password|token|secret|API_KEY|AWS_SECRET|DATABASE_PASSWORD)\\s*[=:]",
          "action": "block",
          "message": "❌ Detectado intento de exponer credenciales. No permitido. Usa env vars."
        },
        {
          "id": "confirm-database-destructive",
          "pattern": "^(DELETE|DROP|TRUNCATE|TRUNCATE TABLE)",
          "action": "confirm",
          "message": "⚠️ Operación destructiva detectada. ¿Confirmas que quieres DELETE/DROP/TRUNCATE?"
        },
        {
          "id": "warn-large-file-read",
          "pattern": "@.*(\\.log|\\.db|\\.backup|\\.sql)",
          "action": "warn",
          "message": "⚠️ Archivo potencialmente grande. Costo en tokens puede ser alto. ¿Continúo?"
        }
      ]
    },
    "PostToolUse": {
      "enabled": true,
      "sequence": [
        {
          "id": "format-code",
          "name": "Format code with Prettier",
          "command": "npm run format 2>/dev/null || echo 'Prettier not configured'",
          "onSuccess": "continue",
          "onError": "warn"
        },
        {
          "id": "lint-check",
          "name": "Lint check with ESLint",
          "command": "npm run lint 2>/dev/null || echo 'ESLint not configured'",
          "onSuccess": "continue",
          "onError": "warn"
        },
        {
          "id": "run-tests",
          "name": "Run tests",
          "command": "npm test -- --watch=false --passWithNoTests 2>/dev/null || echo 'Tests not configured'",
          "onSuccess": "continue",
          "onError": "abort"
        }
      ]
    },
    "UserPromptSubmit": {
      "enabled": true,
      "injections": [
        {
          "id": "git-status",
          "name": "Current Git Status",
          "command": "git status -s 2>/dev/null || echo 'Not a git repo'",
          "inject": true,
          "label": "Git Status"
        },
        {
          "id": "branch-info",
          "name": "Current Branch & Recent Commits",
          "command": "git log --oneline -5 2>/dev/null || echo 'Not a git repo'",
          "inject": true,
          "label": "Recent Commits"
        },
        {
          "id": "memory-context",
          "name": "Session Memory",
          "command": "test -f ~/.claude/memory && head -20 ~/.claude/memory || echo 'No memory'",
          "inject": true,
          "label": "Memory"
        }
      ]
    }
  }
}
```

**Instalar:**
```bash
# 1. Copia el JSON arriba
# 2. Guarda en ~/.claude/settings.json
cp settings.json ~/.claude/settings.json

# 3. Verifica
cat ~/.claude/settings.json | grep -c "hooks"
# Debe mostrar: 3 (uno para cada hook type)
```

---

### Per-Project Hooks (.claude/settings.json)

Para hooks específicos de un proyecto, guarda en `.claude/settings.json` en raíz:

```json
{
  "hooks": {
    "PreToolUse": {
      "enabled": true,
      "rules": [
        {
          "id": "block-deploy-without-tests",
          "pattern": "(npm run deploy|npm run prod|git push.*main)",
          "action": "confirm",
          "message": "⚠️ Deploy detectado. ¿Tests pasaron? Confirma que quieres hacer push a main."
        }
      ]
    }
  }
}
```

---

## SECCIÓN 4: Orchestration — SKILL Templates

### SKILL: Parallel PR Review (3 Agents)

**Guarda en `~/.claude/skills/parallel-pr-review/SKILL.md`:**

```markdown
# Parallel PR Review: Code + Security + Data

Analiza un PR en paralelo con 3 agentes.

## Prerequisites
- GitHub MCP conectado
- PostgreSQL MCP conectado (opcional)
- PR número como argumento

## Main Orchestrator

/mcp github

Obtén PR info:
```bash
PR_NUM="${1:-247}"
gh pr view $PR_NUM --json \
  title,body,changedFiles,commits,reviews
```

## Fork 1: Code Reviewer

/fork code_reviewer
  Mensaje: "Review PR #$PR_NUM line-by-line. Analiza: complejidad, naming, DRY, testing."

## Fork 2: Security Auditor

/fork security_auditor
  Mensaje: "Security audit PR #$PR_NUM. Chequea: hardcoded secrets, SQL injection, XSS, dependency CVEs."

## Fork 3: Data Impact Analyzer

/fork data_analyzer
  Mensaje: "Database impact analysis PR #$PR_NUM. Usa PostgreSQL MCP para: schema changes, performance, migrations."

## Consolidate Results

Espera que terminen los 3 forks.

Genera resumen:
- Code score (x/10)
- Security findings (critical/medium/low)
- Data risk (x/10)
- Recomendaciones finales

Post GitHub review:
```bash
gh pr review $PR_NUM --request-changes --body "[consolidated review]"
```
```

**Ejecutar:**
```bash
/parallel-pr-review 247
```

---

### SKILL: Cascading Validation (CI Pipeline)

**Guarda en `~/.claude/skills/ci-validation/SKILL.md`:**

```bash
#!/bin/bash
set -e

echo "🔄 Cascading Validation Pipeline"
echo "================================="

# STEP 1: Code Quality
echo ""
echo "📝 STEP 1: Code Quality Checks"
npm run lint || {
  echo "❌ Lint failed"
  exit 1
}
echo "✓ Lint passed"

npm run format:check || {
  echo "❌ Format check failed. Run: npm run format"
  exit 1
}
echo "✓ Format OK"

# STEP 2: Security
echo ""
echo "🔐 STEP 2: Security Checks"
npm audit || {
  echo "❌ Vulnerable dependencies found"
  exit 1
}
echo "✓ No known vulnerabilities"

# Check for hardcoded secrets
if grep -r "password\s*=" src/ 2>/dev/null | grep -v test; then
  echo "❌ Hardcoded credentials found"
  exit 1
fi
echo "✓ No hardcoded secrets"

# STEP 3: Tests
echo ""
echo "🧪 STEP 3: Test Suite"
npm test -- --coverage --watch=false || {
  echo "❌ Tests failed"
  exit 1
}
echo "✓ All tests passed"

# STEP 4: Build
echo ""
echo "📦 STEP 4: Build Check"
npm run build || {
  echo "❌ Build failed"
  exit 1
}
echo "✓ Build successful"

# STEP 5: Summary
echo ""
echo "✅ All validations PASSED"
echo "Next: Code review and merge"
```

---

### SKILL: Morning Brief (Automation)

**Guarda en `~/.claude/skills/morning-brief/SKILL.md`:**

```markdown
# 🌅 Morning Brief

Genera un resumen ejecutivo para empezar el día.

## Tareas

1. **Git Status**
```bash
git status
git log --oneline -3
```

2. **PRs Asignados**
```bash
gh pr list --assignee @me --state open
```

3. **Issues Asignadas**
```bash
gh issue list --assignee @me --state open
```

4. **Memory Check**
```bash
test -f ~/.claude/memory && cat ~/.claude/memory
```

## Output

Genera brief de 5-10 líneas:
- PRs pendientes (1-2 línea)
- Issues asignadas (1-2 línea)
- Contexto de ayer (de memory)
- Recomendación: por dónde empezar hoy
- Bloqueadores (si los hay)

## Example Output

```
🌅 Morning Brief — [DATE]

PRs Waiting:
  • #245: Auth refactor (blocked on review)
  • #248: Payment v2 (ready to merge)

Issues:
  • Critical: Database slow queries
  • Bug: Cache invalidation issue

Context from yesterday:
  Working on authentication migration from JWT to OAuth.
  Ready to test flow with test users.

Recommendation:
  1. Merge PR #248 (payment)
  2. Review OAuth test flow
  3. File quick win: cache issue

Blockers:
  None
```
```

**Ejecutar cada mañana:**
```bash
/morning-brief
```

---

## CHECKLIST: Implementar Todos los Snippets

Copia y usa como checklist:

```markdown
# Implementation Checklist

## Git Workflows
- [ ] Copié script pre-merge-check.sh
- [ ] Probé merge safety checks en una rama dummy
- [ ] Entiendo cuándo usar trunk-based vs gitflow

## MCP Setup
- [ ] Creé ~/.claude/mcp.json con GitHub, PostgreSQL, Slack
- [ ] Configuré env vars (GITHUB_TOKEN, DATABASE_URL, SLACK_BOT_TOKEN)
- [ ] Verifiqué con `claude /mcp`
- [ ] Probé comandos básicos (gh pr list, SELECT query, Slack post)

## Hooks
- [ ] Copié hooks configuration a ~/.claude/settings.json
- [ ] Testeé PreToolUse hook (ej: intenté rm -rf, fue bloqueado)
- [ ] Testeé PostToolUse hook (escribí código, auto-formateó)
- [ ] Agregué .claude/settings.json per-project si necesario

## Orchestration
- [ ] Creé skill parallel-pr-review
- [ ] Creé skill ci-validation
- [ ] Creé skill morning-brief
- [ ] Probé /parallel-pr-review con PR real
- [ ] Probé /ci-validation en repo local
- [ ] Configuré /morning-brief para ejecutar cada mañana

## Next Level
- [ ] Agregué MCPs adicionales (AWS, Docker, etc.)
- [ ] Creé hook personalizado para mi flujo
- [ ] Documenté custom workflows en CLAUDE.md
```

---

## Quick Reference: Comandos Más Usados

```bash
# Git Workflows
git worktree add ~/work/feature-x -b feature/feature-x  # Parallelismo
git rebase -i HEAD~5                                    # Squash commits
git merge --no-ff feature/x && git push                 # Safe merge

# MCPs
claude /mcp                                             # Ver conectados
claude mcp add --scope user github -e TOKEN=...         # Add global
claude mcp add --scope project postgres -e URL=...      # Add project

# Hooks
cat ~/.claude/settings.json | grep -A5 "hooks"          # Ver activos
claude /permissions                                     # Revisar permisos

# Skills
/morning-brief                                          # Brief diario
/parallel-pr-review 247                                 # Review PR
/ci-validation                                          # Pipeline

# Seguridad
git log --oneline | head -10                            # Ver commits recientes
npm audit                                               # Check vulnerabilities
grep -r "password\s*=" src/                             # Find hardcodes
```

---

**FIN DE COPY-PASTE CHECKLISTS**

Todos estos snippets están listos para copiar y pegar. Personaliza según tu ambiente.
