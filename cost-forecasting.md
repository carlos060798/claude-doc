# L5.7: Cost Forecasting & Operations
## De "cuesta mucho" a "presupuesto validado"

---

## Introducción: De $10k/mes a $3k/mes = Ahorros 70%

El costo no es destino. Es una variable que controlas.

En este módulo aprenderás:
- Modelar costos con precisión (fórmula simple)
- Forecasting 90% accuracy
- Dividir presupuesto entre teams
- Calcular ROI operacional
- 8 técnicas de optimización
- Monitoreo en producción

**Meta**: Presupuesto validado, ROI claro, costo predecible.

---

## Sección 1: Cost Modeling 101

### Fórmula Simple (Opus, Sonnet, Haiku)

```
Total Cost = (input_tokens × $0.003) 
           + (cache_write × $0.00375) 
           + (cache_read × $0.0003)
           + (output_tokens × $0.015)
```

**Desglose para Sonnet-4.5** (precios May 2026):
- Input: $3 per 1M tokens
- Cache write: $3.75 per 1M tokens (one-time)
- Cache read: $0.30 per 1M tokens (fast + cheap)
- Output: $15 per 1M tokens

**Ejemplo real:**
```
Request:
- Input: 5,000 tokens → $0.015
- Cache write: 2,000 tokens → $0.0075
- Output: 500 tokens → $0.0075
Total: $0.030 per request
```

### 5 Palancas de Costo

**Palanca 1: Model Choice** (3x variación)
- Opus: $15/$45 in/out (máxima calidad)
- Sonnet: $3/$15 in/out (mejor ratio)
- Haiku: $0.80/$4 in/out (economía)

**Palanca 2: Caching** (40-60% ahorros)
- First call: Pagar write cost
- Subsequent: Descuento 90% (read cost)
- Break-even: 3 requests

**Palanca 3: Batch Size** (20-30% ahorros)
- Batch API: 50% descuento
- Trade-off: 24h latencia

**Palanca 4: Context Compression** (25-35% ahorros)
- Eliminar contexto redundante
- Resumen ejecutivo en lugar de full transcript

**Palanca 5: Agent Reuse** (10-20% ahorros)
- Reutilizar agent instance (memoria caché)
- vs creating new agent cada request

### Tabla: Costo/minuto por Modelo (Escenarios Reales)

| Escenario | Opus | Sonnet | Haiku | Nota |
|-----------|------|--------|-------|------|
| Summarization (10k tokens) | $0.30 | $0.06 | $0.015 | Haiku ideal |
| Code review (50k tokens) | $1.50 | $0.30 | $0.075 | Sonnet balance |
| Research (200k tokens) | $6.00 | $1.20 | $0.30 | Costo puede escalar |
| Cached (repeat 3x) | $0.25 | $0.05 | $0.012 | Con cache hit |
| Batch (50 requests) | $3.00 | $0.60 | $0.15 | Con 50% descuento |

---

## Sección 2: Forecasting Methodology

### 3-Paso: Baseline → Optimize → Validate

**Paso 1: Baseline**
```
Recopilar datos últimos 30 días:
- Total requests: 100,000
- Avg tokens/request: 5,000 input
- Avg output: 500 tokens
- Error rate: 2% (reintentos)

Cálculo:
(100,000 × 5,000 × $0.003) + (100,000 × 500 × $0.015) = $2,250
```

**Paso 2: Optimize**
```
Aplicar 5 mejoras:
- Caching: -40% → $1,350
- Batch API: -20% → $1,080
- Haiku para simple: -30% → $756
- Context compression: -15% → $642
- Agent pooling: -10% → $578
```

**Paso 3: Validate**
```
Predecir próximo mes:
Forecast: $578 × 1.1 (growth buffer) = $636
Real (posterior): $612
Accuracy: 96.2%
```

### Herramienta: Spreadsheet Template (Copy-Paste Ready)

**Columnas:**
- A: Métrica (requests, tokens, error_rate)
- B: Baseline (valores día 1)
- C: Forecast (predicción)
- D: Actual (real después)
- E: Variance (%)

**Fórmulas:**
```
C (Forecast) = B × Growth_Rate × Cost_Per_Request
E (Variance) = (D - C) / C
```

### Histórico: Predijimos $8k, Real $7.2k (90% Accuracy)

**Enero:**
- Forecast: $8,000
- Real: $7,200
- Variance: -10%
- Causas: Menos traffic, mejor cache

