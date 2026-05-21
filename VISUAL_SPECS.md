# Claude Code Mastery — Visual Specifications & Implementation Guide

## Resumen Ejecutivo

Se ha creado un **Design System completo** para Claude Code Mastery que proporciona:

✅ **Paleta de 30+ colores** organizados por categorías  
✅ **Sistema tipográfico escalable** (H1-H4, Body, Code)  
✅ **10+ componentes reutilizables** (buttons, cards, badges, alerts)  
✅ **Dark mode + Light mode** (ambos modos completos)  
✅ **Tokens CSS listos para producción**  
✅ **Mockups visuales y ejemplos**  

---

## Archivos Entregados

### 1. `DESIGN_SYSTEM.md` (Este archivo)
Especificación completa del sistema visual con:
- Paleta RGB/HEX con descripciones
- Escalas tipográficas
- Componentes visuales (cards, botones, badges)
- Variables CSS (tokens)
- Mockups ASCII
- Guía de implementación

### 2. `components-theme.css`
**1,100+ líneas de CSS production-ready** con:
- ✅ 10+ clases de botones (`.btn--primary`, `.btn--danger`, etc.)
- ✅ 5+ variantes de cards (`.card--level-1` a `--level-6`)
- ✅ Sistema de badges y pills (nivel, status, outline)
- ✅ Componentes de formulario (input, textarea, select)
- ✅ Alerts, tabs, spinners, código
- ✅ Responsive design automático
- ✅ States: hover, active, disabled, focus

### 3. `COMPONENTS_SHOWCASE.html`
**Demostración interactiva** de todos los componentes:
- Paleta completa de colores con previsualizaciones
- Botones en todas sus variantes
- Cards de niveles 1-6
- Badges y pills
- Alerts
- Tipografía
- **VISIBLE en el Launch panel (preview)**

---

## Paleta de Colores — Referencia Rápida

### Backgrounds (Dark Mode)
```
--bg-base:        #0d0d0d   (13, 13, 13)     ← Más oscuro
--bg-surface:     #1a1a1a   (26, 26, 26)     ← Cards estándar
--bg-elevated:    #262626   (38, 38, 38)     ← Modales, overlays
--bg-hover:       #1f2937   (31, 41, 55)     ← Estados hover
--bg-overlay:     #1c2433   (28, 36, 51)     ← Con tinte azul
```

### Acentos
```
--accent:         #ff7a59   (255, 122, 89)   ← CLAUDE ORANGE (primario)
--accent-hover:   #ff9073   (255, 144, 115)  ← Hover (más claro)
--accent-cyan:    #5eb8ff   (94, 184, 255)   ← Azul información
--accent-magenta: #d084fc   (208, 132, 252)  ← Púrpura premium
```

### Estados Semánticos
```
--success:        #3ddc97   (61, 220, 151)   ✓ Completado
--warning:        #ffb454   (255, 180, 84)   ⚠ Alerta
--danger:         #ff6b6b   (255, 107, 107)  ✕ Error
--primary:        #5eb8ff   (94, 184, 255)   ℹ Info/Links
```

### Niveles de Aprendizaje
```
Level 1: #3ddc97  (Verde)        → Fundamentos
Level 2: #5eb8ff  (Azul)         → Avanzado
Level 3: #d084fc  (Púrpura)      → Experto
Level 4: #ff7a59  (Orange)       → Ingeniero
Level 5: #ec4899  (Rosa)         → Master
Level 6: #dc2626  (Rojo)         → Elite
```

---

## Tipografía

### Stack de Fuentes
```css
--font-display: 'IBM Plex Sans', system-ui, sans-serif;
--font-sans:    'Inter', system-ui, sans-serif;
--font-mono:    'Fira Code', 'JetBrains Mono', monospace;
```

