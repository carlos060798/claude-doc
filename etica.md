# Ética y Limitaciones — Nivel 5

> Cuándo NO usar IA. Sesgo y alucinaciones. Responsabilidad. Marco de decisión ética. Casos extremos.

## Introducción

Claude Code es poderoso pero no omnisciente. Esta sección cubre:

- Cuándo NO usar IA
- Sesgo algorítmico
- Alucinaciones
- Responsabilidad legal
- Marco ético de decisión
- Casos extremos

**Tiempo estimado:** 60 minutos  
**Requisitos:** Pensamiento crítico, ética  
**Nivel de dificultad:** Intermedio-avanzado

---

## 1. Cuándo NO Usar IA

### Tabla de exclusión

| Contexto | Por qué NO | Alternativa |
|----------|-----------|-------------|
| **Vida/Muerte** | Error podría ser fatal | Humano experto certificado |
| **Decisión legal** | Responsabilidad legal | Abogado calificado |
| **Diagnóstico médico** | Licencia médica requerida | Médico, no IA |
| **Seguridad crítica** | No hay margen de error | Human security specialist |
| **Datos muy sensibles** | Riesgo exposición | On-premise, no cloud |
| **Decisión estratégica** | Requiere visión humana | Liderazgo, junta directiva |
| **Investigación criminal** | Cadena de custodia | Forensics profesional |
| **Algo "siente raro"** | Intuición humana importa | Pausa y revisa |

---

## 2. Alucinaciones: Qué son y cómo mitigar

### Qué es una alucinación

```
Claude genera código/información confiando que es correcto,
pero es parcialmente o totalmente falso.

Ejemplo:
P: "¿Cómo usar librería X?"
R: "Usa await X.doMagic()" ← INVENTADO si X.doMagic no existe
```

### Causas

```
1. Entrenamiento de datos (corte Feb 2025)
   → Información desactualizada o incorrecta

2. Patrón matching
   → Ve "librería.method()" y genera código similar
   → Pero método NO existe

3. Completación predictiva
   → "Si alguien pregunta X, respuesta típica es Y"
   → Aún si Y es incorrecta para este caso

4. Confianza sin grounding
   → No verifica contra código real
   → Solo genera basado en patrones
```

### Tasas de alucinación reales

```
Código simple (< 50 líneas):        1-3% alucinaciones
Código complejo (> 200 líneas):     5-10% alucinaciones
APIs/Librerías (no estándar):       10-20% alucinaciones
Arquitectura (nunca vista):         15-30% alucinaciones

Nota: Opus < Sonnet < Haiku (más pequeño = más alucinaciones)
```

### Mitigación: 5 técnicas

#### 1. Test inmediatamente

```javascript
// ❌ Alucinación típica
const suggestion = await claude.generateCode(...);
applyDirectly(suggestion);  // MALO

// ✅ Con validación
const suggestion = await claude.generateCode(...);
const canRun = await runTests(suggestion);
if (!canRun) {
  console.warn('Generated code failed tests, human review needed');
  return requireHumanApproval(suggestion);
}
applyWithConfidence(suggestion);
```

#### 2. Verificar imports/APIs

```javascript
function verifyImports(code) {
  const imports = code.match(/import|require.*from\s+['"]([^'"]+)['"]/g) || [];
  
  imports.forEach(imp => {
    const lib = imp.match(/['"]([^'"]+)['"]/)[1];
    if (!doesLibraryExist(lib)) {
      throw new Error(`HALLUCINATION DETECTED: Library '${lib}' doesn't exist`);
    }
  });
  
  return true;
}

function doesLibraryExist(libName) {
  // Buscar en npm registry, imports reales, docs, etc
  const response = await fetch(`https://registry.npmjs.org/${libName}`);
  return response.ok;
}
```

#### 3. Pedir explicación de fuente

```
P: "¿Cómo usar X.doMagic()?"
R: "Usa await X.doMagic() para..."

FOLLOW-UP:
P: "¿De dónde sacaste X.doMagic? ¿Está en documentación?"

