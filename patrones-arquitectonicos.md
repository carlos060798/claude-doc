# Patrones Arquitectónicos — Nivel 6

> 5 patrones con agentes IA. Pros/cons de cada uno. Decision matrix. Diagramas conceptuales.

## Introducción

Claude Code puede usarse en 5 patrones arquitectónicos principales. Esta sección te enseña:

- 5 patrones con casos reales
- Cuándo usar cada uno
- Trade-offs de rendimiento
- Ejemplos de implementación
- Matriz de decisión

**Tiempo estimado:** 120 minutos  
**Requisitos:** Experiencia en arquitectura distribuida  
**Nivel de dificultad:** Avanzado

---

## 1. Patrón 1: Agent Orquestador (Orquestación Central)

### Concepto

Un agente Claude Code central coordina múltiples subtareas en secuencia o paralelo.

```
┌─────────────────────────────────────────┐
│      User Request                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Claude Code Agent (Orchestrator)      │
│                                         │
│  1. Parsea solicitud                   │
│  2. Divide en subtareas                │
│  3. Ejecuta MCP tools en serie/paralelo│
│  4. Consolida resultados               │
└──────────────┬──────────────────────────┘
               │
      ┌────────┼────────┐
      │        │        │
      ▼        ▼        ▼
   [Tool 1] [Tool 2] [Tool 3]
   (MCP)    (MCP)    (API)
```

### Caso real: Code review automático

```javascript
// orchestrator.js
async function autoCodeReview(prUrl) {
  const steps = [
    {
      name: 'fetch_code',
      tool: 'github_api',
      input: { pr_url: prUrl }
    },
    {
      name: 'analyze_security',
      tool: 'claude_code',
      input: 'Analiza seguridad: {{fetch_code.output}}'
    },
    {
      name: 'analyze_performance',
      tool: 'claude_code',
      input: 'Analiza performance: {{fetch_code.output}}'
    },
    {
      name: 'generate_report',
      tool: 'claude_code',
      input: 'Consolida: {{analyze_security.output}} + {{analyze_performance.output}}'
    },
    {
      name: 'post_comment',
      tool: 'github_api',
      input: { 
        pr_url: prUrl,
        comment: '{{generate_report.output}}'
      }
    }
  ];
  
  // Ejecutar en orden
  for (const step of steps) {
    const result = await executeStep(step);
    results[step.name] = result;
  }
}
```

### Pros y Contras

| Aspecto | Ventaja | Desventaja |
|---------|---------|-----------|
| **Simplicidad** | Fácil de entender/debuggear | Puede ser verboso |
| **Control** | Flujo determinístico | Menos flexibilidad |
| **Latencia** | OK si pasos en paralelo | Lento si secuencial |
| **Escalabilidad** | Bien hasta 10-15 steps | Complejo con 50+ steps |
| **Confiabilidad** | Fácil manejar errores | Retry logic compleja |

### Cuándo usarlo

✓ Code review automático  
✓ Refactorización multi-paso  
✓ Pipelines CI/CD asistidas  
✓ Migraciones de código  

❌ Tareas que requieren decisión dinámica  
❌ Altamente paralelo (100+ subtareas)  

---

## 2. Patrón 2: Agent Agentico (Reasoning Loop)

### Concepto

Claude Code "piensa" iterativamente sin script predefinido. Usa reasoning y toma decisiones en vivo.

```
┌──────────────────────┐
│  User Request        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│  Claude Code Agent (Agentic Loop)           │
│                                              │
│  1. Analizar solicitud                      │
│  2. Decidir siguiente acción                │
│  3. Ejecutar MCP tool                       │
│  4. Evaluar resultado                       │
│  5. ¿Terminado? NO → volver a 2             │
│     ¿Terminado? SÍ → entregar               │
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Result              │
└──────────────────────┘
```

### Caso real: Debugging autónomo

