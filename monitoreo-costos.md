# Monitoreo de Costos — Nivel 4

> Herramientas de tracking. Alertas por presupuesto. ROI por equipo. Reportes mensuales. Cost optimization.

## Introducción

"¿A cuánto me cuesta Claude Code realmente?" Esta sección cubre:

- Herramientas de tracking
- Alertas automáticas
- ROI por equipo/proyecto
- Reportes detallados
- Optimización continua

**Tiempo estimado:** 60 minutos  
**Requisitos:** Acceso console.anthropic.com, familiaridad con billing  
**Nivel de dificultad:** Intermedio

---

## 1. Herramientas de Tracking

### Opción 1: Console Nativa (Anthropic)

```
console.anthropic.com/usage

✓ Interfaces built-in
✓ Datos en tiempo real
✓ CSV export
✓ Alertas básicas

✗ Limited customization
✗ No predicción
✗ Datos solo 90 días
```

### Opción 2: Integración Datadog

```javascript
// datadog-cost-tracker.js
const { StatsD } = require('node-dogstatsd').StatsD;

const dogstatsd = new StatsD({
  host: 'localhost',
  port: 8125
});

// Cada request a Claude
function trackCost(response) {
  const cost = calculateCost(response);
  
  dogstatsd.gauge('claude_code.cost_per_request_usd', cost, {
    model: response.model,
    team: response.team,
    task_type: response.task_type
  });
}

// Dashboard Datadog vé esto en tiempo real
```

### Opción 3: Script CLI Custom

```bash
#!/bin/bash
# cost-report.sh

API_KEY=$ANTHROPIC_API_KEY
ORG_ID=$ANTHROPIC_ORG_ID

# Obtener uso últimos 30 días
curl -X GET "https://api.anthropic.com/v1/usage" \
  -H "X-API-Key: $API_KEY" \
  -H "X-Anthropic-Org-Id: $ORG_ID" \
  --data '{"period": "last_30_days"}' \
  | jq '.cost_usd, .tokens'

# Output:
# 145.23 (cost)
# 12500000 (tokens)
```

### Opción 4: Webhook + Slack

```javascript
// webhook-cost-alert.js
const express = require('express');
const slack = require('@slack/webhook');

app.post('/webhook/anthropic-usage', (req, res) => {
  const { usage, cost } = req.body;
  
  if (cost > process.env.MONTHLY_BUDGET * 0.75) {
    // 75% threshold
    slack.send({
      text: `⚠️ Claude Code cost warning`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Current cost: $${cost.toFixed(2)} / month
            Budget: $${process.env.MONTHLY_BUDGET}
            Tokens: ${usage.toLocaleString()}`
          }
        }
      ]
    });
  }
  
  res.json({ ok: true });
});
```

---

## 2. Alertas por Presupuesto

### Configurar en console

```
console.anthropic.com/billing/alerts

1. Click "Create Alert"
2. Threshold: $500/mes
3. Notify: {{ team_emails }}
4. Action: Auto-disable si > 110% (opcional)
```

### Configuración programática

```javascript
// setup-alerts.js
const anthropic = require('@anthropic-ai/sdk');

async function setupBudgetAlerts() {
  const alerts = await anthropic.billing.alerts.create({
    monthly_limit_usd: 500,
    threshold_percentages: [50, 75, 90, 100, 110],
    notifications: {
      email: ['tech-lead@company.com', 'finance@company.com'],
      slack: '#budget-alerts',
      webhook: 'https://company.com/webhook/billing'
    },
    actions_on_exceed: {
      at_100_percent: 'NOTIFY',
      at_110_percent: 'NOTIFY',
      at_150_percent: 'DISABLE'  // Opcional: bloquear
    }
  });
  
  return alerts;
}
```

### Niveles de alerta

```yaml
Threshold 50%:
  - Cost: $250
  - Action: Informational email
  - Urgency: LOW

Threshold 75%:
  - Cost: $375
  - Action: Email + Slack message
  - Urgency: MEDIUM
  - Recommendation: Review usage patterns

Threshold 90%:
  - Cost: $450
  - Action: Page tech lead (if after hours)
  - Urgency: HIGH
  - Recommendation: Audit teams, optimize

Threshold 100%:
  - Cost: $500
  - Action: Escalate to management
  - Urgency: CRITICAL
  - Recommendation: Immediate cost-cutting
