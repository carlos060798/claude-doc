# Observabilidad — Nivel 6

> Métricas clave (tokens, latencia, error rate). Logging estructurado. Integración Datadog/Grafana. Dashboards y alertas.

## Introducción

A escala masiva, necesitas visibilidad completa. Esta sección cubre:

- Métricas clave para Claude Code
- Logging estructurado (JSON, structured fields)
- Integración con observabilidad (Datadog, Grafana, Prometheus)
- Dashboards en tiempo real
- Alertas y anomalías

**Tiempo estimado:** 120 minutos  
**Requisitos:** Experiencia observabilidad (Datadog/Prometheus/Grafana)  
**Nivel de dificultad:** Avanzado

---

## 1. Métricas Clave

### Métricas "Cuatro Dorados"

| Métrica | Unidad | Objetivo | Alerta |
|---------|--------|----------|--------|
| **Latency** (P50, P95, P99) | ms | <2000ms (P95) | >3000ms |
| **Traffic** (tokens/min) | tokens/s | <10K/s por dev | >50K/s |
| **Errors** (rate) | % | <1% | >5% |
| **Saturation** (queue depth) | requests | <100 in flight | >200 in flight |

### Métricas específicas Claude Code

```yaml
claude_code_metrics:
  
  # Tokens
  tokens_input_total:
    type: counter
    labels: [model, team, user_id]
    description: "Total input tokens procesados"
  
  tokens_output_total:
    type: counter
    labels: [model, team, user_id]
  
  tokens_per_request:
    type: histogram
    buckets: [100, 1000, 10000, 100000]
    description: "Distribución tokens por request"
  
  # Latencia
  request_duration_ms:
    type: histogram
    buckets: [100, 500, 1000, 2000, 5000, 10000]
    percentiles: [50, 95, 99]
    labels: [model, task_type, team]
  
  time_to_first_token_ms:
    type: histogram
    description: "Tiempo hasta primer token (TTFT)"
  
  # Errores
  errors_total:
    type: counter
    labels: [error_type, model, team]
    error_types: [rate_limit, timeout, invalid_input, hallucination, network]
  
  error_rate:
    type: gauge
    description: "% requests que fallan"
  
  # Costo
  cost_per_request_usd:
    type: histogram
    labels: [model, task_type]
  
  cost_per_team_usd:
    type: gauge
    labels: [team_id]
  
  # Uso
  active_users_current:
    type: gauge
    description: "Users usando Claude Code ahora"
  
  requests_per_user_daily:
    type: histogram
    labels: [team]
  
  # Calidad
  hallucination_detected:
    type: counter
    labels: [model, severity]
  
  code_quality_score:
    type: gauge
    labels: [model, task_type]
    range: [0, 100]
```

---

## 2. Logging Estructurado

### Formato JSON

```javascript
// logger.js
const logger = {
  logRequest(request) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "INFO",
      event: "claude_code_request",
      
      // Identificadores
      request_id: request.id,
      user_id: request.user_id,
      team_id: request.team_id,
      
      // Entrada
      model: request.model,
      task_type: request.task_type,  // "code_review", "refactor", etc
      input_tokens: request.input_tokens,
      
      // Contexto
      source: request.source,  // "cli", "api", "ide"
      version: request.version,
      
      // Resultado
      status: "pending",
      duration_ms: null,
      
      // Muestreo
      sample_rate: 0.1
    }));
  },
  
  logResponse(response) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "INFO",
      event: "claude_code_response",
      
      request_id: response.request_id,
      status: response.status,  // "success", "error", "timeout"
      
      // Resultado
      output_tokens: response.output_tokens,
      duration_ms: response.duration_ms,
      cost_usd: response.cost_usd,
      
      // Performance
      ttft_ms: response.time_to_first_token_ms,
      queue_time_ms: response.queue_time_ms,
      
      // Calidad
      stop_reason: response.stop_reason,  // "end_turn", "max_tokens", "tool_use"
      
      ...(response.error && {
        error: {
          type: response.error.type,
          message: response.error.message,
          code: response.error.code,
          retry_after_ms: response.error.retry_after_ms
        }
      })
    }));
  },
  
  logError(error) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "ERROR",
      event: "claude_code_error",
      
      request_id: error.request_id,
      error_type: error.type,  // "RateLimitError", "TimeoutError", etc
      error_message: error.message,
      error_code: error.code,
      
      // Stack trace
      stack: error.stack,
      
      // Contexto
      user_id: error.user_id,
      team_id: error.team_id,
      model: error.model,
      
      // Recuperación
      retryable: error.retryable,
      retry_count: error.retry_count,
      retry_after_ms: error.retry_after_ms
    }));
  }
};

module.exports = logger;
```