```javascript
// agentic-debugger.js
class DebugAgent {
  async debug(errorMessage, code) {
    let context = {
      error: errorMessage,
      code: code,
      attempts: 0,
      max_iterations: 5
    };
    
    while (context.attempts < context.max_iterations) {
      context.attempts++;
      
      // Claude decide siguiente paso
      const plan = await claude.analyze({
        task: 'debugging',
        error: context.error,
        code: context.code,
        previous_attempts: context.attempts - 1,
        next_step: 'Decide siguiente acción (analizar, probar fix, etc)'
      });
      
      if (plan.action === 'ANALYZE') {
        context.analysis = await analyzeError(context.error);
      } 
      else if (plan.action === 'TRY_FIX') {
        const fix = await claude.generateFix(context);
        context.test_result = await runTests(fix);
        
        if (context.test_result.passed) {
          return { success: true, fix, attempts: context.attempts };
        }
        context.code = fix;  // Siguiente iteración
      }
      else if (plan.action === 'RESEARCH') {
        context.research = await searchDocumentation(context.error);
      }
      else if (plan.action === 'ESCALATE') {
        return { success: false, reason: 'Escalate to human' };
      }
    }
    
    return { success: false, reason: 'Max iterations reached' };
  }
}
```

### Pros y Contras

| Aspecto | Ventaja | Desventaja |
|---------|---------|-----------|
| **Flexibilidad** | Adapta a problemas nuevos | Impredecible |
| **Eficiencia** | Evita pasos innecesarios | Puede iterar infinito |
| **Inteligencia** | Razonamiento dinámico | Difícil debuggear |
| **Costo** | Variable (depende problema) | Puede ser caro |
| **Confiabilidad** | Genera soluciones creativas | No garantizado |

### Cuándo usarlo

✓ Debugging complejo  
✓ Investigación abierta  
✓ Problemas inesperados  
✓ Optimización creativa  

❌ Procesos que necesitan determinismo  
❌ Auditoría/compliance estricta  
❌ Presupuesto muy limitado  

---

## 3. Patrón 3: Multi-Agent Competitivo

### Concepto

Múltiples agents Claude Code solucionan el problema en paralelo. Se eligen las mejores soluciones.

```
           ┌─── Agent 1 ───┐
           │   (Approach A) │
           └────┬──────────┘
                │
┌──────────┐    │    ┌─── Agent 2 ───┐
│  Problem ├─────────┤ (Approach B)   │
└──────────┘    │    └────┬──────────┘
                │
           ┌─── Agent 3 ───┐
           │   (Approach C) │
           └────┬──────────┘
                │
                ▼
         ┌──────────────────┐
         │  Evaluador       │
         │  - Comparar      │
         │  - Elegir mejor  │
         └──────────────────┘
```

### Caso real: Optimización de algoritmo

```javascript
// multi-agent-optimizer.js
async function optimizeAlgorithm(currentCode) {
  const agents = [
    {
      id: 'refactor-clean',
      instruction: 'Refactoriza para legibilidad y mantenibilidad'
    },
    {
      id: 'optimize-speed',
      instruction: 'Optimiza para máxima velocidad (O(n) -> O(log n) si posible)'
    },
    {
      id: 'reduce-memory',
      instruction: 'Minimiza uso de memoria'
    }
  ];
  
  // Ejecutar en paralelo
  const solutions = await Promise.all(
    agents.map(agent =>
      claude.generateSolution({
        code: currentCode,
        approach: agent.instruction,
        agent_id: agent.id
      })
    )
  );
  
  // Evaluar cada solución
  const evaluations = await Promise.all(
    solutions.map(async (solution, i) => ({
      agent_id: agents[i].id,
      code: solution,
      metrics: await benchmarkCode(solution),
      tests_pass: await runTests(solution)
    }))
  );
  
  // Elegir mejor
  const best = evaluations.reduce((a, b) =>
    a.metrics.score > b.metrics.score ? a : b
  );
  
  return {
    solution: best.code,
    winner: best.agent_id,
    all_results: evaluations
  };
}
```

### Pros y Contras

| Aspecto | Ventaja | Desventaja |
|---------|---------|-----------|
| **Cobertura** | Explora múltiples enfoques | 3-5× más costo |
| **Calidad** | Elige la mejor solución | Tiempo total = max(agent) |
| **Robustez** | Divergencia de ideas | Difícil reproducir |
| **Insights** | Aprende de comparativa | Overhead análisis |

