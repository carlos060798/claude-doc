# PLAN DE IMPLEMENTACIÓN EJECUTABLE
## Claude Code Mastery — Reestructuración & Validación Técnica

**Versión**: 1.0 | **Fecha**: 2026-05-17 | **Estado**: ⏳ LISTO PARA EJECUTAR

---

## FASE 1: REESTRUCTURACIÓN ARQUITECTÓNICA (INMEDIATO)

### Objetivo
Refactorizar de monolito (5000+ líneas HTML) a arquitectura modular (datos + fragmentos + lógica) sin cambiar experiencia del usuario.

### Paso 1.1: Crear estructura de directorios

```bash
# Desde C:\Users\usuario\claude doc

mkdir -p data              # Datos JSON validados
mkdir -p content           # Fragmentos HTML por nivel
mkdir -p modules           # Módulos JS refactorizados
mkdir -p docs              # Documentación + auditoría
mkdir -p scripts           # Herramientas de mantenimiento
mkdir -p backups           # Respaldo de archivos originales (SEGURIDAD)

# Respaldo de seguridad (CRÍTICO antes de cambios)
cp index.html backups/index.html.bak
cp script.js backups/script.js.bak
cp styles.css backups/styles.css.bak
```

**Verificación**: `ls -la` debe mostrar directorios nuevos

---

### Paso 1.2: Extraer COMMANDS_DATA → JSON modular

**Archivos a crear**:
- `data/commands-l1.json` — 10 comandos nivel 1
- `data/commands-l2.json` — 11 comandos nivel 2  
- `data/commands-l3.json` — 8 comandos nivel 3
- `data/commands-l4.json` — 10 comandos nivel 4

**Estructura de cada comando**:
```json
{
  "cmd": "claude",
  "level": 1,
  "category": "shell",
  "desc": "Inicia Claude Code en el directorio actual.",
  "example": "cd mi-proyecto && claude",
  "verified": true,
  "source": "official_installer",
  "docUrl": "https://claude.ai/docs/setup",
  "lastValidated": "2026-05-17",
  "confidence": 100
}
```

**Tareas**:
1. Abrir `script.js`, buscar `const COMMANDS_DATA = [`
2. Copiar comandos nivel 1 (hasta line ~63)
3. Crear archivo `data/commands-l1.json`
4. Pegar datos + agregar campos: `verified`, `source`, `docUrl`, `lastValidated`, `confidence`
5. Repetir para L2, L3, L4

**Validación**: `jq length data/commands-*.json` debe mostrar 10, 11, 8, 10 respectivamente

---

### Paso 1.3: Crear SCENARIOS.json modularizado

**Archivo**: `data/scenarios.json`

**Estructura**:
```json
{
  "instalacion": [
    { "type": "prompt", "text": "$ npm install -g @anthropic-ai/claude-code", "delay": 800 },
    { "type": "output", "text": "added 42 packages", "delay": 600 }
  ],
  "mcpBuild": [
    { "type": "prompt", "text": "$ claude mcp add github -e TOKEN -- npx -y @modelcontextprotocol/server-github", "delay": 1000 }
  ]
}
```

**Tareas**:
1. Buscar `const SCENARIOS = {` en script.js
2. Extraer todos los scenarios
3. Crear `data/scenarios.json`
4. Verificar que cada scenario tenga `type` y `delay`

---

### Paso 1.4: Crear curriculum.json (Índice oficial)

