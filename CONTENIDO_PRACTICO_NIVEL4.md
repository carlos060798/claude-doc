# Contenido Práctico Nivel 4: Maestría en Producción

Este documento contiene 4 secciones de contenido práctico para agregar al curso interactivo:
1. Real-World Git Workflows
2. MCP Servers by Use Case
3. Hooks in Production
4. Multi-MCP Orchestration

---

## SECCIÓN 1: Real-World Git Workflows

### 1.1 Flujos Reales Comparados

#### Flujo A: Trunk-Based Development (Recomendado para equipos pequeños / agile)

**¿Cuándo usar?**
- Equipos de 2-8 personas
- Ciclos de release cortos (diarios/semanales)
- Alta confianza en CI/CD y tests
- Necesitas desplegar frecuentemente

**Commits reales del repo:**
```
7dd84b1 feat: mejorar significativamente estilos visuales y animaciones del curso
cb2feee feat: agregar secciones funcionales - Branching, Rules, Memory, Patrones
3b95aaa Merge origin/master: mantener cambios locales de Nivel 4
b9e066d feat: agregar Nivel 4 completo — Maestría Práctica
```

**El flujo:**
```bash
# 1. Sincroniza con master diariamente
git checkout master
git pull origin master

# 2. Feature branch corta (max 1 día de trabajo)
git checkout -b fix/auth-token-refresh

# 3. Commits atómicos y descriptivos
git commit -m "fix: refresh token antes de expiración
- Chequea expiration en middleware
- Usa endpoint /refresh en el interceptor
- Agrega test en auth.spec.ts"

# 4. Push y crear PR (NO MERGE DIRECTO)
git push -u origin fix/auth-token-refresh
# → Crear PR en GitHub, pedir review

# 5. Merge a master via PR cuando pasa CI
# → Delete rama local después
git checkout master
git pull origin master
git branch -d fix/auth-token-refresh
```

**Ventajas:**
- Integración continua = menos conflictos merge
- Deploy más seguro (cambios pequeños)
- Feedback rápido en code review
- Fácil trackear qué está en production

**Desventajas:**
- Requiere CI/CD sólido
- Tests deben ser confiables
- Presión para merge rápido

---

#### Flujo B: Feature Branches con Hotfixes (Gitflow simplificado)

**¿Cuándo usar?**
- Equipos medianos (8-20 personas)
- Releases cada 2-4 semanas
- Necesitas branches de release/staging
- Soporte simultáneo de múltiples versiones

**Commits reales:**
```
e0f877e config: add jsconfig.json with path alias
423ce0a fix: make Home component async for server-side file reading
25c6901 config: remove nodeVersion from vercel.json
35a57cc config: agregar configuración de build para Vercel
```

**El flujo:**
```bash
# Main branches
master        # producción (tagged with semver)
staging       # pre-producción (code freeze)
develop       # integración (siempre releasable)

# Feature branches
feature/dashboard-redesign
feature/payment-v2
feature/otp-auth

# Hotfix branches (urgent fixes)
hotfix/security-patch
hotfix/database-connection

# El workflow:
# 1. Branch desde develop para feature
git checkout -b feature/otp-auth develop

# 2. Trabajo normal + commits
git commit -m "feat: agregar TOTP authentication
- Instalar speakeasy
- Integrar en login form
- QR code generator"

# 3. Cuando feature termina, PR a develop
git push -u origin feature/otp-auth
# → PR develop ← feature/otp-auth

# 4. Cuando develop tiene suficientes features
git checkout -b release/2.5.0 develop
# → Bump version, freeze features
# → Tests finales
git tag -a v2.5.0 -m "Release 2.5.0"
git push origin master
git merge master develop  # Merge back cambios de versión

# 5. Hotfix urgent
git checkout -b hotfix/security-patch master
# → Fix rápido + test
git merge hotfix/security-patch master
git tag -a v2.5.1
git merge hotfix/security-patch develop  # Sync back
```

**Ventajas:**
- Estructura clara (develop ≠ production)
- Releases controladas
- Hotfixes sin afectar features en desarrollo
- Multi-versión support fácil

**Desventajas:**
- Más complicado que trunk-based
- Merge frequentes entre branches
- Riesgo de divergencia develop ≠ master

---

#### Flujo C: Git Worktrees (Parallelismo sin conflictos)

**¿Cuándo usar?**
- Necesitas trabajar en 2-3 cosas en paralelo
- Quieres mantener clean la rama principal
- Cada worktree es un "context aislado"

