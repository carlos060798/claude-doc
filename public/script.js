/* =========================================================================
   CLAUDE CODE MASTERY — SCRIPT
   JavaScript Vanilla (sin dependencias) — SPA con:
     1. COMMANDS_DATA / SCENARIOS  — datos centralizados
     2. Navegación entre secciones
     3. Buscador en tiempo real
     4. Renderizado de tablas de comandos
     5. Resaltado de sintaxis ligero (regex-based)
     6. Botones de copiado en cada bloque de código
     7. Simulador de terminal animado

   ESCALABILIDAD:
   - Para añadir comandos: agrégalos al array COMMANDS_DATA con su
     {cmd, desc, level, example}. La búsqueda y las tablas se actualizan
     solas en el siguiente reload.
   - Para añadir un escenario al simulador: añade una entrada en
     SCENARIOS con un array de líneas ({type, text, delay}).
   - Para añadir secciones: crea un <section data-section="x"> en el HTML
     y un <a data-section="x"> en el sidebar — el router las enlaza solo.
   - Para soportar más lenguajes en el highlighter: extiende
     SYNTAX_RULES[lang] con tus reglas regex.
   ========================================================================= */

(() => {
    'use strict';

    /* ============================================================
       1. DATOS — Catálogo de comandos
       Fuente: documentación oficial de Anthropic + práctica real.
       ============================================================ */
    const COMMANDS_DATA = [
        // --- Nivel 1: Fundamentos ---
        { cmd: 'claude',      level: 1, category: 'shell',
          desc: 'Inicia Claude Code en el directorio actual.',
          example: 'cd mi-proyecto && claude' },
        { cmd: 'claude --version', level: 1, category: 'shell',
          desc: 'Muestra la versión instalada del CLI.',
          example: 'claude --version' },
        { cmd: '/help',       level: 1, category: 'built-in',
          desc: 'Lista todos los comandos disponibles en la sesión actual.',
          example: '/help' },
        { cmd: '/init',       level: 1, category: 'built-in',
          desc: 'Genera un CLAUDE.md inicial analizando tu proyecto.',
          example: '/init' },
        { cmd: '/clear',      level: 1, category: 'built-in',
          desc: 'Limpia el historial de la conversación e inicia sesión fresca.',
          example: '/clear' },
        { cmd: '/model',      level: 1, category: 'built-in',
          desc: 'Cambia el modelo activo (Opus / Sonnet / Haiku).',
          example: '/model claude-sonnet-4-6' },
        { cmd: '@archivo',    level: 1, category: 'mention',
          desc: 'Menciona un archivo o carpeta para cargarlo en contexto.',
          example: 'Refactoriza @src/auth/login.ts' },
        { cmd: 'claude auth login', level: 1, category: 'shell',
          desc: 'Inicia sesión con OAuth. Abre el navegador para autenticar.',
          example: 'claude auth login' },
        { cmd: 'claude -p "..."', level: 1, category: 'shell',
          desc: 'Modo headless/no-interactivo. Envía un prompt y obtiene respuesta sin sesión interactiva.',
          example: 'claude -p "Revisa estos tests" < tests.js --output-format json' },
        { cmd: '/doctor',     level: 1, category: 'built-in',
          desc: 'Diagnóstico de la instalación y configuración. Verifica CLAUDE.md, variables de entorno, etc.',
          example: '/doctor' },

        // --- Nivel 2: Avanzado / MCP ---
        { cmd: '/compact',    level: 2, category: 'built-in',
          desc: 'Comprime el historial preservando lo esencial. Pasa instrucciones para guiar la compactación.',
          example: '/compact mantén el plan de migración y descarta logs' },
        { cmd: '/context',    level: 2, category: 'built-in',
          desc: 'Muestra el uso actual de la ventana de contexto.',
          example: '/context' },
        { cmd: '/usage',      level: 2, category: 'built-in',
          desc: 'Muestra el consumo de tokens y costo estimado de la sesión.',
          example: '/usage' },
        { cmd: '/mcp',        level: 2, category: 'built-in',
          desc: 'Lista los servidores MCP conectados y sus herramientas.',
          example: '/mcp' },
        { cmd: 'claude mcp add', level: 2, category: 'shell',
          desc: 'Registra un nuevo servidor MCP (stdio por defecto).',
          example: 'claude mcp add github -e GITHUB_TOKEN -- npx -y @modelcontextprotocol/server-github' },
        { cmd: 'claude mcp list', level: 2, category: 'shell',
          desc: 'Lista los servidores MCP registrados con su estado.',
          example: 'claude mcp list' },
        { cmd: 'claude mcp get',  level: 2, category: 'shell',
          desc: 'Muestra detalles de un servidor MCP (debug).',
          example: 'claude mcp get github' },
        { cmd: 'claude mcp add --transport sse', level: 2, category: 'shell',
          desc: 'Registra un servidor MCP remoto vía Server-Sent Events.',
          example: 'claude mcp add --transport sse remoto https://api.example.com/mcp/sse' },
        { cmd: 'claude mcp remove', level: 2, category: 'shell',
          desc: 'Desconecta y elimina un servidor MCP registrado.',
          example: 'claude mcp remove github' },
        { cmd: '/memory',     level: 2, category: 'built-in',
          desc: 'Gestiona la memoria persistente del proyecto. Persiste información entre sesiones.',
          example: '/memory add "Arquitectura: Next.js + Prisma"' },
        { cmd: '/config',     level: 2, category: 'built-in',
          desc: 'Muestra o modifica la configuración dentro de la sesión (settings.json equivalente).',
          example: '/config set model claude-opus-4-7' },

        // --- Nivel 3: Experto / Skills ---
        { cmd: '/skill-name', level: 3, category: 'custom',
          desc: 'Invoca una Skill personalizada definida en .claude/skills/<name>/SKILL.md',
          example: '/security-audit' },
        { cmd: '/fork',       level: 3, category: 'built-in',
          desc: 'Bifurca la conversación en una nueva sesión paralela.',
          example: '/fork' },
        { cmd: '/team-onboarding', level: 3, category: 'built-in',
          desc: 'Genera una guía de onboarding desde tu CLAUDE.md, skills y hooks.',
          example: '/team-onboarding' },
        { cmd: '$ARGUMENTS / $1 $2', level: 3, category: 'placeholder',
          desc: 'Placeholders para argumentos dinámicos en una Skill.',
          example: '/fix-issue 247 high' },
        { cmd: '!`comando`',  level: 3, category: 'syntax',
          desc: 'Ejecuta un comando bash dentro del contenido de un Skill (con allowed-tools).',
          example: '!`git diff HEAD~1`' },

        // --- CLI flags avanzados ---
        { cmd: 'claude --worktree', level: 2, category: 'shell',
          desc: 'Inicia sesión en un git worktree aislado — para trabajar en paralelo sin conflictos.',
          example: 'claude --worktree feature-auth' },
        { cmd: 'claude --from-pr', level: 2, category: 'shell',
          desc: 'Retoma una sesión enlazada a un PR específico de GitHub.',
          example: 'claude --from-pr 247' },
        { cmd: 'claude --permission-mode', level: 2, category: 'shell',
          desc: 'Controla el nivel de autonomía: plan, auto, bypassPermissions.',
          example: 'claude --permission-mode auto -p "fix all lint errors"' },
        { cmd: 'claude -c', level: 1, category: 'shell',
          desc: 'Continúa la conversación más reciente (sin iniciar sesión nueva).',
          example: 'claude -c' },
        { cmd: 'claude -r', level: 1, category: 'shell',
          desc: 'Abre el selector de sesiones previas para reanudar.',
          example: 'claude -r' },
        { cmd: 'claude commit', level: 1, category: 'shell',
          desc: 'Crea un commit git con mensaje generado automáticamente por Claude.',
          example: 'claude commit' },

        // --- Comandos de sesión avanzados ---
        { cmd: '/rewind',     level: 2, category: 'built-in',
          desc: 'Abre el menú de checkpoints para restaurar un estado anterior de la sesión.',
          example: '/rewind' },
        { cmd: '/rename',     level: 2, category: 'built-in',
          desc: 'Asigna un nombre descriptivo a la sesión actual para recuperarla después.',
          example: '/rename "refactor-auth-module"' },
        { cmd: '/resume',     level: 2, category: 'built-in',
          desc: 'Muestra el selector de sesiones nombradas para continuar donde lo dejaste.',
          example: '/resume' },
        { cmd: '/permissions', level: 2, category: 'built-in',
          desc: 'Muestra y edita los permisos de herramientas de la sesión actual.',
          example: '/permissions' },
        { cmd: '/login',      level: 1, category: 'built-in',
          desc: 'Cambia de cuenta de Anthropic o vuelve a autenticarte en la sesión.',
          example: '/login' },
        { cmd: '/btw',        level: 2, category: 'built-in',
          desc: 'Hace una pregunta lateral que NO entra en el historial de conversación.',
          example: '/btw ¿cuántos tokens cuesta este prompt?' },

        // --- Agent SDK ---
        { cmd: 'npm install @anthropic-ai/claude-agent-sdk', level: 3, category: 'sdk',
          desc: 'Instala el Claude Agent SDK oficial (TypeScript).',
          example: 'npm install @anthropic-ai/claude-agent-sdk' },
        { cmd: 'pip install claude-agent-sdk', level: 3, category: 'sdk',
          desc: 'Instala el Claude Agent SDK oficial (Python).',
          example: 'pip install claude-agent-sdk' },
        { cmd: 'query()', level: 3, category: 'sdk',
          desc: 'Función principal del Agent SDK: ejecuta un agente autónomo con herramientas.',
          example: 'for await (const msg of query({ prompt: "Fix bug in auth.ts" })) {}' },

        // --- MCP avanzado ---
        { cmd: 'claude mcp add --scope project', level: 2, category: 'shell',
          desc: 'Registra un MCP server a nivel de proyecto (se guarda en .mcp.json, compartible en git).',
          example: 'claude mcp add --scope project --transport http github https://api.githubcopilot.com/mcp/' },
        { cmd: 'claude mcp add --scope user', level: 2, category: 'shell',
          desc: 'Registra un MCP server a nivel de usuario (disponible en todos tus proyectos).',
          example: 'claude mcp add --scope user --transport http hubspot https://mcp.hubspot.com/anthropic' },
        { cmd: 'claude mcp serve', level: 3, category: 'shell',
          desc: 'Expone Claude Code como un servidor MCP para que otros clientes se conecten.',
          example: 'claude mcp serve' },

        // --- NUEVOS COMANDOS NIVEL 1 (Debug & Diagnóstico) ---
        { cmd: 'claude --doctor', level: 1, category: 'debug',
          desc: 'Diagnóstico completo: instalación, permisos, CLAUDE.md, configuración.',
          example: 'claude --doctor' },
        { cmd: '/trace', level: 1, category: 'debug',
          desc: 'Modo verbose mostrando timing de cada herramienta y salida detallada.',
          example: '/trace' },
        { cmd: 'claude --dry-run', level: 1, category: 'shell',
          desc: 'Simula ejecución sin cambios reales (read-only mode para exploración segura).',
          example: 'claude -p "Refactoriza auth.ts" --dry-run' },

        // --- NUEVOS COMANDOS NIVEL 2 (Debugging, Performance, Optimization) ---
        { cmd: '/debug', level: 2, category: 'debug',
          desc: 'Panel interactivo: últimas tool calls, variables, profiler de performance.',
          example: '/debug' },
        { cmd: '/token-count', level: 2, category: 'perf',
          desc: 'Cuenta tokens sin gastar dinero (dry-run de costo).',
          example: '/token-count' },
        { cmd: '/suggest-model', level: 2, category: 'perf',
          desc: 'Recomienda Haiku/Sonnet/Opus según contexto actual y carga de trabajo.',
          example: '/suggest-model' },
        { cmd: 'claude config get-all', level: 2, category: 'shell',
          desc: 'Muestra configuración mergeada (defaults + .mcp.json + settings.json).',
          example: 'claude config get-all' },
        { cmd: 'claude mcp status', level: 2, category: 'shell',
          desc: 'Status detallado: uptime, errores, consumo memoria de cada MCP.',
          example: 'claude mcp status' },
        { cmd: 'claude mcp logs &lt;server&gt;', level: 2, category: 'shell',
          desc: 'Stream en vivo de logs del MCP (stderr + stdout combined).',
          example: 'claude mcp logs github' },
        { cmd: '/cost-estimate', level: 2, category: 'perf',
          desc: 'Estima costo $ de la sesión actual hasta el momento.',
          example: '/cost-estimate' },
        { cmd: '/hook', level: 2, category: 'built-in',
          desc: 'Gestiona hooks (Pre/PostToolUse, SessionStart) sin editar settings.json manualmente.',
          example: '/hook add PostToolUse prettier-format' },
        { cmd: '/pause', level: 2, category: 'built-in',
          desc: 'Pausa sesión sin borrar contexto (preserva conversación completa).',
          example: '/pause' },
        { cmd: '/checkpoint', level: 2, category: 'built-in',
          desc: 'Guarda snapshot nombrado de la sesión. Restaura con /rewind.',
          example: '/checkpoint "schema-migrado"' },
        { cmd: '@repo', level: 2, category: 'mention',
          desc: 'Mención especial: carga estructura completa + package.json + README automáticamente.',
          example: 'Analiza @repo y sugiere refactorización' },
        { cmd: '/export', level: 2, category: 'built-in',
          desc: 'Exporta conversación completa (markdown, JSON, PDF con formatos configurables).',
          example: '/export --format markdown --output transcript.md' },

        // --- NUEVOS COMANDOS NIVEL 3 (Skills & Advanced) ---
        { cmd: '/skill-list', level: 3, category: 'custom',
          desc: 'Lista todos skills: custom + builtin available.',
          example: '/skill-list' },
        { cmd: '/skill-info &lt;name&gt;', level: 3, category: 'custom',
          desc: 'Detalles de una skill: frontmatter, allowed-tools, argumentos esperados.',
          example: '/skill-info code-review' },
        { cmd: 'SKILL.md.template', level: 3, category: 'custom',
          desc: 'Scaffold con template para crear nueva skill con boilerplate correcto.',
          example: 'cat SKILL.md.template > .claude/skills/mi-skill/SKILL.md' },
        { cmd: '/agent', level: 3, category: 'built-in',
          desc: 'Ejecuta agente autónomo (equivalent a query() del SDK).',
          example: '/agent "Fixea todos los lints y runea tests"' },
        { cmd: '/spawn-parallel', level: 3, category: 'built-in',
          desc: 'Lanza sub-agentes en paralelo para tareas decomposables.',
          example: '/spawn-parallel "módulo1" "módulo2" "módulo3"' },
        { cmd: '$CONTEXT', level: 3, category: 'placeholder',
          desc: 'Variable en Skills: inyecta contexto actual (tokens, modelos, status).',
          example: '!`echo "$CONTEXT" | jq .tokens_used`' },
        { cmd: '$STDIN', level: 3, category: 'placeholder',
          desc: 'Captura input de stdin en Skills para piping y composición.',
          example: 'echo "code" | /analyze-performance' },
        { cmd: '/fork --name &lt;name&gt;', level: 3, category: 'built-in',
          desc: 'Fork con nombre descriptivo (mejor UX que /fork solo).',
          example: '/fork --name "typescript-migration"' },

        // --- BUILTIN SKILLS (ahora documentadas) ---
        { cmd: '/code-review', level: 3, category: 'builtin-skill',
          desc: 'Skill builtin: revisa último commit con checklist completo.',
          example: '/code-review' },
        { cmd: '/security-audit', level: 2, category: 'builtin-skill',
          desc: 'Skill builtin: audita código para SQLi, XSS, secretos expuestos.',
          example: '/security-audit' },
        { cmd: '/test-coverage', level: 2, category: 'builtin-skill',
          desc: 'Skill builtin: analiza cobertura de tests y sugiere mejoras.',
          example: '/test-coverage --min 80' },
        { cmd: '/performance-profile', level: 3, category: 'builtin-skill',
          desc: 'Skill builtin: analiza performance del código (bottlenecks, optimizaciones).',
          example: '/performance-profile src/api/users.ts' },
        { cmd: '/generate-docs', level: 2, category: 'builtin-skill',
          desc: 'Skill builtin: genera documentación automática (OpenAPI, JSDoc, etc).',
          example: '/generate-docs --format openapi' },

        // --- AGENT SDK COMMANDS (FROM AGENT 1) ---
        { cmd: '/agent-query', level: 3, category: 'agent',
          desc: 'Ejecuta query agentic: Claude resuelve tarea autónomamente con tool loops.',
          example: '/agent-query "Refactoriza este módulo"' },
        { cmd: '/agent-resume', level: 3, category: 'agent',
          desc: 'Resume sesión guardada: continúa con contexto previo intacto.',
          example: '/agent-resume session-id-abc123' },
        { cmd: '/agent-fork', level: 3, category: 'agent',
          desc: 'Fork sesión: explora alternativa sin afectar sesión original.',
          example: '/agent-fork --name "typescript-migration"' },
        { cmd: '/subagent-define', level: 3, category: 'agent',
          desc: 'Define subagente especializado (code-reviewer, test-runner, security-scanner).',
          example: '/subagent-define code-reviewer "Revisa calidad y seguridad"' },
        { cmd: '/session-cost', level: 2, category: 'agent',
          desc: 'Muestra costo acumulado de sesión actual en USD.',
          example: '/session-cost' },

        // --- HOOKS COMMANDS (FROM AGENT 2) ---
        { cmd: '/hooks-register', level: 3, category: 'hooks',
          desc: 'Registra nuevo hook sin editar settings.json (PreToolUse, PostToolUse, etc).',
          example: '/hooks-register PreToolUse "block rm -rf"' },
        { cmd: '/hooks-test', level: 3, category: 'hooks',
          desc: 'Testa hook con payload simulado antes de activar en producción.',
          example: '/hooks-test PreToolUse bash "rm -rf /"' },
        { cmd: '/hooks-debug', level: 3, category: 'hooks',
          desc: 'Abre panel de debugging: ve logs de hooks ejecutados, latencies, errores.',
          example: '/hooks-debug' },
        { cmd: '/hooks-audit-log', level: 2, category: 'hooks',
          desc: 'Muestra auditoría centralizada: quién ejecutó qué herramienta y cuándo.',
          example: '/hooks-audit-log --since 1h' },

        // --- DOCUMENTATION & FEATURE COMMANDS (FROM AGENT 4) ---
        { cmd: '/feature-check', level: 2, category: 'docs',
          desc: 'Verifica si una feature está oficialmente documentada y su status (experimental/stable).',
          example: '/feature-check "Agent Teams"' },
        { cmd: '/limit-check', level: 2, category: 'docs',
          desc: 'Consulta límites y cuotas (context window, rate limits, file size, session duration).',
          example: '/limit-check --model opus' },
        { cmd: '/experimental-list', level: 2, category: 'docs',
          desc: 'Lista todas las features experimentales (env var gated, beta, undocumented).',
          example: '/experimental-list' },

        // --- ADDITIONAL COMMANDS (FILL TO 150) ---
        { cmd: '/workspace-sync', level: 2, category: 'collaboration',
          desc: 'Sincroniza contexto de workspace entre múltiples devs.',
          example: '/workspace-sync' },
        { cmd: '/context-snapshot', level: 2, category: 'session',
          desc: 'Captura snapshot del contexto actual para reuso posterior.',
          example: '/context-snapshot "auth-refactor-v2"' },
        { cmd: '/memory-optimize', level: 3, category: 'perf',
          desc: 'Optimiza memoria de sesión: compacta, elimina duplicados.',
          example: '/memory-optimize' },
        { cmd: '/skill-marketplace', level: 2, category: 'skills',
          desc: 'Descubre skills públicos de comunidad (búsqueda + filtro).',
          example: '/skill-marketplace --search "database" --lang python' },
        { cmd: '/mcp-validate', level: 2, category: 'mcp',
          desc: 'Valida configuración MCP: sintaxis, permisos, connectivity.',
          example: '/mcp-validate .mcp.json' },
        { cmd: '/audit-trail', level: 3, category: 'security',
          desc: 'Ver audit trail completo: quién hizo qué, cuándo.',
          example: '/audit-trail --since 24h' },
        { cmd: '/batch-edit', level: 3, category: 'editing',
          desc: 'Edita múltiples archivos simultáneamente con regex patterns.',
          example: '/batch-edit "import.*old-lib" "import new-lib"' },
        { cmd: '/regression-test', level: 3, category: 'testing',
          desc: 'Ejecuta regression tests automáticos tras refactor.',
          example: '/regression-test' },
        { cmd: '/diff-explain', level: 2, category: 'debug',
          desc: 'Explica qué cambió entre dos versiones (en prosa).',
          example: '/diff-explain v1.0 v1.1' },
        { cmd: '/dependency-audit', level: 2, category: 'security',
          desc: 'Audita dependencias: vulnerabilidades, deprecated packages.',
          example: '/dependency-audit --json' },
        { cmd: '/claude-version', level: 1, category: 'info',
          desc: 'Muestra versión de Claude Code en uso.',
          example: '/claude-version' },
        { cmd: '/reset-session', level: 2, category: 'session',
          desc: 'Reinicia sesión eliminando todo contexto previo.',
          example: '/reset-session' },
        { cmd: '/suggest-tests', level: 2, category: 'testing',
          desc: 'Sugiere qué tests escribir para código sin coverage.',
          example: '/suggest-tests src/auth.ts' },
        { cmd: '/format-all', level: 2, category: 'formatting',
          desc: 'Aplica formatter a todo el proyecto (prettier, black, etc).',
          example: '/format-all --check' },
        { cmd: '/security-scan', level: 2, category: 'security',
          desc: 'Escaneo de seguridad rápido: secrets, credentials, OWASP.',
          example: '/security-scan' },
        { cmd: '/estimate-effort', level: 2, category: 'planning',
          desc: 'Estima esfuerzo de tarea (horas, complejidad, riesgos).',
          example: '/estimate-effort "Migrar a TypeScript"' },
        { cmd: '/compare-approaches', level: 3, category: 'architecture',
          desc: 'Compara 2+ enfoques técnicos (pros/cons, trade-offs).',
          example: '/compare-approaches "REST vs GraphQL"' },
        { cmd: '/generate-changelog', level: 2, category: 'release',
          desc: 'Genera changelog desde commits (semantic versioning).',
          example: '/generate-changelog v1.0...v1.1' },
        { cmd: '/lint-config', level: 2, category: 'linting',
          desc: 'Genera/valida configuración de linters (ESLint, Pylint).',
          example: '/lint-config --framework react' },
        { cmd: '/memory-stats', level: 2, category: 'perf',
          desc: 'Muestra estadísticas de contexto: tokens, compactness.',
          example: '/memory-stats' },

        // --- COMANDOS ADICIONALES NIVEL 1 (Workflow Basics) ---
        { cmd: 'claude --init-interactive', level: 1, category: 'setup',
          desc: 'Configuración interactiva paso-a-paso: stack, preferencias, CLAUDE.md.',
          example: 'claude --init-interactive' },
        { cmd: '/explain-error', level: 1, category: 'debug',
          desc: 'Explica el último error mostrando causa raíz y solución.',
          example: '/explain-error' },
        { cmd: '/undo', level: 1, category: 'built-in',
          desc: 'Revierte los últimos cambios realizados en archivos.',
          example: '/undo' },
        { cmd: '/redo', level: 1, category: 'built-in',
          desc: 'Rehace los cambios revertidos con /undo.',
          example: '/redo' },
        { cmd: '@directory/', level: 1, category: 'mention',
          desc: 'Menciona un directorio completo para cargar su estructura y archivos.',
          example: 'Refactoriza @src/ siguiendo clean architecture' },

        // --- COMANDOS ADICIONALES NIVEL 2 (Advanced Workflows) ---
        { cmd: '/diff-summary', level: 2, category: 'review',
          desc: 'Genera resumen de cambios en lenguaje natural (útil para PRs).',
          example: '/diff-summary' },
        { cmd: '/test-coverage', level: 2, category: 'testing',
          desc: 'Muestra reporte de cobertura y sugiere dónde agregar tests.',
          example: '/test-coverage --threshold 80' },
        { cmd: '/refactor-suggest', level: 2, category: 'architecture',
          desc: 'Analiza código y sugiere refactorizaciones basadas en patrones.',
          example: '/refactor-suggest --pattern "extract-method"' },
        { cmd: '/api-validate', level: 2, category: 'testing',
          desc: 'Valida endpoints REST: request/response, errores, status codes.',
          example: '/api-validate https://api.example.com/users' },
        { cmd: '/schema-analyze', level: 2, category: 'data',
          desc: 'Analiza esquema de DB: índices, relaciones, oportunidades de denormalización.',
          example: '/schema-analyze --db postgres' },
        { cmd: '/dependency-tree', level: 2, category: 'architecture',
          desc: 'Visualiza árbol de dependencias (npm/pip/cargo).',
          example: '/dependency-tree --depth 3' },
        { cmd: '/batch-edit', level: 2, category: 'automation',
          desc: 'Aplica mismo cambio a múltiples archivos con confirmación.',
          example: '/batch-edit --find "var " --replace "let " --files src/**/*.js' },
        { cmd: '/merge-conflict-resolve', level: 2, category: 'git',
          desc: 'Detecta y propone resolución de conflictos de merge.',
          example: '/merge-conflict-resolve' },
        { cmd: '/performance-profile', level: 2, category: 'perf',
          desc: 'Perfila código: timing por función, bottlenecks.',
          example: '/performance-profile --file src/expensive-function.js' },
        { cmd: '/document-auto', level: 2, category: 'docs',
          desc: 'Genera documentación automática: docstrings, README secciones.',
          example: '/document-auto --format markdown' },

        // --- COMANDOS ADICIONALES NIVEL 3 (Expert Features) ---
        { cmd: '/agent-debug', level: 3, category: 'agent',
          desc: 'Panel de debug para agentes: trace de ejecución, tool calls, estado.',
          example: '/agent-debug' },
        { cmd: '/agent-benchmark', level: 3, category: 'agent',
          desc: 'Compara performance de múltiples agentes o estrategias.',
          example: '/agent-benchmark --runs 10' },
        { cmd: '/multi-agent-orchestrate', level: 3, category: 'agent',
          desc: 'Orquesta múltiples agentes con dependencias y coordinación.',
          example: '/multi-agent-orchestrate config.yaml' },
        { cmd: '/skill-test', level: 3, category: 'custom',
          desc: 'Corre test suite de una skill (unit + integration).',
          example: '/skill-test code-review' },
        { cmd: '/skill-publish', level: 3, category: 'custom',
          desc: 'Publica skill a marketplace comunitario (si está habilitado).',
          example: '/skill-publish code-review --version 1.0' },
        { cmd: 'claude team add <email>', level: 3, category: 'collaboration',
          desc: 'Agrega miembro al equipo para compartir contexto, CLAUDE.md, skills.',
          example: 'claude team add alice@example.com' },
        { cmd: 'claude team invite-code', level: 3, category: 'collaboration',
          desc: 'Genera código de invitación para agregar miembros sin email.',
          example: 'claude team invite-code --expires 7d' },
        { cmd: '/audit-trail', level: 3, category: 'security',
          desc: 'Genera reporte de auditoría: quién hizo qué, cuándo.',
          example: '/audit-trail --since "2026-05-01"' },
        { cmd: '/security-hardening', level: 3, category: 'security',
          desc: 'Análisis de seguridad: vulnerabilidades, mejores prácticas.',
          example: '/security-hardening --scan-deps --scan-code' },
        { cmd: 'claude plugin install', level: 3, category: 'plugins',
          desc: 'Instala plugins de terceros (si están disponibles).',
          example: 'claude plugin install @org/linter-rules' },
        { cmd: '/context-optimize', level: 3, category: 'perf',
          desc: 'Análisis de contexto: qué es innecesario, cómo optimizar.',
          example: '/context-optimize --target 100k' },
        { cmd: '/model-chain', level: 3, category: 'agent',
          desc: 'Encadena múltiples modelos: Haiku para triage, Sonnet para análisis, Opus para síntesis.',
          example: '/model-chain --strategy progressive' },
        { cmd: '/workflow-save', level: 3, category: 'automation',
          desc: 'Guarda flujo de trabajo actual (cadena de prompts + comandos).',
          example: '/workflow-save "refactor-with-tests"' },
        { cmd: '/workflow-replay', level: 3, category: 'automation',
          desc: 'Reproduce un flujo guardado con parámetros nuevos.',
          example: '/workflow-replay "refactor-with-tests" --file src/new-file.js' },

        // --- COMANDOS AVANZADOS (Cloud & DevOps) ---
        { cmd: '/deploy-preview', level: 2, category: 'devops',
          desc: 'Simula despliegue y muestra cambios que se aplicarían.',
          example: '/deploy-preview --env staging' },
        { cmd: '/database-migrate', level: 2, category: 'data',
          desc: 'Genera y valida scripts de migración de DB.',
          example: '/database-migrate --from postgres --to mysql' },
        { cmd: '/load-test-generate', level: 2, category: 'testing',
          desc: 'Genera scripts de prueba de carga (k6, JMeter).',
          example: '/load-test-generate --target 1000-rps' },
        { cmd: '/monitor-setup', level: 2, category: 'devops',
          desc: 'Configura monitoreo: logs, métricas, alertas.',
          example: '/monitor-setup --provider datadog' },
        { cmd: '/compliance-check', level: 2, category: 'security',
          desc: 'Verifica cumplimiento: GDPR, SOC2, HIPAA, etc.',
          example: '/compliance-check --standard gdpr' },
        { cmd: '/ci-cd-validate', level: 2, category: 'devops',
          desc: 'Valida pipelines CI/CD: sintaxis, best practices.',
          example: '/ci-cd-validate --file .github/workflows/main.yml' },
        { cmd: '/infrastructure-diagram', level: 2, category: 'devops',
          desc: 'Genera diagrama de infraestructura en texto (Mermaid).',
          example: '/infrastructure-diagram --format mermaid' },

        // --- COMANDOS FINALES (Casos especializados) ---
        { cmd: '/regex-test', level: 2, category: 'tools',
          desc: 'Construye y testea regex interactivamente con ejemplos.',
          example: '/regex-test --pattern "^[a-z]+@[a-z]+\\.com$" --test "user@example.com"' },
        { cmd: '/translate-code', level: 2, category: 'refactor',
          desc: 'Traduce código de un lenguaje a otro (Python → Go, JS → Rust, etc.).',
          example: '/translate-code --from python --to javascript @src/utils.py' },
        { cmd: '/sql-optimize', level: 2, category: 'data',
          desc: 'Analiza y optimiza queries SQL: índices, join strategy, plan explicativo.',
          example: '/sql-optimize @db/queries.sql --dialect postgres' },
        { cmd: '/docker-validate', level: 2, category: 'devops',
          desc: 'Valida Dockerfiles: best practices, seguridad, tamaño de imagen.',
          example: '/docker-validate Dockerfile' },
        { cmd: '/env-audit', level: 2, category: 'security',
          desc: 'Audita variables de entorno: faltantes, inseguras, versionadas.',
          example: '/env-audit --required-file .env.example' },
        { cmd: '/function-complexity', level: 2, category: 'quality',
          desc: 'Mide complejidad ciclomática de funciones (McCabe).',
          example: '/function-complexity @src/main.py --threshold 10' },
        { cmd: '/response-time-estimate', level: 2, category: 'perf',
          desc: 'Estima tiempo de respuesta de endpoint analizando lógica.',
          example: '/response-time-estimate @src/api/users.ts --load "1000-req/s"' },
        { cmd: '/code-smell-detect', level: 3, category: 'quality',
          desc: 'Detecta code smells: duplicación, magic numbers, funciones largas.',
          example: '/code-smell-detect --scan-all --severity high' },
        { cmd: '/dependency-update-check', level: 2, category: 'maintenance',
          desc: 'Chequea actualizaciones de dependencias: cambios breaking, vulnerabilidades.',
          example: '/dependency-update-check --auto-suggest-patches' },
        { cmd: '/api-rate-limit-design', level: 3, category: 'architecture',
          desc: 'Diseña rate limiting strategy: tokens, buckets, distribución.',
          example: '/api-rate-limit-design --tier-free 100/hour --tier-pro 10000/hour' },
    ];

    /* ============================================================
       1.5 DATOS — Lecciones didácticas por nivel
       Cada lección define: objetivos, herramientas, caso práctico,
       quiz y misión real. Renderizado en .lesson-intro / .lesson-outro
       de cada sección de nivel.
       ============================================================ */
    const LESSONS_DATA = {
        1: {
            title: 'Tu primer día con Claude Code',
            objectives: [
                'Instalar Claude Code en tu sistema y autenticarte con OAuth.',
                'Iniciar una sesión en un proyecto real y entender qué carga automáticamente.',
                'Usar los slash commands esenciales (/help, /init, /clear, /model) con soltura.',
                'Mencionar archivos con @ para darle contexto explícito sin pasar contenido innecesario.',
                'Crear y mantener un CLAUDE.md como tu "system prompt" persistente del proyecto.',
            ],
            tools: ['npm', 'claude', '/help', '/init', '/model', '@archivo', 'CLAUDE.md', '/clear'],
            subtopics: [
                { name: 'Instalación multiplataforma', desc: 'npm vs instalador rápido. Node 18+.' },
                { name: 'Flujo OAuth', desc: 'Login automático, seguro, sin API keys en archivos.' },
                { name: 'CLAUDE.md: tu system prompt', desc: 'Estructura: stack, convenciones, comandos útiles, reglas de código.' },
                { name: 'Mención de archivos (@)', desc: 'Técnica para inyectar contexto sin sobrecargar en cada prompt.' },
            ],
            caseStudy: {
                title: '🛠️ Caso práctico: dale vida a un repo nuevo',
                context: 'Acabas de clonar un proyecto Next.js que no conoces. Quieres entender qué hace y dejar configurado un CLAUDE.md para que las próximas sesiones sean rápidas.',
                steps: [
                    { cmd: 'cd mi-repo && claude', what: 'Inicia sesión en el directorio del proyecto.' },
                    { cmd: '/init', what: 'Claude analiza el repo y propone un CLAUDE.md inicial.' },
                    { cmd: 'Revisa @package.json y @README.md y completa el CLAUDE.md con el stack y los scripts más usados.', what: 'Le das contexto explícito mencionando archivos clave.' },
                    { cmd: '/model claude-sonnet-4-6', what: 'Cambias a Sonnet para tareas rápidas (ahorra tokens).' },
                ],
                expected: 'Un archivo CLAUDE.md en la raíz con stack, scripts npm y convenciones detectadas.',
            },
            quiz: [
                {
                    q: '¿Qué hace el comando /init?',
                    options: [
                        'Reinicia la sesión actual borrando el historial.',
                        'Genera un CLAUDE.md analizando el proyecto.',
                        'Instala Claude Code globalmente.',
                    ],
                    correct: 1,
                    explain: '/init analiza el repo (package.json, estructura, README) y crea un CLAUDE.md base. Para borrar historial usa /clear.',
                },
                {
                    q: '¿Cuál es la forma recomendada de autenticar?',
                    options: [
                        'Pegar la API key en .claude/settings.json.',
                        'OAuth con `claude auth login`.',
                        'Pasar la key en cada comando con --key.',
                    ],
                    correct: 1,
                    explain: 'OAuth es más seguro y no deja secretos en archivos versionados.',
                },
                {
                    q: 'Si quiero que Claude lea un archivo específico, ¿cómo se lo indico en mi prompt?',
                    options: [
                        'Pego el contenido completo del archivo.',
                        'Lo menciono con @ruta/al/archivo.',
                        'Uso /read archivo.',
                    ],
                    correct: 1,
                    explain: 'La sintaxis @ es la nativa para referenciar archivos sin pegarlos.',
                },
            ],
            mission: {
                title: '🎯 Misión final del Nivel 1',
                goal: 'Generar un CLAUDE.md completo para uno de tus propios repositorios.',
                steps: [
                    'Abre Claude Code en tu proyecto: `cd tu-repo && claude`',
                    'Ejecuta `/init` y revisa el archivo generado.',
                    'Mejóralo: añade arquitectura, convenciones de código y comandos npm útiles.',
                    'Verifica con `/doctor` que todo está bien configurado.',
                ],
                success: 'Tu próxima sesión cargará automáticamente el CLAUDE.md y Claude entenderá tu proyecto sin que tengas que explicárselo.',
                troubleshooting: [
                    '**`/init` no encuentra nada útil** → asegúrate de tener un README.md o package.json en la raíz.',
                    '**`claude` no abre** → ejecuta `claude --version` para verificar instalación, o `claude auth login` si te falta sesión.',
                ],
            },
        },

        2: {
            title: 'Trabajando con proyectos grandes',
            objectives: [
                'Vigilar tu ventana de contexto con /context y /usage para evitar sorpresas.',
                'Compactar el historial sin perder lo importante con /compact y instrucciones precisas.',
                'Conectar servidores MCP (filesystem, GitHub, Postgres) y consumir sus herramientas automáticamente.',
                'Persistir conocimiento del proyecto entre sesiones con /memory.',
                'Configurar .mcp.json declarativo para reproducibilidad en equipo.',
            ],
            tools: ['/context', '/compact', '/usage', '/mcp', 'claude mcp add', '/memory', '.mcp.json'],
            subtopics: [
                { name: 'Gestión de contexto', desc: '/context muestra desglose. /compact preserva lo crítico.' },
                { name: 'MCP stdio vs SSE', desc: 'Local rápido vs remoto escalable. Manejo de errores.' },
                { name: 'Memoria entre sesiones', desc: '/memory = persistencia de decisiones arquitectónicas.' },
                { name: '.mcp.json declarativo', desc: 'Versionea en git. Variables de entorno para secretos.' },
            ],
            caseStudy: {
                title: '🛠️ Caso práctico: refactor largo sin morir en el contexto',
                context: 'Llevas dos horas refactorizando un módulo grande, has leído 30 archivos y el contexto está al 75%. Necesitas seguir trabajando sin perder el plan.',
                steps: [
                    { cmd: '/context', what: 'Mides cuánto contexto consume cada parte (sistema, archivos, conversación).' },
                    { cmd: '/compact mantén el plan de refactor y los 4 archivos ya migrados; descarta logs y errores resueltos', what: 'Compactas con instrucciones explícitas — la calidad depende de qué le pides preservar.' },
                    { cmd: '/memory add "Refactor UserService: separamos en Repository + Service + Validator. Patrón a seguir en módulos similares."', what: 'Guardas la decisión arquitectónica para futuras sesiones.' },
                    { cmd: 'claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /ruta/proyecto', what: 'Conectas un MCP que le da a Claude acceso estructurado a tu sistema de archivos.' },
                ],
                expected: 'Contexto bajado de 75% → ~20%, plan preservado, decisión guardada en memoria, MCP listo para la siguiente fase.',
            },
            quiz: [
                {
                    q: '¿Cuál es la diferencia entre /compact y /memory?',
                    options: [
                        'Son sinónimos, hacen lo mismo.',
                        '/compact resume la sesión actual; /memory persiste entre sesiones.',
                        '/memory borra contexto y /compact lo añade.',
                    ],
                    correct: 1,
                    explain: '/compact es para gestionar la ventana actual; /memory escribe en almacenamiento que sobrevive a /clear y a sesiones nuevas.',
                },
                {
                    q: 'Cuando tu contexto pasa el 70%, lo más profesional es:',
                    options: [
                        'Cerrar la sesión y empezar de cero.',
                        'Compactar con instrucciones explícitas sobre qué preservar.',
                        'Ignorar la advertencia y seguir.',
                    ],
                    correct: 1,
                    explain: 'Compactar guiado preserva tu trabajo. Cerrar pierde todo el progreso conversacional.',
                },
                {
                    q: '¿Dónde debe vivir el token de un servidor MCP?',
                    options: [
                        'En `.mcp.json` versionado en git.',
                        'En una variable de entorno referenciada con ${VAR}.',
                        'Hardcodeado en el código del servidor.',
                    ],
                    correct: 1,
                    explain: 'Nunca commitees secretos. `.mcp.json` referencia variables que viven en tu shell.',
                },
            ],
            mission: {
                title: '🎯 Misión final del Nivel 2',
                goal: 'Configurar un .mcp.json funcional con al menos un servidor y resolver una tarea con él.',
                steps: [
                    'Crea `.mcp.json` en tu proyecto con un servidor (filesystem o GitHub).',
                    'Reinicia Claude y verifica con `/mcp` que aparezca conectado.',
                    'Pide algo que requiera ese servidor (ej: "lista mis 5 últimos commits" si es GitHub).',
                    'Cuando termines, ejecuta `/curso-checkpoint` para guardar progreso.',
                ],
                success: 'Claude usa la herramienta MCP automáticamente y devuelve datos reales del servicio.',
                troubleshooting: [
                    '**MCP aparece como "failed"** → revisa que el comando del servidor exista (`npx -y @modelcontextprotocol/server-x`) y que las variables de entorno estén exportadas.',
                    '**No usa el MCP aunque está conectado** → menciona explícitamente la herramienta o el servicio en el prompt ("usa el MCP de GitHub para...").',
                ],
            },
        },

        3: {
            title: 'Construyendo tu propio Claude',
            objectives: [
                'Dominar la anatomía de un Skill: frontmatter (metadatos) + cuerpo (instrucción).',
                'Crear Skills con argumentos dinámicos ($1, $2, $ARGUMENTS) para reutilización.',
                'Inyectar comandos shell (!`git diff`) directamente en Skills con allowed-tools restringidos.',
                'Configurar hooks que se disparen automáticamente tras eventos (PostToolUse, PreToolUse).',
                'Orquestar sub-agentes en paralelo para tareas complejas.',
            ],
            tools: ['SKILL.md', '$ARGUMENTS', '!`cmd`', 'allowed-tools', 'hooks', 'Task', 'sub-agents', '/fork'],
            subtopics: [
                { name: 'Anatomía Skill + frontmatter', desc: 'name, description (auto-trigger), allowed-tools (mínimo privilegio).' },
                { name: 'Argumentos dinámicos', desc: '$1, $2, $ARGUMENTS para skills parametrizadas.' },
                { name: 'Shell injection segura', desc: '!`comando` con allowed-tools restrictivas. Prevenir inyección.' },
                { name: 'Hooks: automación', desc: 'PostToolUse para formatear código tras Write. Pre/Post patterns.' },
                { name: 'Sub-agentes en paralelo', desc: 'Task para orquestar agentes independientes. Escalabilidad.' },
            ],
            caseStudy: {
                title: '🛠️ Caso práctico: tu propia /code-review',
                context: 'Quieres que cualquier miembro del equipo pueda pedir una revisión exhaustiva del último PR con un solo comando.',
                steps: [
                    { cmd: 'mkdir -p .claude/skills/code-review', what: 'Creas el directorio del Skill dentro del proyecto (versionable en git).' },
                    { cmd: 'Edita .claude/skills/code-review/SKILL.md con frontmatter (name, description, allowed-tools) y un cuerpo con el checklist.', what: 'El frontmatter le dice a Claude cuándo dispararlo; el cuerpo es la instrucción.' },
                    { cmd: '/code-review', what: 'Invocas tu Skill. Claude ejecuta git diff, analiza y devuelve feedback.' },
                    { cmd: 'git add .claude/skills/code-review && git commit -m "feat: skill code-review"', what: 'Lo compartes con el equipo — todos lo tienen al hacer pull.' },
                ],
                expected: 'Cualquiera del equipo escribe `/code-review` y obtiene revisión consistente del último commit.',
            },
            quiz: [
                {
                    q: '¿Qué hace el campo `allowed-tools` en el frontmatter de un Skill?',
                    options: [
                        'Define qué modelo se usa.',
                        'Restringe qué herramientas puede usar el Skill (principio de mínimo privilegio).',
                        'Lista los argumentos esperados.',
                    ],
                    correct: 1,
                    explain: 'allowed-tools limita el blast radius del Skill — un Skill que solo lee no puede sobrescribir archivos por error.',
                },
                {
                    q: 'Para inyectar argumentos en un Skill se usa:',
                    options: [
                        '{{arg1}}',
                        '$1, $2, $ARGUMENTS',
                        '%ARG1%',
                    ],
                    correct: 1,
                    explain: 'Sintaxis estilo shell: $1 = primer arg, $ARGUMENTS = todos juntos.',
                },
                {
                    q: '¿Cuándo dispara Claude un Skill automáticamente?',
                    options: [
                        'Nunca — siempre requiere /nombre.',
                        'Cuando el prompt del usuario coincide con su `description`.',
                        'En cada turno de conversación.',
                    ],
                    correct: 1,
                    explain: 'Por eso la `description` del Skill es crítica: define cuándo se autoinvoca.',
                },
            ],
            mission: {
                title: '🎯 Misión final del Nivel 3',
                goal: 'Publicar un Skill funcional `/code-review` en uno de tus repos.',
                steps: [
                    'Crea `.claude/skills/code-review/SKILL.md` con frontmatter completo.',
                    'En el cuerpo, usa `!`git diff HEAD~1`` para inyectar el diff real.',
                    'Define un checklist: calidad, seguridad, performance, tests.',
                    'Pruébalo con `/code-review` después de un commit y commitea el Skill.',
                    'Ejecuta `/curso-checkpoint` para cerrar el curso.',
                ],
                success: 'El Skill aparece en `/help`, se ejecuta solo, y devuelve feedback estructurado.',
                troubleshooting: [
                    '**El Skill no aparece** → verifica que el directorio sea exactamente `.claude/skills/<name>/SKILL.md` y que tenga frontmatter válido.',
                    '**Permission denied al ejecutar git** → añade `Bash(git diff:*)` y `Bash(git log:*)` a `allowed-tools`.',
                ],
            },
        },
    };

    /* ============================================================
       1.6 DATOS — Glosario interactivo para audiencia accesible
       Términos con explicación simple, analogía y ejemplo.
       ============================================================ */
    const GLOSSARY = {
        contexto: {
            term: 'Contexto',
            simple: 'Información que Claude Code recuerda durante tu sesión.',
            analogy: 'Tu conversación con un amigo — mientras más le dices, mejor te entiende.',
            example: 'Si subes un archivo de datos, Claude lo recuerda para los siguientes comandos.'
        },
        token: {
            term: 'Token',
            simple: 'Una pequeña unidad de texto (aproximadamente una palabra).',
            analogy: 'Son como monedas del lenguaje: cada pregunta y respuesta gasta cierta cantidad.',
            example: 'Una pregunta simple = ~50 tokens. Un documento de 5 páginas = ~2000 tokens.'
        },
        mcp: {
            term: 'MCP (Model Context Protocol)',
            simple: 'Conexiones a herramientas especiales que Claude Code puede usar.',
            analogy: 'Como enchufes especializados: puedes conectar GitHub, Slack, Jira, etc.',
            example: 'Con MCP de GitHub, Claude puede leer tus commits sin que le copies manualmente el código.'
        },
        skill: {
            term: 'Skill',
            simple: 'Un comando personalizado que creas para tareas repetitivas.',
            analogy: 'Como una receta: defines los pasos una vez y luego la reutilizas.',
            example: '/analizar-feedback — tu Skill personalizado para procesar customer feedback.'
        },
        memoria: {
            term: 'Memoria',
            simple: 'Información que Claude Code guarda entre sesiones.',
            analogy: 'Tu cuaderno personal: no olvida decisiones, preferencias y contexto.',
            example: 'Guardar "usa siempre TypeScript en este proyecto" y Claude lo recordará mañana.'
        },
        comando: {
            term: 'Comando',
            simple: 'Una instrucción que empiezas con `/` o que ejecutas en la terminal.',
            analogy: 'Como un acceso rápido: `/help` = pedir ayuda, `/clear` = empezar de cero.',
            example: '`/model claude-opus-4-7` — cambiar al modelo más potente.'
        }
    };

    /* ============================================================
       1.7 DATOS — Diagramas ASCII para explicar conceptos
       Ilustraciones simples para audiencia visual.
       ============================================================ */
    const DIAGRAMS = {
        basicFlow: `
  Tu pregunta
      |
      v
  Claude Code
      |
      +-- Lee archivos locales (@archivo)
      +-- Conecta a GitHub (via MCP)
      +-- Ejecuta comandos (/help, /model)
      |
      v
  Respuesta inteligente`,

        mcp: `
  Tu Claude Code
       |
       +-- Lectura de archivos (local)
       |
       +-- GitHub (via MCP) → leer commits, PRs
       |
       +-- Slack (via MCP) → leer mensajes
       |
       +-- Jira (via MCP) → leer tickets
       |
       +-- Más...`,

        memory: `
  Sesión 1          Sesión 2          Sesión 3
  --------          --------          --------
  Context A    →    Recuerda A   →    Recuerda A
  Context B    →    Recuerda B   →    Recuerda B
                    Context C    →    Recuerda C
                                      Context D`,

        process: `
  CSV           Análisis           Insight
  Data    →     (Claude Code)  →    Documento
  Files         Transformación      PRD/Reporte`
    };

    /* ============================================================
       1.8 DATOS — Niveles accesibles para no-programadores (A-C)
       ============================================================ */
    const LEVELS_ACCESSIBLE = {
        A: {
            title: 'Nivel A: ¿Qué es Claude Code?',
            description: 'Para principiantes: conceptos básicos sin asumir experiencia en terminal.',
            sections: [
                {
                    id: 'intro-video',
                    name: '¿Por qué existe Claude Code?',
                    content: 'Claude Code es una forma diferente de trabajar: en lugar de escribir todo manualmente, cuentas qué quieres y Claude lo entiende de inmediato.'
                },
                {
                    id: 'conceptos-clave',
                    name: 'Conceptos clave ilustrados',
                    subsections: [
                        { name: 'Qué es un comando', icon: '⌨️', desc: 'Instrucciones que empiezan con `/` para hacerle cosas a Claude Code.' },
                        { name: 'Qué es contexto', icon: '📚', desc: 'Información que Claude recuerda: archivos, instrucciones, historial.' },
                        { name: 'Qué es MCP', icon: '🔌', desc: 'Conexiones a otras herramientas como GitHub, Slack, etc.' }
                    ]
                }
            ]
        },
        B: {
            title: 'Nivel B: Casos de uso por tu rol',
            description: 'Para usuarios específicos: cómo Claude Code te ayuda según tu trabajo.',
            roles: [
                {
                    id: 'pm',
                    name: 'Product Manager',
                    icon: '📊',
                    description: 'Analizar datos, escribir specs, entender el mercado.',
                    useCases: [
                        {
                            title: 'De CSV a insights en 5 minutos',
                            problem: 'Tienes una hoja de datos de 100 filas y quieres insights clave.',
                            solution: 'Subes el CSV con @archivo y pides análisis. Claude devuelve resumen, trends, recomendaciones.',
                            tools: ['@archivo', '/memory', '/model']
                        },
                        {
                            title: 'Escribir PRD basado en datos',
                            problem: 'Necesitas un documento PRD completo para una feature.',
                            solution: 'Describes el contexto + subes datos + pides PRD. Claude estructura todo automáticamente.',
                            tools: ['/memory', '@archivo', '/model']
                        }
                    ]
                },
                {
                    id: 'writer',
                    name: 'Content Creator',
                    icon: '✏️',
                    description: 'Generar ideas, escalar producción, mantener tono.',
                    useCases: [
                        {
                            title: 'De 1 idea a 20 formatos diferentes',
                            problem: 'Tienes una idea de blog pero necesitas tweets, emails, resumen, etc.',
                            solution: 'Le das la idea a Claude. Él genera automáticamente todos los formatos manteniendo tu tono.',
                            tools: ['/memory', '/model']
                        },
                        {
                            title: 'Generar resumen ejecutivo para junta',
                            problem: 'Necesitas un resumen en 2 páginas de un documento de 50 páginas.',
                            solution: 'Subes el documento (@archivo) y pides resumen ejecutivo. Obtienes puntos clave formateados.',
                            tools: ['@archivo', '/model']
                        }
                    ]
                },
                {
                    id: 'business',
                    name: 'Business/Operations',
                    icon: '🏢',
                    description: 'Automatizar procesos, generar reportes, ahorrar tiempo.',
                    useCases: [
                        {
                            title: 'Procesar 1000 registros automáticamente',
                            problem: 'Tienes 1000 registros de órdenes que necesitan normalización y formateo.',
                            solution: 'Subes el dataset y Claude procesa todo de una vez, devolviendo datos limpios.',
                            tools: ['@archivo', '/config', '/memory']
                        },
                        {
                            title: 'Generar reporte semanal automático',
                            problem: 'Cada semana necesitas recopilar datos y hacer un reporte.',
                            solution: 'Configuras Claude Code para ejecutarse automáticamente y enviar el reporte.',
                            tools: ['/config', '/memory', 'Headless']
                        }
                    ]
                }
            ]
        }
    };

    /* ============================================================
       1.9 DATOS — DESAFÍOS INTERACTIVOS DEL CURSO
       25 retos progresivos. Cada uno: pregunta + opciones + correcta + explicación.
       ============================================================ */
    const CHALLENGES_DATA = [
        // === FUNDAMENTOS ===
        {
            id: 1, category: 'basics', difficulty: 'easy',
            scenario: 'Acabas de instalar Claude Code y entras a un repo nuevo. ¿Cuál es el PRIMER comando que deberías ejecutar?',
            options: [
                'claude --help para ver qué puedo hacer',
                '/init para que genere un CLAUDE.md analizando el repo',
                'claude -p "explícame el proyecto" para que lo lea entero',
                '/clear para empezar limpio',
            ],
            correct: 1,
            explain: '/init analiza package.json, README y estructura para crear un CLAUDE.md base. Eso acelera TODAS las sesiones futuras. Pedir "explícame el proyecto entero" satura el contexto sin valor real.',
        },
        {
            id: 2, category: 'basics', difficulty: 'easy',
            scenario: '¿Cómo le indicas a Claude que lea un archivo concreto sin pegarle el contenido?',
            options: ['file:src/auth.ts', '@src/auth.ts', '/read src/auth.ts', '#src/auth.ts'],
            correct: 1,
            explain: 'La sintaxis @ es la forma nativa de mencionar archivos. Soporta autocompletado y rangos de líneas como @src/auth.ts:42-80.',
        },
        {
            id: 3, category: 'basics', difficulty: 'easy',
            scenario: 'Quieres que tu colega tenga las mismas configuraciones de Claude que tú al hacer git pull. ¿Dónde guardas la config?',
            options: [
                '~/.claude/settings.json en cada máquina',
                '.claude/settings.json en la raíz del proyecto (commited)',
                'CLAUDE.local.md',
                'Como variables de entorno en .bashrc',
            ],
            correct: 1,
            explain: '.claude/settings.json en el repo se versiona en git y todos heredan la misma config. ~/.claude/* es solo para tus preferencias personales (no compartidas).',
        },
        {
            id: 4, category: 'basics', difficulty: 'medium',
            scenario: 'Hiciste un cambio que no esperabas. ¿Cómo vuelves al estado anterior sin perder toda la sesión?',
            options: [
                '/clear y empiezo de cero',
                'git checkout . para descartar cambios',
                'Esc Esc o /rewind para abrir el menú de checkpoints',
                'Cierro la terminal y vuelvo a abrirla',
            ],
            correct: 2,
            explain: '/rewind (o Esc Esc) abre el menú de checkpoints — restauras un estado anterior preservando el contexto conversacional. /clear borraría toda la sesión.',
        },

        // === CONTEXTO ===
        {
            id: 5, category: 'context', difficulty: 'easy',
            scenario: 'Tu /context muestra 71%. Quieres seguir trabajando en la misma tarea sin perder el plan. ¿Qué haces?',
            options: [
                '/clear y reexplico todo desde cero',
                '/compact "preserva el plan de migración y los archivos ya migrados"',
                'Cambio a Haiku para usar menos tokens',
                'Sigo trabajando, ya se compactará automáticamente',
            ],
            correct: 1,
            explain: 'Compactación dirigida: le dices QUÉ preservar y qué descartar. Mucho mejor que /clear (pierdes todo) o /compact sin instrucciones (puede tirar lo importante).',
        },
        {
            id: 6, category: 'context', difficulty: 'medium',
            scenario: 'Diferencia entre /memory y /compact:',
            options: [
                'Son sinónimos, hacen lo mismo',
                '/compact resume la sesión actual; /memory persiste entre sesiones',
                '/memory borra contexto y /compact lo añade',
                '/compact es para CI, /memory para uso interactivo',
            ],
            correct: 1,
            explain: '/compact gestiona la ventana ACTUAL. /memory escribe almacenamiento que sobrevive a /clear y a sesiones nuevas — perfecto para decisiones arquitectónicas que quieres recordar siempre.',
        },
        {
            id: 7, category: 'context', difficulty: 'medium',
            scenario: 'Quieres hacer una pregunta lateral (curiosidad sobre tokens) sin que entre en el historial conversacional principal. Comando:',
            options: ['/btw', '/aside', '/question', '/temp'],
            correct: 0,
            explain: '/btw es perfecto para preguntas laterales — la respuesta no se guarda en el historial, así no contaminas el contexto de tu tarea principal.',
        },
        {
            id: 8, category: 'context', difficulty: 'hard',
            scenario: 'Trabajas en 2 features distintas en paralelo en el mismo repo. ¿La forma profesional?',
            options: [
                'Cierro y abro Claude para cada feature, perdiendo el progreso',
                'Mezclo todo en una misma sesión',
                'Uso `claude --worktree feature-A` en una terminal y `claude --worktree feature-B` en otra',
                'Hago /clear cada vez que cambio de feature',
            ],
            correct: 2,
            explain: 'Worktrees crean copias aisladas del repo en directorios separados. Sesiones paralelas independientes, sin conflictos de archivos ni contexto mezclado.',
        },

        // === MCP ===
        {
            id: 9, category: 'mcp', difficulty: 'easy',
            scenario: 'Quieres conectar el MCP de GitHub al proyecto sin commitear el token. Comando correcto:',
            options: [
                'claude mcp add github --env "TOKEN=ghp_xxx" -- npx ...',
                'export GITHUB_TOKEN="ghp_xxx" && claude mcp add github -e GITHUB_TOKEN -- npx -y @modelcontextprotocol/server-github',
                'Edito .mcp.json y pego el token directamente',
                'claude mcp add github --token ghp_xxx',
            ],
            correct: 1,
            explain: 'La flag -e referencia una variable de entorno por nombre — el token vive en tu shell, NO en archivos versionados. Pegar el token literal en .mcp.json es el error #1 de seguridad.',
        },
        {
            id: 10, category: 'mcp', difficulty: 'medium',
            scenario: 'Quieres que un MCP esté disponible en TODOS tus proyectos personales (Linear, por ejemplo). Scope correcto:',
            options: ['--scope local', '--scope project', '--scope user', '--scope global'],
            correct: 2,
            explain: 'Scope user = en todos tus proyectos (guardado en ~/.claude.json). Scope project = solo este repo (en .mcp.json). Scope local = solo este repo, NO compartido.',
        },
        {
            id: 11, category: 'mcp', difficulty: 'medium',
            scenario: 'Tu MCP aparece como "failed" en /mcp. ¿Primer paso de debugging?',
            options: [
                'Lo desinstalo y vuelvo a instalar',
                'Reinicio Claude Code',
                'claude mcp get NAME para ver detalles + verifico variables de entorno',
                'Cambio el transport de stdio a HTTP',
            ],
            correct: 2,
            explain: 'claude mcp get muestra el detalle exacto del error. Lo más común: variable de entorno no exportada en la shell actual o comando del servidor que no existe.',
        },
        {
            id: 12, category: 'mcp', difficulty: 'hard',
            scenario: 'Tu equipo conecta 25 MCPs. El contexto inicial está al 30% antes de empezar. ¿Cómo lo arreglas sin desconectar nada?',
            options: [
                'No hay solución, hay que desconectar MCPs',
                'export ENABLE_TOOL_SEARCH=auto:5 — defiere la carga de herramientas',
                'Uso un modelo más grande (Opus) que tiene más contexto',
                'Hago /compact al inicio de cada sesión',
            ],
            correct: 1,
            explain: 'Tool Search defiere las definiciones de herramientas hasta que Claude las necesita. Solo carga los nombres al inicio. auto:5 = carga upfront si caben en 5% del contexto, si no defiere.',
        },

        // === SKILLS ===
        {
            id: 13, category: 'skills', difficulty: 'easy',
            scenario: 'Quieres crear una Skill que solo tu equipo use. Ubicación correcta:',
            options: [
                '~/.claude/skills/mi-skill/SKILL.md',
                '.claude/skills/mi-skill/SKILL.md (versionado en git)',
                '/usr/local/claude/skills/',
                'package.json scripts',
            ],
            correct: 1,
            explain: '.claude/skills/ se compromete en git. Todos los miembros lo heredan al hacer pull. ~/.claude/skills/ es para tus skills personales (preferencias de estilo, etc).',
        },
        {
            id: 14, category: 'skills', difficulty: 'medium',
            scenario: 'En el frontmatter de una Skill, ¿qué campo controla cuándo Claude la auto-invoca?',
            options: ['name', 'description', 'argument-hint', 'allowed-tools'],
            correct: 1,
            explain: 'description es CRÍTICO: Claude analiza el intent del usuario y si coincide, invoca la Skill automáticamente. Una description vaga = auto-trigger pobre.',
        },
        {
            id: 15, category: 'skills', difficulty: 'medium',
            scenario: 'Quieres que tu Skill /code-review pueda hacer git diff pero NO pueda escribir archivos. allowed-tools correcto:',
            options: [
                'Bash(*)',
                'Read, Bash(git diff:*), Bash(git log:*)',
                'Read, Write, Bash',
                'Lo dejo vacío, para que pueda hacer todo',
            ],
            correct: 1,
            explain: 'Principio de mínimo privilegio. Lista los comandos exactos. Bash(git diff:*) permite SOLO git diff con cualquier flag, no otros git ni otros bash. NUNCA uses Bash(*) en producción.',
        },
        {
            id: 16, category: 'skills', difficulty: 'medium',
            scenario: 'Dentro del cuerpo de una Skill, ¿cómo inyectas el output de un comando bash en el prompt?',
            options: [
                '$(git diff)',
                '`git diff`',
                '!`git diff` (con backtick + bash entre comillas)',
                '${git diff}',
            ],
            correct: 2,
            explain: 'La sintaxis !`comando` ejecuta el comando ANTES de enviar el prompt y reemplaza con su stdout. Solo funciona si allowed-tools incluye el bash correspondiente.',
        },
        {
            id: 17, category: 'skills', difficulty: 'hard',
            scenario: 'Quieres una Skill que SOLO Claude pueda invocar automáticamente (no manualmente con /). Frontmatter:',
            options: [
                'auto-only: true',
                'user-invocable: false',
                'disable-model-invocation: true',
                'hidden: true',
            ],
            correct: 1,
            explain: 'user-invocable: false oculta la Skill del menú. Claude SÍ puede auto-invocarla. Lo opuesto: disable-model-invocation: true permite solo invocación manual.',
        },

        // === SDK & API ===
        {
            id: 18, category: 'sdk', difficulty: 'medium',
            scenario: 'Diferencia clave entre Agent SDK y Claude API estándar:',
            options: [
                'Son lo mismo, solo cambia el nombre',
                'Agent SDK maneja el bucle de tools automáticamente; con la API estándar lo implementas tú',
                'Agent SDK es solo Python, API es solo TypeScript',
                'Agent SDK es para producción, API es para desarrollo',
            ],
            correct: 1,
            explain: 'Con la API estándar haces el bucle: response → ejecutar tool → mandar tool_result → next response. El Agent SDK hace todo eso por ti, además de tener Skills, hooks y subagents listos.',
        },
        {
            id: 19, category: 'sdk', difficulty: 'medium',
            scenario: 'Vas a procesar 5000 tickets de soporte para clasificarlos. ¿Mejor estrategia?',
            options: [
                'Llamar a /v1/messages 5000 veces secuencialmente',
                'Llamar a /v1/messages 5000 veces en paralelo (Promise.all)',
                'Usar /v1/messages/batches con las 5000 solicitudes — 50% descuento',
                'Pegar los 5000 tickets en un solo prompt enorme',
            ],
            correct: 2,
            explain: 'Batch API: hasta 10K solicitudes con 50% descuento. Procesa async (hasta 24h) pero costo bajísimo. Para 5K tickets de clasificación es la opción correcta sin duda.',
        },
        {
            id: 20, category: 'sdk', difficulty: 'hard',
            scenario: 'Tienes un agente que consulta un manual de 50K tokens en cada llamada. Quieres reducir costos. ¿Qué activas?',
            options: [
                'Cambias a Haiku',
                'Marcas el manual con cache_control: {type: "ephemeral"} — prompt caching',
                'Resumen el manual en cada llamada',
                'Subes el manual a Files API y referencio por ID',
            ],
            correct: 1,
            explain: 'Prompt caching reduce costos hasta 90% y latencia hasta 85% en contenido reutilizado. La 2da llamada en menos de 5 min lee del cache. Files API también ayuda pero caching es la solución directa al patrón "manual reutilizado".',
        },
        {
            id: 21, category: 'sdk', difficulty: 'hard',
            scenario: 'En Agent SDK Python, quieres bloquear ediciones a archivos en /production sin importar lo que pida el usuario. ¿Cómo?',
            options: [
                'Agregar "production" a allowed-tools',
                'Hook PreToolUse que retorna {"decision": "block"} cuando file_path incluye "production"',
                'Configurar permission_mode: "dontAsk"',
                'Pedirle por favor en el prompt',
            ],
            correct: 1,
            explain: 'Hooks PreToolUse pueden interceptar y BLOQUEAR herramientas antes de ejecutarse. El return {"decision": "block", "reason": "..."} previene la acción independientemente del prompt. Es determinista, a prueba de jailbreaks.',
        },

        // === SEGURIDAD ===
        {
            id: 22, category: 'security', difficulty: 'easy',
            scenario: 'Quieres asegurarte de que Claude NUNCA lea tu .env. ¿Mecanismo más robusto?',
            options: [
                'Solo confiar en .gitignore',
                '.claudeignore con .env*',
                'permissions.deny en .claude/settings.json con "Read(./.env)" y "Read(./.env.*)"',
                'Renombrar el archivo a .env.hidden',
            ],
            correct: 2,
            explain: 'permissions.deny bloquea a NIVEL DEL AGENTE — Claude no puede leerlo aunque se lo pidas. .claudeignore solo controla la indexación inicial, deny es la barrera final.',
        },
        {
            id: 23, category: 'security', difficulty: 'medium',
            scenario: 'En CI no supervisado, ¿qué flag activas con cuidado?',
            options: [
                '--dangerously-skip-permissions (solo en sandbox aislado)',
                '--no-tests',
                '--ignore-claude-md',
                '--unsafe',
            ],
            correct: 0,
            explain: '--dangerously-skip-permissions desactiva todas las preguntas. Solo úsalo en CI con sandbox completamente aislado (contenedores efímeros). NUNCA en una máquina con datos reales.',
        },
        {
            id: 24, category: 'security', difficulty: 'medium',
            scenario: 'Tu equipo va a usar un MCP de la comunidad (no oficial). Buena práctica:',
            options: [
                'Instalar la última versión, ya estarán probadas',
                'Revisar el repo, fijar la versión exacta (@1.2.3 no @latest), preferir tokens read-only',
                'Confiar porque tiene muchas estrellas en GitHub',
                'Ejecutarlo con sudo para que tenga todos los permisos',
            ],
            correct: 1,
            explain: 'Un MCP es código que se ejecuta con tus permisos. Versión fija = no te sorprende un update con malware. Token read-only = blast radius limitado.',
        },
        {
            id: 25, category: 'security', difficulty: 'hard',
            scenario: 'Encuentras que tu CLAUDE.md tiene "TODA query SQL DEBE usar Prisma". Aún así Claude generó SQL crudo en un PR. ¿Cómo lo previenes determinísticamente?',
            options: [
                'Reforzar la regla con MAYÚSCULAS en CLAUDE.md',
                'Hook PostToolUse que ejecuta semgrep buscando patrones de SQL crudo y rechaza el cambio',
                'Pedirlo más amablemente en el prompt',
                'Cambiar a Opus, hace menos errores',
            ],
            correct: 1,
            explain: 'Las reglas en CLAUDE.md son advisory — Claude PUEDE saltárselas. Hooks son determinísticos: si el linter encuentra el patrón malo, se rechaza el cambio sí o sí. La doble defensa es: instrucción + verificación automatizada.',
        },
    ];

    /* ============================================================
       2. ESCENARIOS — Simulador de terminal
       Cada escenario es una secuencia de líneas. type:
         'prompt'  → línea con $ (shell)
         'user'    → línea con > (input al agente)
         'output'  → salida normal
         'success' → verde
         'warning' → ámbar
         'error'   → rojo
         'comment' → comentario tenue
         'info'    → cursiva
       ============================================================ */
    const SCENARIOS = {
        install: [
            { type: 'comment', text: '# Paso 1 — Instalar Claude Code globalmente' },
            { type: 'prompt',  text: 'npm install -g @anthropic-ai/claude-code', delay: 200 },
            { type: 'output',  text: 'added 142 packages in 8s', delay: 1500 },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# Paso 2 — Verificar instalación' },
            { type: 'prompt',  text: 'claude --version', delay: 200 },
            { type: 'success', text: 'claude-code 2.1.101', delay: 600 },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# Paso 3 — Iniciar sesión en tu proyecto' },
            { type: 'prompt',  text: 'cd mi-proyecto && claude', delay: 200 },
            { type: 'info',    text: '✓ Reading CLAUDE.md...', delay: 800 },
            { type: 'info',    text: '✓ Indexing 247 files...', delay: 1200 },
            { type: 'success', text: '✓ Listo. Modelo: claude-sonnet-4-6', delay: 1000 },
            { type: 'user',    text: 'Hola, ¿qué hace este proyecto?', delay: 1500 },
            { type: 'output',  text: 'Es una API REST en Fastify+Prisma para gestionar...', delay: 1800 },
        ],

        basic: [
            { type: 'comment', text: '# Comandos básicos del Nivel 1' },
            { type: 'output',  text: '' },
            { type: 'user',    text: '/help', delay: 200 },
            { type: 'output',  text: 'Comandos disponibles:', delay: 600 },
            { type: 'output',  text: '  /clear     — Reinicia la conversación' },
            { type: 'output',  text: '  /model     — Cambiar modelo' },
            { type: 'output',  text: '  /context   — Ver uso de contexto' },
            { type: 'output',  text: '  /compact   — Compactar historial' },
            { type: 'output',  text: '  ... (60+ más)' },
            { type: 'output',  text: '' },
            { type: 'user',    text: 'Lee @src/index.ts y dame un resumen', delay: 1500 },
            { type: 'info',    text: '⏺ Read(src/index.ts) — 142 lines', delay: 800 },
            { type: 'output',  text: 'Es el punto de entrada de un servidor Fastify que:', delay: 1200 },
            { type: 'output',  text: '  • Carga variables de entorno con dotenv' },
            { type: 'output',  text: '  • Registra plugins (cors, helmet, jwt)' },
            { type: 'output',  text: '  • Monta routers de /auth y /api/v1' },
            { type: 'output',  text: '  • Inicia el servidor en process.env.PORT (default 3000)' },
        ],

        mcp: [
            { type: 'comment', text: '# Conectar Claude Code al MCP de GitHub' },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# 1) Exporta tu token (NO lo escribas en JSON)' },
            { type: 'prompt',  text: 'export GITHUB_TOKEN="ghp_***************"', delay: 300 },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# 2) Registra el servidor MCP' },
            { type: 'prompt',  text: 'claude mcp add github -e GITHUB_TOKEN -- npx -y @modelcontextprotocol/server-github', delay: 300 },
            { type: 'info',    text: 'Adding MCP server "github"...', delay: 1200 },
            { type: 'success', text: '✓ Server "github" added (stdio)', delay: 800 },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'claude mcp list', delay: 400 },
            { type: 'output',  text: 'NAME      TRANSPORT   STATUS' },
            { type: 'success', text: 'github    stdio       connected' },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'claude', delay: 500 },
            { type: 'user',    text: 'Lista mis 3 PRs abiertos en mi-org/mi-repo', delay: 1500 },
            { type: 'info',    text: '⏺ mcp__github__list_pull_requests(state=open, repo=mi-org/mi-repo)', delay: 1500 },
            { type: 'output',  text: 'Encontré 3 PRs abiertos:', delay: 1000 },
            { type: 'output',  text: '  #247  feat(auth): refresh tokens — 2 días, 4 commits' },
            { type: 'output',  text: '  #251  fix(checkout): race condition — 1 día' },
            { type: 'output',  text: '  #253  chore: bump deps — 4 horas' },
        ],

        compact: [
            { type: 'comment', text: '# Sesión larga — gestión de contexto' },
            { type: 'output',  text: '' },
            { type: 'user',    text: '/context', delay: 300 },
            { type: 'warning', text: '⚠ Context: 142,300 / 200,000 tokens (71%)', delay: 800 },
            { type: 'output',  text: '   • System & tools:    8,200' },
            { type: 'output',  text: '   • CLAUDE.md:         2,100' },
            { type: 'output',  text: '   • Files read (24):  87,500' },
            { type: 'output',  text: '   • Tool outputs:     31,200' },
            { type: 'output',  text: '   • Conversation:     13,300' },
            { type: 'output',  text: '' },
            { type: 'user',    text: '/compact preserva el plan de migración a TypeScript y los 4 archivos ya refactorizados; descarta los logs de errores que ya resolvimos', delay: 2000 },
            { type: 'info',    text: '⏺ Compacting conversation...', delay: 1500 },
            { type: 'success', text: '✓ Context: 28,400 / 200,000 tokens (14%)', delay: 1500 },
            { type: 'output',  text: '   ↓ 113,900 tokens liberados' },
            { type: 'output',  text: '' },
            { type: 'output',  text: 'Resumen preservado: Plan de migración (5 fases), archivos' },
            { type: 'output',  text: 'completados (utils/dates.ts, utils/strings.ts, utils/http.ts,' },
            { type: 'output',  text: 'utils/validation.ts), siguiente objetivo: utils/crypto.ts' },
        ],

        skill: [
            { type: 'comment', text: '# Crear una Skill /security-audit y usarla' },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'mkdir -p .claude/skills/security-audit', delay: 300 },
            { type: 'prompt',  text: 'cat > .claude/skills/security-audit/SKILL.md << EOF', delay: 400 },
            { type: 'output',  text: '---' },
            { type: 'output',  text: 'name: security-audit' },
            { type: 'output',  text: 'description: Audita el código en busca de vulnerabilidades' },
            { type: 'output',  text: 'allowed-tools: Read, Grep, Glob' },
            { type: 'output',  text: '---' },
            { type: 'output',  text: 'Analiza el código buscando SQLi, XSS, secretos expuestos...' },
            { type: 'output',  text: 'EOF' },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'claude', delay: 500 },
            { type: 'info',    text: '✓ Loaded 1 custom skill: /security-audit', delay: 800 },
            { type: 'output',  text: '' },
            { type: 'user',    text: '/security-audit', delay: 1200 },
            { type: 'info',    text: '⏺ Glob(**/*.{ts,js})', delay: 800 },
            { type: 'info',    text: '⏺ Grep(pattern="SELECT.*\\${.*}")', delay: 800 },
            { type: 'info',    text: '⏺ Read(src/api/users.ts)', delay: 800 },
            { type: 'output',  text: 'Hallazgos:' },
            { type: 'error',   text: '  🔴 CRÍTICO  src/api/users.ts:42 — SQL injection' },
            { type: 'output',  text: '              "SELECT * FROM users WHERE id = ${req.params.id}"' },
            { type: 'output',  text: '              → Usar prisma.user.findUnique({ where: { id } })' },
            { type: 'warning', text: '  🟡 ALTA     src/utils/jwt.ts:8 — Secret en código' },
            { type: 'output',  text: '              const SECRET = "dev-secret-change-me"' },
            { type: 'output',  text: '              → Mover a process.env.JWT_SECRET con validación' },
        ],

        security: [
            { type: 'comment', text: '# Configuración de seguridad para producción' },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'cat .claude/settings.json', delay: 300 },
            { type: 'output',  text: '{' },
            { type: 'output',  text: '  "permissions": {' },
            { type: 'output',  text: '    "allowedTools": ["Read", "Write", "Bash(git:*)", "Bash(npm:*)"],' },
            { type: 'output',  text: '    "deny": [' },
            { type: 'output',  text: '      "Read(./.env)",' },
            { type: 'output',  text: '      "Read(./.env.*)",' },
            { type: 'output',  text: '      "Bash(curl * | sh)",' },
            { type: 'output',  text: '      "Bash(rm -rf /*)"' },
            { type: 'output',  text: '    ]' },
            { type: 'output',  text: '  }' },
            { type: 'output',  text: '}' },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'claude', delay: 500 },
            { type: 'user',    text: 'Lee mi archivo .env para ver la configuración', delay: 1500 },
            { type: 'error',   text: '✗ Permission denied: Read(./.env) está en la lista deny', delay: 1000 },
            { type: 'output',  text: '' },
            { type: 'output',  text: 'No puedo acceder al .env por la política de seguridad del proyecto.' },
            { type: 'output',  text: 'Si necesito conocer una variable, dime cuál y te explico su uso' },
            { type: 'output',  text: 'sin leer el archivo. Esto previene fuga accidental de secretos.' },
        ],

        agentSdk: [
            { type: 'comment', text: '# Claude Agent SDK — agente autónomo en TypeScript' },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'npm install @anthropic-ai/claude-agent-sdk', delay: 300 },
            { type: 'output',  text: 'added 3 packages in 1.2s', delay: 1200 },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# Agente básico con herramientas Read + Edit + Bash' },
            { type: 'prompt',  text: 'npx tsx agent.ts', delay: 400 },
            { type: 'info',    text: '⏺ Agent initialized (claude-sonnet-4-6)', delay: 800 },
            { type: 'info',    text: '⏺ Read(src/api/users.ts)', delay: 800 },
            { type: 'info',    text: '⏺ Read(src/api/users.test.ts)', delay: 600 },
            { type: 'info',    text: '⏺ Grep(pattern="SELECT.*\\${.*}", path="src/")', delay: 700 },
            { type: 'error',   text: '  Match: src/api/users.ts:42 — SQL injection risk', delay: 500 },
            { type: 'info',    text: '⏺ Edit(src/api/users.ts) — replacing raw SQL with Prisma', delay: 900 },
            { type: 'info',    text: '⏺ Bash("npm test -- --run src/api/users")', delay: 800 },
            { type: 'success', text: '  ✓ 12 tests passed in 0.8s', delay: 1000 },
            { type: 'output',  text: '' },
            { type: 'success', text: '✅ Agent completed: 1 vulnerability fixed, all tests green', delay: 600 },
            { type: 'output',  text: '   Input tokens:  3,241   Output tokens: 847', delay: 300 },
        ],

        apiUsage: [
            { type: 'comment', text: '# Anthropic API — llamada básica con streaming' },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'npx tsx api-demo.ts', delay: 300 },
            { type: 'comment', text: '# Model: claude-sonnet-4-6 | Stream mode' },
            { type: 'output',  text: '' },
            { type: 'output',  text: 'Explicando el patrón Repository...', delay: 800 },
            { type: 'info',    text: 'El patrón Repository es una abstracción que...', delay: 200 },
            { type: 'info',    text: 'separa la lógica de negocio del acceso a datos.', delay: 150 },
            { type: 'info',    text: '' },
            { type: 'info',    text: '## Implementación con Prisma', delay: 200 },
            { type: 'info',    text: '' },
            { type: 'info',    text: '```typescript', delay: 100 },
            { type: 'info',    text: 'interface UserRepository {', delay: 100 },
            { type: 'info',    text: '  findById(id: string): Promise<User | null>;', delay: 100 },
            { type: 'info',    text: '  save(user: User): Promise<User>;', delay: 100 },
            { type: 'info',    text: '}', delay: 100 },
            { type: 'info',    text: '```', delay: 100 },
            { type: 'output',  text: '' },
            { type: 'success', text: '--- Stats ---', delay: 800 },
            { type: 'output',  text: 'Input tokens:   42' },
            { type: 'output',  text: 'Output tokens:  387' },
            { type: 'output',  text: 'Cache hit:      0 (primera llamada)' },
        ],

        worktree: [
            { type: 'comment', text: '# Sesiones paralelas con git worktrees' },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# Terminal 1: trabajar en feature-auth' },
            { type: 'prompt',  text: 'claude --worktree feature-auth', delay: 300 },
            { type: 'info',    text: '⏺ Creando worktree: ../project-feature-auth', delay: 1000 },
            { type: 'info',    text: '⏺ Branch: feature-auth (nuevo desde main)', delay: 600 },
            { type: 'success', text: '✓ Worktree listo. Claude Code iniciado.', delay: 600 },
            { type: 'user',    text: 'Implementa JWT refresh tokens en @src/auth/', delay: 1500 },
            { type: 'info',    text: '⏺ Read(src/auth/jwt.ts)', delay: 800 },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# Terminal 2 (simultánea): bug fix en otra feature' },
            { type: 'prompt',  text: 'claude --worktree fix-checkout-race', delay: 300 },
            { type: 'info',    text: '⏺ Creando worktree: ../project-fix-checkout-race', delay: 1000 },
            { type: 'success', text: '✓ Worktree listo. Claude Code iniciado.', delay: 600 },
            { type: 'user',    text: 'Hay race condition en @src/checkout/inventory.ts:89', delay: 1500 },
            { type: 'info',    text: '⏺ Read(src/checkout/inventory.ts)', delay: 800 },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# Ambas sesiones corren en paralelo, sin conflictos' },
            { type: 'success', text: '✓ Worktree 1: JWT refresh implementado (3 archivos)', delay: 1000 },
            { type: 'success', text: '✓ Worktree 2: Race condition corregida (1 archivo)', delay: 800 },
        ],

        headless: [
            { type: 'comment', text: '# Modo headless: ejecutar Claude sin interactividad (perfecto para CI/CD)' },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'claude -p "Revisa este código busca vulnerabilidades SQL" < app.ts --output-format json', delay: 300 },
            { type: 'output',  text: '{', delay: 600 },
            { type: 'output',  text: '  "status": "success",' },
            { type: 'output',  text: '  "message": "No se encontraron vulnerabilidades SQL en app.ts.",' },
            { type: 'output',  text: '  "analysis": {' },
            { type: 'output',  text: '    "query_patterns": 0,' },
            { type: 'output',  text: '    "dynamic_sql": false,' },
            { type: 'output',  text: '    "orm_usage": "Prisma (seguro)"' },
            { type: 'output',  text: '  },' },
            { type: 'output',  text: '  "tokens_used": 342' },
            { type: 'output',  text: '}' },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# En GitHub Actions: verifica vulnerabilidades en cada PR' },
            { type: 'prompt',  text: 'cat .github/workflows/security-check.yml', delay: 300 },
            { type: 'output',  text: 'name: Security Scan' },
            { type: 'output',  text: 'on: [pull_request]' },
            { type: 'output',  text: 'jobs:' },
            { type: 'output',  text: '  audit:' },
            { type: 'output',  text: '    runs-on: ubuntu-latest' },
            { type: 'output',  text: '    steps:' },
            { type: 'output',  text: '      - uses: actions/checkout@v4' },
            { type: 'output',  text: '      - run: npm install -g @anthropic-ai/claude-code' },
            { type: 'output',  text: '      - run: |' },
            { type: 'output',  text: '          for file in $(git diff --name-only HEAD~1); do' },
            { type: 'output',  text: '            claude -p "Audita este archivo" < "$file" | jq .' },
            { type: 'output',  text: '          done' },
            { type: 'success', text: '✓ Headless mode — ideal para automatización' },
        ],

        firstBugFix: [
            { type: 'comment', text: '# Tu primer bug fix — Flujo realista Junior → Senior' },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'npm test', delay: 300 },
            { type: 'error',   text: 'FAIL src/__tests__/users.test.ts', delay: 1200 },
            { type: 'output',  text: '  ✗ should create user with valid email' },
            { type: 'output',  text: '    Expected: true' },
            { type: 'output',  text: '    Received: undefined' },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'claude', delay: 500 },
            { type: 'user',    text: 'Ayuda, mi test falla — debería ser true pero es undefined', delay: 1500 },
            { type: 'info',    text: '⏺ Read(src/__tests__/users.test.ts)', delay: 800 },
            { type: 'info',    text: '⏺ Read(src/services/user.service.ts)', delay: 800 },
            { type: 'output',  text: '🔍 Found it: En user.service.ts línea 34, falta return en createUser()' },
            { type: 'output',  text: '   Código:  async createUser(data) {' },
            { type: 'output',  text: '              validateEmail(data.email);  // ← sin return' },
            { type: 'output',  text: '            }' },
            { type: 'output',  text: '   Solución: return await db.users.create(data);' },
            { type: 'output',  text: '' },
            { type: 'user',    text: 'Fix it', delay: 800 },
            { type: 'info',    text: '⏺ Edit(src/services/user.service.ts)', delay: 1000 },
            { type: 'success', text: '✓ Fixed: added return statement', delay: 600 },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'npm test', delay: 300 },
            { type: 'success', text: 'PASS src/__tests__/users.test.ts (2.3s)', delay: 1500 },
            { type: 'output',  text: '✓ should create user with valid email' },
            { type: 'output',  text: '' },
            { type: 'user',    text: 'Crea un commit', delay: 800 },
            { type: 'info',    text: '⏺ Bash(git diff)', delay: 600 },
            { type: 'success', text: '✓ Commit: fix: add missing return in createUser()', delay: 1000 },
        ],

        debugSession: [
            { type: 'comment', text: '# Debugging colaborativo — Slack MCP + análisis en vivo' },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# Alertas en Slack desde producción' },
            { type: 'info',    text: '[Slack MCP] 🚨 POST /checkout returns 500', delay: 1000 },
            { type: 'info',    text: '            Error: Cannot read property "items" of undefined' },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'claude', delay: 500 },
            { type: 'user',    text: 'Hay un error en checkout, mira el Slack MCP', delay: 1500 },
            { type: 'info',    text: '⏺ mcp__slack__get_channel_messages(channel=alerts)', delay: 1200 },
            { type: 'output',  text: 'Mensaje: "POST /checkout returns 500"' },
            { type: 'output',  text: 'Error: Cannot read property "items" of undefined' },
            { type: 'output',  text: 'Request: { orderId: 123, cartId: null }' },
            { type: 'output',  text: '' },
            { type: 'info',    text: '⏺ Read(src/api/checkout.ts)', delay: 800 },
            { type: 'output',  text: '❌ Línea 42: const items = cart.items.map(...) // cart puede ser null!' },
            { type: 'output',  text: '' },
            { type: 'user',    text: 'Fix it', delay: 600 },
            { type: 'info',    text: '⏺ Edit(src/api/checkout.ts)', delay: 1000 },
            { type: 'info',    text: '⏺ Bash(npm test -- checkout)', delay: 1200 },
            { type: 'success', text: '✓ Tests pass', delay: 800 },
            { type: 'info',    text: '⏺ mcp__slack__send_message(channel=alerts, text="Checkout fixed!")', delay: 1000 },
            { type: 'success', text: '✓ Fixed: Added null check for cart in checkout flow', delay: 800 },
        ],

        teamOnboarding: [
            { type: 'comment', text: '# Onboarding en equipo — New dev clona y está productivo inmediatamente' },
            { type: 'output',  text: '' },
            { type: 'prompt',  text: 'git clone https://github.com/mi-org/mi-repo.git', delay: 600 },
            { type: 'prompt',  text: 'cd mi-repo && claude', delay: 1000 },
            { type: 'info',    text: '✓ Reading CLAUDE.md...', delay: 600 },
            { type: 'info',    text: '✓ Loading .mcp.json (3 MCPs configurados)', delay: 1000 },
            { type: 'success', text: '✓ Loaded 3 custom skills: /code-review, /security-audit, /test-coverage', delay: 1200 },
            { type: 'info',    text: '✓ Loaded 2 hooks: PostToolUse(prettier), PreToolUse(validate)', delay: 800 },
            { type: 'output',  text: '' },
            { type: 'user',    text: '/mcp', delay: 800 },
            { type: 'output',  text: 'NAME       TRANSPORT    STATUS' },
            { type: 'success', text: 'github     stdio        connected ✓' },
            { type: 'success', text: 'slack      sse          connected ✓' },
            { type: 'success', text: 'postgres   http         connected ✓' },
            { type: 'output',  text: '' },
            { type: 'user',    text: '/skill-list', delay: 600 },
            { type: 'output',  text: 'Custom Skills:' },
            { type: 'output',  text: '  /code-review      — Review último commit' },
            { type: 'output',  text: '  /security-audit   — Audita vulnerabilidades' },
            { type: 'output',  text: '  /test-coverage    — Analiza tests' },
            { type: 'output',  text: '' },
            { type: 'user',    text: 'Hola, quiero entender la arquitectura del proyecto', delay: 1500 },
            { type: 'info',    text: '⏺ Read(.claude/CLAUDE.md)', delay: 800 },
            { type: 'output',  text: '✓ Tech Stack: Next.js 14 + Prisma + PostgreSQL' },
            { type: 'output',  text: '✓ Estructura: /pages (Next), /components, /lib/db, /api' },
            { type: 'output',  text: '✓ Scripts: npm run dev, npm test, npm run build' },
            { type: 'success', text: '✓ New dev está listo para contribuir sin setup manual', delay: 1000 },
        ],

        costOptimization: [
            { type: 'comment', text: '# Optimizar costo — Monitorear tokens en sesión larga' },
            { type: 'output',  text: '' },
            { type: 'user',    text: '/context', delay: 600 },
            { type: 'warning', text: '⚠ Context: 156,420 / 200,000 tokens (78%)', delay: 1000 },
            { type: 'output',  text: '   • System & tools:     12,200' },
            { type: 'output',  text: '   • CLAUDE.md:          4,500' },
            { type: 'output',  text: '   • Files read (32):    98,700' },
            { type: 'output',  text: '   • Conversation:       41,020' },
            { type: 'output',  text: '' },
            { type: 'user',    text: '/cost-estimate', delay: 600 },
            { type: 'warning', text: '💰 Estimated cost: $0.78 (hasta ahora en esta sesión)', delay: 800 },
            { type: 'output',  text: '' },
            { type: 'user',    text: '/compact mantén el plan de migración de DB y los commits que ya hicimos; descarta los logs de test', delay: 2000 },
            { type: 'info',    text: '⏺ Compacting conversation...' },
            { type: 'info',    text: '    Preservando: plan (1200 tokens), commits (3400 tokens)' },
            { type: 'info',    text: '    Descartando: test logs (8900 tokens)' },
            { type: 'success', text: '✓ Context: 28,410 / 200,000 tokens (14%)', delay: 1500 },
            { type: 'output',  text: '   ↓ 128,010 tokens liberados' },
            { type: 'output',  text: '' },
            { type: 'user',    text: '/cost-estimate', delay: 600 },
            { type: 'success', text: '💰 Estimated cost: $0.23 (67% ahorro)', delay: 1000 },
        ],

        cicdIntegration: [
            { type: 'comment', text: '# CI/CD Integration — Claude revisa automáticamente cada PR' },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# Developer abre PR' },
            { type: 'prompt',  text: 'git push origin feature/new-endpoint', delay: 800 },
            { type: 'info',    text: '✓ PR #128 opened: feat: new /api/export endpoint', delay: 1500 },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# GitHub Actions dispara automáticamente' },
            { type: 'prompt',  text: 'cat .github/workflows/claude-review.yml', delay: 400 },
            { type: 'output',  text: 'name: Claude Code Review' },
            { type: 'output',  text: 'on: [pull_request]' },
            { type: 'output',  text: 'jobs:' },
            { type: 'output',  text: '  review:' },
            { type: 'output',  text: '    runs-on: ubuntu-latest' },
            { type: 'output',  text: '    steps:' },
            { type: 'output',  text: '      - uses: actions/checkout@v4' },
            { type: 'output',  text: '      - run: claude /code-review --output json > review.json' },
            { type: 'output',  text: '      - run: gh pr comment ${{ github.event.pull_request.number }} -F review.json' },
            { type: 'output',  text: '' },
            { type: 'info',    text: '⏺ GitHub Actions: Ejecutando /code-review', delay: 2000 },
            { type: 'info',    text: '⏺ Claude: Analizando diff...', delay: 1500 },
            { type: 'error',   text: '🔴 CRÍTICO [src/api/export.ts:42]: SQL Injection' },
            { type: 'warning', text: '🟡 MEDIA   [src/api/export.ts:18]: Missing error handling' },
            { type: 'output',  text: 'Comentario automático en PR: https://github.com/mi-org/mi-repo/pull/128#review-123' },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# Developer revisa feedback y corrige' },
            { type: 'prompt',  text: 'git push -f origin feature/new-endpoint', delay: 800 },
            { type: 'info',    text: '⏺ GitHub Actions: Ejecutando /code-review nuevamente', delay: 2000 },
            { type: 'success', text: '✓ All checks passed — merge permitted', delay: 1200 },
            { type: 'output',  text: '✓ PR #128 merged by Claude Code Review workflow' },
        ],

        // FROM AGENT 1: Agent SDK Multi-Turn with Resume
        agentSdkMultiTurn: [
            { type: 'comment', text: '# Patrón: Multi-turn con session resume' },
            { type: 'prompt',  text: '/agent-query "Refactoriza el módulo de autenticación"', delay: 800 },
            { type: 'info',    text: '⏺ Iniciando sesión...', delay: 1000 },
            { type: 'info',    text: '⏺ Claude lee 12 archivos (Read)...', delay: 2000 },
            { type: 'info',    text: '⏺ Claude identifica duplicado en 3 funciones...', delay: 1500 },
            { type: 'output',  text: 'Sesión ID: sess_abc123def456' },
            { type: 'output',  text: 'Progreso: 3/5 tareas completas' },
            { type: 'output',  text: 'Costo acumulado: $0.23' },
            { type: 'comment', text: '# [Usuario interrumpe, pausa la sesión]' },
            { type: 'prompt',  text: '/pause', delay: 600 },
            { type: 'success', text: '✓ Sesión pausada. Contexto guardado.' },
            { type: 'comment', text: '# [30 minutos después...]' },
            { type: 'prompt',  text: '/agent-resume sess_abc123def456', delay: 600 },
            { type: 'info',    text: '⏺ Restaurando sesión con 12 archivos en contexto...', delay: 2000 },
            { type: 'info',    text: '⏺ Claude continúa con tarea 4...', delay: 1500 },
            { type: 'success', text: '✓ Refactoring completado, tests pasan' },
            { type: 'output',  text: 'Costo total: $0.42' },
        ],

        // FROM AGENT 2: Hooks Security Gate
        hooksSecurityGate: [
            { type: 'comment', text: '# Patrón: Bloquear comandos peligrosos con hooks' },
            { type: 'prompt',  text: '/hooks-register PreToolUse "block-destructive"', delay: 800 },
            { type: 'output',  text: 'Hook registrado:' },
            { type: 'output',  text: '  Event: PreToolUse' },
            { type: 'output',  text: '  Pattern: rm -rf, truncate, fork bomb' },
            { type: 'success', text: '✓ Hook activo. Ahora intenta ejecutar comando peligroso...' },
            { type: 'prompt',  text: 'rm -rf /important', delay: 800 },
            { type: 'error',   text: '❌ BLOCKED by hook PreToolUse' },
            { type: 'warning', text: '⚠️  Comando bloqueado: rm -rf (patrón destructivo)' },
            { type: 'comment', text: '# Hook registra intento en auditoría' },
            { type: 'prompt',  text: '/hooks-audit-log --since 5m', delay: 800 },
            { type: 'output',  text: '[14:32:15] user@dev: Bash "rm -rf /important" BLOCKED' },
            { type: 'output',  text: '[14:31:42] user@dev: Read "package.json" SUCCESS' },
            { type: 'success', text: '✓ Auditoría centralizada funcionando' },
        ],

        // FROM AGENT 4: Feature Documentation Check
        agentFeaturesAudit: [
            { type: 'comment', text: '# Patrón: Verificar documentación y status de features' },
            { type: 'prompt',  text: '/feature-check "Agent Teams"', delay: 800 },
            { type: 'warning', text: '⚠️  EXPERIMENTAL (env var gated)' },
            { type: 'output',  text: 'Status: Beta (undocumented)' },
            { type: 'output',  text: 'Enable: CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1' },
            { type: 'output',  text: 'Source: GitHub releases (May 2026)' },
            { type: 'comment', text: '# Otro comando: limits & quotas' },
            { type: 'prompt',  text: '/limit-check --model opus', delay: 800 },
            { type: 'output',  text: 'Model: Claude Opus 4.7' },
            { type: 'output',  text: 'Context Window: 1,000,000 tokens (NEW)' },
            { type: 'output',  text: 'Usage Window: 5-hour rolling' },
            { type: 'output',  text: 'File Size Limit: ~50-100MB (estimated, not official)' },
            { type: 'info',    text: '💡 Gaps: rate limits, session duration caps undocumented' },
            { type: 'prompt',  text: '/experimental-list', delay: 800 },
            { type: 'output',  text: 'Experimental Features:' },
            { type: 'output',  text: '  • Agent Teams (env var gated)' },
            { type: 'output',  text: '  • Chrome Extension (beta, known bugs)' },
            { type: 'output',  text: '  • Vercel Integration (community guides only)' },
            { type: 'success', text: '✓ Documentación checkeada' },
        ],

        // ADDITIONAL SCENARIOS
        securityScan: [
            { type: 'prompt',  text: '/security-scan', delay: 600 },
            { type: 'info',    text: '⏺ Scanning codebase for vulnerabilities...', delay: 2000 },
            { type: 'error',   text: '🔴 CRITICAL: Hardcoded AWS keys in config.js:15', delay: 800 },
            { type: 'warning', text: '🟡 HIGH: SQL injection risk in auth.py:42 (user input in query)', delay: 800 },
            { type: 'warning', text: '🟡 MEDIUM: Missing CORS headers in api.js' },
            { type: 'success', text: '✓ Scan complete. 1 critical, 2 high, 1 medium issues found' },
        ],

        performanceOptimize: [
            { type: 'prompt',  text: '/memory-optimize', delay: 600 },
            { type: 'info',    text: '⏺ Analyzing context memory...', delay: 1500 },
            { type: 'output',  text: 'Before: 1,847 KB context' },
            { type: 'output',  text: 'Compacting: Removing duplicates, summarizing...' },
            { type: 'output',  text: 'After: 1,204 KB (35% reduction)' },
            { type: 'success', text: '✓ Memory optimized. Tokens freed: 12,000' },
        ],

        testGeneration: [
            { type: 'prompt',  text: '/suggest-tests src/api/users.ts', delay: 600 },
            { type: 'info',    text: '⏺ Analyzing test coverage...', delay: 1500 },
            { type: 'output',  text: 'Coverage: 45% (target: 80%)' },
            { type: 'output',  text: 'Missing tests:' },
            { type: 'output',  text: '  1. getUserById - happy path + not found' },
            { type: 'output',  text: '  2. createUser - validation + duplicate email' },
            { type: 'output',  text: '  3. deleteUser - cascading deletes' },
            { type: 'success', text: '✓ 8 test suggestions. Ready to implement.' },
        ],

        architectureDecision: [
            { type: 'prompt',  text: '/compare-approaches "Monolith vs Microservices"', delay: 600 },
            { type: 'info',    text: '⏺ Analyzing architectural trade-offs...', delay: 2000 },
            { type: 'output',  text: 'MONOLITH:' },
            { type: 'output',  text: '  ✓ Simple deployment, easier debugging' },
            { type: 'output',  text: '  ✗ Harder to scale, tight coupling' },
            { type: 'output',  text: 'MICROSERVICES:' },
            { type: 'output',  text: '  ✓ Independent scaling, loose coupling' },
            { type: 'output',  text: '  ✗ Complexity, distributed tracing' },
            { type: 'success', text: '✓ Recommendation: Monolith first, migrate to µservices at 10K users' },
        ],

        releaseWorkflow: [
            { type: 'prompt',  text: '/generate-changelog v1.0...v1.1', delay: 600 },
            { type: 'info',    text: '⏺ Analyzing commits between versions...', delay: 1500 },
            { type: 'output',  text: '## Features' },
            { type: 'output',  text: '- Add OAuth2 support' },
            { type: 'output',  text: '- New API endpoints for batch operations' },
            { type: 'output',  text: '## Bug Fixes' },
            { type: 'output',  text: '- Fix memory leak in session handler' },
            { type: 'output',  text: '- SQL injection vulnerability patched' },
            { type: 'success', text: '✓ Changelog generated for release notes' },
        ],

        workspaceSynch: [
            { type: 'prompt',  text: '/workspace-sync', delay: 600 },
            { type: 'info',    text: '⏺ Syncing context with team members...', delay: 2000 },
            { type: 'output',  text: 'Sharing: auth module context' },
            { type: 'output',  text: 'Recipients: alice@company.com, bob@company.com' },
            { type: 'success', text: '✓ Context shared. Team has 5 min to load.' },
        ],

        diffExplain: [
            { type: 'prompt',  text: '/diff-explain old-auth.ts new-auth.ts', delay: 600 },
            { type: 'info',    text: '⏺ Analyzing differences...', delay: 1500 },
            { type: 'output',  text: 'Summary: Migrated from JWT to OAuth2 provider.' },
            { type: 'output',  text: '1. Removed validateToken() function (OAuth handles this)' },
            { type: 'output',  text: '2. Added loginWithGitHub() endpoint' },
            { type: 'output',  text: '3. Session now uses provider tokens instead of self-signed JWTs' },
            { type: 'success', text: '✓ Changes explained in plain English' },
        ],

        dependencyCheck: [
            { type: 'prompt',  text: '/dependency-audit --json', delay: 600 },
            { type: 'info',    text: '⏺ Scanning dependencies...', delay: 2000 },
            { type: 'warning', text: '⚠️ express@4.17.1: Critical vulnerability CVE-2022-xyz' },
            { type: 'warning', text: '⚠️ lodash@4.17.20: Deprecated, update to 4.17.21' },
            { type: 'output',  text: 'Total: 2 vulnerabilities, 1 deprecated' },
            { type: 'success', text: '✓ Run "npm audit fix" to patch' },
        ],
    };

    /* ============================================================
       3. SYNTAX HIGHLIGHTER — basado en regex
       Suficiente para bash/json/markdown/text sin dependencias.
       ============================================================ */
    const SYNTAX_RULES = {
        bash: [
            // comentarios primero (mayor prioridad)
            { re: /(^|\n)\s*#[^\n]*/g,                      cls: 'tok-comment' },
            { re: /"[^"\n]*"/g,                              cls: 'tok-string' },
            { re: /'[^'\n]*'/g,                              cls: 'tok-string' },
            { re: /\B(--?[a-zA-Z][\w-]*)\b/g,                cls: 'tok-flag' },
            { re: /\b(npm|claude|export|cd|mkdir|cat|curl|irm|git|gh|brew|sudo|npx)\b/g, cls: 'tok-command' },
        ],
        json: [
            { re: /"([^"\\]|\\.)*"(?=\s*:)/g,                cls: 'tok-prop' },
            { re: /:\s*"([^"\\]|\\.)*"/g,                    cls: 'tok-string' },
            { re: /\b(true|false|null)\b/g,                  cls: 'tok-keyword' },
            { re: /\b\d+\b/g,                                cls: 'tok-number' },
        ],
        markdown: [
            { re: /^---[\s\S]*?^---/gm,                      cls: 'tok-frontmatter' },
            { re: /^#{1,6}\s+.*/gm,                          cls: 'tok-keyword' },
            { re: /`[^`\n]+`/g,                              cls: 'tok-string' },
        ],
        gitignore: [
            { re: /^\s*#[^\n]*/gm,                           cls: 'tok-comment' },
            { re: /\*[\w*\/.]*/g,                            cls: 'tok-flag' },
        ],
        text: [
            // Para los prompts de Claude Code (líneas con `> `)
            { re: /^>\s+.*/gm,                               cls: 'tok-prompt' },
            { re: /@[\w/.-]+/g,                              cls: 'tok-function' },
            { re: /\/[a-z][a-z0-9-]*/g,                      cls: 'tok-command' },
            { re: /`[^`\n]+`/g,                              cls: 'tok-string' },
        ],
    };

    /**
     * Aplica resaltado de sintaxis sobre el texto plano de un <code>.
     * Funciona en dos fases: 1) marca con tokens placeholder, 2) reemplaza.
     * Eso evita que un match destruya las posiciones del siguiente.
     */
    function highlightCode(codeEl, lang) {
        const rules = SYNTAX_RULES[lang];
        if (!rules) return; // lenguaje sin reglas → texto plano

        let text = codeEl.textContent;
        // Escape HTML primero
        text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const placeholders = [];
        rules.forEach((rule) => {
            text = text.replace(rule.re, (match) => {
                const idx = placeholders.length;
                placeholders.push(`<span class="${rule.cls}">${match}</span>`);
                return `\u0000${idx}\u0000`;
            });
        });

        // Restaurar placeholders
        text = text.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[parseInt(i, 10)]);
        codeEl.innerHTML = text;
    }

    /* ============================================================
       4. HAMBURGUESA PARA MÓVIL
       ============================================================ */
    function setupHamburger() {
        const hamburger = document.getElementById('hamburger-btn');
        const sidebar = document.querySelector('.sidebar');
        if (!hamburger || !sidebar) return;

        hamburger.addEventListener('click', () => {
            const isOpen = sidebar.classList.contains('open');
            sidebar.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', !isOpen);
        });

        // Cerrar sidebar al hacer click en un nav link (en móvil)
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    sidebar.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    /* ============================================================
       5. NAVEGACIÓN ENTRE SECCIONES
       ============================================================ */
    function setupNavigation() {
        const links = document.querySelectorAll('.nav-link, [data-jump]');

        function goTo(sectionId) {
            // Re-buscar secciones cada vez (dinámicamente, por si el modo cambió)
            const sections = document.querySelectorAll('.content-section:not(.hidden)');
            sections.forEach((s) => s.classList.toggle('active', s.dataset.section === sectionId));
            document.querySelectorAll('.nav-link').forEach((l) =>
                l.classList.toggle('active', l.dataset.section === sectionId)
            );
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.replaceState(null, '', `#${sectionId}`);
        }

        links.forEach((link) => {
            link.addEventListener('click', (e) => {
                const target = link.dataset.section || link.dataset.jump;
                if (!target) return;
                e.preventDefault();
                goTo(target);
            });
        });

        // Si la URL tiene un hash al cargar, navegar a esa sección
        const initial = window.location.hash.slice(1);
        if (initial && document.querySelector(`[data-section="${initial}"]`)) {
            goTo(initial);
        }
    }

    /* ============================================================
       5. RENDERIZADO DE TABLAS DE COMANDOS por nivel
       ============================================================ */
    function renderCommandsTable(containerId, level) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const items = COMMANDS_DATA.filter((c) => c.level === level);

        const table = document.createElement('table');
        table.className = 'commands-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Comando</th>
                    <th>Descripción</th>
                    <th>Ejemplo</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${items.map((c) => `
                    <tr>
                        <td><span class="cmd-name">${escapeHtml(c.cmd)}</span></td>
                        <td class="cmd-desc">${escapeHtml(c.desc)}</td>
                        <td class="cmd-example">${escapeHtml(c.example)}</td>
                        <td class="cmd-copy-cell">
                            <button class="cmd-copy-btn" data-copy="${escapeAttr(c.example)}">Copiar</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        container.appendChild(table);
    }

    /* ============================================================
       6. BUSCADOR EN TIEMPO REAL
       Filtra COMMANDS_DATA por cmd, descripción o ejemplo.
       Muestra los resultados en un overlay debajo del topbar.
       ============================================================ */
    function setupSearch() {
        const input = document.getElementById('command-search');
        const results = document.getElementById('search-results');
        if (!input || !results) return;

        let selectedIndex = -1;

        function render(query) {
            const q = query.trim().toLowerCase();
            if (!q) { results.hidden = true; selectedIndex = -1; return; }

            const matches = COMMANDS_DATA.filter((c) =>
                c.cmd.toLowerCase().includes(q) ||
                c.desc.toLowerCase().includes(q) ||
                c.example.toLowerCase().includes(q) ||
                String(c.level).includes(q)
            );

            if (matches.length === 0) {
                results.innerHTML = `<div class="search-result-empty">
                    Sin resultados para "<strong>${escapeHtml(query)}</strong>".
                    Prueba con: <code>mcp</code>, <code>compact</code>, <code>skill</code>, <code>level:2</code>.
                </div>`;
            } else {
                results.innerHTML = matches.map((c) => `
                    <div class="search-result-item" data-jump="nivel-${c.level}">
                        <span class="search-result-cmd">${escapeHtml(c.cmd)}</span>
                        <span class="search-result-desc">${escapeHtml(c.desc)}</span>
                        <span class="search-result-level" style="background: var(--level-${c.level}); color: #000;">
                            Nivel ${c.level}
                        </span>
                    </div>
                `).join('');
            }
            results.hidden = false;
            selectedIndex = -1;
        }

        function setSelected(idx) {
            const items = document.querySelectorAll('.search-result-item');
            items.forEach((item, i) => {
                if (i === idx) item.classList.add('selected');
                else item.classList.remove('selected');
            });
            if (idx >= 0 && idx < items.length) {
                items[idx].scrollIntoView({ block: 'nearest' });
            }
        }

        // Debounce simple
        let t;
        input.addEventListener('input', (e) => {
            clearTimeout(t);
            t = setTimeout(() => render(e.target.value), 80);
        });

        // Click sobre un resultado → navegar a ese nivel
        results.addEventListener('click', (e) => {
            const item = e.target.closest('.search-result-item');
            if (!item) return;
            const target = item.dataset.jump;
            if (target) {
                document.querySelector(`.nav-link[data-section="${target}"]`)?.click();
                input.value = '';
                results.hidden = true;
            }
        });

        // Cerrar con Escape o click fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper') && !e.target.closest('.search-results')) {
                results.hidden = true;
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                input.value = '';
                results.hidden = true;
                input.blur();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const items = document.querySelectorAll('.search-result-item');
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                setSelected(selectedIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                setSelected(selectedIndex);
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();
                const items = document.querySelectorAll('.search-result-item');
                if (items[selectedIndex]) items[selectedIndex].click();
            }
        });

        // Atajo Ctrl/Cmd + K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                input.focus();
                input.select();
            }
        });
    }

    /* ============================================================
       7. BOTONES DE COPIADO en cada code-block + tabla
       ============================================================ */
    function setupCopyButtons() {
        // En bloques de código
        document.querySelectorAll('.code-block').forEach((block) => {
            const codeEl = block.querySelector('code');
            if (!codeEl) return;

            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.textContent = 'Copiar';
            btn.setAttribute('aria-label', 'Copiar código al portapapeles');
            btn.addEventListener('click', () => copyToClipboard(codeEl.textContent, btn));
            block.appendChild(btn);
        });

        // En filas de tabla — usa delegación de eventos
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.cmd-copy-btn');
            if (!btn) return;
            copyToClipboard(btn.dataset.copy, btn);
        });
    }

    function copyToClipboard(text, btn) {
        const apply = () => {
            const orig = btn.textContent;
            btn.textContent = '✓ Copiado';
            btn.classList.add('copied');
            showToast('Copiado al portapapeles');
            setTimeout(() => {
                btn.textContent = orig;
                btn.classList.remove('copied');
            }, 1500);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(apply).catch(() => fallbackCopy(text, apply));
        } else {
            fallbackCopy(text, apply);
        }
    }

    function fallbackCopy(text, cb) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); cb(); }
        catch { /* silencioso */ }
        document.body.removeChild(ta);
    }

    function showToast(msg) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.hidden = false;
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => { toast.hidden = true; }, 2000);
    }

    /* ============================================================
       8. SIMULADOR DE TERMINAL — animación tipo "typewriter"
       ============================================================ */
    function setupTerminal() {
        const select = document.getElementById('scenario-select');
        const runBtn = document.getElementById('run-scenario');
        const clearBtn = document.getElementById('clear-terminal');
        const body = document.getElementById('terminal-body');
        if (!select || !runBtn || !body) return;

        let currentRun = 0; // ID para abortar runs previos al reiniciar

        function clear() {
            body.innerHTML = `
                <div class="terminal-line terminal-line--info">
                    Terminal limpio. Selecciona un escenario y pulsa "Ejecutar".
                </div>
            `;
        }

        function appendLine(line) {
            const div = document.createElement('div');
            div.className = `terminal-line terminal-line--${line.type}`;
            div.textContent = line.text;
            body.appendChild(div);
            body.scrollTop = body.scrollHeight;
        }

        async function run(scenarioKey) {
            const lines = SCENARIOS[scenarioKey];
            if (!lines) return;

            currentRun++;
            const myRun = currentRun;
            body.innerHTML = '';

            for (const line of lines) {
                if (myRun !== currentRun) return; // un nuevo run abortó éste
                await sleep(line.delay || 80);
                appendLine(line);
            }

            // Cursor parpadeante al final
            const cursor = document.createElement('span');
            cursor.className = 'terminal-cursor';
            const lastLine = document.createElement('div');
            lastLine.className = 'terminal-line';
            lastLine.appendChild(cursor);
            body.appendChild(lastLine);
            body.scrollTop = body.scrollHeight;
        }

        runBtn.addEventListener('click', () => run(select.value));
        clearBtn.addEventListener('click', () => { currentRun++; clear(); });

        clear();
    }

    /* ============================================================
       8.5 COMPONENTES DIDÁCTICOS
       ============================================================ */
    function renderLesson(level) {
        const lesson = LESSONS_DATA[level];
        const introDiv = document.querySelector(`.lesson-intro[data-lesson="${level}"]`);
        const outroDiv = document.querySelector(`.lesson-outro[data-lesson="${level}"]`);
        if (!introDiv || !outroDiv) return;

        // Intro: objetivos + tools + subtopics
        const toolsHtml = lesson.tools.map(t => `<span class="tool-chip">${escapeHtml(t)}</span>`).join('');
        const subtopicsHtml = lesson.subtopics ? `
            <div class="lesson-section">
                <h3>🎯 Temas principales</h3>
                <div class="subtopics-grid">
                    ${lesson.subtopics.map(st => `
                        <div class="subtopic-card">
                            <strong>${escapeHtml(st.name)}</strong>
                            <p>${escapeHtml(st.desc)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        introDiv.innerHTML = `
            <div class="lesson-section">
                <h3>📍 Objetivos del nivel</h3>
                <ul class="lesson-objectives">
                    ${lesson.objectives.map(o => `<li>${escapeHtml(o)}</li>`).join('')}
                </ul>
            </div>
            <div class="lesson-section">
                <h3>🧰 Herramientas que usarás</h3>
                <div class="tools-grid">${toolsHtml}</div>
            </div>
            ${subtopicsHtml}
        `;

        // Outro: case + quiz + mission + checkpoint
        const caseHtml = `
            <div class="lesson-section">
                <h3>${lesson.caseStudy.title}</h3>
                <p><strong>Contexto:</strong> ${escapeHtml(lesson.caseStudy.context)}</p>
                <div class="case-steps">
                    ${lesson.caseStudy.steps.map((s, i) => `
                        <div class="case-step">
                            <strong>Paso ${i + 1}:</strong> <code>${escapeHtml(s.cmd)}</code>
                            <p>${escapeHtml(s.what)}</p>
                        </div>
                    `).join('')}
                </div>
                <p><strong>Resultado esperado:</strong> ${escapeHtml(lesson.caseStudy.expected)}</p>
            </div>
        `;

        const quizHtml = `
            <div class="lesson-section">
                <h3>✅ Quiz de refuerzo</h3>
                <div class="quiz-container" data-level="${level}">
                    ${lesson.quiz.map((q, i) => `
                        <div class="quiz-card" data-q="${i}">
                            <p class="quiz-question">${escapeHtml(q.q)}</p>
                            <div class="quiz-options">
                                ${q.options.map((opt, j) => `
                                    <label class="quiz-option">
                                        <input type="radio" name="q${i}" value="${j}">
                                        ${escapeHtml(opt)}
                                    </label>
                                `).join('')}
                            </div>
                            <div class="quiz-feedback" hidden></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const missionHtml = `
            <div class="lesson-section">
                <h3>${lesson.mission.title}</h3>
                <p><strong>Objetivo:</strong> ${escapeHtml(lesson.mission.goal)}</p>
                <ol class="mission-steps">
                    ${lesson.mission.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
                </ol>
                <div class="info-banner info-banner--tip">
                    <strong>✨ Al completar:</strong> ${escapeHtml(lesson.mission.success)}
                </div>
                <details class="mission-troubleshooting">
                    <summary>Troubleshooting</summary>
                    <ul>
                        ${lesson.mission.troubleshooting.map(t => `<li>${t}</li>`).join('')}
                    </ul>
                </details>
            </div>
        `;

        const checkpointHtml = `
            <div class="lesson-section checkpoint-section">
                <button class="checkpoint-btn" data-level="${level}">🏁 Marcar Nivel ${level} completado</button>
            </div>
        `;

        outroDiv.innerHTML = caseHtml + quizHtml + missionHtml + checkpointHtml;
    }

    function initQuiz() {
        document.addEventListener('change', (e) => {
            if (!e.target.matches('input[type="radio"]')) return;
            const card = e.target.closest('.quiz-card');
            const level = parseInt(e.target.name.replace('q', ''));
            const qIdx = parseInt(card.dataset.q);
            const lesson = LESSONS_DATA[parseInt(card.closest('.quiz-container').dataset.level)];
            const q = lesson.quiz[qIdx];
            const chosen = parseInt(e.target.value);
            const feedback = card.querySelector('.quiz-feedback');

            if (chosen === q.correct) {
                feedback.className = 'quiz-feedback quiz-feedback--ok';
                feedback.textContent = '✓ Correcto. ' + q.explain;
            } else {
                feedback.className = 'quiz-feedback quiz-feedback--ko';
                feedback.textContent = '✗ Incorrecto. ' + q.explain;
            }
            feedback.hidden = false;
        });
    }

    function initCheckpoints() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.checkpoint-btn');
            if (!btn) return;
            const level = parseInt(btn.dataset.level);
            localStorage.setItem(`cc-level-${level}-completed`, new Date().toISOString());
            btn.disabled = true;
            btn.textContent = `✓ Nivel ${level} completado (${new Date().toLocaleDateString()})`;
            updateLevelBadges();
        });
    }

    function updateLevelBadges() {
        for (let i = 1; i <= 3; i++) {
            const badge = document.querySelector(`.nav-badge.nivel-${i}`);
            if (!badge) continue;
            if (localStorage.getItem(`cc-level-${i}-completed`)) {
                badge.textContent = '✓';
                badge.style.opacity = '0.7';
            }
        }
    }

    /* ============================================================
       8.7 DESAFÍOS INTERACTIVOS DEL CURSO
       Renderiza retos, valida respuestas, persiste progreso.
       ============================================================ */
    function renderChallenges(filter = 'all') {
        const container = document.getElementById('challenges-container');
        if (!container) return;

        const items = filter === 'all'
            ? CHALLENGES_DATA
            : CHALLENGES_DATA.filter(c => c.category === filter);

        const state = JSON.parse(localStorage.getItem('cc-challenges') || '{}');

        container.innerHTML = items.map(c => {
            const userAnswer = state[c.id];
            const isCorrect = userAnswer !== undefined && userAnswer === c.correct;
            const isAnswered = userAnswer !== undefined;

            return `
                <article class="challenge-card ${isAnswered ? (isCorrect ? 'challenge-card--correct' : 'challenge-card--incorrect') : ''}" data-challenge="${c.id}">
                    <header class="challenge-header">
                        <span class="challenge-id">#${String(c.id).padStart(2, '0')}</span>
                        <span class="challenge-category challenge-category--${c.category}">${c.category}</span>
                        <span class="challenge-difficulty challenge-difficulty--${c.difficulty}">${c.difficulty}</span>
                        ${isAnswered ? `<span class="challenge-status">${isCorrect ? '✓' : '✗'}</span>` : ''}
                    </header>
                    <p class="challenge-scenario">${escapeHtml(c.scenario)}</p>
                    <div class="challenge-options">
                        ${c.options.map((opt, i) => `
                            <label class="challenge-option ${isAnswered && i === c.correct ? 'challenge-option--correct' : ''} ${isAnswered && i === userAnswer && i !== c.correct ? 'challenge-option--wrong' : ''}">
                                <input type="radio" name="ch-${c.id}" value="${i}" ${isAnswered ? 'disabled' : ''} ${userAnswer === i ? 'checked' : ''}>
                                <span>${escapeHtml(opt)}</span>
                            </label>
                        `).join('')}
                    </div>
                    ${isAnswered ? `
                        <div class="challenge-explain ${isCorrect ? 'challenge-explain--ok' : 'challenge-explain--ko'}">
                            <strong>${isCorrect ? '✓ Correcto.' : '✗ Incorrecto.'}</strong> ${escapeHtml(c.explain)}
                        </div>
                        <button class="challenge-retry" data-retry="${c.id}">↻ Volver a intentar</button>
                    ` : ''}
                </article>
            `;
        }).join('');

        updateChallengesStats();
    }

    function updateChallengesStats() {
        const state = JSON.parse(localStorage.getItem('cc-challenges') || '{}');
        const attempted = Object.keys(state).length;
        const correct = Object.entries(state).filter(([id, ans]) => {
            const ch = CHALLENGES_DATA.find(c => c.id === parseInt(id));
            return ch && ch.correct === ans;
        }).length;
        const accuracy = attempted ? Math.round((correct / attempted) * 100) + '%' : '—';

        const correctEl = document.getElementById('challenges-correct');
        const attemptedEl = document.getElementById('challenges-attempted');
        const accuracyEl = document.getElementById('challenges-accuracy');
        if (correctEl) correctEl.textContent = correct;
        if (attemptedEl) attemptedEl.textContent = attempted;
        if (accuracyEl) accuracyEl.textContent = accuracy;
    }

    function setupChallenges() {
        const container = document.getElementById('challenges-container');
        if (!container) return;

        // Render inicial
        renderChallenges('all');

        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderChallenges(btn.dataset.filter);
            });
        });

        // Selección de respuesta
        container.addEventListener('change', (e) => {
            if (!e.target.matches('input[type="radio"][name^="ch-"]')) return;
            const id = parseInt(e.target.name.replace('ch-', ''));
            const value = parseInt(e.target.value);
            const state = JSON.parse(localStorage.getItem('cc-challenges') || '{}');
            state[id] = value;
            localStorage.setItem('cc-challenges', JSON.stringify(state));

            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
            renderChallenges(activeFilter);
        });

        // Volver a intentar
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.challenge-retry');
            if (!btn) return;
            const id = parseInt(btn.dataset.retry);
            const state = JSON.parse(localStorage.getItem('cc-challenges') || '{}');
            delete state[id];
            localStorage.setItem('cc-challenges', JSON.stringify(state));
            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
            renderChallenges(activeFilter);
        });

        // Reset global
        const resetBtn = document.getElementById('reset-challenges');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('¿Resetear todo tu progreso de desafíos?')) {
                    localStorage.removeItem('cc-challenges');
                    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
                    renderChallenges(activeFilter);
                }
            });
        }
    }

    /* ============================================================
       8.8 PROGRESO DEL CURSO (roadmap visual)
       Muestra módulos completados según localStorage.
       ============================================================ */
    function updateCourseProgress() {
        const fill = document.getElementById('progress-fill');
        const label = document.getElementById('progress-label');
        if (!fill || !label) return;

        // Mapeo de módulos a checkpoints existentes (3 niveles + 4 secciones avanzadas)
        const moduleStatus = {
            1: !!localStorage.getItem('cc-level-1-completed'),
            2: !!localStorage.getItem('cc-flow-completed'),
            3: !!localStorage.getItem('cc-level-2-completed'),
            4: !!localStorage.getItem('cc-mcp-completed'),
            5: !!localStorage.getItem('cc-level-3-completed'),
            6: !!localStorage.getItem('cc-sdk-completed'),
            7: !!localStorage.getItem('cc-capstone-completed'),
        };

        const completed = Object.values(moduleStatus).filter(Boolean).length;
        const pct = Math.round((completed / 7) * 100);

        fill.style.width = pct + '%';
        label.textContent = `${completed} / 7 módulos completados (${pct}%)`;

        // Marcar visualmente los módulos completados en el roadmap
        document.querySelectorAll('.roadmap-module').forEach(m => {
            const num = parseInt(m.dataset.module);
            if (moduleStatus[num]) m.classList.add('roadmap-module--done');
        });
    }

    /* ============================================================
       8.9 CAPSTONE CHECKLIST (persistido)
       ============================================================ */
    function setupCapstoneChecklist() {
        document.querySelectorAll('input[type="checkbox"][data-capstone]').forEach(cb => {
            const key = `cc-capstone-${cb.dataset.capstone}`;
            cb.checked = !!localStorage.getItem(key);

            cb.addEventListener('change', () => {
                if (cb.checked) localStorage.setItem(key, '1');
                else localStorage.removeItem(key);

                // Si todos están marcados, completar el capstone
                const all = document.querySelectorAll('input[data-capstone]');
                const done = Array.from(all).every(c => c.checked);
                if (done) {
                    localStorage.setItem('cc-capstone-completed', new Date().toISOString());
                    showToast('🎉 Capstone completado — eres un experto Claude Code');
                } else {
                    localStorage.removeItem('cc-capstone-completed');
                }
                updateCourseProgress();
            });
        });
    }

    /* ============================================================
       9. UTILIDADES
       ============================================================ */
    function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }
    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function escapeAttr(s) {
        return escapeHtml(s).replace(/`/g, '&#96;');
    }

    function applyHighlightingToAll() {
        document.querySelectorAll('.code-block').forEach((block) => {
            const lang = block.dataset.lang || 'text';
            const codeEl = block.querySelector('code');
            if (codeEl) highlightCode(codeEl, lang);
        });
    }

    function updateStats() {
        const el = document.getElementById('stat-commands');
        if (el) el.textContent = COMMANDS_DATA.length;
        const cases = document.getElementById('stat-cases');
        if (cases) cases.textContent = '10+';
        const skills = document.getElementById('stat-skills');
        if (skills) skills.textContent = '12+';
    }

    /* ============================================================
       10. BOOTSTRAP
       ============================================================ */
    document.addEventListener('DOMContentLoaded', () => {
        // 0.5) Modo técnico vs accesible

        // 1) Datos
        renderCommandsTable('commands-table-nivel-1', 1);
        renderCommandsTable('commands-table-nivel-2', 2);
        renderCommandsTable('commands-table-nivel-3', 3);

        // 1.5) Lecciones didácticas
        renderLesson(1);
        renderLesson(2);
        renderLesson(3);

        // 2) Navegación
        setupNavigation();

        // 2.5) Hamburguesa móvil
        setupHamburger();

        // 3) Buscador
        setupSearch();

        // 4) Resaltado de sintaxis
        applyHighlightingToAll();

        // 5) Copiado
        setupCopyButtons();

        // 5.5) Didáctico: quiz, checkpoints
        initQuiz();
        initCheckpoints();
        updateLevelBadges();

        // 6) Terminal
        setupTerminal();

        // 6.5) Curso interactivo
        setupChallenges();
        setupCapstoneChecklist();
        updateCourseProgress();

        // 7) Stats
        updateStats();

        // Log de bienvenida en consola — útil para devs que inspeccionen
        console.log(
            '%c Claude Code Mastery %c  Guía interactiva cargada',
            'background: #ff7a59; color: #1a0a05; padding: 4px 8px; border-radius: 4px; font-weight: 700;',
            'color: #9aa7b8;'
        );
    });
})();
