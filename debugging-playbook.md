# Debugging Playbook Completo — "De 'No Sé Qué Pasó' a 'Arreglado en 5 min'"

> Árbol de decisión exhaustivo para troubleshooting. Diagnosis sistemático, recovery patterns, post-mortem.

**Objetivo:** Dominar debugging. De confundido → diagnóstico rápido → fix.

**Tiempo estimado:** 75 min lectura + 60 min laboratorio práctico.

---

## SECCIÓN 1: Los 5 Síntomas Más Comunes

### Síntoma 1: "Agente entra en loop infinito"

**Características:**
- Mensaje se repite 3+ veces
- Context size crece rápidamente
- Mismo error en cada iteración
- Timeout o abort forzado

**Checklist de diagnóstico:**

```
✓ ¿Qué mensaje se repite?
  └─ Copiar exacto el texto (primeras 50 chars)

✓ ¿Después de cuántas iteraciones?
  └─ Anotar número (3, 10, 47, etc.)

✓ ¿Contexto size?
  └─ Anotar: Initial → Final (ej: 50KB → 320KB)

✓ ¿Qué tool falla?
  └─ Anotar: Tool name + error message

✓ ¿Es el mismo error?
  └─ Sí → Tool falla consistentemente
     No → Loop causado por logic error
```

**Decision Tree:**

```
Agente entra en loop?
├─ Sí, mismo mensaje
│  ├─ Mismo error también?
│  │  ├─ Sí → Tool fallando
│  │  │  ├─ Check tool input válido?
│  │  │  ├─ Check API keys?
│  │  │  └─ Check MCP server status? (/mcp list)
│  │  │
│  │  └─ No → Logic loop (prompt circular)
│  │     ├─ Ejemplo: "A pide B, B pide A"
│  │     └─ Fix: /compact + reformular prompt
│  │
│  └─ Error "context: fork", significa contexto bloated
│     ├─ /compact --aggressive (reduce 30%)
│     ├─ Si no funciona: /fork --memory=shallow
│     └─ Como último: /task (async con retry)
│
└─ No, diferentes mensajes
   └─ Loop causado por iteración válida (progress)
      └─ OK si context <300KB, time <5min
```

**TDD Test Case:**

```typescript
test('should detect infinite loop after 3 repetitions', async () => {
  const messages = [
    "Let me analyze this code step by step...",
    "Let me analyze this code step by step...",
    "Let me analyze this code step by step...",
  ];

  const loopDetected = detectInfiniteLoop(messages);
  expect(loopDetected).toBe(true);
  expect(loopDetected.iterationCount).toBe(3);
  expect(loopDetected.recommendation).toContain('/compact');
});

test('should NOT flag valid iteration as loop', async () => {
  const messages = [
    "Step 1: Reading file...",
    "Step 2: Parsing content...",
    "Step 3: Generating output...",
  ];

  const loopDetected = detectInfiniteLoop(messages);
  expect(loopDetected).toBe(false);  // Different messages = progress
});
```

**Recovery (Paso-a-Paso):**

```bash
# OPCIÓN 1: Compact (rápido)
/compact --aggressive --keep-recent=5
# Si funciona: Continuar
# Si no funciona: → OPCIÓN 2

# OPCIÓN 2: Fork (aislamiento)
/fork --name=fixed-logic --memory=shallow
"Intenta nuevamente sin loop, enfocado en resultado final"
# Si funciona: Consolidar en main
# Si no funciona: → OPCIÓN 3

# OPCIÓN 3: Task async
/task "Completar operación" --max-retries=3 --backoff=exponential
# Auto-retry con backoff
# Si falla 3x: Investigate root cause

# INVESTIGACIÓN ROOT CAUSE
/doctor
# Busca:
#   ❌ Missing tool setup?
#   ❌ API key invalid?
#   ❌ Rate limit hit?
#   ❌ Context corruption?

/logs --filter="error" --lines=50
# Busca error patterns:
#   "context too large"
#   "tool call failed"
#   "timeout"

/debug --hooks
# Verifica hooks no están blocking
```

---

### Síntoma 2: "MCP server no responde"

**Características:**
```
Error messages:
├─ "Connection refused (127.0.0.1:3000)"
├─ "Server not found in registry"
├─ "Timeout after 30s"
├─ "Invalid manifest JSON"
└─ "401 Unauthorized"
```

