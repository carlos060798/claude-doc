# Matriz de Priorización — Mejoras Contenido (Post P8)

**Fecha:** 2026-05-21 | **Status:** Evaluación P8 Completada | **Próximo:** P9

---

## Eje de Priorización

### Dimensiones
- **IMPACTO:** Efecto en learning outcomes, engagement, ROI educativo
- **ESFUERZO:** Horas de trabajo requeridas
- **URGENCIA:** Dependencias, tiempo hasta obsolescencia

### Matriz 2x2 (Impacto vs Esfuerzo)

```
IMPACTO
   ▲
   │ HACER YA             PLANIFICAR
   │ (Alto impact,        (Alto impact,
   │  bajo effort)        alto effort)
   │
   ├──────────────────────────────────────────────
   │
   │ CONSIDERAR           DESCARTAR
   │ (Bajo impact,        (Bajo impact,
   │  bajo effort)        alto effort)
   │
   └──────────────────────────────────────────────► ESFUERZO
```

---

## Cuadrante 1: HACER YA (Alto Impacto, Bajo Esfuerzo)

### 1. Consolidar Cost Management (Remover Duplicados)

| Propiedad | Valor |
|-----------|-------|
| **Impacto** | Medio (claridad +3%) |
| **Esfuerzo** | 2-3 horas |
| **Urgencia** | Media |
| **Timeline** | Semana 1-2 |
| **Dificultad** | Baja |

**Situación actual:**
- Cost management aparece en L1 (básico), L2 (core), L5 (forecasting)
- Sin referencias cruzadas claras
- Estudiantes confundidos sobre dónde buscar

**Acción:**
```
L1:   Sección "Understanding Tokens" (100 líneas) → enlaza a L2
L2:   CORE "Cost Management & ROI" (700 líneas) — single source of truth
      • Precios mayo 2026
      • Dashboard example
      • ROI calculator
      • Optimization techniques
L5:   "Cost Forecasting & Ops" (800 líneas) — builds on L2
      • Advanced modeling
      • Vendor comparison
      • Budget allocation
```

**Entregables:**
- [ ] Actualizar nav links (clarificar targets)
- [ ] Agregar cross-references en quiz
- [ ] Crear índice "Cost learning path"

---

### 2. Unificar Hooks Documentation

| Propiedad | Valor |
|-----------|-------|
| **Impacto** | Medio (claridad +5%) |
| **Esfuerzo** | 2-3 horas |
| **Urgencia** | Media |
| **Timeline** | Semana 1-2 |
| **Dificultad** | Baja |

**Situación actual:**
- Hooks mencionados en L3 (detallado), L4 (settings), L5 (patterns)
- Tabla de 6 tipos dispersa
- Ejemplos redundantes

**Acción:**
```
L3: "Hooks (Detallado)" — Single source of truth
    • Interactive table (6 tipos: PreToolUse, PostToolUse, etc.)
    • Input/output ejemplos
    • Debugging tips
    
L4: .claude/settings.json — Reference "Ver tipos en Hooks (L3)"
    
L5: Advanced patterns — "Building on hooks foundation (L3)"
```

**Entregables:**
- [ ] Crear tabla interactiva (HTML)
- [ ] Actualizar cross-references
- [ ] Remover ejemplos duplicados

---

### 3. Agregar Screenshots Reales (UI Referencias)

| Propiedad | Valor |
|-----------|-------|
| **Impacto** | Bajo-medio (UX +2%) |
| **Esfuerzo** | 1-2 horas |
| **Urgencia** | Baja |
| **Timeline** | Semana 2-3 |
| **Dificultad** | Muy baja |

**Qué agregar:**
1. Screenshot: `claude --doctor` output
2. Screenshot: `/mcp` command output
3. Screenshot: Quiz completion state
4. Screenshot: Progress tracking dashboard
5. Screenshot: .claude/ directory structure

**Entregables:**
- [ ] Capturar 5 screenshots
- [ ] Optimizar tamaño (<100KB total)
- [ ] Insertar en secciones L1-3

---

## Cuadrante 2: PLANIFICAR (Alto Impacto, Alto Esfuerzo)

### 1. Agent SDK Ejemplos Prácticos (CRÍTICO)

