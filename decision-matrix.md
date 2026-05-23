# Matriz de Decisión Completa — "Cuándo Usar Qué"

> Herramienta correcta para cada problema. Decision trees + scoring matrices para arquitectos de Claude Code.

**Objetivo:** De "no sé cuál elegir" a "decisión 30 segundos con confianza".

**Tiempo estimado:** 60 min lectura + 45 min ejercicios prácticos.

---

## SECCIÓN 1: La Matriz 7×7 — Todos los Escenarios

### Filas (Herramientas)
1. **Agent SDK Loop** — Loop agentico tradicional (iteración rápida)
2. **Skills** — Funciones reutilizables (.md con lógica)
3. **MCP Servers** — Integración con APIs externas
4. `/fork` — Subagente paralelo (aislado)
5. `/branch` — Ramificación Git + PR automation
6. `/task` — Operación async con retry automático
7. `/team` — Agent Teams (experimental, múltiples agentes)

### Columnas (Casos de Uso)
1. **Clasificación** — Categorizar datos (etiquetas, taxonomía)
2. **Real-time** — Operación debe completarse <1s
3. **Async** — Operación puede tomar 30s+, retry si falla
4. **Complejo** — Multi-step con branching lógico
5. **Integración** — Requiere acceso a API externa
6. **Cost** — Presupuesto limitado, optimizar $
7. **Aislamiento** — Datos sensibles, sandbox requerido

### La Matriz (Scoring 1-5, donde 5=Óptimo)

```
┌──────────────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│   Herramienta    │Clasif.  │Real-tm  │ Async   │Complejo │Integr.  │  Cost   │Aislar   │
├──────────────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│Agent SDK Loop    │   4⭐   │   5⭐   │   1⭐   │   5⭐   │   3⭐   │   2⭐   │   1⭐   │
│Skills            │   4⭐   │   3⭐   │   2⭐   │   4⭐   │   4⭐   │   5⭐   │   3⭐   │
│MCP Servers       │   3⭐   │   4⭐   │   2⭐   │   2⭐   │   5⭐   │   4⭐   │   4⭐   │
│/fork             │   5⭐   │   2⭐   │   5⭐   │   3⭐   │   3⭐   │   3⭐   │   5⭐   │
│/branch           │   2⭐   │   1⭐   │   3⭐   │   2⭐   │   1⭐   │   3⭐   │   2⭐   │
│/task             │   3⭐   │   1⭐   │   5⭐   │   2⭐   │   3⭐   │   4⭐   │   3⭐   │
│/team             │   4⭐   │   1⭐   │   4⭐   │   5⭐   │   3⭐   │   1⭐   │   4⭐   │
└──────────────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

### Interpretación

**Clasificación (Max 5):**
```
Agent SDK Loop: 4⭐
├─ Rápido, iterativo
├─ Multi-pass análisis
└─ ❌ No para batch 10k items (usa /fork)

/fork: 5⭐
├─ Paralelizar 100s de clasificaciones
├─ Cada fork aislado
└─ ✅ Mejor para batch masivo
```

**Real-time (<1s respuesta):**
```
Agent SDK Loop: 5⭐ (native latency)
/task: 1⭐ (retry adds 5-30s)
/team: 1⭐ (orchestration overhead)

Rule: Si <1s required → Agent Loop solo
```

**Async (operación larga, retry ok):**
```
/fork: 5⭐ (paralleliza 30s operations)
/task: 5⭐ (retry automático)
/team: 4⭐ (coordina múltiples long ops)

Rule: Si operación puede fallar → /task
      Si operación independiente → /fork
```

---

## SECCIÓN 2: Decision Trees — 7 Preguntas Clave

### Tree 1: "Necesito ejecutar lógica rápida"

```
¿Operación es rápida (<3s)?
├─ Sí, simple
│  └─ Agent SDK Loop ✅
│     └─ Directo en agentic loop
│
├─ Sí, compleja (multi-step)
│  └─ Agent SDK Loop + Skills ✅✅
│     └─ Skills para reutilización
│
└─ No, puede ser lenta (3-30s)
   ├─ Independiente?
   │  ├─ Sí → /fork (parallelizar)
   │  └─ No → /task (async + retry)
   │
   └─ Requiere API externa?
      ├─ Sí → MCP Server
      └─ No → /fork