**Checklist diagnosis:**

```
✓ ¿Cuál es el error exacto?
  └─ Copiar mensaje completo

✓ ¿Servidor HTTP o stdio?
  └─ /mcp list → ver tipo (http/stdio/sse)

✓ ¿Cuándo pasó primero?
  └─ Después de instalar? Actualizar? Restart?

✓ ¿Otros servers funcionan?
  └─ /mcp list → verificar status todos
```

**Decision Tree:**

```
MCP server error?
├─ "Connection refused"
│  ├─ Check if server running
│  │  └─ lsof -i :3000  (para HTTP)
│  │     ps aux | grep "server-name"  (para stdio)
│  │
│  ├─ No está corriendo?
│  │  ├─ npm start (si local)
│  │  ├─ docker run ... (si containerizado)
│  │  └─ Verify port correcto (settings.json)
│  │
│  └─ Está corriendo pero no responde?
│     ├─ Check logs: tail -f server.log
│     ├─ Restart: pkill server-name && npm start
│     └─ Network issue? Check firewall, VPN
│
├─ "Server not found"
│  ├─ Typo en nombre? /mcp list → ver exact name
│  ├─ Instalado? npm ls @anthropic/server-name
│  ├─ En settings.json? cat .claude/settings.json
│  └─ Si no existe: /plugin search [name]
│
├─ "Timeout after 30s"
│  ├─ Server lento? ps aux → check CPU/memory
│  ├─ Network latency? ping server-address
│  ├─ Database query slow? Check DB query logs
│  ├─ Increase timeout: settings.json → mcpSettings.timeout = 60
│  └─ Use /task (async, más forgiving)
│
├─ "Invalid manifest JSON"
│  ├─ Check manifest file: cat manifest.json
│  ├─ Validate: jq . < manifest.json
│  ├─ Regenerate: npm run build
│  └─ Restart MCP: /refresh
│
└─ "401 Unauthorized"
   ├─ Check API key: echo $API_KEY_ENV_VAR
   ├─ Key válida? cat .claude/settings.json → env section
   ├─ Key expirada? Regenerate en provider dashboard
   ├─ Token malformado? Paste correcto
   └─ Restart para aplicar: /refresh
```

**TDD Test Case:**

```typescript
describe('MCP Server Status Checking', () => {
  test('should detect connection refused', async () => {
    mockServer.isRunning = false;

    const result = await checkMCPStatus('postgres');

    expect(result.status).toBe('connection_refused');
    expect(result.recommendation).toContain('npm start');
  });

  test('should detect auth failure', async () => {
    mockServer.requiresAuth = true;
    mockServer.apiKey = 'invalid';

    const result = await checkMCPStatus('github');

    expect(result.status).toBe('unauthorized');
    expect(result.recommendation).toContain('API key');
  });

  test('should detect timeout', async () => {
    mockServer.responseTime = 45000; // >30s timeout

    const result = await checkMCPStatus('slow-server');

    expect(result.status).toBe('timeout');
    expect(result.recommendation).toContain('mcpSettings.timeout');
  });
});
```

**Recovery:**

```bash
# DIAGNÓSTICO RÁPIDO
/doctor --deep

# Si muestra MCP error:
/logs --filter="mcp" --lines=20

# FIXING (por tipo de error)

# Error: Connection refused
lsof -i :3000          # Ver qué usa puerto
pkill server-name      # Matar proceso viejo
npm start              # Reiniciar

# Error: Invalid manifest
npm run build
/refresh               # Reload MCP system

# Error: 401 Unauthorized
export GITHUB_TOKEN="ghp_xxxxx"  # Nuevo token
/refresh
/mcp list              # Verify ✅ status
```

---

### Síntoma 3: "Hook no dispara"

**Características:**
```
Hook definido en settings.json pero:
├─ No se ejecuta
├─ Se ejecuta pero no funciona
├─ Error silencioso (no visible)
└─ Solo falla a veces
```

**Checklist:**

```
✓ ¿Hook está en settings.json?
  └─ cat .claude/settings.json | grep hooks

✓ ¿Archivo de hook existe?
  └─ ls -la .claude/hooks/

✓ ¿Hook tiene permisos ejecución?
  └─ stat .claude/hooks/pre-tool-use.sh

✓ ¿Event se activa? (¿está en loop tool-use?)
  └─ /logs --filter="hook"

✓ ¿Exit code correcto?
  └─ Hook debe retornar 0 (allow) o 1 (warn) o 2 (block)
```