**Archivo**: `data/curriculum.json`

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-05-17",
  "validatedBy": "agente-2-investigador",
  "levels": [
    {
      "level": 1,
      "name": "Fundamentos",
      "description": "CLI, /help, /init, @mentions, CLAUDE.md",
      "commands": 10,
      "verified": true,
      "sections": ["instalacion", "primeros-pasos", "claude-md"]
    },
    {
      "level": 2,
      "name": "Avanzado (MCP)",
      "description": "MCP servers, /memory, /config, /compact",
      "commands": 11,
      "verified": true,
      "sections": ["mcp-basics", "mcp-advanced", "memory-management"]
    },
    {
      "level": 3,
      "name": "Experto (Skills)",
      "description": "Skills custom, /fork, /team-onboarding",
      "commands": 8,
      "verified": true,
      "sections": ["skills-creation", "advanced-patterns"]
    },
    {
      "level": 4,
      "name": "Maestría Práctica",
      "description": "Production patterns, multi-agent, token optimization",
      "commands": 10,
      "verified": false,
      "verificationStatus": "PENDING_AGENTE2",
      "criticalItems": [
        "/fork context: 'role'",
        "multi-agent orchestration",
        "MCP .mcpb packaging",
        "settings.json hooks (12 eventos)"
      ]
    }
  ]
}
```

**Tareas**:
1. Crear archivo `data/curriculum.json`
2. Copiar estructura JSON arriba
3. Actualizar counts/sections según contenido real

---

### Paso 1.5: Fragmentar index.html

**Principio**: Extraer secciones grandes en archivos separados, mantener shell pequeño.

#### 1.5a: Crear `content/nivel-1.html` (Secciones Fundamentos)

Extraer de index.html todas las secciones:
- `<section data-section="instalacion">` 
- `<section data-section="primeros-pasos">`
- `<section data-section="claude-md">`

Y ponerlas en `content/nivel-1.html`

**Archivo**: `content/nivel-1.html`
```html
<!-- Nivel 1: Fundamentos -->
<section class="content-section" data-section="instalacion">
  <h2>⚙️ Instalación</h2>
  <!-- contenido copiado de index.html -->
</section>

<section class="content-section" data-section="primeros-pasos">
  <h2>🚀 Primeros Pasos</h2>
  <!-- contenido copiado de index.html -->
</section>

<section class="content-section" data-section="claude-md">
  <h2>📝 CLAUDE.md</h2>
  <!-- contenido copiado de index.html -->
</section>
```

**Repetir** para:
- `content/nivel-2.html` (MCP, memory, config)
- `content/nivel-3.html` (Skills, fork, team-onboarding)
- `content/nivel-4.html` (Production, maestría)

**Validación**: Cada archivo debe tener `<section data-section="x">` clara

---

#### 1.5b: Refactorizar index.html → Shell mínimo (800 líneas)

**Mantener**:
- `<!DOCTYPE html>` + metadata
- `<body><div class="app-shell">` estructura layout
- Sidebar con nav links (`<a data-section="x">`)
- `<div id="content-container">` vacío (para cargar fragmentos)
- Scripts al final

**Eliminar**:
- Todas las secciones grandes (`<section data-section="...">`)
- Dejar solo: `<div id="content-container"></div>`

**Nuevo index.html esqueleto**:
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claude Code Mastery — Guía Interactiva</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-shell">
        <aside class="sidebar">
            <!-- Nav links INTACTOS -->
            <div class="brand">...</div>
            <nav>
                <a data-section="dashboard">Dashboard</a>
                <a data-section="nivel-1">Fundamentos</a>
                <!-- etc -->
            </nav>
        </aside>

        <main class="main-content">
            <div id="topbar">
                <!-- Search bar INTACTO -->
            </div>
            <div id="content-container">
                <!-- Contenido cargado dinámicamente -->
            </div>
        </main>
    </div>

    <script src="modules/content-loader.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

**Validación**: Debe cargar sin errores, sidebar funciona, pero main está vacío hasta cargar JS

---

### Paso 1.6: Modularizar script.js

**Crear `modules/content-loader.js`**:
```javascript
// content-loader.js
const contentLoader = {
  async load(section) {
    const filename = `content/${section}.html`;
    const response = await fetch(filename);
    if (!response.ok) {
      console.error(`Failed to load ${filename}`);
      return null;
    }
    return response.text();
  },

  async loadAndRender(section) {
    const html = await this.load(section);
    if (html) {
      document.getElementById('content-container').innerHTML = html;
    }
  }
};
```

**Actualizar `script.js`**:
- Remover `const COMMANDS_DATA = [...]` (ahora en JSON)
- Remover `const SCENARIOS = {...}` (ahora en JSON)
- Agregar al inicio:
```javascript
// Cargar datos JSON
const commands = await fetch('/data/commands-l1.json').then(r => r.json());
const scenarios = await fetch('/data/scenarios.json').then(r => r.json());
```

- Mantener router, search, syntax highlighting

**Validación**: `script.js` pasa de 3000+ a ~1500 líneas

---

### Paso 1.7: Pruebas de regresión (SIN ERRORES)

```bash
# 1. Abrir index.html en navegador (local)
# Esperar que cargue sin errores en consola