**Febrero:**
- Forecast: $7,200 × 1.05 = $7,560
- Real: $7,480
- Variance: -1.05%
- Accuracy: 98.9%

---

## Sección 3: Budget Allocation Across Teams

### Cómo Dividir Presupuesto

Asignación típica por equipo (% del total budget):
- **R&D**: 30% (experimentation, nuevas features)
- **Production**: 40% (core features, usuarios actuales)
- **Experimentation**: 30% (testing, AI exploration)

**Ejemplo: Budget total $10,000/mes**
- R&D: $3,000
- Production: $4,000
- Experimentation: $3,000

### Governance: Alert Thresholds & Escalation

**Tier 1 Alert**: Team gastó 75% budget
- Action: Email a team lead
- Slack notification

**Tier 2 Alert**: Team gastó 90% budget
- Action: Freeze new features (use Haiku only)
- Escalate to manager

**Tier 3 Alert**: Team gastó 100% budget
- Action: STOP all non-critical requests
- Emergency meeting

### Caso: "Equipo B gastó 3x budget en 2 semanas"

**Timeline:**
- Week 1: Equipo B asignado $500 budget
- Day 3: Gastó $250 (on track)
- Day 5: Gastó $500 (100%)
- Day 7: Gastó $1,200 (240%)
- Day 8: Alert: "Over budget by 140%"

**Root Cause:**
- Agent con retry loop (3-5 intentos)
- Hook failing constantemente
- Cada fallo = 5 reintentos

**Fix:**
- Deshabilitar retry en production
- Implementar exponential backoff
- Alert en caso de error rate > 5%

**Resultado:**
- Budget bajó a $600 (reasignación)
- Error rate después fix: 0.5%

---

## Sección 4: ROI Analysis

### Formula: ROI = (Time Saved - Cost) / Cost

**Fórmula expandida:**
```
ROI % = [(Horas Guardadas × Hourly Rate) - Claude Cost] / Claude Cost × 100
Breakeven: Claude Cost = Horas Guardadas × Hourly Rate
```

### Casos 5x: Dónde Vale la Pena

**Caso 1: Code Review Automation**
```
Contexto: 50 PRs/día, 30 min c/u = 25 horas/día
Claude: Revisar PR en 2 min (automated)
Cost: $0.50/PR = $25/día
Time saved: 25 horas × $50/hora = $1,250/día
ROI: ($1,250 - $25) / $25 × 100 = 4,900%

Breakeven: 2 horas (1 cost-only PR)
```

**Caso 2: Documentation Generation**
```
Contexto: Escribir docs = 1 hora/función, 20 funciones/mes
Claude: Generar docs sketch en 5 min + human review 15 min
Cost: $2/función = $40/mes
Time saved: 20 × (1 - 0.33) = 13.3 horas × $50 = $665/mes
ROI: ($665 - $40) / $40 × 100 = 1,562%

Breakeven: 5 minutos
```

**Caso 3: Test Case Generation**
```
Contexto: Escribir test = 30 min, 100 tests/sprint
Claude: Generar test scaffold en 2 min + edit 8 min = 10 min total
Cost: $0.80/test = $80/sprint
Time saved: 100 × (0.5 - 0.17) = 33 horas × $80 = $2,640/sprint
ROI: ($2,640 - $80) / $80 × 100 = 3,200%

Breakeven: 1 minuto
```

**Caso 4: Bug Investigation**
```
Contexto: Debug issue = 2 horas, 5 issues/sprint
Claude: Analyze + suggest fixes = 10 min per issue
Cost: $1.50/issue = $7.50/sprint
Time saved: 5 × (2 - 0.17) = 9.15 horas × $80 = $732/sprint
ROI: ($732 - $7.50) / $7.50 × 100 = 9,660%

Breakeven: 30 segundos
```

**Caso 5: API Documentation**
```
Contexto: Write API docs = 4 horas, 10 APIs/quarter
Claude: Generate from code + human review = 30 min total
Cost: $5/API = $50/quarter
Time saved: 10 × (4 - 0.5) = 35 horas × $50 = $1,750/quarter
ROI: ($1,750 - $50) / $50 × 100 = 3,400%

Breakeven: 1 minuto
```

---

## Sección 5: Cost Optimization Playbook

### 8 Técnicas Ordenadas por Effort vs Impact

**Matriz (Effort bajo, Impact alto):**

