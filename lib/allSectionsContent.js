/* AUTO-GENERATED FILE - Extracted from index.html */
/* This file contains all 35 sections with complete HTML content converted to JSON structure */

export const ALL_SECTIONS_CONTENT = {
  dashboard: {
    title: "Bienvenido a la Guía de Claude Code",
    breadcrumb: "Inicio / Dashboard",
    lead: "Domina la herramienta agéntica de Anthropic desde principiante hasta experto. Esta guía está estructurada en tres niveles, con simulador de terminal, buscador de comandos en tiempo real y casos de uso reales basados en la documentación oficial.",
    content: [
      {
        type: "stats-grid",
        items: [
          { label: "Comandos cubiertos", value: "—", subtitle: "Built-in + Custom" },
          { label: "Niveles", value: "3", subtitle: "Fundamentos → Experto" },
          { label: "Casos prácticos", value: "10+", subtitle: "Refactor, Review, API, CI/CD" },
          { label: "MCP Transports", value: "3", subtitle: "stdio · SSE · HTTP" },
          { label: "API Endpoints", value: "8+", subtitle: "Messages, Batch, Files, Models" },
          { label: "Skills templates", value: "12+", subtitle: "Listos para usar en tu equipo" }
        ]
      },
      {
        type: "path-cards",
        items: [
          {
            level: "Nivel 1",
            title: "Fundamentos",
            description: "Instalación con npm, comandos básicos, navegación y primeros prompts.",
            tag: "path-card--1",
            link: "nivel-1"
          },
          {
            level: "Nivel 2",
            title: "Avanzado: MCP",
            description: "Model Context Protocol, gestión de tokens y compactación de contexto.",
            tag: "path-card--2",
            link: "nivel-2"
          },
          {
            level: "Nivel 3",
            title: "Experto: Skills",
            description: "Crea Skills personalizadas, automatiza flujos y orquesta sub-agentes.",
            tag: "path-card--3",
            link: "nivel-3"
          },
          {
            level: "SDK",
            title: "Agent SDK",
            description: "Construye agentes autónomos con el SDK oficial de Anthropic en TypeScript o Python.",
            tag: "path-card--sdk",
            link: "agente-sdk"
          },
          {
            level: "API",
            title: "Anthropic API",
            description: "Messages, streaming, tool use, prompt caching y Batch API con ejemplos reales.",
            tag: "path-card--api",
            link: "api-anthropic"
          },
          {
            level: "CI/CD",
            title: "Automatización",
            description: "Modo headless, GitHub Actions, pipelines de revisión y despliegue asistido.",
            tag: "path-card--ci",
            link: "ci-cd"
          }
        ]
      },
      {
        type: "info-banner",
        icon: "💡",
        title: "Tip de senior",
        text: "Lee el archivo CLAUDE.md de cada proyecto antes de iniciar la sesión. Es el equivalente a un system prompt persistente y el primer punto de configuración profesional."
      }
    ]
  },

  curso: {
    title: "🎓 Curso Interactivo: De Cero a Experto en Claude Code",
    breadcrumb: "Inicio / Curso Interactivo",
    lead: "Un programa de aprendizaje estructurado en 7 módulos progresivos, diseñado para developers que quieren dominar Claude Code en su flujo de trabajo diario — desde la primera instalación hasta agentes autónomos en producción.",
    content: [
      {
        type: "course-stats",
        items: [
          { value: "7", label: "Módulos" },
          { value: "25+", label: "Desafíos" },
          { value: "10", label: "Flujos Dev reales" },
          { value: "1", label: "Capstone Project" },
          { value: "~6h", label: "Tiempo estimado" }
        ]
      },
      {
        type: "heading",
        level: 3,
        text: "🗺️ El Roadmap Completo"
      },
      {
        type: "paragraph",
        text: "Cada módulo construye sobre el anterior. Te recomendamos seguir el orden, pero puedes saltar a cualquier parte si ya dominas los fundamentos."
      },
      {
        type: "roadmap",
        modules: [
          {
            id: 1,
            marker: "01",
            tag: "Principiante",
            time: "~30 min",
            title: "Setup & Primer Contacto",
            description: "Instalación multiplataforma, autenticación OAuth, primera sesión, comandos esenciales.",
            bullets: [
              "Instalar Claude Code en tu sistema",
              "Configurar OAuth o API Key",
              "Crear tu primer CLAUDE.md con /init",
              "Mencionar archivos con @"
            ],
            project: "Configurar Claude Code en tu repo personal",
            link: "nivel-1"
          },
          {
            id: 2,
            marker: "02",
            tag: "Principiante",
            time: "~45 min",
            title: "Workflow Diario del Developer",
            description: "Patrones que usarás cada día: leer código nuevo, refactorizar, debuggear, crear commits y PRs con Claude.",
            bullets: [
              "Onboarding rápido a un repo desconocido",
              "Refactorizar funciones legacy con seguridad",
              "Debuggear errores con stack traces reales",
              "Generar commits y PRs descriptivos"
            ],
            project: "Refactorizar un módulo legacy a TypeScript estricto",
            link: "flujos-dev"
          },
          {
            id: 3,
            marker: "03",
            tag: "Intermedio",
            time: "~50 min",
            title: "Maestría del Contexto",
            description: "El recurso más caro de Claude es la ventana de contexto. Aprende a observarla, comprimirla y persistirla.",
            bullets: [
              "Diagnóstico con /context y /usage",
              "Compactación dirigida con /compact \"preserva X\"",
              "Memoria persistente con /memory",
              "Sesiones nombradas con /rename y /resume"
            ],
            project: "Sobrevivir una sesión de 4 horas sin perder contexto",
            link: "nivel-2"
          },
          {
            id: 4,
            marker: "04",
            tag: "Intermedio",
            time: "~60 min",
            title: "MCP: Conexión a Herramientas Externas",
            description: "Conecta Claude a GitHub, bases de datos, Slack, Sentry, navegadores. Transports stdio/HTTP/SSE y scopes (local/project/user).",
            bullets: [
              "Registrar servidores MCP públicos y privados",
              "Auth con OAuth y headers personalizados",
              "Configuración declarativa .mcp.json",
              "Tool Search para escalar a 100+ herramientas"
            ],
            project: "Configurar 3 MCPs (GitHub + Postgres + Sentry) y resolver una tarea real",
            link: "nivel-2"
          },
          {
            id: 5,
            marker: "05",
            tag: "Avanzado",
            time: "~75 min",
            title: "Skills, Hooks & Sub-Agentes",
            description: "Crea Skills para tu equipo. Configura hooks deterministas. Orquesta sub-agentes especializados en paralelo.",
            bullets: [
              "Anatomía completa del frontmatter",
              "5 Skills de producción (review, deploy, tests…)",
              "Hooks PreToolUse / PostToolUse / SessionStart",
              "Sub-agentes con AgentDefinition"
            ],
            project: "Publicar una librería de Skills compartida con tu equipo",
            link: "nivel-3"
          },
          {
            id: 6,
            marker: "06",
            tag: "Avanzado",
            time: "~80 min",
            title: "Agent SDK & API de Anthropic",
            description: "Construye agentes programáticamente. Domina la Messages API, tool use, streaming, vision, batch y prompt caching.",
            bullets: [
              "@anthropic-ai/claude-agent-sdk en TS y Python",
              "Tool use loop y orquestación multi-agente",
              "Prompt caching (-90% costos)",
              "Batch API (-50% costos en volumen)"
            ],
            project: "Construir un revisor de PRs autónomo con SDK + sub-agentes",
            links: [
              { text: "Ver Agent SDK", href: "agente-sdk" },
              { text: "Ver API", href: "api-anthropic" }
            ]
          },
          {
            id: 7,
            marker: "07",
            tag: "Experto",
            time: "~90 min",
            title: "Producción: CI/CD, Seguridad & Equipos",
            description: "Lleva Claude a producción. GitHub Actions, modo headless, hardening, mejores prácticas para equipos y escalado.",
            bullets: [
              "Pipelines: review automático en PRs",
              "Hardening: deny, .claudeignore, secretos",
              "Sesiones paralelas con git worktrees",
              "Métricas: tokens, latencia, costos"
            ],
            project: "Sistema completo de asistente de desarrollo para tu equipo",
            link: "capstone"
          }
        ]
      },
      {
        type: "heading",
        level: 3,
        text: "📚 Cómo aprovechar este curso"
      },
      {
        type: "course-tips",
        tips: [
          {
            icon: "🛠️",
            title: "Aprende haciendo",
            text: "Cada módulo tiene un proyecto real. Abre tu terminal en un repo de verdad y ejecuta los comandos mientras lees."
          },
          {
            icon: "🧠",
            title: "Resuelve los desafíos",
            text: "Los desafíos interactivos validan tu comprensión. Si fallas, revisa la sección y vuelve a intentar."
          },
          {
            icon: "📌",
            title: "Marca tu progreso",
            text: "Al final de cada nivel, pulsa \"Marcar completado\". Tu progreso se guarda localmente y se refleja en el dashboard."
          },
          {
            icon: "🔄",
            title: "Vuelve a las cheat sheets",
            text: "Las cheat sheets son tu referencia rápida. Imprímelas o ténlas abiertas mientras trabajas."
          }
        ]
      },
      {
        type: "info-banner",
        variant: "tip",
        title: "Consejo del autor",
        text: "No intentes hacer todo en una sola sesión. Recomendamos 1 módulo por día durante una semana, aplicando lo aprendido a tu trabajo real entre sesiones. La maestría viene de la práctica, no del consumo."
      }
    ]
  },

  desafios: {
    title: "🧠 Desafíos Interactivos",
    breadcrumb: "Curso / Desafíos",
    lead: "25 retos progresivos para validar lo que aprendiste. Cada desafío te pone en una situación real de developer y te pide elegir la mejor opción. Tu progreso se guarda automáticamente.",
    content: [
      {
        type: "stats",
        items: [
          { id: "challenges-correct", label: "Aciertos", value: "0" },
          { id: "challenges-attempted", label: "Intentados", value: "0" },
          { id: "challenges-accuracy", label: "Precisión", value: "—" },
          { action: "reset-challenges", label: "Resetear progreso" }
        ]
      },
      {
        type: "filters",
        buttons: [
          { filter: "all", label: "Todos", active: true },
          { filter: "basics", label: "Fundamentos" },
          { filter: "context", label: "Contexto" },
          { filter: "mcp", label: "MCP" },
          { filter: "skills", label: "Skills" },
          { filter: "sdk", label: "SDK & API" },
          { filter: "security", label: "Seguridad" }
        ]
      },
      {
        type: "paragraph",
        text: "Los desafíos se renderizan dinámicamente desde CHALLENGES_DATA en script.js"
      }
    ]
  },

  "flujos-dev": {
    title: "🔄 Flujos Reales de Developer",
    breadcrumb: "Curso / Flujos Dev Reales",
    lead: "10 escenarios completos sacados del día a día de equipos de producción. Cada flujo incluye contexto, prompts efectivos paso a paso, qué esperar, y los errores comunes a evitar.",
    content: [
      {
        type: "flow-card",
        id: "onboarding",
        tag: "Flujo 01",
        title: "🆕 Onboarding a un repo legacy de 5 años",
        context: "Te incorporas a un equipo. El repo tiene 200 archivos, sin README útil, mezcla de JS y TS, y nadie tiene tiempo de explicártelo.",
        steps: [
          {
            num: 1,
            title: "Mapa inicial del repo",
            prompt: "> Eres un senior engineer haciendo onboarding. Sin leer nada en detalle:\n  1. Lista los directorios principales con `ls` y describe el propósito de cada uno\n  2. Lee @README.md y @package.json\n  3. Identifica el stack técnico, scripts npm relevantes y entry points\n  4. Devuélvelo como un mapa mental en Markdown",
            tip: "No le pidas leer todo al principio — hace consumo brutal de tokens."
          },
          {
            num: 2,
            title: "Generar CLAUDE.md desde el código real",
            prompt: "> Ejecuta /init para generar un CLAUDE.md base.\n  Después léelo y añade:\n  - Convenciones detectadas (nombres de archivos, imports, tests)\n  - Comandos npm más usados (analiza scripts en package.json)\n  - Áreas peligrosas (TODOs, FIXMEs, código sin tests)\n  - 3 archivos clave para entender el dominio",
            tip: "El CLAUDE.md generado se queda en el repo y acelera todas tus sesiones futuras."
          },
          {
            num: 3,
            title: "Trazar un flujo crítico",
            prompt: "> Traza el flujo completo de un login desde @src/api/auth/login.ts.\n  Muéstrame: archivos involucrados, llamadas a DB, validaciones, dónde se firma\n  el JWT, dónde se guarda la session. Dame un diagrama ASCII.",
            tip: "Pídele un flujo concreto, no \"explícame todo el sistema\". Mucho más útil."
          },
          {
            num: 4,
            title: "Guardar aprendizajes en memoria",
            prompt: "> /memory add \"Auth: JWT firmado en src/api/auth/jwt.ts.\n  Sessions en Redis (TTL 24h). Refresh tokens en src/api/auth/refresh.ts.\n  Validación con Zod en src/shared/schemas/.\"",
            tip: "Esta memoria sobrevive al cierre de sesión y futuras Claude sessions la usan."
          }
        ],
        pitfalls: [
          "Pedir \"léete todo el repo\" — saturas el contexto sin sacar valor",
          "No actualizar CLAUDE.md después del onboarding — pierdes el aprendizaje",
          "Mezclar onboarding con tareas reales — cada cosa en su sesión"
        ]
      },
      {
        type: "flow-card",
        id: "tdd-feature",
        tag: "Flujo 02",
        title: "🧪 Añadir una feature con TDD",
        context: "Te asignan implementar \"rate limiting por usuario\" en un endpoint. Tu equipo exige tests primero, cobertura ≥85%.",
        steps: [
          {
            num: 1,
            title: "Diseño antes de tocar código",
            prompt: "> Lee @src/api/middleware/ y @CLAUDE.md.\n  Diseña (sin implementar) un middleware de rate-limiting:\n  - Por user.id, no por IP (evita afectar usuarios detrás de NAT)\n  - 100 req/min por defecto, configurable\n  - Storage en Redis (ya lo usamos)\n  - Devuelve 429 con header Retry-After\n\n  Dame: estructura del archivo, interfaces TS, casos de test a cubrir.\n  NO escribas código todavía.",
            tip: "Separar diseño de implementación produce mejores resultados."
          },
          {
            num: 2,
            title: "Tests primero (rojos)",
            prompt: "> Escribe los tests Vitest para el middleware en\n  @src/api/middleware/rate-limit.test.ts.\n  Cubre los casos que listaste: happy path, límite alcanzado,\n  reset de ventana, usuarios distintos no se afectan, Redis caído (fallback).\n  Mockea Redis con @testing-library/redis-mock.\n\n  Los tests DEBEN fallar (rojos) — el archivo de impl aún no existe."
          },
          {
            num: 3,
            title: "Implementar hasta verde",
            prompt: "> Ahora implementa @src/api/middleware/rate-limit.ts\n  para que pasen TODOS los tests. Sigue el diseño que definimos.\n  Después de cada cambio, corre `npm test rate-limit` y muéstrame el output.",
            tip: "Pídele que ejecute los tests él mismo — atrapa errores antes que tú."
          },
          {
            num: 4,
            title: "Refactor con tests verdes",
            prompt: "> Con los tests pasando, refactoriza el middleware:\n  - Extrae constantes mágicas a un objeto config\n  - Mejora nombres de variables si encuentras alguno poco claro\n  - Verifica que TODOS los tests sigan en verde después del refactor"
          },
          {
            num: 5,
            title: "PR con contexto",
            prompt: "> Crea un commit con mensaje descriptivo siguiendo Conventional Commits.\n  Después abre un PR con `gh pr create` cuyo body explique:\n  - Por qué hacemos rate-limiting por user.id (no por IP)\n  - Cómo se configura el límite por endpoint\n  - Plan de rollout: feature flag inicialmente"
          }
        ],
        pitfalls: [
          "Saltar el paso de diseño — Claude implementa algo que no encaja con el resto",
          "No pedir que ejecute los tests — quedan errores ocultos hasta CI",
          "PR sin contexto del \"por qué\" — el reviewer no puede evaluar la decisión"
        ]
      },
      {
        type: "flow-card",
        id: "debug",
        tag: "Flujo 03",
        title: "🐛 Debugging de bug intermitente en producción",
        context: "Sentry reporta RangeError: Invalid time value con 47 ocurrencias en 24h, pero no se reproduce localmente.",
        steps: [
          {
            num: 1,
            title: "Investigación con stack trace real",
            prompt: "> Tengo este error de Sentry:\n\n  RangeError: Invalid time value\n    at Date.toISOString (<anonymous>)\n    at formatTimestamp (src/lib/dates/format.ts:42)\n    at processOrder (src/features/checkout/process.ts:118)\n\n  Lee @src/lib/dates/format.ts y @src/features/checkout/process.ts.\n  Identifica QUÉ inputs podrían producir un Date inválido en formatTimestamp.\n  Dame hipótesis ordenadas por probabilidad, no implementes nada.",
            tip: "Pega el stack completo. El número de línea es oro puro."
          },
          {
            num: 2,
            title: "Test que reproduce el bug",
            prompt: "> Antes de arreglarlo, escribe un test en\n  @src/lib/dates/format.test.ts que reproduzca el bug con cada hipótesis.\n  El test DEBE fallar ahora (demuestra que el bug existe).",
            tip: "Test que reproduce ANTES del fix evita \"lo arreglé pero no estoy seguro\"."
          },
          {
            num: 3,
            title: "Fix defensivo + observabilidad",
            prompt: "> Arregla formatTimestamp con:\n  1. Validación al entrar (Date inválido → throw con contexto)\n  2. Logger.warn con el input original cuando se detecta inválido\n  3. Si el caller puede recuperarse, devolver fallback documentado\n\n  Después corre el test que escribimos: debe pasar a verde."
          },
          {
            num: 4,
            title: "Buscar otros call sites vulnerables",
            prompt: "> Con grep, encuentra todos los lugares que llaman a formatTimestamp.\n  Para cada uno: ¿de dónde viene el Date? ¿podría ser inválido?\n  Si encuentras otros riesgos, lista las correcciones (no implementes aún)."
          }
        ],
        pitfalls: [
          "Arreglar sin reproducir — un fix sin test es una hipótesis sin verificar",
          "Suprimir el error con try/catch silencioso — solo lo escondes",
          "No buscar otros call sites — el bug puede estar en más lugares"
        ]
      },
      {
        type: "flow-card",
        id: "migration",
        tag: "Flujo 04",
        title: "🔄 Migrar de Express a Fastify (sin downtime)",
        context: "38 endpoints en Express. Migrar a Fastify por performance, pero sin parar producción ni romper clientes.",
        steps: [
          {
            num: 1,
            title: "Inventario y plan por fases",
            prompt: "> Lista todos los endpoints (rutas + métodos) en @src/routes/.\n  Agrúpalos por dominio (auth, users, payments, etc).\n  Diseña un plan de migración por fases:\n  - Fase A: endpoints sin estado/internos\n  - Fase B: endpoints CRUD simples\n  - Fase C: endpoints críticos (payments, auth)\n  Para cada fase: criterios de éxito y plan de rollback."
          },
          {
            num: 2,
            title: "Suite de tests de contrato",
            prompt: "> Antes de migrar nada, crea tests de contrato (input → output)\n  para los 5 endpoints más críticos. Tests independientes del framework\n  (usan supertest contra HTTP). Estos tests deben pasar tanto con Express\n  como con Fastify después.",
            tip: "Tests de contrato son tu red de seguridad durante la migración."
          },
          {
            num: 3,
            title: "Migración endpoint por endpoint",
            prompt: "> Migra @src/routes/health.ts (el más simple) a Fastify.\n  Mantén la firma HTTP idéntica. Corre los tests de contrato.\n  Si pasan: commit. Si no: explícame por qué y propon una corrección.\n\n  Después seguimos con el siguiente endpoint.",
            tip: "Un endpoint = un commit = un PR. Reviews y rollbacks fáciles."
          },
          {
            num: 4,
            title: "Compactar antes de seguir",
            prompt: "> /compact mantén el plan de migración (5 fases),\n  los endpoints ya migrados (health, status, version) y la suite\n  de tests de contrato. Descarta los logs de errores resueltos\n  y las exploraciones iniciales."
          }
        ],
        pitfalls: [
          "Migrar todo en un solo PR — review imposible y rollback nuclear",
          "Sin tests de contrato — descubres regresiones en producción",
          "Cambiar el contrato HTTP \"de paso\" — rompes clientes que no controlas"
        ]
      },
      {
        type: "flow-card",
        id: "review",
        tag: "Flujo 05",
        title: "👀 Code review profundo asistido",
        context: "Te asignan revisar un PR de 800 líneas en 30 minutos. Tienes que dar feedback útil sin perderte detalles importantes.",
        steps: [
          {
            num: 1,
            title: "Resumen ejecutivo del PR",
            prompt: "> Lee el diff actual con `git diff main...HEAD`.\n  Dame un resumen ejecutivo en 5 puntos:\n  - ¿Qué problema resuelve?\n  - ¿Qué archivos toca y por qué?\n  - ¿Hay cambios estructurales (nuevos módulos, refactors grandes)?\n  - ¿Hay tests añadidos? ¿Qué cubren?\n  - ¿Qué NO hace este PR (scope explícito)?",
            tip: "El resumen te orienta antes de bucear en líneas concretas."
          },
          {
            num: 2,
            title: "Revisión por checklist",
            prompt: "> Ejecuta /code-review (nuestro Skill).\n  Quiero output organizado por prioridad:\n  🔴 Bloqueantes — bugs, seguridad, romper compat\n  🟡 Sugerencias — mejoras de diseño, naming\n  🟢 Nits — typos, espaciado, comentarios\n\n  Para cada hallazgo: archivo:línea + por qué + fix sugerido."
          },
          {
            num: 3,
            title: "Verificación cruzada",
            prompt: "> Para cada hallazgo bloqueante, dame el código exacto que lo\n  causaría a fallar. Si no puedes producir un caso concreto que falla,\n  reclasifícalo a \"sugerencia\".",
            tip: "Esto evita falsos positivos — bloquea solo lo que realmente bloquea."
          }
        ],
        pitfalls: [
          "Aceptar todo el feedback de Claude sin verificar — incluye falsos positivos",
          "Bloquear nits — frustra al autor y desincentiva PRs pequeños",
          "No pedir resumen ejecutivo — te pierdes en líneas sin contexto"
        ]
      },
      {
        type: "flow-card",
        id: "api-docs",
        tag: "Flujo 06",
        title: "📚 Generar documentación OpenAPI desde el código",
        context: "Tu API tiene 60 endpoints. Necesitas un OpenAPI 3.1 actualizado para que el equipo de mobile/frontend genere clientes tipados.",
        steps: [
          {
            num: 1,
            title: "Inventario de endpoints",
            prompt: "> Encuentra todos los endpoints en @src/routes/ y @src/controllers/.\n  Para cada uno extrae:\n  - Método y ruta\n  - Schema de request (path/query/body) — busca Zod schemas o tipos TS\n  - Schema de response (success y errores)\n  - Tag de dominio (auth, users, payments…)\n\n  Devuélvelo como tabla Markdown."
          },
          {
            num: 2,
            title: "Generar OpenAPI YAML",
            prompt: "> Con esa información, genera @docs/openapi.yaml en formato OpenAPI 3.1.\n  Reglas:\n  - Schemas reusables en components/schemas\n  - Errores documentados (400, 401, 403, 404, 500)\n  - Ejemplos por endpoint (mínimo 1)\n  - Servers: dev/staging/prod con URLs reales de @CLAUDE.md"
          },
          {
            num: 3,
            title: "Validar el OpenAPI",
            prompt: "> Corre `npx @apidevtools/swagger-cli validate docs/openapi.yaml`.\n  Si hay errores, corrígelos. Si todo está bien, instala\n  @scalar/api-reference y genera una preview HTML del docs."
          },
          {
            num: 4,
            title: "Hook para mantener actualizado",
            prompt: "> Crea un hook PostToolUse en @.claude/settings.json:\n  cuando se modifique un archivo en src/routes/ o src/controllers/,\n  ejecutar `npm run docs:generate` que regenera el OpenAPI parcialmente.\n  Así nunca queda desactualizado.",
            tip: "Hooks son tu mejor defensa contra docs obsoletas."
          }
        ]
      },
      {
        type: "flow-card",
        id: "perf",
        tag: "Flujo 07",
        title: "⚡ Investigar un cuello de botella de performance",
        context: "Tu endpoint GET /api/dashboard tarda 4.2s en p95. Los usuarios se quejan. Tienes que bajar a <500ms.",
        steps: [
          {
            num: 1,
            title: "Trazar la llamada completa",
            prompt: "> Lee @src/api/dashboard.ts. Traza la ejecución completa:\n  qué queries hace, en qué orden, qué se computa en memoria.\n  Identifica candidatos a cuello de botella (N+1, queries sin índice,\n  loops anidados, llamadas síncronas a servicios externos).\n\n  Dame un ranking de hipótesis ordenado por probabilidad."
          },
          {
            num: 2,
            title: "Medir antes de optimizar",
            prompt: "> Añade timings con console.time/timeEnd en cada sección sospechosa.\n  Corre el endpoint con un payload realista (10 items en dashboard).\n  Pega los timings de vuelta y dame el análisis.",
            tip: "Optimizar sin medir = adivinar. Mide siempre primero."
          },
          {
            num: 3,
            title: "Aplicar fix con benchmark",
            prompt: "> Aplica la optimización al cuello de botella #1 (la query N+1).\n  Después corre los timings de nuevo y compara con el baseline.\n  Si la mejora es <30%, descártala y prueba otra hipótesis."
          },
          {
            num: 4,
            title: "Test de regresión de performance",
            prompt: "> Añade un test que falle si el endpoint tarda >800ms con el dataset\n  de prueba estándar. Usa vitest con timeout custom. Esto previene\n  regresiones de performance en futuros cambios."
          }
        ]
      }
    ]
  },

  cheatsheet: {
    title: "📄 Cheat Sheets — Referencia Rápida",
    breadcrumb: "Curso / Cheat Sheets",
    lead: "Una tarjeta por área de competencia. Diseñadas para imprimir o tener abiertas mientras trabajas. Cada bloque cabe en un vistazo.",
    content: [
      {
        type: "cheatsheet",
        title: "⌨️ Comandos Esenciales",
        tag: "Día a día",
        table: [
          { cmd: "claude", desc: "Iniciar sesión" },
          { cmd: "claude -c", desc: "Continuar última sesión" },
          { cmd: "claude -r", desc: "Selector de sesiones previas" },
          { cmd: 'claude -p "..."', desc: "Headless: prompt y salir" },
          { cmd: "claude commit", desc: "Crear commit con mensaje IA" },
          { cmd: "claude --worktree X", desc: "Sesión en worktree aislado" },
          { cmd: "/help", desc: "Comandos disponibles" },
          { cmd: "/init", desc: "Generar CLAUDE.md inicial" },
          { cmd: "/clear", desc: "Reiniciar conversación" },
          { cmd: "/model", desc: "Cambiar modelo" },
          { cmd: "/doctor", desc: "Diagnóstico de instalación" },
          { cmd: "@archivo", desc: "Mencionar archivo en prompt" },
          { cmd: "Esc", desc: "Detener acción en curso" },
          { cmd: "Esc Esc / /rewind", desc: "Restaurar checkpoint anterior" }
        ]
      },
      {
        type: "cheatsheet",
        title: "🧠 Gestión de Contexto",
        tag: "Tokens",
        table: [
          { cmd: "/context", desc: "Ver uso actual de la ventana" },
          { cmd: "/usage", desc: "Tokens y costo de la sesión" },
          { cmd: "/compact", desc: "Comprimir historial" },
          { cmd: '/compact "preserva X"', desc: "Compactación dirigida" },
          { cmd: '/memory add "..."', desc: "Persistir entre sesiones" },
          { cmd: "/memory show", desc: "Ver memoria del proyecto" },
          { cmd: '/rename "nombre"', desc: "Nombrar sesión actual" },
          { cmd: "/resume", desc: "Selector de sesiones nombradas" },
          { cmd: "/btw", desc: "Pregunta lateral fuera del historial" }
        ],
        footer: "Compacta antes del 75% del contexto. Sobre 90% y la calidad cae mucho."
      },
      {
        type: "cheatsheet",
        title: "🔌 MCP Quick Reference",
        tag: "Integraciones",
        table: [
          { cmd: "claude mcp add NAME -- CMD", desc: "Servidor stdio" },
          { cmd: "--transport http URL", desc: "Servidor HTTP remoto" },
          { cmd: "--transport sse URL", desc: "Servidor SSE (legacy)" },
          { cmd: "--scope project", desc: "Compartido en .mcp.json" },
          { cmd: "--scope user", desc: "Todos tus proyectos" },
          { cmd: "-e VAR=$VAR", desc: "Variable de entorno" },
          { cmd: '--header "Auth: Bearer X"', desc: "Header HTTP" },
          { cmd: "claude mcp list", desc: "Listar servidores" },
          { cmd: "claude mcp remove NAME", desc: "Desconectar" },
          { cmd: "/mcp", desc: "UI de gestión + OAuth" }
        ],
        footer: "Output limit: MAX_MCP_OUTPUT_TOKENS=50000"
      },
      {
        type: "cheatsheet",
        title: "🧩 Skills — Frontmatter",
        tag: ".claude/skills/",
        table: [
          { cmd: "name", desc: "Nombre del comando" },
          { cmd: "description", desc: "Cuándo auto-invocar (clave)" },
          { cmd: "allowed-tools", desc: "Restricción de tools" },
          { cmd: "argument-hint", desc: "Hint visible en /help" },
          { cmd: "model", desc: "Override del modelo" },
          { cmd: "effort", desc: "low / medium / high / xhigh" },
          { cmd: "context: fork", desc: "Sub-agente aislado" },
          { cmd: "disable-model-invocation", desc: "Solo manual" },
          { cmd: "$1 $2 $ARGUMENTS", desc: "Args en el cuerpo" },
          { cmd: "!`comando`", desc: "Inyectar shell output" }
        ],
        footer: "Ubicaciones: ~/.claude/skills/ personal · .claude/skills/ proyecto"
      },
      {
        type: "cheatsheet",
        title: "🔒 Permission Modes",
        tag: "Seguridad",
        table: [
          { cmd: "plan", desc: "Solo lectura, propone plan" },
          { cmd: "default", desc: "Pregunta por cada tool" },
          { cmd: "acceptEdits", desc: "Auto-acepta ediciones" },
          { cmd: "auto", desc: "IA aprueba/deniega" },
          { cmd: "dontAsk", desc: "Solo allowed-tools" },
          { cmd: "bypassPermissions", desc: "Sin preguntas (sandbox)" }
        ],
        footer: "CI: --dangerously-skip-permissions + sandbox aislado. Local: plan para explorar, acceptEdits para construir."
      },
      {
        type: "cheatsheet",
        title: "⚡ Anthropic API",
        tag: "SDK",
        table: [
          { cmd: "POST /v1/messages", desc: "Conversación principal" },
          { cmd: "POST /v1/messages + stream", desc: "Streaming SSE" },
          { cmd: "POST /v1/messages/batches", desc: "Hasta 10K req, -50%" },
          { cmd: "POST /v1/files (beta)", desc: "Subir documento reutilizable" },
          { cmd: "cache_control", desc: "Prompt caching, -90%" },
          { cmd: "thinking: enabled", desc: "Extended thinking (Opus)" },
          { cmd: "tools: [...]", desc: "Tool use / function calling" },
          { cmd: 'tool_choice: {"type":"any"}', desc: "Forzar uso de tool" }
        ],
        footer: "Modelos: Haiku (rápido/barato) · Sonnet (default) · Opus (crítico)"
      },
      {
        type: "cheatsheet",
        title: "💬 Prompts Efectivos",
        tag: "Patrones",
        list: [
          "[Contexto] primero — qué problema resuelves",
          "[Restricciones] — qué NO hacer",
          "[Archivos] — menciona con @",
          "[Output] — formato esperado",
          "Separa diseño de implementación",
          "Pide verificación (tests, linter)",
          "Una sesión = un objetivo",
          "\"NO implementes aún\" cuando exploras",
          "Pega stack traces COMPLETOS",
          "Pide hipótesis ordenadas por probabilidad"
        ]
      },
      {
        type: "cheatsheet",
        title: "⚙️ Hooks",
        tag: ".claude/settings.json",
        table: [
          { cmd: "PreToolUse", desc: "Antes de ejecutar tool" },
          { cmd: "PostToolUse", desc: "Después de tool" },
          { cmd: "SessionStart", desc: "Al iniciar sesión" },
          { cmd: "SessionEnd", desc: "Al cerrar sesión" },
          { cmd: "UserPromptSubmit", desc: "Antes de enviar prompt" },
          { cmd: "Stop", desc: "Al detener acción" }
        ],
        footer: "Casos típicos: Format on save (Post + Write), audit log (Post), block production files (Pre), inject context (SessionStart)."
      },
      {
        type: "cheatsheet",
        title: "🔧 Troubleshooting",
        tag: "Cuando algo falla",
        table: [
          { issue: "Skill no aparece", solution: "Verifica frontmatter + ruta exacta" },
          { issue: "MCP failed", solution: "`claude mcp get NAME` + revisa env vars" },
          { issue: "Tokens explotan", solution: "`/context` y compactar guiado" },
          { issue: "Permission denied", solution: "`/permissions` o settings.json" },
          { issue: "Claude alucina archivos", solution: "Pásalos con @ explícito" },
          { issue: "Loop sin avance", solution: "Después de 2 errores: `/clear`" },
          { issue: "Lento en CI", solution: "Usa `haiku-4-5` + caching" },
          { issue: "API 429", solution: "Backoff exponencial + retry" },
          { issue: "API 529", solution: "Sobrecarga: reintentar más tarde" }
        ]
      }
    ]
  },

  capstone: {
    title: "🏆 Capstone Project: Tu Asistente de Desarrollo Completo",
    breadcrumb: "Curso / Capstone",
    lead: "El proyecto final que combina TODO lo aprendido. Construirás un asistente de desarrollo personalizado para tu equipo: Skills, MCPs, hooks, CI, y un agente programático con SDK que automatiza tareas reales.",
    content: [
      {
        type: "heading",
        level: 3,
        text: "📐 Lo que vas a construir"
      },
      {
        type: "paragraph",
        text: "Un sistema de 4 capas integradas:"
      },
      {
        type: "code-block",
        lang: "text",
        code: "┌──────────────────────────────────────────────────┐\n│  CAPA 4: AGENTE AUTÓNOMO (Agent SDK)             │\n│  • Revisor de PRs en GitHub Actions              │\n│  • Sub-agentes: seguridad, calidad, performance  │\n│  • Comenta en PRs, falla CI si crítico           │\n└──────────────────────┬───────────────────────────┘\n                       │ usa\n┌──────────────────────▼───────────────────────────┐\n│  CAPA 3: SKILLS DEL EQUIPO (.claude/skills/)     │\n│  • /code-review · /deploy-check · /release-notes │\n│  • /security-audit · /onboarding-guide           │\n└──────────────────────┬───────────────────────────┘\n                       │ se conecta a\n┌──────────────────────▼───────────────────────────┐\n│  CAPA 2: MCP SERVERS (.mcp.json)                 │\n│  • GitHub · PostgreSQL · Sentry                  │\n└──────────────────────┬───────────────────────────┘\n                       │ corre sobre\n┌──────────────────────▼───────────────────────────┐\n│  CAPA 1: CONFIG BASE                             │\n│  • CLAUDE.md · .claudeignore · settings.json     │\n│  • Hooks: format on save, audit log              │\n└──────────────────────────────────────────────────┘"
      },
      {
        type: "heading",
        level: 3,
        text: "🚀 Plan de ejecución (5 sprints)"
      },
      {
        type: "sprint",
        num: 1,
        title: "Fundación del proyecto (~45 min)",
        tasks: [
          {
            title: "Crear el repositorio base",
            code: "mkdir mi-asistente-dev && cd $_ && git init\nnpm init -y\nmkdir -p .claude/{skills,commands} src tests"
          },
          {
            title: "CLAUDE.md profesional",
            desc: "usa el template de la sección Mejores Prácticas. Documenta stack, convenciones, comandos del proyecto."
          },
          {
            title: "Settings y permisos",
            desc: "copia .claude/settings.json de la sección de Seguridad. Configura allowedTools mínimo necesario."
          },
          {
            title: ".claudeignore",
            desc: "excluye node_modules, dist, .env*, secrets."
          }
        ],
        deliverable: "Repo inicial con configuración base. Verifica con /doctor."
      },
      {
        type: "sprint",
        num: 2,
        title: "Suite de Skills del equipo (~60 min)",
        tasks: [
          {
            title: "Implementa estos 5 skills",
            list: [
              "/code-review — revisión por checklist con prioridades",
              "/deploy-check — pre-flight (tests, lint, types, audit)",
              "/security-audit — auditoría de vulnerabilidades",
              "/release-notes — changelog desde commits",
              "/onboarding-guide — guía para nuevos miembros"
            ]
          },
          {
            title: "Cada Skill debe tener allowed-tools mínimo necesario."
          },
          {
            title: "Prueba cada Skill en una sesión real y ajusta el frontmatter si auto-trigger no funciona bien."
          }
        ],
        deliverable: "5 Skills funcionando. Verifica con /help que aparezcan."
      },
      {
        type: "sprint",
        num: 3,
        title: "MCPs conectados (~45 min)",
        tasks: [
          {
            title: "Conecta GitHub MCP",
            code: "claude mcp add --scope project --transport http github \\\n  https://api.githubcopilot.com/mcp/ \\\n  --header \"Authorization: Bearer $GITHUB_TOKEN\""
          },
          {
            title: "Conecta PostgreSQL",
            code: "claude mcp add --scope project --transport stdio db \\\n  -- npx -y @bytebase/dbhub --dsn \"$READONLY_DB_URL\""
          },
          {
            title: "Conecta Sentry",
            code: "claude mcp add --scope user --transport http sentry \\\n  https://mcp.sentry.dev/mcp"
          },
          {
            title: "Verifica con /mcp que los tres aparecen como connected."
          },
          {
            title: "Prueba: Lista mis 3 últimos PRs y los 5 errores más recientes en Sentry"
          }
        ],
        deliverable: "3 MCPs activos. .mcp.json versionado en git (sin secretos)."
      },
      {
        type: "sprint",
        num: 4,
        title: "Hooks y automatización (~30 min)",
        tasks: [
          {
            title: "Hook PostToolUse que formatea código tras cada Write/Edit (prettier/ruff)."
          },
          {
            title: "Hook PreToolUse que bloquea Write en archivos de producción."
          },
          {
            title: "Hook SessionStart que ejecuta git pull y muestra PRs asignados."
          },
          {
            title: "Hook SessionEnd que guarda un resumen en ~/.claude/sessions/."
          }
        ],
        deliverable: "4 hooks funcionando. Pruébalos haciendo cambios reales."
      },
      {
        type: "sprint",
        num: 5,
        title: "Agente autónomo en CI (~60 min)",
        tasks: [
          {
            title: "Crea scripts/pr-reviewer.ts que use el Agent SDK",
            list: [
              "Recibe el PR diff por stdin",
              "Lanza 3 sub-agentes en paralelo (security, quality, performance)",
              "Consolida hallazgos en JSON estructurado",
              "Sale con código 1 si hay bloqueantes críticos"
            ]
          },
          {
            title: "GitHub Action .github/workflows/claude-review.yml",
            list: [
              "Trigger: pull_request",
              "Ejecuta el script con ANTHROPIC_API_KEY de secrets",
              "Comenta hallazgos en el PR vía actions/github-script",
              "Falla CI si hay bloqueantes"
            ]
          },
          {
            title: "Prueba con un PR de mentira que tenga un bug intencional."
          }
        ],
        deliverable: "CI corriendo Claude en cada PR. Comentarios automáticos visibles."
      },
      {
        type: "heading",
        level: 3,
        text: "🎓 Verificación final"
      },
      {
        type: "paragraph",
        text: "Tu Capstone está completo cuando puedes responder \"sí\" a estas preguntas:"
      },
      {
        type: "checklist",
        items: [
          "Cualquier miembro nuevo puede clonar y empezar a trabajar en <15 min",
          "Los 5 Skills se auto-invocan correctamente según el intent",
          "Los 3 MCPs responden y aparecen en /mcp como connected",
          "Los 4 hooks se disparan en los eventos correctos",
          "El CI comenta automáticamente en cada PR abierto",
          "No hay secretos en git (verifica con git log -p | grep -i 'sk-ant\\|password')",
          "El CLAUDE.md explica cómo usar todo lo anterior"
        ]
      },
      {
        type: "info-banner",
        variant: "tip",
        title: "¿Y ahora qué?",
        text: "Comparte tu Capstone con el equipo. Lo que construiste es el comienzo: a partir de aquí cada Skill nueva, cada MCP nuevo, cada hook nuevo multiplica la productividad de todo el equipo. La maestría no termina con el curso — empieza el día que tu equipo deja de programar sin Claude."
      }
    ]
  },

  "nivel-1": {
    title: "Nivel 1 Fundamentos",
    breadcrumb: "Niveles / Nivel 1",
    lead: "Tu primera sesión productiva con Claude Code: instalar, autenticar y conocer los comandos esenciales que usarás a diario.",
    content: [
      {
        type: "heading",
        level: 3,
        text: "1.1 — Instalación"
      },
      {
        type: "paragraph",
        text: "Claude Code requiere Node.js 18+ (recomendado 22 LTS). Hay dos vías oficiales:"
      },
      {
        type: "code-block",
        lang: "bash",
        title: "Instalación vía npm (multiplataforma)",
        code: "# Instalación global con npm\nnpm install -g @anthropic-ai/claude-code\n\n# Verificar la instalación\nclaude --version\n\n# Iniciar la primera sesión en tu proyecto\ncd mi-proyecto/\nclaude"
      },
      {
        type: "code-block",
        lang: "bash",
        title: "Instalador rápido (alternativa oficial)",
        code: "# macOS, Linux, WSL\ncurl -fsSL https://claude.ai/install.sh | bash\n\n# Windows PowerShell\nirm https://claude.ai/install.ps1 | iex"
      },
      {
        type: "heading",
        level: 3,
        text: "1.2 — Autenticación"
      },
      {
        type: "paragraph",
        text: "Antes de tu primera sesión, debes autenticar con Anthropic. Claude Code soporta dos modos: OAuth (recomendado) o API Key manual."
      },
      {
        type: "code-block",
        lang: "bash",
        title: "Autenticación vía OAuth (recomendado)",
        code: "# Abre tu navegador automáticamente para login\nclaude auth login\n\n# Tras autenticar, verifica que estés logueado\nclaude --version\n# Salida: claude-code 2.1.x | Authenticated as: tu@email.com"
      },
      {
        type: "code-block",
        lang: "bash",
        title: "Autenticación con API Key (alternativa)",
        code: "# Obtén tu API Key en https://console.anthropic.com\n# Luego exporta la variable de entorno\nexport ANTHROPIC_API_KEY=\"sk-ant-***tu-clave-secreta***\"\n\n# Verifica que funciona\nclaude -p \"Hola, ¿funcionas?\""
      },
      {
        type: "info-banner",
        variant: "warn",
        icon: "🔐",
        title: "Seguridad",
        text: "Nunca escribas tu API Key en archivos versionados (git) o .claude/settings.json. Usa variables de entorno o la autenticación OAuth."
      },
      {
        type: "heading",
        level: 3,
        text: "1.3 — Comandos esenciales (slash commands)"
      },
      {
        type: "paragraph",
        text: "Una vez dentro de Claude Code, los comandos comienzan con /. Escribe / para ver la lista completa con autocompletado."
      },
      {
        type: "paragraph",
        text: "[Tabla de comandos generada dinámicamente desde COMMANDS_DATA]"
      },
      {
        type: "heading",
        level: 3,
        text: "1.4 — Navegación de archivos con @"
      },
      {
        type: "paragraph",
        text: "Claude Code permite mencionar archivos y directorios directamente con el carácter @ dentro de un prompt — similar a un IDE moderno."
      },
      {
        type: "code-block",
        lang: "text",
        title: "Ejemplo de navegación contextual",
        code: "> Lee @src/auth/login.ts y compáralo con @src/auth/register.ts.\n  Identifica duplicación lógica y propón una refactorización\n  a un módulo @src/auth/shared/validators.ts"
      },
      {
        type: "info-banner",
        variant: "tip",
        icon: "📌",
        title: "Buena práctica",
        text: "Para proyectos grandes, crea un CLAUDE.md en la raíz con el stack, convenciones de código y estructura de carpetas. Claude lo lee automáticamente al iniciar cada sesión."
      }
    ]
  },

  "nivel-2": {
    title: "Nivel 2 Avanzado",
    breadcrumb: "Niveles / Nivel 2",
    lead: "Domina el contexto, configura MCP servers, y optimiza tu flujo de trabajo con memoria y sesiones persistentes.",
    content: [
      {
        type: "heading",
        level: 3,
        text: "2.1 — Gestión avanzada de contexto"
      },
      {
        type: "paragraph",
        text: "La ventana de contexto es el recurso más valioso. Aprende a compactarla, persistirla y diagnosticar ineficiencias."
      },
      {
        type: "list",
        items: [
          "/context: diagnostica el estado actual de la ventana",
          "/usage: visualiza tokens consumidos y costos",
          "/compact: comprime el historial manteniendo información crítica",
          "/memory: guarda aprendizajes entre sesiones"
        ]
      },
      {
        type: "heading",
        level: 3,
        text: "2.2 — Model Context Protocol (MCP)"
      },
      {
        type: "paragraph",
        text: "Conecta Claude a bases de datos, GitHub, Slack, Sentry y herramientas externas."
      },
      {
        type: "code-block",
        lang: "bash",
        code: "# Registrar un servidor MCP\nclaude mcp add github --scope project \\\n  -e GITHUB_TOKEN=ghp_xxxxx \\\n  -- npx @modelcontextprotocol/server-github\n\n# Ver MCPs conectados\nclaude mcp list"
      }
    ]
  },

  "nivel-3": {
    title: "Nivel 3 Experto",
    breadcrumb: "Niveles / Nivel 3",
    lead: "Crea Skills personalizadas, configura hooks deterministas, y construye sistemas de sub-agentes.",
    content: [
      {
        type: "heading",
        level: 3,
        text: "3.1 — Anatomía de un Skill"
      },
      {
        type: "code-block",
        lang: "yaml",
        title: "Ejemplo: /code-review Skill",
        code: "name: code-review\ndescription: |\n  Revisa un PR o changeset y retorna hallazgos organizados\n  por criticidad (bloqueantes, sugerencias, nits).\n  Trigger cuando el usuario menciona 'review', 'pr', 'diff'.\n\nallowed-tools:\n  - Read\n  - Glob\n  - Grep\n\nargument-hint: \"[PR #123 | commit <hash> | diff <file>]\"\n\neffort: medium\n\n---\n\nEres un senior engineer reviewando código.\nAnalyza el diff y retorna:\n1. 🔴 BLOQUEANTES (seguridad, bugs, romper compat)\n2. 🟡 SUGERENCIAS (mejoras de diseño)\n3. 🟢 NITS (typos, espaciado)\n\nPara cada hallazgo: archivo:línea + por qué + fix sugerido."
      },
      {
        type: "heading",
        level: 3,
        text: "3.2 — Hooks para automatización"
      },
      {
        type: "list",
        items: [
          "PreToolUse: valida/bloquea acciones antes de ejecutarse",
          "PostToolUse: ejecuta acciones después de tool (format, tests)",
          "SessionStart: inyecta contexto al iniciar (git status, PRs)",
          "SessionEnd: guarda resumen de la sesión"
        ]
      },
      {
        type: "heading",
        level: 3,
        text: "3.3 — Sub-agentes y orquestación"
      },
      {
        type: "paragraph",
        text: "Crea sistemas donde múltiples agentes especializados trabajan en paralelo (seguridad, performance, calidad de código) y se consolidan en un reporte final."
      }
    ]
  },

  "nivel-4": {
    title: "Nivel 4 Maestría",
    breadcrumb: "Niveles / Nivel 4",
    lead: "Producción a escala: CI/CD, seguridad, equipos y automatización completa.",
    content: [
      {
        type: "heading",
        level: 3,
        text: "4.1 — Seguridad en equipos"
      },
      {
        type: "list",
        items: [
          "Modo plan: revisor propone cambios sin ejecutarlos (exploración segura)",
          ".claudeignore: excluye archivos sensibles",
          "permission-mode: controla qué tools puede usar Claude",
          "Audit logs: rastrea cada acción"
        ]
      },
      {
        type: "heading",
        level: 3,
        text: "4.2 — Scaling to 50+ engineers"
      },
      {
        type: "paragraph",
        text: "Estrategias: Shared Skills library, Centralized memory, Role-based CLAUDE.md templates, Cost tracking by team."
      }
    ]
  },

  instalacion: {
    title: "Instalación Detallada",
    breadcrumb: "Técnico / Instalación",
    lead: "Guía paso a paso para instalar Claude Code en tu sistema.",
    content: [
      {
        type: "paragraph",
        text: "[Sección instalacion]"
      }
    ]
  },

  "primeros-pasos": {
    title: "Primeros Pasos",
    breadcrumb: "Técnico / Primeros Pasos",
    lead: "Tu primer CLAUDE.md y sesión productiva.",
    content: [
      {
        type: "paragraph",
        text: "[Sección primeros-pasos]"
      }
    ]
  },

  "claude-md": {
    title: "CLAUDE.md Profesional",
    breadcrumb: "Técnico / CLAUDE.md",
    lead: "Template y buenas prácticas para documentar tu proyecto.",
    content: [
      {
        type: "paragraph",
        text: "[Sección claude-md]"
      }
    ]
  },

  branching: {
    title: "🌿 Branching Strategy — Ramas con Claude Code",
    breadcrumb: "Técnico / Branching",
    lead: "Estructura de ramas + Claude worktrees para desarrollo sin conflictos.",
    content: [
      {
        type: "code-block",
        lang: "bash",
        title: "Quick Start",
        code: "git checkout -b feature/x\nclaude --worktree feature-x\n/memory add \"Feature X: description\"\n/checkpoint \"Milestone 1 done\"\n# → Continúa sin conflictos de contexto"
      },
      {
        type: "heading",
        level: 3,
        text: "Patrones principales"
      },
      {
        type: "pattern-cards",
        items: [
          {
            title: "Feature Branches + Worktrees",
            description: "Cada feature en rama + worktree aislado. Claude mantiene contexto separado, sin conflictos de historial.",
            code: "claude --worktree feature-auth"
          },
          {
            title: "Long-Lived Branches + Memory Sync",
            description: "Para refactors largos: guarda automáticamente progreso con Memory + auto-commit.",
            code: "/memory add \"Refactor: API v1 → v2\""
          },
          {
            title: "Hotfix + Production Safety",
            description: "Para emergencias: worktree + permission-mode auto. Merge rápido a main + develop.",
            code: "git checkout -b hotfix/csrf"
          }
        ]
      },
      {
        type: "info-banner",
        title: "Lectura completa",
        text: "Ver BRANCHING_STRATEGY.md en el proyecto para 10 patrones detallados."
      }
    ]
  },

  rules: {
    title: "📋 .rules & CLAUDE.md — Reglas Determinísticas",
    breadcrumb: "Técnico / Reglas",
    lead: "Instrucciones que se aplican automáticamente en cada sesión.",
    content: [
      {
        type: "info-box",
        title: "¿Qué son las rules?",
        text: "Rules = instrucciones que SIEMPRE se ejecutan automáticamente. Skills = sugerencias que Claude considera aplicar."
      },
      {
        type: "heading",
        level: 3,
        text: "Dónde viven las rules"
      },
      {
        type: "code-block",
        lang: "text",
        code: ".claude/\n├── CLAUDE.md          # Guía del proyecto (versionado)\n├── rules.md           # Reglas específicas\n├── rules.local.md     # Reglas sensibles (gitignore)\n└── settings.json      # Config + hooks"
      },
      {
        type: "heading",
        level: 3,
        text: "Ejemplo de rules en CLAUDE.md"
      },
      {
        type: "code-block",
        lang: "markdown",
        code: "# PROJECT RULES\n\n## Code Style\n- Use 2-space indentation\n- Prefer const over let\n- Always use 'strict' mode\n\n## Database\n- All queries use transactions\n- Never raw SQL (use ORM)\n- Schema changes = migration\n\n## Testing\n- Every function needs tests\n- Min coverage: 80%\n- Use Jest + React Testing Library"
      },
      {
        type: "heading",
        level: 3,
        text: "Cómo aplicar rules"
      },
      {
        type: "list",
        items: [
          "Manual: Escribe rules en CLAUDE.md, Claude las lee automáticamente",
          "Hooks: Valida reglas antes de cada commit vía pre-commit hooks",
          "CI/CD: ESLint, TypeScript, Tests — verificación automática"
        ]
      }
    ]
  },

  memory: {
    title: "💾 Memory Management — Persistencia Entre Sesiones",
    breadcrumb: "Técnico / Memoria",
    lead: "Sistema que mantiene información sin usar historial de conversación.",
    content: [
      {
        type: "info-box",
        title: "3 Niveles de Memory",
        items: [
          { label: "Session", desc: "Esta sesión (se pierde al cerrar)" },
          { label: "Project", desc: "Todos los devs del proyecto (versionado en git)" },
          { label: "Global", desc: "Todos tus proyectos (permanente)" }
        ]
      },
      {
        type: "heading",
        level: 3,
        text: "Comandos principales"
      },
      {
        type: "memory-commands",
        commands: [
          {
            cmd: "/memory add \"Database: PostgreSQL + Prisma ORM\"",
            desc: "Agregar entrada a memoria del proyecto"
          },
          {
            cmd: "/memory search \"database\"",
            desc: "Buscar en memoria existente"
          },
          {
            cmd: "/memory list",
            desc: "Ver toda la memoria del proyecto"
          }
        ]
      },
      {
        type: "heading",
        level: 3,
        text: "Estructura recomendada en project memory"
      },
      {
        type: "code-block",
        lang: "text",
        code: "memory/\n├── architecture.md        # Stack, decisiones principales\n├── api-spec.md           # Endpoints, schemas\n├── database.md           # Schema, migrations\n├── deployment.md         # Envs, CI/CD\n├── learned-lessons.md    # Bugs, soluciones, antipatterns\n└── performance.md        # Benchmarks, bottlenecks"
      }
    ]
  },

  patrones: {
    title: "🔄 Patrones de Comandos — Workflows Reutilizables",
    breadcrumb: "Técnico / Patrones",
    lead: "10+ secuencias de comandos que resuelven problemas comunes.",
    content: [
      {
        type: "info-box",
        title: "Patrones incluidos",
        items: [
          "✅ Code Review en nueva sesión",
          "✅ Refactor largo + Memory + Checkpoints",
          "✅ Bug Hunt: Hypothesis-driven investigation",
          "✅ Performance optimization sprint",
          "✅ Security audit + fix",
          "✅ Dependency upgrade safe",
          "✅ Onboarding nuevo developer",
          "✅ Incident response (production)",
          "✅ Documentation sprint",
          "✅ Performance regression detection"
        ]
      },
      {
        type: "heading",
        level: 3,
        text: "Patrón #1: Code Review de PR"
      },
      {
        type: "code-block",
        lang: "bash",
        code: "# Retomar contexto sin contaminar rama actual\nclaude --from-pr 247\n\n# Dentro de Claude:\n/permissions  # Verificar permisos\n@src/auth    # Cargar archivos del PR\n\"¿Qué problemas ves en este código?\"\n\n/doctor      # Diagnosticar estado\n/usage       # Tokens consumidos\n\nexit\n# Sesión anterior recupera su contexto"
      },
      {
        type: "heading",
        level: 3,
        text: "Patrón #2: Refactor Largo (3+ días)"
      },
      {
        type: "code-block",
        lang: "bash",
        code: "# Día 1: Setup\ngit checkout -b refactor/api-v2\nclaude --worktree refactor-api-v2\n/memory add \"Refactor: API v1 → v2...\"\n/checkpoint \"Milestone 1: /users endpoint done\"\n\n# Día 2: Retomar\nclaude -c    # Resume última sesión\n/memory search \"refactor\"\n/rewind      # Ver checkpoints\n# Continúa desde donde dejaste\n\n# Día 3: Finalizar\n/compact \"Mantén refactor, descarta logs\"\nclaude commit\n# Merge a develop"
      },
      {
        type: "heading",
        level: 3,
        text: "Patrón #3: Bug Hunt Sistemático"
      },
      {
        type: "code-block",
        lang: "bash",
        code: "/memory add \"BUG #247: Delayed notifications (5-10min late)\"\n\n# Hypothesis 1: Queue backlog?\n@src/queue/config.js\n\"¿Hay backlog?\"\n/memory add \"Hypothesis 1: REJECTED (queue is fine)\"\n\n# Hypothesis 2: External API timeout?\n@src/services/email-service.js\n\"¿SendGrid timeout?\"\n/memory add \"Hypothesis 2: REJECTED\"\n\n# Hypothesis 3: ✅ Database lock?\n@src/models/notification.js\n\"Missing index?\"\n/memory add \"Hypothesis 3: ✅ CONFIRMED — add index\"\n\n# Fix + Verify\n# Create migration → Test → Deploy"
      }
    ]
  },

  proyectos: {
    title: "Casos de Proyectos",
    breadcrumb: "Técnico / Proyectos",
    lead: "Configuración de Claude Code para diferentes tipos de proyectos.",
    content: [
      {
        type: "paragraph",
        text: "[Sección proyectos]"
      }
    ]
  },

  "git-workflows": {
    title: "🌿 Git Workflows Reales en Producción",
    breadcrumb: "Avanzado / Git Workflows",
    lead: "Tres flujos probados: Trunk-based, Gitflow, Worktrees. Con commits reales del repo y comandos copy-paste.",
    content: [
      {
        type: "workflow-card",
        name: "Flujo A",
        title: "Trunk-Based Development",
        badge: "✅ Recomendado para: Equipos 2-8, ciclos cortos",
        whenToUse: [
          "Equipos pequeños (2-8 personas)",
          "Ciclos de release cortos (diarios/semanales)",
          "CI/CD sólido y tests confiables"
        ],
        code: "# 1. Sincroniza master\ngit checkout master && git pull origin master\n\n# 2. Feature branch corta (max 1 día)\ngit checkout -b fix/auth-token-refresh\n\n# 3. Commits atómicos\ngit commit -m \"fix: refresh token antes de expiración\n- Valida expiration en middleware\n- Usa /refresh endpoint\n- Tests en auth.spec.ts\"\n\n# 4. Push + PR\ngit push -u origin fix/auth-token-refresh\n# → Crear PR, code review\n# → Merge vía GitHub cuando CI pasa\n\n# 5. Cleanup\ngit checkout master\ngit pull origin master\ngit branch -d fix/auth-token-refresh",
        pros: [
          "Integración continua = menos conflictos",
          "Deploy más seguro (cambios pequeños)",
          "Feedback rápido en code review"
        ],
        cons: [
          "Requiere CI/CD sólido",
          "Tests deben ser confiables",
          "Presión para merge rápido"
        ]
      },
      {
        type: "workflow-card",
        name: "Flujo B",
        title: "Feature Branches + Gitflow",
        badge: "📊 Recomendado para: Equipos 8-20, releases planeadas",
        structure: "master              # Producción (tagged: v1.0.0)\nstaging             # Pre-producción\ndevelop             # Integración (siempre releasable)\n├── feature/*       # Nuevas features\n├── hotfix/*        # Fixes urgentes\n└── release/*       # Preparar release",
        code: "# STEP 1: Feature branch desde develop\ngit checkout -b feature/otp-auth develop\n\n# ... trabajo normal ...\ngit commit -m \"feat: agregar TOTP authentication\"\ngit push origin feature/otp-auth\n# → PR develop ← feature/otp-auth\n\n# STEP 2: Code freeze para release\ngit checkout -b release/2.5.0 develop\n# Edita package.json, CHANGELOG.md\ngit commit -m \"chore: bump to v2.5.0\"\n\n# STEP 3: Tests finales + tag\nnpm test && npm run build\ngit tag -a v2.5.0 -m \"Release 2.5.0\"\n\n# STEP 4: Merge a master + back a develop\ngit checkout master && git pull origin master\ngit merge --no-ff release/2.5.0\ngit push origin master v2.5.0\n\ngit checkout develop\ngit merge --no-ff master\ngit push origin develop\n\n# CLEANUP\ngit branch -d release/2.5.0"
      },
      {
        type: "workflow-card",
        name: "Flujo C",
        title: "Git Worktrees (Paralelismo)",
        badge: "⚡ Recomendado para: Trabajar en múltiples branches en paralelo",
        desc: "Cada worktree = directorio separado, trabaja en 2-3 cosas en paralelo sin 'git checkout'.",
        code: "# Opción 1: Manual git worktree\ngit worktree add ~/work/auth-refactor -b feature/auth-refactor\ncd ~/work/auth-refactor\n# ... edita, commit, push ...\n\n# Opción 2: Automático con Claude Code\nclaude --worktree feature/auth-refactor\n> Refactoriza @src/auth/ (en ese worktree aislado)\n\n# Listing\ngit worktree list\n# /home/user/work/auth-refactor  abc1234 [feature/auth-refactor]\n\n# Cleanup\ngit worktree remove ~/work/auth-refactor"
      },
      {
        type: "comparison-table",
        headers: ["Aspecto", "Trunk-Based", "Gitflow", "Worktrees"],
        rows: [
          ["Complejidad", "Baja", "Media", "Media (intuitiva)"],
          ["Release cycle", "Diario/semanal", "Cada 2-4 sem", "Variable"],
          ["Equipo ideal", "2-8", "8-20+", "Cualquiera"],
          ["CI/CD req", "Sólido", "Moderado", "Sólido"],
          ["Merge conflicts", "Frecuentes (pequeños)", "Menos frecuentes", "Cero (isolated)"]
        ]
      }
    ]
  },

  "mcp-use-cases": {
    title: "🔗 MCP Servers by Use Case",
    breadcrumb: "Avanzado / MCP Casos de Uso",
    lead: "GitHub, PostgreSQL, Slack y otros MCPs configurados para casos reales. Setup copy-paste listo.",
    content: [
      {
        type: "mcp-card",
        title: "GitHub MCP: PR Reviews & Issue Creation",
        badge: "Perfect for: Code review automation, issue tracking",
        why: [
          "Automaticar code review línea-por-línea",
          "Crear issues desde sesión Claude",
          "Query PR diffs sin salir del CLI",
          "Integrar feedback en tiempo real"
        ],
        code: "# Opción 1: User scope (global)\nclaude mcp add --scope user github \\\n  -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxx \\\n  -- npx -y @modelcontextprotocol/server-github"
      },
      {
        type: "mcp-card",
        title: "PostgreSQL MCP: Data Exploration",
        badge: "Perfect for: Database debugging, schema analysis",
        why: [
          "Ejecutar queries sin psql CLI",
          "Explorar schema de la DB en tiempo real",
          "Debugging de datos en producción",
          "Backups y exports automáticos"
        ]
      },
      {
        type: "mcp-card",
        title: "Slack MCP: Notifications & Audit Trail",
        badge: "Perfect for: Team notifications, audit logging",
        why: [
          "Notificar al equipo desde Claude automáticamente",
          "Crear audit trail en Slack para decisiones",
          "Alertas de CI/CD failures",
          "Integración con workflows"
        ]
      }
    ]
  },

  "hooks-production": {
    title: "🎣 Hooks in Production",
    breadcrumb: "Avanzado / Hooks",
    lead: "5 hooks reales que automatizan seguridad, tests, y monitoreo. Configuración lista para copiar.",
    content: [
      {
        type: "hook-card",
        num: 1,
        title: "Security Audit (PreToolUse)",
        desc: "Valida cada acción antes de ejecutarla — bloquea comandos peligrosos.",
        code: "{\n  \"hooks\": {\n    \"PreToolUse\": {\n      \"enabled\": true,\n      \"rules\": [\n        {\n          \"name\": \"Block dangerous commands\",\n          \"pattern\": \"(rm -rf|eval|curl.*\\\\||sh -c|sudo)\",\n          \"action\": \"block\",\n          \"message\": \"Comando potencialmente peligroso. Requiere aprobación.\"\n        },\n        {\n          \"name\": \"Block PII exposure\",\n          \"pattern\": \"(password|token|secret|API_KEY)\\\\s*=\",\n          \"action\": \"block\",\n          \"message\": \"Detectado intento de escribir credenciales. No permitido.\"\n        }\n      ]\n    }\n  }\n}"
      },
      {
        type: "hook-card",
        num: 2,
        title: "Auto-Format + Tests (PostToolUse)",
        desc: "Después de escribir código, formatea automáticamente y corre tests.",
        code: "{\n  \"hooks\": {\n    \"PostToolUse\": {\n      \"enabled\": true,\n      \"sequence\": [\n        { \"name\": \"Format code\", \"command\": \"npm run format\", \"onError\": \"warn\" },\n        { \"name\": \"Lint check\", \"command\": \"npm run lint\", \"onError\": \"warn\" },\n        { \"name\": \"Run tests\", \"command\": \"npm test -- --watch=false\", \"onError\": \"abort\" }\n      ]\n    }\n  }\n}"
      },
      {
        type: "hook-card",
        num: 3,
        title: "Context Injection (UserPromptSubmit)",
        desc: "Inyecta automáticamente contexto relevante (git status, memory) antes de procesar prompts."
      },
      {
        type: "hook-card",
        num: 4,
        title: "Cost Warning (PreToolUse)",
        desc: "Advierte si una acción va a consumir muchos tokens o hacer muchas API calls."
      },
      {
        type: "hook-card",
        num: 5,
        title: "Performance Monitoring (PostToolUse)",
        desc: "Registra timing, tokens, y recursos de cada acción para análisis posterior."
      }
    ]
  },

  "multi-mcp-orchestration": {
    title: "🎼 Multi-MCP Orchestration",
    breadcrumb: "Avanzado / Orquestación",
    lead: "Patrones de coordinación: Fork-Join para paralelismo, Cascading Validation para secuencias.",
    content: [
      {
        type: "orchestration-card",
        title: "Patrón 1: Fork-Join (Paralelismo con MCPs)",
        desc: "Ejecuta múltiples MCPs en paralelo y agrega resultados. Ideal para análisis multi-fuente.",
        when: "Cuando necesitas información de múltiples fuentes (GitHub + PostgreSQL + Slack) en paralelo."
      },
      {
        type: "orchestration-card",
        title: "Patrón 2: Cascading Validation",
        desc: "Validaciones secuenciales: cada paso ejecuta solo si anterior pasó. Ideal para CI/CD.",
        flow: "Lint → Format → Typecheck → Tests → Build → Merge"
      },
      {
        type: "comparison-table",
        title: "Recomendaciones por Tamaño de Equipo",
        headers: ["Tamaño", "Workflow", "MCPs Clave", "Paralelismo"],
        rows: [
          ["Solo tú", "Trunk-based", "GitHub", "Worktrees"],
          ["2-5", "Trunk-based", "GitHub + Slack", "Forks"],
          ["5-15", "Gitflow", "GitHub + PostgreSQL + Slack", "Cascading + Forks"],
          ["15+", "Multi-repo", "↑ + Custom MCPs", "Orchestration avanzado"]
        ]
      }
    ]
  },

  "agente-sdk": {
    title: "🤖 Claude Agent SDK",
    breadcrumb: "Profundización / Agent SDK",
    lead: "El Agent SDK te permite construir agentes autónomos programáticamente, integrando Claude en tus propias aplicaciones con control total sobre el ciclo de herramientas, la memoria y la orquestación multi-agente.",
    content: [
      {
        type: "heading",
        level: 3,
        text: "¿Por qué usar el SDK vs Claude Code directamente?"
      },
      {
        type: "comparison-grid",
        items: [
          {
            title: "Claude Code CLI",
            bullets: [
              "Sesiones interactivas en terminal",
              "Ideal para desarrollo diario del equipo",
              "Skills y hooks sin código",
              "El agente controla el flujo"
            ]
          },
          {
            title: "Agent SDK (programático)",
            accent: true,
            bullets: [
              "Integración en apps y servicios",
              "Control total del flujo y herramientas",
              "Multi-agente coordinado en código",
              "Ideal para productos y automatizaciones"
            ]
          }
        ]
      },
      {
        type: "code-block",
        lang: "bash",
        title: "Instalación del SDK oficial",
        code: "# TypeScript / Node.js\nnpm install @anthropic-ai/sdk\n\n# Python\npip install anthropic\n\n# Con soporte para agentes (incluye herramientas extra)\nnpm install @anthropic-ai/sdk @anthropic-ai/claude-code"
      },
      {
        type: "code-block",
        lang: "typescript",
        title: "TypeScript — agente con tool_use",
        code: "import Anthropic from '@anthropic-ai/sdk';\nimport { execSync } from 'child_process';\nimport { readFileSync } from 'fs';\n\nconst client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });\n\nconst tools: Anthropic.Tool[] = [\n  {\n    name: 'read_file',\n    description: 'Lee el contenido de un archivo del sistema',\n    input_schema: {\n      type: 'object',\n      properties: {\n        path: { type: 'string', description: 'Ruta al archivo' }\n      },\n      required: ['path']\n    }\n  },\n  {\n    name: 'run_bash',\n    description: 'Ejecuta un comando bash y devuelve stdout',\n    input_schema: {\n      type: 'object',\n      properties: {\n        command: { type: 'string', description: 'Comando a ejecutar' }\n      },\n      required: ['command']\n    }\n  }\n];\n\nasync function runAgent(userMessage: string) {\n  const messages: Anthropic.MessageParam[] = [\n    { role: 'user', content: userMessage }\n  ];\n\n  while (true) {\n    const response = await client.messages.create({\n      model: 'claude-sonnet-4-6',\n      max_tokens: 4096,\n      tools,\n      messages\n    });\n\n    // Añadir respuesta al historial\n    messages.push({ role: 'assistant', content: response.content });\n\n    if (response.stop_reason === 'end_turn') break;\n\n    if (response.stop_reason === 'tool_use') {\n      const toolResults: Anthropic.ToolResultBlockParam[] = [];\n\n      for (const block of response.content) {\n        if (block.type !== 'tool_use') continue;\n\n        let result = '';\n        if (block.name === 'read_file') {\n          result = readFileSync((block.input as any).path, 'utf8');\n        } else if (block.name === 'run_bash') {\n          result = execSync((block.input as any).command, { encoding: 'utf8' });\n        }\n\n        toolResults.push({\n          type: 'tool_result',\n          tool_use_id: block.id,\n          content: result\n        });\n      }\n\n      messages.push({ role: 'user', content: toolResults });\n    }\n  }\n\n  // Extraer texto final\n  const lastMsg = messages[messages.length - 1];\n  const content = Array.isArray(lastMsg.content) ? lastMsg.content : [];\n  return content.find(b => b.type === 'text')?.text ?? '';\n}\n\n// Uso\nconst result = await runAgent(\n  'Lee @src/index.ts y dame un resumen de la arquitectura'\n);\nconsole.log(result);"
      },
      {
        type: "paragraph",
        text: "[Sección agente-sdk - versión resumida con ejemplos de streaming, multi-agente, prompt caching y computer use]"
      }
    ]
  },

  "api-anthropic": {
    title: "Anthropic API",
    breadcrumb: "Profundización / API",
    lead: "Referencia completa de la Anthropic API con ejemplos de Messages, streaming, batch y prompt caching.",
    content: [
      {
        type: "paragraph",
        text: "[Sección api-anthropic con documentación de endpoints, modelos, streaming, vision, batch y prompt caching]"
      }
    ]
  },

  "skills-avanzados": {
    title: "🧩 Skills Avanzados",
    breadcrumb: "Avanzado / Skills",
    lead: "Crea Skills complejos con frontmatter avanzado, sub-agentes y orquestación.",
    content: [
      {
        type: "paragraph",
        text: "[Sección skills-avanzados con 5+ ejemplos de Skills: /code-review, /deploy-check, /security-audit, /release-notes, /onboarding-guide]"
      }
    ]
  },

  "ci-cd": {
    title: "🚀 CI/CD — Automatización en Producción",
    breadcrumb: "Producción / CI/CD",
    lead: "Integra Claude Code en pipelines de GitHub Actions, GitLab CI, Jenkins. Desde reviews automáticos hasta despliegues asistidos.",
    content: [
      {
        type: "paragraph",
        text: "[Sección ci-cd con ejemplos de GitHub Actions, CI/CD headless, modo plan, permisos restrictivos, cost tracking]"
      }
    ]
  },

  "intro-acc": {
    title: "Introducción Accesible",
    breadcrumb: "Accesible / Intro",
    lead: "Para usuarios nuevos sin experiencia previa.",
    content: [
      {
        type: "paragraph",
        text: "[Sección intro-acc - oculta por defecto]"
      }
    ]
  },

  "casos-rol": {
    title: "Casos por Rol",
    breadcrumb: "Accesible / Roles",
    lead: "Claude Code según tu rol en el equipo.",
    content: [
      {
        type: "paragraph",
        text: "[Sección casos-rol - oculta por defecto]"
      }
    ]
  },

  glosario: {
    title: "Glosario",
    breadcrumb: "Referencia / Glosario",
    lead: "Términos y conceptos clave.",
    content: [
      {
        type: "paragraph",
        text: "[Sección glosario - oculta por defecto]"
      }
    ]
  },

  memoria: {
    title: "Memoria Persistente",
    breadcrumb: "Configuración / Memoria",
    lead: "Cómo gestionar la memoria entre sesiones.",
    content: [
      {
        type: "paragraph",
        text: "[Sección memoria]"
      }
    ]
  },

  seguridad: {
    title: "Seguridad y Permisos",
    breadcrumb: "Producción / Seguridad",
    lead: "Configuración segura de Claude Code en equipos.",
    content: [
      {
        type: "paragraph",
        text: "[Sección seguridad]"
      }
    ]
  },

  "casos-uso": {
    title: "Casos de Uso Reales",
    breadcrumb: "Industria / Casos",
    lead: "Ejemplos de implementación en diferentes contextos.",
    content: [
      {
        type: "paragraph",
        text: "[Sección casos-uso]"
      }
    ]
  },

  "mejores-practicas": {
    title: "Mejores Prácticas",
    breadcrumb: "Producción / Mejores Prácticas",
    lead: "Recomendaciones de senior engineers.",
    content: [
      {
        type: "paragraph",
        text: "[Sección mejores-practicas]"
      }
    ]
  },

  terminal: {
    title: "Terminal y CLI",
    breadcrumb: "Referencia / Terminal",
    lead: "Referencia de comandos CLI.",
    content: [
      {
        type: "paragraph",
        text: "[Sección terminal]"
      }
    ]
  },

  recursos: {
    title: "Recursos y Enlaces",
    breadcrumb: "Referencia / Recursos",
    lead: "Enlaces a documentación oficial y comunidad.",
    content: [
      {
        type: "paragraph",
        text: "[Sección recursos]"
      }
    ]
  }
};

export default ALL_SECTIONS_CONTENT;