**La ventaja sobre checkout normal:**
```
ANTES (git checkout):
Rama A (auth-refactor)
  ↓ git checkout rama-B (UI redesign)
  └→ Pierdes cambios sin staged de A
  
DESPUÉS (git worktree):
Rama A (auth-refactor)  ← directorio separado ~/work/a
Rama B (UI redesign)    ← directorio separado ~/work/b
Rama C (docs)           ← directorio separado ~/work/c
↓
Todas en paralelo, workspace aislado cada una
```

**Setup con Claude Code:**
```bash
# Inicia en rama principal (master/develop)
git checkout master

# Opción 1: Manual con git worktree
git worktree add ~/work/auth-refactor -b feature/auth-refactor
cd ~/work/auth-refactor
# Edita, commit, push como rama normal

# Opción 2: Automático con claude --worktree
claude --worktree feature/auth-refactor
# → Crea worktree automáticamente
# → Inicia sesión de Claude en ese worktree
# → Cuando terminas: /fork para parallelismo

# Listing y cleanup
git worktree list
git worktree remove ~/work/auth-refactor
```

**Ejemplo de workflow paralelo:**
```bash
# Terminal 1: Auth refactor
claude --worktree feature/auth-refactor
> Refactoriza la lógica de tokens

# Terminal 2: UI design (otra terminal)
cd ~/another-project
claude --worktree feature/ui-redesign
> Actualiza componentes de login

# Ambas ramas crecen en paralelo sin conflictos
# En master: git log muestra commits de ambas
```

**Ventajas:**
- Paralelismo sin "git checkout" mental
- Cada worktree puede tener su node_modules, venv, etc.
- CI/CD prueba ambas ramas
- Perfect para pair programming remoto

**Desventajas:**
- Usa más disk space
- Todos worktrees comparten .git
- Necesitas recordar en qué directorio estás

---

### 1.2 Tabla Comparativa: Trunk vs Gitflow vs Worktrees

| Aspecto | Trunk-Based | Gitflow | Worktrees |
|---------|------------|---------|-----------|
| **Complejidad** | Baja | Media | Media (pero más intuitiva) |
| **Integración** | Continua | Por release | Continua |
| **Conflicts** | Frecuentes pero pequeños | Menos frecuentes | Cero (isolated) |
| **Release cycle** | Diario/semanal | Cada 2-4 sem | Variable |
| **Equipo ideal** | 2-8 | 8-20+ | Cualquiera |
| **CI/CD req** | Sólido | Moderado | Sólido |
| **Hotfix flow** | Push + PR | rama hotfix | worktree nuevo |
| **Learning curve** | Fácil | Difícil | Fácil |
| **Parallelism** | ≤3 branches | 5-10 branches | Unlimited |

---

### 1.3 Comandos Copy-Paste Listos

#### Copy-paste 1: Iniciar sesión en worktree + crear feature branch
```bash
# Setup worktree y Claude Code en paralelo
claude --worktree feature/$(date +%s)-descripcion-corta

# Dentro de la sesión de Claude:
# > Refactoriza @src/auth/login.ts y agrega tests
```

#### Copy-paste 2: Merge safety checks (pre-merge)
```bash
# Antes de mergear a master, corre estos checks:
git checkout master
git pull origin master

# Check 1: ¿Hay cambios que no están en mi rama?
git log origin/master..HEAD  # Should be empty or yours

# Check 2: ¿Mi rama tiene todos los tests pasando?
npm test && npm run build

# Check 3: ¿Quién committeó en master desde que abrí PR?
git log --oneline master...feature/mi-rama

# Safe merge (sin --force)
git merge --no-ff feature/mi-rama
git push origin master
```

#### Copy-paste 3: Rebase limpio (squash commits antes de merge)
```bash
# Si hiciste 15 commits pero querés 1 limpio
git rebase -i origin/master
# → pick (first commit)
# → squash (rest of them)
# → edit message

# Force-push a tu rama (OK porque es tuya)
git push --force-with-lease origin feature/mi-rama
```

#### Copy-paste 4: Workflow GitFlow completo (release)
```bash
# STEP 1: Feature branches → develop
git checkout -b feature/new-auth develop
# ... work ...
git commit -m "feat: new auth"
git push origin feature/new-auth
# → PR develop ← feature/new-auth

# STEP 2: Code freeze para release
git checkout -b release/2.5.0 develop
# Bump version in package.json, CHANGELOG.md
git commit -m "chore: bump to v2.5.0"

# STEP 3: Final QA + tag
npm test && npm run build
git tag -a v2.5.0 -m "Release version 2.5.0"

# STEP 4: Merge to production + back to develop
git checkout master
git pull origin master
git merge --no-ff release/2.5.0
git push origin master
git push origin v2.5.0  # Push tag

# STEP 5: Merge back
git checkout develop
git merge --no-ff master
git push origin develop

# CLEANUP
git branch -d release/2.5.0
```

