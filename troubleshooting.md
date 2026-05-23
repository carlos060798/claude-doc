# L5.6: Troubleshooting Masterclass
## De "¿Qué salió mal?" a "Lo sé en 5 minutos"

---

## INTRODUCCIÓN: 5 Síntomas Comunes & Diagnosis en 5 Pasos

Cuando tu sistema Claude Code falla, tienes dos opciones: entrar en pánico o seguir un árbol de decisión. Este módulo es tu árbol.

**5 síntomas que casi siempre indican problemas específicos:**

1. **Contexto crece 50%+ sin razón** → Token leak (sección 1)
2. **Hook devuelve JSON malformado o timeout** → Hook failure (sección 2)
3. **MCP se desconecta aleatoriamente** → Connection pool exhaustion (sección 3)
4. **Requests lentos (P99 > 10s)** → Agent slowness + cache miss (sección 4)
5. **Gasto se duplicó en una semana** → Cost explosion + infinite loop (sección 5)

**Diagnosis en 5 Pasos (Método Universal):**
```
Paso 1: Recopilar logs últimas 24h (API + MCP + Agent)
Paso 2: Aislar variable (cuándo empezó → buscar cambio reciente)
Paso 3: Reproducir en staging (confirmar es real, no aleatoria)
Paso 4: Medir (memory profile, token count, latency P50/P99)
Paso 5: Hipótesis + Fix + Deploy
```

**Tiempo promedio**: 5-30 min (cuando tienes herramientas adecuadas).

---

## Sección 1: Token Leak Diagnostics

### Cómo Detectar un Token Leak

Un token leak ocurre cuando tu contexto crece constantemente sin que lo esperes. Síntomas:

- Modelo recibe contexto de 100k tokens cuando esperabas 20k
- Latency crece sin cambios en el código
- Costo por request sube semana a semana, pero queries sin cambios
- Memory del agente crece linealmente

**Herramienta: Log Parser Rápido**

```javascript
const logs = await fetchLogs('last_24h');
const tokenCounts = logs.map(l => ({
  timestamp: l.ts,
  input_tokens: l.usage.input,
  output_tokens: l.usage.output,
  total: l.usage.input + l.usage.output
}));

const avgFirst6h = tokenCounts.slice(0, 6).reduce((a,b) => a + b.total, 0) / 6;
const avgLast6h = tokenCounts.slice(-6).reduce((a,b) => a + b.total, 0) / 6;

console.log(`Promedio primeras 6h: ${avgFirst6h} tokens`);
console.log(`Crecimiento: ${((avgLast6h - avgFirst6h) / avgFirst6h * 100).toFixed(1)}%`);
```

### Causas Comunes

**Causa 1: Unclosed Quotes**

```javascript
// BROKEN: Cada request agrega fragmento "abierto"
const buildContext = (systemPrompt, userInput) => {
  return `${systemPrompt}
User said: "${userInput}  // FALTA CERRAR COMILLA
`;
};
```

**Fix:**
```javascript
const buildContext = (systemPrompt, userInput) => {
  return `${systemPrompt}
User said: "${userInput}"
`;
};
```

**Causa 2: Infinite Context Accumulation**

```javascript
// BROKEN: Guardar response + volver a incluir
const agent = {
  memory: [],
  async run(input) {
    const context = this.memory.join('\n'); // Acumula todo
    const response = await claude.messages.create({
      system: `${BASE_SYSTEM}\n${context}`, // Contexto entero cada vez
      messages: [{ role: 'user', content: input }]
    });
    this.memory.push(response.content);
    return response;
  }
};
```

**Fix:**
```javascript
const agent = {
  memory: [],
  async run(input) {
    const recentMemory = this.memory.slice(-10); // Últimas 5 interacciones
    const context = recentMemory.join('\n');
    const response = await claude.messages.create({
      system: `${BASE_SYSTEM}\n${context}`,
      messages: [{ role: 'user', content: input }]
    });
    this.memory.push(`User: ${input}`);
    this.memory.push(`Assistant: ${response.content}`);
    return response;
  }
};
```

### Árbol de Decisión

```
¿Contexto crece cada request?
├─ SÍ: ¿Memory.push() agregando strings?
│  ├─ SÍ: Cambiar a window deslizante
│  └─ NO: ¿Loop concatenando respuesta?
└─ NO: ¿Token count esperado en FIRST?
   └─ SÍ: System prompt muy largo?
```