**Decision Tree:**

```
Hook no funciona?
├─ Archivo falta?
│  ├─ Crear: touch .claude/hooks/pre-tool-use.sh
│  ├─ Copiar template
│  └─ chmod +x .claude/hooks/pre-tool-use.sh
│
├─ Hook se ejecuta pero error?
│  ├─ Check logs: /logs --filter="hook" --level=error
│  ├─ Debug script:
│  │  bash -x .claude/hooks/pre-tool-use.sh 2>&1
│  ├─ Leer error → fix → restart
│  └─ /refresh (reload hooks)
│
├─ Hook silencioso (no error visible)?
│  ├─ Puede ser: Exit code 1 (warning, no blocking)
│  ├─ Verify: /debug --hooks
│  ├─ Si exit code 1: Expected, muestra warning
│  └─ Si exit code 0: Allow (normal)
│
└─ Hook solo falla a veces?
   ├─ Race condition? Timing issue?
   ├─ Dependency falta en algunos casos?
   ├─ Path relativo vs absoluto?
   └─ Debug individual tool calls:
      bash -x .claude/hooks/pre-tool-use.sh
```

**TDD Test Case:**

```typescript
describe('Hook Execution', () => {
  test('should execute hook on tool use', async () => {
    const hookFile = '.claude/hooks/pre-tool-use.sh';
    expect(fs.existsSync(hookFile)).toBe(true);

    const result = await executeTool('bash', 'echo test');

    // Verify hook was invoked
    expect(hookWasInvoked()).toBe(true);
  });

  test('should respect exit codes', async () => {
    // Exit code 0 = allow
    mockHook.exitCode = 0;
    const result0 = await executeTool('bash', 'echo test');
    expect(result0.allowed).toBe(true);

    // Exit code 1 = warn (but allow)
    mockHook.exitCode = 1;
    const result1 = await executeTool('bash', 'echo test');
    expect(result1.allowed).toBe(true);
    expect(result1.warned).toBe(true);

    // Exit code 2 = block
    mockHook.exitCode = 2;
    const result2 = await executeTool('bash', 'echo test');
    expect(result2.allowed).toBe(false);
  });

  test('should reload hooks on /refresh', async () => {
    fs.writeFileSync('.claude/hooks/pre-tool-use.sh', '#!/bin/bash\nexit 0');
    await runCommand('/refresh');

    // New hook should be active
    const result = await executeTool('bash', 'echo test');
    expect(result.hookVersion).toContain('updated');
  });
});
```

---

### Síntoma 4: "Tool call falla silenciosamente"

**Características:**
```
Tool no retorna error, pero:
├─ Respuesta vacía
├─ Response malformado (no JSON)
├─ Agente ignora resultado
└─ Task incomplete
```

**Recovery:**

```bash
# DIAGNÓSTICO
/logs --filter="tool_result" --lines=30

# Buscar: tool_use_id + is_error + text

# DEBUGGING
/fork --name=debug-tool --memory=full
"Call tool manually: [tool-name] with input {x: y}"
# Verifica si falla o retorna malformado

# FIX (común)
# 1. Tool input schema incorrecto
#    → Verifica @anthropic/sdk source
#
# 2. Tool output not JSON serializable
#    → Wrap en JSON.stringify()
#
# 3. Tool timeout (>30s)
#    → /task con retry
#
# 4. Tool uses stdio, pero está bloqueado
#    → Check hooks, firewall, permisos
```

---

### Síntoma 5: "Costos subieron 10x"

**Características:**
```
├─ Sesión corta ($100+ spending)
├─ Múltiples sesiones acumuladas ($1000+/day)
├─ Presupuesto excedido (--budget limit hit)
└─ API cost surge vs proyección
```

**Root Causes Común:**