---

## SECCIÓN 2: MCP Servers by Use Case

### 2.1 GitHub MCP: PR Reviews & Issue Creation

**¿Por qué?**
- Automaticar code review
- Crear issues desde sesión Claude
- Queryar PR diffs sin salir del CLI
- Integrar feedback en tiempo real

**Configuración:**

```json
{
  "servers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
      },
      "disabled": false
    }
  }
}
```

**Dónde guardar:**
- **Global** (user scope): `~/.claude/mcp.json`
- **Por proyecto**: `.mcp.json` en raíz del repo

**Comandos en la sesión:**

```bash
# Ver PRs abiertos
> Muéstrame los PRs abiertos en este repo

# Crear issue
> Crea un issue: "Refactor authentication module"
  Con labels: enhancement, auth
  Assignee: mi usuario

# Code review automático
> Revisa el PR #247 line-by-line con comentarios detallados

# Buscar issues
> Encuentra issues con label "bug" sin asignar

# Merge + close
> Mergea el PR #245 con squash commits y cierra relacionados
```

**Ejemplo output del MCP:**
```
GitHub MCP activated
├── Repositories
│   ├── List repos
│   ├── Create repo
│   └── Get repo info
├── Pull Requests
│   ├── List PRs
│   ├── Get PR details
│   ├── Create PR
│   ├── Post review
│   └── Merge PR
├── Issues
│   ├── List issues
│   ├── Create issue
│   ├── Add label/assignee
│   └── Close issue
└── Commits
    └── Search commits
```

---

### 2.2 PostgreSQL MCP: Data Exploration & Queries

**¿Por qué?**
- Ejecutar queries sin psql CLI
- Explorar schema de la DB
- Hacer backups/exports
- Debugging de datos en producción

**Configuración (local):**

```json
{
  "servers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb"
      }
    }
  }
}
```

**Configuración (remota vía SSH):**

```json
{
  "servers": {
    "postgres-prod": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@prod-db.example.com:5432/mydb?sslmode=require"
      }
    }
  }
}
```

**Comandos en sesión:**

```bash
# Explorar tablas
> Muéstrame el schema de la tabla "users"

# Ejecutar query
> SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL 7 day;

# Insert datos
> Inserta 5 usuarios de prueba con emails válidos

# Debugging
> ¿Cuál es el usuario con más compras? Muéstrame detalles

# Export
> Exporta todos los usuarios activos a CSV
```

**Ejemplo: Debugging en producción**

```
Sesión Claude con PostgreSQL MCP:

> Lee @src/checkout/process.ts
  Vi que hace INSERT into orders. Muéstrame los últimos 10
  
MCP responde:
orders (last 10):
id | user_id | total | status | created_at
1  | 42      | 299.99| success| 2025-05-15 14:23:00
2  | 43      | 149.50| failed | 2025-05-15 14:25:00
...

> ¿Por qué falló el order 2?

MCP → SELECT * FROM orders WHERE id = 2;
users.is_active = true, payment_method exists...

> Quién es el user_id 43?

SELECT * FROM users WHERE id = 43;
email: test@example.com, created_at: hoy, is_test_user: true

→ Ah, es usuario de test. La tarjeta está expirada.
  Recomendación: Agregar validación de tarjeta antes de INSERT.
```

---

### 2.3 Slack MCP: Notifications & Alerts

**¿Por qué?**
- Notificar al equipo desde Claude
- Loguear decisiones importantes
- Alertas de CI/CD failures
- Audit trail en Slack

**Configuración:**

```json
{
  "servers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-xxxxxxxxxxxxxxxxxxxxx",
        "SLACK_SIGNING_SECRET": "xxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

**Obtener credenciales:**
1. Ir a https://api.slack.com/apps
2. Create New App → From scratch
3. App name: "Claude Code Bot"
4. Workspace: tu Slack
5. OAuth & Permissions:
   - Scopes: `chat:write`, `files:write`
   - Bot Token User ID: Copy
6. Reinstall app a workspace

**Comandos en sesión:**

```bash
# Notificación simple
> Envía a #dev-team: "Deploy completed: v2.5.0 in production"

