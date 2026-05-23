# Adopción en Equipos — Nivel 5

> Plan 4 semanas. Material onboarding. Métricas de éxito. Comunicación stakeholders. Change management.

## Introducción

Implementar Claude Code a nivel equipo requiere estrategia. Esta sección cubre:

- Plan de adopción 4 semanas
- Material de onboarding
- Métricas de éxito
- Cambio organizacional
- Comunicación con stakeholders

**Tiempo estimado:** 90 minutos  
**Requisitos:** Rol de liderazgo o PM  
**Nivel de dificultad:** Avanzado

---

## 1. Plan de Adopción 4 Semanas

### Semana 1: Educación y Setup

#### Día 1: Kick-off (30 min)

```
📅 Reunión: Equipo completo
🎯 Objetivo: Entender qué es Claude Code, por qué lo usamos

Agenda:
1. Intro 10 min: "¿Qué es Claude Code?"
2. Demo 10 min: Code review automático (live)
3. Q&A 10 min

Tarea: Todos crean cuenta en console.anthropic.com
```

#### Día 2-3: Training (2h cada uno)

```
Sesión A: Fundamentos (2h)
├─ Prompt Craft Básico (30 min)
├─ Decision Framework (30 min)
├─ Live coding: 1 tarea juntos (30 min)
└─ Q&A (30 min)

Sesión B: Práctico (2h)
├─ Setup local (15 min)
├─ Tarea 1: Code review (45 min, guiado)
├─ Tarea 2: Generar tests (45 min, guiado)
└─ Shared learnings (15 min)

Recurso: Guía de referencia rápida (1 página PDF)
```

#### Día 4-5: Hands-on Lab (Asincrono)

```
Lab 1: Code Review (individual)
├─ Input: PR pequeño (100 líneas)
├─ Tarea: Usa Claude Code para revisar
├─ Output: Reporte de análisis
├─ Revisión: Tech lead valida

Lab 2: Generar Tests (pair)
├─ Input: Función sin tests
├─ Tarea: Generar 80%+ cobertura
├─ Output: Test suite
└─ Validación: Tests pasan localmente
```

**Entregables semana 1:**
- ✅ Todos con cuenta + acceso configurado
- ✅ 80% del equipo completó training
- ✅ 50% completó labs prácticos
- ✅ Issues/feedback documento

---

### Semana 2: Integración en Flujos

#### Objetivo: Claude Code en workflow real

#### Día 6-7: Code Review Asistido

```
Nueva política: Todos usan Claude Code en PRs
├─ Tech lead aún hace revisión humana
├─ Claude Code genera reporte inicial
├─ Humano valida + agrega insight
└─ Tiempo review: 40% menor (target)

Métrica de éxito:
- 100% PRs con análisis de Claude Code
- Feedback positivo en retro
```

#### Día 8-9: Testing en Features Nuevas

```
Política: Todas las features nuevas
├─ Generar tests con Claude Code
├─ Coverage >= 80%
├─ Tests pasan en CI

Métrica:
- Coverage promedio: 75% → 85%
```

#### Día 10: Retro Semana 2

```
Reunión (45 min):
├─ ¿Qué funcionó?
├─ ¿Qué no funcionó?
├─ Ajustes para semana 3?

Esperado:
- Entusiasmo: 7/10+
- Adoption: 70%+ de equipo
- Blockers: documentar y resolver
```

**Entregables semana 2:**
- ✅ 100% PRs con análisis
- ✅ 70%+ adoption rate
- ✅ Retroalimentación > 7/10
- ✅ Blockers identificados + plan

---

### Semana 3: Escalado y Optimización

#### Día 11-12: Casos de Uso Avanzados

```
Sesión optativa (1h):
├─ Refactorización asistida
├─ Debugging con Claude Code
├─ MCP custom básico
└─ Q&A

Target: 50% del equipo participa
```

#### Día 13-14: Métricas y Reporting

```
Reporte para stakeholders:
├─ Horas ahorradas (estimado)
├─ PRs analizados: X
├─ Tests generados: Y
├─ Problemas encontrados por Claude: Z
├─ Adoption rate: XX%
├─ NPS: score
└─ Cost: $XXX

Preparar: Email + dashboard
```

#### Día 15: Optimización de Workflow

```
Basado en feedback semana 2:
├─ Cambios en política de PR
├─ Templates mejorados
├─ Scripts automatizados (si aplica)
└─ Integración con herramientas (IDE, etc)
```

**Entregables semana 3:**
- ✅ Reporte a stakeholders
- ✅ 85%+ adoption rate
- ✅ Optimizaciones implementadas
- ✅ Dashboard visible

---

### Semana 4: Institucionalización

#### Día 16-17: Documentación

```
Crear wiki interno:
├─ Best practices (5 patrones)
├─ Templates prompt (10)
├─ Errores comunes (10 con soluciones)
├─ FAQ
└─ Videos cortos (5)

Link en #general slack
```

#### Día 18-19: Roles y Ownership

