# Cost Management & ROI — Nivel 2

> Precios actualizados mayo 2026. Cálculo de costos por tarea. Dashboard en console.anthropic.com. Calculadora simple. Presupuestos por equipo.

## Introducción

Claude Code está diseñado para maximizar productividad, pero sin control de costos puede escalar rápidamente. Esta sección te enseña a:

- Entender el modelo de precios actual (2026)
- Calcular ROI de automaciones
- Configurar alertas y límites
- Optimizar gasto sin perder velocidad

**Tiempo estimado:** 50 minutos  
**Requisitos:** Cuenta Anthropic con acceso a console  
**Nivel de dificultad:** Intermedio

---

## 1. Tabla de Precios (Mayo 2026)

### Modelos y Costos

| Modelo | Contexto | Input | Output | Casos de uso |
|--------|----------|-------|--------|--------------|
| **Claude 3.5 Haiku** | 200K | $0.80/MTok | $4.00/MTok | Tareas simples, análisis, CLI |
| **Claude 3.5 Sonnet** | 200K | $3.00/MTok | $15.00/MTok | Código general, refactorización |
| **Claude 3.5 Opus** | 200K | $15.00/MTok | $45.00/MTok | Investigación, arquitectura, análisis profundo |
| **Claude 4 (legacy)** | 200K | $8.00/MTok | $24.00/MTok | Tareas críticas, complejas |
| **Claude 3 Haiku** | 200K | $0.50/MTok | $2.50/MTok | Heredado (no usar) |

**Conversión:** 1 MTok = 1,000,000 tokens ≈ 750,000 palabras

### Ejemplos de Costos Reales

#### Escenario 1: Code Review (Sonnet)
```
Input:  500 líneas código × 4 tokens/línea = 2,000 tokens
Output: 300 líneas comentarios = 800 tokens
Total:  2,800 tokens = $0.0084 + $0.012 = $0.0204 (~2 centavos)
```

#### Escenario 2: Refactorización compleja (Opus)
```
Input:  3,000 líneas código + contexto = 12,000 tokens
Output: 4,000 líneas refactorizadas = 3,200 tokens
Total:  15,200 tokens = $0.228 + $0.144 = $0.372 (~37 centavos)
```

#### Escenario 3: Investigación de arquitectura (Opus)
```
Input:  Pregunta + 5 documentos = 40,000 tokens
Output: Especificación detallada = 8,000 tokens
Total:  48,000 tokens = $0.60 + $0.36 = $0.96 (~1 dólar)
```

### Promedio mensual por rol

| Rol | Promedio uso | Costo/mes | Modelos |
|-----|-------------|-----------|---------|
| Frontend dev | 500K tokens | $2.50 | Haiku, Sonnet |
| Backend dev | 800K tokens | $4.20 | Sonnet, Opus (20%) |
| Arquitecto | 1.2M tokens | $8.50 | Opus (60%), Sonnet |
| QA/Tester | 300K tokens | $1.50 | Haiku |
| Tech Lead | 2.5M tokens | $15.00 | Opus (70%), Sonnet |
| **Promedio equipo 5 dev** | **5.3M tokens** | **$32/mes** | Mixto |

---

## 2. Cálculo de ROI

### Fórmula simple

```
ROI = (Valor generado - Costo de Claude Code) / Costo total × 100%

Valor generado = Horas ahorradas × Sueldo/hora
```

### Ejemplos reales

#### Caso 1: Refactorización de legacy code

**Escenario:**
- Tiempo manual: 40 horas de dev senior ($75/h) = $3,000
- Tiempo con Claude Code: 4 horas = $300 + $2 (API)
- Total ahorro: $3,000 - $302 = $2,698

```
ROI = $2,698 / $302 × 100% = 893% ✓ EXCELENTE
```

#### Caso 2: Testing automático

**Escenario:**
- 100 funciones sin tests
- Manual: 30 horas × $60/h = $1,800
- Con Claude Code: 3 horas + $15 API = $195
- Ahorro: $1,605

```
ROI = $1,605 / $195 × 100% = 823% ✓ EXCELENTE
```

#### Caso 3: Code review asistido