Si Claude no puede justificar → Probablemente alucinación
```

#### 4. Comparar con múltiples modelos

```javascript
async function compareImplementations(task) {
  const sonnet = await claude.sonnet(task);
  const haiku = await claude.haiku(task);
  
  if (sonnet !== haiku) {
    console.warn('Models disagree - high hallucination risk');
    requireHumanReview();
  }
  
  return sonnet;  // Usar Opus (más preciso)
}
```

#### 5. Document assumptions

```javascript
const assumption = {
  'Library X has method doMagic()': true,
  'Method signature: async doMagic(input)': true,
  'Returns Promise<output>': true
};

// Luego verificar cada una antes de producción
Object.entries(assumption).forEach(([claim, value]) => {
  const isValid = verifyAssumption(claim);
  if (!isValid) {
    throw new Error(`ASSUMPTION VIOLATION: ${claim}`);
  }
});
```

---

## 3. Sesgo Algorítmico

### Tipos de sesgo en IA

#### Sesgo 1: Entrenamiento (data bias)

```
Si training data tiene sesgo histórico → Modelo aprende sesgo

Ejemplo:
- Data histórica: 80% hombres en roles técnicos
- Modelo aprende: "Developers típicamente varones"
- Output: Genera código con nombres/ejemplos varones-sesgados

MITIGACIÓN: Pedir diversidad explícita
- P: "Genera ejemplos de nombres diversos (no solo occidentales)"
```

#### Sesgo 2: Selección (selection bias)

```
Si solo usas Claude Code para ciertos tipos de tareas:
→ Introduces sesgo en qué problemas "parece fácil resolver"

Ejemplo:
- Usas solo para refactorización
- No usas para arquitectura
- Resultado: Pensás que refactorización "es fácil"

MITIGACIÓN: Usa IA uniformemente en todo el rango
```

#### Sesgo 3: Representación (representation bias)

```
Si código generado solo representa un idioma/cultura:
→ Código menos accesible

Ejemplo:
- Todos los comentarios en inglés
- Ejemplos solo de mercados occidentales
- Interfaces solo en inglés

MITIGACIÓN: Pedir explícitamente diversidad
- P: "Genera ejemplos para mercados: India, Japón, Brasil, etc"
```

### Checklist: Detectar sesgo

- [ ] ¿Ejemplos incluyen nombres diversos?
- [ ] ¿Ejemplos incluyen culturas diversas?
- [ ] ¿Suposiciones implícitas sobre usuarios?
- [ ] ¿Lenguaje inclusivo (no genérico-masculino)?
- [ ] ¿Accesibilidad considerada? (colores, fuentes, etc)
- [ ] ¿Casos extremos probados? (diferencias culturales)

---

## 4. Responsabilidad y Liability

### Quién es responsable si falla Claude?

```
┌─────────────────────────────────────────────┐
│  Error en código generado por Claude        │
└─────────────────────────────────────────────┘
                    ↓
        ┌──────────────────────┐
        │ ¿Cuándo ocurrió?     │
        └──────────────────────┘
          │              │
      B4 review      After review
          │              │
    Dev responsable   Dev + Reviewer responsable
```

### Matriz de responsabilidad

| Escenario | Responsable | Razón |
|-----------|---|---|
| Claude genera bug, dev lo sube sin revisar | Dev | Debería revisar siempre |
| Claude genera bug, dev revisa pero no ve | Dev + Reviewer | Responsabilidad compartida |
| Claude genera bug no detectable por tests | Org | Pruebas insuficientes |
| Claude alucinación con documentación falsa | Claude (Anthropic) | AI company responsibility |
| Dev SABE que es risky pero pushea igual | Dev | Negligencia |

### Cobertura legal

```
Contrato típico Anthropic:
└─ "Proporcionamos servicios 'AS IS'"
   └─ Sin garantías de exactitud
   └─ No responsables por hallucinations
   └─ TÚ eres responsable de verificar output

IMPLICA:
✓ Debes revisar código generado
✓ Tests son tu responsabilidad
✓ No puedes culpar a Anthropic si falla