# Con detalles
> Post a #incidents:
  ️ Incident: Database slow queries detected
  Time: 2025-05-15 14:23 UTC
  Duration: 8 minutes
  Tables affected: users, orders
  Action: Index added, cache cleared

# Archivo (logs, reports)
> Sube @deployment.log a #devops como "Deploy log v2.5.0"

# Búsqueda de contexto
> ¿Qué dijeron en #deploys sobre la release 2.4.0?
```

**Ejemplo: Slack audit trail en SKILL**

```markdown
# skill-deploy/SKILL.md

## Deploy Safety Check

/mcp slack

Post to #deployments:
"""
Deploy en progreso: {$BRANCH}
Cambios: {$COMMITS_COUNT} commits
Tests: running...
ETA: 5 minutos
"""

// ... deployment code ...

Post to #deployments:
"""
✓ Deploy exitoso
  Version: {$VERSION}
  Tests: todos green
  Time: {$ELAPSED}
  Deployed by: Claude Code (SK)
"""
```

---

### 2.4 Configuración Copy-Paste

**Setup rápido (usuario scope = global):**

```bash
# GitHub
claude mcp add --scope user github \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxx \
  -- npx -y @modelcontextprotocol/server-github

# PostgreSQL local
claude mcp add --scope user postgres \
  -e DATABASE_URL=postgresql://localhost/mydb \
  -- npx -y @modelcontextprotocol/server-postgres

# Slack
claude mcp add --scope user slack \
  -e SLACK_BOT_TOKEN=xoxb-xxxx \
  -e SLACK_SIGNING_SECRET=xxxx \
  -- npx -y @modelcontextprotocol/server-slack
```

**Setup por proyecto (.mcp.json):**

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
    }
  }
}
```

**Conexión paso-a-paso en Claude:**

1. Abre sesión en el directorio del proyecto
2. Claude detecta .mcp.json automáticamente
3. Corre `/mcp` para ver conectados
4. Usa /mcp-name como prefix en prompts
5. Ejemplo: "/postgres SELECT * FROM users LIMIT 5"

---

## SECCIÓN 3: Hooks in Production

### 3.1 Hook 1: Security Audit (PreToolUse)

**¿Qué?** Valida cada acción antes de ejecutarla — evita comandos peligrosos.

**Dónde configurar:** `~/.claude/settings.json` o `.claude/settings.json` (proyecto)

```json
{
  "hooks": {
    "PreToolUse": {
      "enabled": true,
      "rules": [
        {
          "name": "Block dangerous commands",
          "pattern": "(rm -rf|eval|curl.*|sh -c|sudo)",
          "action": "block",
          "message": "Comando potencialmente peligroso detectado. Requiere aprobación."
        },
        {
          "name": "Block PII exposure",
          "pattern": "(password|token|secret|key)\\s*=",
          "action": "block",
          "message": "Detectado intento de escribir credenciales. No permitido."
        },
        {
          "name": "Database production check",
          "pattern": "DELETE|DROP|TRUNCATE",
          "action": "confirm",
          "message": "¿Confirmas DELETE/DROP? Esto es irreversible.",
          "requireConfirm": true
        }
      ]
    }
  }
}
```

**Ejemplo en acción:**

```
SESIÓN CLAUDE:

> Ejecuta rm -rf node_modules para limpiar

HOOK INTERCEPTA:
❌ Security Alert
   Comando bloqueado: rm -rf
   Razón: Pattern match en "dangerous commands"
   Recomendación: Usa npm clean-install en su lugar

USUARIO APRUEBA:
> Está bien, usa npm clean-install entonces
✓ Acción permitida
```

---

### 3.2 Hook 2: Auto-Format + Tests (PostToolUse)

**¿Qué?** Después de escribir código, formatea automáticamente y corre tests.

```json
{
  "hooks": {
    "PostToolUse": {
      "enabled": true,
      "sequence": [
        {
          "name": "Format code",
          "command": "npm run format",
          "onSuccess": "continue",
          "onError": "warn"
        },
        {
          "name": "Lint check",
          "command": "npm run lint",
          "onSuccess": "continue",
          "onError": "warn"
        },
        {
          "name": "Run tests",
          "command": "npm test -- --watch=false",
          "onSuccess": "continue",
          "onError": "abort"
        }
      ]
    }
  }
}
```

**Workflow:**