```
       IMPACT
       High
        ↑
        │  [Caching]    [Batch API]
        │  [Compression] [Model Selection]
        │
        │  [Agent Pooling] [Monitoring]
        └─────────────────────────→ EFFORT
```

### Deep Dives: Top 3 Técnicas

**Técnica 1: Caching (40% ahorro)**

Antes:
```
Request 1: "Summarize documento X" → 2,000 tokens
Request 2: "Summarize documento X" → 2,000 tokens (again!)
Cost: $0.12

Con cache:
Request 1: Write cache = 2,000 × $0.00375 = $0.0075
Request 2: Read cache = 2,000 × $0.0003 = $0.0006
Cost: $0.0081 → 93% más barato
```

**Implementación:**
```javascript
const claude = new Anthropic({
  defaultHeaders: {
    'Cache-Control': 'max-age=300'
  }
});

const response = await claude.messages.create({
  model: 'claude-sonnet-4-5',
  system: LARGE_SYSTEM_PROMPT, // Cacheado
  messages: [{ role: 'user', content: input }],
  max_tokens: 1024
});
```

**Técnica 2: Batch API (20% ahorro + 24h latencia)**

Antes:
```
100 requests = 100 API calls = $100
Latencia: Inmediata
```

Después:
```
100 requests en batch = 1 API call
Cost: $50 (50% descuento)
Latencia: 24h (aceptable para analytics, reporting)
```

**Técnica 3: Context Compression (25% ahorro)**

Antes:
```
System prompt: 5,000 tokens (verbose)
Request context: 3,000 tokens (full history)
Total: 8,000 tokens × $0.003 = $0.024/request
```

Después:
```
System prompt: 1,500 tokens (extracto clave)
Request context: 1,000 tokens (resumen, no full)
Total: 2,500 tokens × $0.003 = $0.0075/request
Ahorro: 69%
```

### Antes/Después Code para c/u

**Caching Before/After:**
```javascript
// BEFORE: Sin cache
for (let i = 0; i < 100; i++) {
  const r = await claude.messages.create({
    system: 'You are helpful',
    messages: [...]
  });
  totalCost += 0.024; // $2.40
}

// AFTER: Con cache
const response = await claude.messages.create({
  model: 'claude-sonnet-4-5',
  system: 'You are helpful', // Cacheado
  messages: [...]
});
for (let i = 0; i < 100; i++) {
  const r = await claude.messages.create({
    system: 'You are helpful', // Cache hit
    messages: [...]
  });
  totalCost += 0.002; // $0.20 → 92% cheaper
}
```

**Batch Before/After:**
```javascript
// BEFORE: Individual requests
const requests = [...]; // 100 requests
for (const req of requests) {
  const result = await claude.messages.create(req);
  totalCost += req.estimatedCost; // $100
}

// AFTER: Batch
const batch = await claude.batches.create({
  requests: requests.map(r => ({
    custom_id: r.id,
    params: r
  }))
});
// Results available in 24h
// Cost: $50 (50% discount)
```

**Compression Before/After:**
```javascript
// BEFORE: Full context
const systemPrompt = `You are Claude...
With expertise in: [200 lines of capabilities]
Your instructions: [500 lines of rules]
History so far: [${history.join('\n')}]
`; // 5,000 tokens

// AFTER: Compressed
const systemPrompt = `You are Claude. 
Expertise: Coding, Data, Writing.
Key rule: Be concise.
Relevant history: [Last 3 exchanges only]
`; // 1,500 tokens
```

### Caso Real: "Aplicamos 5 técnicas → 69.7% ahorro"

**Initial state:**
- Monthly cost: $10,000
- Requests: 100,000
- Cost/request: $0.10

**Optimizations applied:**
1. **Caching**: $10k → $6.5k (-35%)
2. **Model downgrade (Opus → Sonnet)**: $6.5k → $5.2k (-20%)
3. **Batch API for analytics**: $5.2k → $4.5k (-15%)
4. **Context compression**: $4.5k → $3.8k (-16%)
5. **Agent pooling**: $3.8k → $3.0k (-21%)

**Final state:**
- Monthly cost: $3,000
- Cost/request: $0.03
- **Total savings: 70%**

---

## Sección 6: Production Cost Monitoring

### Dashboards: Métricas a Trackear

**Métrica 1: Cost per Request**
```
Formula: Total Cost / Total Requests
Alert if: Cost per request > baseline × 1.5
Example: Baseline $0.03 → Alert at $0.045
```

