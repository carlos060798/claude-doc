# 🎨 Claude Code Design System v1.0

**Sistema visual profesional para Claude Code Mastery** — Paleta de colores, tipografía, componentes y tokens CSS listos para producción.

---

## 📦 Entregables

### 📄 Documentación
1. **`DESIGN_SYSTEM.md`** (22 KB)
   - Paleta completa de colores (RGB/HEX)
   - Sistema tipográfico escalable
   - Especificaciones de componentes
   - Tokens CSS para personalización
   - Mockups ASCII visualization

2. **`VISUAL_SPECS.md`** (18 KB)
   - Guía de implementación
   - Checklist de integración
   - Ejemplos de código HTML/CSS
   - Accesibilidad (WCAG)
   - Próximos pasos

### 💻 Código
3. **`components-theme.css`** (35 KB)
   - 1,100+ líneas de CSS production-ready
   - 10+ componentes reutilizables
   - Dark + Light mode automático
   - Estados (hover, active, disabled, focus)
   - Responsive design incluido

### 🎬 Demo
4. **`COMPONENTS_SHOWCASE.html`** (20 KB)
   - Demostración interactiva completa
   - Paleta visual con previsualizaciones
   - Ejemplos de cada componente
   - Preview en navegador (lista en Launch panel)

---

## 🎯 Highlights

### ✅ Paleta de Colores Profesional
```
BACKGROUNDS:    #0d0d0d → #262626  (5 niveles de oscuridad)
ACENTOS:        #ff7a59 (Claude Orange) + 4 colores secundarios
SEMÁNTICA:      #3ddc97 (éxito), #ffb454 (alerta), #ff6b6b (error)
NIVELES:        6 colores para niveles de aprendizaje (1-6)
```

### 📐 Tipografía Escalada
```
H1:      32px Bold      → Títulos principales
H2:      24px Semibold  → Subtítulos
H3:      20px Semibold  → Subsecciones
Body:    15px Regular   → Contenido estándar
Code:    14px Mono      → Snippets de código
```

### 🔘 Componentes Listos
- **Botones**: Primary, Secondary, Ghost, Danger, Success (+ tamaños sm/lg)
- **Cards**: Básicas, con niveles (1-6), accent border, elevated
- **Badges**: Nivel, status, outline
- **Pills**: Tags, removables, con niveles
- **Alerts**: Success, Warning, Danger, Info
- **Forms**: Input, Textarea, Select con estados
- **Otro**: Tabs, Spinner, Code blocks, Dividers

### 🌙 Dark & Light Mode
Ambos modos completamente especificados:
```css
:root { /* Dark mode (default) */ }
[data-theme="light"] { /* Light mode */ }
```

### ♿ Accesibilidad
- Contraste mínimo 4.5:1 (AAA)
- Focus visible en todos los elementos
- Color no es el único indicador
- Semántica HTML correcta

---

## 🚀 Quick Start

### 1. Importar CSS
```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="components-theme.css">
```

### 2. Usar Componentes
```html
<!-- Botón -->
<button class="btn btn--primary">Action</button>

<!-- Card con nivel -->
<div class="card card--level-2">
  <div class="card__header">
    <h2 class="card__title">Título</h2>
  </div>
  <div class="card__content">Contenido...</div>
</div>

<!-- Badge -->
<span class="badge badge--level-1">Level 1</span>
```

### 3. Ver Demo
Abre `COMPONENTS_SHOWCASE.html` en navegador o preview panel.

---

## 📚 Referencia Rápida

### Colores Más Usados
```css
--bg-base:      #0d0d0d  (fondo principal)
--bg-surface:   #1a1a1a  (cards)
--text-primary: #e6edf3  (texto)
--accent:       #ff7a59  (acciones destacadas)
--success:      #3ddc97  (éxito)
--danger:       #ff6b6b  (error)
```

### Espaciado
```css
--sp-4: 16px   (gap estándar)
--sp-6: 24px   (padding cards)
--sp-8: 32px   (margin secciones)
```