**Escenario:**
- 50 PRs mensuales × 2 horas = 100 horas/mes
- Manual: $6,000/mes (QA engineer)
- Con Claude Code: 50 horas × $30/h = $1,500 + $50 API
- Total: $1,550

```
ROI = (6,000 - 1,550) / 1,550 × 100% = 287% ✓ MUY BUENO
```

#### Caso 4: Debugging (medio)

**Escenario:**
- Bug production crítico
- Manual: 6 horas × $75/h = $450
- Con Claude Code: 45 min + $5 API = $62.50
- Ahorro: $387.50

```
ROI = $387.50 / $62.50 × 100% = 620% ✓ EXCELENTE
```

### Matriz ROI por caso de uso

| Caso de uso | Esfuerzo manual | Costo API | ROI | Recomendación |
|-------------|-----------------|-----------|-----|---|
| Code review | Alto (2-4h) | Bajo ($5) | 800-1200% | USAR SIEMPRE |
| Refactorización | Muy alto (8-40h) | Medio ($20) | 900%+ | USAR SIEMPRE |
| Tests generación | Alto (4-8h) | Bajo ($10) | 500-800% | USAR SIEMPRE |
| Debugging | Medio (2-6h) | Bajo ($5) | 400-600% | USAR SIEMPRE |
| Documentación | Medio (3-5h) | Bajo ($3) | 300-500% | USAR SIEMPRE |
| Brainstorm arquitectura | Alto (6-12h) | Medio ($30) | 700%+ | USAR SIEMPRE |
| MCP/Skill custom | Muy alto (20-40h) | Medio ($50) | 1000%+ | USAR SIEMPRE |
| Traducción código | Medio (4-8h) | Bajo ($5) | 600-900% | USAR SIEMPRE |
| Análisis de seguridad | Alto (6-8h) | Medio ($20) | 500-700% | USAR SIEMPRE |
| Optimización perf | Muy alto (8-20h) | Medio ($20) | 800%+ | USAR SIEMPRE |

**Conclusión:** Casi TODO tiene ROI positivo. El costo de API es negligible vs. ahorro de horas.

---

## 3. Dashboard en console.anthropic.com

### Acceso a métricas

1. **Ir a:** https://console.anthropic.com/dashboard
2. **Sección:** "Usage" o "Billing"
3. **Vistas disponibles:**

#### Vista 1: Resumen de uso

```
Period: Last 30 days
├─ Input tokens:   5,234,000 (85%)
├─ Output tokens:  924,600 (15%)
├─ Total:          6,158,600
└─ Estimated cost: $28.50
```

#### Vista 2: Desglose por modelo

```
Claude 3.5 Sonnet
├─ Input:   3.2M tokens ($9.60)
├─ Output:  580K tokens ($8.70)
└─ Subtotal: $18.30 (64%)

Claude 3.5 Opus
├─ Input:   1.8M tokens ($27.00)
├─ Output:  280K tokens ($12.60)
└─ Subtotal: $39.60 (78%)

Claude 3.5 Haiku
├─ Input:   234K tokens ($0.19)
├─ Output:  64K tokens ($0.26)
└─ Subtotal: $0.45 (<1%)
```

#### Vista 3: Gráficos temporales

- **Línea:** Tokens por día (últimos 30 días)
- **Área:** Costo acumulado
- **Barras:** Comparativa Sonnet vs Opus

### Exportar datos

```
Formato: CSV
Incluye: Timestamp, Modelo, Tokens input, Tokens output, Costo
Usar para: Análisis detallado, reportes a stakeholders
```

---

## 4. Calculadora Simple (CLI/Web)

### Calculadora CLI

```bash
# Instalar
npm install @anthropic-ai/claude-cost-calculator

# Usar
claude-cost calculate \
  --model sonnet \
  --input-tokens 5000 \
  --output-tokens 2000

# Output
Input:  5,000 × $3.00/MTok = $0.015
Output: 2,000 × $15.00/MTok = $0.030
Total:  $0.045 (4.5 centavos)
```

### Calculadora web interactiva