```

**Ejemplo práctico:**
```
"Clasificar 100 párrafos de soporte"
├─ ¿Rápido? No (típicamente 1-2s/párrafo)
├─ ¿Independiente? Sí (cada párrafo aislado)
└─ Decisión: /fork × 10 (10 párrafos/fork)
   ├─ 10 forks paralelo: 2-3s total
   ├─ Vs. sequential: 100-200s
   └─ ✅ Speedup: 50-100x
```

---

### Tree 2: "Quiero automatizar tareas específicas"

```
¿Es tarea reutilizable (3+ usos)?
├─ Sí
│  └─ Crear Skill ✅
│     ├─ .md file en .claude/skills/
│     ├─ Documentar input/output
│     └─ /skill invoke [name]
│
├─ No, único
│  ├─ Requiere API externa?
│  │  ├─ Sí → MCP Server
│  │  └─ No → Agent Loop directo
│  │
│  └─ Puede fallar?
│     ├─ Sí → /task (retry automático)
│     └─ No → Agent Loop
│
└─ ¿Datos sensibles?
   ├─ Sí → /fork (aislamiento)
   └─ No → Skill normal
```

**Ejemplo práctico:**
```
"Skill: Review código Python"
├─ Reutilizable? Sí (usado 15+ veces/semana)
├─ Requiere API? No (lógica local)
└─ Crear skill:

/skill create --name=python-code-review
# Automático:
# .claude/skills/python-code-review/SKILL.md

# Content:
---
name: python-code-review
input: { filePath: string }
output: { issues: array, score: number }
---

User: /skill invoke python-code-review --file=src/auth.py
Response: Found 3 issues, score 85/100
```

---

### Tree 3: "Necesito integración con API externa"

```
¿API ya tiene MCP server?
├─ Sí (GitHub, Postgres, Stripe, etc.)
│  └─ Instalar MCP ✅
│     ├─ npm install @anthropic/[service]-mcp
│     ├─ Agregar a settings.json
│     └─ /mcp list (verificar)
│
├─ No
│  ├─ API pública? Crear MCP custom
│  │  ├─ Complexity: Media (2-4h)
│  │  └─ Benefit: Reutilizable en múltiples agentes
│  │
│  └─ API privada/legacy?
│     ├─ Opción 1: Crear MCP (recomendado)
│     ├─ Opción 2: Wrapper skill (quick & dirty)
│     └─ Opción 3: Llamar directo en agent loop (no escalable)
│
└─ Requiere auth + audit?
   ├─ Sí → Hook PreToolUse + MCP
   └─ No → MCP directo
```

**Ejemplo práctico:**
```
"Integrar Stripe (payment processing)"
├─ API tiene MCP? Sí
├─ Instalar: npm install -g @anthropic/stripe-mcp
├─ Configure: 
{
  "mcpServers": {
    "stripe": {
      "command": "stripe-mcp",
      "env": { "STRIPE_API_KEY": "sk_live_..." }
    }
  }
}
└─ Ahora disponible: "Using stripe tool, get customer with ID 123"
   → Agente invoca: stripe_customer(id: "123")
```

---

### Tree 4: "Contexto es muy grande (>100k tokens)"

```
¿Cuántos tokens?
├─ <100k (normal)
│  └─ No preocuparte, Agent Loop fine
│
├─ 100-500k (grande)
│  ├─ /compact --aggressive (20-30% reduction)
│  ├─ /fork --memory=shallow (si tarea independiente)
│  └─ Presupuesto aumentado? Continuar
│
├─ 500k-1M (muy grande)
│  ├─ Obligatorio: /compact --aggressive
│  ├─ Split contexto: /fork × 3
│  └─ /budget $X (limitar gasto)
│
└─ >1M (crítico)
   ├─ /compact --aggressive
   ├─ /fork --memory=shallow
   ├─ Considera: ¿Necesito todo este contexto?
   ├─ Alternativa: Batch API (50% costo)
   └─ Contact Anthropic (enterprise context)
```

**Scoring contexto:**
```
100k tokens = $1.50
500k tokens = $7.50
1M tokens = $15.00

Si gasto es problema:
├─ /compact: -30% = $10.50 (save $4.50)
├─ /fork: -60% = $6.00 (save $9.00)
├─ /task + Batch API: -50% = $7.50 (save $7.50)
└─ Combinado: /fork + /compact = -73% = $4.05 (save $10.95)
```

---

### Tree 5: "Múltiples equipos, costos separados"

```
¿Cuántos equipos/proyectos?
├─ 1 (simplemente mío)
│  └─ Settings.json único, listo
│
├─ 2-5 (pequeño equipo)
│  ├─ /team feature (experimental)
│  ├─ Cada team: Settings aislado
│  ├─ Cada team: Presupuesto independiente
│  └─ ⚠️  Experimental, riesgos
│
├─ 5-50 (mediano)
│  ├─ /fork con team context
│  ├─ Cada fork: Isolated budget
│  └─ Resulta más estable
│
└─ 50+ (enterprise)
   ├─ Managed settings (Anthropic)
   ├─ SSO + audit centralized
   ├─ Usage tracking granular
   └─ Support SLA