| Propiedad | Valor |
|-----------|-------|
| **Impacto** | ALTO (devs bloqueados sin código) |
| **Esfuerzo** | 6-8 horas |
| **Urgencia** | CRÍTICA |
| **Timeline** | Semana 1 |
| **Dificultad** | Media |
| **ROI** | +15-20% engagement L3+ |

**Problema:**
- L3-4 habla de agent SDK pero sin ejemplos ejecutables
- Developers no pueden aprender prácticando
- Documentación oficial existe pero no integrada en curso

**Solución: Nueva sección L3.5 "Agent SDK Basics"**

```markdown
## Agent SDK Basics (Nueva, post L3)

### Contenido (800-1000 líneas)

1. Introduction: El SDK vs Claude Code vs API
2. Setup (npm install + Python pip)
3. Ejemplo 1: Agent sencillo (TypeScript)
   - query() function
   - Basic prompt
   - Ejecutar y ver output
4. Ejemplo 2: Agent con tools (TypeScript)
   - Definir tools
   - Tool selection
   - Iterar sobre responses
5. Ejemplo 3: Multi-turn agent (Python)
   - Memory management
   - State persistence
   - Error handling
6. Benchmarks: SDK vs Claude Code (latency, cost, features)
7. Cuándo usar SDK vs Code vs API

### Código entregado
- 3 ejemplos ejecutables (TS + Python)
- 1 plantilla project (npm init)
- Links a repositorio oficial

### Quiz
- 4 preguntas Bloom L3-4 (aplicar, analizar)

### Laboratorio
- "Construir tu primer agent autónomo"
```

**Dependencias:**
- Acceso a repo oficial Claude Agent SDK
- Verificación de ejemplos contra v1.0 SDK

**Timeline:**
- Día 1: Research + escritura (4h)
- Día 2: Ejemplos + testing (3h)
- Día 3: Integration (1h)

---

### 2. Adaptive Thinking Guide (mayo 2026 Feature)

| Propiedad | Valor |
|-----------|-------|
| **Impacto** | ALTO (feature diferenciador mayo 2026) |
| **Esfuerzo** | 4-6 horas |
| **Urgencia** | CRÍTICA |
| **Timeline** | Semana 1 |
| **Dificultad** | Media |
| **ROI** | +10% posicionamiento |

**Problema:**
- Feature nueva de mayo 2026
- Usuarios confundidos: adaptive thinking vs MAX_THINKING_TOKENS
- Sin guía clara de cuándo usar

**Solución: Nueva sección L4 "Advanced Reasoning: Adaptive Thinking"**

```markdown
## Advanced Reasoning: Adaptive Thinking

### Contenido (600-800 líneas)

1. What is Adaptive Thinking?
   - Definición oficial
   - Vs traditional reasoning tokens
   - Cuándo Claude elige automático vs manual

2. Architecture & Internals
   - Token budget
   - Latency overhead
   - Cost model

3. Cuándo usar
   - Complex problem solving
   - Architecture decisions
   - Debugging hard problems
   - Code generation (big projects)

4. Caso 1: Debugging con Adaptive Thinking
   - Problem: "El sistema está lento, no sé por qué"
   - Con vs sin adaptive thinking
   - Benchmark (latency, cost)
   - Output comparison

5. Caso 2: Architecture Design
   - Problem: "¿Monolito o microservicios?"
   - Decision matrix
   - Reasoning output (explicación)

6. Caso 3: Code Generation
   - Problem: "Generar un parser complejo"
   - Step-by-step generation
   - Error recovery

7. MAX_THINKING_TOKENS vs Adaptive
   - Trade-offs
   - Recommendation matrix

### Benchmarks (incluir números)
- Latency: +200-500ms (worth it?)
- Cost: +15-30% (worth it?)
- Success rate improvement: X%

### Quiz
- 3 preguntas Bloom L4-5 (analizar, evaluar)

### Laboratorio
- "Resolver problema NP con adaptive thinking"
```

**Dependencias:**
- Acceso a Anthropic roadmap (mayo 2026 feature)
- Benchmarks reales de testing

**Timeline:**
- Día 1: Research + benchmark (2h)
- Día 2: Escritura (3h)
- Día 3: Integration + testing (1h)

