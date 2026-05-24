# Guía Rápida: Integración de Contenido .md → HTML

## Flujo de Trabajo

### Paso 1: Preparar el .md
- Leer el archivo .md original (ej: `nivel5-troubleshooting.md`)
- Identificar estructura:
  - Títulos (h2, h3, h4)
  - Párrafos y listas
  - Bloques de código
  - Tablas
  - Cajas destacadas

### Paso 2: Crear sección HTML base
```html
<section class="content-section" data-section="NOMBRE_SECCION" data-mode="technical">
    <div class="section-header">
        <span class="breadcrumb">Nivel X / Nombre</span>
        <h2>EMOJI Título</h2>
        <p class="section-lead">Descripción breve</p>
    </div>
    <!-- contenido aquí -->
</section>
```

### Paso 3: Mapear elementos .md → HTML

| .md | HTML |
|-----|------|
| `# Título` | NO USAR (solo en `<h2 class="section-header">`) |
| `## Subtítulo` | `<h3 class="block-title">EMOJI Subtítulo</h3>` |
| `### Subsubtítulo` | `<h4>Subsubtítulo</h4>` |
| Párrafo | `<p>Contenido</p>` |
| `- Ítem` | `<ul class="bullet-list"><li>Ítem</li></ul>` |
| `1. Paso` | `<ol class="step-list"><li>Paso</li></ol>` |
| ` ```bash ` | `<div class="code-block" data-lang="bash"><pre><code>...` |
| Nota/Tip | `<div class="highlight-box">💡 ...</div>` |
| Warning | `<div class="warning">⚠️ ...</div>` |
| Info | `<div class="notas-css">ℹ️ ...</div>` |
| Tabla | `<table><thead><tr><th>..` |
| 3 opciones | `<div class="grid-3col"><div>...</div>...` |
| 2 columnas | `<div class="grid-2col"><div>...</div>...` |

### Paso 4: Validar estructura

```bash
# Checklist antes de guardar:
[ ] data-section coincide con sidebar nav
[ ] Cada h3 tiene class="block-title"
[ ] Cada div.code-block tiene data-lang y data-title
[ ] Tablas tienen <thead> y <tbody>
[ ] Cajas destacadas usan clases correctas
[ ] Grids usan grid-3col o grid-2col
[ ] Sin <code> sueltos (envueltos en <pre>)
[ ] Emojis presentes en h2, h3, cajas destacadas
```

### Paso 5: Integrar en index.html

1. Copiar sección HTML completa
2. Buscar línea aproximada donde debería ir (después de secciones del mismo nivel)
3. Pegar antes de `</main>`
4. Guardar
5. Abrir en navegador, verificar que funciona

### Paso 6: Verificar navegación

```javascript
// En consola de navegador (F12):
// Debe encontrar el elemento:
document.querySelector('[data-section="nivel-5-troubleshooting"]')
// Debe devolver el <section>, no null
```

---

## Template Rápido: Copiar y Pegar

### Sección vacía (copiar y rellenar)
```html
<section class="content-section" data-section="NIVEL-MODULO" data-mode="technical">
    <div class="section-header">
        <span class="breadcrumb">Nivel X / Nombre</span>
        <h2>EMOJI Título Principal</h2>
        <p class="section-lead">Descripción intro (1-2 líneas)</p>
    </div>

    <h3 class="block-title">EMOJI Primer Bloque</h3>
    <p>Párrafo introductorio...</p>
    <ul class="bullet-list">
        <li>Punto 1</li>
        <li>Punto 2</li>
    </ul>

    <h3 class="block-title">EMOJI Segundo Bloque</h3>
    <!-- Contenido... -->

</section>
```

### Sección con todas las características
```html
<section class="content-section" data-section="NIVEL-MODULO" data-mode="technical">
    <div class="section-header">
        <span class="breadcrumb">Nivel X / Nombre</span>
        <h2>EMOJI Título</h2>
        <p class="section-lead">Intro...</p>
    </div>

    <!-- Bloque 1: Intro + lista -->
    <h3 class="block-title">EMOJI Introducción</h3>
    <p>Párrafo...</p>
    <ul class="bullet-list">
        <li>Item 1</li>
        <li>Item 2</li>
    </ul>

    <!-- Bloque 2: Código -->
    <h3 class="block-title">⚡ Comando</h3>
    <div class="code-block" data-lang="bash" data-title="Terminal">
        <pre><code>$ comando aquí</code></pre>
    </div>

    <!-- Bloque 3: Pasos -->
    <h3 class="block-title">🔧 Procedimiento</h3>
    <ol class="step-list">
        <li><strong>Paso 1:</strong> Descripción</li>
        <li><strong>Paso 2:</strong> Descripción</li>
    </ol>

    <!-- Bloque 4: Cajas destacadas -->
    <div class="highlight-box">💡 <strong>Tip:</strong> Consejo aquí</div>
    <div class="warning">⚠️ <strong>Cuidado:</strong> Aviso aquí</div>
    <div class="notas-css">ℹ️ <strong>Info:</strong> Información aquí</div>

    <!-- Bloque 5: Matriz 3 columnas -->
    <h3 class="block-title">📊 Matriz de Decisión</h3>
    <div class="grid-3col">
        <div>
            <h4>Opción A</h4>
            <p>Descripción...</p>
        </div>
        <div>
            <h4>Opción B</h4>
            <p>Descripción...</p>
        </div>
        <div>
            <h4>Opción C</h4>
            <p>Descripción...</p>
        </div>
    </div>

    <!-- Bloque 6: Tabla -->
    <h3 class="block-title">📋 Tabla Comparativa</h3>
    <table>
        <thead>
            <tr>
                <th>Columna 1</th>
                <th>Columna 2</th>
                <th>Columna 3</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Valor A</td>
                <td>Valor B</td>
                <td>Valor C</td>
            </tr>
        </tbody>
    </table>