```html
<!-- Alojar en tu dashboard interno -->
<form id="cost-calculator">
  <select id="model">
    <option value="haiku">Haiku ($0.80/MTok)</option>
    <option value="sonnet">Sonnet ($3.00/MTok)</option>
    <option value="opus" selected>Opus ($15.00/MTok)</option>
  </select>

  <input id="input-tokens" 
         type="number" 
         placeholder="Tokens input" 
         value="10000">
  
  <input id="output-tokens" 
         type="number" 
         placeholder="Tokens output" 
         value="5000">

  <button type="submit">Calcular</button>
</form>

<div id="result">
  <!-- Se rellena con JavaScript -->
</div>

<script>
const PRICES = {
  haiku: { input: 0.80, output: 4.00 },
  sonnet: { input: 3.00, output: 15.00 },
  opus: { input: 15.00, output: 45.00 }
};

document.getElementById('cost-calculator').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const model = document.getElementById('model').value;
  const inputTokens = parseInt(document.getElementById('input-tokens').value);
  const outputTokens = parseInt(document.getElementById('output-tokens').value);
  
  const inputCost = (inputTokens / 1_000_000) * PRICES[model].input;
  const outputCost = (outputTokens / 1_000_000) * PRICES[model].output;
  const total = inputCost + outputCost;
  
  document.getElementById('result').innerHTML = `
    <p>Input: ${inputTokens.toLocaleString()} tokens = $${inputCost.toFixed(4)}</p>
    <p>Output: ${outputTokens.toLocaleString()} tokens = $${outputCost.toFixed(4)}</p>
    <p><strong>Total: $${total.toFixed(4)}</strong></p>
  `;
});
</script>
```

### Estimador mensual

```
¿Cuántos desarrolladores? ___

Perfil 1: Frontend
  - Uso promedio: 500K tokens/mes
  - Costo: $2.50/mes
  × [___] devs = $[___]

Perfil 2: Backend
  - Uso promedio: 800K tokens/mes
  - Costo: $4.20/mes
  × [___] devs = $[___]

Perfil 3: Arquitecto
  - Uso promedio: 1.2M tokens/mes
  - Costo: $8.50/mes
  × [___] arquitectos = $[___]

TOTAL MENSUAL: $[suma]
ANUAL: $[suma × 12]
```

---

## 5. Presupuestos por Equipo

### Modelo de asignación

#### Opción A: Límite global por equipo

```
Equipo Backend: $100/mes
├─ 5 devs × promedio $4.20
├─ 1 arquitecto × $8.50
└─ Búfér 20%

Equipo Frontend: $75/mes
├─ 4 devs × promedio $2.50
├─ 1 lead × $6.00
└─ Búfér 20%

DevOps/SRE: $40/mes
├─ 2 SREs × promedio $3.00
└─ Búfér 25%

QA: $30/mes
├─ 3 testers × promedio $1.50
└─ Búfér 30%

TOTAL: $245/mes (~$3K/año)
```

#### Opción B: Por proyecto/feature

```
Proyecto: Migración Legacy → React 19
Budget: $500

Asignación:
├─ Investigación (Opus): $100
├─ Refactorización (Sonnet): $250
├─ Testing (Haiku): $100
└─ Buffer contingencia: $50
```

#### Opción C: Tokens por dev/mes

```
Junior dev: 200K tokens/mes
Mid-level dev: 500K tokens/mes
Senior dev: 800K tokens/mes
Arquitecto: 1.5M tokens/mes

Total 10 personas = 6.5M tokens/mes
≈ $30-35/mes (muy barato)
```

### Configurar límites en consola

```
1. Ir a: console.anthropic.com/settings/billing
2. "Set spending limits"
3. Opción A: Hard limit (bloquea uso si se alcanza)
   Establecer: $1,000/mes
4. Opción B: Alert threshold (notificación)
   Establecer: $750/mes (75% del límite)
5. Guardar
```

### Monitoreo y alertas

#### Configurar webhook (para notificaciones automáticas)