### Caso Real: SaaS Tool (Feb 2025)

**Timeline:**
- Feb 5: Deploy nuevas features
- Feb 10: Alert: cost/request subió 40%
- Feb 10: Contexto 150k tokens (antes 30k)
- Feb 10: Root cause: unclosed quote
- Feb 10: Fix deployed

**Impacto**: -75% cost por request, latency P99 bajó 8s → 2s.

---

## Sección 2: Hook Failures & Timeouts

### Debugging JSON

**Síntoma: Hook returns `null` o JSON malformado**

```javascript
// BROKEN: Hook no valida output
module.exports = async (input) => {
  const parsed = JSON.parse(input);
  const result = {
    status: 'ok',
    data: await fetchData(parsed.id)
  };
  return result; // Devuelve objeto JS, no JSON
};
```

**Fix:**
```javascript
module.exports = async (input) => {
  const parsed = JSON.parse(input);
  const result = {
    status: 'ok',
    data: await fetchData(parsed.id)
  };
  return JSON.stringify(result);
};
```

### Timeout Causes

**Causa 1: Threshold Demasiado Bajo**

```javascript
// BROKEN: timeout 1s para operación 3s
const hook = async (input) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('timeout'), 1000); // 1s muy corto
    const result = await heavyDatabase.query(input.id);
    resolve(result);
  });
};
```

**Fix:**
```javascript
const hook = async (input) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject('timeout'), 5000);
    heavyDatabase.query(input.id)
      .then(result => { clearTimeout(timeout); resolve(result); })
      .catch(err => { clearTimeout(timeout); reject(err); });
  });
};
```

**Causa 2: Blocker no manejado**

```javascript
// BROKEN: Si DB cuelga, espera indefinidamente
const hook = async (input) => {
  const db = require('db-client');
  const conn = await db.connect();
  return conn.query(input.id);
};
```

**Fix:**
```javascript
const hook = async (input) => {
  const db = require('db-client');
  const conn = await Promise.race([
    db.connect(),
    new Promise((_, reject) => setTimeout(() => reject('timeout'), 2000))
  ]);
  return conn.query(input.id);
};
```

### Post-Mortem: Hook JSON Issue (Jan 22, 2025)

**Duración**: 2 horas  
**Síntoma**: Agent nunca responde

**Root Cause**: Hook devolvía `{ data: buffer }`. Claude esperaba JSON, recibía objeto JS.

```javascript
// BROKEN
const hook = async (input) => {
  const buffer = fs.readFileSync(input.path);
  return { data: buffer }; // Buffer no es serializable
};

// FIX
const hook = async (input) => {
  const buffer = fs.readFileSync(input.path);
  return { data: buffer.toString('base64') };
};
```

**Diagnosis timeline:**
- 45 min: "¿Es timeout?"
- 45 min: "¿Qué output?"
- 30 min: Fix + validación

---

## Sección 3: MCP Connection Issues

### Connection Pool Exhaustion

**Síntoma: "Too many open files" o "ECONNREFUSED"**

```javascript
// BROKEN: Crear nueva conexión por request
const runQuery = async (sql) => {
  const conn = await mcp.createConnection();
  return conn.execute(sql);
};

// 100 requests = 100 conexiones
// Pool máximo = 10-20
// Resultado: ECONNREFUSED después de 20 requests
```

**Fix:**
```javascript
const pool = new MCP.ConnectionPool({ maxConnections: 20 });

const runQuery = async (sql) => {
  const conn = await pool.acquire();
  try {
    return conn.execute(sql);
  } finally {
    pool.release(conn);
  }
};
```

### Stdio Buffer Deadlock

**Síntoma: MCP lento sin error explícito**

```javascript
// BROKEN: Escribir 1MB sin drenar stdout
const mcp = spawn('mcp-server');
mcp.stdin.write(gigantPayload);
// Buffer se llena = DEADLOCK
```

**Fix:**
```javascript
const mcp = spawn('mcp-server');
let isReady = true;

mcp.stdin.on('drain', () => { isReady = true; });
const send = (payload) => {
  if (!mcp.stdin.write(payload)) {
    isReady = false;
  }
};

const sendLarge = (payload) => {
  const chunks = chunk(payload, 64 * 1024);
  chunks.forEach(chunk => send(chunk));
};
```

### Server Version Mismatch

```bash
curl http://mcp-server:8000/version
# Comparar con client version
npm install @mcp/server@latest
```