```
Designar:
├─ Claude Code Champion (1 senior dev)
├─ Onboarding Mentor (1 mid-level)
├─ Policy Owner (1 tech lead)

Responsabilidades:
├─ Champion: mantiene best practices
├─ Mentor: nuevos devs
├─ Owner: actualiza políticas
```

#### Día 20: Cierre y Próximos Pasos

```
Reunión cierre (1h):
├─ Métricas finales
├─ Celebración logros
├─ Plan de mejora continua

Plan post-adopción:
├─ Reuniones bimensuales (30 min)
├─ Reportes mensuales
├─ Evaluación trimestral de ROI
```

**Entregables semana 4:**
- ✅ Wiki completado
- ✅ Roles asignados
- ✅ Plan de mantenimiento
- ✅ 90%+ adoption rate

---

## 2. Material de Onboarding

### Guía Rápida (1 página, PDF)

```markdown
# Claude Code en 60 Segundos

## ¿Qué es?
IA para analizar código, generar tests, refactorizar automáticamente.

## Por qué lo usamos
- Code review 50% más rápido
- Bugs encontrados 2 horas antes
- Testing 80% cobertura sin esfuerzo manual

## Primeros pasos
1. `npm install -g @anthropic-ai/claude-code`
2. `claude-code auth login`
3. `claude-code review <fichero>`

## Caso real (5 min)
```
Input: Función buggy (20 líneas)
Claude Code: Encuentra 2 bugs, sugiere fix
Tiempo: 30 segundos (vs. 30 min manual)
```

## 3 comandos principales
```
claude-code review FILE          # Code review
claude-code test FILE            # Generar tests
claude-code refactor FILE --goal # Refactorizar
```

## Cuando usar (✓) y no usar (✗)
✓ Code review, tests, refactorización, debugging
✗ Datos sensibles, decisiones estratégicas, latencia <500ms

## Preguntas?
→ Contacta @claude-code-champion
```

### Checklist Onboarding (para managers)

```
Nuevo dev {{ name }}
Equipo: {{ team }}
Fecha inicio: {{ date }}

Día 1:
- [ ] Crear cuenta Anthropic (email corporativo)
- [ ] Agregar a team en console.anthropic.com
- [ ] Instalar Claude Code localmente
- [ ] Enviar guía rápida
- [ ] Q&A (15 min con mentor)

Día 2-3:
- [ ] Completar training video (45 min)
- [ ] Leer 2 páginas: "Prompt Craft" + "Decision Framework"
- [ ] Hacer ejercicio práctico 1: code review (guiado)

Día 4-5:
- [ ] Ejercicio práctico 2: generar tests
- [ ] Primera tarea real con Claude Code (supervisado)
- [ ] Feedback sesión (15 min)

Semana 2:
- [ ] Independencia: usar en PRs reales
- [ ] Check-in con mentor

Sign-off:
- Dev: Confirmé entendimiento ___
- Mentor: Dev listo para usar ___ 
- Manager: Onboarding completado ___
```

---

## 3. Métricas de Éxito

### Metrics Framework (4 pilares)

```yaml
PILAR 1: ADOPTION
├─ Métrica: % equipo usando Claude Code
├─ Target: Semana 1: 50%, Semana 2: 70%, Semana 3: 85%, Semana 4: 90%
├─ Tracking: Dashboard de actividad
├─ Owner: Tech lead

PILAR 2: PRODUCTIVIDAD
├─ Métrica: Horas ahorradas (estimado)
├─ Target: 20h/dev/mes → 40h ahorrados/mes total
├─ Cálculo: (time_without - time_with) × # devs
├─ Owner: PM

PILAR 3: CALIDAD
├─ Métrica: Bugs encontrados por Claude Code
├─ Target: 2-5 bugs/1000 LOC analizados
├─ Métrica 2: Test coverage
├─ Target: 75% → 85%
├─ Owner: QA lead

PILAR 4: SATISFACCIÓN
├─ Métrica: NPS (Net Promoter Score)
├─ Target: > 50 (promoters - detractors)
├─ Métrica 2: "¿Usarías de nuevo?"
├─ Target: > 80% "SÍ"
├─ Owner: Tech lead
```

### Dashboard Métricas

```
═══════════════════════════════════════════════════════════
                CLAUDE CODE ADOPTION — Semana 4
═══════════════════════════════════════════════════════════

ADOPTION RATE:              90% ✅
├─ Semana 1: 50%
├─ Semana 2: 70%
├─ Semana 3: 85%
└─ Semana 4: 90%

PRODUCTIVIDAD:              +180h ahorradas ✅
├─ Code review: +60h
├─ Testing: +80h
├─ Refactorización: +40h

CALIDAD:                    +15% coverage ✅
├─ Tests generados: 240+
├─ Bugs encontrados: 12
├─ Bugs prevented: ~20 (estimado)

SATISFACCIÓN:              NPS: 65 ✅
├─ Promoters: 70%
├─ Passives: 20%
├─ Detractors: 10%

COSTO:                      $480 (mes 1)
├─ Tokens: 12M
├─ ROI: 400% (180h × $60 / $480)

PRÓXIMOS PASOS:
├─ Implementar MCP server custom
├─ Expandir a DevOps
├─ Integración con IDE
```

