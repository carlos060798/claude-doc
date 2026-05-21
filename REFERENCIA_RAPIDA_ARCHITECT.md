# ⚡ Referencia Rápida - Claude Certified Architect

Tabla de consulta rápida para durante el curso.

---

## 📊 Tabla de Dominios

### **1. AGENTIC LOOPS**

| Concepto | Definición | Ejemplo |
|----------|-----------|---------|
| **Ciclo básico** | Percepción → Decisión → Acción | Agent observa entrada → LLM decide → ejecuta tool |
| **Halt condition** | Condición para detener loop | goal_reached OR max_iterations OR error_count > threshold |
| **Estado** | Estado actual del agente | IDLE, PROCESSING, HALTED, ERROR |
| **Convergencia** | Agente alcanza objetivo | Respuesta válida generada |
| **Backtracking** | Volver a estado anterior | Si acción falló, intentar alternativa |

**Anti-patrones:**
- ❌ while True sin halt condition
- ❌ Compartir estado sin sincronización
- ❌ Condiciones de carrera

---

### **2. TOOL DESIGN**

| Concepto | Definición | Ejemplo |
|----------|-----------|---------|
| **Especificación** | Definir parámetros con JSON-Schema | name, type, required, default |
| **Validación** | Verificar entrada antes de ejecutar | Pydantic model con validators |
| **Timeout** | Máximo tiempo de ejecución | 30 segundos para API call |
| **Retry logic** | Reintentos con exponential backoff | Espera: 1s → 2s → 4s → 8s |
| **Circuit breaker** | Detener llamadas si servicio cae | Fallos: 5+ → OPEN → esperar 60s |

**JSON Schema Mínimo:**
```json
{
  "type": "object",
  "properties": {
    "param1": {"type": "string", "description": "..."},
    "param2": {"type": "integer", "minimum": 0}
  },
  "required": ["param1"]
}
```

**Anti-patrones:**
- ❌ Sin validación de entrada
- ❌ Sin timeout
- ❌ Retry inmediato sin espera
- ❌ Errores genéricos

---

### **3. CI/CD**

| Fase | Checklist | Métricas |
|------|-----------|----------|
| **Validación** | ✅ Syntax, Types, Linting | 100% pass rate |
| **Testing** | ✅ Unit, Integration, E2E | >80% coverage |
| **Prompt QA** | ✅ Golden tests, Quality score | BLEU >0.75 |
| **Build** | ✅ Docker build, Image scan | 0 vulnerabilities |
| **Canary** | ✅ Deploy 5% → Monitor 15min | Error rate <1% |
| **Production** | ✅ Deploy 100% → Smoke tests | Latency <SLA |

**GitHub Actions Template:**
```yaml
- name: Test
  run: pytest tests/ -v --cov=src
- name: Deploy canary
  run: kubectl set image deployment/agent-canary ...
- name: Monitor
  run: python monitor.py --duration=15m
```

---

### **4. PROMPT ENGINEERING**

| Técnica | Descripción | Cuándo usar |
|---------|-------------|------------|
| **Chain-of-Thought** | Mostrar pasos de razonamiento | Problemas complejos, necesito explicación |
| **Few-shot** | Dar 2-5 ejemplos | Tareas nuevas, formato específico |
| **Role-playing** | Asignar rol: "Eres un experto..." | Personalidad específica requerida |
| **Structured output** | Especificar formato JSON/XML | APIs, procesamiento automático |
| **Temperature** | Control de aleatoriedad (0-1) | Bajo (0.2): preciso, Alto (0.8): creativo |

**Structure optimal:**
```
Sistema: Eres un experto en {domain}. Objetivo: {goal}. Formato: {format}

Contexto: {relevant_context}

Ejemplos:
Input: {ex1_in} → Output: {ex1_out}
Input: {ex2_in} → Output: {ex2_out}

Query: {user_input}
```

**Métricas:**
- BLEU: Similitud con referencia (0-1, más alto mejor)
- ROUGE: Cobertura de palabras clave (0-1)
- Custom: Validación de respuesta

---

### **5. CONTEXT MANAGEMENT**

| Concepto | Qué es | Implementación |
|----------|--------|-----------------|
| **Embedding** | Vector 384-1536D de texto | OpenAI, Hugging Face |
| **Similarity** | Distancia semántica | Cosine similarity, Euclidean |
| **Retrieval** | Encontrar docs relevantes | Vector DB query (top-K) |
| **Ranking** | Ordenar por relevancia | Score > threshold |
| **Cache** | Almacenamiento temporal | L1: Redis (5min) → L2: Vector DB (1h) |

