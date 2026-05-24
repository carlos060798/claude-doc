# Checklist de Integración — Module Styles CSS

Guía paso a paso para integrar los nuevos estilos en `index.html`.

## Archivos generados

| Archivo | Propósito |
|---------|-----------|
| `module-styles.css` | CSS puro, completo y listo para copiar |
| `MODULE_STYLES_GUIDE.md` | Documentación detallada de clases y uso |
| `MODULE_STYLES_EXAMPLES.html` | Página HTML con ejemplos visuales de todas las clases |
| `INTEGRATION_CHECKLIST.md` | Este archivo — pasos de integración |

## Opción 1: Copiar en styles.css (recomendado)

### Paso 1: Abrir archivos
- [ ] Abre `module-styles.css` en tu editor
- [ ] Abre `styles.css` en otra pestaña

### Paso 2: Copiar contenido
- [ ] En `module-styles.css`: Selecciona TODO (Ctrl+A)
- [ ] Copia (Ctrl+C)
- [ ] Ve a `styles.css` y colócate al final del archivo (Ctrl+End)
- [ ] Añade una línea en blanco
- [ ] Añade este comentario separador:

```css
/* ================================================================
   MODULE SECTIONS STYLES
   Estilos profesionales para módulos integrados en index.html
   Basado en tokens de diseño de styles.css
   Responsive (mobile 375px, tablet 768px, desktop 1280px+)
   ================================================================ */
```

- [ ] Pega el contenido (Ctrl+V)
- [ ] Guarda `styles.css` (Ctrl+S)

### Paso 3: Verificar en navegador
- [ ] Abre `index.html` en el navegador
- [ ] Presiona F5 (reload) varias veces para limpiar caché
- [ ] Abre la consola (F12) y verifica que no hay errores CSS

### Paso 4: Pruebas visuales
- [ ] Busca una sección con clase `.module-section`
- [ ] Verifica que tiene bordes grises y padding
- [ ] Verifica que los títulos (h2) tienen una barra naranja a la izquierda
- [ ] Verifica que las cajas (`note-box`, `warning-box`, etc.) tienen colores distintivos
- [ ] Redimensiona el navegador a mobile (375px) y verifica que sigue siendo legible

## Opción 2: Archivo CSS separado

Si prefieres mantenerlo como archivo independiente:

### Paso 1: Rename/mantener
- [ ] Deja `module-styles.css` en la carpeta raíz de `index.html`
- [ ] Asegúrate de que está en el mismo directorio que `styles.css`

### Paso 2: Enlace en HTML
- [ ] Abre `index.html`
- [ ] Dentro de `<head>`, después de `<link rel="stylesheet" href="styles.css">`, añade:

```html
<link rel="stylesheet" href="module-styles.css">
```

El orden debe ser:
```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="module-styles.css">
```

- [ ] Guarda `index.html`

### Paso 3: Verificar
- [ ] Abre `index.html` en el navegador
- [ ] Verifica que los estilos se cargan (F12 → Network → module-styles.css debe estar OK)
- [ ] Sigue los pasos 3 y 4 de la Opción 1

## Verificación de éxito

Una vez integrado, verifica este checklist visual:

### Secciones de módulos
- [ ] Las secciones `.module-section` tienen:
  - [ ] Fondo gris oscuro (#1a1a1a)
  - [ ] Borde gris (#3a3a3a)
  - [ ] Padding interno (alrededor de 32px)
  - [ ] Sombra sutil
  - [ ] Bordes redondeados

### Tipografía
- [ ] Los títulos h2 tienen:
  - [ ] Una barra naranja vertical a la izquierda
  - [ ] Texto grande (24px) y bold
  - [ ] Margin inferior consistente
- [ ] Los subtítulos h3 tienen:
  - [ ] Línea separadora arriba (subtle)
  - [ ] Tamaño 18px
  - [ ] Texto primario (#e6edf3)
- [ ] Los párrafos tiene altura de línea 1.7 (legible)

### Cajas destacadas
- [ ] `.note-box` — Borde azul (#5eb8ff) + fondo azul suave
- [ ] `.warning-box` — Borde ámbar (#ffb454) + fondo ámbar suave
- [ ] `.example-box` — Borde cian + fondo cian suave
- [ ] `.tip-box` — Borde naranja (#ff7a59) + fondo naranja suave
- [ ] `.info-box` — Borde púrpura (#d084fc) + fondo púrpura suave

### Tablas
- [ ] Bordes visibles alrededor de la tabla
- [ ] Encabezados con fondo más oscuro
- [ ] Filas alternas con color de fondo sutil
- [ ] Cambio de color al pasar el mouse

### Listas
- [ ] `<ul>` regular — Viñetas en naranja
- [ ] `<ol>` regular — Números en azul
- [ ] `.steps-list` — Números dentro de círculos naranjas
- [ ] `.feature-list` — Grid de 2-3 columnas (según pantalla)

### Responsive
- [ ] En desktop (1280px+): Todo bien
- [ ] En tablet (768px): Grids se convierten a 1 columna
- [ ] En mobile (375px): 
  - [ ] Fuentes más pequeñas pero legibles
  - [ ] Padding reducido
  - [ ] Grids y tablas en single column
  - [ ] Sin overflow horizontal

### Interactividad
- [ ] Los enlaces dentro de módulos son azules y se vuelven naranjas al hover
- [ ] Las cajas `.grid-item` tienen efecto lift (subida suave) al hover
- [ ] Los `details.collapsible-section` abren/cierran suavemente
- [ ] Las animaciones son suaves (no saltos abruptos)

## Solución de problemas

### Los estilos no se ven
**Diagnóstico:**
1. Abre DevTools (F12)
2. Ve a Elements/Inspector
3. Busca un elemento `.module-section`
4. En Styles debería aparecer una regla `.module-section { background: var(--bg-surface); ... }`

**Solución:**
- Si NO aparece: El CSS no está cargado. Verifica:
  - [ ] ¿Copiaste TODO el contenido de `module-styles.css`?
  - [ ] ¿Lo pegaste al FINAL de `styles.css` (después de todas las reglas)?
  - [ ] ¿Guardaste los cambios (Ctrl+S)?
  - [ ] ¿Recargaste el navegador (F5 o Ctrl+Shift+R)?

- Si APARECE pero con conflictos: Hay una regla más específica que la sobrescribe
  - [ ] En DevTools, busca qué regla está ganando (tachada significa que fue sobrescrita)
  - [ ] Mueve los estilos de `module-styles.css` MÁS al final de `styles.css`

### Los colores son diferentes
**Posible causa:** Las variables CSS en `:root` son diferentes de las esperadas.

**Solución:**
- [ ] Abre DevTools → Console (F12)
- [ ] Copia y pega: `getComputedStyle(document.documentElement).getPropertyValue('--accent')`
- [ ] Debería devolver `#ff7a59` (naranja Claude)
- [ ] Si devuelve otro valor, alguien cambió las variables en `:root`

### Mobile se ve roto
**Posible causa:** Los breakpoints no se aplican correctamente.

**Solución:**
1. En DevTools, presiona Ctrl+Shift+M (Responsive Design Mode)
2. Selecciona "iPhone 12" o escribe "375" para el ancho
3. Recarga la página (F5)
4. Si sigue roto:
   - [ ] Verifica que `@media (max-width: 768px)` aparece en `styles.css`
   - [ ] Verifica que el viewport meta está en `index.html`: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

### Las animaciones no funcionan
**Posible causa:** El navegador tiene `prefers-reduced-motion` activado, O las animaciones simplemente están deshabilitadas.

**Solución:**
- [ ] En Chrome DevTools: Rendering → Emulate CSS media feature prefers-reduced-motion → "reduce" ✓
  - Si está "no preference", las animaciones deberían funcionar
  - Si está "reduce", las animaciones están INTENCIONALMENTE deshabilitadas (respeto a accesibilidad)

## Cómo verificar que está listo para producción

Antes de considerar los estilos "listos":

- [ ] **Estilos copiados correctamente** — Los cambios persisten después de reload
- [ ] **Sin errores de CSS** — DevTools no muestra errores en la consola
- [ ] **Responsive funciona** — Mobile, tablet y desktop se ven bien
- [ ] **Colores correctos** — Todos los badges, cajas y acentos coinciden con el diseño
- [ ] **Tipografía correcta** — Tamaños, pesos y alturas de línea son consistentes
- [ ] **Animaciones suaves** — Sin saltos ni parpadeos (a menos que prefers-reduced-motion)
- [ ] **Accesibilidad** — Contraste suficiente, sin dependencia solo de color

## Siguientes pasos

Una vez integrado y verificado:

1. **Actualiza HTML** — Usa las nuevas clases en tus secciones de módulos
   - Reemplaza divs genéricos con `.module-section`
   - Usa las clases de cajas destacadas para notas y advertencias
   - Estructura listas con las clases apropiadas

2. **Prueba en diferentes navegadores**
   - Chrome / Chromium
   - Firefox
   - Safari (si es posible)
   - Edge

3. **Documentación** — Mantén `MODULE_STYLES_GUIDE.md` como referencia durante desarrollo

4. **Customización** — Si necesitas cambios:
   - [ ] Colores → Edita variables en `:root` de `styles.css`
   - [ ] Espaciado → Edita variables `--sp-*` en `:root`
   - [ ] Tipografía → Edita variables `--font-*` en `:root`
   - [ ] Breakpoints → Edita los valores en `@media (max-width: ...)`

## Preguntas frecuentes

**P: ¿Puedo usar esto sin cambiar styles.css?**
R: Sí, mantén `module-styles.css` como archivo separado y enlázalo en `index.html` (Opción 2).

**P: ¿Los estilos funcionan en navegadores antiguos?**
R: CSS variables (custom properties) requieren navegadores modernos (2016+). Los navegadores antiguos (IE11) no funcionarán.

**P: ¿Puedo cambiar los colores de las cajas?**
R: Sí, edita las variables `--primary`, `--warning`, `--accent`, etc. en `:root` de `styles.css`.

**P: ¿Cómo añado nuevas clases?**
R: Edita `module-styles.css` y luego recopia los cambios a `styles.css`, O edita directamente en `styles.css` si usas la Opción 1.

**P: ¿Los estilos se actualizarán automáticamente?**
R: Si editas `module-styles.css` como archivo separado, NO. Si copias a `styles.css`, solo si editas directamente ahí.

## Contacto de soporte

Si encontras problemas:

1. Revisa `MODULE_STYLES_GUIDE.md` para documentación completa
2. Abre `MODULE_STYLES_EXAMPLES.html` para ver ejemplos visuales
3. Compara el CSS de `module-styles.css` con el de `styles.css` para encontrar conflictos
4. Verifica DevTools (F12) para mensajes de error específicos

---

**Checklist completado:** ___/___  
**Fecha de integración:** _____  
**Versión de styles.css:** _____