### Nivel de logs

```yaml
log_levels:
  DEBUG:  # Desarrollo solo
    - request payload completo
    - token breakdown
    - cache hits/misses
    - benchmark resultados
  
  INFO:  # Producción normal
    - request iniciado
    - request completado
    - cambios en state
    - nuevos usuarios/teams
  
  WARN:  # Anomalías
    - latencia > 5000ms
    - costo inesperado (> budget 110%)
    - rate limiting cercano
    - cola > 100 requests
  
  ERROR:  # Problemas
    - request falló
    - error no recuperable
    - acceso denegado
    - validación falló
  
  CRITICAL:  # Emergencia
    - sistema down
    - pérdida de datos
    - violación de seguridad
```

---

## 3. Integración Datadog

### Configuración SDK

```javascript
// datadog-logger.js
const { StatsD } = require('node-dogstatsd').StatsD;
const { v4: uuid } = require('uuid');

const dogstatsd = new StatsD({
  host: process.env.DD_AGENT_HOST || 'localhost',
  port: 8125,
  tags: [
    `service:claude-code`,
    `env:${process.env.NODE_ENV}`,
    `version:${process.env.APP_VERSION}`
  ]
});

async function trackClaudeCodeRequest(request) {
  const requestId = uuid();
  const startTime = Date.now();
  
  try {
    // Enviar métrica de inicio
    dogstatsd.increment('claude_code.requests.total', 1, {
      model: request.model,
      team_id: request.team_id,
      task_type: request.task_type
    });
    
    // Hacer request a Claude
    const response = await callClaudeAPI(request);
    
    // Registrar éxito
    const duration = Date.now() - startTime;
    
    dogstatsd.histogram('claude_code.request_duration_ms', duration, {
      model: request.model,
      status: 'success'
    });
    
    dogstatsd.gauge('claude_code.tokens.input', response.input_tokens, {
      model: request.model
    });
    
    dogstatsd.gauge('claude_code.tokens.output', response.output_tokens, {
      model: request.model
    });
    
    dogstatsd.gauge('claude_code.cost_usd', response.cost_usd, {
      model: request.model,
      team_id: request.team_id
    });
    
    // Log estructurado
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      event: 'claude_code_success',
      request_id: requestId,
      duration_ms: duration,
      input_tokens: response.input_tokens,
      output_tokens: response.output_tokens,
      cost_usd: response.cost_usd,
      model: request.model,
      user_id: request.user_id,
      team_id: request.team_id
    }));
    
    return response;
    
  } catch (error) {
    dogstatsd.increment('claude_code.errors.total', 1, {
      error_type: error.constructor.name,
      model: request.model
    });
    
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      event: 'claude_code_error',
      request_id: requestId,
      error_type: error.constructor.name,
      error_message: error.message,
      model: request.model,
      user_id: request.user_id
    }));
    
    throw error;
  }
}

module.exports = { trackClaudeCodeRequest };
```

### Datadog Agent (docker-compose)

```yaml
version: '3'

services:
  datadog-agent:
    image: datadog/agent:latest
    environment:
      DD_API_KEY: ${DATADOG_API_KEY}
      DD_SITE: datadoghq.com
      DD_APM_ENABLED: "true"
      DD_LOGS_ENABLED: "true"
      DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL: "true"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /proc/:/host/proc/:ro
      - /sys/fs/cgroup/:/host/sys/fs/cgroup:ro
    ports:
      - "8125:8125/udp"  # StatsD
      - "8126:8126/tcp"  # APM
```

---

## 4. Dashboards en Tiempo Real

### Dashboard Datadog (JSON)