**RAG Pipeline:**
```
User Query
    ↓
Generate Embedding
    ↓
Vector DB Search (top-5)
    ↓
Ranking by Score
    ↓
Compress to Max Tokens
    ↓
Inject in Prompt
```

**TTL Strategy:**
- Session data: 5-15 minutos
- User profile: 1 hora
- Static content: 24 horas

---

## 🔄 Checklist de Diseño Arquitectónico

### **FASE DE DISEÑO**

```
[ ] 1. ANALIZAR REQUISITOS
    [ ] Volumen: ¿Cuántas requests/segundo?
    [ ] Latencia: ¿Límite SLA?
    [ ] Contexto: ¿Tamaño máximo?
    [ ] Escalabilidad: ¿Picos?

[ ] 2. DISEÑAR AGENTE
    [ ] Flujo: Diagrama de estados
    [ ] Herramientas: Lista y especificaciones
    [ ] Prompts: System + ejemplos
    [ ] Contexto: Estrategia de recuperación

[ ] 3. ARQUITECTURA
    [ ] Load balancer
    [ ] Agent pool con auto-scaling
    [ ] Vector DB para contexto
    [ ] Queue para tasks asincrónicas
    [ ] Cache multinivel

[ ] 4. TESTING
    [ ] Unit tests de lógica
    [ ] Integration tests de tools
    [ ] Golden tests de prompts
    [ ] Load testing (10x pico)

[ ] 5. DEPLOYMENT
    [ ] Canary pipeline (5% → 50% → 100%)
    [ ] Monitoring setup
    [ ] Alertas
    [ ] Rollback automático

[ ] 6. DOCUMENTACIÓN
    [ ] Architecture Decision Records (ADR)
    [ ] Runbooks
    [ ] SOP para incidentes
```

---

## 📈 Matriz de Complejidad

```
                    Recursos    Tolerancia Error   Complejidad
Agente simple       Bajo        Media               ⭐
Multi-agente        Medio       Baja                ⭐⭐⭐
Con contexto RAG    Alto        Alta                ⭐⭐⭐⭐
Distribuido         Alto        Muy Alta            ⭐⭐⭐⭐⭐
```

---

## 💰 Optimización de Costos

| Aspecto | Costo típico | Reducción |
|---------|--------------|-----------|
| **Input tokens** | $0.50/1M | Comprimir contexto (↓30%) |
| **Output tokens** | $1.50/1M | Limitar length (max_tokens) |
| **API calls** | $0.001-0.1 | Caching, batch processing |
| **Embeddings** | $0.02/1M | Reuse, cache |
| **Almacenamiento** | $0.25/GB/mes | Cleanup, archiving |

**Ejemplo:**
- Request típico: 1000 input + 500 output tokens
- Costo por request: $1.25
- Con optimización (↓40%): $0.75 por request
- Ahorro mensual (100k requests): $50,000

---

## 🚨 Troubleshooting Rápido

### **Agente se queda en loop infinito**
```
✅ Solución:
- Agregar max_iterations
- Verificar halt condition
- Check convergence logic
```

### **Tool calls muy lentos**
```
✅ Solución:
- Reducir timeout de cada llamada
- Parallelizar calls
- Implementar circuit breaker
- Cache results
```

### **Context recuperation sin relevancia**
```
✅ Solución:
- Aumentar k en top-K search
- Ajustar threshold de similitud
- Usar embeddings de mejor calidad
- Validar query embedding
```

### **Costo de tokens demasiado alto**
```
✅ Solución:
- Comprimir contexto (resúmenes)
- Usar modelo más pequeño
- Reducir chain length
- Implementar cache agresivo
```

### **Deployment falla en canary**
```
✅ Solución:
- Check error rate spike
- Rollback automático
- Review recent prompt changes
- Verificar nueva tool specification
```

---

## 🎯 Checklist de Examen

### **Antes del Examen**
- [ ] Revisar los 5 dominios (30 min cada uno)
- [ ] Resolver 2 escenarios de práctica (4h)
- [ ] Revisar anti-patrones (30 min)
- [ ] Checklist de diseño completo
- [ ] Descansar 8 horas

### **Durante el Examen**
- [ ] Leer cuidadosamente cada pregunta
- [ ] Allocar tiempo: 4h ÷ 50 = 4.8 min/pregunta
- [ ] Saltarse preguntas difíciles, volver luego
- [ ] Diagrama para preguntas de diseño

### **Formato de Respuestas**

**Pregunta de opción múltiple (1 min):**
- Leer todas las opciones
- Eliminar claramente incorrectas
- Seleccionar mejor opción

