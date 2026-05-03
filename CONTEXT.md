# 📌 Contexto Activo — Claude Code Mastery Guide

## Resumen ejecutivo

**Claude Code Mastery Guide** es una SPA educativa en español que documenta Claude Code (CLI de Anthropic) en 3 niveles progresivos. Fue mejorada de v2.0 a v2.1 con fixes críticos y contenido nuevo.

## ¿Qué se hizo en esta sesión?

### Bugs críticos (🔴 Fixed)
1. **Sidebar inaccesible en móvil** — Agregado botón hamburguesa + JS handler
2. **Tabla Nivel 3 nunca se renderiza** — Faltaba `<div id="commands-table-nivel-3">` + llamada JS

### Contenido nuevo (🟠 Added)
3. **Sección Autenticación (Nivel 1)** — OAuth (`claude auth login`) + API Key
4. **Sub-agentes (Nivel 3)** — Orquestación paralela: investigación + implementación
5. **Modo headless (Nivel 1)** — `claude -p` para CI/CD, escenario terminal + GitHub Actions
6. **`/memory` (Nivel 2)** — Memoria persistente entre sesiones con `/memory add|show|delete`
7. **`.mcp.json` (Nivel 2)** — Configuración declarativa de MCP con variables de entorno

### Mejoras UX (🟡 Enhanced)
8. **+6 comandos** en COMMANDS_DATA (26 total): auth, -p, mcp remove, /memory, /config, /doctor
9. **Navegación por teclado** en buscador (↑↓ Enter, .selected styling)
10. **Escenario headless** en simulador (7mo escenario)

## Estadísticas finales

```
Archivos:           7 (html, js, css, md, json, gitignore)
Comandos:          26 (+4 vs plan)
Escenarios:         7 (+1)
Secciones:          3 niveles + 4 production
Líneas totales:    ~1500
Dependencias:       0 (vanilla)
Tamaño:            ~100 KB
Responsive:        ✅ (hamburguesa incluida)
```

## Estructura de archivos

```
.
├── index.html              # SPA shell + todas las secciones
├── script.js               # COMMANDS_DATA, SCENARIOS, routing, search, syntax
├── styles.css              # Dark theme, responsive, animaciones
├── README.md               # Documentación pública
├── CLAUDE.md               # Guía para Claude Code futuro
├── CONTEXT.md              # (Este archivo) — Contexto activo
├── vercel.json             # Config para Vercel
├── .gitignore              # Archivos ignorados en git
└── .git/                   # Repo git (commit inicial hecho)
```

## Cómo continuar

### Local (desarrollo)
```bash
open index.html
# o
python -m http.server 8000
# Visita http://localhost:8000
```

### Desplegar en Vercel (recomendado)
```bash
# Opción A: CLI de Vercel
npm install -g vercel
cd "/Users/usuario/claude doc"
vercel

# Opción B: GitHub → Vercel
git remote add origin https://github.com/TU_USER/claude-code-mastery.git
git push -u origin master
# Luego en Vercel: Import from GitHub + auto-deploy

# Opción C: GitHub Pages
# En GitHub: Settings → Pages → Source: main → Save
```

### Desplegar en GitHub Pages
```bash
git remote add origin https://github.com/TU_USER/claude-code-mastery.git
git push -u origin master

# En GitHub repo settings:
# Settings → Pages → Source: master branch
```

## Puntos de extensión (para futuro)

| Punto | Cómo agregar |
|-------|------------|
| Nuevo comando | Agregar a `COMMANDS_DATA` array |
| Nuevo escenario terminal | Agregar a `SCENARIOS` object |
| Nueva sección | Crear `<section data-section="x">` + nav link |
| Nuevo idioma de highlight | Extender `SYNTAX_RULES` |
| Tema claro | Agregar `[data-theme="light"]` CSS override |

## URLs útiles (una vez deployado)

- **Buscador**: Ctrl+K
- **Nivel 1**: #nivel-1
- **Nivel 2**: #nivel-2
- **Nivel 3**: #nivel-3
- **Simulador**: #terminal
- **Seguridad**: #seguridad

## Checklist de verificación

- [x] HTML válido (no hay errores)
- [x] JavaScript sin errores de sintaxis
- [x] CSS responsive (probado < 1024px)
- [x] Buscador funcional (Ctrl+K, ↑↓ Enter)
- [x] Terminal simulada con 7 escenarios
- [x] Git initialized & commit inicial hecho
- [x] README.md completo
- [x] CLAUDE.md para futuras sesiones
- [ ] Deployado en Vercel/GitHub Pages ← **PRÓXIMO PASO**

## Próximas mejoras opcionales

- [ ] Dark/Light theme toggle
- [ ] Multilingual support (EN, ES, FR)
- [ ] PWA (offline mode con Service Worker)
- [ ] Analytics (Google Analytics / Vercel Analytics)
- [ ] PDF export de guía
- [ ] Video tutorials incrustados

---

**Última actualización**: 2026-05-03 | **Versión**: 2.1 | **Estado**: ✅ Listo para desplegar