---

## 4. Comunicación Stakeholders

### Email Semana 1 (Kick-off)

```
Subject: 🚀 Iniciamos Claude Code Adoption — Equipo {{ team }}

Hola {{ stakeholder }},

Emocionados de compartir que esta semana iniciamos Claude Code,
una herramienta de IA que mejora productividad de ingeniería.

¿Qué es Claude Code?
→ Análisis automático de código, generación de tests, refactorización

¿Por qué ahora?
→ Benchmarks muestran +50% velocity en code review, +80% test coverage

¿Qué esperar?
- Semana 1-2: Training + pilot en 3-5 PRs
- Semana 3-4: Rollout completo al equipo
- Mes 2+: Optimización y expansión

¿Cuál es el impacto en mí?
→ PRs más rápidas (reviewers), mejor calidad (product), menos bugs (QA)

Próxima semana compartimos métricas iniciales.

{{ tech_lead_signature }}
```

### Email Semana 3 (Progress Report)

```
Subject: Claude Code Adoption — Semana 3 Report (90% adoption rate ✅)

Hola {{ stakeholder }},

Fantastic progress! 🎉

RESUMEN (3 semanas):
- Adoption: 85% equipo activamente usando
- Horas ahorradas: ~120h (estimado)
- PRs analizadas: 140+
- Tests generados: 180+
- Bugs encontrados: 8
- Satisfacción: NPS 65

PRÓXIMA SEMANA:
- Documentación de best practices
- Roles y ownership asignados
- Plan de mejora continua

¿Preguntas? Agenda 1:1 conmigo.

{{ tech_lead_signature }}
```

### Email Semana 4 (Final Report)

```
Subject: Claude Code Adoption — Final Report & Learnings

Hola {{ stakeholder }},

Completamos la adopción de Claude Code. 4 semanas, 90% adoption rate.

IMPACTO FINAL:
╔════════════════════════════════════════════╗
║ Métrica         │ Target   │ Actual   │ ✓  ║
╠════════════════════════════════════════════╣
║ Adoption        │ 90%      │ 90%      │ ✓  ║
║ Horas ahorradas │ 180h     │ 180h+    │ ✓  ║
║ Test coverage   │ 85%      │ 87%      │ ✓  ║
║ NPS             │ 50       │ 65       │ ✓  ║
║ ROI             │ 300%     │ 375%     │ ✓  ║
╚════════════════════════════════════════════╝

APRENDIZAJES:
1. Pair programming acelera adoption
2. Champions internos son clave
3. Feedback loop weekly es crítico
4. ROI es obvia a las 3 semanas

SIGUIENTES PASOS:
- Mes 2: Expandir a otros equipos
- Mes 3: MCP servers custom
- Trim 2: Integración IDE

Gracias por tu apoyo.

{{ tech_lead_signature }}
```

---

## 5. Change Management

### Gestionar Resistencia

| Objeción | Respuesta | Acción |
|----------|-----------|--------|
| "No confío en IA" | Código siempre revisado por humano | Demo: ver review en vivo |
| "Es otro tool que aprender" | 3 comandos, manual 1 página | Hands-on sesión |
| "¿Y si genera código malo?" | 80% acierto, requiere validación | Tests + code review |
| "¿Privacidad de código?" | Datos privados, encriptado, 30d retention | Leer terms juntos |
| "¿Cuánto cuesta?" | $400/mes equipo, ROI 300%+ | Mostrar calc |

### Comunicación positiva

```
❌ MALO:                               ✅ BIEN:
"Tenemos que usar Claude Code"      "Ofrecemos Claude Code (opcional)"
"Hará tu job obsoleto"               "Te deja enfocarte en diseño"
"Es un requisito"                    "Es un superpower"
"¿Por qué no usas?"                  "¿Necesitas help con setup?"
```

---

## Resumen

**5 ideas clave:**
1. **Plan 4 semanas** estructurado = 90% adoption
2. **Onboarding robusto** (checklist) = sin fricciones
3. **Métricas visibles** = gana confianza stakeholders
4. **Comunicación frecuente** = mantiene momentum
5. **Champions internos** = sostenibilidad

**Próximo:** Nivel 5 → Seguridad & Compliance

---

## Referencia rápida

```
SEMANA 1: EDUCACIÓN
- Training, setup, labs

SEMANA 2: INTEGRACIÓN  
- Claude Code en workflow real

SEMANA 3: ESCALADO
- Casos avanzados, reporting

SEMANA 4: INSTITUCIONALIZACIÓN
- Wiki, roles, sostenibilidad

ÉXITO = 90% adoption + NPS 50+ + ROI 300%+
```

**Estado:** Lección completada. Próximo checkpoint: Quiz Nivel 5.
