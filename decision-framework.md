# Decision Framework — Nivel 1

> Árbol de decisión: cuándo usar Claude Code. Matriz por tipo de tarea. Antipatrones de uso. Comparativa vs alternativas. Límites conocidos.

## Introducción

Claude Code es poderoso, pero no es la herramienta para TODO. Esta sección te enseña a tomar decisiones rápidas y confiables:

- ¿Debería usar Claude Code ahora?
- ¿Qué alternativa es mejor?
- ¿Cuáles son los límites reales?
- ¿Cuándo NO usar Claude Code?

**Tiempo estimado:** 40 minutos  
**Requisitos:** Conocimiento básico de herramientas dev  
**Nivel de dificultad:** Introductorio

---

## 1. Árbol de Decisión Rápido

```
┌─ ¿Tengo una tarea técnica?
│  │
│  ├─ NO → "No es para Claude Code" ✗
│  │
│  └─ SÍ
│     │
│     ├─ ¿Requiere juicio humano crítico?
│     │  ├─ SÍ (decisiones arquitectónicas mayores) → Úsalo como brainstorm, tú decides final
│     │  └─ NO → Continúa
│     │
│     ├─ ¿Es repetitivo, mecánico?
│     │  ├─ SÍ (transcribir 100 registros) → Usa script automatizado, no Claude
│     │  └─ NO → Continúa
│     │
│     ├─ ¿Requiere información confidencial/sensible?
│     │  ├─ SÍ (contraseñas, claves, datos personales) → NO USES ✗
│     │  └─ NO → Continúa
│     │
│     ├─ ¿Necesito respuesta en < 5 segundos?
│     │  ├─ SÍ → Usa búsqueda, no Claude Code
│     │  └─ NO → Continúa
│     │
│     └─ ✓ USA CLAUDE CODE
```

---

## 2. Matriz de Decisión por Tipo de Tarea

### Matriz: Cuando SÍ usar Claude Code

| Tipo de tarea | Descripción | Caso ejemplo | Tiempo ahorrado | Confianza |
|---|---|---|---|---|
| **Code Review** | Revisar PR, encontrar bugs | Review 200 líneas de código | 2-4h → 15min | Muy alta |
| **Refactorización** | Mejorar código existente | Extraer función duplicada | 8-20h → 1-2h | Muy alta |
| **Testing** | Generar tests | Crear 20 test cases Jest | 4-8h → 30min | Alta |
| **Debugging** | Encontrar y fijar error | Stack trace: "Cannot read X" | 2-6h → 15-30min | Alta |
| **Arquitectura** | Diseñar solución | Cómo hacer escalable X? | 6-12h → 1h | Media* |
| **Documentation** | Escribir docs/README | API endpoint spec | 2-4h → 15min | Muy alta |
| **Migration** | Actualizar tecnología | Express 4 → 5, TS migration | 8-16h → 2-4h | Muy alta |
| **Code generation** | Crear boilerplate | CRUD API, form validator | 2-4h → 5min | Muy alta |
| **Performance** | Optimizar velocidad | Reduce bundle 50% | 8-16h → 1-2h | Alta |
| **MCP/Skills** | Crear automatizaciones | Custom MCP server | 20-40h → 4-6h | Alta |

*Requiere validación humana

### Matriz: Cuando NO usar Claude Code

| Tipo de tarea | Por qué NO | Alternativa |
|---|---|---|
| **Decisión estratégica** | Requiere contexto organizacional | Juntas humanas, escalada |
| **Confidencial/Sensible** | Riesgo exposición datos | Herramientas locales/privadas |
| **Latencia crítica** | <500ms requerido | Búsqueda local, caché |
| **Tarea única (forever)** | Requiere humano especialista | Contratar/entrenar |
| **Integración con sistemas privados** | Riesgo seguridad | API local o sandbox |
| **Juego competitivo** | Requiere estrategia única | Brainstorm humano + ejecución |
| **Creatividad pura** | IA tiende a clichés | Diseñadores/UX humans |
| **Responsabilidad legal** | Trazabilidad/auditoría requerida | Humano responsable |

---

## 3. Antipatrones de Uso (❌ No hagas esto)

### Antipatrón 1: "Hazlo todo, yo verifico después"

```
❌ MAL:
"Migra 500 líneas de código a TypeScript, refactoriza, agrega tests"

✓ BIEN:
"Migra este fichero (50 líneas) a TypeScript. Yo reviso, luego siguiente."
```

**Riesgo:** Cambios ocultos, errores propagados  
**Solución:** Divide en chunks pequeños (< 100 líneas por request)

### Antipatrón 2: Información confidencial

```
❌ MAL:
"Debuggea por qué falla la API. Aquí está el JWT, la BD URL, contraseña..."

✓ BIEN:
"Falla con error 401. Stack trace: [sin credenciales]. BD schema en modelo.sql"
```

**Riesgo:** Exposición de secretos  
**Solución:** Siempre sanitiza datos. Usa .env, no hardcode

### Antipatrón 3: Esperar respuesta de IA en crítico

```
❌ MAL:
"Tengo incident en producción. Debuggea rápido."

✓ BIEN:
"Incident crítico. Yo manejo. Claude Code útil después para post-mortem."
```