</section>
```

---

## Atajo: Buscar y Reemplazar (en VS Code)

### Para convertir listas .md a HTML:

```
Buscar:    ^- (.+)$
Reemplazar: <li>$1</li>
Usar Regex: ON
```

Luego envolver en `<ul class="bullet-list">...</ul>`

### Para convertir pasos numerados:

```
Buscar:    ^\d\. (.+)$
Reemplazar: <li>$1</li>
```

Luego envolver en `<ol class="step-list">...</ol>`

---

## Emojis Recomendados por Tipo

### Títulos principales (h2)
- 🔧 Troubleshooting, configuración
- 💰 Costos, presupuesto
- 🤖 Agentes, automatización
- 📚 Educación, cursos
- 🏗️ Arquitectura, diseño
- 🔗 Integración, MCP
- ⚡ Performance, optimización

### Subtítulos (h3)
- 🎯 Objetivo, propósito
- ⚡ Comando, herramienta
- 📊 Matriz, comparativa
- 📋 Tabla, referencia
- 🔍 Investigación, diagnóstico
- 🚀 Procedimiento, pasos
- 📦 Caso, ejemplo
- 💡 Tip, consejo
- ⚠️ Aviso, cuidado (en divs, no h3)

### Cajas destacadas
- 💡 Pro Tip, insight
- ⚠️ Warning, cuidado
- ✅ Success, completado
- ℹ️ Información, nota
- 🔴 Error, problema
- 📌 Importante, destacado

---

## Validación HTML (Herramientas)

### Online
- [validator.w3.org](https://validator.w3.org/) — Pega HTML, valida sintaxis
- [html5.validator.nu](https://html5.validator.nu/) — Validador moderno

### Terminal
```bash
# Si tienes node instalado:
npm install -g htmlhint
htmlhint index.html

# O con Python:
pip install html5validator
html5validator index.html
```

---

## Checklist Final Antes de Subir

- [ ] `data-section` en sidebar nav coincide con `data-section` en `<section>`
- [ ] `data-mode="technical"` (o "accessible"/"both")
- [ ] `class="section-header"` con breadcrumb, h2, section-lead
- [ ] Todos los h3 principales tienen `class="block-title"`
- [ ] Cada `<code>` dentro de párrafos está dentro de `<pre>` o es inline
- [ ] `<pre><code>` está dentro de `<div class="code-block" data-lang="..." data-title="...">`
- [ ] Tablas tienen `<thead>` con `<th>` y `<tbody>` con `<td>`
- [ ] Listas tienen `class="bullet-list"` (ul) o `class="step-list"` (ol)
- [ ] Cajas usan: `.highlight-box`, `.warning`, `.notas-css`
- [ ] Grids usan: `.grid-3col` o `.grid-2col`
- [ ] NO hay `<style>` embebido (todo en styles.css)
- [ ] NO hay `<script>` embebido (todo en script.js)
- [ ] Validación HTML: sin errores críticos
- [ ] Navegador: la sección se muestra al clickear en sidebar
- [ ] Responsive: funciona en móvil (768px)

---

## Troubleshooting Común

### "No aparece la sección en el sidebar"
**Causa:** `data-section` en sidebar nav NO coincide con `data-section` en `<section>`
**Solución:** Busca en index.html el `<a data-section="...">` y copia ese nombre exacto

### "La sección aparece pero está vacía"
**Causa:** JavaScript no puede encontrar el contenido
**Solución:** Verifica que `<section data-section="...">` esté dentro de `<main class="main-content">`

### "Los estilos se ven mal"
**Causa:** Falta clase CSS o está mal escrita
**Solución:** Revisa que coincida exactamente: `class="block-title"` (no `block_title`, no `blocktitle`)

### "Las tablas se ven feas en móvil"
**Causa:** Normal. Las tablas no responden bien en pantallas < 600px
**Solución:** En móvil, convertir tabla a cards o usar `overflow-x: auto`

### "Los emojis no se ven"
**Causa:** Fuente no soporta emojis (raro)
**Solución:** En styles.css, verifica que `body { font-family: ...}` incluya system-ui o sans-serif

---

## Velocidad: Tiempo estimado por sección

| Complejidad | Contenido | Tiempo |
|-------------|-----------|--------|
| Simple | h3 + paragr + lista | 15 min |
| Medio | + código + cajas | 30 min |
| Complejo | + tabla + matriz + múltiples bloques | 45-60 min |
| Muy complejo | 10+ bloques + 3+ tablas | 90-120 min |

**Promedio:** 40 minutos por sección de 2,000 palabras

---

## Referencias

- **Plantilla HTML completa:** `PLANTILLA_CONTENIDO_MD.html`
- **Ejemplos concretos:** `EJEMPLO_SECCIONES_CONVERTIDAS.md`
- **Estilos base:** `styles.css` (líneas 700-950)
- **Sidebar nav:** `index.html` (líneas 48-230)
