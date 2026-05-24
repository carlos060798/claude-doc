# Referencia rápida de clases CSS — Module Styles

Guía de bolsillo con todas las clases CSS disponibles.

## Contenedores principales

### `.module-section`
Contenedor estándar para una sección de módulo.
```html
<div class="module-section">
    <h2 class="module-title">Título</h2>
    <p>Contenido...</p>
</div>
```
- Fondo gris oscuro
- Bordes y sombra sutil
- Padding: 32px (--sp-8)
- Animación: fade-in

### `.module-section.with-sidebar`
Contenedor que se divide en dos columnas: contenido principal + sidebar.
```html
<div class="module-section with-sidebar">
    <div class="module-section__content">Principal</div>
    <div class="module-section__sidebar">Sidebar</div>
</div>
```
- Desktop: 2 columnas
- Tablet/Mobile: 1 columna

---

## Tipografía

### Títulos

| Clase | Uso | Tamaño | Notas |
|-------|-----|--------|-------|
| `.module-title` | Títulos h2 | 24px | Barra naranja a la izquierda |
| `.section-subtitle` | Subtítulos h3 | 18px | Línea separadora arriba |
| `h4` | Encabezados menores | 16px bold | Estilo por defecto |
| `h5` | Mini encabezados | 14px bold | Uppercase, letter-spacing |

### Párrafos

| Clase | Uso | Tamaño | Línea |
|-------|-----|--------|-------|
| `.module-paragraph` | Párrafo normal | 16px | 1.7 |
| `.module-paragraph.lead` | Párrafo destacado | 18px | 1.8 |
| `.module-paragraph.small` | Párrafo pequeño | 14px | 1.6 |

### Énfasis

```html
<strong>Texto destacado</strong>  <!-- Font-weight: 600, color naranja -->
<em>Texto cursivo</em>            <!-- Font-style: italic, color secondary -->
<code>Código inline</code>         <!-- Fondo gris, color azul, monoespaciado -->
```

---

## Cajas destacadas

Todas tienen borde izquierdo (4px) + fondo tintado + icono automático.

