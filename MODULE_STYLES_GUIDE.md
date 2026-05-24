# Guía de Estilos para Módulos — Integración en index.html

## Resumen

El archivo `module-styles.css` contiene CSS profesional y robusto para secciones de módulos integradas en `index.html`. Todos los estilos:

- ✅ Basados en tokens de diseño de `styles.css` (colores, espaciado, tipografía)
- ✅ Responsive (mobile 375px, tablet 768px, desktop 1280px+)
- ✅ Animaciones suaves (fade-in, slide, scale)
- ✅ Accesibilidad mejorada (prefers-reduced-motion, prefers-contrast)
- ✅ Listo para copiar y pegar

## Pasos de Integración

### 1. Copiar estilos a `styles.css`

Abre `module-styles.css` y copia TODO el contenido (desde la línea 1 hasta el final).

Luego abre `styles.css` y pégalo al final del archivo, después de la última regla existente.

**Recomendación:** Añade un comentario separador antes de pegar:

```css
/* ================================================================
   MODULE SECTIONS — Estilos para módulos integrados
   Añadido el [fecha]
   ================================================================ */

/* [Contenido de module-styles.css aquí] */
```

### 2. Enlazar la hoja en `index.html` (opcional)

Si prefieres mantener los estilos en archivo separado:

```html
<link rel="stylesheet" href="module-styles.css">
```

**Importante:** Si usas el enfoque separado, asegúrate de que `module-styles.css` sea servido antes de cerrar `</head>`.

### 3. Verificar en el navegador

Abre `index.html` en el navegador y verifica:

- [ ] Las secciones de módulos tienen padding y bordes consistentes
- [ ] Los títulos (h2, h3) tienen el formato correcto con barrita lateral naranja
- [ ] Las tablas se ven bien en desktop y mobile
- [ ] Las cajas (note, warning, example) tienen colores distintivos
- [ ] Los enlaces dentro de módulos son azules y se oscurecen al hover
- [ ] Las animaciones se activan suavemente

## Estructura de Clases CSS

### Secciones principales

```html
<!-- Contenedor de módulo -->
<div class="module-section">
    <h2 class="module-title">Título del módulo</h2>
    <p>Contenido aquí...</p>
</div>

<!-- Módulo con sidebar (para contenido + resumen lateral) -->
<div class="module-section with-sidebar">
    <div class="module-section__content">
        <!-- Contenido principal aquí -->
    </div>
    <div class="module-section__sidebar">
        <!-- Resumen, quick links, etc. -->
    </div>
</div>
```

### Tipografía

```html
<h2 class="module-title">Título principal</h2>
<h3 class="section-subtitle">Subtítulo</h3>
<p class="module-paragraph">Párrafo normal</p>
<p class="module-paragraph lead">Párrafo destacado (mayor tamaño)</p>
<p class="module-paragraph small">Párrafo pequeño</p>
```

### Tablas

```html
<table class="data-table">
    <thead>
        <tr>
            <th>Columna 1</th>
            <th>Columna 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="highlight">Celda destacada</td>
            <td class="success">Estado: ✓ OK</td>
        </tr>
    </tbody>
</table>

<!-- Alternativa para comparaciones -->
<table class="comparison-matrix">
    <!-- Misma estructura -->
</table>

<!-- Para tablas grandes, envuelve en: -->
<div class="table-wrapper">
    <table class="data-table">...</table>
</div>
```

### Cajas destacadas

```html
<!-- Nota informativa -->
<div class="note-box">
    <p>Información importante que el usuario debe conocer.</p>
</div>

<!-- Ejemplo práctico -->
<div class="example-box">
    <p>Caso de uso concreto que ilustra el concepto.</p>
</div>

<!-- Advertencia -->
<div class="warning-box">
    <p>Algo que podría salir mal o requiere cuidado.</p>
</div>

<!-- Consejo -->
<div class="tip-box">
    <p>Recomendación útil para optimizar el trabajo.</p>
</div>

<!-- Información adicional -->
<div class="info-box">
    <p>Contexto o detalle importante.</p>
</div>
```

### Listas