```

**Ejemplo: 3 teams independientes**
```
Team A (Dev)       Team B (QA)        Team C (Ops)
├─ Budget: $100   ├─ Budget: $50     ├─ Budget: $150
├─ Members: 4     ├─ Members: 2      ├─ Members: 3
└─ Tools: All     └─ Tools: Test     └─ Tools: Infra

Implementation:
Per team:
  .claude/settings-team-[name].json
  .claude/CLAUDE.md-team-[name].md
  Budget alerts → team Slack channel

Each dev:
  /init → genera .local/settings.json (overrides team)
  /budget set $30 (personal limit within team)
```

---

### Tree 6: "Operación puede fallar, necesito retry"

```
¿Es operación de alto riesgo?
├─ Sí (API network call, DB transaction, etc.)
│  ├─ Independiente?
│  │  ├─ Sí → /fork (retry implícito)
│  │  └─ No → /task (explícito retry)
│  │
│  └─ /task configuration:
│     ├─ --max-retries=3 (default)
│     ├─ --backoff=exponential (1s, 2s, 4s, 8s)
│     └─ --timeout=30 (abort si >30s)
│
├─ No (local logic, no external)
│  └─ Agent Loop fine
│
└─ ¿Qué ocurre si falla?
   ├─ Crítico (must succeed) → /task with --max-retries=5
   ├─ Importante → /task (default 3)
   └─ Informacional → Agent Loop (1 intento)
```

**Scoring by criticality:**
```
Failed payment transaction
├─ Impact: Pérdida de venta (crítico)
├─ Approach: /task --max-retries=5 --backoff=exponential
└─ Logging: Hook PostToolUse (audit trail)

Failed analytics ping
├─ Impact: Lose data point (informacional)
├─ Approach: Agent loop (1 intento)
└─ Logging: /logs --filter="analytics"
```

---

### Tree 7: "Datos sensibles (GDPR, PII, etc.)"

```
¿Contiene datos sensibles?
├─ No (public info)
│  └─ Cualquier herramienta está ok
│
├─ Sí, pero procesado anónimo
│  ├─ Agent Loop ok (guardar encriptado)
│  └─ Skill ok (con acceso controlado)
│
├─ Sí, datos vivos (emails, SSNs, etc.)
│  ├─ /fork (aislamiento máximo) ✅
│  │  └─ Contexto no escapa a sesión principal
│  ├─ MCP con encryption ✅
│  │  └─ Encriptar en tránsito + reposo
│  └─ ❌ Agent Loop directo (risky)
│
└─ Compliance required (GDPR, HIPAA)?
   ├─ Audit logging → Hook PreToolUse
   ├─ Data residency → MCP server en localidad correcta
   ├─ Encryption → TLS + field-level encryption
   └─ Contact Anthropic (managed settings)
```

**GDPR ejemplo: Procesar datos EU**
```
Requisitos:
├─ Data residency (EU servers)
├─ Audit logs (quién accesó)
├─ Encryption (en reposo + tránsito)
└─ Consent (GDPR Article 6)

Implementation:
├─ /fork --memory=full (aislado)
├─ Hook PreToolUse (log access)
│  └─ echo "User=$USER Data=PII" >> audit.log
├─ MCP con EU server
│  └─ --region=eu-west-1
└─ Managed settings
   └─ Anthropic compliance @ enterprise tier
```

---

## SECCIÓN 3: Patrones Económicos — "Gastar $1 vs $100"

### Patrón 1: "$1 por ejecución" (Ultra-económico)

**Caso:** Microclasificación (etiqueta 1 item, respuesta sí/no).

**Arquitectura:**
```
Item → /fork (shallow memory)
├─ Contexto mínimo (100 tokens)
├─ Respuesta rápida (50 tokens output)
└─ Costo: $0.0015 por item

