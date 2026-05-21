# 📑 Claude Code Design System — Complete Index

## 📦 Archivos Entregados

### 1. **DESIGN_SYSTEM_README.md** (23 KB)
**El punto de partida** — Resumen ejecutivo completo

Contenido:
- Highlights de la paleta y componentes
- Quick start en 3 pasos
- Referencia rápida de colores y espaciado
- Casos de uso prácticos
- Pro tips
- Estadísticas del sistema

**→ Empieza aquí si quieres un resumen de 10 minutos**

---

### 2. **DESIGN_SYSTEM.md** (19 KB)
**La especificación completa** — Referencia visual profesional

Contenido:
- § 1 Paleta de Colores (RGB/HEX con nombres)
- § 2 Tipografía (escalas, weights, line-heights)
- § 3 Iconografía (tamaños, stroke, aplicaciones)
- § 4 Componentes Visuales (cards, botones, badges, pills)
- § 5 Token Design System (CSS variables)
- § 6 Mockups ASCII (visualizaciones)
- § 7 Guía de Implementación
- § 8 Referencia Rápida
- § 9 Extensiones Futuras

**→ Lee esto si necesitas especificaciones técnicas precisas**

---

### 3. **VISUAL_SPECS.md** (18 KB)
**Guía de implementación técnica** — Cómo integrar en tu proyecto

Contenido:
- Resumen ejecutivo
- Paleta de colores para copiar/pegar
- Tipografía con ejemplos
- Clases CSS de componentes
- Cómo activar light mode
- Integración paso a paso
- Ejemplos HTML/CSS
- Accesibilidad (WCAG)
- Checklist de implementación

**→ Lee esto si quieres implementar el sistema en el código**

---

### 4. **components-theme.css** (40 KB)
**CSS production-ready** — Listo para usar en tu proyecto

Contenido:
- 1,100+ líneas de CSS bien documentado
- 10+ componentes reutilizables:
  - Botones (5 variantes + 3 tamaños)
  - Cards (6+ variantes con niveles)
  - Badges (level badges + status badges + outline)
  - Pills / Tags (con niveles y estado removable)
  - Alerts (4 tipos semánticos)
  - Form elements (input, textarea, select)
  - Tabs
  - Spinner / Loader
  - Code blocks
  - Dividers

- Estados automáticos: hover, active, disabled, focus
- Dark + Light mode incluido
- Responsive design automático
- Animaciones suaves

**→ Importa esto en tu index.html después de styles.css**

```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="components-theme.css">
```

---

### 5. **COMPONENTS_SHOWCASE.html** (14 KB)
**Demo interactiva** — Ver todos los componentes en acción

Contenido:
- Paleta de colores con previsualizaciones
- Botones en todas las variantes y tamaños
- Cards para los 6 niveles
- Badges y pills
- Alerts
- Tipografía
- Sombras
- Estados

**→ Abre esto en navegador (o Launch preview panel) para ver todo visualmente**

---

### 6. **VISUAL_MOCKUPS.txt** (13 KB)
**Visualizaciones ASCII detalladas** — Para entender la composición visual

Contenido:
1. Dashboard layout (dark + light mode)
2. Estados de botones
3. Cards con niveles
4. Badges y pills
5. Alerts
6. Tipografía (escala visual)
7. Espaciado y grid
8. Paleta de colores (spectrum visual)
9. Interacciones y animaciones
10. Responsive design
11. Accesibilidad

**→ Consulta esto para entender cómo lucen los componentes en ASCII**

---

### 7. **DESIGN_SYSTEM_INDEX.md** (Este archivo)
**Índice y guía de navegación** — Sabe dónde buscar cada cosa

---

## 🎯 Por Dónde Empezar

### Si tienes 5 minutos:
→ Lee **DESIGN_SYSTEM_README.md** (la sección "Quick Start")

### Si tienes 15 minutos:
→ Lee **DESIGN_SYSTEM_README.md** completo

### Si necesitas especificaciones exactas:
→ Consulta **DESIGN_SYSTEM.md** (cada sección es independiente)

### Si vas a implementar en el proyecto:
→ Sigue **VISUAL_SPECS.md** paso a paso

### Si quieres ver todo visualmente:
→ Abre **COMPONENTS_SHOWCASE.html** en navegador

---

## 🔍 Búsqueda Rápida

### "Necesito el código CSS de un botón"
→ `VISUAL_SPECS.md` § Componentes → Botones
→ O copia de `components-theme.css` (líneas 40-120)