### Cuándo usarlo

✓ Decisiones arquitectónicas críticas  
✓ Optimizaciones donde costo importa  
✓ Investigación con múltiples enfoques  
✓ Mejora continua (A/B testing)  

❌ Bajo presupuesto  
❌ Deadline muy ajustado  
❌ Decisiones simples  

---

## 4. Patrón 4: Agent + Humano (Human-in-the-Loop)

### Concepto

Claude Code genera opciones, humano valida y elige. Feedback continuo.

```
User Input
    │
    ▼
Claude Code Agent
(Genera 3 opciones)
    │
    ├─► Opción A (Pros/Cons)
    ├─► Opción B (Pros/Cons)
    └─► Opción C (Pros/Cons)
         │
         ▼
      Humano revisa
      & elige
         │
         ▼
      Feedback → Claude aprende
```

### Caso real: Arquitectura de sistema

```javascript
// hitl-architect.js
async function designArchitecture(requirements) {
  let round = 1;
  
  while (round <= 3) {
    // Claude genera opciones
    const options = await claude.designOptions({
      requirements,
      previous_feedback: feedback_history,
      round
    });
    
    // Presentar a usuario
    console.log(`\n=== Ronda ${round} ===`);
    options.forEach((opt, i) => {
      console.log(`\n Opción ${i + 1}: ${opt.name}`);
      console.log(` Arquitectura:\n${opt.diagram}`);
      console.log(` Pros: ${opt.pros.join(', ')}`);
      console.log(` Contras: ${opt.cons.join(', ')}`);
    });
    
    // Obtener feedback
    const feedback = await getUserFeedback([
      'Elige la mejor opción (1-3)',
      '¿Qué cambios harías?',
      'Constraints adicionales?'
    ]);
    
    feedback_history.push({
      round,
      selected: options[feedback.choice - 1],
      feedback: feedback.comments,
      constraints: feedback.constraints
    });
    
    if (feedback.satisfied) {
      return options[feedback.choice - 1];
    }
    
    round++;
  }
  
  return feedback_history[feedback_history.length - 1].selected;
}
```

### Pros y Contras

| Aspecto | Ventaja | Desventaja |
|---------|---------|-----------|
| **Calidad** | Validación humana | Requiere experto |
| **Confianza** | Control total | Más lento (humano loop) |
| **Flexibilidad** | Feedback iterativo | Subjective |
| **Costo** | Balance | Overhead |

### Cuándo usarlo

✓ Decisiones críticas de negocio  
✓ Proyectos nuevos (no hay baseline)  
✓ Aprendizaje/mentoring  
✓ Cualquier task donde "human approval" requerido  

❌ Automatización 100%  
❌ Bajo budget de tiempo humano  

---

## 5. Patrón 5: Agent Jerárquico (Multi-Level)

### Concepto

Agentes especializados en capas. Manager coordina, workers ejecutan.

```
┌─────────────────────────────────────────┐
│   Manager Agent                         │
│   (Coordina, divide en subtareas)       │
└────────┬───────────────────┬────────────┘
         │                   │
         ▼                   ▼
   ┌──────────────┐  ┌──────────────┐
   │ Backend Team │  │ Frontend Team │
   │ (Sub-Agent)  │  │ (Sub-Agent)   │
   └──┬───────┬──┘  └──┬───────┬────┘
      │       │        │       │
      ▼       ▼        ▼       ▼
   [API]  [Data]  [UI]   [Styles]
```

### Caso real: Desarrollo full-stack