```html
<!-- Lista desordenada regular -->
<ul>
    <li>Elemento 1</li>
    <li>Elemento 2</li>
</ul>

<!-- Lista con iconos -->
<ul class="list-with-icons">
    <li>Elemento destacado con flecha</li>
</ul>

<!-- Lista de características (grid) -->
<ul class="feature-list">
    <li>Característica 1</li>
    <li>Característica 2</li>
</ul>

<!-- Lista de pasos (numerada con estilo) -->
<ol class="steps-list">
    <li><strong>Primer paso:</strong> Descripción aquí</li>
    <li><strong>Segundo paso:</strong> Descripción aquí</li>
    <li><strong>Tercer paso:</strong> Descripción aquí</li>
</ol>
```

### Bloques de código (ya existen en styles.css, aquí se referencia)

```html
<div class="code-block" data-lang="bash" data-title="Ejemplo: Instalación">
    <pre><code>npm install @claude-code/cli</code></pre>
</div>
```

### Grillas de contenido

```html
<!-- Grid de 2 columnas -->
<div class="grid-2">
    <div class="grid-item">Contenido 1</div>
    <div class="grid-item">Contenido 2</div>
</div>

<!-- Grid de 3 columnas -->
<div class="grid-3">
    <div class="grid-item">Contenido 1</div>
    <div class="grid-item">Contenido 2</div>
    <div class="grid-item">Contenido 3</div>
</div>

<!-- Grid auto (responsive) -->
<div class="grid-auto">
    <div class="grid-item">Contenido</div>
    <!-- Se acomoda automáticamente según el ancho -->
</div>
```

### Elementos expandibles

```html
<details class="collapsible-section">
    <summary>Haz clic para expandir</summary>
    <div class="collapsible-section-content">
        <p>Contenido que se muestra al expandir...</p>
    </div>
</details>
```

### Badges

```html
<!-- Badge neutral -->
<span class="badge">Etiqueta</span>

<!-- Badge con color -->
<span class="badge primary">Info</span>
<span class="badge success">Éxito</span>
<span class="badge warning">Advertencia</span>
<span class="badge danger">Error</span>
<span class="badge accent">Destacado</span>
```

## Variables CSS disponibles

Todos los estilos usan variables definidas en `:root` de `styles.css`:

### Colores
- `--bg-base`, `--bg-surface`, `--bg-elevated`, `--bg-overlay` — Fondos
- `--text-primary`, `--text-secondary`, `--text-muted` — Texto
- `--accent`, `--primary`, `--success`, `--warning`, `--danger` — Semánticos
- `--border-default`, `--border-subtle`, `--border-strong` — Bordes

### Espaciado
- `--sp-1` a `--sp-12` — Espacios: 0.25rem a 3rem (múltiplos de 8px)
- Recomendación: usar `--sp-4` (1rem) como espaciado base

### Tipografía
- `--font-sans`, `--font-mono`, `--font-display` — Tipografías
- `--fs-xs` a `--fs-4xl` — Tamaños de fuente (12px a 36px)

### Bordes y sombras
- `--radius`, `--radius-lg`, `--radius-xl` — Redondeos
- `--shadow-sm`, `--shadow`, `--shadow-lg` — Sombras

Consulta `styles.css` líneas 18–132 para la lista completa.

## Puntos de quiebre (Breakpoints)

El CSS está optimizado para tres tamaños principales:

| Tamaño | Breakpoint | Cambios clave |
|--------|-----------|---------------|
| **Desktop** | 768px+ | Grid completo, sidebar visible, tipografía grande |
| **Tablet** | 375–768px | Grid simplificado (2 col → 1), padding reducido |
| **Mobile** | <375px | Single column, fuentes más pequeñas, padding mínimo |

Los estilos se cargan así:
1. **Base** — Estilos móviles first (por defecto)
2. **@media (max-width: 768px)** — Tablet
3. **@media (max-width: 375px)** — Mobile

## Animaciones

Todas las animaciones respetan `prefers-reduced-motion`. Los usuarios con accesibilidad activada verán contenido estático.

### Animaciones disponibles

