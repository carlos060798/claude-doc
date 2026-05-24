# Estructura Visual y Técnica de Componentes

## 1. Jerarquía Visual Completa

```
┌─────────────────────────────────────────────────────────────────────┐
│                          NAVEGACIÓN (Sidebar)                       │
│  Nivel 5: Líder Técnico                                             │
│  ├─ 🔧 Troubleshooting                                              │
│  ├─ 💰 Cost Forecasting                                             │
│  └─ [otros 6 módulos...]                                             │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │ section-header                                               │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ breadcrumb (Nivel 5 / Troubleshooting)                │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ h2                                                     │  │  │
│   │ │ 🔧 Troubleshooting Avanzado                           │  │  │
│   │ │ ─────────────────────────────────────────────────────  │  │  │
│   │ │ (borde naranja debajo)                                │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ section-lead (color secondary, fs-lg)                 │  │  │
│   │ │ Herramientas sistemáticas y flujos de diagnóstico...  │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │ BLOQUE 1: Metodología                                       │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ h3.block-title                                         │  │  │
│   │ │ │ 🎯 Metodología de Diagnóstico                       │  │  │
│   │ │ │──────────────────────────────                        │  │  │
│   │ │ (borde izq naranja, color #d084fc)                     │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ p (párrafo normal)                                     │  │  │
│   │ │ Todo problema tiene un patrón reconocible...          │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ ul.bullet-list                                         │  │  │
│   │ │ • Token budget agotado                                │  │  │
│   │ │ • MCP connectivity                                     │  │  │
│   │ │ • Memory issues                                        │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │ BLOQUE 2: Código                                           │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ h3.block-title                                         │  │  │
│   │ │ ⚡ Comando Esencial: /context                          │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ div.code-block (fondo #1a1a1a, borde izq naranja)    │  │  │
│   │ │ [Terminal]                                             │  │  │
│   │ │ ──────────────────────────────────────────────────────  │  │  │
│   │ │ $ claude /context                                      │  │  │
│   │ │ ┌───────────────────────────────────────────────┐     │  │  │
│   │ │ │ Context Usage (Sesión: debug-api)            │     │  │  │
│   │ │ │ Tokens Usados: 124,850 / 200,000             │     │  │  │
│   │ │ │ % Utilización: 62.4% (SEGURO)                │     │  │  │
│   │ │ └───────────────────────────────────────────────┘     │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ div.highlight-box (fondo naranja 10%, borde naranja)  │  │  │
│   │ │ 💡 Pro Tip: Si utilización > 85%, ejecuta /compact... │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │ BLOQUE 3: Matriz de Decisión (3 columnas)                  │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ h3.block-title                                         │  │  │
│   │ │ 📊 Matriz: 5 Problemas Principales                    │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   │                                                                │  │
│   │ ┌──────────────────┬──────────────────┬──────────────────┐  │  │
│   │ │ div.grid-3col    │                  │                  │  │  │
│   │ │                  │                  │                  │  │  │
│   │ │ h4               │ h4               │ h4               │  │  │
│   │ │ 📦 Token Budget  │ 🔗 MCP Falla     │ 🚨 Permisos      │  │  │
│   │ │                  │                  │                  │  │  │
│   │ │ p (Síntoma)      │ p (Síntoma)      │ p (Síntoma)      │  │  │
│   │ │ Síntoma: ...     │ Síntoma: ...     │ Síntoma: ...     │  │  │
│   │ │                  │                  │                  │  │  │
│   │ │ ol               │ ol               │ ol               │  │  │
│   │ │ 1. Solución      │ 1. Solución      │ 1. Solución      │  │  │
│   │ │ 2. ...           │ 2. ...           │ 2. ...           │  │  │
│   │ │                  │                  │                  │  │  │
│   │ └──────────────────┴──────────────────┴──────────────────┘  │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │ BLOQUE 4: Tabla Comparativa                                │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ h3.block-title                                         │  │  │
│   │ │ 📋 Tabla: Comandos de Diagnóstico                     │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ table (fondo #262626 en thead)                         │  │  │
│   │ │ ┌──────────┬────────────┬────────────┬──────────────┐ │  │  │
│   │ │ │ Comando  │ Cuándo     │ Output     │ Si falla     │ │  │  │
│   │ │ ├──────────┼────────────┼────────────┼──────────────┤ │  │  │
│   │ │ │ /context │ Cada 1-2h  │ % tokens   │ Si > 90%     │ │  │  │
│   │ │ │ /memory  │ Para verif │ Contenido  │ Si vacío     │ │  │  │
│   │ │ └──────────┴────────────┴────────────┴──────────────┘ │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │ BLOQUE 5: Cajas Destacadas Variadas                         │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ div.warning (fondo amarillo 10%, borde izq amarillo)  │  │  │
│   │ │ ⚠️ Cuidado: No comprimas contexto si tienes tokens... │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   │ ┌────────────────────────────────────────────────────────┐  │  │
│   │ │ div.notas-css (fondo verde 10%, borde izq verde)     │  │  │
│   │ │ ℹ️ Información: Este comando solo funciona si...      │  │  │
│   │ └────────────────────────────────────────────────────────┘  │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Árbol HTML Completo

```
<section class="content-section" data-section="..." data-mode="technical">

    <!-- HEADER (Fijo, común a todas secciones) -->
    <div class="section-header">
        <span class="breadcrumb">Nivel X / Nombre</span>
        <h2>EMOJI Título Principal</h2>
        <p class="section-lead">Descripción...</p>
    </div>

    <!-- CONTENIDO (Variable por módulo) -->

    <!-- BLOQUE TIPO A: Introducción + lista -->
    <h3 class="block-title">EMOJI Subtítulo</h3>
    <p>Párrafo...</p>
    <ul class="bullet-list">
        <li>Item 1</li>
        <li>Item 2</li>
    </ul>

    <!-- BLOQUE TIPO B: Pasos -->
    <h3 class="block-title">EMOJI Pasos</h3>
    <ol class="step-list">
        <li><strong>Paso 1:</strong> Descripción</li>
        <li><strong>Paso 2:</strong> Descripción</li>
    </ol>

    <!-- BLOQUE TIPO C: Código -->
    <h3 class="block-title">EMOJI Comando</h3>
    <div class="code-block" data-lang="bash" data-title="Terminal">
        <pre><code>$ comando</code></pre>
    </div>

    <!-- BLOQUE TIPO D: Cajas destacadas -->
    <div class="highlight-box">💡 <strong>Tip:</strong> ...</div>
    <div class="warning">⚠️ <strong>Cuidado:</strong> ...</div>
    <div class="notas-css">ℹ️ <strong>Info:</strong> ...</div>

    <!-- BLOQUE TIPO E: Matriz 3 columnas -->
    <h3 class="block-title">EMOJI Matriz</h3>
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

    <!-- BLOQUE TIPO F: Comparativa 2 columnas -->
    <h3 class="block-title">EMOJI Comparativa</h3>
    <div class="grid-2col">
        <div>
            <h4>Lado A</h4>
            <div class="code-block" data-lang="text" data-title="Código">
                <pre><code>...</code></pre>
            </div>
        </div>
        <div>
            <h4>Lado B</h4>
            <div class="code-block" data-lang="text" data-title="Salida">
                <pre><code>...</code></pre>
            </div>
        </div>
    </div>

    <!-- BLOQUE TIPO G: Tabla -->
    <h3 class="block-title">EMOJI Tabla</h3>
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
                <td>Valor 1</td>
                <td>Valor 2</td>
                <td>Valor 3</td>
            </tr>
        </tbody>
    </table>

    <!-- BLOQUE TIPO H: Caso específico (anidado) -->
    <h3 class="block-title">EMOJI Casos Específicos</h3>
    <h4>Caso A: Descripción</h4>
    <div class="code-block" data-lang="bash" data-title="Procedimiento">
        <pre><code>1. Paso 1
