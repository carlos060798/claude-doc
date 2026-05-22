=== ANÁLISIS ESTRUCTURA ACTUAL (index.html) ===

## 1. CONTEO TOTAL

- Total nav-links (items en sidebar): 64
- Total content-sections (secciones de contenido): 68
- Data-sections únicos en navbar: 63
- Grupos de navegación: 13

## 2. BROKEN LINKS & HUÉRFANAS

BROKEN LINKS (nav-link existe pero NO tiene content-section):
- certificacion (navbar link existe, NO tiene sección)
- performance (navbar link existe, NO tiene sección)

SECCIONES HUÉRFANAS (content-section existe pero NO en navbar):
- nivel-1 (contenido de Nivel 1)
- nivel-2 (contenido de Nivel 2)
- nivel-3 (contenido de Nivel 3)
- nivel-4 (contenido de Nivel 4)
- nivel-5 (contenido de Nivel 5)
- nivel2-casos (contenido secundario)

Nota: Los "nivel-X" son accesibles desde "Curso Interactivo" y Dashboard, 
no son broken links reales, sino vistas internas del curso.

## 3. SECCIONES DUPLICADAS O MUY SIMILARES

DUPLICADOS CLAROS:

1. HOOKS (2 variantes, mismo nivel 3):
   - hooks-production: "🎣 Hooks in Production"
   - hooks-detail: "🎣 Hooks para Seguridad & Automación"
   → Mismo tema, nombres confusos, deberían consolidarse

2. GIT WORKFLOWS (2 variantes, mismo nivel 4):
   - git-workflows: "🌿 Git Workflows Reales en Producción"
   - git-workflows-detail: "🌿 Git Workflows Reales en Producción"
   → MISMO TÍTULO EXACTO, definitivamente se repiten

3. SEGURIDAD (3 variantes, dispersadas):
   - seguridad (Nivel 5): "Seguridad & Hardening"
   - seguridad-compliance (Nivel 5): "✅ Seguridad & Compliance: GDPR, SOC2"
   - enterprise-security (Nivel 5): "🔐 Enterprise Security"
   → Temas superpuestos, usuarios confundidos

4. OBSERVABILIDAD (2 variantes):
   - observability-production (Nivel 4)
   - observabilidad (Nivel 6)
   → Nombres en idiomas diferentes, probablemente mismo tema

## 4. SECCIONES INACTIVAS/HIDDEN

3 secciones con clase 'hidden' (Para No-Programadores):
- intro-acc: "¿Qué es Claude Code?"
- casos-rol: "Casos por Rol"
- glosario: "Glosario"

Estas están desactivadas en modo "technical" pero existen para "accessible".

## 5. PLAYGROUND & PROMPT MAESTRO

Estado actual:
- ✓ Existen como archivos externos:
  - prompt-maestro.html (141KB)
  - playground.html (95KB)
- ✓ Vinculados en topbar (header) como links directos:
  - "⚡ Prompt Maestro"
  - "🧪 Playground"
- ✓ NO forman parte del sidebar (están fuera de la navegación principal)

Ventaja: Mantiene la UI limpia, no contaminan el flujo de aprendizaje

## 6. DISTRIBUCIÓN POR GRUPO

Distribución actual de items en cada grupo:

| Grupo | Items | % |
|-------|-------|---|
| Inicio | 2 | 2.8% |
| Nivel 1: Explorador | 7 | 10% |
| Nivel 2: Practicante | 7 | 10% |
| Nivel 3: Constructor | 5 | 7% |
| Nivel 4: Ingeniero | 8 | 11% |
| Nivel 5: Líder Técnico | 10 | 14% |
| Nivel 6: Arquitecto | 4 | 5.7% |
| Evaluación & Progreso | 3 | 4.2% |
| **Recursos** | **16** | **22.8%** ⚠️ |
| Para No-Programadores | 3 | 4.2% |
| 🗺️ Ruta de Aprendizaje | 1 | 1.4% |
| P9: Producción | 3 | 4.2% |
| Certificación | 1 | 1.4% |
| **TOTAL** | **70** | **100%** |