```json
{
  "title": "Claude Code Observatory",
  "widgets": [
    {
      "type": "timeseries",
      "title": "Request Latency (P50, P95, P99)",
      "queries": [
        {
          "metric": "claude_code.request_duration_ms",
          "aggregator": "avg",
          "percentile": "p50"
        },
        {
          "metric": "claude_code.request_duration_ms",
          "percentile": "p95"
        },
        {
          "metric": "claude_code.request_duration_ms",
          "percentile": "p99"
        }
      ]
    },
    {
      "type": "gauge",
      "title": "Error Rate (%)",
      "query": "avg:claude_code.error_rate{*}"
    },
    {
      "type": "timeseries",
      "title": "Tokens by Model",
      "queries": [
        "avg:claude_code.tokens.input{model:opus}",
        "avg:claude_code.tokens.input{model:sonnet}",
        "avg:claude_code.tokens.input{model:haiku}"
      ]
    },
    {
      "type": "distribution",
      "title": "Cost Distribution",
      "query": "avg:claude_code.cost_per_request_usd{*}"
    },
    {
      "type": "query_value",
      "title": "Total Cost (Last 30d)",
      "query": "sum:claude_code.cost_usd{*}[30d]"
    },
    {
      "type": "heatmap",
      "title": "Token Histogram",
      "query": "avg:claude_code.tokens_per_request{*}"
    }
  ]
}
```

### Grafana Dashboard (Prometheus)

```yaml
# prometheus-rules.yml
groups:
  - name: claude_code
    interval: 30s
    rules:
      - alert: HighLatency
        expr: histogram_quantile(0.95, claude_code_request_duration_ms) > 3000
        for: 5m
        annotations:
          summary: "Claude Code P95 latency > 3s"
      
      - alert: HighErrorRate
        expr: |
          (
            rate(claude_code_errors_total[5m]) / 
            rate(claude_code_requests_total[5m])
          ) > 0.05
        for: 5m
        annotations:
          summary: "Claude Code error rate > 5%"
      
      - alert: BudgetExceeded
        expr: claude_code_cost_per_team_usd > 1.1 * claude_code_budget_per_team_usd
        for: 1h
        annotations:
          summary: "Team {{ $labels.team_id }} excedió presupuesto"
```

### Tablero visual (HTML)

```html
<!-- dashboard.html -->
<div class="dashboard">
  <div class="metric">
    <h3>Latency P95</h3>
    <div class="value" data-metric="latency_p95">
      <span class="number">--</span> ms
    </div>
  </div>
  
  <div class="metric status-warning">
    <h3>Error Rate</h3>
    <div class="value" data-metric="error_rate">
      <span class="number">--</span> %
    </div>
  </div>
  
  <div class="metric">
    <h3>Daily Cost</h3>
    <div class="value" data-metric="cost_daily">
      $<span class="number">--</span>
    </div>
  </div>
  
  <div class="chart">
    <canvas id="latency-chart"></canvas>
  </div>
  
  <div class="chart">
    <canvas id="error-chart"></canvas>
  </div>
</div>

<script>
async function fetchMetrics() {
  const response = await fetch('/api/metrics');
  const data = await response.json();
  
  document.querySelector('[data-metric="latency_p95"] .number')
    .textContent = data.latency_p95.toFixed(0);
  
  document.querySelector('[data-metric="error_rate"] .number')
    .textContent = (data.error_rate * 100).toFixed(2);
  
  // Actualizar cada 10s
  setTimeout(fetchMetrics, 10000);
}

fetchMetrics();
</script>
```

---

## 5. Alertas y Anomalías

### Reglas de alerta (Datadog)

```
Alert 1: High Latency
├─ Condition: P95 latency > 3000ms
├─ Duration: 5 min sustained
├─ Recipients: #alerts-claude-code
└─ Action: auto-rollback si disponible

Alert 2: Error Rate Spike
├─ Condition: > 5% requests error
├─ Baseline: último 1h
├─ Recipients: oncall engineer
└─ Urgency: HIGH

Alert 3: Budget Exceeded
├─ Condition: team cost > budget × 1.1
├─ Frequency: Diaria a las 9am
├─ Recipients: team lead
└─ Urgency: MEDIUM

Alert 4: Rate Limiting
├─ Condition: 429 responses > 10/min
├─ Recipients: #ops
└─ Action: aumentar cuota si persistente

Alert 5: Hallucination Detected
├─ Condition: código generado fail tests
├─ Baseline: < 5% histórico
├─ Recipients: ML team
└─ Action: investigar modelo
```

### Detección de anomalías

