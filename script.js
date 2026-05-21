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

        // --- Nivel 4: Comandos Maestría Práctica ---
        { cmd: 'mcpb init', level: 4, category: 'shell',
          desc: 'Inicializa manifest.json para empaquetar un MCP server como .mcpb distribuible.',
          example: 'mcpb init' },
        { cmd: 'mcpb pack', level: 4, category: 'shell',
          desc: 'Empaqueta el MCP server en un archivo .mcpb listo para distribución.',
          example: 'mcpb pack' },
        { cmd: 'mcpb validate', level: 4, category: 'shell',
          desc: 'Valida el manifest.json antes de empaquetar (evita errores en campos obligatorios).',
          example: 'mcpb validate' },
        { cmd: 'claude --worktree', level: 4, category: 'shell',
          desc: 'Inicia sesión en un git worktree aislado para trabajo paralelo sin conflictos.',
          example: 'claude --worktree feature-auth' },
        { cmd: 'claude --from-pr', level: 4, category: 'shell',
          desc: 'Carga diff + comentarios de un PR automáticamente al contexto de la sesión.',
          example: 'claude --from-pr 42' },
        { cmd: 'claude --permission-mode auto', level: 4, category: 'shell',
          desc: 'Usa el clasificador IA para evaluar el riesgo de cada acción antes de ejecutarla.',
          example: 'claude --permission-mode auto -p "fix all lint errors"' },
        { cmd: '/fork', level: 4, category: 'built-in',
          desc: 'Bifurca la sesión heredando contexto completo + caché compartida (10× cost savings).',
          example: '/fork "Explorar enfoque alternativo"' },
        { cmd: '/team-onboarding', level: 4, category: 'built-in',
          desc: 'Genera TEAM_ONBOARDING.md automático desde historial real del proyecto.',
          example: '/team-onboarding' },
        { cmd: '/btw', level: 4, category: 'built-in',
          desc: 'Pregunta fuera de contexto sin contaminar historial de conversación.',
          example: '/btw ¿cuántos tokens llevo en esta sesión?' },
        { cmd: 'claude mcp add --scope project', level: 4, category: 'shell',
          desc: 'Registra MCP server a nivel proyecto (compartible en git vía .mcp.json).',
          example: 'claude mcp add --scope project --transport http github https://api.githubcopilot.com/mcp/' },
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
            modules: [
                { id: 'instalacion', title: 'Instalación', description: 'Configuración multiplataforma e instalación rápida de Claude Code.' },
                { id: 'prompt-craft', title: 'Prompt Craft Básico', description: 'Técnicas esenciales para escribir prompts efectivos y claros.' },
                { id: 'decision-framework', title: 'Decision Framework', description: 'Marco para tomar decisiones de diseño y arquitectura con Claude.' },
                { id: 'cost-management', title: 'Gestión de Costos Básica', description: 'Entender tokens, optimizar contexto y controlar gastos.' },
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
                    q: '¿Cuál es el comando para generar un CLAUDE.md analizando automáticamente el proyecto?',
                    options: [
                        '/init',
                        '/create',
                        '/analyze',
                        '/setup'
                    ],
                    correct: 0,
                    explain: '/init escanea package.json, README.md y la estructura del proyecto para crear una base de CLAUDE.md. Es el primer paso recomendado.'
                },
                {
                    q: '¿Cuál es la sintaxis correcta para referenciar un archivo en una pregunta?',
                    options: [
                        'file:path/to/file',
                        '@path/to/file',
                        '#path/to/file',
                        '/read path/to/file'
                    ],
                    correct: 1,
                    explain: 'La sintaxis @ es nativa en Claude Code: @src/auth.ts. Soporta autocompletado y rangos como @src/auth.ts:42-80.'
                },
                {
                    q: '¿Qué comando uso para ver la versión instalada de Claude Code?',
                    options: [
                        'claude --version',
                        'claude -v',
                        'claude version',
                        'claude status'
                    ],
                    correct: 0,
                    explain: 'claude --version te muestra la versión instalada. Útil para verificar que la instalación es correcta.'
                },
                {
                    q: '¿Por qué es importante versionear el archivo .claude/settings.json en tu repo?',
                    options: [
                        'Ocupa menos espacio que guardar settings en la nube.',
                        'Porque todo el equipo hereda la misma configuración y no hay sorpresas entre máquinas.',
                        'Porque la autenticación requiere keys en el repo.',
                        'Para que Git bloquee los cambios de settings.'
                    ],
                    correct: 1,
                    explain: '.claude/settings.json versionado = configuración reproducible en equipo. Sin él, cada desarrollador configura diferente, causando inconsistencias.'
                },
                {
                    q: 'Explica la diferencia fundamental entre /clear y /rewind:',
                    options: [
                        '/clear borra archivos, /rewind borra el historial de chat.',
                        '/clear borra toda la sesión; /rewind (Esc Esc) abre checkpoints para volver atrás preservando contexto.',
                        'Son exactamente lo mismo.',
                        '/rewind es para git, /clear para Claude.'
                    ],
                    correct: 1,
                    explain: '/clear: tab rasa, pierdes todo. /rewind: viaja en el tiempo dentro de la sesión, conservando el plan. Usa /rewind para errores recuperables.'
                },
                {
                    q: '¿Cuál es la forma recomendada de autenticarse en Claude Code?',
                    options: [
                        'Pegar la API key en .claude/settings.json.',
                        'OAuth con `claude auth login` — seguro y sin exponer secretos.',
                        'Pasar --api-key en cada comando.',
                        'Usar una contraseña global en ~/.bashrc.'
                    ],
                    correct: 1,
                    explain: 'OAuth es seguro: nunca almacena keys en archivos versionables. Las keys expuestas = brechas de seguridad. Siempre OAuth.'
                },
                {
                    q: '¿Qué significa que Claude Code sea \'context-aware\'?',
                    options: [
                        'Que usa inteligencia artificial.',
                        'Que recuerda archivos, decisiones previas y el historial de la sesión para responder coherentemente.',
                        'Que puede acceder a tu navegador.',
                        'Que lee tweets en tiempo real.'
                    ],
                    correct: 1,
                    explain: 'Context-aware = mantiene un modelo mental del proyecto. Lee @archivo, recuerda CLAUDE.md, sigue un plan. Cada respuesta está informada por TODO el contexto.'
                },
                {
                    q: 'Estás en un repo nuevo. Siguiendo las mejores prácticas, ¿en qué orden ejecutarías estos comandos?',
                    options: [
                        '1. /init, 2. /memory add \'decisiones\', 3. @archivo específico',
                        '1. claude --version, 2. /init, 3. leer README.md',
                        '1. /init para generar CLAUDE.md, 2. Leer y mejorar CLAUDE.md, 3. @CLAUDE.md en prompts futuros',
                        '1. /clear, 2. /init, 3. /memory add...'
                    ],
                    correct: 2,
                    explain: '/init → CLAUDE.md generado. Luego lo editas para contexto específico. Futuras sesiones: @CLAUDE.md inyecta automáticamente el contexto del proyecto.'
                },
                {
                    q: 'Tu proyecto tiene 15 archivos con tecnologías diferentes (React, Node, Docker). ¿Cómo estructurarías el CLAUDE.md para máxima utilidad?',
                    options: [
                        'Un listado simple de archivos.',
                        'Stack (Node 18, React 18, Docker), scripts npm clave, convenciones de código, decisiones arquitectónicas claves y cómo se conectan los módulos.',
                        'Solo el README.md copiado.',
                        'Links externos sin info local.'
                    ],
                    correct: 1,
                    explain: 'Buen CLAUDE.md: Stack + Scripts útiles + Convenciones + Arquitectura en alto nivel + Rutas importantes. Claude entiende TODO en 1 lectura, sin sorpresas.'
                }
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
            modules: [
                { id: 'testing-asistido', title: 'Testing Asistido', description: 'Generar tests con Claude de forma automática y eficiente.' },
                { id: 'gobernanza', title: 'Gobernanza y Compliance', description: 'Políticas para uso de Claude Code en equipos grandes.' },
                { id: 'monitoreo-costos', title: 'Monitoreo de Costos', description: 'Seguimiento detallado de uso de tokens y optimización.' },
                { id: 'incident-response', title: 'Incident Response', description: 'Automatización de respuesta a incidentes con Claude.' },
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
                    q: '¿Cuál comando muestra el desglose detallado de tokens consumidos en la sesión actual?',
                    options: [
                        '/usage',
                        '/context',
                        '/stats',
                        '/tokens'
                    ],
                    correct: 0,
                    explain: '/usage te muestra tokens por sesión, modelo usado, y costos estimados. /context es más visual (porcentaje).'
                },
                {
                    q: '¿A qué porcentaje de contexto es recomendable compactar?',
                    options: [
                        '50%',
                        '70%+',
                        '90%',
                        'Nunca'
                    ],
                    correct: 1,
                    explain: 'Al llegar a 70%+, compacta guiado. Después de 85% es demasiado tarde — el modelo tiene poco espacio para nuevas respuestas.'
                },
                {
                    q: '¿Cuál es la diferencia CLAVE entre /compact y /memory?',
                    options: [
                        'Son sinónimos.',
                        '/compact = gesiona la sesión actual; /memory = persiste entre sesiones.',
                        '/compact es automático, /memory es manual.',
                        '/memory solo para equipos.'
                    ],
                    correct: 1,
                    explain: '/compact: resume ahora, limpia la ventana actual. /memory: guarda en archivo que sobrevive sesiones → para arquitectura, decisiones, lecciones aprendidas.'
                },
                {
                    q: '¿Por qué es crítico usar variables de entorno para tokens MCP en lugar de hardcodearlos?',
                    options: [
                        'Es más rápido.',
                        'Previene exponer secretos en archivos versionados (git).',
                        'Usa menos memoria.',
                        'No hay razón real.'
                    ],
                    correct: 1,
                    explain: 'Si hardcodeas tokens → git los trackea → brecha de seguridad inmediata. Variables de entorno (${GITHUB_TOKEN}) = secretos seguros, nunca en versionado.'
                },
                {
                    q: 'Después de ejecutar /compact, ¿qué sucede con el contexto previo?',
                    options: [
                        'Desaparece completamente.',
                        'Se resume y comprime en el nuevo contexto, solo lo esencial.',
                        'Se guarda automáticamente en /memory.',
                        'Nada — /compact es solo un comando de información.'
                    ],
                    correct: 1,
                    explain: '/compact resume lo importante (plan, archivos, errores resueltos) en una versión comprimida. Pierdes logs/tangentes, conservas trabajo real.'
                },
                {
                    q: '¿Qué es un servidor MCP stdio vs SSE?',
                    options: [
                        'Tipos de herramientas (GitHub vs Slack).',
                        'stdio = local/rápido (tu máquina). SSE = remoto/escalable (servidor Anthropic).',
                        'Formas diferentes de autenticar.',
                        'Versiones de Claude Code.'
                    ],
                    correct: 1,
                    explain: 'stdio: `npx @mcp/server-fs` en tu máquina → rápido pero no escalable. SSE: servidor remoto → escalable pero latencia.'
                },
                {
                    q: 'Llevas 2 horas migrando un módulo a TypeScript. Contexto = 75%, y necesitas 3 horas más. ¿Plan de acción?',
                    options: [
                        '1. /clear y reexplicar desde cero.',
                        '1. /context para medir. 2. /compact \'plan de migración + 5 archivos migrados, descarta logs\'. 3. /memory para guardar patrón. 4. Seguir.',
                        'Ignorar y continuar.',
                        'Cambiar a Haiku para ahorrar tokens.'
                    ],
                    correct: 1,
                    explain: 'Profesional: mide → compacta guiado (preserva plan) → guarda en memory → continúa. Garantiza 3 horas de trabajo sin perder la visión.'
                },
                {
                    q: 'Tu equipo necesita MCP de GitHub (leer commits, PRs). ¿Cómo lo configuras para que funcione sin exponer tokens?',
                    options: [
                        '1. Poner GITHUB_TOKEN en .mcp.json. 2. Commitear.',
                        '1. Crear .mcp.json con ${GITHUB_TOKEN}. 2. Cada dev: export GITHUB_TOKEN=xxx en su .bashrc. 3. Gitignore .mcp.json.local.',
                        '1. Create GitHub PAT. 2. Hardcodear en .mcp.json. 3. Revisar en PR.',
                        'No es posible sin comprometer seguridad.'
                    ],
                    correct: 1,
                    explain: '.mcp.json versionado usa ${VAR}. Cada dev exporta en su shell (nunca commiteado). Seguro y reproducible.'
                },
                {
                    q: 'Comparación: ¿Cuándo elegirías /compact sobre /clear?',
                    options: [
                        'Nunca, /clear es más limpio.',
                        'Cuando necesitas preservar decisiones pero liberar tokens. /compact resume, /clear pierde TODO.',
                        'Son equivalentes, usa el que prefieras.',
                        'Solo en emergencias.'
                    ],
                    correct: 1,
                    explain: '/clear: iniciar proyecto nuevo. /compact: continuación del mismo trabajo. Elegir bien = productividad 3× mayor.'
                },
                {
                    q: 'Analiza este escenario: Tu .mcp.json referencia ${DB_HOST} pero algunos devs reportan \'herramienta MCP inaccesible\'. ¿Diagnóstico?',
                    options: [
                        'El .mcp.json está roto.',
                        'Los devs no exportaron DB_HOST en su shell.',
                        'Necesitan reinstalar Claude Code.',
                        'MCP no soporta variables de entorno.'
                    ],
                    correct: 1,
                    explain: 'Variables sin exportar = MCP ve \'undefined\' → falla. Solución: `export DB_HOST=localhost` en su .bashrc ANTES de abrir Claude.'
                }
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

        4: {
            title: 'Maestría Práctica — De Experimentación a Producción',
            objectives: [
                'Construir y empaquetar un MCP Server personalizado (.mcpb) listo para distribución.',
                'Crear Skills reutilizables con hooks integrados y desplegarlas en equipo.',
                'Orquestar múltiples agentes en paralelo (Split-and-Merge, Fork, Worktrees).',
                'Reducir costos de tokens 40-60% con Prompt Caching y optimización de contexto.',
                'Configurar settings.json, hooks y sandbox para sistemas de producción reales.',
            ],
            tools: ['/fork', '/team-onboarding', 'mcpb', '--worktree', '--from-pr', 'settings.json', 'hooks', 'Batch API'],
            subtopics: [
                { name: 'MCP Server Development', desc: 'Estructura .mcpb, manifest.json, empaquetamiento y marketplaces (Smithery, mpak, MCPFinder).' },
                { name: 'Custom Skills & Hooks', desc: 'SKILL.md avanzado, 12 hook events (PreToolUse, PostToolUse, onFileChange...), lifecycle completo.' },
                { name: 'Multi-Agent Orchestration', desc: 'Split-and-merge, fork (10× cost savings con caché compartida), worktrees, agent teams.' },
                { name: 'Token Optimization', desc: '8 técnicas para 40-60% ahorro. Prompt Caching, Batch API, sumarización jerárquica.' },
                { name: 'Production & Settings', desc: 'settings.json deep dive, sandbox, managed settings enterprise, 20 errores críticos reales.' },
            ],
            caseStudy: {
                title: '🛠️ Caso práctico: sistema de review automatizado',
                context: 'Quieres que 3 agentes paralelos revisen cada PR automáticamente (seguridad, performance, style) con prompt caching para ahorrar tokens.',
                steps: [
                    { cmd: 'mcpb init && mcpb pack', what: 'Creas y empaquetas tu MCP server con herramientas de análisis de código.' },
                    { cmd: 'mkdir -p .claude/skills/parallel-review', what: 'Skill que lanza 3 subagentes en paralelo con /fork.' },
                    { cmd: 'Configura .claude/settings.json con hooks y prompt caching', what: 'Ahorro automático de tokens en cada llamada.' },
                    { cmd: 'claude --from-pr 42 --permission-mode auto', what: 'Review real sobre PR con autonomía configurada.' },
                ],
                expected: 'Review completo en <60s con 3 agentes en paralelo, 40% menos tokens por prompt caching.',
            },
            quiz: [
                {
                    q: '¿Qué herramienta usas para empaquetar un MCP server distribuible?',
                    options: [
                        'npm pack',
                        'mcpb pack',
                        'docker build',
                        'git archive'
                    ],
                    correct: 1,
                    explain: 'mcpb pack empaqueta tu MCP server en .mcpb (MCP Bundle). Listo para distribuir en Smithery, mpak, MCPFinder.'
                },
                {
                    q: '¿Qué comando lanzas subagentes en paralelo?',
                    options: [
                        '/thread',
                        '/parallel',
                        '/fork',
                        '/spawn'
                    ],
                    correct: 2,
                    explain: '/fork lanza un subagente independiente. Hereda contexto cacheado del padre → 10× reducción de costo de tokens.'
                },
                {
                    q: '¿Cuál es la ventaja clave de /fork vs. una sesión Claude independiente?',
                    options: [
                        'Fork es más rápido en el servidor.',
                        'Fork hereda contexto cacheado — tokens cacheados cuestan ~10% del precio normal.',
                        'Fork usa menos memoria.',
                        'No hay ventaja real.'
                    ],
                    correct: 1,
                    explain: 'Contexto del padre ya está en caché. Subagente reutiliza = costo mínimo. Session nueva = pagar full por todo.'
                },
                {
                    q: '¿Qué es Prompt Caching y por qué importa a escala?',
                    options: [
                        'Un truco para acelerar respuestas.',
                        'cache_control: ephemeral en system prompt → primer request = full cost, siguientes = 10% del costo.',
                        'Solo para grandes modelos.',
                        'No es relevante para desarrollo diario.'
                    ],
                    correct: 1,
                    explain: 'Prompt caching: El system prompt (CLAUDE.md, instrucciones) se cachea 5 min. Llamadas posteriores pagan solo 10% de tokens → 40-60% ahorro.'
                },
                {
                    q: 'Necesitas revisar 3 PRs en paralelo (seguridad, performance, code-style). ¿Arquitectura con /fork?',
                    options: [
                        'Revisar secuencialmente, sin paralelo.',
                        '1 agente principal + 3 subagentes con /fork, cada uno especializado. Usan contexto cacheado del principal.',
                        '3 sesiones Claude independientes.',
                        'No es posible hacer en paralelo.'
                    ],
                    correct: 1,
                    explain: 'fork = subagentes paralelos reutilizando caché. 3 reviews en ~60s con 40% menos tokens que 3 sesiones independientes.'
                },
                {
                    q: 'Estás implementando prompt caching. ¿Dónde va cache_control: ephemeral?',
                    options: [
                        'En cada pregunta del usuario.',
                        'En el body de cada request API.',
                        'En el system prompt (CLAUDE.md o instrucción global).',
                        'En .claude/settings.json global.'
                    ],
                    correct: 2,
                    explain: 'cache_control: ephemeral en el system prompt. Es lo que casi nunca cambia (instrucciones base). Cambios en user prompts no invalidean caché.'
                },
                {
                    q: 'Tu MCP server va a producción. ¿Configuración \'permission-mode\' correcta en settings.json?',
                    options: [
                        'bypassPermissions — salta todo.',
                        'default — pide confirmación manual.',
                        'auto — clasificador IA evalúa riesgo de cada acción antes de ejecutar.',
                        'Depende del caso.'
                    ],
                    correct: 2,
                    explain: 'auto mode (v2.1.85+): IA decide si una acción es segura. Más seguro que bypass, más fluido que default. Ideal para CI/CD y automatización.'
                },
                {
                    q: 'Comparación: ¿Cuándo caching > /fork?',
                    options: [
                        'Caching siempre gana.',
                        'Depende: Si mismo contexto = caching. Si contextos DIFERENTES = fork (hereda lo necesario, descarta lo demás).',
                        'Fork siempre es mejor.',
                        'Son incompatibles.'
                    ],
                    correct: 1,
                    explain: 'Caching: Contexto IGUAL, llamadas repetidas. Fork: Contextos parcialmente DIFERENTES, paralelismo. Usar ambos = óptimo.'
                },
                {
                    q: 'Tu MCP server .mcpb no aparece en Smithery. Diagnóstico de manifest.json?',
                    options: [
                        'manifest.json no importa.',
                        'Falta: name, version, serverType, entrypoint. Todos OBLIGATORIOS para validación e indexing.',
                        'Solo \'name\' es necesario.',
                        'Smithery no valida manifests.'
                    ],
                    correct: 1,
                    explain: 'manifest.json YAML/JSON: name (único), version (SemVer), serverType (stdio|sse), entrypoint (comando ejecutable). mcpb validate te muestra errores.'
                },
                {
                    q: 'Analizando costos: Session sin caching vs. con caching. 100 requests, system prompt = 5000 tokens. ¿Ahorro?',
                    options: [
                        'Sin caching: 100 × 5000 = 500k tokens.',
                        'Con caching: 1 × 5000 + 99 × (5000 × 0.1) = 54.5k tokens ≈ 89% ahorro.',
                        'No hay diferencia.',
                        'Caching empeora.'
                    ],
                    correct: 1,
                    explain: 'Primer request = pago full. Llamadas 2-100 = 10% cost. Total = 1 full + 99 × 10% ≈ 10.9× menos. ROI explosivo.'
                },
                {
                    q: 'Problemas en settings.json: permission-mode = auto pero algunas acciones siguen pidiendo confirmación. ¿Por qué?',
                    options: [
                        'Bug de auto mode.',
                        'Acciones de alto riesgo (delete-all, payment) requieren confirmación INCLUSO en auto mode por política de seguridad.',
                        'Necesitas versión más nueva.',
                        'Auto mode nunca pide confirmación.'
                    ],
                    correct: 1,
                    explain: 'auto mode = IA decide la mayoría. Pero acciones de máximo riesgo (irreversibles, financieras) siempre requieren humano. Diseño por seguridad.'
                },
                {
                    q: 'Evalúa esta arquitectura: MCP server monolítico (100 herramientas en 1 solo proceso) vs. 5 servidores especializados. ¿Mejor?',
                    options: [
                        'Monolítico es más simple, gana.',
                        'Especializados ganan: escalabilidad independiente, debugging claro, deploying seguro. Monolítico = un fallo = todo cae.',
                        'Son equivalentes.',
                        'Depende solo del tamaño del equipo.'
                    ],
                    correct: 1,
                    explain: 'Monolítico < 20 tools: ok. > 20: refactor en servicios. Resiliencia, escalabilidad, y claridad > simplicidad inicial.'
                },
                {
                    q: 'Evalúa: ¿Qué MCP server config es \'production-ready\'?',
                    options: [
                        'Defaults, todo funciona.',
                        'Rate-limiting + circuit-breaker + logging + retry logic + error boundaries + monitoring.',
                        'Solo autenticación.',
                        'Es overkill para MVP.'
                    ],
                    correct: 1,
                    explain: 'Production ≠ \'funciona\'. Requiere: rate-limits (protege de abuse), circuit-breaker (falla gracefully), logging (debug), retry (tolerancia), monitoring (alertas).'
                },
                {
                    q: 'Diseña un sistema MCP de 3 agentes especializados para auditar código. ¿Arquitectura?',
                    options: [
                        '1 agente que hace todo (seguridad + performance + style).',
                        'Agente 1 (seguridad: SQL injection, auth). Agente 2 (performance: algorithms, memory). Agente 3 (style: consistency, linting). Cada uno /fork en paralelo, comparten contexto cacheado.',
                        'No es posible con 3 agentes.',
                        'Un agente es mejor que 3.'
                    ],
                    correct: 1,
                    explain: 'Especialización: cada agente = expertise claro. /fork paralelo = 10× faster. Contexto cacheado = bajo costo. Integración = mejor coverage que monolítico.'
                }
            ],
            mission: {
                title: '🎯 Misión final del Nivel 4',
                goal: 'Construir un sistema integrado: MCP Server + Skill paralela + Hooks + Prompt Caching.',
                steps: [
                    'Día 1: `mcpb init` → crea un MCP server con al menos 1 tool real. Empaquétalo con `mcpb pack`.',
                    'Día 2: Crea una Skill que use tu MCP y lance 2 subagentes en paralelo con /fork.',
                    'Día 3: Configura prompt caching y rate limiting en settings.json. Mide baseline con `/usage`.',
                    'Día 4: Testea con `claude --from-pr <numero> --permission-mode auto`. Compara tokens antes/después.',
                ],
                success: 'Sistema funcionando en <60s por operación, costos reducidos >30% respecto a llamadas sin cachear.',
                troubleshooting: [
                    '**mcpb pack falla** → verifica manifest.json: name, version, serverType y entrypoint son obligatorios. Valida con `mcpb validate`.',
                    '**Fork no hereda contexto** → necesitas CLAUDE_CODE_FORK_SUBAGENT=1 en variables de entorno.',
                    '**Prompt cache miss siempre** → TTL del cache es 5 minutos. El system prompt debe ser idéntico entre llamadas.',
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
            modules: [
                { id: 'adopcion-equipos', title: 'Adopción en Equipos', description: 'Estrategia de rollout de Claude Code en organizaciones.' },
                { id: 'seguridad-compliance', title: 'Seguridad y Compliance', description: 'Implementación de guardrails y políticas de seguridad.' },
                { id: 'etica', title: 'Ética en IA', description: 'Uso responsable y consideraciones éticas de Claude Code.' },
                { id: 'observabilidad', title: 'Observabilidad', description: 'Logging, trazas distribuidas y monitoreo de sistemas.' },
                { id: 'patrones-arquitectonicos', title: 'Patrones Arquitectónicos', description: 'Diseños probados para sistemas escalables con Claude.' },
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
                    q: '¿En qué directorio exacto debe vivir un Skill llamado \'code-review\'?',
                    options: [
                        '.claude/skills/code-review/SKILL.md',
                        '.skills/code-review.md',
                        '~/.claude/code-review',
                        '/usr/local/skills/code-review'
                    ],
                    correct: 0,
                    explain: '.claude/skills/{name}/SKILL.md es el estándar. Versionable en git, compartible con equipo.'
                },
                {
                    q: '¿Cuál es el propósito del frontmatter en un SKILL.md?',
                    options: [
                        'Decoración visual.',
                        'Define metadatos: nombre, descripción (disparo automático), herramientas permitidas.',
                        'Comentarios para desarrolladores.',
                        'Nada importante.'
                    ],
                    correct: 1,
                    explain: 'Frontmatter YAML = identidad del Skill. name, description (auto-trigger), allowed-tools (seguridad). Sin él, Claude no reconoce el Skill.'
                },
                {
                    q: '¿Cómo se inyectan argumentos en un Skill?',
                    options: [
                        '{{$1}}, {{$2}}',
                        '$1, $2, $ARGUMENTS (sintaxis estilo shell)',
                        '%ARG1%, %ARG2%',
                        'Parámetros no son posibles.'
                    ],
                    correct: 1,
                    explain: '$1 = primer argumento, $2 = segundo, $ARGUMENTS = todos juntos. Ej: /my-skill arg1 arg2 → $1=\'arg1\', $2=\'arg2\'.'
                },
                {
                    q: '¿Qué hace la restricción \'allowed-tools\' en frontmatter?',
                    options: [
                        'Decide qué modelo usar.',
                        'Limita qué herramientas puede ejecutar el Skill (principio de mínimo privilegio).',
                        'Determina archivos que puede leer.',
                        'Es solo documentación.'
                    ],
                    correct: 1,
                    explain: 'allowed-tools: [Bash(git:*), Read] = solo lee y git. Un Skill de lectura nunca puede sobrescribir por accidente.'
                },
                {
                    q: 'Crea mentalmente un Skill /test-unit que ejecute `npm test` y reporte resultados. ¿Frontmatter mínimo correcto?',
                    options: [
                        'name: test-unit\ndescription: Ejecuta tests',
                        'name: test-unit\ndescription: Ejecuta tests\nallowed-tools: [Bash(npm test:*)]',
                        'name: test-unit\ndescription: Ejecuta tests\nallowed-tools: *',
                        'Sin frontmatter, solo el comando.'
                    ],
                    correct: 1,
                    explain: 'Correcto: metadatos + herramienta restringida a npm test. Evita que el Skill ejecute comandos peligrosos por accidente.'
                },
                {
                    q: 'Quieres un Skill /commit-with-prefix que agregue \'feat: \' a commits. ¿Cómo inyectarías el mensaje?',
                    options: [
                        '/commit-with-prefix feat \'nueva feature\' → usa $1 y $2 en el Skill',
                        'Editar el Skill cada vez.',
                        'Es imposible con argumentos.',
                        'No hay forma segura de hacerlo.'
                    ],
                    correct: 0,
                    explain: '/commit-with-prefix feat \'nueva feature\' → SKILL.md usa $1=\'feat\', $2=\'nueva feature\', luego `git commit -m "$1: $2"`.'
                },
                {
                    q: 'Necesitas que /code-review se dispare automáticamente cuando alguien dice \'revisa mi código\'. ¿Dónde está la magia?',
                    options: [
                        'En el cuerpo del Skill (las instrucciones).',
                        'En el campo \'description\' del frontmatter — Claude la usa para auto-disparar.',
                        'Necesitas un webhook externo.',
                        'No es posible.'
                    ],
                    correct: 1,
                    explain: 'description: \'Revisa código en busca de bugs\' → Claude reconoce \'revisa mi código\' y dispara /code-review automáticamente.'
                },
                {
                    q: 'Comparación: ¿Cuándo usarías un Skill vs. simplemente pedir ayuda sin /nombre?',
                    options: [
                        'Siempre Skill.',
                        'Skill: tarea repetitiva + checklist fijo. Sin /: exploración, preguntas ad-hoc.',
                        'Sin diferencia.',
                        'Skills son obsoletos.'
                    ],
                    correct: 1,
                    explain: 'Skill /code-review: checklist consistente, reutilizable, versionable. Pregunta ad-hoc: uno-off, sin estructura.'
                },
                {
                    q: 'Analiza este Skill: allowed-tools: * (todas las herramientas). ¿Problema de seguridad?',
                    options: [
                        'No, es flexible.',
                        'Sí — el Skill podría ejecutar rm -rf /, cambiar credenciales, etc. Viola mínimo privilegio.',
                        'Solo en producción.',
                        'Es necesario para funcionalidad.'
                    ],
                    correct: 1,
                    explain: 'allowed-tools: * = Skill puede hacer CUALQUIER COSA. Riesgo extremo. Restricción mínima: [Bash(git:*), Read], solo lo necesario.'
                },
                {
                    q: 'Tu Skill /lint usa !`npm run lint`. El equipo reporta \'Permission denied\' aunque tienen Node. Diagnóstico?',
                    options: [
                        'npm no está en PATH.',
                        'El Skill no incluye Bash(npm:*) en allowed-tools, así Claude bloquea la ejecución por seguridad.',
                        'Error de instalación de Node.',
                        'El Skill está buggeado.'
                    ],
                    correct: 1,
                    explain: '!`comando` requiere permisos. Sin Bash(npm:*) en allowed-tools, claudeAPI rechaza. Solución: añadir allowed-tools: [Bash(npm run lint:*)].'
                },
                {
                    q: 'Evalúa esta estrategia: Un Skill /everything que hace 15 tareas diferentes (lint, test, build, deploy). ¿Buena idea?',
                    options: [
                        'Excelente, todo en uno.',
                        'Mala — viola Single Responsibility. 15 Skills independientes es mejor: /lint, /test, /build, /deploy. Compone con otros.',
                        'Neutral.',
                        'Depende del equipo.'
                    ],
                    correct: 1,
                    explain: 'Un Skill = una responsabilidad. /everything es imposible de debuggear, hard de mantener, confunde a nuevos usuarios. Refactor en /lint, /test, etc.'
                }
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

        5: {
            title: 'Nivel 5: Líder Técnico',
            objectives: [
                'Diseñar estrategias de adopción de Claude Code en equipos de 10+ developers.',
                'Configurar entornos enterprise: OIDC, SSO, audit logs, sandbox policies.',
                'Crear programas de onboarding para desarrolladores en diferentes roles.',
                'Implementar guardrails de seguridad y compliance (HIPAA, SOC2, GDPR).',
                'Medir ROI: tiempo ahorrado, bugs prevenidos, velocidad de shipping.',
            ],
            tools: ['Settings Enterprise', 'OIDC', 'Audit Logs', 'Managed Settings', 'Usage Analytics'],
            subtopics: [
                { name: 'Estrategia de adopción', desc: 'Fases: Piloto → Rollout → Scaling. Resistencia y cambio organizacional.' },
                { name: 'Configuración enterprise', desc: 'OIDC, SSO, managed settings, rate limiting, workspace rules.' },
                { name: 'Onboarding para equipos', desc: 'Módulos por rol: frontend, backend, DevOps, QA. Certificaciones internas.' },
                { name: 'Seguridad y compliance', desc: 'Audit logs, data residency, API key rotation, breach response.' },
                { name: 'Métricas y ROI', desc: 'Baseline: código entregado/mes. Medir mejora, costos evitados.' },
            ],
            caseStudy: {
                title: '🛠️ Caso práctico: rolling out Claude Code en un equipo de 20 devs',
                context: 'Tu empresa quiere adoptarlo. No todos están convencidos. Necesitas un plan que minimice fricción.',
                steps: [
                    { cmd: 'Semana 1: Piloto con 3 "early adopters" de distintos roles.', what: 'Aprenden rápido y devuelven feedback.' },
                    { cmd: 'Semana 2-3: Crear currículum en video (5 min cada lección) — accesible para no-técnicos.', what: 'Reduce barrera de entrada.' },
                    { cmd: 'Semana 4: Rollout gradual (5-10 devs/semana) + horario de "office hours" para Q&A.', what: 'Support strukturado evita frustración.' },
                    { cmd: 'Mes 2: Metrics: commits/dev, review time, bugs caught. Comparar pre vs. post.', what: 'Data que convence a la C-suite.' },
                ],
                expected: 'Adopción >80% en 6 semanas. ROI positivo medible (30%+ mejora en velocity).',
            },
            quiz: [
                {
                    q: '¿Por qué es crítico el \'piloto\' antes del rollout empresa-wide de Claude Code?',
                    options: [
                        'No tiene importancia real.',
                        'Genera momentum + feedback valioso de early adopters + identifica blockers antes de inversión grande.',
                        'Solo es tradición.',
                        'Es un lujo para equipos grandes.'
                    ],
                    correct: 1,
                    explain: 'Piloto (3-5 devs distintos roles) = fast feedback, momentum interno, casos de éxito reales. Sin piloto = rollout fallido.'
                },
                {
                    q: 'Planificas rollout a equipo de 20 devs en 6 semanas. ¿Fases?',
                    options: [
                        'Semana 1: todos. Listo.',
                        'S1: 3 early adopters. S2-3: video curriculum (5 min c/u). S4-6: rollout gradual 5-10/semana + office hours.',
                        'S1-6: solo lectura, sin uso real.',
                        'Es imposible en 6 semanas.'
                    ],
                    correct: 1,
                    explain: 'Piloto → learning → gradual rollout = Change Management 101. Velocidad = riesgo. Gradualidad = adopción >80%.'
                },
                {
                    q: '¿Qué métrica comunicas a ejecutivos para justificar inversión en Claude Code?',
                    options: [
                        'Tokens consumidos por semana.',
                        'Mejora en velocity (PRs merged/dev/mes) + bugs prevenidos + time-to-market. Comparar pre vs. post.',
                        'Número de usuarios activos.',
                        'Cualquier métrica técnica.'
                    ],
                    correct: 1,
                    explain: 'Ejecutivos entienden negocio: velocidad, calidad, tiempo. No tokens. Data = (PRs/dev/mes before 8 → after 12) = 50% mejora → ROI justificado.'
                },
                {
                    q: 'Analizando adopción lenta: Equipo grande pero solo 3 devs usan Claude. ¿Diagnóstico probable?',
                    options: [
                        'Claude Code no es bueno.',
                        'Falta onboarding estructurado por rol. Algunos roles (QA, frontend) no ven valor sin programa específico.',
                        'El equipo es resistente al cambio.',
                        'Necesita más marketing.'
                    ],
                    correct: 1,
                    explain: 'SRE ≠ Frontend. Frontend curriculum diferente que Backend. Sin programas por rol = confusión. Con curricula específicas = 60%+ adopción.'
                },
                {
                    q: 'Comparación: Onboarding self-service (docs) vs. structured (facilitador + sesiones en vivo). ¿Impacto en adopción?',
                    options: [
                        'Self-service es suficiente.',
                        'Self-service = 20-30% adopción. Structured = 70-80%. Facilitador responde Q&A, unblocks frustración temprana.',
                        'No hay diferencia.',
                        'Structured es más caro, no vale.'
                    ],
                    correct: 1,
                    explain: 'Humano > documentos. Sesiones en vivo = confianza, connections, momentum. ROI de 1 facilitador es +50% adopción = worth it.'
                },
                {
                    q: 'Midiendo ROI: Baseline = 8 PRs/dev/mes. Post-Claude = 12 PRs/dev/mes. 20 devs. Costo Claude = $10k/mes. Beneficio?',
                    options: [
                        'Neutro, no hay ROI.',
                        'Positivo: 80 PRs/mes extra = velocidad 50% mayor. Salarios = ~$30k/dev/mes. Valor generado ≈ $40k/mes > costo $10k. ROI = 4:1.',
                        'Negativo, muy caro.',
                        'No se puede medir.'
                    ],
                    correct: 1,
                    explain: 'Simple math: dev costs >> Claude costs. Cualquier mejora en velocity (20%+) es instant ROI positivo. Esto es executive language.'
                },
                {
                    q: 'Evalúa: ¿Cuál es el error más común en adopción enterprise?',
                    options: [
                        'Usar Claude Code sin herramientas.',
                        'Ignorar change management. Implementación sin piloto + feedback = rechazo del equipo. Luego dicen \'no funciona\'.',
                        'Elegir el modelo incorrecto.',
                        'Usando demasiada automatización.'
                    ],
                    correct: 1,
                    explain: 'Adopción falla si ignoras PERSONAS. Tecnología es fácil. Cambio humano = hard. Piloto, feedback, gradualidad = éxito.'
                },
                {
                    q: 'Evalúa este plan de onboarding: 1 video de 2 horas + todos practican solos. ¿Suficiente?',
                    options: [
                        'Sí, es completo.',
                        'No — 2 horas es demasiado denso. Mejor: 5-10 min videos (micro-learning) + live Q&A + hands-on labs. Retención 3× mejor.',
                        'Necesita más videos.',
                        'Los videos no importan.'
                    ],
                    correct: 1,
                    explain: 'Attention span = 10 min MAX. Después se pierde. 2h video = abandono. 5 × 10min videos + Q&A + labs = 70% completion vs 20% con megavideo.'
                },
                {
                    q: 'Ante resistencia (\'no tengo tiempo para Claude\'). Mejor argumento?',
                    options: [
                        '\'Es muy fácil, prueba\'.',
                        '\'Esto no es más trabajo, es menos. Boilerplate, tests, docs — Claude lo hace automáticamente. Ganamos 5h/semana/dev.\'',
                        '\'Todos deben usarlo.\'',
                        '\'Mira este demo\'.'
                    ],
                    correct: 1,
                    explain: 'Resistencia = miedo de sobrecarga. Reframing: \'menos trabajo\' > \'más herramientas\'. Data = 5h/semana ahorradas = 2 devs extra. Sin duda.'
                },
                {
                    q: 'Diseña un programa de certificación interna para Claude Code (4 niveles). ¿Estructura?',
                    options: [
                        'Un único examen final.',
                        'L1: Fundamentos (test small). L2: Avanzado (quiz 12q). L3: Experto (caso práctico vivo). L4: Líder (diseña proyecto). Badges + carrera clara.',
                        'Solo documentación.',
                        'No es necesario.'
                    ],
                    correct: 1,
                    explain: 'Certificación = incentivo + estatus + carrera clara. L1→L4 progression = devs motivados a profundizar. Excelente para retención y culture.'
                },
                {
                    q: 'Diseña métricas de adopción de Claude Code para reportar a C-level. ¿Cuáles incluir?',
                    options: [
                        'Cantidad de tokens consumidos.',
                        'Velocity (PRs/dev/mes before/after). Bugs caught (reducción %). Review time (mejora %). Adoption rate (% activos). Satisfaction (NPS).',
                        'Solo número de usuarios.',
                        'No se puede medir adopción.'
                    ],
                    correct: 1,
                    explain: 'C-level entiende: Velocity ↑ = business value. Bugs ↓ = quality. Time ↓ = efficiency. NPS = satisfaction. 4 metrics = full story.'
                }
            ],
            mission: {
                title: '🎯 Misión final del Nivel 5',
                goal: 'Diseñar un plan de adopción de 4 semanas para tu equipo con métricas.',
                steps: [
                    'Identifica 3 early adopters en roles clave (frontend/backend/devops).',
                    'Crea un deck de 1 página: antes/después de Claude Code con métricas claras.',
                    'Define rollout phases y recursos de onboarding por rol.',
                    'Configura baseline: commits/dev, review time, bugs por sprint (mes anterior).',
                    'Mide al final: comparar y documentar ROI.',
                ],
                success: 'Plan en document compartible, métricas basales establecidas, early adopters lanzados.',
                troubleshooting: [
                    '**Resistencia a cambio** → enfócate en "menos trabajo tedioso", no en "nueva herramienta".',
                    '**Métricas confusas** → usa solo 3: velocity (commits/dev/mes), review time, bugs encontrados.',
                ],
            },
        },

        6: {
            title: 'Nivel 6: Arquitecto',
            objectives: [
                'Diseñar sistemas tolerantes a fallos usando Claude Code como generador de código.',
                'Construir MCP servers complejos: multi-tenant, escalables, con observabilidad.',
                'Optimizar para 50k req/min: caché distribuido, horizontal scaling, circuit breakers.',
                'Implementar observabilidad end-to-end: OpenTelemetry, distributes traces, custom metrics.',
                'Estudiar casos reales de Fortune 500 y arquitecturas ganadores.',
                'Documentar decisiones arquitectónicas con ADRs (Architecture Decision Records).',
                'Preparación para certificación de Anthropic (si aplica).',
            ],
            tools: ['System Design', 'ADR', 'OpenTelemetry', 'Distributed Tracing', 'MCP Multi-Tenant', 'Load Testing'],
            subtopics: [
                { name: 'Patrones arquitectónicos', desc: 'Monolítico vs. multi-agente. Async/await patterns. Event sourcing.' },
                { name: 'MCP servers complejos', desc: 'Multi-tenant, rate limiting, circuit breakers, cache strategies.' },
                { name: 'Performance a escala', desc: '50k req/min: caching, horizontal scaling, database optimization.' },
                { name: 'Observabilidad', desc: 'OpenTelemetry, traces distribuidos, custom metrics, alerting.' },
                { name: 'Casos Fortune 500', desc: 'Cómo Databricks, Stripe, Notion usan Claude Code en producción.' },
                { name: 'ADRs', desc: 'Documentar por qué, qué trade-offs, quién tomó la decisión.' },
                { name: 'Certificación', desc: 'Preparación: temas, labs prácticos, assessment final.' },
            ],
            caseStudy: {
                title: '🛠️ Caso práctico: diseñar un sistema para 50k req/min',
                context: 'Necesitas migrar de monolítico a multi-agente. Debe soportar 50k req/min con <100ms p99 latencia.',
                steps: [
                    { cmd: 'Día 1: ADR — monolítico vs. multi-agente vs. event-sourcing. Justificar elegida.', what: 'Decisión documentada, trazable.' },
                    { cmd: 'Día 2: Diseñar MCP servers: 3 agentes especializados, caches Redis, circuit breaker.', what: 'Arquitectura defensiva.' },
                    { cmd: 'Día 3: Implementar OpenTelemetry + logs distribuidos. Medir baseline.', what: 'Observabilidad real.' },
                    { cmd: 'Día 4: Load testing con k6/locust a 50k req/min. Sintonizar caches y rate limits.', what: 'Validación práctica.' },
                    { cmd: 'Día 5: Documentar en ADR: trade-offs, costos, plan de rollout.', what: 'Legado arquitectónico.' },
                ],
                expected: 'Sistema soportando 50k req/min en <100ms p99. ADR documentado. Observabilidad completa.',
            },
            quiz: [
                {
                    q: '¿Cuál es la pregunta fundamental que debe responder un ADR (Architecture Decision Record)?',
                    options: [
                        '¿Cómo lo implemento?',
                        '¿POR QUÉ elegimos esta arquitectura? ¿Qué alternativas consideramos? ¿Qué trade-offs aceptamos?',
                        '¿Qué tecnología es más moderna?',
                        '¿Cuál es la forma de hacer esto?'
                    ],
                    correct: 1,
                    explain: 'ADR captura la HISTORIA: decisión, opciones consideradas, trade-offs aceptados, rationale. Crucial para onboarding y evitar re-debatir.'
                },
                {
                    q: 'Necesitas elegir entre monolítico (simple, <1k req/min) vs. multi-agente (escalable, complejo). Qué preguntas formularias primero?',
                    options: [
                        '\'¿Cuál es más moderno?\'',
                        '\'¿Cuánto tráfico esperamos?\' \'¿Cuáles son nuestros SLOs (latencia p99, uptime)?\' \'¿Tamaño del equipo y expertise?\'',
                        '\'¿Cuál es más rápido para MVP?\'',
                        'Usar monolítico siempre.'
                    ],
                    correct: 1,
                    explain: 'Decisión arquitectónica = contexto. Tráfico bajo (<1k) → monolítico gana. Alto (50k+) → multi-agente gana. SLOs dictan la decisión.'
                },
                {
                    q: 'Diseñando para 50k req/min con <100ms p99 latencia. ¿Capas defensivas?',
                    options: [
                        'Solo código rápido.',
                        'L1: Load balancer + rate limiting. L2: Cache en capas (Redis, local). L3: Circuit breaker. L4: Async/queue para tareas lentas.',
                        'Un servidor potente.',
                        'No son necesarias si el código es rápido.'
                    ],
                    correct: 1,
                    explain: 'A 50k req/min, arquitectura defensiva > código rápido. Rate limiting previene cascada. Caching evita 99% de requests. Circuit breaker = resilience.'
                },
                {
                    q: 'Análisis: Monolítico vs. multi-agente para 50k req/min. Ventajas y trade-offs.',
                    options: [
                        'Monolítico es siempre mejor.',
                        'Monolítico: simple, debugging fácil, PERO escala vertical (límite), un fallo = crash. Multi-agente: escalable horizontal, resiliente, PERO operación distribuida compleja.',
                        'Multi-agente siempre gana.',
                        'Son exactamente lo mismo.'
                    ],
                    correct: 1,
                    explain: 'No hay ganador. Elegir basado en requisitos: Tráfico bajo/prototipo = monolítico. Alto/producción = multi-agente. Documentar en ADR.'
                },
                {
                    q: 'Comparativa: MCP server monolítico (100 tools en 1) vs. 5 especializados. Análisis para 50k req/min.',
                    options: [
                        'Monolítico es más fácil.',
                        'Monolítico: un fallo = todo cae, scaling global. Especializados: fallos aislados, escalado independiente por tool. A 50k, especializados ganan.',
                        'No hay diferencia.',
                        'Especializados son overkill.'
                    ],
                    correct: 1,
                    explain: 'Load: algunos tools (auth) = alta. Otros (logging) = baja. Monolítico = escala TODO. Especializados = escala cada uno por separado. Eficiencia.'
                },
                {
                    q: 'Diagnóstico: Sistema en producción a 50k req/min, p99 latencia = 200ms (SLO = 100ms). ¿Primer paso?',
                    options: [
                        'Cambiar a un modelo más potente.',
                        'Medir traces distribuidas para identificar dónde se pierde tiempo. Probablemente: database, externa API, o falta de caching.',
                        'Aumentar recursos (CPU/RAM).',
                        'Refactorizar todo el código.'
                    ],
                    correct: 1,
                    explain: 'Observabilidad primero. Traces distribuidas → bottleneck claro. 80/20: probablemente 1-2 spots consumen 80% del tiempo. Fix esos primero.'
                },
                {
                    q: 'Análisis: OpenTelemetry vs. Datadog-specific SDK. ¿Cuál para enterprise?',
                    options: [
                        'Datadog SDK — más features.',
                        'OpenTelemetry — vendor-agnostic. Escribes una vez, envías a Datadog/Jaeger/CloudWatch/etc. No lock-in.',
                        'Son lo mismo.',
                        'Datadog es obligatorio.'
                    ],
                    correct: 1,
                    explain: 'OTel = freedom. Switch providers sin reescribir. Enterprise ama opciones. Datadog SDK = lock-in. OTel = portabilidad.'
                },
                {
                    q: 'Caso: Migración monolítico → multi-agente. ¿Riesgo de rollout?',
                    options: [
                        'Bajo, es fácil.',
                        'Alto — sistema distribuido es operacionalmente más complejo. Solución: canary rollout (5%→25%→50%→100%) + observabilidad fuerte + runbooks.',
                        'No hay riesgo.',
                        'Es imposible migrar.'
                    ],
                    correct: 1,
                    explain: 'Distributed ≠ simple. Canary rollout = riesgo bajo. 5% tráfico a multi-agente, monitorear, luego expand. Rollback es fácil si falla.'
                },
                {
                    q: 'Problema: MCP server A depende de B. B falla → cascade. ¿Solución arquitectónica?',
                    options: [
                        'Esperar a que B se repare.',
                        'Circuit breaker en A: detecta B caído, devuelve error rápido o fallback. Evita timeout cascada.',
                        'Aumentar timeouts.',
                        'Hacer ambos monolíticos.'
                    ],
                    correct: 1,
                    explain: 'Circuit breaker = falla rápido. Sin él: timeout espera (30s) × 50k req/min = desastre. Con breaker: fail immediate → retries → recover fast.'
                },
                {
                    q: 'Evaluación: ¿Cuál es el mayor riesgo de arquitectura monolítica en producción a 50k req/min?',
                    options: [
                        'Lentitud.',
                        'Un bug pequeño causa crash global. Sin aislamiento, fallo = downtime. Multi-agente = fallo acotado.',
                        'Falta de features.',
                        'Difícil de entender.'
                    ],
                    correct: 1,
                    explain: 'Monolítico = caja única. Crack en una sección = colapso total. A 50k req/min, downtime = $10k/min en revenue lost. Riesgo inaceptable.'
                },
                {
                    q: 'Evaluación: ¿Qué aspecto de observabilidad es crítico para multi-agente?',
                    options: [
                        'Logs centralizados solamente.',
                        'Trazas distribuidas (request flows) + métricas SLO (latencia p99, error rate) + alerting reactivo. Sin trazas, imposible debuggear.',
                        'Dashboard bonito.',
                        'Logs básicos son suficientes.'
                    ],
                    correct: 1,
                    explain: 'Trazas distribuidas = visibilidad del flujo. Sin ellas: request lento, ¿dónde? Imposible saber. Con trazas: \'Auth 50ms, DB 100ms, Cache miss aquí\'.'
                },
                {
                    q: 'Evaluación de trade-off: Caching agresivo vs. Consistencia de datos. ¿Estrategia?',
                    options: [
                        'Máximo caching, aceptar inconsistencia.',
                        'Depends on use case: datos críticos (payments) = consistencia > velocidad. Analytics = velocidad > consistencia. Documentar en ADR.',
                        'Nunca cachear datos dinámicos.',
                        'La inconsistencia es un bug.'
                    ],
                    correct: 1,
                    explain: 'Cada sistema tiene tolerance de staleness. Carrito de compras = baja (minutos). Analytics = alta (horas). Estrategia debe ser explícita.'
                },
                {
                    q: 'Evaluación: ¿Cuál es el \'verdadero\' costo de un multi-agente system?',
                    options: [
                        'Hardware más caro.',
                        'Operacional: debugging más complejo, observabilidad necesaria, runbooks para 10+ failure modes. Si no tienes ops maduros, monolítico es más barato.',
                        'Siempre más caro.',
                        'Sin costo diferencial.'
                    ],
                    correct: 1,
                    explain: 'Multi-agente requiere ops maduros (observabilidad, runbooks, oncall). Sin eso, es un dolor. Con eso, es estándar. Evalúa tu madurez.'
                },
                {
                    q: 'Evaluación: ¿Cuándo una arquitectura es \'buena\'?',
                    options: [
                        'Cuando usa la tecnología más moderna.',
                        'Cuando cumple SLOs, es maintainable por tu equipo, y puede escalar sin rediseño por 3-5 años.',
                        'Cuando es la más simple.',
                        'Cuando es la más rápida.'
                    ],
                    correct: 1,
                    explain: 'Buena arquitectura = requisitos → trade-offs explícitos → documentados → implementados → escalables. No es sobre elegancia, es sobre fit.'
                },
                {
                    q: 'Diseña un ADR completo para elegir monolítico vs. multi-agente. ¿Secciones?',
                    options: [
                        'Solo la decisión final.',
                        '1. Contexto (requisitos, restricciones). 2. Opciones (monolítico, multi-agente, event-sourcing). 3. Análisis de cada opción. 4. Decisión + Rationale. 5. Consecuencias (positivas y negativas).',
                        'Links a documentación.',
                        'No se puede documentar decisión.'
                    ],
                    correct: 1,
                    explain: 'ADR fuerte: contexto + opciones + análisis + rationale + consecuencias. Permite futuros devs entender POR QUÉ se eligió. No es capricho.'
                },
                {
                    q: 'Diseña una estrategia de caching en capas para 50k req/min. ¿Arquitectura?',
                    options: [
                        'Una cache global.',
                        'L1: Local (in-process, 100ms TTL, no network). L2: Redis (10s TTL, shared). L3: Database (source of truth). Evita cache stampedes con locks.',
                        'Solo cache remoto.',
                        'No es necesario cachear.'
                    ],
                    correct: 1,
                    explain: 'Capas = eficiencia: L1 evita 80% de requests. L2 sirve lo que L1 perdió. L3 es último recurso. A 50k, esto es diferencia entre 100ms y 1s latencia.'
                },
                {
                    q: 'Diseña un sistema de observabilidad completo. Componentes?',
                    options: [
                        'Logs solamente.',
                        'Trazas distribuidas (Jaeger) + Métricas (Prometheus) + Logs (ELK). Alert manager. Dashboard Grafana. Runbooks en repo.',
                        'Un monitoring tool general.',
                        'Observabilidad es overkill.'
                    ],
                    correct: 1,
                    explain: 'Las tres pilares: trazas (flujo), métricas (salud), logs (detalle). Sin una = ciego. Con tres = visibilidad total para debug y optimization.'
                },
                {
                    q: 'Diseña un circuit breaker pattern para evitar cascadas. ¿Lógica?',
                    options: [
                        'Esperar siempre.',
                        'Estados: CLOSED (normal) → OPEN (service down, fail fast) → HALF_OPEN (probar recovery). Threshold (5 fallos = OPEN). Timeout reset (60s).',
                        'No es necesario.',
                        'Retry siempre.'
                    ],
                    correct: 1,
                    explain: 'Circuit breaker = automático + resilente. 5 fallos → bloquea requests (no causa cascada). Después de timeout, intenta recovery (HALF_OPEN).'
                },
                {
                    q: 'Diseña un plan de disaster recovery para multi-agente system. ¿Pasos?',
                    options: [
                        'Sin plan.',
                        '1. RTO/RPO claros (ej: 15min recovery, 1h data loss). 2. Backups automatizados. 3. Failover automático. 4. Runbooks probados cada mes. 5. Alerts para degradación.',
                        'Esperar a que fallen.',
                        'No es posible disaster recovery.'
                    ],
                    correct: 1,
                    explain: 'DR = proactivo. Sin plan = surprise disaster. Con plan = controllable. RTO/RPO definen \'aceptable\'. Runbooks = crew sabe qué hacer.'
                },
                {
                    q: 'Diseña roles de ingeniería para team que gestiona sistema multi-agente a 50k req/min. ¿Especialidades?',
                    options: [
                        'Un role genérico.',
                        'Backend (agent development). DevOps (observability, deployment). SRE (incident response, scaling). Architect (ADRs, design reviews). On-call rotation.',
                        'Todos hacen todo.',
                        'Roles no importan.'
                    ],
                    correct: 1,
                    explain: 'Especialización en equipo = ownership claro. Backend = features. DevOps = infrastructure. SRE = reliability. Arquitecto = decisiones. On-call = support 24/7.'
                }
            ],
            mission: {
                title: '🎯 Capstone: Sistema Arquitectónico Completo',
                goal: 'Diseñar, implementar y documentar un sistema escalable con MCP, CI/CD y ADRs.',
                steps: [
                    'Semana 1: Define requisitos. Escribe 2-3 ADRs (arquitectura, db, deploy). Justifica cada decisión.',
                    'Semana 2: Implementa MCP server(s). Incluye caching, rate limiting, error handling.',
                    'Semana 3: Configura CI/CD (GitHub Actions, deployment stages). Load test a 10k+ req/min.',
                    'Semana 4: Observabilidad: OpenTelemetry + dashboards Grafana/Datadog. Definir SLOs.',
                    'Semana 5: Documentación. README de arquitectura, ADRs públicos, runbooks operacionales.',
                    'Final: Presenta a audiencia técnica (equipo/comunidad). Q&A sobre trade-offs y scaling.',
                ],
                success: 'Sistema funcionando, scalable, observable, documentado. ADRs que explican el "por qué".',
                troubleshooting: [
                    '**No sé por dónde empezar** → plantea 3 preguntas: (1) ¿Cuánto tráfico? (2) ¿Qué SLOs? (3) ¿Equipo de cuántos?',
                    '**El sistema es demasiado complejo** → simplifica. Monolítico con async beats multi-agente mal pensado.',
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
       1.8 DATOS — SECCIONES PRÁCTICAS COMPLEMENTARIAS
       Secciones que no son módulos de nivel sino complementarias:
       laboratorios prácticos, guías avanzadas, etc.

       MAPEO COMPLETO DE IDs (sin conflictos):
       ─────────────────────────────────────────────────────────
       NIVEL 1: instalacion, prompt-craft, decision-framework, cost-management
       NIVEL 2: testing-asistido, gobernanza, monitoreo-costos, incident-response
       NIVEL 3: adopcion-equipos, seguridad-compliance, etica, observabilidad, patrones-arquitectonicos
       PRÁCTICAS: laboratorios-practicos, guias-avanzadas, casos-estudio, recursos-comunidad
       ============================================================ */
    const PRACTICAL_SECTIONS = {
        'laboratorios-practicos': {
            title: 'Laboratorios Prácticos',
            subtitle: '4 labs progresivos: debugging, MCP, Skill+CI, GitHub Actions',
            icon: '🧪',
            level: 'all',
            description: 'Laboratorios progresivos para aprender haciendo con ejemplos reales.',
        },
        'guias-avanzadas': {
            title: 'Guías Avanzadas',
            subtitle: 'Profundiza en temas específicos: Performance, Security, Optimization',
            icon: '📚',
            level: 'advanced',
            description: 'Guías exhaustivas para dominar aspectos avanzados.',
        },
        'casos-estudio': {
            title: 'Casos de Estudio',
            subtitle: 'Análisis detallado de proyectos reales y decisiones de arquitectura',
            icon: '🔍',
            level: 'expert',
            description: 'Aprende de casos reales de implementación en producción.',
        },
        'recursos-comunidad': {
            title: 'Recursos Comunitarios',
            subtitle: 'Links a repos, ejemplos, herramientas creadas por la comunidad',
            icon: '🌐',
            level: 'all',
            description: 'Descubre recursos compartidos por otros desarrolladores.',
        },
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

        mcpBuild: [
            { type: 'comment', text: '# Nivel 4 — Crear y empaquetar un MCP Server' },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# 1) Inicializar manifest' },
            { type: 'prompt',  text: 'mcpb init', delay: 200 },
            { type: 'success', text: '✓ manifest.json creado', delay: 600 },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# 2) Editar manifest.json con datos del servidor' },
            { type: 'output',  text: '{ "name": "weather-mcp", "version": "1.0.0",' },
            { type: 'output',  text: '  "serverType": "stdio", "entrypoint": "dist/index.js" }' },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# 3) Validar antes de empaquetar' },
            { type: 'prompt',  text: 'mcpb validate', delay: 300 },
            { type: 'success', text: '✓ manifest válido — todos los campos requeridos presentes', delay: 800 },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# 4) Empaquetar' },
            { type: 'prompt',  text: 'mcpb pack', delay: 300 },
            { type: 'info',    text: '⏺ Bundling server + dependencies...', delay: 1200 },
            { type: 'success', text: '✓ weather-mcp-1.0.0.mcpb (2.4 MB)', delay: 1000 },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# 5) Instalar localmente para prueba' },
            { type: 'prompt',  text: 'claude mcp add weather ./weather-mcp-1.0.0.mcpb', delay: 300 },
            { type: 'success', text: '✓ MCP server "weather" registrado — reinicia Claude para activarlo', delay: 1000 },
        ],

        multiAgent: [
            { type: 'comment', text: '# Nivel 4 — Orquestación Multi-Agente (Split-and-Merge)' },
            { type: 'output',  text: '' },
            { type: 'user',    text: 'Revisa los 3 módulos del PR #42 en paralelo', delay: 500 },
            { type: 'info',    text: '⏺ Read(PR #42 diff)...', delay: 800 },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# Claude lanza 3 subagentes paralelos vía Task tool' },
            { type: 'info',    text: '⏺ Task("Revisar auth module") — iniciado', delay: 400 },
            { type: 'info',    text: '⏺ Task("Revisar API routes") — iniciado', delay: 200 },
            { type: 'info',    text: '⏺ Task("Revisar tests coverage") — iniciado', delay: 200 },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# Los 3 agentes trabajan concurrentemente...' },
            { type: 'info',    text: '✓ Agent 1: auth — 2 vulnerabilidades encontradas', delay: 2000 },
            { type: 'info',    text: '✓ Agent 2: routes — sin issues, LGTM', delay: 800 },
            { type: 'info',    text: '✓ Agent 3: tests — cobertura 67% (recomendado 80%)', delay: 600 },
            { type: 'output',  text: '' },
            { type: 'comment', text: '# Merge de resultados por el orquestador' },
            { type: 'success', text: '✓ Review consolidado en 18s (vs 54s secuencial)', delay: 1000 },
            { type: 'output',  text: '' },
            { type: 'output',  text: '📋 Resumen: 2 issues críticos en auth.ts líneas 47, 83' },
            { type: 'output',  text: '   Cobertura insuficiente en user.service.ts' },
            { type: 'output',  text: '   API routes: aprobadas ✓' },
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
    /* ============================================================
       3.5. MODO TÉCNICO vs ACCESIBLE — Toggle y manejo
       ============================================================ */
    function setupModeToggle() {
        const toggle = document.getElementById('mode-toggle');
        if (!toggle) return;

        // Cargar modo guardado o defaultear a 'technical'
        let currentMode = localStorage.getItem('docMode') || 'technical';
        applyMode(currentMode);

        // Listener en el toggle
        toggle.addEventListener('change', (e) => {
            const newMode = e.target.checked ? 'accessible' : 'technical';
            localStorage.setItem('docMode', newMode);
            applyMode(newMode);
        });
    }

    function applyMode(mode) {
        const toggle = document.getElementById('mode-toggle');
        if (toggle) toggle.checked = mode === 'accessible';

        // Mostrar/ocultar secciones según modo
        const sections = document.querySelectorAll('.content-section');
        sections.forEach((section) => {
            const sectionMode = section.dataset.mode || 'technical';
            if (sectionMode === mode || sectionMode === 'both') {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });

        // Actualizar sidebar según modo
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link) => {
            const linkMode = link.dataset.mode || 'technical';
            if (linkMode === mode || linkMode === 'both') {
                link.classList.remove('hidden');
            } else {
                link.classList.add('hidden');
            }
        });

        // Actualizar indicador visual
        const modeLabel = document.getElementById('mode-label');
        if (modeLabel) {
            modeLabel.textContent = mode === 'accessible' ? '📘 Accesible' : '🔧 Técnico';
        }
    }

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

                // Verificar si el nivel está bloqueado
                const level = parseInt(link.dataset.level);
                if (level && !isLevelUnlocked(level)) {
                    e.preventDefault();
                    showToast(`🔒 Desbloquea el Nivel ${level - 1} para acceder a este contenido`);
                    return;
                }

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

    function renderSection(sectionId) {
        // Renderizar secciones prácticas dinámicamente
        const metadata = PRACTICAL_SECTIONS[sectionId];
        if (!metadata) {
            console.warn(`[renderSection] Sección no encontrada: ${sectionId}`);
            return;
        }

        const content = document.querySelector(`[data-section="${sectionId}"]`);
        if (!content) {
            console.warn(`[renderSection] Elemento data-section="${sectionId}" no existe en HTML`);
            return;
        }

        // Mostrar la sección
        document.querySelectorAll('[data-section]').forEach(el => el.classList.remove('active'));
        content.classList.add('active');

        // Scroll suave hacia la sección
        setTimeout(() => {
            content.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        console.log(`[renderSection] Sección renderizada: ${sectionId}`, metadata);
    }

    function validateSectionIds() {
        // Validar que todos los data-section tengan contenido HTML en script.js o sean secciones válidas
        const allSections = document.querySelectorAll('[data-section]');
        const validIds = new Set();

        // IDs de LESSONS_DATA
        Object.keys(LESSONS_DATA).forEach(level => {
            validIds.add(`nivel-${level}`);
            if (LESSONS_DATA[level].modules) {
                LESSONS_DATA[level].modules.forEach(m => validIds.add(m.id));
            }
        });

        // IDs de PRACTICAL_SECTIONS
        Object.keys(PRACTICAL_SECTIONS).forEach(key => validIds.add(key));

        // Validar cada sección en HTML
        const warnings = [];
        allSections.forEach(el => {
            const id = el.dataset.section;
            if (!validIds.has(id)) {
                warnings.push(`[validateSectionIds] Sección sin metadata: ${id}`);
            }
        });

        if (warnings.length > 0) {
            console.warn('Secciones sin validación:', warnings);
        }

        return warnings;
    }

    function initQuiz() {
        document.addEventListener('change', (e) => {
            if (!e.target.matches('input[type="radio"]')) return;
            const card = e.target.closest('.quiz-card');
            const quizContainer = card.closest('.quiz-container');
            const level = parseInt(quizContainer.dataset.level);
            const qIdx = parseInt(card.dataset.q);
            const lesson = LESSONS_DATA[level];
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

            // Calcular puntuación total del quiz
            setTimeout(() => {
                const allCards = quizContainer.querySelectorAll('.quiz-card');
                let correct = 0;
                allCards.forEach(c => {
                    const checked = c.querySelector('input[type="radio"]:checked');
                    if (!checked) return;
                    const qIdx = parseInt(c.dataset.q);
                    const q = lesson.quiz[qIdx];
                    if (parseInt(checked.value) === q.correct) correct++;
                });
                const total = allCards.length;
                const score = Math.round((correct / total) * 100);

                // Si score >= 80%, mostrar botón de desbloqueo del siguiente nivel
                if (score >= 80 && level < 6) {
                    const nextLevel = level + 1;
                    let unlockBtn = quizContainer.querySelector('[data-unlock-btn]');
                    if (!unlockBtn) {
                        unlockBtn = document.createElement('button');
                        unlockBtn.className = 'unlock-level-btn';
                        unlockBtn.dataset.unlockBtn = 'true';
                        unlockBtn.dataset.level = nextLevel;
                        unlockBtn.innerHTML = `🔓 Desbloquear Nivel ${nextLevel} (${score}%)`;
                        quizContainer.parentElement.appendChild(unlockBtn);

                        unlockBtn.addEventListener('click', () => {
                            localStorage.setItem(`cc-level-${nextLevel}-unlocked`, 'true');
                            renderNavLinks();
                            showToast(`🔓 ¡Nivel ${nextLevel} desbloqueado!`);
                            unlockBtn.disabled = true;
                            unlockBtn.innerHTML = `✓ Nivel ${nextLevel} desbloqueado`;
                        });
                    }
                    unlockBtn.style.display = 'block';
                }
            }, 100);
        });
    }

    /* ============================================================
       8.5 SISTEMA DE DESBLOQUEO POR NIVEL
       Lógica, UI y persistencia para controlar acceso a niveles.
       ============================================================ */

    /**
     * Comprueba si un nivel está desbloqueado basándose en:
     * - Nivel 1: siempre desbloqueado
     * - Niveles 2-6: requieren completar el nivel anterior
     */
    function isLevelUnlocked(level) {
        if (level === 1) return true;
        const prevLevel = level - 1;
        return localStorage.getItem(`cc-level-${prevLevel}-completed`) === 'true' ||
               localStorage.getItem(`cc-level-${prevLevel}-completed`) !== null;
    }

    /**
     * Comprueba si un nivel está completado
     */
    function isLevelCompleted(level) {
        return localStorage.getItem(`cc-level-${level}-completed`) !== null;
    }

    /**
     * Desbloquea un nivel (después de completar quiz con 80%+)
     * y actualiza localStorage y UI
     */
    function unlockLevel(level) {
        if (level > 1 && !isLevelUnlocked(level)) {
            localStorage.setItem(`cc-level-${level}-unlocked`, 'true');
            renderNavLinks();
            showToast(`🔓 ¡Nivel ${level} desbloqueado!`);
        }
    }

    /**
     * Renderiza el estado de los links de navegación (locked/unlocked/completed)
     */
    function renderNavLinks() {
        document.querySelectorAll('[data-level]').forEach(link => {
            const level = parseInt(link.dataset.level);
            link.classList.remove('nav-item-locked', 'nav-item-completed');

            if (isLevelCompleted(level)) {
                link.classList.add('nav-item-completed');
                // Agregar badge ✅ si no existe
                if (!link.querySelector('.level-complete-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'level-complete-badge';
                    badge.textContent = ' ✅';
                    link.appendChild(badge);
                }
            } else if (!isLevelUnlocked(level)) {
                link.classList.add('nav-item-locked');
                link.style.cursor = 'not-allowed';
                link.style.opacity = '0.5';
                // Mostrar tooltip
                if (!link.title) {
                    link.title = `Desbloquea Nivel ${level - 1} para acceder`;
                }
            } else {
                link.style.cursor = 'pointer';
                link.style.opacity = '1';
            }
        });
    }

    /**
     * Renderiza un banner de bloqueo en las secciones si está locked
     */
    function renderLevelLockBanner(level) {
        if (isLevelUnlocked(level)) return;

        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        const banner = document.createElement('div');
        banner.className = 'level-lock-banner';
        banner.innerHTML = `
            <div class="lock-banner-content">
                <div class="lock-banner-icon">🔒</div>
                <div class="lock-banner-text">
                    <h3>Nivel ${level} Bloqueado</h3>
                    <p>Completa el Nivel ${level - 1} para desbloquear este contenido.</p>
                    <p class="lock-banner-hint">Necesitas: 80%+ en el quiz + todas las secciones leídas</p>
                </div>
                <button class="lock-banner-btn" onclick="document.querySelector('[data-section=\\'curso\\']').click()">
                    Ver requisitos
                </button>
            </div>
        `;
        mainContent.insertBefore(banner, mainContent.firstChild);
    }

    function initCheckpoints() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.checkpoint-btn');
            if (!btn) return;
            const level = parseInt(btn.dataset.level);
            localStorage.setItem(`cc-level-${level}-completed`, 'true');
            btn.disabled = true;
            btn.textContent = `✓ Nivel ${level} completado (${new Date().toLocaleDateString()})`;
            updateLevelBadges();
            renderNavLinks(); // Actualizar nav con nuevo estado
            // Desbloquear siguiente nivel si existe
            if (level < 6) {
                unlockLevel(level + 1);
            }
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
        setupModeToggle();

        // 1) Datos
        renderCommandsTable('commands-table-nivel-1', 1);
        renderCommandsTable('commands-table-nivel-2', 2);
        renderCommandsTable('commands-table-nivel-3', 3);
        renderCommandsTable('commands-table-nivel-4', 4);
        renderCommandsTable('commands-table-nivel-5', 5);
        renderCommandsTable('commands-table-nivel-6', 6);

        // 1.5) Lecciones didácticas
        renderLesson(1);
        renderLesson(2);
        renderLesson(3);
        renderLesson(4);
        renderLesson(5);
        renderLesson(6);

        // 1.7) Validación de secciones
        const sectionWarnings = validateSectionIds();
        if (sectionWarnings.length > 0) {
            console.warn('[P6B] Advertencias de validación:', sectionWarnings);
        }

        // 2) Navegación
        setupNavigation();

        // 2.3) Sistema de desbloqueo por nivel
        renderNavLinks();

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