---

### 3. Batch API Deep-Dive

| Propiedad | Valor |
|-----------|-------|
| **Impacto** | ALTO (50% cost savings) |
| **Esfuerzo** | 6-8 horas |
| **Urgencia** | Media-alta |
| **Timeline** | Semana 2 |
| **Dificultad** | Media |
| **ROI** | High (cost impact) |

**Problema:**
- Batch API mencionado superficialmente
- Sin guía práctica de cuándo usar
- Desarrolladores no saben si vale la pena latency trade-off

**Solución: Nueva sección L2-4 "Batch Processing & Cost Optimization"**

```markdown
## Batch Processing & Cost Optimization

### Contenido (1000-1200 líneas)

1. Batch API Overview
   - History (was Claude API only, now in Code)
   - 50% discount (from official pricing)
   - Async processing model

2. Architecture
   - Request queuing
   - Processing pipeline
   - Result retrieval
   - Error handling & retries

3. Cuándo usar (Decision tree)
   - Use case matrix
   - Latency requirements
   - Cost vs speed trade-offs

4. Setup & CLI
   - `claude batch submit`
   - Polling with `claude batch list`
   - Retrieving results

5. Caso 1: Bulk Document Analysis
   - Scenario: Analizar 1000 contratos
   - Batch setup
   - Cost calculation (1-time vs 50 requests)
   - Timing (hours vs weeks)

6. Caso 2: Scheduled Tasks
   - Scenario: Nightly report generation
   - Cron + batch integration
   - Retry logic on failure

7. Caso 3: Data Pipeline
   - Scenario: ETL with Claude enhancement
   - Large dataset processing
   - Error recovery

8. Monitoring & Observability
   - Batch status tracking
   - Cost tracking per batch
   - Performance metrics

9. Cost-benefit Analysis
   - When to use batch vs real-time
   - ROI calculator example
   - Break-even analysis

### Benchmarks
- Cost: 50% discount (math)
- Latency: +4-24h (vs immediate)
- Throughput: up to 1000 req/batch

### Quiz
- 4 preguntas Bloom L2-3

### Laboratorio
- "Procesar dataset de 100 items con batch, calcular savings"
```

**Dependencias:**
- Batch API documentation
- Real pricing data (mayo 2026)

**Timeline:**
- Día 1: Research + casos reales (3h)
- Día 2: Ejemplos + benchmarks (3h)
- Día 3: Integration (2h)

---

### 4. Patrones Arquitectónicos Expandidos (L6)

| Propiedad | Valor |
|-----------|-------|
| **Impacto** | ALTO (architects core content) |
| **Esfuerzo** | 8-10 horas |
| **Urgencia** | Media |
| **Timeline** | Semana 3 |
| **Dificultad** | Alta |
| **ROI** | Very high (senior decision-makers) |

**Problema:**
- L6 solo cubre 4 patrones
- Architects necesitan 8-10+ para tomar decisiones
- Decision matrix incompleto

**Solución: Expandir L6 a 8-10 patrones**

```markdown
## Patrones Arquitectónicos (Expandido)

### Nuevos patrones a agregar

1. Agentic Loop Patterns
   - Chain-of-Thought (CoT)
   - ReAct (Reasoning + Acting)
   - Tree-of-Thought (ToT)
   - Self-reflection pattern

2. Context Management
   - Fork-based isolation
   - Memory persistence patterns
   - State machine patterns
   - Session lifecycle

3. Tool Composition
   - Sequential tools
   - Parallel tools (with merge)
   - Conditional branching
   - Tool feedback loops

4. Error Handling & Recovery
   - Graceful degradation
   - Retry strategies
   - Fallback patterns
   - Circuit breaker pattern

5. Escala Patterns
   - Single user → N concurrent users
   - Token optimization at scale
   - Cost control strategies
   - Load balancing strategies

6. Security Patterns (Existentes: audit, isolation)
   - Data sanitization
   - Role-based access
   - Token management

### Contenido por patrón
- Problem statement
- Architecture diagram
- Pros/cons
- When to use (decision criteria)
- Code example
- Trade-offs vs alternatives

### Decision Matrix
- Problema vs Patrón (40+ combinations)
- Best fit indicator

### Quiz
- 8 preguntas Bloom L5-6

### Laboratorio
- "Diseñar arquitectura para sistema X, justificar patrones"
```