```python
# anomaly_detector.py
import numpy as np
from scipy import stats

class AnomalyDetector:
    def __init__(self, baseline_window_hours=24):
        self.baseline_window = baseline_window_hours
        self.baseline = None
    
    def update_baseline(self, metrics):
        """Calcular baseline (promedio + desv. est)"""
        self.baseline = {
            'latency_mean': np.mean(metrics['latency']),
            'latency_std': np.std(metrics['latency']),
            'error_mean': np.mean(metrics['error_rate']),
            'error_std': np.std(metrics['error_rate']),
        }
    
    def detect(self, current_metric):
        """Detectar anomalía usando Z-score"""
        z_score = abs(
            (current_metric - self.baseline['latency_mean']) / 
            self.baseline['latency_std']
        )
        
        if z_score > 3:  # > 3 desv. est = anomalía
            severity = "CRITICAL" if z_score > 5 else "WARNING"
            return {
                'is_anomaly': True,
                'z_score': z_score,
                'severity': severity,
                'recommendation': self._recommend_action(z_score)
            }
        
        return {'is_anomaly': False}
    
    def _recommend_action(self, z_score):
        if z_score > 5:
            return "Check Anthropic API status, consider fallback"
        elif z_score > 3:
            return "Monitor closely, may auto-resolve"
        else:
            return "Continue monitoring"
```

---

## 6. SLO y Error Budget

### Definir SLOs

```yaml
SLOs:
  
  availability:
    target: 99.9%  # 43 min downtime/mes
    window: monthly
    metric: uptime_percent
  
  latency:
    - target: P50 < 500ms
      target: P95 < 2000ms
      target: P99 < 5000ms
    window: daily
  
  error_rate:
    target: < 1%
    window: daily
    exemptions:
      - rate limiting (customer error)
      - invalid input (customer error)
  
  cost_per_token:
    target: baseline (no increase > 5%)
    window: monthly
```

### Error budget (99.9% SLO)

```
Mensual (30 días = 43,200 minutos):
- Budget: 43.2 min downtime
- Gasto actual: 5 min
- Restante: 38.2 min

Uso:
- Maintenance (planificado): 10 min ✓
- Incidents (no planificado): 5 min ✓
- Riesgo (restante): 28.2 min

Decisión:
- Si < 10 min restante: freeze nuevas features
- Si < 5 min: solo hotfixes críticos
- Si negativo: revisión post-mortem requerida
```

---

## 7. Incident Response Basado en Observabilidad

### Playbook automático (si anomalía detectada)

```yaml
incident_response:
  trigger: metric_anomaly
  
  level_1_immediate:
    - page_oncall: true
    - create_incident: true
    - notify_slack: "#incidents"
    - capture_metrics: true
    - capture_logs: last_5_minutes
  
  level_2_investigation:
    - check_api_status: anthropic.com
    - check_queue_depth: current
    - check_error_logs: last_30_min
    - correlation_analysis: latency vs error_rate
  
  level_3_mitigation:
    - action_if_rate_limit: request_quota_increase
    - action_if_latency: consider_fallback_model (haiku)
    - action_if_error: rollback_last_deploy
    - action_if_unknown: escalate_to_cto
  
  level_4_recovery:
    - verify_metrics: normal_again
    - send_update: all stakeholders
    - create_postmortem: within_24h
    - track_action_items: jira
```

---

## Resumen

**5 ideas clave:**
1. **Cuatro Dorados** (latency, traffic, errors, saturation) son base
2. **Logging estructurado** (JSON) es clave para análisis
3. **Integración Datadog/Grafana** = visibilidad total
4. **Alertas automáticas** previenen sorpresas
5. **SLOs y error budgets** alinean con negocio

**Próximo:** Nivel 6 → Patrones Arquitectónicos

---

## Referencia rápida

```
MÉTRICAS CRÍTICAS:
- Latency P95: objetivo < 2000ms
- Error rate: objetivo < 1%
- Costo por token: tracking
- Saturation: < 200 in-flight

LOGGING:
- JSON structured logs
- request_id para tracing
- Redactar credenciales SIEMPRE

ALERTING:
- P95 latency > 3s: WARNING
- Error rate > 5%: CRITICAL
- Budget exceeded: MEDIUM
```

**Estado:** Lección completada. Próximo checkpoint: Quiz Nivel 6.