### "¿Cuál es el color exacto del acento?"
→ `DESIGN_SYSTEM.md` § 1.2 Acentos Cromáticos
→ O `VISUAL_SPECS.md` § Paleta de Colores

### "Cómo hacer dark mode / light mode"
→ `VISUAL_SPECS.md` § Light Mode
→ O `DESIGN_SYSTEM.md` § 5.2 Light Mode

### "Quiero ver un mockup de una card"
→ `VISUAL_MOCKUPS.txt` § 4. Cards con Niveles
→ O `COMPONENTS_SHOWCASE.html` en navegador

### "¿Cómo uso los componentes?"
→ `VISUAL_SPECS.md` § Componentes
→ O `COMPONENTS_SHOWCASE.html` (ver HTML)

### "Espaciado estándar"
→ `DESIGN_SYSTEM.md` § 5.1 CSS Custom Properties
→ Variables `--sp-1` a `--sp-12`

### "Accesibilidad"
→ `VISUAL_SPECS.md` § Accesibilidad
→ O `VISUAL_MOCKUPS.txt` § 12. Accesibilidad

---

## 📊 Matriz de Contenidos

| Necesidad | DESIGN_SYSTEM | VISUAL_SPECS | components-theme.css | SHOWCASE | MOCKUPS |
|-----------|---------------|---------------|--------------------|----------|---------|
| Paleta de colores | ✅ § 1 | ✅ § Paleta | ✅ comentado | ✅ | ✅ § 8 |
| Tipografía | ✅ § 2 | ✅ § Tipografía | ✅ comentado | ✅ | ✅ § 6 |
| Componentes HTML | ✅ § 4 | ✅ § Componentes | ✅ clases | ✅ | ✅ § 3-5 |
| CSS pronto para copiar | ❌ | ❌ | ✅ listo | ❌ | ❌ |
| Implementación paso a paso | ❌ | ✅ | ❌ | ❌ | ❌ |
| Visual mockup | ❌ | ❌ | ❌ | ✅ | ✅ |
| Variables CSS exactas | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ejemplos de código | ✅ pequeños | ✅ | ✅ | ✅ | ❌ |

---

## 💻 Integración Rápida (3 pasos)

### Paso 1: Añade el CSS
```html
<!-- En tu index.html -->
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="components-theme.css">  <!-- ← Añade esto -->
```

### Paso 2: Usa las clases
```html
<!-- Antes -->
<button>Action</button>

<!-- Después -->
<button class="btn btn--primary">Action</button>
```

### Paso 3: Ver demo
Abre `COMPONENTS_SHOWCASE.html` en navegador para ver el resultado.

---

## 🎨 Paleta de Referencia Rápida

### Fondos (Dark)
```
#0d0d0d  Base (más oscuro)
#1a1a1a  Surface (cards)
#262626  Elevated (modales)
```

### Acentos
```
#ff7a59  Claude Orange (primario)
#5eb8ff  Cyan (info)
#d084fc  Magenta (premium)
```

### Estados
```
#3ddc97  Success (verde)
#ffb454  Warning (ámbar)
#ff6b6b  Danger (rojo)
```

### Niveles 1-6
```
#3ddc97, #5eb8ff, #d084fc, #ff7a59, #ec4899, #dc2626
```

---

## 📋 Componentes Disponibles

### Botones
- `.btn--primary` (CTA)
- `.btn--secondary` 
- `.btn--ghost`
- `.btn--danger`
- `.btn--success`
- `.btn--sm`, `.btn`, `.btn--lg` (tamaños)

### Cards
- `.card` (básica)
- `.card--level-1` a `.card--level-6`
- `.card--accent` (destacada)
- `.card--elevated`

### Badges
- `.badge--level-1` a `--level-6`
- `.badge--success`, `--warning`, `--danger`, `--info`
- `.badge--outline`

### Pills
- `.pill` (básica)
- `.pill--removable` (con botón X)
- `.pill--level-1` a `--level-4`

### Otros
- `.alert--success`, `--warning`, `--danger`, `--info`
- `.input`, `.textarea`, `.select`
- `.spinner`, `.spinner--sm`, `.spinner--lg`
- `.code-block`, `.code-inline`
- `.tabs`, `.tabs__item`, `.tabs__item--active`
- `.divider`, `.divider--dashed`

---

## 🌙 Dark Mode vs Light Mode

### Default (Dark)
```
--bg-base:      #0d0d0d
--bg-surface:   #1a1a1a
--text-primary: #e6edf3
```