| Clase | Icono | Color | Uso |
|-------|-------|-------|-----|
| `.note-box` | 📌 | Azul (#5eb8ff) | Información contextual |
| `.example-box` | 💡 | Azul claro | Casos prácticos |
| `.warning-box` | ⚠️ | Ámbar (#ffb454) | Advertencias y riesgos |
| `.tip-box` | ✨ | Naranja (#ff7a59) | Consejos y optimizaciones |
| `.info-box` | ℹ️ | Púrpura (#d084fc) | Información complementaria |

```html
<div class="note-box">
    <p>Tu contenido aquí.</p>
</div>
```

---

## Listas

### Listas regulares
```html
<ul>                        <!-- Viñetas naranja -->
    <li>Elemento</li>
</ul>

<ol>                        <!-- Números azules -->
    <li>Elemento</li>
</ol>
```

### `.list-with-icons`
Viñetas con flecha naranja (`→`).
```html
<ul class="list-with-icons">
    <li>Elemento con flecha</li>
</ul>
```

### `.feature-list`
Grid de características con checkmark automático.
```html
<ul class="feature-list">
    <li><strong>Título</strong><br>Descripción breve</li>
    <li><strong>Título</strong><br>Descripción breve</li>
</ul>
```
- Desktop: 3 columnas
- Tablet: 2 columnas
- Mobile: 1 columna

### `.steps-list`
Lista numerada con círculos naranjas y líneas conectoras.
```html
<ol class="steps-list">
    <li><strong>Paso 1:</strong> Descripción</li>
    <li><strong>Paso 2:</strong> Descripción</li>
    <li><strong>Paso 3:</strong> Descripción</li>
</ol>
```

### `.list-unstyled`
Lista sin estilos (sin viñetas).
```html
<ul class="list-unstyled">
    <li>Elemento sin viñeta</li>
</ul>
```

---

## Tablas

### `.data-table`
Tabla estándar con encabezados, bordes y alternancia de filas.
```html
<table class="data-table">
    <thead>
        <tr><th>Columna 1</th><th>Columna 2</th></tr>
    </thead>
    <tbody>
        <tr><td>Dato</td><td>Dato</td></tr>
    </tbody>
</table>
```

### `.comparison-matrix`
Alias de `.data-table` para comparaciones (mismos estilos).

### Clases de celdas

| Clase | Efecto |
|-------|--------|
| `.highlight` | Fondo azul claro + borde izquierdo |
| `.success` | Texto verde |
| `.warning` | Texto ámbar |
| `.danger` | Texto rojo |

### Badges en tablas
```html
<td><span class="table-badge primary">Info</span></td>
<td><span class="table-badge success">OK</span></td>
<td><span class="table-badge warning">Advertencia</span></td>
<td><span class="table-badge danger">Error</span></td>
```

### `.table-wrapper`
Envuelve tablas grandes para scroll horizontal en mobile.
```html
<div class="table-wrapper">
    <table class="data-table">...</table>
</div>
```

---

## Grillas

### `.grid-2`
2 columnas (responsive).
```html
<div class="grid-2">
    <div class="grid-item">1</div>
    <div class="grid-item">2</div>
</div>
```

### `.grid-3`
3 columnas → 2 en tablet → 1 en mobile.
```html
<div class="grid-3">
    <div class="grid-item">1</div>
    <div class="grid-item">2</div>
    <div class="grid-item">3</div>
</div>
```

### `.grid-auto`
Acomodo automático (mínimo 250px por elemento).
```html
<div class="grid-auto">
    <div class="grid-item">Auto</div>
    <!-- Se acomoda según pantalla -->
</div>
```

### `.grid-item`
Elemento dentro de grilla (borde, fondo, efecto hover).

---

## Elementos expandibles

### `.collapsible-section`
Contenedor expandible con `<details>`.
```html
<details class="collapsible-section">
    <summary>Haz clic para expandir</summary>
    <div class="collapsible-section-content">
        Contenido que se muestra al abrir
    </div>
</details>
```
- Triángulo rotativo (▶ ↓)
- Animación suave al abrir

---

## Badges

### `.badge`
Etiqueta inline pequeña.
```html
<span class="badge">Neutral</span>
<span class="badge primary">Info</span>
<span class="badge success">Éxito</span>
<span class="badge warning">Advertencia</span>
<span class="badge danger">Error</span>
<span class="badge accent">Destacado</span>
```

---

## Bloques de código

### `.code-block` (ya en styles.css)
Bloque de código con encabezado y lenguaje.
```html
<div class="code-block" data-lang="bash" data-title="Instalación">
    <pre><code>npm install -g claude-code</code></pre>
</div>
```

### Inline code (dentro de `.module-section`)
```html
<p>Usa el comando <code>claude-code login</code> para autenticarte.</p>
```

---

## Espaciado (variables CSS)

Usa estas variables para consistencia:

| Variable | Valor | Uso |
|----------|-------|-----|
| `--sp-1` | 0.25rem (4px) | Espacios muy pequeños |
| `--sp-2` | 0.5rem (8px) | Espacios pequeños |
| `--sp-3` | 0.75rem (12px) | Spacing compacto |
| `--sp-4` | 1rem (16px) | Base estándar |
| `--sp-5` | 1.25rem (20px) | Espacios generosos |
| `--sp-6` | 1.5rem (24px) | Padding/margin estándar |
| `--sp-8` | 2rem (32px) | Espacios grandes |
| `--sp-10` | 2.5rem (40px) | Spacing generoso |
| `--sp-12` | 3rem (48px) | Espacios muy grandes |

```css
.mi-elemento {
    padding: var(--sp-6);      /* 24px */
    margin: var(--sp-4) 0;     /* 16px top/bottom */
}
```

---

## Colores (variables CSS)

### Fondos
- `--bg-base` — Negro casi puro (#0d0d0d)
- `--bg-surface` — Gris oscuro (#1a1a1a)
- `--bg-elevated` — Gris más claro (#262626)
- `--bg-overlay` — Gris con tinte azul (#1c2433)

### Texto
- `--text-primary` — Blanco quebrado (#e6edf3)
- `--text-secondary` — Gris claro (#9aa7b8)
- `--text-muted` — Gris medio (#7a8a9e)

### Semánticos
- `--primary` — Azul (#5eb8ff)
- `--accent` — Naranja Claude (#ff7a59)
- `--success` — Verde (#3ddc97)
- `--warning` — Ámbar (#ffb454)
- `--danger` — Rojo (#ff6b6b)

### Especiales
- `--accent-cyan` — Azul claro (#5eb8ff)
- `--accent-magenta` — Púrpura (#d084fc)
- `--accent-orange` — Naranja (#ff7a59)

---

## Animaciones

Automáticas en:
- `.module-section` — `fadeIn 0.4s`
- `.note-box`, `.example-box`, etc. — `slideInLeft 0.3s`
- `.grid-item:hover` — `transform translateY(-2px)`
- `.collapsible-section[open] .collapsible-section-content` — `slideInLeft 0.25s`

Para crear tus propias:
```css
.mi-elemento {
    animation: fadeIn 0.4s ease-out;
    /* O: slideInLeft, slideInRight, scaleIn */
}
```

---

## Responsive

### Breakpoints

```css
/* Desktop (por defecto) */
.grid-2 { grid-template-columns: repeat(2, 1fr); }

/* Tablet y mobile */
@media (max-width: 768px) {
    .grid-2 { grid-template-columns: 1fr; }
}

/* Mobile pequeño */
@media (max-width: 375px) {
    .module-section { padding: 16px; }
    .module-title { font-size: 18px; }
}
```

### Clases responsive
- `.module-section.with-sidebar` — 2 col en desktop, 1 en mobile
- `.grid-2`, `.grid-3`, `.grid-auto` — Se adaptan automáticamente
- `.feature-list` — 3 col → 2 → 1
- Todas las tablas scroll horizontal en mobile

---

## Accesibilidad

### Automático
- Contraste WCAG AA en todos los colores
- `prefers-reduced-motion: reduce` respetado (sin animaciones)
- `prefers-contrast: more` aumenta bordes y subrayados

### Recomendaciones
- Usa `<strong>` en lugar de `<b>` para énfasis semántico
- Usa `<em>` en lugar de `<i>` para cursiva semántica
- En tablas, siempre usa `<thead>` y `<th>` para encabezados
- Usa `<details>` + `<summary>` para elementos expandibles (no divs)
- Ordena los h2, h3, h4 secuencialmente (no saltes niveles)

---

## Ejemplos rápidos

### Sección con nota
```html
<div class="module-section">
    <h2 class="module-title">Título</h2>
    <p>Párrafo introductorio</p>
    <div class="note-box">
        <p>Información importante</p>
    </div>
    <ol class="steps-list">
        <li><strong>Paso 1:</strong> Instrucción</li>
    </ol>
</div>
```

### Comparación con tabla
```html
<div class="module-section">
    <h2 class="module-title">Comparación</h2>
    <table class="comparison-matrix">
        <thead>
            <tr>
                <th>Opción A</th>
                <th>Opción B</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="success">Ventaja</td>
                <td class="warning">Limitación</td>
            </tr>
        </tbody>
    </table>
</div>
```

### Grid de características
```html
<div class="module-section">
    <h2 class="module-title">Características</h2>
    <ul class="feature-list">
        <li><strong>Rápido</strong><br>Procesa instantáneamente</li>
        <li><strong>Seguro</strong><br>Encriptación de extremo a extremo</li>
        <li><strong>Flexible</strong><br>Personalizable completamente</li>
    </ul>
</div>
```

---

## Cheat Sheet visual

```
┌─────────────────────────────────────────┐
│        .module-section                  │
├─────────────────────────────────────────┤
│ <h2 class="module-title">               │
│    Barra naranja a la izquierda         │
│                                         │
│ <h3 class="section-subtitle">           │
│    Línea separadora arriba              │
│                                         │
│ <p class="module-paragraph">            │
│    Altura de línea 1.7 para lectura     │
│                                         │
│ <div class="note-box">                  │
│   📌 Icono automático + color           │
│ </div>                                  │
│                                         │
│ <ol class="steps-list">                 │
│   1️⃣ 2️⃣ 3️⃣ Números en círculos       │
│ </ol>                                   │
│                                         │
│ <table class="data-table">              │
│   Bordes, encabezados, alternancia      │
│ </table>                                │
│                                         │
│ <div class="grid-3">                    │
│   🔲 🔲 🔲 (1 col en mobile)           │
│ </div>                                  │
│                                         │
│ <details class="collapsible">           │
│   ▶ Click para expandir ↓              │
│ </details>                              │
└─────────────────────────────────────────┘
```

---

## Guías de consulta

- **Documentación completa:** `MODULE_STYLES_GUIDE.md`
- **Ejemplos visuales:** `MODULE_STYLES_EXAMPLES.html`
- **Integración paso a paso:** `INTEGRATION_CHECKLIST.md`
- **Esto (referencia rápida):** `CSS_CLASSES_REFERENCE.md`

---

**Última actualización:** Mayo 2026  
**Versión:** 1.0  
**Compatibilidad:** Todos los navegadores modernos (CSS3 + Variables CSS)