**Riesgo:** Latencia, timeout, respuesta incompleta  
**Solución:** Usa IA para investigación, humano para acción rápida

### Antipatrón 4: Múltiples tareas en 1 prompt

```
❌ MAL:
"1) Crea API. 2) Crea BD. 3) Crea frontend. 4) Deploy. 5) Tests."

✓ BIEN:
"[ETAPA 1] Diseña OpenAPI spec para POST /users. Entrega YAML."
```

**Riesgo:** Respuesta confusa, scope explosion  
**Solución:** 1 tarea = 1 prompt. Secuencial o paralelo consciente

### Antipatrón 5: Confianza ciega en salida

```
❌ MAL:
Claude: "Aquí está el code"
Tú: *Copia directo a prod sin revisar*

✓ BIEN:
Claude: "Aquí está el code"
Tú: Code review → Local test → PR review → Merge
```

**Riesgo:** Bugs silenciosos, hallucinations  
**Solución:** SIEMPRE verifica, testa, revisa código antes de prod

### Antipatrón 6: Usar Opus para todo

```
❌ MAL:
"¿Cuál es la sintaxis de for-loop en Python?"
→ Usa Opus: $0.015

✓ BIEN:
"¿Qué patrón usar para X complejo?"
→ Usa Opus: $0.30

O:
"¿Sintaxis de for-loop?"
→ Usa Haiku: $0.001 + búsqueda
```

**Riesgo:** Costo 15x innecesario  
**Solución:** Usa Haiku/Sonnet para simple, Opus para complejo

---

## 4. Comparativa: Claude Code vs Alternativas

### vs Cursor (IDE)

| Aspecto | Claude Code | Cursor |
|---|---|---|
| **Integración** | CLI (agnóstico) | IDE-native (VS Code) |
| **Modelos** | Opus, Sonnet, Haiku | Opus, GPT-4o |
| **Ventaja** | Flexible, múltiples casos | Más integrado en flujo |
| **Mejor para** | Refactor, investigación | Coding real-time |
| **Costo** | $10-50/mes | $20/mes |
| **Curva aprendizaje** | Media | Baja |

**Recomendación:** Usa ambas. Cursor para coding, Claude Code para tareas específicas.

### vs GitHub Copilot

| Aspecto | Claude Code | Copilot |
|---|---|---|
| **Contexto** | Muy amplio (200K tokens) | Limitado (archivo + imports) |
| **Velocidad** | 1-10s por respuesta | Instant (<100ms) |
| **Mejor para** | Análisis, refactor | Completación línea-a-línea |
| **Precisión** | Alta (Opus) | Media-alta |
| **Costo** | $10-50/mes | $10/mes |

**Recomendación:** Copilot para autocompletar, Claude Code para análisis profundo.

### vs ChatGPT (web)

| Aspecto | Claude Code | ChatGPT |
|---|---|---|
| **Contexto** | Ficheros reales | Solo texto pégado |
| **Integración** | CLI tool | Web browser |
| **Token limit** | 200K (Opus) | 8K-128K (modelo dependiente) |
| **Custom tools** | MCP, Skills | Plugins (limitados) |
| **Mejor para** | Proyecto integral | Preguntas rápidas |

**Recomendación:** ChatGPT para aprender, Claude Code para trabajar.

### vs StackOverflow

| Aspecto | Claude Code | StackOverflow |
|---|---|---|
| **Contexto** | TU código específico | Ejemplos genéricos |
| **Actualización** | May 2026 | Depende de votación |
| **Respuesta** | Específica tu caso | Caso general |
| **Confiabilidad** | Alta (si usas bien) | Variable |
| **Costo** | $20-50/mes | Gratis |

**Recomendación:** SO para conceptos, Claude Code para tu código.

---

## 5. Límites Conocidos (Sé realista)

### Límite 1: Alucinaciones

```
Realidad: Claude PUEDE inventar funciones, librerías, sintaxis.

Ejemplo:
Pregunta: "¿Cómo usar librería X?"
Claude: "Usa await X.doMagic()" ← INVENTADO si no existe

Mitigación:
✓ Verifica imports reales: npm search, docs oficial
✓ Prueba código antes de producción
✓ Usa Opus (menos hallucinations)
```

### Límite 2: Contexto temporal

```
Realidad: Claude conoce hasta Feb 2025 (en el contexto global).
Pero dentro del chat, olvida si pasado mucho tokens.

Ejemplo:
Request 1: "API de X está en fichero Y"
Request 50: "¿Recuerdas el fichero?" ← Puede NO recordar

Mitigación:
✓ Pasa fichero nuevamente si es importante
✓ Usa /proyect-summary o memory en CLAUDE.md
✓ Resumen frecuente de contexto
```

### Límite 3: Razonamiento complejo

```
Realidad: Claude es bueno pero no es ingeniero senior confirmado.

Ejemplo:
Pregunta: "¿Qué patrón arquitectónico para 100K users?"
Respuesta: "Buena sugerencia, pero depende de más factores"

Mitigación:
✓ Brainstorm con Claude, TÚ decides final
✓ Para decisiones críticas: arquitecto humano valida
✓ Usa como segunda opinión, no única verdad
```

