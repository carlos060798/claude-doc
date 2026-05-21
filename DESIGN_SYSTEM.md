# Claude Code Mastery — Design System

Sistema de diseño visual profesional para la plataforma educativa Claude Code Mastery, inspirado en la estética de Claude Code oficial.

---

## 1. PALETA DE COLORES

### 1.1 Colores Base (Dark Mode)

#### Backgrounds
| Token | Hex | RGB | Descripción |
|-------|-----|-----|-------------|
| `--bg-base` | `#0d0d0d` | 13, 13, 13 | Fondo principal, muy oscuro |
| `--bg-surface` | `#1a1a1a` | 26, 26, 26 | Cards, secciones contenidas |
| `--bg-elevated` | `#262626` | 38, 38, 38 | Modales, dropdowns, overlays |
| `--bg-overlay` | `#1c2433` | 28, 36, 51 | Fondos de overlay con tinte azul |
| `--bg-hover` | `#1f2937` | 31, 41, 55 | Estado hover de elementos |

#### Bordes
| Token | Hex | RGB | Descripción |
|-------|-----|-----|-------------|
| `--border-subtle` | `#2d3748` | 45, 55, 72 | Bordes muy sutiles, fondo claro |
| `--border-default` | `#3a3a3a` | 58, 58, 58 | Bordes estándar |
| `--border-strong` | `#3b4759` | 59, 71, 89 | Bordes más prominentes |

#### Tipografía
| Token | Hex | RGB | Descripción |
|-------|-----|-----|-------------|
| `--text-primary` | `#e6edf3` | 230, 237, 243 | Texto principal, máximo contraste |
| `--text-secondary` | `#9aa7b8` | 154, 167, 184 | Texto secundario, 60% contraste |
| `--text-muted` | `#7a8a9e` | 122, 138, 158 | Texto deshabilitado/muted |
| `--text-disabled` | `#4a5566` | 74, 85, 102 | Texto muy deshabilitado |

### 1.2 Acentos Cromáticos

#### Primarios (Claude Brand)
| Token | Hex | RGB | Descripción |
|-------|-----|-----|-------------|
| `--accent` | `#ff7a59` | 255, 122, 89 | **CLAUDE ORANGE** — Primario, botones destacados |
| `--accent-hover` | `#ff9073` | 255, 144, 115 | Estado hover (más claro) |
| `--accent-soft` | `rgba(255, 122, 89, 0.12)` | — | Fondo soft para destacar sin abrumar |

#### Secundarios
| Token | Hex | RGB | Descripción |
|-------|-----|-----|-------------|
| `--accent-cyan` | `#5eb8ff` | 94, 184, 255 | Azul suave, información |
| `--accent-magenta` | `#d084fc` | 208, 132, 252 | Púrpura, premium/advanced |
| `--primary` | `#5eb8ff` | 94, 184, 255 | Links, acciones secundarias |

### 1.3 Estados Semánticos

| Token | Hex | RGB | Uso |
|-------|-----|-----|-----|
| `--success` | `#3ddc97` | 61, 220, 151 | Éxito, completado ✓ |
| `--warning` | `#ffb454` | 255, 180, 84 | Alerta, cuidado ⚠ |
| `--danger` | `#ff6b6b` | 255, 107, 107 | Error, destrucción 🚫 |

### 1.4 Niveles de Aprendizaje

| Nivel | Token | Hex | RGB | Color |
|-------|-------|-----|-----|-------|
| 1 | `--level-1` | `#3ddc97` | 61, 220, 151 | Verde — Fundamentos |
| 2 | `--level-2` | `#5eb8ff` | 94, 184, 255 | Azul — Avanzado |
| 3 | `--level-3` | `#d084fc` | 208, 132, 252 | Púrpura — Experto |
| 4 | `--level-4` | `#ff7a59` | 255, 122, 89 | Orange — Ingeniero |
| 5 | `--level-5` | `#ec4899` | 236, 72, 153 | Rosa — Master |
| 6 | `--level-6` | `#dc2626` | 220, 38, 38 | Rojo — Elite |

---

## 2. TIPOGRAFÍA

### 2.1 Familias de Fuentes

```css
--font-display: 'IBM Plex Sans', system-ui, sans-serif;    /* Display, títulos grandes */
--font-sans: 'Inter', system-ui, sans-serif;               /* Body, UI estándar */
--font-mono: 'Fira Code', 'JetBrains Mono', 'SF Mono', ...  /* Código, terminal */
```