### Escala
| Elemento | Size | Weight | Line-height | Uso |
|----------|------|--------|-------------|-----|
| H1 | 32px | 700 Bold | 1.2 (38.4px) | Títulos principales |
| H2 | 24px | 600 SemiBold | 1.3 (31.2px) | Subtítulos |
| H3 | 20px | 600 SemiBold | 1.4 (28px) | Subsecciones |
| H4 | 16px | 600 SemiBold | 1.5 (24px) | Labels pequeños |
| Body | 15px | 400 Regular | 1.6 (24px) | Párrafos estándar |
| Small | 14px | 400 Regular | 1.5 (21px) | Subtítulos |
| Caption | 12px | 400 Regular | 1.4 (16.8px) | Metadata |
| Code | 14px | 400 Regular | 1.6 (22.4px) | Snippets |

---

## Componentes — Clases CSS

### Botones
```html
<!-- Primary CTA -->
<button class="btn btn--primary">Primary Action</button>

<!-- Secondary -->
<button class="btn btn--secondary">Secondary</button>

<!-- Ghost (transparent) -->
<button class="btn btn--ghost">Ghost</button>

<!-- Danger / Destructive -->
<button class="btn btn--danger">Delete</button>

<!-- Success -->
<button class="btn btn--success">Approve</button>

<!-- Tamaños -->
<button class="btn btn--primary btn--sm">Small (32px)</button>
<button class="btn btn--primary">Medium (40px)</button>
<button class="btn btn--primary btn--lg">Large (48px)</button>

<!-- Estados (automáticos) -->
<!-- hover, active, disabled (auto manejados) -->
```

### Cards
```html
<!-- Card básica -->
<div class="card">
  <div class="card__header">
    <h2 class="card__title">Título</h2>
  </div>
  <div class="card__content">Contenido...</div>
  <div class="card__footer">
    <button class="btn btn--primary">Acción</button>
  </div>
</div>

<!-- Card con nivel -->
<div class="card card--level-1">...</div>
<div class="card card--level-2">...</div>
<div class="card card--level-3">...</div>
<!-- ... hasta level-6 -->

<!-- Card con accent border -->
<div class="card card--accent">Contenido destacado</div>

<!-- Variantes -->
<div class="card card--elevated">Más elevada</div>
<div class="card card--no-shadow">Sin sombra</div>
```

### Badges
```html
<!-- Level Badges -->
<span class="badge badge--level-1">Level 1</span>
<span class="badge badge--level-2">Level 2</span>
<!-- ... hasta level-6 -->

<!-- Status Badges -->
<span class="badge badge--success">✓ Success</span>
<span class="badge badge--warning">⚠ Warning</span>
<span class="badge badge--danger">✕ Error</span>
<span class="badge badge--info">ℹ Info</span>

<!-- Outline -->
<span class="badge badge--outline">Default</span>
```

### Pills (Tags)
```html
<!-- Tag simple -->
<span class="pill">Frontend</span>
<span class="pill">Backend</span>

<!-- Removable -->
<span class="pill pill--removable">
  Tag Name
  <button class="pill__remove">✕</button>
</span>

<!-- Con nivel -->
<span class="pill pill--level-1">Tema</span>
```

### Alerts
```html
<!-- Success Alert -->
<div class="alert alert--success">
  <div class="alert__icon">✓</div>
  <div class="alert__content">
    <div class="alert__title">Success!</div>
    Mensaje de éxito
  </div>
</div>

<!-- Warning -->
<div class="alert alert--warning">...</div>

<!-- Danger -->
<div class="alert alert--danger">...</div>

<!-- Info -->
<div class="alert alert--info">...</div>
```

### Formularios
```html
<!-- Input -->
<input class="input" type="text" placeholder="Escribe...">

<!-- Textarea -->
<textarea class="textarea" placeholder="Mensaje..."></textarea>

<!-- Select -->
<select class="select">
  <option>Opción 1</option>
  <option>Opción 2</option>
</select>
```