```
SESIÓN CLAUDE:

> Refactoriza src/auth.ts y agrega test nuevo

HOOK PostToolUse EJECUTA:
1️⃣ npm run format
   ✓ Formateado con prettier

2️⃣ npm run lint
   ⚠ 1 warning (unused import)
   → Claude lo ve y lo arregla

3️⃣ npm test
   ✓ 12 tests passed
   ✓ Coverage: 92%

RESULTADO FINAL:
✓ Código escrito, formateado, pasando tests
✓ Ready para commit
```

---

### 3.3 Hook 3: Context Injection (UserPromptSubmit)

**¿Qué?** Inyecta automáticamente contexto relevante antes de procesar cada prompt.

```json
{
  "hooks": {
    "UserPromptSubmit": {
      "enabled": true,
      "injections": [
        {
          "name": "Git context",
          "command": "git status --short && git log --oneline -3",
          "injectBefore": true,
          "label": "Current branch status"
        },
        {
          "name": "Test status",
          "command": "npm test -- --listTests | wc -l",
          "injectBefore": false,
          "label": "Test count"
        },
        {
          "name": "Memory check",
          "command": "test -f ~/.claude/memory && wc -l ~/.claude/memory",
          "injectBefore": true,
          "label": "Session memory"
        }
      ]
    }
  }
}
```

**Ejemplo:**

```
USUARIO:
> Refactoriza esta función para que sea más rápida

HOOK INYECTA ANTES:
---
Current branch status:
 M src/utils/helpers.ts
 M tests/helpers.spec.ts
On branch feature/perf-optimization

Git log (last 3):
abc1234 feat: added caching layer
def5678 fix: memory leak in helper
ghi9012 chore: bump deps

Session memory:
Previous refactors focused on:
- Reducing nested loops
- Memoization where possible
- Avoiding re-renders
---

CLAUDE RECIBE CONTEXTO ENRIQUECIDO:
"Refactoriza esta función. Contexto: estás en feature/perf-optimization,
hay cambios pendientes, enfoque histórico en memoization..."

RESULTADO: Mejor refactor más alineado con el contexto
```

---

### 3.4 Hook 4: Cost Warning (PreToolUse)

**¿Qué?** Advierte si una acción va a ser muy costosa (tokens, API calls).

```json
{
  "hooks": {
    "PreToolUse": {
      "enabled": true,
      "costWarnings": [
        {
          "name": "Large file read",
          "pattern": "@.*(\\.log|\\.csv|\\.json)",
          "fileSize": "10MB",
          "action": "warn",
          "message": "Archivo grande (>10MB). Costo: ~500 tokens. ¿Continúo?"
        },
        {
          "name": "API bulk operation",
          "pattern": "github.*list.*limit=\\d{3,}",
          "action": "warn",
          "message": "Operación bulk: ~100 API calls. Costo: $0.05. Confirmar?"
        },
        {
          "name": "Database large query",
          "pattern": "(SELECT .*|UPDATE .*|DELETE .*)(?!LIMIT)",
          "action": "warn",
          "message": "Query sin LIMIT. Riesgo de timeout / costo alto. Revisar?"
        }
      ]
    }
  }
}
```

**Ejemplo:**

```
USUARIO:
> Lee todos los logs de producción @./logs/prod-2025-05.log (450MB)

HOOK ADVIERTE:
⚠ Cost Warning
  Archivo muy grande: 450MB
  Tokens estimados: 15,000+
  Costo: ~$0.45
  
¿Seguro que quieres cargar todo?
Alternativa: Usa 'tail -f' o filtra por error level

USUARIO:
> Solo los últimos 10 errores

HOOK OK:
✓ Filtrado. Estimado: 200 tokens, $0.006
✓ Procediendo...
```

---

### 3.5 Hook 5: Performance Monitoring (PostToolUse)

**¿Qué?** Registra timing + recursos de cada acción.

```json
{
  "hooks": {
    "PostToolUse": {
      "enabled": true,
      "monitoring": {
        "logFile": "~/.claude/performance.log",
        "metrics": [
          "duration",
          "tokensUsed",
          "toolsExecuted",
          "errorsEncountered"
        ],
        "alerts": [
          {
            "metric": "duration",
            "threshold": "60s",
            "action": "log",
            "message": "Tool execution took >60s"
          },
          {
            "metric": "tokensUsed",
            "threshold": "5000",
            "action": "log",
            "message": "High token usage in single tool call"
          }
        ]
      }
    }
  }
}
```

**Output esperado en log:**

