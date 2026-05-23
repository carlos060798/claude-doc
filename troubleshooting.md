# L5.6: Troubleshooting Masterclass — De "¿Qué salió mal?" a "Lo sé en 5 min"

**Objetivo**: Diagnosticar y resolver fallos críticos en producción con velocidad y precisión.

---

## 📌 Introducción: 5 Síntomas Comunes + Diagnosis en 5 Pasos

Cuando Claude Code falla en producción, el tiempo es crítico. Este módulo te enseña a diagnosticar **cinco categorías de fallo común** en menos de 5 minutos usando un árbol de decisión estructurado.

### 5 Síntomas de Alerta Roja
1. **Token leak**: Contexto crece ilimitadamente (P99 latency, OOM en 2-3 horas)
2. **Hook failures**: JSON inválido, timeouts, handshake errors
3. **MCP connection issues**: Stdio buffer deadlock, pool exhaustion
4. **Agent slowness**: P50 = 200ms, P99 = 5s (varianza 25×)
5. **Cost explosion**: Presupuesto diario se duplica en 24h

### Diagnosis en 5 Pasos
```
Paso 1: ¿Cuándo comenzó? (timeline)
Paso 2: ¿Qué métrica cambió? (logs, CPU)
Paso 3: ¿Qué sistemas afecta? (scope)
Paso 4: ¿Qué cambió 24h antes? (commits)
Paso 5: ¿Cómo validamos fix? (antes/después)
```

---

## 1️⃣ Token Leak Diagnostics

### Detectar Fuga de Tokens

```bash
# Extraer tokens por request del log
grep "usage.input_tokens" production.log | awk '{sum += $NF} END {print "Avg:", sum/NR}'

# Esperado: 2,500–5,000 tokens
# Leak: 15,000+ tokens
```

**Caso Real**: Histórico de conversación sin límite
```javascript
// ❌ ANTES
async function processMessage(msg) {
  const history = await db.getConversationHistory(userId); // NO LIMIT
  return claude.messages.create({
    model: "claude-opus",
    messages: [...history, { role: "user", content: msg }],
  });
}
// Día 1: 2,500 tokens avg
// Día 3: 25,000 tokens avg (10× costo)

// ✅ DESPUÉS
async function processMessage(msg) {
  const history = await db.getConversationHistory(userId, { limit: 20 });
  return claude.messages.create({
    model: "claude-opus",
    messages: [...history, { role: "user", content: msg }],
  });
}
// Resultado: 2,500–3,000 tokens consistently
```

### Árbol de Decisión: Token Leak

```
¿Token leak detectado?
├─ SÍ: ¿Cambió contexto en últimas 48h?
│  ├─ SÍ → Revisar memory section en CLAUDE.md
│  │  └─ Buscar: Variable no se limpia entre requests
│  │
│  └─ NO: ¿Cambió prompts o system message?
│     └─ Buscar: Prompt nuevo con 10× tokens
│
└─ NO: Es carga normal
```

---

## 2️⃣ Hook Failures: JSON Input/Output

### Causa #1: JSON Malformado

```javascript
// ❌ ANTES: Caracteres sin escape
const payload = {
  message: "User said: \"It's working!\"",  // ← Comillas sin escape
  multiline: "First line
Second line"  // ← Newline literal
};
const json_str = JSON.stringify(payload);
// Resultado: INVÁLIDO

// ✅ DESPUÉS
const payload = {
  message: "User said: \"It's working!\"",
  multiline: "First line\nSecond line"
};
JSON.parse(JSON.stringify(payload));  // ← Validar antes de enviar
```

### Causa #2: Timeout en Handler

```python
# ❌ ANTES: Sin async
@app.post("/hook/process")
def handle_hook():
    result = claude.messages.create(...)  # ← Bloquea 30s
    return result

# ✅ DESPUÉS: Con queuing
@app.post("/hook/process")
def handle_hook():
    executor.submit(process_async, data)  # ← No bloquea
    return {"status": "queued"}
```

### Post-Mortem: Hook Failure (2 Horas Debug)

```
Hora 10:15: 50% de hooks falla con "Invalid JSON"
Hora 10:20: Revisar último commit
         → "Add streaming response" hace 90 min
Hora 10:45: Problema encontrado
         → Stream genera múltiples eventos, no 1 JSON
Hora 11:00: Fix implementado
         → Consumir stream completo antes de retornar
Hora 11:15: Validado
         → ✅ 200 OK con JSON válido
```

---

## 3️⃣ MCP Connection Issues

### Síntoma #1: Pool Exhaustion

```python
# ❌ ANTES: Sin cierre de conexión
class MCPClient:
    def send_request(self, payload):
        conn = self.pool.acquire()
        self.connections.append(conn)  # ← NUNCA se libera
        return conn.send(payload)

# Resultado: 1000 requests → 1000 conexiones → OVERFLOW

# ✅ DESPUÉS
def send_request(self, payload):
    with self.pool.acquire() as conn:  # ← Auto-close
        return conn.send(payload)
```

### Síntoma #2: Stdio Deadlock

