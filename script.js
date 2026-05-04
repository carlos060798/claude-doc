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
