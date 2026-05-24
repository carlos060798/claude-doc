# Resumen: Plantilla HTML Reutilizable para Contenido .md

## Objetivo

Definir un **sistema escalable y consistente** para convertir contenido Markdown (.md) a HTML integrado en `index.html`, permitiendo que cualquier sección de módulo se adapte sin rediseñar layouts ni escribir CSS adicional.

---

## Entregables (4 Documentos Creados)

### 1. **PLANTILLA_CONTENIDO_MD.html** (Principal)
- Estructura HTML base reutilizable
- 14 secciones detalladas con ejemplos
- Clases CSS semánticas y sus usos
- Atributos data-* críticos
- Tabla de referencia completa

**Uso:** Documento de referencia durante la conversión .md → HTML

### 2. **EJEMPLO_SECCIONES_CONVERTIDAS.md** (Implementación Real)
- Conversión **completa y lista para copiar** de 2 secciones:
  - Nivel 5 - Troubleshooting Avanzado (1,200 líneas)
  - Nivel 5 - Cost Forecasting y ROI (1,000 líneas)
- Cada ejemplo muestra:
  - Estructura HTML final
  - Bloques de contenido variados
  - Integración exacta en index.html

**Uso:** Copy-paste directo al integrar nuevas secciones

### 3. **GUIA_RAPIDA_INTEGRACION.md** (Checklist)
- Flujo paso a paso (6 pasos)
- Mapeo rápido: .md → clases HTML
- Template mínimos para copiar/pegar
- Validación HTML (herramientas)
- Troubleshooting común

**Uso:** Referencia rápida durante implementación

### 4. **ESTRUCTURA_VISUAL_COMPONENTES.md** (Documentación Técnica)
- Diagrama ASCII de jerarquía visual
- Árbol HTML completo
- Mapa de colores y clases CSS
- Responsive breakpoints
- Tokens de espaciado y tipografía

**Uso:** Comprensión profunda de la arquitectura

---

## Arquitectura Base: 7 Tipos de Componentes

| # | Componente | Clase CSS | Cuando Usarlo |
|---|-----------|-----------|--------------|
| 1 | **Header Sección** | `.section-header` | Inicio de cada sección (breadcrumb + h2 + lead) |
| 2 | **Bloque Contenido** | `.block-title` (h3) | Cada subtítulo principal con emoji |
| 3 | **Código** | `.code-block` | Comandos, ejemplos, bloques pre/code |
| 4 | **Cajas Destacadas** | `.highlight-box` / `.warning` / `.notas-css` | Tips, advertencias, información |
| 5 | **Matriz 3 Columnas** | `.grid-3col` | Decisiones, opciones, casos |
| 6 | **Comparativa 2 Columnas** | `.grid-2col` | Problema/solución, antes/después |
| 7 | **Tabla** | `<table>` estándar | Datos tabulares, referencias |

### Estructura Mínima de Sección

```html
<section class="content-section" data-section="NIVEL-MODULO" data-mode="technical">
    
    <div class="section-header">
        <span class="breadcrumb">Nivel X / Nombre</span>
        <h2>EMOJI Título Principal</h2>
        <p class="section-lead">Descripción intro (1-2 líneas)</p>
    </div>

    <!-- BLOQUES DE CONTENIDO (repetir según necesidad) -->
    <h3 class="block-title">EMOJI Subtítulo</h3>
    <p>Párrafo...</p>
    <!-- + listas, código, cajas, tablas, grids, etc. -->

</section>
```

---

## Clases CSS Reutilizables (Definidas en styles.css)