```bash
# Script Node.js que ejecuta cada hora
const checkUsage = async () => {
  const response = await fetch('https://console.anthropic.com/api/usage', {
    headers: { 'X-API-Key': process.env.ANTHROPIC_API_KEY }
  });
  
  const { current_month_cost } = await response.json();
  
  if (current_month_cost > 750) {
    // Enviar email/Slack
    await notify(`Claude Code cost: $${current_month_cost}`);
  }
};

// Ejecutar cada hora
setInterval(checkUsage, 3600000);
```

#### Slack webhook

```
POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL
{
  "text": "Claude Code Alert",
  "blocks": [{
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*Cost Alert*\nCurrent: $750/1000\nDate: 2026-05-20"
    }
  }]
}
```

---

## 6. Optimizaciones para reducir costos

### Estrategia 1: Usar Haiku cuando sea posible

```
Tarea: Análisis simple de error
- Haiku: 2,000 tokens × $0.004 = $0.008
- Sonnet: 2,000 tokens × $0.006 = $0.012
- Diferencia: 33% menos

Casos para Haiku:
✓ Análisis sintáctico
✓ Parsing JSON
✓ Búsquedas en logs
✓ Formateo de texto
✓ Traducciones simples
```

### Estrategia 2: Context cacheing (5 minutos)

```
SIN cache:
- Request 1: Envía contexto (40K) + query (1K) = $0.625
- Request 2: Envía contexto (40K) + query (1K) = $0.625
- Total: $1.25

CON cache (primera vez):
- Request 1: $0.625 (sin cache aún)

CON cache (subsecuentes 5 min):
- Request 2: Contextuse caché ($0.10) + query = $0.11
- Ahorro: 82%
```

### Estrategia 3: Batch processing

```
SIN batch:
- 100 requests pequeños
- Latencia: 1-2s c/u
- Costo: $50 (overhead de conexión)

CON batch:
- 1 request grande (100 items)
- Latencia: 10s total (aceptable)
- Costo: $5 (1/10)
- Ahorro: 90%
```

### Estrategia 4: Temperature y max_tokens

```
Task: Generar lista de alternativas
Normal: temperature=1.0, max_tokens=2000
- Output típico: 1,500 tokens = $0.022

Optimizado: temperature=0.3, max_tokens=800
- Output típico: 600 tokens = $0.009
- Ahorro: 59%

Trade-off: Menos creatividad, pero lista es igual de útil
```

---

## 7. Reporte mensual template

```markdown
# Claude Code — Reporte Mensual (Mayo 2026)

## Resumen ejecutivo
- **Costo total:** $28.50
- **Tokens procesados:** 6.16M
- **ROI estimado:** 1,200%+ (horas ahorradas × sueldo dev)

## Desglose por modelo
- Sonnet: 64% ($18.30)
- Opus: 35% ($10.00)
- Haiku: 1% ($0.20)

## Top 5 casos de uso
1. Code review (40%) — $11.40
2. Refactorización (25%) — $7.13
3. Testing (18%) — $5.13
4. Debug (12%) — $3.42
5. Docs (5%) — $1.42

## Tendencias
- ↑ 15% semana a semana
- Pico: Martes (refactor sprint)
- Mínimo: Viernes (menos desarrollo)

## Optimizaciones este mes
- ✅ Implementar context cacheing → Ahorro 10%
- ✅ Usar Haiku para análisis → Ahorro 5%
- → Reducción total: 15%

## Proyección próximo mes
- **Base:** $28.50 + 15% aumento previsto = $32.78
- **Con optimizaciones:** ~$28/mes
```

---

## Resumen

**4 ideas clave:**
1. **Precios son baratos** en contexto de horas ahorradas (ROI 400-1200%)
2. **Dashboard en consola** es tu mejor amigo para monitoreo
3. **Haiku + context cacheing** reducen costos 50%+ sin impacto
4. **Presupuestos por equipo** son más efectivos que globales

**Próximo:** Nivel 2 → Decision Framework (cuándo usar qué)

---

## Referencias

- Precios actualizados: https://www.anthropic.com/pricing
- Console: https://console.anthropic.com
- Documentación caching: https://docs.anthropic.com/en/docs/build-a-Claude-app/caching
- Token contador: https://www.anthropic.com/tok

**Estado:** Lección completada. Próximo checkpoint: Quiz Nivel 2.