```
1. CONTEXT BLOAT (60% de casos)
   ├─ Mensajes acumulados, nunca comprimido
   ├─ Archivos grandes (1MB+ en contexto)
   ├─ Token leaks (ver archivo 2x, 3x, etc.)
   └─ Fix: /compact --aggressive

2. LOOP INEFICIENTE (20%)
   ├─ 100 iteraciones para 1 tarea
   ├─ Tool calls repetidas
   ├─ No cachea resultados
   └─ Fix: /fork, /task, o redesign prompt

3. BATCH API NO USADO (15%)
   ├─ Sequential processing 10k items
   ├─ Podría ser 50% cheaper con batch
   └─ Fix: Usar Batch API para async work

4. MISCONFIGURED TOOLS (5%)
   ├─ MCP server ineficiente (N+1 queries)
   ├─ Tool llamada cuando hook lo bloquea
   └─ Fix: Optimize tool implementation
```

**TDD Test Case:**

```typescript
describe('Cost Tracking', () => {
  test('should warn at 80% of budget', async () => {
    const budget = 10;
    await setbudget(budget);

    // Simulate spending $8
    await spendTokens(expectedCost(8));

    const status = await getCostStatus();
    expect(status.warnings).toContain('80%');
    expect(status.currentSpend).toBe(8);
  });

  test('should block on budget exceeded', async () => {
    const budget = 5;
    await setBudget(budget);

    // Try to spend $6 (exceeds)
    const result = await executeTask({
      expectedCost: 6,
    });

    expect(result.blocked).toBe(true);
    expect(result.reason).toContain('BUDGET_EXCEEDED');
  });

  test('should detect context bloat', async () => {
    const context = generateContextTokens(150000); // Large

    const analysis = await analyzeContextSize(context);

    expect(analysis.bloated).toBe(true);
    expect(analysis.recommendation).toContain('/compact');
    expect(analysis.estimatedSavings).toBeGreaterThan(0.2); // >20% savings
  });
});
```

---

## SECCIÓN 2: Diagnostic Tree Completo — 15 Paths

```
┌─ ¿DÓNDE FALLA? (Primera pregunta)
│
├─ AGENT LOOP
│  ├─ Loop infinito
│  │  ├─ Mismo error? → Tool failure
│  │  ├─ Context grande? → /compact
│  │  └─ Logic circular? → Reformulate prompt
│  │
│  ├─ Iteración lenta
│  │  ├─ Tool timeout? → Increase timeout, use /task
│  │  ├─ MCP latency? → Check server status
│  │  └─ Token limit hit? → /compact
│  │
│  └─ Agent stops (incomplete)
│     ├─ Token limit? → max_tokens increased
│     ├─ Model error? → Check error message
│     └─ Network timeout? → /task retry
│
├─ MCP SERVERS
│  ├─ Connection error
│  │  ├─ Server down? → Restart
│  │  ├─ Auth failed? → Check token
│  │  └─ Manifest invalid? → /refresh
│  │
│  ├─ Latency spike
│  │  ├─ Rate limit hit? → Wait or cache
│  │  ├─ DB slow? → Optimize query
│  │  └─ Network? → Use closer region
│  │
│  └─ Tool call fails
│     ├─ Input schema wrong? → Verify schema
│     ├─ Tool output malformed? → Fix implementation
│     └─ Permission denied? → Check credentials
│
├─ SKILLS
│  ├─ Skill not found
│  │  ├─ Wrong name? → /skill list
│  │  └─ Not created? → /skill create
│  │
│  ├─ Skill error
│  │  ├─ Input validation fail? → Check input format
│  │  ├─ Dependency missing? → Install package
│  │  └─ Permission denied? → chmod +x, verify path
│  │
│  └─ Skill slow
│     ├─ Parallelizable? → Use /fork
│     ├─ External API slow? → Use caching
│     └─ Compute-heavy? → Optimize algorithm
│
├─ HOOKS
│  ├─ Hook blocks (exit code 2)
│  │  └─ Expected? (security check) → OK
│  │     Unexpected? → Review hook logic
│  │
│  ├─ Hook warns (exit code 1)
│  │  └─ Check logs: /logs --filter="hook"
│  │     Fix cause → Re-run without warning
│  │
│  └─ Hook not invoked
│     ├─ Hook file exists? → Create if missing
│     ├─ Has execute permission? → chmod +x
│     ├─ Event doesn't trigger? → Check loop
│     └─ Syntax error in hook? → bash -x script.sh
│
├─ COST
│  ├─ Budget exceeded
│  │  ├─ /compact → free 30% tokens
│  │  ├─ /fork --memory=shallow → use less context
│  │  └─ /task batch → 50% API discount
│  │
│  ├─ Context bloated
│  │  ├─ Too many messages? → /compact
│  │  ├─ Large files in context? → Remove
│  │  └─ Repeated content? → Deduplicate
│  │
│  └─ Unexpected spending
│     ├─ Verify via /logs --filter="cost"
│     ├─ Check /budget status
│     └─ Implement cost-aware hook
│
└─ INTEGRATION (Agente + MCP + Hooks)
   ├─ Partial failure (1/3 steps works)
   │  ├─ Debug each step independently: /fork
   │  ├─ Add logging hooks
   │  └─ Verify chain of communication
   │
   ├─ Data corruption (wrong output)
   │  ├─ Hook filtering incorrectly?
   │  ├─ MCP returning stale data?
   │  └─ Agent misinterpreting?
   │
   └─ Cascading failures (1 failure cascades)
      ├─ Use /task with retry
      ├─ Add error handling in hooks
      └─ Isolate with /fork
```

