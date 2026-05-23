# Laboratorios Prácticos — Todos los Niveles

> Lab 1: Debugging Asistido. Lab 2: MCP Server Custom. Lab 3: Skill con CI. Lab 4: GitHub Action. Rubric de evaluación.

## Introducción

La mejor manera de aprender Claude Code es **hacerlo**. Este módulo tiene 4 labs progresivos:

- **Lab 1 (Nivel 1-2):** Debugging asistido (skill básica)
- **Lab 2 (Nivel 3-4):** Crear MCP server (advanced skill)
- **Lab 3 (Nivel 4-5):** Skill con CI pipeline (automatización)
- **Lab 4 (Nivel 5-6):** GitHub Action + workflows (mastery)

**Tiempo estimado:** 180 minutos (45 min cada lab)  
**Requisitos:** Git, Node.js 18+, experiencia básica coding  
**Formato:** Self-paced, con rubric de evaluación

---

## Lab 1: Debugging Asistido (45 min)

### Objetivo
Usar Claude Code para diagnosticar y arreglar un bug real.

### Escenario

Tienes una función que falla en producción:

```javascript
// src/utils/calculateDiscount.js
export function calculateDiscount(cartValue, discountCode, userTier = 'standard') {
  const discounts = {
    'SUMMER20': 0.20,
    'VIP50': 0.50,
    'NEWUSER': 0.10
  };
  
  const discount = discounts[discountCode];
  if (!discount) return cartValue;
  
  // BUG: Aplicar descuento basado en tier
  if (userTier === 'premium') {
    return cartValue * (1 - discount * 1.5);  // 50% más descuento
  }
  
  return cartValue * (1 - discount);
}
```

### Error reportado
```
Usuario premium con "SUMMER20" debería pagar: $80 (100 - 20% = 80)
Está pagando: $70 (100 - 30% = 70) ← WRONG!
```

### Tareas

#### Parte 1: Usar Claude Code para diagnosticar (15 min)

```
Prompt para Claude:

CONTEXTO:
Node.js, Jest para testing

CÓDIGO PROBLEMÁTICO:
[Pega función arriba]

ERROR REPORTADO:
Premium user con code "SUMMER20" en carrito $100
Esperado: $80 (20% descuento)
Actual: $70 (30% descuento)

TAREA:
1. Analiza: ¿Cuál es el bug?
2. Explica: ¿Por qué ocurre?
3. Propón: Fix código
4. Proporciona: Tests para validar

ENTREGA:
- Root cause (2-3 frases)
- Código fixed
- Test suite (3+ casos)
```

**Respuesta esperada:**
- Bug: Premium tier multiplica discount por 1.5 (20% × 1.5 = 30%)
- Fix: Debería aplicarse flat 20% sin multiplicación
- Tests: standard/premium/edge cases

#### Parte 2: Implementar y validar (30 min)

```bash
# 1. Clone starter repo
git clone https://github.com/curso-claude-code/lab1-debugging.git
cd lab1-debugging

# 2. Crea rama de fix
git checkout -b fix/discount-calculation

# 3. Edita src/utils/calculateDiscount.js
# (Copia código fixed de Claude)

# 4. Corre tests
npm test -- calculateDiscount.test.js

# 5. Verifica que pasen
# PASS  src/utils/__tests__/calculateDiscount.test.js

# 6. Git commit
git commit -m "fix: correct premium tier discount calculation"

# 7. Push y crea PR (simulado)
git push origin fix/discount-calculation
```

### Rubric: Lab 1

| Criterio | Excelente | Bueno | Aceptable | Necesita mejora |
|----------|-----------|-------|-----------|---|
| **Diagnóstico** | Identificó causa exacta | Explicación clara | Parcial | No determinó |
| **Code Quality** | Código limpio, legible | Funciona bien | Funciona con warnings | Bugs |
| **Tests** | 5+ casos, 100% coverage | 4+ casos, 90% coverage | 3 casos, 80% | <3 casos |
| **Communication** | Explicación clara paso-a-paso | Explicación buena | Algo confuso | Poco claro |

---

## Lab 2: MCP Server Custom (45 min)

### Objetivo
Crear un MCP server simple que Claude Code puede usar.

### Escenario

Necesitas un tool que **normaliza URLs** (remove params, lowercase, etc).

Qué hace:
```
Input: "https://MyDomain.COM/Page?utm_source=x&ref=y"
Output: "https://mydomain.com/page"
```

### Tareas

#### Parte 1: Diseñar interface MCP (10 min)

Crea archivo `mcp-schema.json`:

```json
{
  "name": "url-normalizer",
  "description": "Normalize URLs by removing tracking params, lowercasing domain",
  "tools": [
    {
      "name": "normalize_url",
      "description": "Takes URL and returns normalized version",
      "inputSchema": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "description": "URL to normalize"
          },
          "remove_params": {
            "type": "array",
            "items": { "type": "string" },
            "description": "URL params to remove (default: utm_*, ref, etc)",
            "default": ["utm_source", "utm_medium", "utm_campaign", "ref", "tracking"]
          }
        },
        "required": ["url"]
      }
    }
  ]
}
```