### Bordes
```css
--radius:    8px   (buttons, cards)
--radius-lg: 12px  (large components)
--shadow:    0 4px 12px rgba(0,0,0,0.4)  (standard)
```

---

## 📂 Estructura de Archivos

```
claude doc/
├── DESIGN_SYSTEM.md              ← Especificación completa
├── DESIGN_SYSTEM_README.md       ← Este archivo
├── VISUAL_SPECS.md               ← Guía de implementación
├── components-theme.css          ← CSS production-ready
├── COMPONENTS_SHOWCASE.html      ← Demo interactiva
│
├── styles.css                    ← CSS base original
├── index.html                    ← Aplicación principal
└── ...
```

---

## 🎨 Paleta Visual (Cheat Sheet)

### Backgrounds (Dark)
| Nombre | Hex | Uso |
|--------|-----|-----|
| Base | `#0d0d0d` | Fondo principal |
| Surface | `#1a1a1a` | Cards |
| Elevated | `#262626` | Modales |
| Hover | `#1f2937` | Estados hover |

### Acentos
| Nombre | Hex | Uso |
|--------|-----|-----|
| Orange (PRIMARY) | `#ff7a59` | CTAs, highlights |
| Cyan | `#5eb8ff` | Info, Level 2 |
| Magenta | `#d084fc` | Premium, Level 3 |

### Estados
| Nombre | Hex | Uso |
|--------|-----|-----|
| Success | `#3ddc97` | ✓ Completado |
| Warning | `#ffb454` | ⚠ Alerta |
| Danger | `#ff6b6b` | ✕ Error |

### Niveles (1-6)
```
Lv1: #3ddc97  🟢  Verde
Lv2: #5eb8ff  🔵  Azul
Lv3: #d084fc  🟣  Púrpura
Lv4: #ff7a59  🟠  Orange
Lv5: #ec4899  🔴  Rosa
Lv6: #dc2626  🔴  Rojo
```

---

## 📖 Documentación

### Para Entender la Paleta
→ Lee `DESIGN_SYSTEM.md` § 1 (Paleta de Colores)

### Para Implementar Componentes
→ Lee `COMPONENTS_SHOWCASE.html` o `VISUAL_SPECS.md`

### Para Entender Tipografía
→ Lee `DESIGN_SYSTEM.md` § 2 (Tipografía)

### Para Integración en Proyecto
→ Lee `VISUAL_SPECS.md` § Integración en Proyecto Actual

---

## ✨ Características

### Dark Mode (Default)
```css
✓ 5 niveles de backgrounds para profundidad
✓ 3 niveles de text para jerarquía
✓ Acentos profesionales (no neon)
✓ Contraste WCAG AAA en textos principales
```

### Light Mode
```css
✓ Backgrounds claros (#ffffff → #ebebeb)
✓ Textos oscuros para máximo contraste
✓ Mismos acentos (no cambian)
✓ Sombras suavizadas
```

### Componentes
```css
✓ 50+ clases CSS reutilizables
✓ Estados (hover, active, disabled, focus)
✓ Responsive design automático
✓ Animations & transitions suaves
✓ Accesibilidad integrada
```

### Performance
```css
✓ CSS minimal, sin frameworks
✓ Variables reutilizables (tokens)
✓ No añade dependencias
✓ Compatible con styles.css existente
```

---

## 🔧 Casos de Uso

### Caso 1: Crear Nueva Sección
```html
<section style="max-width: var(--max-content); margin: 0 auto; padding: var(--sp-8);">
  <h2 style="font-size: 24px; font-weight: 600; margin-bottom: var(--sp-6);">
    New Section
  </h2>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--sp-6);">
    <div class="card card--level-1">
      <div class="card__header">
        <h3 class="card__title">Item</h3>
      </div>
      <div class="card__content">Content...</div>
    </div>
  </div>
</section>
```

### Caso 2: Mostrar Status
```html
<div style="display: flex; align-items: center; gap: var(--sp-3);">
  <div class="spinner spinner--sm"></div>
  <span class="badge badge--warning">⚠ In Progress</span>
</div>
```