---

## SECCIÓN 3: Herramientas de Debugging

### Tool 1: `/doctor` — Auto-Diagnóstico

```bash
/doctor --deep

Output ejemplo:
╔════════════════════════════════════════╗
║   Claude Code — Health Report         ║
╚════════════════════════════════════════╝

✅ Settings       | .claude/settings.json válido
✅ Hooks         | 6 hooks registered, last run 2.3s ago
✅ MCP Servers   | 3 servers online, latency <150ms
⚠️  Cache        | TTL bajo (2 min), considerar 5 min
❌ Disk Space    | 150MB disponible (crítico para .next)

Top Issues:
1. Cache TTL bajo → Performance hurt
2. Disk space bajo → Build may fail
3. Hook latency > 100ms → Consider optimization

Recommendations:
1. Increase cache TTL → .claude/settings.json line 42
2. Clean node_modules → freed 800MB
3. Profile hook: pre-tool-use.sh too slow
```

### Tool 2: `/logs` — Acceso a Logs

```bash
/logs --filter="error" --level=error --lines=50

Ejemplo output:
2026-05-22T14:32:01.234Z [ERROR] Tool timeout after 30s
  Tool: Bash (curl github.com/...)
  Command: curl --max-time 30 https://api.github.com/repos/anthropic-sdk-python
  Error: Connection timeout
  Duration: 30.2s
  Context: cli-commands-reference.md line 487

2026-05-22T14:31:55.100Z [ERROR] MCP server timeout
  Server: PostgreSQL
  Latency: 45.2s (threshold: 30s)
  Last query: SELECT COUNT(*) FROM logs WHERE...
  Recommendation: Check DB connection pool, consider query optimization

Total errors: 2/847 recent logs (0.2% error rate)
```

### Tool 3: `/debug` — Interactive Debugger

```bash
/debug --hooks --context --cost --all

┌─ Hook PreToolUse
│  ├─ File: .claude/hooks/pre-tool-use.sh
│  ├─ Last run: 0.15s ago (Bash tool)
│  ├─ Exit code: 0 (allowed)
│  └─ Duration: 45ms
│
├─ Hook PostToolUse
│  ├─ File: .claude/hooks/post-tool-use.sh
│  ├─ Last run: 0.10s ago (Bash tool)
│  ├─ Exit code: 1 (warning: cache miss)
│  └─ Duration: 78ms
│
└─ Context Snapshot
   ├─ Current tokens: 12,345
   ├─ Peak tokens: 450,000
   ├─ Compression possible: Yes (compact would free ~30%)
   └─ Cost so far: $0.47 (estimated total $1.20)
```

---

## SECCIÓN 4: Recovery Patterns

### Pattern 1: /compact + Resume

```
Cuando: Context grande, pero operación importante sigue
Costo: Pierde contexto histórico, pero continúa

Pasos:
1. /compact --aggressive --keep-recent=5
   (Reduce 30% tokens, mantiene últimos 5 mensajes)
2. [Continuar con tarea]
3. Resultado: Mismo output, costo reducido

Ejemplo real:
Before: 450KB context, $0.50 cost
/compact → 300KB context, $0.35 cost (saved $0.15)
Capability: 95% (solo pierde contexto viejo)
```

### Pattern 2: /fork + Retry