```
NOMBRE              ELEMENTO    PROPIEDADES CLAVE
──────────────────────────────────────────────────────
content-section     <section>   display: block/none; padding: 3rem 2.5rem
section-header      <div>       margin-bottom: 2rem
section-lead        <p>         font-size: 1.125rem; color: secondary
block-title         <h3>        border-left: 3px #ff7a59; color: #d084fc
code-block          <div>       background: #1a1a1a; border-left: 3px #ff7a59
highlight-box       <div>       background: rgba(255,122,89,0.1); border-left: 4px
warning             <div>       background: rgba(255,180,84,0.1); border-left: 4px
notas-css           <div>       background: rgba(61,220,151,0.1); border-left: 4px
bullet-list         <ul>        margin-left: 24px; color: secondary
step-list           <ol>        margin-left: 24px; color: secondary
grid-3col           <div>       display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
grid-2col           <div>       display: grid; grid-template-columns: 1fr 1fr
```

**NO hay CSS adicional necesario.** Todo está ya definido en `styles.css`.

---

## Atributos data-* Críticos

```
ATRIBUTO         VALORES VÁLIDOS                    UBICACIÓN           PROPÓSITO
───────────────────────────────────────────────────────────────────────────────
data-section     "nivel-X-modulo-Y"                <section>           ID único para nav
data-mode        "technical"|"accessible"|"both"   <section>           Filtra por modo
data-lang        "bash"|"python"|"js"|"json"|"text"<div.code-block>    Lenguaje código
data-title       "Terminal"|"Código"|"Salida"|etc  <div.code-block>    Etiqueta visible
```

---

## Flujo de Conversión: 5 Pasos

```
1. Leer .md          →  Identificar estructura (h2, h3, listas, código, tablas)
2. Estructurar HTML  →  Crear <section> con .section-header + bloques
3. Mapear elementos  →  Usar tabla de referencia para clases CSS
4. Validar           →  Verificar checklist (data-section, clases, estructura)
5. Integrar          →  Copiar en index.html, probar en navegador
```

**Tiempo estimado:** 40 min/sección de 2,000 palabras

---

## Ejemplo Concreto: Antes y Después

### ANTES (.md)

```markdown
## 2. Troubleshooting Avanzado

### Metodología de Diagnóstico

Todo problema tiene un patrón. La mayoría de errores caen en 5 categorías:
- Token budget agotado
- MCP connectivity
- Memory issues
- Permission errors
- Performance degradation

### Comando: /context

Ejecuta cada hora en sesiones largas:

```bash
$ claude /context
┌─────────────────────────────────────────┐
│ Context Usage                           │
│ Tokens Usados: 124,850 / 200,000       │
│ % Utilización: 62.4% (SEGURO)          │
└─────────────────────────────────────────┘
```

**💡 Pro Tip:** Si > 85%, ejecuta `/compact "preserva últimas 5 mensajes"`
```

### DESPUÉS (HTML)

```html
<section class="content-section" data-section="nivel-5-troubleshooting" data-mode="technical">
    
    <div class="section-header">
        <span class="breadcrumb">Nivel 5 / Troubleshooting</span>
        <h2>🔧 Troubleshooting Avanzado</h2>
        <p class="section-lead">
            Herramientas sistemáticas y flujos de diagnóstico para resolver
            problemas complejos en Claude Code.
        </p>
    </div>

    <h3 class="block-title">🎯 Metodología de Diagnóstico</h3>
    <p>
        Todo problema tiene un patrón. La mayoría de errores caen en 5 categorías:
    </p>
    <ul class="bullet-list">
        <li>Token budget agotado</li>
        <li>MCP connectivity</li>
        <li>Memory issues</li>
        <li>Permission errors</li>
        <li>Performance degradation</li>
    </ul>

    <h3 class="block-title">⚡ Comando: /context</h3>
    <p>Ejecuta cada hora en sesiones largas:</p>
    <div class="code-block" data-lang="bash" data-title="Terminal">
        <pre><code>$ claude /context
┌─────────────────────────────────────────┐
│ Context Usage                           │
│ Tokens Usados: 124,850 / 200,000       │
│ % Utilización: 62.4% (SEGURO)          │
└─────────────────────────────────────────┘</code></pre>
    </div>

    <div class="highlight-box">
        💡 <strong>Pro Tip:</strong> Si > 85%, ejecuta
        <code>/compact "preserva últimas 5 mensajes"</code>
    </div>

</section>
```

---

## Validación Post-Integración