1000 items = $1.50 (vs $25 sin fork)
```

**Implementación:**
```bash
/fork --name=classifier-$i --memory=shallow
"Using 1-2 sentences, classify this: '$item'
Output only: category name"
```

---

### Patrón 2: "$10 por ejecución" (Moderado)

**Caso:** Análisis profundo (10-15 pasos, agent loop).

**Arquitectura:**
```
Input → Agent Loop (full context)
├─ 3-5 tool calls
├─ Multi-pass analysis
├─ Output: Detailed report
└─ Costo: ~$0.50-1.00 per loop × 10-20 loops = $5-20

Promedio: $10
```

**Implementación:**
```typescript
const result = await client.messages.create({
  model: "claude-opus-4.7",
  max_tokens: 4096,
  system: "You are expert analyst...",
  tools: [/* 5-8 tools */],
  messages: userMessages,
});
// Loop hasta stop_reason !== 'tool_use'
```

---

### Patrón 3: "$100+ por ejecución" (Premium)

**Caso:** Batch analysis (1000s items), multi-step workflow.

**Arquitectura:**
```
1000 items → /team (multiple agents)
├─ Agent 1: Process chunk 1-250 ($25)
├─ Agent 2: Process chunk 251-500 ($25)
├─ Agent 3: Process chunk 501-750 ($25)
├─ Agent 4: Process chunk 751-1000 ($25)
├─ Agent 5: Consolidate results ($25)
└─ Total: $125

OR Batch API:
1000 items → Batch API
├─ Cost: 50% discount (-$62.50)
└─ Total: ~$62.50 (pero toma 24h)
```

---

## SECCIÓN 4: Matriz de Seguridad

### Datos Públicos vs Sensibles

```
┌─────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│   Data      │ Agent Loop   │ Skill        │ MCP          │ /fork        │
├─────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│Public data  │ ✅ Safe      │ ✅ Safe      │ ✅ Safe      │ ✅ Safe      │
│User info    │ ⚠️  Caution  │ ⚠️  Caution  │ ⚠️  Caution  │ ✅ Safe      │
│PII (email)  │ ❌ Risky     │ ❌ Risky     │ ✅ + Enc     │ ✅ Safe      │
│Secrets      │ ❌ Block     │ ❌ Block     │ ✅ w/ vault  │ ✅ Safe      │
│Medical data │ ❌ Block     │ ❌ Block     │ ✅ HIPAA OK  │ ✅ Safe      │
└─────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

**Decision Logic:**

```
¿Dato sensible?
├─ No → Use cualquier herramienta
├─ Sí, moderado → /fork (aislamiento)
├─ Sí, crítico → Hook PreToolUse (block if risky)
└─ Sí, GDPR → Managed settings + audit logs
```

---

## SECCIÓN 5: Ejercicios Prácticos — TDD

### Ejercicio 1: Clasificador Batch (TDD)

**Requisito:**
```
Clasificar 1000 artículos de soporte
├─ Tiempo: <2 minutos
├─ Presupuesto: <$5
├─ Accuracy: >95%
```

**Test Case:**
```typescript
describe('Batch Classifier', () => {
  test('should classify 1000 items in <2min for <$5', async () => {
    const items = generateTestItems(1000);
    const startTime = Date.now();
    const startCost = await getCurrentCost();

    const results = await classifyBatch(items);

    const endTime = Date.now();
    const endCost = await getCurrentCost();

    expect(endTime - startTime).toBeLessThan(120000);  // <2min
    expect(endCost - startCost).toBeLessThan(5);       // <$5
    expect(calculateAccuracy(results)).toBeGreaterThan(0.95);
  });
});
```

**Solución (paso-a-paso):**

```bash
# Step 1: Decisión
¿Rápido?         → No (1000 items)
¿Independiente?  → Sí (cada item aislado)
¿Presupuesto?    → Sí ($5 limit)
→ Decisión: /fork × 100 (10 items/fork)

# Step 2: Implementation
for i in 1..100; do
  /fork --name=batch-$i --memory=shallow
  "Classify these 10 items:
   1. $item1
   2. $item2
   ...
   Output: JSON array with {item_id, category}"
done

# Step 3: Aggregate results
# Recolecta output de 100 forks
# Costo total: 100 forks × $0.04 = $4.00 ✅
# Tiempo total: ~90s ✅
```

---

### Ejercicio 2: Multi-Step Workflow (TDD)

**Requisito:**
```
1. Fetch GitHub issues
2. Analyze each issue (complexity, priority)
3. Generate summary report
4. Post to Slack
```