**Dependencias:**
- Real-world case studies
- Anthropic customer examples

**Timeline:**
- Día 1: Research patrones (3h)
- Día 2: Documentación (4h)
- Día 3: Ejemplos + matrix (3h)

---

### 5. Security Trilogy Expansion (L5)

| Propiedad | Valor |
|-----------|-------|
| **Impacto** | ALTO (enterprise-critical) |
| **Esfuerzo** | 10-12 horas |
| **Urgencia** | Media |
| **Timeline** | Semana 3-4 |
| **Dificultad** | Alta |
| **ROI** | High (compliance + trust) |

**Problema:**
- Seguridad solo en L5 (denso)
- Enterprise teams necesitan guía operacional
- Post-mortems no siempre presentes

**Solución: Crear Security Trilogy**

```markdown
## Security & Compliance Trilogy

### Part 1: CIA Trifecta (300-400 líneas)
- Confidentiality: Quién ve datos
- Integrity: Quién modifica datos
- Availability: Cuándo se pierde acceso
- Aplicación a Claude Code workflows

### Part 2: OWASP Top 10 + Claude-Specific Risks (600-800 líneas)
1. Injection attacks
   - Prompt injection
   - SQL injection (via Claude → backend)
   - Code injection (via /generate-code)

2. Authentication & Authorization
   - Session hijacking
   - Token leakage (avoid CLAUDE.md secrets)
   - API key management

3. Sensitive data exposure
   - PII in prompts
   - Context window leakage
   - Logging risks

4. Data residency & sovereignty
   - EU GDPR requirements
   - US data centers
   - Custom data processing agreements

5. Cryptography & key management
   - Encryption at rest / in transit
   - Key rotation
   - Secrets management (1Password, Vault)

6. Incident response & forensics
   - Audit logging
   - Session recording
   - Forensic analysis

7. Threat modeling
   - External threats
   - Internal threats
   - Supply chain risks

8. Vendor risk management
   - MCP server vetting
   - Plugin security
   - Dependency scanning

9. Compliance frameworks
   - SOC 2 Type II
   - HIPAA (if healthcare)
   - PCI DSS (if payment)
   - ISO 27001

10. Secure development
    - Secrets management in CLAUDE.md
    - No hardcoding in skills
    - .claudeignore patterns

### Part 3: Case Studies & Playbooks (600-800 líneas)

**Case 1: Breach Investigation**
- Timeline
- Root cause
- Detection (what went wrong)
- Recovery steps
- Prevention measures

**Case 2: Compliance Failure**
- Scenario
- What was missed
- Regulatory action
- Remediation

**Case 3: Internal Threat**
- Scenario (malicious developer)
- Detection
- Response playbook
- Prevention

**Incident Playbooks**
- Credential leak playbook
- Data exposure playbook
- DoS/abuse playbook
- Insider threat playbook

### Benchmarking
- Time to detect (average)
- Time to respond (industry std)
- Cost of breach (statistics)

### Quiz
- 6 preguntas Bloom L5-6

### Laboratorio
- "Conduct threat modeling for your use case"
- "Respond to simulated breach scenario"
```

**Dependencias:**
- Real breach case studies (publicly available)
- OWASP guidelines
- Compliance documentation

**Timeline:**
- Día 1: Research + CIA (3h)
- Día 2: OWASP + risks (4h)
- Día 3: Case studies + playbooks (4h)
- Día 4: Integration (1h)

---

## Cuadrante 3: CONSIDERAR (Bajo Impacto, Bajo Esfuerzo)

### 1. WCAG 2.1 AA Audit

| Propiedad | Valor |
|-----------|-------|
| **Impacto** | Medio (compliance + inclusión) |
| **Esfuerzo** | 2-3 horas |
| **Urgencia** | Media |
| **Timeline** | Semana 2 |
| **Dificultad** | Baja |
| **Retorno** | +9 puntos (83→92) |

**Checklist:**