### Otro
```html
<!-- Spinner/Loader -->
<div class="spinner"></div>
<div class="spinner spinner--sm"></div>
<div class="spinner spinner--lg"></div>

<!-- Code Block -->
<div class="code-block">
  <code>npm install -g @anthropic/cli</code>
</div>

<!-- Code Inline -->
<code class="code-inline">const x = 10;</code>

<!-- Divider -->
<hr class="divider">
<hr class="divider divider--dashed">

<!-- Tabs -->
<div class="tabs">
  <button class="tabs__item tabs__item--active">Tab 1</button>
  <button class="tabs__item">Tab 2</button>
</div>
```

---

## Light Mode — Activación

Para cambiar a light mode, añade `data-theme="light"` al HTML:

```html
<!-- Dark mode (default) -->
<html>
  <!-- Contenido -->
</html>

<!-- Light mode -->
<html data-theme="light">
  <!-- Contenido con colores claros -->
</html>
```

O dinámicamente en JavaScript:
```javascript
document.documentElement.setAttribute('data-theme', 'light');
document.documentElement.setAttribute('data-theme', 'dark');
```

### Colores Light Mode
```css
[data-theme="light"] {
  --bg-base:        #ffffff;      (blanco)
  --bg-surface:     #f5f5f5;       (muy claro)
  --bg-elevated:    #ebebeb;       (claro)
  --text-primary:   #0f0f0f;       (negro)
  --text-secondary: #5a6270;       (gris)
  /* Los acentos se mantienen iguales */
}
```

---

## Espaciado

```css
--sp-1:  4px      /* 0.25rem */
--sp-2:  8px      /* 0.5rem  */
--sp-3:  12px     /* 0.75rem */
--sp-4:  16px     /* 1rem    */
--sp-5:  20px     /* 1.25rem */
--sp-6:  24px     /* 1.5rem  */
--sp-8:  32px     /* 2rem    */
--sp-10: 40px     /* 2.5rem  */
--sp-12: 48px     /* 3rem    */
```

### Usos recomendados
- **Padding cards**: `var(--sp-6)` (24px)
- **Margin entre secciones**: `var(--sp-8)` (32px)
- **Gap entre items**: `var(--sp-4)` (16px)
- **Padding buttons**: `10px 20px` (vertical × horizontal)

---

## Border Radius

```css
--radius-sm: 4px    /* Pequeños elementos */
--radius:    8px    /* Standard (cards, buttons) */
--radius-lg: 12px   /* Grandes cards, badges */
--radius-xl: 16px   /* Modales, hero sections */
```

---

## Sombras

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3)      /* Subtle */
--shadow:    0 4px 12px rgba(0, 0, 0, 0.4)     /* Standard */
--shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.5)    /* Elevated */
--shadow-xl: 0 20px 48px rgba(0, 0, 0, 0.6)    /* Floating */
```

---

## Transiciones

```css
--transition-fast: 0.15s ease   /* Cambios rápidos */
--transition:      0.25s ease   /* Standard */
--transition-slow: 0.35s ease   /* Animaciones amplias */
```

**Ejemplo:**
```css
.element {
  transition: all var(--transition);
}

.element:hover {
  transform: translateY(-2px);
}
```

---

## Accesibilidad

### Contraste de Colores
- ✅ **Text-primary (#e6edf3) en bg-base (#0d0d0d)**: 15:1 (AAA)
- ✅ **Text-secondary (#9aa7b8) en bg-surface (#1a1a1a)**: 7:1 (AA)
- ✅ **Accent (#ff7a59) en bg-base**: 5:1 (AA)

### Focus Visible
Todos los elementos interactivos tienen outline visible:
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### Color No es el Único Indicador
- Botones usam ícono + color
- Estados requieren bordes visibles además de color
- Íconos cumplen doble propósito visual + semántico

---

## Integración en Proyecto Actual

### Paso 1: Importar CSS
```html
<!-- En index.html, después de styles.css -->
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="components-theme.css">
```

### Paso 2: Usar Clases
```html
<!-- Antes: sin clases específicas -->
<button>Action</button>

<!-- Después: con design system -->
<button class="btn btn--primary">Action</button>

<!-- Cards mejoradas -->
<div class="card card--level-2">
  <div class="card__header">
    <h2 class="card__title">Título</h2>
  </div>
  <div class="card__content">Contenido...</div>