```
[2025-05-15 14:23:45] Tool: bash (npm test)
  Duration: 32.4s
  Tokens: 2,100
  Status: success
  Details: 12 tests passed

[2025-05-15 14:24:10] Tool: mcp/postgres (SELECT query)
  Duration: 0.8s
  Tokens: 450
  Status: success
  Rows returned: 150

[2025-05-15 14:25:30] Tool: file_read (@src/auth.ts)
  Duration: 0.1s
  Tokens: 1,200
  Status: warning
  Message: Large file, high token count
```

---

### 3.6 Hook Setup Completo (Copy-Paste)

```json
{
  "version": "1.0",
  "hooks": {
    "PreToolUse": {
      "enabled": true,
      "rules": [
        {
          "id": "block-dangerous",
          "pattern": "(rm -rf|eval|>dev/null|curl.*sh)",
          "action": "block",
          "message": "Comando bloqueado por seguridad"
        },
        {
          "id": "block-credentials",
          "pattern": "(password|token|secret|API_KEY|DATABASE_URL)\\s*=",
          "action": "block",
          "message": "Detectado intento de exponer credenciales"
        },
        {
          "id": "confirm-destructive",
          "pattern": "^(DELETE|DROP|TRUNCATE|rm|git reset --hard)",
          "action": "confirm",
          "message": "Acción destructiva. Requiere confirmación."
        },
        {
          "id": "cost-warning",
          "pattern": "@.*\\.(log|db|backup)",
          "action": "warn",
          "message": "Archivo grande potencial. Verificar tamaño."
        }
      ]
    },
    "PostToolUse": {
      "enabled": true,
      "autoActions": [
        {
          "name": "Format after write",
          "trigger": "file_write",
          "command": "npm run format -- $FILE"
        },
        {
          "name": "Run tests after code change",
          "trigger": "bash_success",
          "command": "npm test -- --findRelatedTests $FILE",
          "onError": "report"
        }
      ]
    },
    "UserPromptSubmit": {
      "enabled": true,
      "contextInjection": [
        {
          "name": "git-status",
          "command": "git status -s",
          "inject": true
        },
        {
          "name": "memory-summary",
          "command": "head -20 ~/.claude/memory",
          "inject": true
        }
      ]
    }
  }
}
```

---

## SECCIÓN 4: Multi-MCP Orchestration

### 4.1 Patrón Fork-Join (Paralelismo con MCPs)

**¿Qué?**
Ejecutar múltiples MCPs en paralelo y agregar resultados. Ideal para:
- Análisis en paralelo (GitHub + PostgreSQL)
- Reportes multi-fuente
- Validación cross-system

**Estructura:**

```
┌─────────────────────────────────────┐
│ Main Claude Session                 │
│  "Haz análisis completo de PR #42"  │
└──────────────┬──────────────────────┘
               │
         ┌─────┴─────────┐
         ▼               ▼
    [FORK 1]        [FORK 2]
    GitHub MCP      PostgreSQL MCP
    ├─ Get PR info  ├─ Query affected records
    ├─ Code diff    ├─ Check data integrity
    └─ Comments     └─ Performance impact

         ┌─────────────┬──────────────┐
         │             │              │
    ✓ Results 1   ✓ Results 2    ✓ Merge
         │             │              │
         └─────────────┴──────────────┘
         Aggregated Analysis
```

**Código SKILL (copy-paste):**

```markdown
# skill-parallel-analysis/SKILL.md

## Parallel PR Analysis with Fork-Join

Necesita: GitHub MCP + PostgreSQL MCP

### Step 1: Obtain PR info (main session)
```bash
gh pr view 42 --json title,body,author,changedFiles
```

### Step 2: Fork for parallel analysis

/fork "Analyze code changes"
  → En esta sesión:
  → Lee el diff detallado
  → Identifica riesgos de seguridad
  → Genera checklist de review

/fork "Analyze database impact"
  → En esta sesión:
  → Query tables affectadas
  → Check schema migrations
  → Valida índices nuevos

### Step 3: Main session recolecta resultados

Espera fork 1 y fork 2 →

Combina:
- Security findings
- Database impact
- Code quality score

Output: Resumen ejecutivo
```

---

### 4.2 Patrón Cascading Validation

**¿Qué?** Validaciones secuenciales donde cada paso depende del anterior.

**Flujo:**