- [ ] Correr axe DevTools (automated scan)
- [ ] Fijar aria-labels (nav-icons, buttons)
- [ ] Verificar color contrast (WCAG 4.5:1)
- [ ] Implementar `prefers-reduced-motion`
- [ ] Font size en móvil: 16px mínimo
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader testing (NVDA/JAWS)

**Entregables:**
- [ ] Audit report
- [ ] Fix commits
- [ ] Accessibility statement en footer

---

### 2. Crear Índice de "Learning Paths"

| Propiedad | Valor |
|-----------|-------|
| **Impacto** | Bajo-medio (UX +2%) |
| **Esfuerzo** | 1-2 horas |
| **Urgencia** | Baja |
| **Timeline** | Semana 2-3 |
| **Dificultad** | Baja |

**Qué agregar:**
- "Path: I want to set up cost optimization" (L1 → L2 → L5)
- "Path: I want to build a custom skill" (L1 → L3 → L3.5 → L4)
- "Path: I want to become an architect" (L1-6 → Certification)

**Entregables:**
- [ ] Interactive learning paths diagram
- [ ] Recomendaciones por rol (developer, architect, manager)

---

## Cuadrante 4: DESCARTAR (Bajo Impacto, Alto Esfuerzo)

### 1. Remover "Plugins & Abilities" (Stub)

| Propiedad | Valor |
|-----------|-------|
| **Impacto** | Bajo (feature incompleta) |
| **Esfuerzo** | N/A (remover) |
| **Urgencia** | Baja |
| **Timeline** | Ahora |

**Acción:**
- [ ] Remover sección
- [ ] Reemplazar con "Upcoming: Plugins (Q4 2026)"

---

### 2. No expandir "Marketplace (Smithery)"

| Propiedad | Valor |
|-----------|-------|
| **Impacto** | Bajo (pocos servers productivos) |
| **Esfuerzo** | 4-6 horas |
| **Urgencia** | Baja |
| **Recomendación** | Esperar Q4 2026 |

**Acción:**
- [ ] Mantener stub
- [ ] Enlazar docs oficiales
- [ ] Actualizar en P11 (Q4)

---

## Resumen de Inversión

### Por Trimestre

**Q2 2026 (Ahora - 4 semanas)**
```
Semana 1:
  • Agent SDK examples (6-8h)
  • Adaptive Thinking guide (4-6h)
  • Consolidate cost mgmt (2-3h)
  Total: 12-17h

Semana 2:
  • Batch API deep-dive (6-8h)
  • Unify hooks docs (2-3h)
  • WCAG audit (2-3h)
  Total: 10-14h

Semana 3:
  • Patrones arquitectónicos (8-10h)
  • Security Part 1-2 (7-8h)
  • Screenshots (1-2h)
  Total: 16-20h

Semana 4:
  • Security Part 3 (4-5h)
  • Integration + testing (3-4h)
  • Final review (2-3h)
  Total: 9-12h

Q2 TOTAL: 47-63 horas
```

**Q3 2026 (Post P9)**
```
• Community feedback integration
• Additional case studies
• Performance optimization (UI/loading)
• Advanced examples expansion
```

---

## Métricas de Éxito

Después de completar estas mejoras:

| Métrica | Baseline (P8) | Target (P9) | Delta |
|---------|---------------|-------------|-------|
| Score general | 88.6 | 94+ | +5.4 |
| Cobertura de gaps | 60% | 95% | +35% |
| Líneas de contenido | 21,945 | 25,000+ | +3,055 |
| Quiz preguntas | 91 | 110+ | +19 |
| Ejemplos prácticos | 10 | 20+ | +10 |
| WCAG compliance | 83% | 95% | +12% |
| Engagement estimado | Baseline | +25% | +25% |

---

## Next Steps

1. **Semana 1 (ahora):** Iniciar Agent SDK + Adaptive Thinking
2. **Semana 2:** Batch API + WCAG audit
3. **Semana 3:** Patrones + Security Part 1-2
4. **Semana 4:** Security Part 3 + final review
5. **5 junio 2026:** Commit P9
6. **6 junio 2026:** Update progreso.md checkpoint

---

**Evaluador:** Claude Haiku 4.5  
**Matriz versión:** 1.0  
**Próxima revisión:** Post-implementación P9