#### Parte 2: Pedir a Claude que cree el server (20 min)

```
Prompt para Claude:

OBJETIVO:
Crear MCP server Node.js que normaliza URLs

MCP SCHEMA:
[Pega mcp-schema.json]

REQUISITOS:
1. Implementar tool "normalize_url"
2. Remover params de tracking
3. Lowercase domain
4. Validar URL válida
5. Retornar error si input inválido

FRAMEWORK:
- Node.js
- Usar @anthropic-ai/mcp-sdk
- Archivo: mcp-url-normalizer.js

ENTREGA:
- Código completo, listo para ejecutar
- Instrucciones setup + test
```

#### Parte 3: Integrar y testear (15 min)

```bash
# 1. Copia código de Claude a mcp-url-normalizer.js

# 2. Instala dependencias
npm install @anthropic-ai/mcp-sdk

# 3. Registra en claude.json
cat >> ~/.claude/claude.json <<EOF
{
  "mcp_servers": [
    {
      "name": "url-normalizer",
      "command": "node",
      "args": ["/path/to/mcp-url-normalizer.js"]
    }
  ]
}
EOF

# 4. Testea con Claude
claude-code test --mcp url-normalizer

# 5. Prueba funcionalidad
# Input: https://Example.COM/page?utm_source=fb&utm_medium=post
# Expected: https://example.com/page
```

### Rubric: Lab 2

| Criterio | Excelente | Bueno | Aceptable | Necesita mejora |
|----------|-----------|-------|-----------|---|
| **Design** | Schema claro, completo | Bien pensado | Funcional | Incompleto |
| **Implementation** | Robusto, edge cases manejados | Funciona bien | Funciona | Bugs |
| **Error Handling** | Validaciones completas | Good coverage | Básico | Falta |
| **Testing** | >5 casos probados | 4+ casos | 3 casos | <3 casos |

---

## Lab 3: Skill con CI Pipeline (45 min)

### Objetivo
Crear una Skill y configurar CI/CD que automáticamente testea/deploye.

### Escenario

Quieres una Skill `/cleanup-logs` que:
- Lee archivos de log
- Filtra líneas ERROR/WARN
- Guarda en archivo separado
- Genera reporte

### Tareas

#### Parte 1: Crear Skill (15 min)

Crea `SKILL.md`:

```markdown
# /cleanup-logs

Clean and filter log files, separating errors from normal logs.

## Usage
```
/cleanup-logs <path_to_logfile> [filter_level]

path_to_logfile: ./app.log, ./debug.log
filter_level: ERROR, WARN (default: ERROR)
```

## Example
```
$ /cleanup-logs ./app.log ERROR

Processing ./app.log...
Found 23 errors
Saved to: ./app.error.log
Report: 23 errors, 145 warnings, 1200 info
```

## Implementation
[Claude genera esto]
```

#### Parte 2: Configurar CI pipeline (20 min)

Crea `.github/workflows/skill-test.yml`:

```yaml
name: Test Skill

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Run Skill tests
        run: |
          npm test -- SKILL.test.js
          
      - name: Validate Skill syntax
        run: |
          node -e "const s = require('./SKILL.js'); console.log('✓ Skill valid')"
      
      - name: Coverage report
        run: npm test -- --coverage
```

#### Parte 3: Crear tests (10 min)

Crea `SKILL.test.js`:

```javascript
describe('/cleanup-logs Skill', () => {
  test('filtra errores correctamente', () => {
    const result = cleanupLogs('./test.log', 'ERROR');
    expect(result.errors).toBe(3);
    expect(result.output_file).toBe('./test.error.log');
  });
  
  test('maneja nivel WARN', () => {
    const result = cleanupLogs('./test.log', 'WARN');
    expect(result.warnings).toBe(5);
  });
  
  test('falla si archivo no existe', () => {
    expect(() => {
      cleanupLogs('./nonexistent.log');
    }).toThrow('File not found');
  });
});
```

### Rubric: Lab 3

| Criterio | Excelente | Bueno | Aceptable | Necesita mejora |
|----------|-----------|-------|-----------|---|
| **Skill Design** | Clara, útil, documentada | Bien definida | Funcional | Ambigua |
| **CI/CD** | Múltiples jobs, completo | Básico pero funcional | 1 job | Incompleto |
| **Testing** | >8 cases, 90% coverage | 5+ cases, 80% | 3+ cases | <3 cases |
| **Documentation** | Excelente, ejemplos | Buena | Básica | Minimal |

---

## Lab 4: GitHub Action + Workflow (45 min)

### Objetivo
Crear una GitHub Action que automáticamente revisa PRs con Claude Code.

### Escenario