### 2.2 Escala Tipográfica

| Elemento | Font Size | Line Height | Weight | Uso |
|----------|-----------|-------------|--------|-----|
| **H1** | 32px | 1.2 (38.4px) | 700 Bold | Títulos principales de sección |
| **H2** | 24px | 1.3 (31.2px) | 600 Semibold | Subtítulos, headers de cards |
| **H3** | 20px | 1.4 (28px) | 600 Semibold | Títulos de subsecciones |
| **H4** | 16px | 1.5 (24px) | 600 Semibold | Labels, títulos pequeños |
| **Body** | 15px | 1.6 (24px) | 400 Regular | Texto de párrafo estándar |
| **Small** | 14px | 1.5 (21px) | 400 Regular | Subtítulos, metadatos |
| **Caption** | 12px | 1.4 (16.8px) | 400 Regular | Labels, hints, copyright |
| **Code** | 14px | 1.6 (22.4px) | 400 Regular | Inline code, snippets |
| **Mono** | 13px | 1.5 (19.5px) | 500 Medium | Terminal, logs |

### 2.3 Ejemplos Tipográficos

```
┌─────────────────────────────────────┐
│ H1: Nivel 1: Fundamentos            │ 32px, Bold
├─────────────────────────────────────┤
│ H2: Instalación y Configuración     │ 24px, Semibold
├─────────────────────────────────────┤
│ Body: Esta es una sección que      │ 15px, Regular
│ explica conceptos fundamentales...  │ Line-height: 1.6
├─────────────────────────────────────┤
│ Code: npm install -g @anthropic...  │ 14px, Mono, colored
└─────────────────────────────────────┘
```

---

## 3. ICONOGRAFÍA

### 3.1 Sistema de Iconos

Usando **Feather Icons** o **Heroicons** para consistencia:

- **Stroke style**: 2px (default), 1.5px (small), 2.5px (large)
- **Tamaño estándar**: 24px × 24px
- **Variantes**:
  - **16px**: Breadcrumbs, metadata, badges
  - **24px**: Nav items, buttons, headers
  - **32px**: Section icons, highlights
  - **48px**: Hero sections, banners

### 3.2 Tamaños y Espaciado

```
Icon 16px:  ┌─────┐    Used in: Metadata, captions
            │ 16  │    Padding: 4px
            └─────┘

Icon 24px:  ┌─────────┐  Used in: Nav, buttons, standard
            │   24    │  Padding: 8px
            └─────────┘

Icon 32px:  ┌───────────────┐  Used in: Headers, features
            │      32       │  Padding: 12px
            └───────────────┘

Icon 48px:  ┌─────────────────────┐  Used in: Hero, large sections
            │         48          │  Padding: 16px
            └─────────────────────┘
```

### 3.3 Iconos Clave Utilizados

| Icon | Stroke | Uso |
|------|--------|-----|
| 🎓 | 2px | Curso, aprendizaje |
| 📋 | 2px | Configuración, rules |
| ⚙️ | 2px | Setup, instalación |
| 🚀 | 2px | Primeros pasos, launch |
| 🌿 | 2px | Git, branching |
| 💾 | 2px | Memory, almacenamiento |
| 🔄 | 2px | Ciclos, patrones |
| 🔧 | 2px | Tools, herramientas |
| 🎯 | 2px | Objetivo, framework |
| ✨ | 2px | Premium, especial |

---

## 4. COMPONENTES VISUALES

### 4.1 Cards