```
Commit nuevo en master
    ↓
├─ [PASO 1] Code Quality Check
│   ├─ Lint
│   ├─ Format
│   └─ Type check (TypeScript)
│       ↓ (solo si todo OK)
├─ [PASO 2] Security Audit
│   ├─ SAST scan
│   ├─ Dependency audit
│   └─ Secret detection
│       ↓ (solo si todo OK)
├─ [PASO 3] Integration Tests
│   ├─ PostgreSQL tests
│   ├─ API tests
│   └─ E2E tests
│       ↓ (solo si todo OK)
├─ [PASO 4] Staging Deploy
│   ├─ Build image
│   ├─ Deploy to staging
│   └─ Smoke tests
│       ↓ (solo si todo OK)
└─ [PASO 5] Production Deploy
    ├─ Tag release
    ├─ Deploy prod
    └─ Monitor health
```

**SKILL implementation:**

```markdown
# skill-cascading-ci/SKILL.md

## Cascading Validation Pipeline

```bash
#!/bin/bash
set -e  # Fail on first error

echo "🔍 STEP 1: Code Quality"
npm run lint || { echo "Lint failed"; exit 1; }
npm run format:check || { echo "Format check failed"; exit 1; }

echo "🔐 STEP 2: Security"
npm audit || { echo "Deps vulnerable"; exit 1; }
# Ejecuta scan tool
! grep -r "password=" src/ || { echo "Hardcoded credentials"; exit 1; }

echo "🧪 STEP 3: Integration Tests"
npm test -- --coverage || { echo "Tests failed"; exit 1; }

echo "📦 STEP 4: Build Check"
npm run build || { echo "Build failed"; exit 1; }

echo "✅ All validations passed!"
echo "Next: Manual review before merge"
```

---

### 4.3 Ejemplo Completo: Parallel PR Analysis (3 agentes)

**Escenario:**
PR #247 modifica 8 archivos, toca auth + payments + database.
Quieres: Code review automático + Security check + Data impact analysis.

**Setup:**

```bash
# Pre-requisitos
claude mcp add --scope project github \
  -e GITHUB_TOKEN=$(gh auth token)
claude mcp add --scope project postgres \
  -e DATABASE_URL=postgresql://localhost/mydb
```

**SKILL: parallel-pr-review**

```markdown
# skill-parallel-pr-review/SKILL.md

## Parallel PR Review: Code + Security + Data Impact

Esta skill asigna 3 forksessions paralelas:
1. Code Reviewer (GitHub MCP)
2. Security Auditor (Static analysis)
3. Data Impact Analyzer (PostgreSQL MCP)

Luego consolida hallazgos.

### Main Orchestrator

/mcp github

Obtén PR info:
```bash
PR_NUM=247
gh pr view $PR_NUM --json \
  title,body,changedFiles,commits,reviews,comments
```

### Parallelize con /fork

/fork code_reviewer
  (Session 1: Code review)

/fork security_auditor
  (Session 2: Security)

/fork data_analyzer
  (Session 3: Data impact)

---

### Session 1: Code Reviewer

Tarea: Review de código linha-por-línea

```bash
# Get full diff
gh pr diff 247 > /tmp/pr247.diff
```

Analiza:
- Complejidad ciclomática
- Funciones muy largas
- Imports no usados
- Patrón anti-repeat (DRY)
- Type safety (TypeScript)

Output:
```
## Code Review — PR #247

### 🟢 Strengths
- Buen naming de variables
- Tests coexisten con cambios
- No breaking changes obvios

### 🟡 Warnings
- `src/auth/tokens.ts` línea 42: función 600+ líneas
- `src/payments/charge.ts`: error handling incompleto
- Imports: 3 librerías no usadas

### 🔴 Blockers
- Ninguno

Score: 7.5/10
Recomendación: Requiere ajustes menores antes de merge
```

---

### Session 2: Security Auditor

Tarea: Audit de seguridad + dependencias

```bash
# Get files touched
CHANGED_FILES=$(gh pr diff 247 --name-only)

# Para cada archivo, verifica:
for file in $CHANGED_FILES; do
  echo "=== $file ==="
  
  # 1. Detectar credenciales
  grep -E "(password|token|secret|API_KEY|auth)" $file
  
  # 2. SQL injection risks
  grep -E "(SQL\(|query\(|execute\()" $file
  
  # 3. Hardcoded URLs
  grep -E "(http://|https://)" $file
done

npm audit
```

Output:
```
## Security Audit — PR #247

### Findings

#### 🔴 Critical
- `src/payments/stripe.ts:18` hardcoded API key
  Fix: Use process.env.STRIPE_KEY

#### 🟡 Medium
- SQL query sin parameterized statements en 2 lugares
  Fix: Usar prepared statements

#### 🟢 Info
- Todas las dependencias up-to-date
- No known CVEs
- TLS 1.3 en use

### Recommendations
1. Remove hardcoded keys — use secrets manager
2. Use parameterized queries for all DB calls
3. Add rate limiting en /charge endpoint

Score: 6/10 (fixable issues)
```