2. Paso 2
3. Paso 3</code></pre>
    </div>

    <h4>Caso B: Descripción</h4>
    <p>Explicación...</p>
    <ul>
        <li>Sub-item</li>
    </ul>

</section>
```

---

## 3. Mapa de Colores y Clases

### Color Scheme Completo

```
┌─────────────────────────────────────────────────────────┐
│ VARIABLE CSS          │ VALOR       │ USO               │
├─────────────────────────────────────────────────────────┤
│ --accent              │ #ff7a59     │ Borde h3 izq      │
│ --accent-cyan         │ #5eb8ff     │ h2, enlace        │
│ --accent-magenta      │ #d084fc     │ h3 color          │
│ --accent-orange       │ #ff7a59     │ h2 borde abajo    │
│ --bg-surface          │ #1a1a1a     │ Code block fondo  │
│ --bg-elevated         │ #262626     │ Tabla thead fondo │
│ --text-primary        │ #e6edf3     │ Texto normal      │
│ --text-secondary      │ #9aa7b8     │ Párrafos, muted   │
│ --text-muted          │ #7a8a9e     │ Breadcrumb        │
│ --border-default      │ #3a3a3a     │ Tabla bordes      │
│ --success             │ #3ddc97     │ Verde (info)      │
│ --warning             │ #ffb454     │ Amarillo (aviso)  │
└─────────────────────────────────────────────────────────┘
```

### Clases CSS → Elemento HTML

```
┌────────────────────────────────────────────────────────────────────┐
│ CLASE CSS              │ APLICA A     │ PROPIEDADES                 │
├────────────────────────────────────────────────────────────────────┤
│ content-section        │ <section>    │ display: block/none; padding │
│ section-header         │ <div>        │ margin-bottom: 2rem         │
│ breadcrumb             │ <span>       │ font-size: 0.75rem; uppercase │
│ block-title            │ <h3>         │ border-left: 3px #ff7a59;   │
│                        │              │ padding-left: 1rem          │
│ section-lead           │ <p>          │ font-size: 1.125rem; color: secondary │
│ code-block             │ <div>        │ background: #1a1a1a;        │
│                        │              │ border-left: 3px #ff7a59    │
│ highlight-box          │ <div>        │ background: rgba(255,122,89,0.1) │
│                        │              │ border-left: 4px #ff7a59    │
│ warning                │ <div>        │ background: rgba(255,180,84,0.1) │
│                        │              │ border-left: 4px #ffb454    │
│ notas-css              │ <div>        │ background: rgba(61,220,151,0.1) │
│                        │              │ border-left: 4px #3ddc97    │
│ bullet-list            │ <ul>         │ margin-left: 24px           │
│ step-list              │ <ol>         │ margin-left: 24px           │
│ grid-3col              │ <div>        │ grid-template-columns:      │
│                        │              │ repeat(auto-fit, minmax(300px, 1fr)) │
│ grid-2col              │ <div>        │ grid-template-columns: 1fr 1fr │
│ decision-card          │ <div>        │ (dentro de grid-3col)       │
└────────────────────────────────────────────────────────────────────┘
```

---

## 4. Ancho y Responsive

```
┌──────────────────────────────────────────────────────┐
│                DESKTOP (1200px+)                     │
│ ┌──────────────────────────────────────────────────┐│
│ │ Sidebar: 280px                                   ││
│ │ Main:    Fluido (máx 900px + padding)           ││
│ │                                                  ││
│ │ Grid 3 columnas: 300px each (con gap 20px)     ││
│ │ Grid 2 columnas: 50% each                       ││
│ └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│              TABLET (768px - 1024px)                 │
│ ┌──────────────────────────────────────────────────┐│
│ │ Sidebar: Colapsado / Off-canvas                 ││
│ │ Main:    Fluido 100%                            ││
│ │                                                  ││
│ │ Grid 3 columnas: → 2 columnas (responsive)      ││
│ │ Grid 2 columnas: → Stack si < 600px             ││
│ └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│               MOBILE (< 768px)                       │
│ ┌──────────────────────────────────────────────────┐│
│ │ Sidebar: Hamburger menu                         ││
│ │ Main:    100% ancho, padding reducido           ││
│ │                                                  ││
│ │ Grid 3 columnas: → 1 columna (stack)            ││
│ │ Grid 2 columnas: → 1 columna (stack)            ││
│ │ Tablas:          → overflow-x: auto             ││
│ └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