### Límite 4: Latencia

```
Realidad: Claude responde en 1-20 segundos típico.

Límites:
- <500ms: IMPOSIBLE (usa búsqueda, cache)
- 500ms-2s: DIFÍCIL (considera alternativa)
- 2-10s: NORMAL (aceptable para tareas)
- >10s: LARGO (válido para análisis profundo)

Mitigación:
✓ Para latencia crítica: crea caché previo
✓ O usa Haiku (20-30% más rápido)
✓ O úsalo asincrónico (no esperes respuesta)
```

### Límite 5: Confidencialidad

```
Realidad: Anthropic puede ver tu input (protegido por privacidad).

Riesgo:
- NO envíes: Contraseña, JWT, claves API, datos personales
- Riesgo moderado: Código propietario (protegido legalmente)
- Seguro: Lógica de negocio, arquitectura, procesos

Mitigación:
✓ Sanitiza SIEMPRE credenciales
✓ Usa .env en .gitignore
✓ Si crítico: soluciones on-premise (self-hosted)
✓ Acuerdo: Leer terms de servicio Anthropic
```

### Límite 6: Código generado (calidad)

```
Realidad: Claude genera código que FUNCIONA pero puede no ser optimal.

Ejemplo:
Claude genera: O(n²) cuando optimal es O(n)
Claude genera: Sin tests cuando son críticos
Claude genera: Sin error handling

Mitigación:
✓ Siempre revisa: Algoritmos, tests, error handling
✓ Usa linter, type checker, tests
✓ Prueba casos edge antes de producción
```

---

## 6. Checklist de Decisión (Antes de usar)

Responde estas 5 preguntas:

1. **¿Es técnico?**
   - [ ] Sí → Continúa
   - [ ] No → Usa otra herramienta

2. **¿Tengo contexto claro?**
   - [ ] Sí → Continúa
   - [ ] No → Aclara primero en chat

3. **¿Es confidencial/sensible?**
   - [ ] No → Continúa
   - [ ] Sí → NO USES (sanitiza o olvida)

4. **¿Puedo verificar resultado?**
   - [ ] Sí (test, code review, ejecución) → Continúa
   - [ ] No → Reconsidera

5. **¿Vale la pena?**
   - [ ] Sí (> 30 min de ahorro esperado) → USA CLAUDE CODE ✓
   - [ ] No → Hazlo manual

---

## 7. Matriz de Confianza (Cuándo confiar salida)

| Tipo de tarea | Confianza | Requisito antes de usar |
|---|---|---|
| **Sintaxis/Boilerplate** | 95% | Compilar/linter |
| **Logic simple (<100 líneas)** | 90% | Unit test + ejecución |
| **Refactorización** | 85% | Code review + test suite |
| **Architecture design** | 60% | Validación arquitecto humano |
| **Security code** | 70% | Security review humano |
| **Algorithm optimization** | 80% | Benchmark antes/después |
| **API design** | 75% | Usuari test (si aplica) |

**Regla:** Más baja confianza = más validación humana requerida.

---

## 8. Flujo de Decisión en Tiempo Real

### Escenario 1: "Tengo un bug en producción"

```
1. ¿Criticidad: está down? → Mitigación manual AHORA
2. ¿Error conocido? → Busca SO / docs
3. ¿Error nuevo/complejo? → Claude Code después de mitigación
4. Usa Claude Code para: Post-mortem, prevención futura
```

### Escenario 2: "Necesito API nueva"

```
1. ¿Tengo spec/requisitos? 
   NO → Escribe spec primero (30min)
   SÍ → Continúa
2. ¿Código similar existe?
   SÍ → Modifica existente (Claude: refactor)
   NO → Genera desde cero (Claude: create)
3. Genera → Test localmente → PR review → Merge
```

### Escenario 3: "¿Qué patrón arquitectónico?"

```
1. Describe problema específico
2. Claude: Sugiere 3-4 opciones + pros/cons
3. TÚ: Validas con team/arquitecto
4. Implementas con Claude asistiendo
```

---

## Resumen

**5 ideas clave:**
1. **Árbol de decisión** resuelve 80% de "¿debo usar Claude Code?"
2. **Antipatrones** te protegen de trampas comunes
3. **Comparativas** muestran cuándo usar qué herramienta
4. **Límites reales** ayudan a no confiar ciegamente
5. **Checklist de 5 preguntas** = decisión rápida confiable

**Próximo:** Nivel 1 → Fundamentos de CLI

---

## Referencia rápida

```
USAR CLAUDE CODE CUANDO:
✓ Tareas técnicas complejas (refactor, debug, test)
✓ Puedo proporcionar contexto
✓ Puedo verificar resultado
✓ Ahorro > 30 minutos

NO USAR CUANDO:
✗ Datos confidenciales/sensibles
✗ Latencia < 500ms requerida
✗ Decisión estratégica crítica
✗ Responsabilidad legal/auditoría
```

**Estado:** Lección completada. Próximo checkpoint: Quiz Nivel 1.