#### Estructura
```
┌─ Card ─────────────────────────────┐
│                                     │
│  ┌─ Header ───────────────────┐   │  Padding: 16px/24px
│  │ Título Card   ✓ Badge       │   │  Border-radius: 8px
│  └────────────────────────────┘    │  Background: --bg-surface
│                                     │  Border: 1px --border-default
│  Content section con espaciado     │
│  coherente y tipografía clara.     │
│                                     │
│  ┌─ Footer (opcional) ──────────┐ │
│  │ Action buttons | Meta info    │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

#### Estados
- **Default**: Background `--bg-surface`, border `--border-default`
- **Hover**: Background `--bg-hover`, shadow `--shadow`, transform: translateY(-2px)
- **Active**: Background `--bg-elevated`, border `--accent`
- **Disabled**: Opacity 50%, cursor not-allowed

### 4.2 Botones

#### Variantes

**Primary (CTA)**
```
┌──────────────────────┐
│ Primary Action       │  Background: --accent (#ff7a59)
│                      │  Color: white
│                      │  Hover: --accent-hover (#ff9073)
└──────────────────────┘  Active: scale 0.98
```

**Secondary**
```
┌──────────────────────┐
│ Secondary Action     │  Background: --bg-elevated
│                      │  Border: 1px --border-default
│                      │  Color: --text-primary
└──────────────────────┘  Hover: Border --accent
```

**Ghost**
```
┌──────────────────────┐
│ Ghost Action         │  Background: transparent
│                      │  Color: --primary
│                      │  Border: none
└──────────────────────┘  Hover: Background --accent-soft
```

**Danger**
```
┌──────────────────────┐
│ Delete / Destructive │  Background: --danger
│                      │  Color: white
│                      │  Hover: opacity 90%
└──────────────────────┘
```

#### Tamaños
| Tamaño | Height | Padding | Font-size |
|--------|--------|---------|-----------|
| **sm** | 32px | 8px 12px | 13px |
| **md** | 40px | 10px 16px | 15px |
| **lg** | 48px | 12px 24px | 16px |

### 4.3 Badges y Pills

#### Level Badges
```
┌─────────┐
│ Level 1 │  Background: rgba(61, 220, 151, 0.15)
│         │  Color: #3ddc97
└─────────┘  Border-radius: 12px
             Padding: 4px 10px
```

#### Status Badges
| Status | Background | Color | Uso |
|--------|-----------|-------|-----|
| Success | `rgba(61, 220, 151, 0.15)` | `#3ddc97` | Completado ✓ |
| Warning | `rgba(255, 180, 84, 0.15)` | `#ffb454` | En progreso |
| Error | `rgba(255, 107, 107, 0.15)` | `#ff6b6b` | Error |
| Info | `rgba(94, 184, 255, 0.15)` | `#5eb8ff` | Información |

#### Pills (Tags)
```
┌──────────────────┐
│ Tema              │ Background: --bg-elevated
│                   │ Border: 1px --border-default
│ ✕ (close action)  │ Padding: 6px 12px
└──────────────────┘ Border-radius: 16px
                     Font-size: 13px
```

### 4.4 Sombras y Elevación

| Nivel | Box-shadow | Elevación | Uso |
|-------|-----------|-----------|-----|
| **sm** | `0 1px 2px rgba(0,0,0,0.3)` | 1px up | Subtle, inactive |
| **base** | `0 4px 12px rgba(0,0,0,0.4)` | 4px up | Cards, standard |
| **lg** | `0 12px 32px rgba(0,0,0,0.5)` | 8px up | Modals, dropdowns |
| **xl** | `0 20px 48px rgba(0,0,0,0.6)` | 16px up | Notifications, popovers |

### 4.5 Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | 4px | Pequeños elementos, inputs |
| `--radius` | 8px | Cards estándar, buttons |
| `--radius-lg` | 12px | Grandes cards, badges |
| `--radius-xl` | 16px | Modals, hero sections |

---

## 5. TOKEN DESIGN SYSTEM

### 5.1 CSS Custom Properties (Variables)

```css
:root {
  /* ===== BACKGROUNDS ===== */
  --bg-base:        #0d0d0d;
  --bg-surface:     #1a1a1a;
  --bg-elevated:    #262626;
  --bg-overlay:     #1c2433;
  --bg-hover:       #1f2937;

  /* ===== BORDERS ===== */
  --border-subtle:  #2d3748;
  --border-default: #3a3a3a;
  --border-strong:  #3b4759;

  /* ===== TEXT ===== */
  --text-primary:   #e6edf3;
  --text-secondary: #9aa7b8;
  --text-muted:     #7a8a9e;
  --text-disabled:  #4a5566;

  /* ===== ACENTOS ===== */
  --accent:         #ff7a59;
  --accent-hover:   #ff9073;
  --accent-soft:    rgba(255, 122, 89, 0.12);
  --accent-cyan:    #5eb8ff;
  --accent-magenta: #d084fc;
  --primary:        #5eb8ff;

  /* ===== SEMANTIC COLORS ===== */
  --success:        #3ddc97;
  --warning:        #ffb454;
  --danger:         #ff6b6b;

  /* ===== LEVELS ===== */
  --level-1: #3ddc97;   /* Verde */
  --level-2: #5eb8ff;   /* Azul */
  --level-3: #d084fc;   /* Púrpura */
  --level-4: #ff7a59;   /* Orange */
  --level-5: #ec4899;   /* Rosa */
  --level-6: #dc2626;   /* Rojo */

  /* ===== SPACING ===== */
  --sp-1: 0.25rem;   /* 4px */
  --sp-2: 0.5rem;    /* 8px */
  --sp-3: 0.75rem;   /* 12px */
  --sp-4: 1rem;      /* 16px */
  --sp-5: 1.25rem;   /* 20px */
  --sp-6: 1.5rem;    /* 24px */
  --sp-8: 2rem;      /* 32px */
  --sp-10: 2.5rem;   /* 40px */
  --sp-12: 3rem;     /* 48px */

  /* ===== BORDER RADIUS ===== */
  --radius-sm: 4px;
  --radius:    8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* ===== SHADOWS ===== */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow:    0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 48px rgba(0, 0, 0, 0.6);

  /* ===== TYPOGRAPHY ===== */
  --font-display: 'IBM Plex Sans', system-ui, sans-serif;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', 'JetBrains Mono', monospace;

  /* ===== TRANSITIONS ===== */
  --transition-fast: 0.15s ease;
  --transition:      0.25s ease;
  --transition-slow: 0.35s ease;

  /* ===== LAYOUT ===== */
  --sidebar-width: 280px;
  --topbar-height: 64px;
  --max-content: 1400px;
}
```

### 5.2 Light Mode (Extensión de Variables)

```css
[data-theme="light"] {
  /* BACKGROUNDS */
  --bg-base:        #ffffff;
  --bg-surface:     #f5f5f5;
  --bg-elevated:    #ebebeb;
  --bg-overlay:     #f0f4f8;
  --bg-hover:       #e8ecf1;

  /* BORDERS */
  --border-subtle:  #e0e4eb;
  --border-default: #d1d5db;
  --border-strong:  #a8afbe;

  /* TEXT */
  --text-primary:   #0f0f0f;
  --text-secondary: #5a6270;
  --text-muted:     #777d89;
  --text-disabled:  #ababab;

  /* SHADOWS (más suaves en light) */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow:    0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.12);
}
```

---

## 6. MOCKUPS VISUALES (ASCII Art)

### 6.1 Dashboard Dark Mode

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌──────────────┐  ┌─────────────────────────────────────────┐    │
│  │ 🎓 Claude    │  │  Claude Code Mastery                    │    │
│  │   Code       │  │  Guía Interactiva                       │    │
│  │              │  └─────────────────────────────────────────┘    │
│  │ Mastery      │                                                  │
│  │ Guide        │  ┌─ Card Level 1 ──────────────────────────┐    │
│  └──────────────┘  │                                          │    │
│                    │ 🚀 Primeros Pasos                   ✓   │    │
│  ┌──────────────┐  │                                          │    │
│  │ Inicio       │  │ Aprende a instalar y configurar        │    │
│  │ ▣ Dashboard  │  │ Claude Code en tu máquina.             │    │
│  │ 🎓 Curso     │  │                                          │    │
│  │              │  │ [Ir al Capítulo →]                     │    │
│  │ Nivel 1      │  └──────────────────────────────────────────┘    │
│  │ ⚙️ Install   │                                                  │
│  │ 🚀 Primeros  │  ┌─ Card Level 2 ──────────────────────────┐    │
│  │ 📝 CLAUDE.md │  │                                          │    │
│  │              │  │ 📋 Git Workflows Reales         →      │    │
│  │ Nivel 2      │  │                                          │    │
│  │ 🌿 Branching │  │ Domina flujos profesionales de Git      │    │
│  │ 📋 Rules     │  │                                          │    │
│  │              │  └──────────────────────────────────────────┘    │
│  │ Nivel 3      │                                                  │
│  │ 🔗 MCPs      │                                                  │
│  └──────────────┘  ┌─ Card Level 3 ──────────────────────────┐    │
│                    │                                          │    │
│                    │ 🔧 MCP Setup & Advanced         ★★★    │    │
│                    │                                          │    │
│                    │ Construye MCPs profesionales            │    │
│                    │                                          │    │
│                    └──────────────────────────────────────────┘    │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 6.2 Card States

```
CARD DEFAULT:                CARD HOVER:
┌────────────────────┐      ┌────────────────────┐
│ Title             │       │ Title             │ ↑ 2px
│                    │       │                    │
│ Content text...   │       │ Content text...   │ Shadow: lg
└────────────────────┘      └────────────────────┘
Shadow: md                   Transform: translateY(-2px)
Border: 1px #3a3a3a         Border: 1px #ff7a59
```

### 6.3 Button States

```
PRIMARY:
DEFAULT: ┌─────────────┐   HOVER: ┌─────────────┐   ACTIVE: ┌─────────────┐
         │ Primary CTA │          │ Primary CTA │            │ Primary CTA │
         │ #ff7a59     │          │ #ff9073     │            │ #ff7a59     │
         └─────────────┘          └─────────────┘            └─────────────┘
                                  Shadow: +2px              Scale: 0.98

SECONDARY:
DEFAULT: ┌─────────────┐   HOVER: ┌─────────────┐
         │ Secondary   │          │ Secondary   │
         │ Border: #3a │          │ Border: #ff │
         └─────────────┘          └─────────────┘
         Background: #262626      Background: #1f2937
```

### 6.4 Level Badges

```
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Lv 1    │  │ Lv 2    │  │ Lv 3    │  │ Lv 4    │  │ Lv 5    │  │ Lv 6    │
│ Beginner│  │ Advanced│  │ Expert  │  │ Engineer│  │ Master  │  │ Elite   │
└─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘
  #3ddc97     #5eb8ff     #d084fc     #ff7a59     #ec4899     #dc2626
  Verde       Azul        Púrpura     Orange      Rosa        Rojo
```

---

## 7. GUÍA DE IMPLEMENTACIÓN

### 7.1 Cambiar a Light Mode

Para activar el light mode en el HTML:
```html
<html data-theme="light">
  <!-- Contenido -->
</html>
```

O dinámicamente:
```javascript
document.documentElement.setAttribute('data-theme', 'light');
```

### 7.2 Crear Componente Personalizado

**Ejemplo: Nueva Card Component**
```css
.card-custom {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius);
  padding: var(--sp-6);
  box-shadow: var(--shadow);
  transition: all var(--transition);
}

.card-custom:hover {
  background: var(--bg-hover);
  border-color: var(--accent);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-custom__title {
  font-family: var(--font-sans);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-primary);
  margin-bottom: var(--sp-4);
}

.card-custom__content {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
}
```

### 7.3 Accesibilidad

- **Contraste mínimo**: 4.5:1 para texto normal, 3:1 para texto grande
- **Focus visible**: Siempre visible con outline
- **Color no es el único indicador**: Usar íconos + color
- **Dark mode**: Respetar `prefers-color-scheme` media query

---

## 8. REFERENCIA RÁPIDA

### Colores Más Usados

| Elemento | Color | Hex |
|----------|-------|-----|
| Fondos principales | `--bg-surface` | `#1a1a1a` |
| Texto principal | `--text-primary` | `#e6edf3` |
| Acciones destacadas | `--accent` | `#ff7a59` |
| Links secundarios | `--primary` | `#5eb8ff` |
| Success messages | `--success` | `#3ddc97` |
| Error messages | `--danger` | `#ff6b6b` |

### Espaciado Estándar

- **Padding cards**: `var(--sp-6)` (24px)
- **Margin entre secciones**: `var(--sp-8)` (32px)
- **Gap entre items**: `var(--sp-4)` (16px)
- **Border radius**: `var(--radius)` (8px)

### Tipografía Rápida

- **Títulos**: `font-weight: 600` o `700`
- **Body**: `font-weight: 400`, `line-height: 1.6`
- **Código**: Usar `--font-mono`, `14px`, `#5eb8ff`

---

## 9. EXTENSIONES FUTURAS

1. **Temas adicionales**: Sepia, High Contrast
2. **Animaciones**: Skeleton loading, transitions suaves
3. **Iconografía**: Sistema propio de 100+ iconos
4. **Componentes avanzados**: Data tables, charts, video embeds
5. **Dark mode automático**: Detectar preferencia del SO

---

**Versión**: 1.0  
**Última actualización**: 2026-05-21  
**Autor**: Design System Team
