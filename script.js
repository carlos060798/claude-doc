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
    function setupNavigation() {
        const links = document.querySelectorAll('.nav-link, [data-jump]');
        const sections = document.querySelectorAll('.content-section');

        function goTo(sectionId) {
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
        // 1) Datos
        renderCommandsTable('commands-table-nivel-1', 1);
        renderCommandsTable('commands-table-nivel-2', 2);
        renderCommandsTable('commands-table-nivel-3', 3);

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