---

### Session 3: Data Analyzer

Tarea: Impacto en base de datos

/mcp postgres

Analiza qué query corren los cambios:

```bash
# Lee @src/payments/charge.ts para ver queries nuevas
# Execute en DB para entender impacto

# Queries encontradas:
# 1. UPDATE users SET balance = ... WHERE id = $1
# 2. INSERT INTO transactions (...)
# 3. SELECT COUNT(*) FROM charges WHERE user_id = $1

# Ejecuta en staging DB:
SELECT COUNT(*) FROM users; -- baseline
SELECT AVG(LENGTH(balance)) FROM users; -- data size

-- Check índices existentes
SELECT * FROM pg_indexes WHERE tablename='users';

-- Simula carga: ¿schema aguanta cambios?
-- Valida constraints
```

Output:
```
## Data Impact — PR #247

### Schema Changes
- ALTER TABLE transactions ADD COLUMN metadata JSONB
- CREATE INDEX idx_charges_user_id (no existe)

### Performance Impact
- Current SELECT count(*): 0.02s
- With new index: 0.001s (20x faster)
- Data migration: 0 rows (new column, nullable)

### Risks
- ⚠ index_on_charges_user_id falta
  Fix: CREATE INDEX before deploy
- ✓ No data loss risk
- ✓ Rollback plan: DROP COLUMN, DROP INDEX

### Staging Test Results
- Load test 1000 TPS: ✓ pass
- Concurrent transactions: ✓ OK
- 24h endurance: ✓ OK

Score: 9/10 (low risk)
```

---

### Consolidate Results

Vuelve a sesión principal y consolida:

```
┌─────────────────────────────────────────────────┐
│         CONSOLIDATED PR #247 REVIEW             │
├─────────────────────────────────────────────────┤
│                                                 │
│ Code Quality:          7.5/10  ⚠ Minors fixs   │
│ Security:              6.0/10  🔴 API key leak │
│ Data Impact:           9.0/10  ✅ Safe         │
│ ─────────────────────────────────               │
│ OVERALL:               7.5/10                   │
│                                                 │
│ Status: NEEDS FIXES BEFORE MERGE                │
│                                                 │
├─────────────────────────────────────────────────┤
│ Action Items:                                   │
│ 1. ✅ Remove hardcoded stripe key               │
│ 2. ✅ Use parameterized queries (2 places)      │
│ 3. ⏳ Create index idx_charges_user_id          │
│ 4. ✅ Refactor 600-line auth function           │
│ ⏳ = Can create post-merge                       │
│                                                 │
│ Estimated fix time: 30 min                      │
│ Recommend: Request changes                      │
└─────────────────────────────────────────────────┘
```

**Post-consolidation action:**

```bash
# Claude creates GitHub review
gh pr review 247 --request-changes \
  --body "See parallel review in thread. 4 items to fix."

# Crea issue para index
gh issue create \
  --title "Create index: idx_charges_user_id" \
  --labels "performance" \
  --body "Post-merge optimization from PR #247 review"
```

---

### 4.4 Recomendaciones por Escala

| Tamaño Equipo | Recomendación | MCPs Clave |
|--------------|--------------|-----------|
| **Solo tú** | Trunk-based + worktrees + GitHub | GitHub |
| **2-5** | Trunk-based + forks para features | GitHub + Slack |
| **5-15** | Gitflow + cascading CI + parallel review | GitHub + PostgreSQL + Slack |
| **15+** | Multi-repo orchestration + Agent SDK | ☝️ + Custom MCPs |

---

## Recursos & Links

### Documentación Oficial
- [Claude Code Docs](https://claude.ai/docs/code)
- [MCP Servers Registry](https://github.com/modelcontextprotocol/servers)
- [Agent SDK Docs](https://docs.anthropic.com/agent-sdk)

### Herramientas Mencionadas
- Git Worktrees: `git worktree --help`
- GitHub CLI: `gh --help`
- MCP Client: `claude mcp list`

### Next Steps
1. Pick ONE workflow (Trunk / Gitflow / Worktrees) y practica 1 semana
2. Add 1 MCP (start con GitHub)
3. Implement 1 Hook (security audit)
4. Escala a multi-MCP cuando necesites