**Pregunta de corto (5 min):**
- Explicación clara en 2-3 párrafos
- Código si es necesario
- Ejemplo concreto

**Pregunta de diseño (15 min):**
- Diagrama de arquitectura
- Componentes principales
- Flujo de datos
- Consideraciones de escalabilidad

---

## 📚 Recursos por Dominio

### **Agentic Loops**
- Documentación oficial Claude
- Papers: "Multi-Agent Systems", "Reinforcement Learning"
- Práctica: Implementar 3 agentes progresivamente complejos

### **Tool Design**
- JSON Schema spec
- OpenAPI/REST best practices
- Validación: Pydantic, JSONSchema
- Práctica: Diseñar 5 tools heterogéneos

### **CI/CD**
- GitHub Actions documentation
- Kubernetes deployment patterns
- Monitoring tools (Prometheus, Grafana)
- Práctica: Pipeline canary completo

### **Prompt Engineering**
- OpenAI Prompt Engineering Guide
- Papers sobre CoT, Few-shot learning
- Benchmark datasets (MMLU, HumanEval)
- Práctica: Optimizar 10 prompts reales

### **Context Management**
- Vector DB documentation (Pinecone, Weaviate)
- RAG papers y tutorials
- Embedding models comparison
- Práctica: RAG system con métricas

---

## 🎓 Estrategia de Estudio Semanal

### **Horario Recomendado (1h/día)**

```
Lunes:    Teoría + Quiz (40 min) + Práctica simple (20 min)
Martes:   Teoría + Ejemplos de código (50 min) + Notas (10 min)
Miércoles: Práctica intermedia (45 min) + Revisión (15 min)
Jueves:   Teoría + Quiz (40 min) + Ejercicio nuevo (20 min)
Viernes:  Integración de semana (30 min) + Mini-proyecto (30 min)
Sábado:   Proyecto principal (60 min)
Domingo:  Revisión + Plan próxima semana (30 min) + Descanso
```

### **Métodos Efectivos**

1. **Spaced Repetition:** Revisar material a 1d, 3d, 1w, 2w
2. **Active Recall:** Preguntas sin ver respuesta
3. **Elaboration:** Explicar conceptos con tus propias palabras
4. **Interleaving:** Mezclar tópicos en lugar de estudiar linealmente
5. **Practice Testing:** Resolver exámenes simulados

---

## 📝 Formato de Respuesta para Escenarios

Cuando diseñes una arquitectura en examen, incluye:

```
## 1. RESUMEN EJECUTIVO
- Requisitos clave
- Desafíos principales
- Enfoque propuesto

## 2. ARQUITECTURA
- Diagrama (ASCII o descripto)
- Componentes principales
- Flujo de datos

## 3. AGENTE
- Estructura de bucles
- Herramientas necesarias
- Prompts y contexto

## 4. IMPLEMENTACIÓN
- Stack tecnológico
- Código pseudo o real
- Configuración clave

## 5. TESTING
- Unit tests
- Integration tests
- Load testing

## 6. DEPLOYMENT
- Pipeline CI/CD
- Canary strategy
- Monitoring

## 7. ESCALABILIDAD
- Limitaciones actuales
- Plan de crecimiento
- Optimizaciones futuras

## 8. RIESGOS
- Identificar 3+ riesgos
- Mitigación propuesta
- Plan B
```

---

## ✅ Validación Final

**Antes de entregar tus soluciones, verifica:**

- [ ] Cumple todos los requisitos
- [ ] Maneja errores apropiadamente
- [ ] Tiene logging y observabilidad
- [ ] Es escalable (10x carga)
- [ ] Tiene plan de monitoreo
- [ ] Documentación clara
- [ ] Código limpio y comentado
- [ ] Ejemplos de uso incluidos
- [ ] Alternativas consideradas
- [ ] Riesgos identificados

---

## 🏆 Diferencia entre Niveles

### **Nivel 1 - Básico**
- Agent loops simples
- 1-2 herramientas
- Prompts básicos
- Sin contexto complejo

### **Nivel 2 - Intermedio** ✨ CERTIFICACIÓN
- Multi-agentes coordinados
- 3-5 herramientas con composición
- Prompts optimizados con few-shot
- RAG con vector DB
- CI/CD con canary

### **Nivel 3 - Experto**
- Sistemas distribuidos
- 10+ herramientas complejas
- Prompting dinámico
- RAG multinivel
- Auto-scaling y failover

---

**Última actualización:** 21 de mayo de 2026
**Próxima revisión:** Antes de cada examen