### Light (añade a HTML)
```html
<html data-theme="light">
```

Automáticamente cambia:
```
--bg-base:      #ffffff
--bg-surface:   #f5f5f5
--text-primary: #0f0f0f
```

Los acentos se mantienen iguales.

---

## ♿ Accesibilidad Integrada

✅ **Contraste WCAG AAA** (mínimo 4.5:1)
✅ **Focus visible** en todos los elementos interactivos
✅ **Color no es el único indicador** (usa íconos también)
✅ **Semántica HTML correcta**
✅ **Responsive design** (mobile, tablet, desktop)

---

## 📁 Estructura de Archivos

```
claude doc/
├── DESIGN_SYSTEM_README.md        ← Empieza aquí
├── DESIGN_SYSTEM.md               ← Especificación completa
├── VISUAL_SPECS.md                ← Implementación
├── DESIGN_SYSTEM_INDEX.md         ← Este archivo (navegación)
│
├── components-theme.css           ← CSS production-ready
├── COMPONENTS_SHOWCASE.html       ← Demo interactiva
├── VISUAL_MOCKUPS.txt             ← ASCII visualizations
│
├── styles.css                     ← CSS original (mantener)
├── index.html                     ← Tu app principal
└── ...
```

---

## 🔗 Referencias Cruzadas

### Para entender la paleta:
1. Lee `DESIGN_SYSTEM.md` § 1
2. Mira `COMPONENTS_SHOWCASE.html` en navegador
3. Consulta `VISUAL_SPECS.md` § Paleta de Colores

### Para implementar un nuevo componente:
1. Lee `DESIGN_SYSTEM.md` § 4
2. Busca las clases en `components-theme.css`
3. Copia el HTML de `COMPONENTS_SHOWCASE.html`

### Para entender responsive:
1. Lee `VISUAL_SPECS.md` § Integración
2. Mira `VISUAL_MOCKUPS.txt` § 11. Responsive
3. Redimensiona el navegador viendo `COMPONENTS_SHOWCASE.html`

---

## 📈 Estadísticas del Sistema

- **Colores**: 30+ (backgrounds, acentos, semánticos, niveles)
- **Componentes**: 10+ (buttons, cards, badges, pills, alerts, etc.)
- **Clases CSS**: 50+ reutilizables
- **Líneas CSS**: 1,100+
- **Modos**: 2 (Dark + Light)
- **Estados**: 4 (default, hover, active, disabled)
- **Responsive**: Mobile, Tablet, Desktop
- **Accesibilidad**: WCAG 2.1 AA
- **Performance**: 0 dependencias externas

---

## ✨ Pro Tips

### Reutilizar Variables
```css
.my-component {
  background: var(--bg-surface);
  padding: var(--sp-6);
  border-radius: var(--radius);
  color: var(--text-primary);
}
```

### Crear Variante Personalizada
```css
.btn--custom {
  background: linear-gradient(135deg, var(--accent), #d084fc);
}
```

### Detectar Modo Automático
```javascript
if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  document.documentElement.setAttribute('data-theme', 'light');
}
```

---

## 🚀 Próximos Pasos

1. **Revisa el demo**: Abre `COMPONENTS_SHOWCASE.html`
2. **Lee la especificación**: Consulta `DESIGN_SYSTEM.md`
3. **Implementa el CSS**: Importa `components-theme.css`
4. **Migra componentes**: Actualiza clases antiguas
5. **Test accesibilidad**: Verifica contraste y navegación
6. **Deploy**: Publica cambios

---

## 📞 Preguntas Frecuentes

### "¿Dónde está el código CSS de X?"
→ Busca en `components-theme.css` o `VISUAL_SPECS.md`

### "¿Cómo hago que funcione light mode?"
→ Lee `VISUAL_SPECS.md` § Light Mode

### "¿Puedo personalizar los colores?"
→ Sí, modifica las variables en `:root` de `components-theme.css`

### "¿Necesito otros archivos?"
→ No, solo `styles.css` + `components-theme.css`

### "¿Cómo añado un nuevo componente?"
→ Crea las clases en `components-theme.css` basándote en los existentes

---

## 📜 Versionado

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-05-21 | Sistema completo |

---

## 📄 Licencia

Libre para usar en Claude Code Mastery y proyectos asociados.

---

**Hecho con ♥ para Claude Code Mastery**

Diseño visual que inspira, código limpio que perdura.