---

## 5. Tokens (Espaciado)

```
CSS Variable      Valor    Contexto
──────────────────────────────────────────────────
--sp-1           0.25rem   Micro separaciones
--sp-2           0.5rem    Separación pequeña
--sp-3           0.75rem   Padding botones
--sp-4           1rem      Padding normal
--sp-5           1.25rem   Separación secciones
--sp-6           1.5rem    Margen bloques
--sp-8           2rem      Margen secciones grandes
--sp-10          2.5rem    Padding sección
--sp-12          3rem      Padding sección grande

Ejemplo uso:
.highlight-box {
    padding: var(--sp-4);      /* 1rem */
    margin: var(--sp-6) 0;     /* 1.5rem top/bottom */
    border-left: 4px solid #ff7a59;
}
```

---

## 6. Tipografía Jerárquica

```
┌─────────────────────────────────────────────────────┐
│ ELEMENTO     │ TAMAÑO  │ PESO  │ FAMILIA          │
├─────────────────────────────────────────────────────┤
│ h2           │ 30px    │ 800   │ IBM Plex Sans    │
│ h3           │ 21px    │ 700   │ IBM Plex Sans    │
│ h4           │ 18px    │ 600   │ IBM Plex Sans    │
│ section-lead │ 18px    │ 400   │ Inter            │
│ p normal     │ 15px    │ 400   │ Inter            │
│ code inline  │ 15px    │ 400   │ Fira Code        │
│ pre/code     │ 13.5px  │ 400   │ Fira Code        │
│ breadcrumb   │ 12px    │ 600   │ Inter (uppercase)│
└─────────────────────────────────────────────────────┘
```

