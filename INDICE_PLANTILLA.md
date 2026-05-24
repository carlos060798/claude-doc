# Índice de Documentación: Plantilla HTML Reutilizable

## Inicio Rápido (5 minutos)

Si tienes 5 minutos:
1. Lee: **RESUMEN_PLANTILLA_REUTILIZABLE.md**
2. Mira: **ESTRUCTURA_VISUAL_COMPONENTES.md** (sección 1: diagrama visual)
3. Listo: Ya sabes cómo funciona

---

## Implementación (30-60 minutos por sección)

### Paso 1: Copiar un ejemplo funcional
- Abre: **EJEMPLO_SECCIONES_CONVERTIDAS.md**
- Busca: "Sección 1: Nivel 5 - Troubleshooting Avanzado"
- Copia: Todo el bloque HTML `<section>...</section>`
- Pega en: `index.html` antes de `</main>`

### Paso 2: Cambiar el data-section
- En el HTML pegado, busca: `data-section="nivel-5-troubleshooting"`
- Reemplaza con tu nombre: `data-section="Tu-Seccion-Aqui"`
- Debe coincidir con el link en sidebar nav

### Paso 3: Verificar en navegador
- Abre: `index.html` en navegador
- Haz clic en tu sección en la barra lateral
- Debe mostrar la sección nueva

**Listo.** Ya integraste tu primera sección.

---

## Documentos Creados

### 1. RESUMEN_PLANTILLA_REUTILIZABLE.md
**Propósito:** Resumen ejecutivo de toda la plantilla
**Tamaño:** ~8 KB
**Contiene:**
- Objetivo y arquitectura base
- 7 tipos de componentes
- Flujo de conversión (5 pasos)
- Ejemplo antes/después
- Checklist de validación
- Escalabilidad (métricas)

**Lee si:** Necesitas entender el overview en 10 minutos

---

### 2. PLANTILLA_CONTENIDO_MD.html (Principal)
**Propósito:** Referencia completa con 14 secciones detalladas
**Tamaño:** ~50 KB
**Contiene:**
- Estructura base reutilizable
- Código HTML con explicaciones
- Clases CSS y sus usos
- Atributos data-* críticos
- Tabla de referencia (21 clases CSS)
- Validación HTML

**Cómo usar:** Consultalo mientras escribes HTML. Busca el tipo de componente que necesitas, copia el ejemplo, adapta a tu contenido.

---

### 3. EJEMPLO_SECCIONES_CONVERTIDAS.md (Implementación Real)
**Propósito:** 2 ejemplos completos, listos para copiar/pegar
**Tamaño:** ~20 KB
**Contiene:**
- Sección 1: Troubleshooting Avanzado (1,200 líneas HTML)
- Sección 2: Cost Forecasting y ROI (1,000 líneas HTML)
- Cada una con bloques variados: código, tablas, grids, cajas
- Cómo integrar en index.html
- Checklist post-integración

**Cómo usar:** Abre, busca la sección que quieres, copia el bloque completo, pega en index.html

---

### 4. GUIA_RAPIDA_INTEGRACION.md (Checklist)
**Propósito:** Flujo paso a paso + templates mínimos + troubleshooting
**Tamaño:** ~15 KB
**Contiene:**
- Flujo de 6 pasos
- Tabla: mapeo .md → HTML
- Templates mínimos (copiar/pegar)
- Buscar y reemplazar regex (VS Code)
- Emojis por tipo
- Validadores HTML online
- Checklist final
- Troubleshooting común
- Estimador de tiempo

**Cómo usar:** Implementa rápido sin leer documentación completa. Sigue los 6 pasos, usa la tabla de mapeo.

---

### 5. ESTRUCTURA_VISUAL_COMPONENTES.md (Técnico)
**Propósito:** Diagramas ASCII, especificaciones CSS, responsive breakpoints
**Tamaño:** ~15 KB
**Contiene:**
- Diagrama ASCII de jerarquía visual (sección completa)
- Árbol HTML completo
- Mapa de colores y clases CSS
- Responsive (desktop, tablet, móvil)
- Tokens de espaciado
- Tipografía jerárquica
- Transiciones y animaciones
- Cascada CSS
- Validación técnica

**Cómo usar:** Consulta para entender la arquitectura profundamente. Para debugging CSS, ver "Cascada CSS".

---

## Matrix de Decisión: ¿Cuál Documento?

| Necesidad | Documento | Tiempo |
|-----------|-----------|--------|
| Entender el concepto rápido | RESUMEN_PLANTILLA | 5 min |
| Copiar un ejemplo funcional | EJEMPLO_SECCIONES | 10 min |
| Implementar mi sección | GUIA_RAPIDA_INTEGRACION | 30-60 min |
| Referencia mientras escribo | PLANTILLA_CONTENIDO_MD (navegador) | según sea |
| Entender CSS profundo | ESTRUCTURA_VISUAL_COMPONENTES | 15 min |
| Validación pre-integración | GUIA_RAPIDA_INTEGRACION (checklist) | 5 min |

---

## Flujo Recomendado para Nuevos Usuarios

```
1. Leer (15 min)
   - RESUMEN_PLANTILLA_REUTILIZABLE
   - ESTRUCTURA_VISUAL_COMPONENTES (sección 1)

2. Copiar (10 min)
   - EJEMPLO_SECCIONES_CONVERTIDAS
   - Copiar Sección 1: Troubleshooting a index.html

3. Verificar (5 min)
   - Abrir en navegador, clicar en sidebar

4. Implementar (30-60 min)
   - Leer tu archivo .md
   - Abrir PLANTILLA_CONTENIDO_MD (referencia)
   - Abrir GUIA_RAPIDA_INTEGRACION (checklist)
   - Escribir HTML

5. Validar (5 min)
   - GUIA_RAPIDA_INTEGRACION (checklist final)

6. Integrar (5 min)
   - Copiar sección HTML
   - Pegar en index.html
   - Verificar en navegador
```

**Tiempo total:** ~2 horas para tu primera sección
**Próximas secciones:** 30-60 min cada una

---

## Resumen de Archivos

```
ARCHIVO                              PROPÓSITO                    
──────────────────────────────────────────────────────────────────────────
PLANTILLA_CONTENIDO_MD.html          Referencia HTML completa     
EJEMPLO_SECCIONES_CONVERTIDAS.md     2 ejemplos copy-paste        
GUIA_RAPIDA_INTEGRACION.md          Checklist + templates        
ESTRUCTURA_VISUAL_COMPONENTES.md    Especificaciones técnicas     
RESUMEN_PLANTILLA_REUTILIZABLE.md   Resumen ejecutivo           
INDICE_PLANTILLA.md                 Índice navegable (este)      
```

Ubicación: `C:\Users\usuario\claude doc\`

---

## Próximo Paso

1. Abre: **EJEMPLO_SECCIONES_CONVERTIDAS.md**
2. Copia: Sección 1 (Troubleshooting) completa
3. Pega en: `index.html` antes de `</main>`
4. Guarda y abre en navegador
5. Clica en sidebar: debe mostrar "Troubleshooting Avanzado"

**Listo. Ya sabes cómo funciona.**

Para más secciones, sigue los pasos en **GUIA_RAPIDA_INTEGRACION.md**