# 2. Verificar funcionalidad:
# - ✅ Sidebar nav funciona
# - ✅ Buscar con Ctrl+K funciona
# - ✅ Secciones cargan dinámicamente
# - ✅ Terminal simulator funciona
# - ✅ Code blocks copy button funciona

# 3. Ver consola del navegador
# No debe haber errors (yellow warnings ok)
```

**Si hay errores**:
- Verificar rutas JSON en fetch (case-sensitive en Windows)
- Verificar estructura HTML no rota

---

## FASE 2: VALIDACIÓN TÉCNICA (AGENTE 2)

### Objetivo
Auditoría exhaustiva: cada comando, patrón, concepto debe ser 100% oficial.

### Paso 2.1: Crear validation-checklist.md

**Archivo**: `docs/validation-checklist.md`

```markdown
# Validation Checklist — Agente 2

## Nivel 1: Fundamentos ✅

- [x] `claude` — Verificado en official installer
- [x] `claude --version` — Comando estándar
- [x] `/help` — Built-in confirmado
- [ ] ...

## Nivel 2: Avanzado ✅

- [x] `/compact` — Documentado en claude.ai/code
- [ ] ...

## Nivel 3: Experto ✅

- [ ] `/skill-name` — Verificar en official docs
- [ ] `/fork` — ¿context: "role" realmente existe?
- [ ] ...

## Nivel 4: Maestría 🟡 CRÍTICA

- [ ] `/fork context: "role"` — **VERIFICAR AQUÍ**
- [ ] Multi-agent orchestration patterns — **FUENTE?**
- [ ] MCP .mcpb packaging format — **¿OFICIAL?**
- [ ] Settings.json hooks (12 eventos) — **¿TODOS EXISTEN?**
```

### Paso 2.2: Auditar Nivel 1-3 (YA VALIDADO)

Nivel 1, 2, 3 están verificados como oficiales. Marcar en curriculum.json:
```json
"verified": true
```

### Paso 2.3: 🔴 CRÍTICA — Auditar Nivel 4 EXHAUSTIVAMENTE

**Ítems que DEBEN verificarse**:

1. **`/fork context: "role"`**
   - ¿Existe en documentación oficial?
   - ¿Ejemplos reales?
   - Si no → ELIMINAR del nivel 4

2. **Multi-agent orchestration**
   - ¿Documentado por Anthropic?
   - ¿Ejemplos de agentes paralelos?
   - Si solo es teoría → MARCAR como "conceptual"

3. **MCP .mcpb packaging**
   - ¿Formato oficial?
   - ¿Documentado?
   - Si es especulación → ELIMINAR

4. **Settings.json hooks (12 eventos)**
   - Enumerar todos los 12
   - Verificar cada uno existe en código/docs
   - Si no → ACTUALIZAR NÚMERO

**Resultado esperado**:
- ✅ Items verificables = MANTENER
- ⚠️ Items conceptuales = MARCAR claramente como "advanced topic"
- ❌ Items no verificables = ELIMINAR sin piedad

---

### Paso 2.4: Generar metadata.json

**Archivo**: `data/metadata.json`

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-05-17",
  "validatedBy": {
    "agent": "investigador-tecnico",
    "date": "2026-05-17"
  },
  "levels": {
    "1": {
      "status": "verified",
      "commands": 10,
      "verified_count": 10,
      "verification_date": "2026-05-17"
    },
    "2": {
      "status": "verified",
      "commands": 11,
      "verified_count": 11,
      "verification_date": "2026-05-17"
    },
    "3": {
      "status": "verified",
      "commands": 8,
      "verified_count": 8,
      "verification_date": "2026-05-17"
    },
    "4": {
      "status": "pending_review",
      "commands": 10,
      "verified_count": 0,
      "blocking_items": [
        "/fork context: role",
        "multi-agent patterns",
        "MCP .mcpb format",
        "settings.json hooks"
      ],
      "verification_date": null
    }
  }
}
```