**Test Case:**
```typescript
describe('GitHub Issue Analyzer', () => {
  test('should complete 4-step workflow', async () => {
    // Setup
    mockGitHub.issues = 5;

    // Execute workflow
    const result = await githubWorkflow();

    // Assertions
    expect(result.issues_analyzed).toBe(5);
    expect(result.report_generated).toBe(true);
    expect(result.slack_posted).toBe(true);
  });

  test('should handle slack failure gracefully', async () => {
    mockSlack.throwError = true;

    const result = await githubWorkflow();

    expect(result.slack_posted).toBe(false);
    expect(result.fallback_email_sent).toBe(true);
  });
});
```

**Solución (decisión-driven):**

```
Step 1: Fetch issues
├─ Herramienta: MCP GitHub ✅
├─ No falla (rate-limit unlikely)
└─ Real-time ok (API <1s)

Step 2: Analyze each (5 issues)
├─ Independiente? Sí
├─ Tiempo: 2-3s cada uno
├─ Herramienta: /fork × 5 ✅
└─ Parallelización: 3s total vs 15s sequential

Step 3: Generate report
├─ Necesita input de Step 2? Sí
├─ Herramienta: Agent Loop ✅
└─ Consolida resultados

Step 4: Post to Slack
├─ Puede fallar? Sí (network)
├─ Herramienta: /task ✅
├─ --max-retries=3
└─ Fallback: email si falla 3x
```

---

## SECCIÓN 6: Validación — Checklist de Decisión

Para cada proyecto nuevo, completa este checklist:

```
□ Requisitos iniciales
  ├─ [ ] Entendí el problema completamente
  ├─ [ ] Identificué constrains (tiempo, costo, datos)
  ├─ [ ] Mapeé steps necesarios
  └─ [ ] Determiné criticidad (nice-to-have vs must-have)

□ Decisión herramienta (usar árboles arriba)
  ├─ [ ] Sé cuál es la herramienta principal
  ├─ [ ] Sé qué herramientas complementarias
  ├─ [ ] He considerado alternativas
  └─ [ ] Mi decisión ≥3 requisitos satisface

□ Scoring económico
  ├─ [ ] Estimé costo aproximado
  ├─ [ ] Consideré optimizaciones (cache, batch)
  ├─ [ ] Costo está dentro de presupuesto
  └─ [ ] ROI es positivo

□ Scoring seguridad
  ├─ [ ] Identifiqué datos sensibles
  ├─ [ ] Sé aislamiento requerido
  ├─ [ ] Planeo auditoría si necesario
  └─ [ ] Compliance requerido? (sí/no + plan)

□ Scoring performance
  ├─ [ ] Sé SLO requerido (latencia, throughput)
  ├─ [ ] Mi solución cumple SLO
  ├─ [ ] Consideré worst-case scenario
  └─ [ ] Tengo fallback si falla

□ Implementación
  ├─ [ ] Escribí test case (TDD)
  ├─ [ ] Implementé solución
  ├─ [ ] Tests pasan
  └─ [ ] Código está en repo (committed)

SCORING FINAL:
15-16/16 ✅ Perfecto (production-ready)
14/16    ⚠️  Good (test antes deploy)
<14/16   ❌ Incompleto (rework requerido)
```

---

## Rápido Reference — Copy & Use

### Tabla de Decisión (1 página)

```
┌─ Tengo que...                    ┬─ Mejor herramienta       ┐
├─ Clasificar 100s items           │ /fork × N (parallel)      │
├─ Automizar tarea reutilizable    │ Skill                     │
├─ Integrar API externa            │ MCP Server                │
├─ Contexto muy grande (>500k)     │ /compact + /fork          │
├─ Operación puede fallar          │ /task --max-retries=N     │
├─ Datos sensibles                 │ /fork (aislado)           │
├─ Múltiples equipos, costos sep.  │ /team (experimental)      │
├─ Salida <1s required             │ Agent SDK Loop            │
├─ Salida 30s+ ok                  │ /task + Batch API         │
├─ Flujo multi-step complejo       │ Agent Loop + Skills + MCP │
└─ Necesito publicar servidor       │ mpak + GitHub Actions     │
```

---

**Próximos pasos:**
1. Toma 1 proyecto real
2. Responde 7 decision trees
3. Escribe test case (TDD)
4. Implementa
5. Compara con checklist

**Certificación:** 3 proyectos completados con <14/16 = ✅ Decision Architect

---

**Recursos complementarios:**
- nivel4-commands-reference.md (detalle de cada comando)
- nivel4-marketplace-guide.md (MCP servers específicos)
- nivel4-integration-examples.md (casos reales de decisión)
- batch-api-guide.md (cuándo usar vs Agent Loop)
