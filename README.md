# Claude Code Mastery Guide — Guía Interactiva en Español

Una guía educativa interactiva para dominar **Claude Code**, la herramienta agéntica CLI de Anthropic, con tres niveles progresivos (Fundamentos → Avanzado → Experto), simulador de terminal, buscador en tiempo real y +26 comandos documentados.

## 🎯 ¿Qué es esto?

**Claude Code Mastery Guide** es una **SPA (Single Page Application)** construida con vanilla HTML/CSS/JavaScript que enseña:

- **Nivel 1 — Fundamentos**: Instalación, autenticación, navegación de archivos (@), comandos básicos
- **Nivel 2 — Avanzado**: MCP (Model Context Protocol), gestión de tokens, compactación, memoria persistente
- **Nivel 3 — Experto**: Skills personalizadas, automatización con hooks, orquestación de sub-agentes

## ✨ Características

- 🔍 **Buscador en tiempo real** (Ctrl+K) con navegación por teclado (↑↓ Enter)
- 💻 **Simulador de terminal animado** con 7 escenarios prácticos
- 📱 **Responsive** — Funciona perfectamente en móvil (hamburguesa incluida)
- 🎨 **Dark theme profesional** con paleta inspirada en dev tools
- 📚 **26 comandos documentados** con ejemplos prácticos
- 🔐 **Seguridad** — Sección dedicada a hardening y configuración segura
- 🚀 **Casos de uso reales** — 6+ escenarios basados en documentación oficial

## 📂 Estructura

```
.
├── index.html          # Shell SPA + todas las secciones
├── script.js           # Lógica: routing, búsqueda, terminal simulado, sintaxis
├── styles.css          # Dark theme, responsive, animaciones
├── README.md           # (Este archivo)
├── CLAUDE.md           # Guía para futuras instancias de Claude Code
└── .gitignore          # (Archivos ignorados)
```

## 🚀 Cómo usar

### Local
```bash
# Simplemente abre en tu navegador
open index.html
# O sirve desde un servidor local
python -m http.server 8000
# Visita http://localhost:8000
```

### Navegación
- **Ctrl + K**: Abre el buscador de comandos
- **↑↓**: Navega resultados
- **Enter**: Selecciona un resultado
- **Escape**: Cierra el buscador

### Terminal simulado
Selecciona un escenario y pulsa "Ejecutar":
1. Instalación e inicio
2. Comandos básicos
3. Conexión MCP
4. Compactación de contexto
5. Crear y usar una Skill
6. Configuración de seguridad
7. **Modo headless para CI/CD** ← Nuevo

## 📋 Cambios recientes (v2.1)

### 🔴 Bugs críticos arreglados
- ✅ Botón hamburguesa para móvil (sidebar accesible < 1024px)
- ✅ Tabla de comandos Nivel 3 (ahora se renderiza correctamente)

### 🟠 Contenido agregado
- ✅ **Sección Autenticación (Nivel 1)**: OAuth + API Key
- ✅ **Sub-agentes (Nivel 3)**: Orquestación paralela de agentes
- ✅ **Modo headless (Nivel 1)**: `claude -p` para CI/CD
- ✅ **`/memory` (Nivel 2)**: Memoria persistente entre sesiones
- ✅ **`.mcp.json` (Nivel 2)**: Config declarativa de MCP

### 🟡 Mejoras de UX
- ✅ +6 comandos nuevos (26 total, antes 22)
- ✅ Navegación por teclado en buscador (↑↓ Enter)
- ✅ Nuevo escenario "Modo headless para CI/CD"

## 🛠️ Arquitectura

### Data-driven & Extensible

El diseño favorece agregar contenido sin tocar lógica:

```javascript
// Agregar un comando: solo añade a COMMANDS_DATA
const COMMANDS_DATA = [
  { cmd: 'tu-comando', level: 1, category: 'shell',
    desc: 'Descripción', example: 'ejemplo' },
  // ...
];

// Agregar un escenario: solo añade a SCENARIOS
const SCENARIOS = {
  mi_escenario: [
    { type: 'prompt', text: '$ claude --help', delay: 200 },
    { type: 'output', text: 'Commands available...', delay: 600 },
  ]
};

// Agregar una sección: crea un <section data-section="mi-seccion">
// + un <a data-section="mi-seccion"> en el sidebar. El router hace el resto.
```

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| Comandos documentados | 26 |
| Secciones de aprendizaje | 3 niveles + producción |
| Escenarios terminales | 7 |
| Líneas de código (HTML/CSS/JS) | ~1500 |
| Dependencias | 0 (vanilla) |
| Tamaño total | ~100 KB |

## 🎓 Público objetivo

- **Developers nuevos** en Claude Code (start here: Nivel 1)
- **Teams técnicos** que quieren onboarding sin documentación oficial rota
- **Autónomos/Agencias** que usan Claude Code en pipelines (ver Nivel 2)
- **Automadores avanzados** que crean Skills y hooks (ver Nivel 3)

## 🔗 Enlaces útiles

- [Documentación oficial Claude Code](https://claude.ai/code)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Anthropic Console](https://console.anthropic.com)

## 📝 Notas de desarrollo

- **Sin build step**: Todo es vanilla. Abre `index.html` y funciona.
- **Compatible con todos los navegadores modernos** (ES2020+, CSS Grid, CSS Variables)
- **Syntax highlighting**: Regex-based, soporta bash/json/markdown/gitignore/text

## 📄 Licencia

Contenido educativo de dominio público. Siéntete libre de bifurcar, adaptar y compartir.

---

**Última actualización**: Mayo 2026 | **Versión**: 2.1