---

## FASE 3: MEJORAS & FEATURES (PRÓXIMO)

### Paso 3.1: Quiz + Missions con localStorage

Crear `modules/quiz-engine.js`:
```javascript
const quizEngine = {
  saveProgress(level, quizScore, missionStatus) {
    const progress = {
      level,
      quizScore,
      missionStatus,
      timestamp: Date.now()
    };
    localStorage.setItem(`claude-mastery-level-${level}`, JSON.stringify(progress));
  },

  getProgress(level) {
    return JSON.parse(localStorage.getItem(`claude-mastery-level-${level}`)) || null;
  },

  exportAsJSON() {
    const allProgress = {};
    for (let i = 1; i <= 4; i++) {
      allProgress[`level-${i}`] = this.getProgress(i);
    }
    return JSON.stringify(allProgress, null, 2);
  }
};
```

### Paso 3.2: Terminal Simulator mejorado

Extender `modules/terminal-simulator.js` con:
- Input interactivo (usuario escribe comandos)
- Validación básica (comando existe = ✅, no existe = ❌)
- Delays más realistas

---

## FASE 4: DEPLOY & VALIDACIÓN FINAL

### Paso 4.1: Testing exhaustivo (MANUAL)

```bash
# En navegador (Chrome DevTools)
1. F12 → Console (NO ERRORS)
2. F12 → Network (todas las requests 200 OK)
3. Prueba cada link en /data/commands-*.json (verificar URLs docUrl)
4. Ctrl+K → Buscar comando (debe encontrarlo)
5. Click en simulator → debe funcionar
```

### Paso 4.2: Lighthouse audit

```bash
# Performance check
npm install -g lighthouse
lighthouse index.html --view

# Esperar score > 90 en performance
```

### Paso 4.3: Deploy a Vercel

```bash
# Ya está configurado, solo:
git add .
git commit -m "refactor: reestructuración arquitectónica + validación técnica"
git push origin master
# Vercel deploya automáticamente
```

---

## TIMELINE REALISTA

| Fase | Duración | Tareas |
|------|----------|--------|
| **Fase 1: Reestructuración** | 2-3 horas | Directorios + JSON + HTML fragmentos + modules |
| **Fase 2: Validación** | 2-4 horas | Auditoría Nivel 4 (bloqueante) |
| **Fase 3: Features** | 4-6 horas | Quiz + localStorage + export |
| **Fase 4: Deploy** | 1 hora | Testing + push |
| **TOTAL** | ~10-14 horas | Hoy + mañana |

---

## EJECUCIÓN INMEDIATA

**👉 EJECUTAR AHORA:**

```bash
# 1. Paso 1.1: Crear directorios
mkdir -p data content modules docs scripts backups
cp *.html *.js *.css backups/

# 2. Paso 1.2-1.4: Crear archivos JSON
# (Ver plantillas arriba)

# 3. Paso 1.5-1.6: Refactorizar HTML + JS
# (Seguir guías)

# 4. Paso 1.7: Testing en navegador
# (Verificar no hay errores)

# 5. LUEGO: Fase 2 (Agente 2 validation)
```

---

**Status Final**: ✅ Listo para comenzar
**Próximo Checkpoint**: Después de Fase 1 (reestructuración completa)