### Checklist Técnico

- [ ] `data-section="nivel-X-modulo-Y"` está en sidebar nav
- [ ] Cada `<h3>` principal tiene `class="block-title"`
- [ ] Cada `<div class="code-block">` tiene `data-lang` y `data-title`
- [ ] `<table>` tiene `<thead>` con `<th>` y `<tbody>` con `<td>`
- [ ] Listas tienen `class="bullet-list"` o `class="step-list"`
- [ ] Cajas usan: `.highlight-box`, `.warning`, `.notas-css`
- [ ] Grids usan: `.grid-3col` o `.grid-2col`
- [ ] No hay `<style>` o `<script>` embebidos

### Checklist en Navegador

- [ ] Clico en sidebar: aparece la sección correcta
- [ ] Borde izquierdo naranja en h3 ✓
- [ ] Código con fondo oscuro y borde izquierdo naranja ✓
- [ ] Cajas destacadas con colores correctos ✓
- [ ] Grid 3 columnas se colapsa a 1 en móvil ✓
- [ ] Tablas se ven bien en desktop (overflow en móvil ok) ✓

---

## Escalabilidad: Metrics

### Por Sección
- **Simple:** 15 min (h3 + párr + lista)
- **Medio:** 30 min (+ código + cajas)
- **Complejo:** 45-60 min (+ tabla + matriz)
- **Muy complejo:** 90-120 min (10+ bloques)

### Para 20 Secciones (Nivel 5 + 6 completo)
- Tiempo total: ~12-15 horas
- Personas: 1 developer + 1 review
- Entrega: 2-3 sprints (1-2 semanas)

### Sin Reducción de Diseño
- **Sin plantilla:** 2-3 horas/sección (rediseño + CSS)
- **Con plantilla:** 30-60 min/sección (solo contenido)
- **Ahorro:** 60-80% en tiempo de desarrollo

---

## Archivos de Referencia

```
ARCHIVO                              TAMAÑO    PROPÓSITO
──────────────────────────────────────────────────────────────────
PLANTILLA_CONTENIDO_MD.html          ~50 KB    Guía completa + ejemplos
EJEMPLO_SECCIONES_CONVERTIDAS.md     ~20 KB    2 ejemplos copy-paste
GUIA_RAPIDA_INTEGRACION.md          ~15 KB    Checklist + templates
ESTRUCTURA_VISUAL_COMPONENTES.md    ~15 KB    Diagramas + CSS specs
RESUMEN_PLANTILLA_REUTILIZABLE.md   ~8 KB     Este archivo
```

**Ubicación:** Todos en `C:\Users\usuario\claude doc\`

---

## Próximos Pasos

### Fase 1: Validación (1-2 horas)
1. Abrir EJEMPLO_SECCIONES_CONVERTIDAS.md
2. Copiar sección "Troubleshooting" a index.html (después de sección anterior)
3. Verificar en navegador que funciona
4. Revisar que sidebar nav hace click correcto

### Fase 2: Integración de 2 Secciones (3-4 horas)
1. Convertir nivel5-troubleshooting.md → HTML (usando plantilla)
2. Convertir nivel5-cost-forecasting.md → HTML
3. Ambas con todos los bloques (código, tablas, grids, cajas)
4. Validar en navegador + responsive

### Fase 3: Escalado a 20 Secciones (3-4 sprints)
1. Priorizar secciones por complejidad
2. Asignar 1-2 devs por semana
3. Usar GUIA_RAPIDA_INTEGRACION.md como checklist
4. Review antes de merge a main

---

## Conclusión

**Sistema completamente definido y listo para usar.**

Todo lo que necesitas:
✅ Estructura HTML reutilizable
✅ Clases CSS semánticas (sin CSS nuevo)
✅ 7 tipos de componentes (cobertura completa)
✅ 2 ejemplos concretos (copy-paste)
✅ Guía rápida de 5 pasos
✅ Checklists de validación
✅ Documentación técnica completa

**No hay sorpresas.** Solo implementa siguiendo la plantilla.