### Caso 3: Formulario
```html
<form style="display: flex; flex-direction: column; gap: var(--sp-4); max-width: 400px;">
  <input class="input" type="text" placeholder="Name...">
  <textarea class="textarea" placeholder="Message..."></textarea>
  <button class="btn btn--primary">Submit</button>
</form>
```

---

## 🎯 Próximos Pasos

1. **Revisar demo**: Abre `COMPONENTS_SHOWCASE.html`
2. **Leer especificación**: Consulta `DESIGN_SYSTEM.md`
3. **Integrar CSS**: Importa `components-theme.css`
4. **Reemplazar componentes**: Actualiza clases antiguas
5. **Verificar**: Test en dark + light mode
6. **Deploy**: Publica cambios

---

## 💡 Pro Tips

### Reutilizar Variables
```css
.my-component {
  background: var(--bg-surface);
  padding: var(--sp-6);
  border-radius: var(--radius);
  color: var(--text-primary);
  transition: all var(--transition);
}
```

### Crear Variante Personalizada
```css
.btn--custom {
  background: linear-gradient(135deg, var(--accent), #d084fc);
  color: white;
}
```

### Activar Light Mode Globalmente
```javascript
document.documentElement.setAttribute('data-theme', 'light');
```

### Detectar Preferencia del SO
```javascript
if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  document.documentElement.setAttribute('data-theme', 'light');
}
```

---

## 📞 Support

### Preguntas sobre...
- **Colores**: Ver `DESIGN_SYSTEM.md` § 1
- **Tipografía**: Ver `DESIGN_SYSTEM.md` § 2
- **Componentes**: Ver `COMPONENTS_SHOWCASE.html`
- **Implementación**: Ver `VISUAL_SPECS.md`
- **CSS**: Ver `components-theme.css` (comentado)

### Reportar Issues
Cualquier inconsistencia visual o accesibilidad:
- Revisar `COMPONENTS_SHOWCASE.html`
- Comparar con `DESIGN_SYSTEM.md`
- Verificar contraste con herramienta WebAIM

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| Total Colores | 30+ |
| Componentes | 10+ |
| Clases CSS | 50+ |
| Líneas CSS | 1,100+ |
| Modos Soportados | 2 (Dark, Light) |
| Estados Componentes | 4 (default, hover, active, disabled) |
| Accesibilidad | WCAG 2.1 AA |

---

## 🎓 Conceptos Clave

### Design Tokens
Variables CSS reutilizables que centralizan decisiones visuales:
```css
--accent: #ff7a59;  /* Cambiar aquí afecta todo */
.btn { background: var(--accent); }
.badge { color: var(--accent); }
```

### Escalas Tipográficas
Ratios consistentes entre tamaños para armonía:
```
32px (H1) → 24px (H2) → 20px (H3) → 16px (H4) → 15px (Body)
```

### Elevación (Sombras)
Crean profundidad sin cambiar posición:
```css
--shadow-sm:  0 1px 2px   (subtle)
--shadow:     0 4px 12px  (standard)
--shadow-lg:  0 12px 32px (elevated)
```

### Estados Componentes
- **Default**: Estado normal
- **Hover**: Mouse sobre elemento
- **Active**: Clickeado o seleccionado
- **Disabled**: No disponible
- **Focus**: Teclado navegando

---

## 📝 Changelog

### v1.0 (2026-05-21)
- ✅ Paleta de 30+ colores
- ✅ Sistema tipográfico completo
- ✅ 10+ componentes
- ✅ Dark + Light mode
- ✅ 1,100+ líneas CSS
- ✅ Documentación completa
- ✅ Demo interactiva
- ✅ WCAG 2.1 AA compliance

---

**Made with ♥ for Claude Code Mastery**

Diseño visual que inspira, código limpio que durará.

---

## 📄 Licencia

Libre para usar en Claude Code Mastery y proyectos relacionados.