```

---

## 3. ROI por Equipo/Proyecto

### Matriz de ROI (ejemplo real)

```
╔════════════════════════════════════════════════════════════════════╗
║ Team / Project     │ Cost  │ Hours Saved │ Value    │ ROI    │ ✓  ║
╠════════════════════════════════════════════════════════════════════╣
║ Backend (team)     │ $85   │ 40h         │ $2,400   │ 2,700% │ ✓✓ ║
║ Frontend (team)    │ $60   │ 25h         │ $1,500   │ 2,400% │ ✓✓ ║
║ DataPlatform (proj)│ $120  │ 30h         │ $1,800   │ 1,400% │ ✓  ║
║ MobileApp (proj)   │ $45   │ 15h         │ $900     │ 1,900% │ ✓  ║
║ Migration (proj)   │ $200  │ 80h         │ $4,800   │ 2,300% │ ✓✓ ║
╠════════════════════════════════════════════════════════════════════╣
║ TOTAL              │$510   │ 190h        │$11,400   │ 2,135% │ ✓✓ ║
╚════════════════════════════════════════════════════════════════════╝

Supuestos:
- Dev sénior: $60/h
- Dev junior: $30/h
- Promedio: $40/h
```

### Cálculo de horas ahorradas

```javascript
function calculateROI(team, period = 'month') {
  // 1. Obtener tokens gastados
  const tokens = getTokensUsed(team, period);
  
  // 2. Calcular costo
  const costUSD = tokens / 1_000_000 * MODEL_PRICE;
  
  // 3. Estimar horas ahorradas
  // Típicamente: 1M tokens = 40h ahorradas (varía por tarea)
  const hoursAvoided = (tokens / 1_000_000) * 40;
  
  // 4. Calcular valor
  const avgSalary = team.avgDeveloperHourlyRate || 50;
  const valueUSD = hoursAvoided * avgSalary;
  
  // 5. ROI
  const roi = ((valueUSD - costUSD) / costUSD) * 100;
  
  return {
    cost: costUSD,
    hoursAvoided,
    value: valueUSD,
    roi: roi,
    recommendation: roi > 1000 ? 'EXPAND' : roi > 500 ? 'MAINTAIN' : 'OPTIMIZE'
  };
}
```

### Dashboard ROI (HTML)

```html
<div class="roi-dashboard">
  <div class="card">
    <h3>Backend Team</h3>
    <div class="metric">
      <span class="label">Cost:</span>
      <span class="value">$85</span>
    </div>
    <div class="metric">
      <span class="label">Value:</span>
      <span class="value">$2,400</span>
    </div>
    <div class="metric">
      <span class="label">ROI:</span>
      <span class="value roi-2700">2,700% ✓✓</span>
    </div>
  </div>
  
  <!-- Repeat para cada equipo -->
</div>
```

---

## 4. Reportes Mensuales

### Template de reporte

```markdown
# Claude Code Cost Report — Mayo 2026

## Resumen Ejecutivo

| Métrica | Value |
|---------|-------|
| Total Cost | $510 |
| Tokens | 12.3M |
| Hours Saved | 190h |
| Value Generated | $11,400 |
| **ROI** | **2,135%** |

## Breakdown por Equipo

### Backend (7 devs)
- Cost: $85 (17%)
- Hours saved: 40h
- Top task: Code review (20h)
- Trend: ↑ 20% semana a semana
- Recommendation: EXPAND usage

### Frontend (6 devs)
- Cost: $60 (12%)
- Hours saved: 25h
- Top task: Testing (15h)
- Trend: → Estable
- Recommendation: MAINTAIN

### DataPlatform (4 devs)
- Cost: $120 (24%)
- Hours saved: 30h
- Top task: Refactoring (18h)
- Trend: ↑ Nuevo proyecto
- Recommendation: MONITOR

## Billing Forecast

Basado en tendencias actuales:
- Juni esperado: $550 (+8%)
- Julio esperado: $580 (+5%)
- Trim 2 proyección: $1,640

Budget anual: $6,000
Forecast anual: $6,240
Status: ⚠️ SLIGHT OVERAGE (4%)

### Recomendaciones

1. **Mantener usage** en Backend/Frontend
2. **Optimizar DataPlatform** (revisar casos de uso)
3. **Considerar Haiku** para tareas simples (-60% costo)
4. **Implementar context caching** (10-15% ahorro)
```

### Automatizar reporte

```javascript
// generate-monthly-report.js
async function generateMonthlyReport() {
  const data = await fetchBillingData();
  
  const html = renderTemplate(REPORT_TEMPLATE, {
    cost: data.total_cost,
    tokens: data.total_tokens,
    teams: data.teams_breakdown,
    forecast: calculateForecast(data),
    recommendations: generateRecommendations(data)
  });
  
  // Enviar por email
  await emailReport(html, {
    to: ['cto@company.com', 'finance@company.com'],
    cc: ['tech-leads@company.com'],
    subject: `Claude Code Report — ${getCurrentMonth()}`
  });
  
  // Guardar en dashboard
  await saveToDatabase(html);
}