**PROBLEMA: "Recursos" contiene 22.8% de todos los items (16 elementos)**

Items en "Recursos" (heterogéneos):
1. Cheatsheet
2. Simulador Terminal
3. Laboratorios Prácticos
4. Enlaces Externos
5. Agent SDK ← Debería estar en Tecnología
6. Anthropic API ← Debería estar en Tecnología
7. Plugins & Abilities
8. Marketplace (Smithery)
9. Skills Avanzados

## 7. LAYOUT ACTUAL

Estructura HTML:
- ✓ Sidebar fijo a la izquierda (`<aside class="sidebar">`)
- ✓ Main content a la derecha (`<main class="main-content">`)
- ✓ Topbar con búsqueda (`<header class="topbar">`)
- ✓ Search overlay (`<div id="search-results">`)

Características:
- No hay max-width aparente en content-sections
- Contenido se expande al ancho disponible
- Búsqueda en tiempo real (Ctrl+K)
- Modo toggle Técnico/Accesible

Responsividad:
- ✓ Hamburger button para mobile
- ✓ Sidebar oculta en mobile

## 8. PROPUESTA: REORGANIZACIÓN RECOMENDADA

OBJETIVO: Reducir navegación de 70+ items a ~30-35 items visibles

### A. ESTRUCTURA PROPUESTA DEL SIDEBAR

**GRUPO 1: ENTRADA PRINCIPAL** (3 items, siempre visibles)
- Dashboard
- 📋 Plan de Estudio Completo ← DESTACADO (nav-link-featured)
- 🎓 Curso Interactivo

**GRUPO 2: APRENDIZAJE PROGRESIVO** (5 grupos colapsibles)

Nivel 1: Fundamentos [⊕]
├─ Instalación
├─ Primeros Pasos
├─ CLAUDE.md
├─ Desafíos Nivel 1
├─ Proyectos de Ejemplo
└─ Prompt Craft

Nivel 2: Avanzado [⊕]
├─ Branching Strategy
├─ .rules & Config
├─ Memory Management
├─ Patrones de Comandos
├─ Flujos Dev Reales
├─ Cost Management
└─ Testing Asistido

Nivel 3: Constructor [⊕]
├─ MCPs por Caso de Uso
├─ Hooks (CONSOLIDADO - una sola sección)
├─ MCP Setup
└─ Multi-MCP Orchestration

Nivel 4: Ingeniero [⊕]
├─ Git Workflows (CONSOLIDADO - una sola sección)
├─ CI/CD & Headless
├─ Observability & Debug
├─ Gobernanza
├─ Monitoreo de Costos
└─ Incident Response

Nivel 5: Líder Técnico [⊕]
├─ LangChain/CrewAI
├─ Seguridad & Hardening (CONSOLIDADO)
├─ Casos de Uso Avanzados
├─ Mejores Prácticas
├─ Adopción en Equipos
├─ Ética en IA
└─ Troubleshooting

Nivel 6: Arquitecto [⊕]
├─ (mantener igual)

**GRUPO 3: TECNOLOGÍA & APIS** (5 items)
- Agent SDK
- Anthropic API
- Plugins & Abilities
- Marketplace (Smithery)
- Skills Avanzados

**GRUPO 4: P9: PRODUCCIÓN** (3 items)
- Agentes Autónomos (SDK)
- Razonamiento Profundo
- Batch API & Costos

**GRUPO 5: HERRAMIENTAS ESENCIALES** (4 items)
- Cheatsheet
- Simulador Terminal
- Laboratorios Prácticos
- Enlaces Externos

**GRUPO 6: SEGUIMIENTO** (4 items)
- Quizzes
- Mi Progreso
- Proyecto Capstone
- Architect Certification