**Métrica 2: Cost per Feature**
```
Formula: (API costs + infrastructure) / Feature count
Shows: Which features are "expensive"
Action: Optimize expensive features or consolidate
```

**Métrica 3: Cost per User**
```
Formula: Monthly cost / Active users
Benchmark: SaaS típico = $0.10-$1.00 per user per month
Alert if: > $5 per user (unsustainable)
```

### Alertas: Si X, trigger investigation

**Alert 1: Cost spike > 20% day-over-day**
```
IF cost_today > cost_yesterday × 1.2
THEN send Slack alert
AND trigger cost breakdown analysis
```

**Alert 2: Error rate > 5%**
```
IF error_count / total_requests > 0.05
THEN disable retries (avoid amplification)
AND page on-call engineer
```

**Alert 3: Slow P99 > baseline × 3**
```
IF p99_latency > baseline × 3
THEN check cache hit rate
AND profile CPU/memory
```

### Log Parsing: Extraer tokens reales

```javascript
// Procesar respuesta de API
const parseUsage = (response) => {
  return {
    input_tokens: response.usage.input_tokens,
    cache_creation: response.usage.cache_creation_input_tokens || 0,
    cache_read: response.usage.cache_read_input_tokens || 0,
    output_tokens: response.usage.output_tokens,
    cost: (
      response.usage.input_tokens * 0.003 +
      (response.usage.cache_creation_input_tokens || 0) * 0.00375 +
      (response.usage.cache_read_input_tokens || 0) * 0.0003 +
      response.usage.output_tokens * 0.015
    ) / 1000
  };
};

// Ejemplo de salida
// {
//   input_tokens: 1200,
//   cache_creation: 950,
//   cache_read: 0,
//   output_tokens: 150,
//   cost: $0.0369
// }
```

---

## Sección 7: Vendor Comparison

### Claude vs Groq vs OpenAI vs Llama (Tabla 1 página)

| Vendor | Input $/1M | Output $/1M | Latency | Accuracy | Cost/90% | Notes |
|--------|-----------|------------|---------|----------|----------|-------|
| Claude Sonnet | $3 | $15 | 2-3s | 95% | $0.04/req | Best balance |
| Claude Opus | $15 | $45 | 3-5s | 98% | $0.12/req | Máx calidad |
| OpenAI GPT-4 | $30 | $60 | 2s | 96% | $0.20/req | Cara |
| Groq Mixtral | $0.27 | $0.81 | 0.3s | 85% | $0.001/req | Ultra rápido |
| Llama 70B | Self-hosted | Self-hosted | 5s | 88% | $0.02/req | Privado |

### Trade-offs

**Claude Sonnet (recommended for most):**
- Pro: Quality + Cost balance, caching support
- Con: Not ultra-cheap

**Groq (for speed-critical):**
- Pro: Latencia 0.3s, barato
- Con: Lower quality, no caching

**OpenAI (for specific use cases):**
- Pro: Integrations, GPT-4 quality
- Con: 10x más caro

**Llama (for privacy/control):**
- Pro: Self-hosted, private
- Con: Manage infrastructure, lower quality

### Caso: "Cambiamos Sonnet → Haiku para summarization, -60% cost"

**Before:**
```
Task: Summarize 500 documents/día
Model: Claude Sonnet
Cost: 500 × $0.05/doc = $25/día = $750/mes
Quality: 95% accuracy (overkill for summary)
```

**After:**
```
Task: Summarize 500 documents/día
Model: Claude Haiku
Cost: 500 × $0.02/doc = $10/día = $300/mes
Quality: 88% accuracy (sufficient for summary)
Savings: $450/mes (60%)
```

---

## Cierre: Checklist "Presupuesto Validado"

**Has completado L5.7: Cost Forecasting & Operations**

Checklist final:
- ✅ Modelar costos con fórmula
- ✅ Forecasting 90% accuracy
- ✅ Dividir presupuesto entre teams
- ✅ Calcular ROI por caso
- ✅ 8 técnicas de optimización
- ✅ Monitoreo en producción
- ✅ Vendor comparison

**Benchmark esperado:**
- Antes: "¿Cuánto cuesta?" (no sabías)
- Después: "Presupuesto $X validado" (sabes exactamente)

**Próximo**: L6.2 **Enterprise Playbook** — Escalar a 200+ developers, governance, post-mortems reales, métricas de éxito.

**Checkpoint L5.7**: ✅ Completado