// Ejecutar mensualmente (primer día del mes)
cron.schedule('0 9 1 * *', generateMonthlyReport);
```

---

## 5. Optimización Continua

### Pasos para reducir costos (sin perder calidad)

#### Paso 1: Auditar uso actual (1h)

```bash
# Ver distribution de tokens por modelo
curl -s 'https://console.anthropic.com/api/usage/by-model' \
  -H "Authorization: Bearer $API_KEY" \
  | jq '.[] | {model, tokens, cost}'

# Típico:
# ├─ Opus: 40% tokens, 60% cost
# ├─ Sonnet: 50% tokens, 35% cost
# └─ Haiku: 10% tokens, 5% cost
```

#### Paso 2: Cambiar a Haiku donde posible (10-20% ahorro)

```javascript
// Antes:
async function analyzeError(errorMsg) {
  return await claude.opus.analyze(errorMsg);
}

// Después: Use Haiku para análisis simple
async function analyzeError(errorMsg) {
  if (errorMsg.length < 500) {
    // Simple error → Haiku
    return await claude.haiku.analyze(errorMsg);
  } else {
    // Complex error → Opus
    return await claude.opus.analyze(errorMsg);
  }
}

// Ahorro: Si 50% requests son simples
// Costo: -60% en esos requests = -30% total
```

#### Paso 3: Implementar context caching (10-15% ahorro)

```javascript
// Con caching
const systemPrompt = `You are a code reviewer...`;
const cachedResponse = await claude.review(code, {
  system: [{
    type: 'text',
    text: systemPrompt,
    cache_control: { type: 'ephemeral' }  // Cache 5 min
  }]
});

// Beneficio:
// Request 1: $0.30 (sin cache)
// Request 2-5: $0.10 c/u (82% descuento tokens)
// Promedio: $0.15 (50% ahorro)
```

#### Paso 4: Batch processing (hasta 90% ahorro)

```javascript
// Sin batch: 100 requests pequeños
const reviews = await Promise.all(
  files.map(file => claude.review(file))
  // Cost: 100 × $0.05 = $5
);

// Con batch: 1 request grande
const reviews = await claude.batchReview(files, {
  mode: 'batch',
  callback_url: 'https://company.com/webhook'
  // Cost: $0.50 (1 request)
  // Ahorro: 90%
  // Trade-off: Latencia 10-60 min (acceptable para overnight)
});
```

#### Paso 5: Optimizar prompts (15-25% ahorro)

```javascript
// Prompt ineficiente (mucho contexto innecesario)
const prompt = `
Tienes estos 5 archivos. El contexto histórico es...
[5000 palabras de contexto]
Ahora revisa el código [código actual]
`;

// Prompt optimizado
const prompt = `
Code review checklist:
- Security issues
- Performance bottlenecks
- Test coverage gaps

${code}
`;

// Tokens: 2000 → 500 (75% reducción)
// Calidad: La misma (más preciso)
```

---

## 6. Checklist de Optimización Mensual

```markdown
# Monthly Cost Optimization Checklist

- [ ] **Audit**: ¿Dónde gastamos más? (modelo, equipo, tarea)
- [ ] **Haiku**: ¿Puedo cambiar Opus → Sonnet → Haiku?
- [ ] **Caching**: ¿Hay requests repetidas (candidato cache)?
- [ ] **Batch**: ¿Hay 20+ requests pequeños?
- [ ] **Prompts**: ¿Puedo reducir contexto 20%?
- [ ] **Feedback**: ¿Qué dice el equipo? (útil vs expensive)
- [ ] **ROI**: ¿Sigue > 300%?
- [ ] **Report**: ¿Actualizar pronóstico anual?
- [ ] **Action**: ¿Implementar 1-2 optimizaciones?
```

---

## Resumen

**5 ideas clave:**
1. **Tracking en tiempo real** previene sorpresas
2. **Alertas automáticas** reaccionan rápido
3. **ROI visible** convence stakeholders
4. **Reportes claros** mantienen confianza
5. **Optimización continua** = máximo value

**Próximo:** Nivel 4 → Incident Response

---

## Referencia rápida

```
COST BREAKDOWN TÍPICO:
- Haiku: 10% uso, 5% costo (cheap)
- Sonnet: 50% uso, 35% costo (balanced)
- Opus: 40% uso, 60% costo (powerful)

OPTIMIZACIÓN RÁPIDA:
1. Haiku para tareas simples → -30% costo
2. Context caching → -15% costo
3. Batch processing (si aplicable) → -70% costo
4. Prompt optimization → -20% tokens

ROI TÍPICO:
- Mala implementación: 100-200%
- Buena implementación: 500-1000%
- Excelente: 2000%+

PRESUPUESTO RECOMENDADO:
- 1-5 devs: $200-500/mes
- 5-20 devs: $500-2000/mes
- 20+ devs: $2000+/mes (escala)
```

**Estado:** Lección completada. Próximo checkpoint: Quiz Nivel 4.