---

## Sección 4: Agent Slowness & Cache Misses

### P50 vs P99 Profiling

```javascript
const latencies = [];
for (let i = 0; i < 1000; i++) {
  const start = Date.now();
  await agent.run(testQuery);
  latencies.push(Date.now() - start);
}

latencies.sort((a, b) => a - b);
const p50 = latencies[Math.floor(latencies.length * 0.50)];
const p99 = latencies[Math.floor(latencies.length * 0.99)];

console.log(`P50: ${p50}ms, P99: ${p99}ms`);
// P50: 245ms, P99: 8500ms = outliers altos
```

### Cache Misses

```javascript
const response = await claude.messages.create({
  model: 'claude-opus-4',
  max_tokens: 1024,
  system: LARGE_SYSTEM,
  messages: [...]
});

console.log(response.usage);
// First request: cache_creation_input_tokens: 950
// Second request: cache_read_input_tokens: 950 ← Hit!
```

**Si ves 0 cache_read_input_tokens, cache no funciona.**

Causas:
- System prompt cambia cada request
- Request va a servidor diferente
- Cache TTL expiró (máximo 5 min)

**Fix:**
```javascript
const SYSTEM_PROMPT = `You are helpful...`; // Constante
// NO: const sys = SYSTEM_PROMPT + new Date();
// SÍ: const sys = SYSTEM_PROMPT;
```

---

## Sección 5: Cost Explosion

### Causas Típicas

**Causa 1: Loop infinito en retry** (60%)
- Agent intenta 10 veces si falla
- Hook falla siempre
- 1 request = 10 al modelo

**Causa 2: Context compression disabled** (20%)
- System prompt duplicado
- Contexto acumulando

**Causa 3: Batch API disabled** (15%)
- Requests individuales
- Perder 50% descuento

**Causa 4: Modelo incorrecto** (5%)
- Deploy a Opus en lugar de Sonnet
- Opus cuesta 3x

### Checklist

```
¿Costo se duplicó en 24h?
□ Paso 1: Revisar último deploy
□ Paso 2: Comparar request count
□ Paso 3: Revisar error rate
□ Paso 4: Revisar modelo usado
□ Paso 5: Comparar tokens/request

Si Paso 2 = SÍ: Loop infinito
Si Paso 3 = SÍ: Fixear hook
Si Paso 4 = SÍ: Revertir a Sonnet
Si Paso 5 = SÍ: Reducir context
```

### Caso Real: $10k → $3k (2 semanas)

**Week 1**: Caching system + retry logic
**Week 2**: Hook falla 5%
- Retry amplifica a 15%
- Gasto sube $10k
**Feb 11 9am**: Alert: gasto/req +65%
**Feb 11 9:30am**: Root: hook error + retry
**Feb 11 11am**: Deshabilitar retry, fixear hook
**Feb 11 12pm**: Deploy
**Feb 11 11:59pm**: Gasto baja $3k

---

## Sección 6: Runbooks Rápidos

| Síntoma | Root Cause | Diagnóstico | Fix |
|---------|-----------|-------------|-----|
| Agent null | Hook undefined | echo '{}' \\| node hook.js | JSON.stringify() |
| Timeout 504 | Hook lento | time node hook.js | Aumentar timeout |
| Pool exhausted | Muchas conexiones | lsof \\| grep TCP | Pool + acquire |
| Contexto crece | Memoria acumula | console.log(context.length) | Slicing window |
| P99 > 10s | Cache miss | curl -D headers \\| grep cache | System prompt estático |
| Costo +50% | Retry loop | Revisar deploy | Deshabilitar retry |
| MCP desconecta | Stdio deadlock | strace | Chunking 64KB |
| JSON error | Non-JSON return | Ver stdout | JSON.stringify() |
| Lento sin error | Network latency | Benchmarking | Mover server |
| Model error | Env variable | grep claude-opus | Cambiar a sonnet |

---

## Cierre

Has completado **L5.6: Troubleshooting Masterclass**.

**Qué aprendiste:**
- Token leaks detection
- Hook failures debugging
- MCP connection issues
- Agent slowness profiling
- Cost explosion prevention
- 10 runbooks listos

**Benchmark**: Ahora diagnosticas en 5-15 min (antes 2-4 horas).

**Próximo**: L5.7 Cost Forecasting & Operations

**Checkpoint L5.6**: ✅ Completado