| Nombre | Efecto | Cuándo usarla |
|--------|--------|---------------|
| `fadeIn` | Aparece suavemente | Al cargar secciones |
| `slideInLeft` | Entra desde la izquierda | Cajas de nota, listas |
| `slideInRight` | Entra desde la derecha | Contenido complementario |
| `scaleIn` | Escala desde pequeño a normal | Elementos destacados |
| `pulse` | Parpadeador sutil | Estados de carga |

Para aplicar:

```css
.mi-elemento {
    animation: fadeIn 0.4s ease-out;
}
```

## Personalización

### Cambiar colores de cajas destacadas

Edita en `module-styles.css` alrededor de la línea 370:

```css
.note-box {
    border-left-color: var(--primary);           /* Tu color aquí */
    background: rgba(94, 184, 255, 0.08);       /* Versión transparente */
}

.note-box::before {
    content: '📌 Nota';                          /* Tu emoji/texto */
    color: var(--primary);                       /* Mismo color */
}
```

### Cambiar espaciado

Los espacios están definidos en `:root`. Ejemplo: cambiar todos los módulos:

```css
:root {
    --sp-6: 1.5rem;  /* En lugar de 1.5rem, usa lo que quieras */
}
```

### Cambiar tipografía

Edita `--font-sans`, `--font-mono` en `:root` de `styles.css`.

### Agregar temas (light/dark adicionales)

```css
[data-theme="light"] {
    --bg-base: #ffffff;
    --text-primary: #1a1a1a;
    /* etc... */
}
```

## Verificación de Checklist

Antes de considerar los estilos "listos":

- [ ] `module-styles.css` está copiado en `styles.css` O enlazado en `index.html`
- [ ] Los bordes, espacios y colores coinciden con el diseño existente
- [ ] Las secciones `.module-section` tienen bordes y sombras visibles
- [ ] Los títulos h2/h3 muestran la barra lateral naranja
- [ ] Las tablas se ven bien con bordes y alternancia de filas
- [ ] Las cajas (note/warning/etc) tienen colores distintivos
- [ ] Las listas de pasos muestran números en círculos
- [ ] Los grids (grid-2, grid-3) se adaptan a mobile
- [ ] Los enlaces son azules y cambian a naranja con hover
- [ ] Las animaciones son suaves (no saltos abruptos)
- [ ] En mobile (375px), todo sigue siendo legible
- [ ] Los colores cumplen WCAG AA (contraste mínimo 4.5:1)

## Solución de problemas

### Los estilos no se ven
1. Verifica que `module-styles.css` está copiado en `styles.css` **después** de las reglas existentes
2. Abre DevTools (F12 → Elements) y busca la clase `.module-section`
3. Si hay conflictos, revisa la especificidad (las reglas en `styles.css` deben tener prioridad)

### Los colores no coinciden
1. Confirma que usas las variables correctas (ej: `var(--accent)`, no `#ff7a59`)
2. Abre `styles.css` líneas 18–132 para verificar los valores hex
3. Si cambiaste una variable en `:root`, los cambios se propagan automáticamente

### Mobile se ve roto
1. Verifica que los breakpoints se aplican correctamente (@media queries)
2. Abre DevTools en modo responsive (Ctrl+Shift+M) y prueba con 375px
3. Revisa que `--sp-` variables son más pequeñas en mobile

### Las animaciones no funcionan
1. Si has activado `prefers-reduced-motion`, las animaciones están deshabilitadas (es intencional)
2. Verifica que la animación tiene duración > 0 (ej: `0.4s`)
3. En navegadores antiguos, algunas animaciones pueden no funcionar (fallback es display estático)

## Archivos relacionados

- **styles.css** — Diseño base, tokens, componentes generales
- **index.html** — Contenido HTML que usa estas clases
- **components-theme.css** — Temas adicionales (si es necesario)

## Contacto / Actualizaciones

Si necesitas:
- Añadir nuevas clases
- Personalizar colores
- Ajustar breakpoints
- Reportar inconsistencias

Revisa primero que los cambios se alineen con los tokens de `:root` en `styles.css`.

---

**Fecha de creación:** Mayo 2026  
**Versión:** 1.0  
**Compatibilidad:** Todos los navegadores modernos (Chrome, Firefox, Safari, Edge)