Workflow:
1. PR abierto
2. GitHub Action ejecuta
3. Claude Code revisa código
4. Post comentario en PR
5. Auto-aprueba si no hay issues críticos

### Tareas

#### Parte 1: Solicitar a Claude que cree Action (15 min)

```
Prompt:

OBJETIVO:
Crear GitHub Action que revisa PRs con Claude Code

FLUJO:
1. Trigger: pull_request (on: [opened, synchronize])
2. Obtener archivos changed en PR
3. Pasar a Claude Code para review
4. Esperar respuesta (análisis)
5. Postear comentario en PR con findings

REQUISITOS:
- Node.js action (no Docker)
- Usar GITHUB_TOKEN para API
- Usar Anthropic SDK para Claude
- Formato: Markdown table con issues
- Auto-approve si 0 issues críticos

ENTREGA:
- action.yml (metadata)
- index.js (implementation)
- README.md (instrucciones)
```

#### Parte 2: Configurar workflow (15 min)

Crea `.github/workflows/claude-code-review.yml`:

```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    
    permissions:
      pull-requests: write
      contents: read
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Claude Code Review
        uses: ./  # Use local action
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          review_level: comprehensive  # quick, standard, comprehensive
```

#### Parte 3: Testeao (15 min)

```bash
# 1. Setup local
npm install -g act  # GitHub Actions local runner

# 2. Test action locally
act pull_request -e payload.json

# 3. Verify outputs
# ✓ Comentario posted en PR
# ✓ Issues encontrados (5)
# ✓ Recomendaciones listadas
```

### Rubric: Lab 4

| Criterio | Excelente | Bueno | Aceptable | Necesita mejora |
|----------|-----------|-------|-----------|---|
| **Action Design** | Robusto, flexible | Bien pensado | Funcional | Simple |
| **Workflow** | Múltiple triggers, conditions | 2+ triggers | 1 trigger | Básico |
| **Integration** | GH API + Claude + logging | 2/3 integrado | 1 integrado | Incomplete |
| **Testing** | Local + staged + production | Local + staged | Local | Manual |

---

## Rubric General (Todos los Labs)

### Escala:
- **4 (Exceeds):** Excelente, supera expectativas
- **3 (Meets):** Cumple requisitos completamente  
- **2 (Approaching):** Cumple parcialmente
- **1 (Below):** Incompleto, no funciona

### Final Score:
```
Lab 1-4: Sum of rubric scores / 4 = Final Lab Grade

If ≥ 3.0 → Passed
If < 3.0 → Retake
```

---

## Tips para Éxito

### Tip 1: Divide el trabajo

No intentes todo de una. En cada lab:
1. Lee el objetivo
2. Entende el escenario
3. **Parte por parte**, no todo junto

### Tip 2: Usa Claude Code para acelerar

```
ALLOWED:
✓ Usar Claude Code para generar código
✓ Pedir explicaciones
✓ Pedir refactoring

NOT ALLOWED:
✗ 100% copy-paste (sin entender)
✗ Multiple labs simultáneamente
✗ Skip testing

GOAL: Learn by doing, not copy-pasting
```

### Tip 3: Debugging your Claude Code output

Si generado código no funciona:

```
1. Lee error completamente
2. Proporciona error a Claude:
   "Error: [message]. Código: [tu código]"
3. Pedir que arregle
4. Never ignore warnings
```

### Tip 4: Documentación

```
Cada lab requiere documentación:
✓ README.md explicando qué hace
✓ Ejemplos de uso (entrada → salida)
✓ Setup instructions
✓ Known limitations
```

---

## Siguiente Paso

Después de completar 4 labs:

1. **Showcase:** Crea repo con todos 4 labs
2. **Share:** Link en LinkedIn/GitHub ("Built with Claude Code")
3. **Apply:** Puedes usar estas skills en trabajo real
4. **Advanced:** Considera crear tu propio MCP/Skill

---

## Recursos

- Starter repos: https://github.com/curso-claude-code/labs
- Solutions (reference): https://github.com/curso-claude-code/labs/solutions
- Community: #claude-code-labs en Slack
- Help: Tag @claude-code-champion en issues

---

## Resumen

**4 labs progresivos:**
1. **Lab 1:** Debugging (skill básica)
2. **Lab 2:** MCP server (understand extensions)
3. **Lab 3:** Skill con CI (automation)
4. **Lab 4:** GitHub Action (mastery)

**Estado:** Laboratorios completados = Certificación de Nivel 6 (opcional)

---

## Referencia rápida

```
LAB TIMELINE:
Lab 1 (45 min): Debugging fix
Lab 2 (45 min): Custom MCP
Lab 3 (45 min): Skill + CI
Lab 4 (45 min): GitHub Action

TOTAL: 3 horas (self-paced)

RUBRIC:
≥3.0/4.0 = Passed
<3.0/4.0 = Retake

REWARD:
Completion badge + certificate + portfolio piece
```

**Estado:** Labs completados = Master level en Claude Code!