**GRUPO 7: ACCESIBLE** [▼] Colapsible
- ¿Qué es Claude Code?
- Casos por Rol
- Glosario

### B. ELEMENTOS A CONSOLIDAR

ELIMINAR/CONSOLIDAR:

1. **hooks-detail** → FUSIONAR en "hooks-production"
   - Consolidar contenido en una sola sección
   - Renombrar a solo "Hooks"
   - Eliminar hooks-detail como sección separada

2. **git-workflows-detail** → FUSIONAR en "git-workflows"
   - Tienen el MISMO TÍTULO
   - Combinar contenido en una sola sección
   - Eliminar git-workflows-detail

3. **performance** → ELIMINAR
   - No tiene content-section asociada
   - Es un broken link puro
   - Si se necesita, crear o mover a otra sección

4. **seguridad-compliance** + **enterprise-security** → REVISAR
   - Evaluar si se pueden fusionar con "seguridad"
   - O reorganizar en "Nivel 5" de forma clara
   - Considerar: Seguridad General + Seguridad Enterprise + Compliance

5. **observability-production** + **observabilidad** → REVISAR
   - Mismo tema, nombres en idiomas diferentes
   - Considerar consolidar o renombrar consistentemente

### C. REORGANIZACIÓN: "RECURSOS" ANTES vs DESPUÉS

**ANTES (16 items):**
- Cheatsheet
- Simulador Terminal
- Laboratorios Prácticos
- Enlaces Externos
- Agent SDK ← Mal colocado
- Anthropic API ← Mal colocado
- Plugins ← Mal colocado
- Marketplace ← Mal colocado
- Skills Avanzados ← Mal colocado

**DESPUÉS:**

Herramientas Esenciales (4 items):
- Cheatsheet
- Simulador Terminal
- Laboratorios Prácticos
- Enlaces Externos

Tecnología & APIs (5 items, nuevo grupo):
- Agent SDK
- Anthropic API
- Plugins & Abilities
- Marketplace
- Skills Avanzados

**Reducción: de 16 a 4 items en "Recursos"** (-75%)

### D. CAMBIOS DE LAYOUT

1. **Mantener estructura base:**
   - Sidebar fijo + main content
   - Topbar con búsqueda

2. **Mejorar contenido:**
   - Añadir max-width: 900px a .content-section
   - Centrar contenido en pantallas > 1400px
   - Mantener sidebar responsive en mobile

3. **Grupos colapsibles:**
   - Niveles 1-6 pueden colapsar
   - Grupo "Para No-Programadores" colapsible
   - Guardar estado en localStorage

4. **Indicadores visuales:**
   - Mostrar nivel actual activo
   - Indicador de items completados
   - Progress bar por nivel

## 9. IMPACTO ESTIMADO

ANTES:
- Sidebar items visibles: 70+
- Scroll vertical needed: ~800px
- Ruido visual: Alto

DESPUÉS:
- Sidebar items visibles: ~25-30 (sin colapsar)
- Scroll vertical needed: ~300-400px (sin colapsar Niveles)
- Ruido visual: Bajo

MEJORA:
- Navegación 60-70% más limpia
- Flujo claro: Inicio → Aprender → Practicar → Certificar
- 4 items duplicados eliminados
- 5 items mal colocados reubicados
- Contenido de "Recursos" reducido en 75%

## 10. ESTADO ACTUAL: ARCHIVOS EXTERNOS

✓ **Prompt Maestro** (prompt-maestro.html, 141KB)
  - Accesible vía link en topbar: "⚡ Prompt Maestro"
  - Bien posicionado, no contamina navbar

✓ **Playground** (playground.html, 95KB)
  - Accesible vía link en topbar: "🧪 Playground"
  - Bien posicionado, no contamina navbar

RECOMENDACIÓN: Mantener externos, son puntos de entrada independientes

---

**NOTA FINAL:** Este análisis es descriptivo (observación), no prescriptivo.
Espera tu confirmación antes de implementar cambios.