```
Cuando: Aislamiento crítico, contexto corrupto, datos sensibles
Costo: +40% (nuevo contexto), pero garantiza isolation

Pasos:
1. /fork --name=isolated-logic --memory=shallow
2. [Repetir tarea en fork]
3. [Consolida resultado a main]

Ejemplo:
Main context (corrupted) → /fork (clean) → retry → success
Time: +5s (fork setup)
Cost: +$0.10 (nuevo contexto)
Benefit: Aislamiento total
```

### Pattern 3: /task + Exponential Backoff

```
Cuando: Operación puede fallar, retry esperado
Costo: +5% (retry overhead)

Pasos:
1. /task "descripción" --max-retries=3 --backoff=exponential
2. [Task executes con retries automático]
3. Fallback: Alternative approach si 3x fallos

Retry Schedule:
Attempt 1: 0s
Attempt 2: 1s (fail)
Attempt 3: 2s (fail)
Attempt 4: 4s (success! ✅)
Total time: ~7s vs. instant fail sin retry
```

---

## SECCIÓN 5: Post-Mortem Template

Después de major incident, completa:

```markdown
# Post-Mortem: [Incident Title]

## Timeline
- **T+0:00** Incident began
- **T+2:34** Detected via /doctor alert
- **T+5:12** Root cause identified (loop, context bloat)
- **T+7:45** Fix applied (/compact)
- **T+8:00** Resolved

## Root Cause
[What actually caused the issue]
├─ Primary: Context bloat (450KB)
├─ Contributing: No /compact configured
└─ Detection gap: /doctor didn't warn until T+2:34

## Impact
- Duration: 8 minutes
- Affected: 1 agent session
- Data loss: None
- Cost: $2.50 (vs normal $0.30, +733% overspend)

## What Went Well
- [✅] /doctor detected issue quickly
- [✅] /compact resolved in 30 seconds
- [✅] No data corruption

## What Didn't Go Well
- [❌] No automatic /compact trigger at 70% threshold
- [❌] Hook wasn't monitoring context size
- [❌] Took 2+ minutes to diagnose

## Action Items
- [ ] Add Hook to auto-compact at 70% token usage
- [ ] Increase default timeout (was too tight)
- [ ] Add cost-aware monitoring dashboard
- [ ] Train team on /doctor + /logs workflow

## Prevention
1. Implement auto-compact hook at 70% threshold
2. Set alerts at $1 cost per session
3. Daily cost report email
4. Quarterly disaster recovery drill
```

---

## Validación Final — Debugging Checklist

```
□ Diagnóstico rápido (1 min)
  ├─ [ ] Ran /doctor
  ├─ [ ] Checked /logs --filter="error"
  ├─ [ ] Identified symptom (loop, MCP, cost, etc.)
  └─ [ ] Know root cause (80% confidence)

□ Recovery (5 min)
  ├─ [ ] Attempted recovery pattern (#1-3 arriba)
  ├─ [ ] Verified fix works (test manually)
  ├─ [ ] Measured impact (cost, time, capability)
  └─ [ ] Documented action taken

□ Prevention (preventivo)
  ├─ [ ] Added monitoring hook (if new issue type)
  ├─ [ ] Updated settings.json (if config issue)
  ├─ [ ] Trained team (if knowledge gap)
  └─ [ ] Created post-mortem (if major incident)

SCORE: 3/3 = ✅ Debugging Certified
```

---

## Quick Reference Card

```
SYMPTOM          │ DIAGNOSIS        │ FIX (1-2 min)
─────────────────┼──────────────────┼─────────────────────
Loop infinito    │ /doctor          │ /compact --agg
MCP down         │ /mcp list        │ Check API key
Hook fails       │ /debug --hooks   │ bash -x script.sh
Cost spike       │ /logs --cost     │ /budget set $X
Tool error       │ /fork debug      │ Check input schema
```

---

**Próximos pasos:**
1. Bookmark este playbook
2. Practica 1 diagnosis (cualquier proyecto)
3. Crea custom hooks para monitoreo
4. Define SLOs (latency, cost, availability)

**Certificación:** Resolve 5 issues reales = ✅ Debugging Expert

---

**Recursos complementarios:**
- nivel4-commands-reference.md (/doctor, /logs, /debug detalles)
- nivel4-decision-matrix.md (decisiones arquitectónicas)
- nivel4-integration-examples.md (casos reales con bugs + fixes)