```python
# ❌ ANTES: Buffer lleno, sin lectura
proc.stdin.write(b"LARGE_PAYLOAD")  # ← Buffer lleno
# proc.stdout.read() nunca se ejecuta → DEADLOCK

# ✅ DESPUÉS: Non-blocking I/O
def send_request(self, payload, timeout=5):
    self.proc.stdin.write(payload.encode() + b"\n")
    self.proc.stdin.flush()
    
    start = time.time()
    while time.time() - start < timeout:
        if self.last_response:
            return self.last_response
        time.sleep(0.01)
    
    raise TimeoutError()
```

---

## 4️⃣ Agent Slowness: P50 vs P99

### Medir Real

```bash
# P50, P95, P99 desde logs
grep "request_duration_ms" production.log | awk '{
  data[NR] = $NF
}
END {
  n = NR
  p50 = data[int(n * 0.50)]
  p99 = data[int(n * 0.99)]
  print "P50:", p50, "ms"
  print "P99:", p99, "ms"
}'

# Output:
# P50: 180 ms
# P99: 4200 ms (23× más lento)
```

### Causa: Cache Misses

```python
# ❌ ANTES: Sin caché
async def process_user_request(user_id):
    user_data = await db.get_user(user_id)  # ← 2s si cold
    result = await claude.messages.create(...)  # ← 1.2s
    return result  # Total: 3.2s

# Latencias: Hit 1 = 3.2s, Hit 2 (warm) = 1.2s
# P50 = 1.2s, P99 = 3.2s

# ✅ DESPUÉS: Con caché 5 minutos
class CachedUserData:
    async def get_user(self, user_id):
        if self.is_cached(user_id):
            return self.cache[user_id]  # ← 1ms
        data = await db.get_user(user_id)  # ← 2s (raro)
        self.cache[user_id] = data
        return data

# Resultado: P50 = 1.2s, P99 = 1.2s (predecible)
```

---

## 5️⃣ Cost Explosion

### Checklist 3 Minutos

```
Gasto ayer: $X
Gasto hoy: $2X

□ ¿Deploy en últimas 24h? (revisar commit)
□ ¿Cambió volumen requests? (medir traffic)
□ ¿Cambió modelo (Opus → Sonnet)? (calcular delta)
□ ¿Se habilitó caché? (¿por qué no?)
□ ¿Loop infinito de retries? (detectar)
```

### Caso: $10K → $3K/mes (72% Ahorro)

```python
# ❌ ANTES: Sin optimizaciones
async def recommend_products(user_id):
    # Sin caché: Claude Opus para cada user
    recommendations = await claude.messages.create(
        model="claude-opus",  # $15/1M tokens
        messages=[{"role": "user", "content": f"User {user_id} prefs"}]
    )
    return recommendations

# Costo: 100K requests × 5,000 tokens × $0.003/1K = $1,500/día = $45K/mes

# ✅ DESPUÉS: 3 optimizaciones
# 1. Batch API: -50% costo
# 2. Compression: 5,000 → 800 tokens
# 3. Model downgrade: Opus → Sonnet (-80%)

def batch_recommendations(user_ids):
    requests = [
        {
            "custom_id": f"user-{uid}",
            "params": {
                "model": "claude-sonnet",  # $3/1M tokens
                "messages": [...]
            }
        }
        for uid in user_ids
    ]
    return client.batches.create(requests=requests)

# Costo nuevo: 100K × 800 × $0.003 × 0.5 (batch) = $120/día = $3.6K/mes
# Reducción: 72% ($45K → $3.6K) ✅
```

---

## 6️⃣ Runbooks Rápidos: 10 Escenarios

| Síntoma | Check | Fix | Tiempo |
|---------|-------|-----|--------|
| Latency sube gradualmente | Token count? CPU >80%? | Sliding window, escalar | 15 min |
| Hook 504 timeout | ¿Handler bloquea? | Async queue, max 25s | 10 min |
| JSON parse error | ¿JSON válido? | Validar con json.loads() | 5 min |
| MCP refused | ¿Server arriba? ¿Puerto? | Restart, netstat | 3 min |
| Costo 2× en 24h | ¿Deploy? ¿Modelo? | Rollback, circuit breaker | 5 min |
| Agent retry loop | ¿Sin max retries? | Set max_retries=3 | 3 min |
| Memory leak | ¿Context crece? | Implementar TTL | 10 min |
| Context exceeded | ¿Input > limit? | Batch pequeños, compression | 8 min |
| Rate limit hit | ¿QPM alto? | Queue, exponential backoff | 5 min |
| Respuestas inconsistentes | ¿Temperature sin fijar? | temperature=0 | 3 min |

---

## 7️⃣ Checklist Post-Incident

```
□ Timeline: ¿Cuándo comenzó exactamente?
□ Impact: ¿Cuántos users afectados? ¿Duración?
□ Root cause: ¿Qué cambió hace 24-48h?
□ Fix: ¿Qué se hizo?
□ Validation: ¿Cómo se verificó?
□ Prevention: ¿Qué alertas agregar?
□ Documentation: ¿Actualizar runbook?

Resultado: Wiki "Common Issues" para futuros on-call
```

---

## ✅ Resumen

Dominaste:
- ✅ Token leak diagnosis en 2 pasos
- ✅ Hook failures debugging
- ✅ MCP connection issues
- ✅ Agent P50/P99 profiling
- ✅ Cost explosion root causes
- ✅ 10 runbooks para incidents

**Próximo: L5.7 — Cost Forecasting & Operations**