</div>
```

### Paso 3: Extender (opcional)
```css
/* En tu CSS personalizado */
.my-custom-component {
  background: var(--bg-surface);
  padding: var(--sp-6);
  border-radius: var(--radius);
  color: var(--text-primary);
}
```

---

## Ejemplos de Implementación

### Ejemplo 1: Nueva Sección
```html
<section>
  <h2 style="font-size: 24px; font-weight: 600; margin-bottom: var(--sp-6);">
    New Section
  </h2>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--sp-6);">
    <div class="card card--level-1">
      <div class="card__header">
        <h3 class="card__title">Item 1</h3>
      </div>
      <div class="card__content">Description...</div>
      <div class="card__footer">
        <button class="btn btn--primary">Action</button>
      </div>
    </div>
  </div>
</section>
```

### Ejemplo 2: Status Indicator
```html
<div style="display: flex; align-items: center; gap: var(--sp-3);">
  <div class="spinner spinner--sm"></div>
  <span class="badge badge--warning">In Progress</span>
</div>
```

### Ejemplo 3: Form
```html
<form style="display: flex; flex-direction: column; gap: var(--sp-4); max-width: 400px;">
  <label>
    <span style="display: block; margin-bottom: var(--sp-2); color: var(--text-primary); font-weight: 500;">
      Name
    </span>
    <input class="input" type="text" placeholder="Your name...">
  </label>
  
  <label>
    <span style="display: block; margin-bottom: var(--sp-2); color: var(--text-primary); font-weight: 500;">
      Message
    </span>
    <textarea class="textarea" placeholder="Your message..."></textarea>
  </label>
  
  <button class="btn btn--primary">Submit</button>
</form>
```

---

## Archivos Asociados

| Archivo | Tamaño | Descripción |
|---------|--------|-------------|
| `DESIGN_SYSTEM.md` | ~15KB | Especificación completa (este archivo) |
| `components-theme.css` | ~35KB | CSS production-ready con 10+ componentes |
| `COMPONENTS_SHOWCASE.html` | ~20KB | Demo interactiva de todos los componentes |
| `styles.css` | ~100KB | Base CSS original (mantener) |
| `VISUAL_SPECS.md` | ~10KB | Esta guía de implementación |

---

## Checklist de Implementación

- [ ] Importar `components-theme.css` en `index.html`
- [ ] Revisar `COMPONENTS_SHOWCASE.html` en navegador (preview)
- [ ] Reemplazar clases antiguas por nuevas clases del sistema
- [ ] Actualizar cards a estructura `.card` + `.card__*`
- [ ] Aplicar badges a items de nivel
- [ ] Implementar botones con clases `.btn`
- [ ] Activar light mode (opcional) en settings
- [ ] Verificar accesibilidad (contrast, focus states)
- [ ] Test responsive (mobile, tablet, desktop)
- [ ] Performance check (CSS no añade overhead)

---

## Support & Next Steps

### Documentación
1. 📖 `DESIGN_SYSTEM.md` — Especificación visual completa
2. 🎨 `COMPONENTS_SHOWCASE.html` — Demostración interactiva
3. 📋 `VISUAL_SPECS.md` — Esta guía (implementación)
4. 💻 `components-theme.css` — Código CSS listo

### Para Preguntas
- **Colores**: Ver tabla en `DESIGN_SYSTEM.md` § 1
- **Tipografía**: Ver escala en § 2
- **Componentes**: Ver HTML en `COMPONENTS_SHOWCASE.html`
- **Clases CSS**: Ver § en `VISUAL_SPECS.md`

### Extensiones Futuras
1. Sistema de iconografía personalizada (SVG icons)
2. Animaciones avanzadas (loading states, transitions)
3. Temas adicionales (sepia, high-contrast)
4. Data visualization (charts, graphs)
5. Video embeds, PDFs, módulos interactivos

---

**Versión**: 1.0  
**Creado**: 2026-05-21  
**Status**: ✅ Production Ready