---

## 7. Transiciones y Animaciones

```
Animación              Duración    Easing
────────────────────────────────────────────────
fadeIn                 0.25s       ease
slideInDown            0.5s        ease-out
slideInLeft            0.5s        ease-out
contentEnter           0.5s        cubic-bezier(0.34, 1.56, 0.64, 1)
subtleGlow (box-shadow)0.6s        ease-in-out

Ejemplo:
.section-header h2 {
    animation: slideInDown 0.6s cubic-bezier(...);
}

.highlight-box:hover {
    box-shadow: 0 0 12px rgba(255, 122, 89, 0.15);
    transition: box-shadow 0.25s ease;
}
```

---

## 8. Especificidad CSS (Cascada)

```
Orden de aplicación (de menor a mayor especificidad):

1. Reset global (body, *, *)
2. Tags (p, ul, table)
3. Classes (.content-section, .block-title)
4. Pseudo-elementos (:hover, ::before)
5. Inline styles (raro, evitar)

Ejemplo:
<p>Normal</p>                    /* 15px font-size de body */
<p class="section-lead">Lead</p> /* 18px font-size de .section-lead */

Las clases SIEMPRE sobrescriben tags.
```

---

## 9. Estructura de Carpetas (Referencia)

```
C:\Users\usuario\claude doc\
├── index.html                          ← Archivo principal
├── styles.css                          ← Estilos globales
├── script.js                           ← Lógica de navegación
│
├── PLANTILLA_CONTENIDO_MD.html        ← Guía HTML (este archivo)
├── EJEMPLO_SECCIONES_CONVERTIDAS.md   ← 2 ejemplos concretos
├── GUIA_RAPIDA_INTEGRACION.md         ← Checklist rápido
├── ESTRUCTURA_VISUAL_COMPONENTES.md   ← Este archivo
│
├── *.md                               ← Contenido .md fuente
│   ├── nivel5-troubleshooting.md
│   ├── nivel5-cost-forecasting.md
│   └── ...
│
└── .claude/
    └── CLAUDE.md                      ← Memoria del proyecto
```

---

## 10. Validación de Estructura (Checklist Técnico)

```html
<!-- Verificar que esta estructura esté presente: -->

✅ DOCTYPE html
✅ <meta charset="UTF-8">
✅ <meta name="viewport" content="width=device-width, initial-scale=1.0">
✅ <link rel="stylesheet" href="styles.css">
✅ <body>
✅ <div class="app-shell">
✅ <aside class="sidebar">
✅ <nav>
✅ <main class="main-content">
✅ <header class="topbar">
✅ <section class="content-section" data-section="...">
✅ <div class="section-header">
✅ </main>
✅ </body>
✅ <script src="script.js"></script>
```

Sin esta estructura, el CSS y JavaScript no funcionarán correctamente.