```javascript
// hierarchical-manager.js
async function buildFullStackApp(spec) {
  // Manager analiza requisitos
  const teams = {
    backend: new AgentTeam('Backend', ['API Design', 'Database', 'Auth']),
    frontend: new AgentTeam('Frontend', ['Components', 'Pages', 'Styling']),
    devops: new AgentTeam('DevOps', ['Docker', 'CI/CD', 'Monitoring'])
  };
  
  // Dividir y asignar
  const tasks = {
    backend: [
      { task: 'Design API spec', depends_on: [] },
      { task: 'Implement endpoints', depends_on: ['Design API spec'] },
      { task: 'Setup database', depends_on: ['Design API spec'] },
    ],
    frontend: [
      { task: 'Design components', depends_on: ['backend.Design API spec'] },
      { task: 'Build pages', depends_on: ['Design components'] },
    ],
    devops: [
      { task: 'Create Dockerfile', depends_on: ['backend.Implement endpoints'] },
      { task: 'Setup CI/CD', depends_on: ['Create Dockerfile'] },
    ]
  };
  
  // Ejecutar con dependencias respetadas
  const results = await executeDAG(tasks, teams);
  
  // Manager integra
  const integration = await teams.manager.integrate(results);
  
  return integration;
}

class AgentTeam {
  constructor(name, specialists) {
    this.name = name;
    this.specialists = specialists;
  }
  
  async executeTasks(tasks) {
    return Promise.all(
      tasks.map(task =>
        claude.generateCode({
          team: this.name,
          task: task.task,
          context: task.context,
          dependencies: task.dependencies
        })
      )
    );
  }
}
```

### Pros y Contras

| Aspecto | Ventaja | Desventaja |
|---------|---------|-----------|
| **Escalabilidad** | Maneja 50+ subtareas | Complejidad elevada |
| **Especialización** | Agentes especializados | Más prompts/coordinación |
| **Paralelismo** | Máxima concurrencia | Overhead DAG |
| **Mantenibilidad** | Modular | Debugging difícil |

### Cuándo usarlo

✓ Proyectos grandes (50+ ficheros)  
✓ Múltiples dominios (BE, FE, infra)  
✓ Automatización máxima  
✓ Organizaciones escalables  

❌ Proyectos pequeños  
❌ Requisitos dinámicos  

---

## 6. Matriz de Decisión

| Patrón | Tamaño Problema | Latencia | Costo | Confiabilidad | Mejor para |
|--------|---|---|---|---|---|
| **Orquestador** | Pequeño-mediano | Bajo | Bajo | Alta | Workflows definidos |
| **Agentico** | Pequeño | Alto | Variável | Medía | Debugging, investigación |
| **Multi-Agent** | Mediano | Alto | Muy alto | Alta | Decisiones críticas |
| **Human-in-Loop** | Cualquiera | Muy alto | Medio | Muy alta | Aprendizaje, validación |
| **Jerárquico** | Muy grande | Medio | Alto | Alta | Full-stack, escalable |

---

## 7. Ejemplos de Implementación

### Combo recomendado: Orquestador + Human-in-Loop

```javascript
// recommended-pattern.js
async function smartCodeReview(pr) {
  // Fase 1: Orquestador automático
  const autoReview = await orchestrateCodeReview(pr);
  
  // Fase 2: Human-in-Loop si crítico
  if (autoReview.severity === 'CRITICAL') {
    const humanDecision = await getHumanApproval(autoReview);
    
    if (!humanDecision.approved) {
      return {
        status: 'rejected',
        reason: humanDecision.reason,
        suggestions: autoReview.suggestions
      };
    }
  }
  
  // Fase 3: Aplicar cambios
  await applyChanges(pr, autoReview.suggestions);
  
  return { status: 'approved', review: autoReview };
}
```

---

## Resumen

**5 patrones para 5 casos:**
1. **Orquestador:** Workflows predefinidos
2. **Agentico:** Problemas dinámicos
3. **Competitivo:** Múltiples enfoques
4. **Human-in-Loop:** Validación humana
5. **Jerárquico:** Escalabilidad máxima

**Próximo:** Quiz Nivel 6

---

## Referencia rápida

```
Elige patrón por:

¿Flujo predeterminado? → ORQUESTADOR
¿Problema abierto? → AGENTICO
¿Decisión crítica? → COMPETITIVO
¿Requiere validación? → HUMAN-IN-LOOP
¿Muy grande? → JERÁRQUICO

Combo ganador:
ORQUESTADOR + HUMAN-IN-LOOP
= automatización inteligente + control
```

**Estado:** Lección completada. Próximo checkpoint: Quiz Nivel 6.