PROTECCIÓN:
✓ Code review + tests = mitigación legal
✓ CI/CD validation = evidencia de diligencia
✓ Documentación de proceso = defensa
```

---

## 5. Marco de Decisión Ética

### 5 preguntas antes de usar Claude Code

```
1. ¿Está aprobado por mi organización?
   NO → Obtén aprobación primero
   SÍ → Continúa

2. ¿Puedo verificar el resultado?
   NO → Aumenta verificación manual
   SÍ → Continúa

3. ¿Hay riesgo de sesgos?
   SÍ → Agregá diversidad a prompt, test
   NO → Continúa

4. ¿Requiere responsabilidad 100% traza?
   SÍ → Requiere humano; no uses IA
   NO → Continúa

5. ¿Es moral y legal?
   NO → No hagas (fraud, hacking, etc)
   SÍ → USA CLAUDE CODE ✓
```

### Diagrama de flujo

```
┌─ ¿Es tarea técnica legítima? ─┐
│                               │
NO                              SÍ
│                               │
└─ NO USES ─────────────────────┤
                                 │
                    ┌─ ¿Datos sensibles? ─┐
                    │                      │
                   SÍ                      NO
                    │                      │
                    └─ SANITIZAR ──────────┤
                                           │
                              ┌─ ¿Crítico? ─┐
                              │              │
                             SÍ              NO
                              │              │
                              └─ HUMANO ─────┤
                                             │
                              ┌─ Tests OK? ─┐
                              │              │
                             SÍ              NO
                              │              │
                              │         Fix & Re-test
                              │              │
                          MERGE ─────────────┴─
```

---

## 6. Casos Extremos y Dilemmas

### Dilema 1: "Bug crítico en production, Claude Code dice 1 min vs humano 30 min"

**Decisión:** Usa Claude Code, pero:
1. Aplica fix
2. Ejecuta tests
3. Monitorea 5 min
4. Post-mortem: ¿por qué humano tardó 30 min?

**Ética:** Si salva uptime sin riesgo, es justificable.

### Dilema 2: "Cliente pidió feature donde IA hace bias injusto"

**Decisión:** Rechaza request, explica por qué
- P: "Eso crearía sesgo contra grupo X"
- Solución: Feature con validación de sesgo

**Ética:** Tu responsabilidad ética > deadline

### Dilema 3: "Código legacy muy complejo, Claude dice 'reescribir desde cero'"

**Decisión:** Second opinion
- Consulta arquitecto humano
- Si Claude y humano coinciden → reescribir
- Si difieren → investigar más

**Ética:** No confíes ciegamente, valida siempre

---

## 7. Guías por Industria

### SaaS / Web Dev

```
✓ USA: Code review, testing, refactoring
✗ NO USES: Decisiones de arquitectura críticas sin humano
```

### Healthcare

```
✓ USA: Testing, refactoring de lógica general
✗ NO USES: Cálculos médicos, diagnósticos
  → Requiere validación médica humana
```

### Fintech

```
✓ USA: Code review, testing, optimización
✗ NO USES: Cálculos de riesgo, decisiones de crédito
  → Requiere validación financiera humana
```

### Government/Military

```
✓ USA: Testing, análisis de requisitos
✗ NO USES: Nada sin aprobación explícita
  → Security clearance requerida
```

---

## Resumen

**5 ideas clave:**
1. **Alucinaciones son reales** — siempre testa
2. **Sesgo existe** — pide diversidad explícita
3. **Responsabilidad es tuya** — no culpes a IA
4. **Marco ético** ayuda a decidir rápido
5. **Algunos contextos son off-limits** — respeta límites

**Próximo:** Nivel 5 → Monitoreo de Costos

---

## Referencia rápida

```
NUNCA USES:
- Life/death decisions
- Diagnósticos médicos
- Decisiones legales críticas
- Datos super-sensibles (passwords, PII)

SIEMPRE VALIDA:
- Tests pasan
- Humano revisa
- Suposiciones verificadas
- Sesgo detectado

PREGUNTA MÁGICA:
"¿Si esto falla, quién es responsable?"
→ Si TÚ → Puedes usar Claude
→ Si cliente → Requiere aprobación
→ Si vidas → NO USES
```

**Estado:** Lección completada. Próximo checkpoint: Quiz Nivel 5.
