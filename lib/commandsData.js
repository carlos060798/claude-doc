export const COMMANDS_DATA = [
  // --- Nivel 1: Fundamentos ---
  {
    cmd: 'claude',
    level: 1,
    category: 'shell',
    desc: 'Inicia Claude Code en el directorio actual.',
    example: 'cd mi-proyecto && claude'
  },
  {
    cmd: 'claude --version',
    level: 1,
    category: 'shell',
    desc: 'Muestra la versión instalada del CLI.',
    example: 'claude --version'
  },
  {
    cmd: '/help',
    level: 1,
    category: 'built-in',
    desc: 'Lista todos los comandos disponibles en la sesión actual.',
    example: '/help'
  },
  {
    cmd: '/init',
    level: 1,
    category: 'built-in',
    desc: 'Genera un CLAUDE.md inicial analizando tu proyecto.',
    example: '/init'
  },
  {
    cmd: '/clear',
    level: 1,
    category: 'built-in',
    desc: 'Limpia el historial de la conversación e inicia sesión fresca.',
    example: '/clear'
  },
  {
    cmd: '/model',
    level: 1,
    category: 'built-in',
    desc: 'Cambia el modelo activo (Opus / Sonnet / Haiku).',
    example: '/model claude-sonnet-4-6'
  },
  {
    cmd: '@archivo',
    level: 1,
    category: 'mention',
    desc: 'Menciona un archivo o carpeta para cargarlo en contexto.',
    example: 'Refactoriza @src/auth/login.ts'
  },

  // --- Nivel 2: Avanzado / MCP ---
  {
    cmd: '/compact',
    level: 2,
    category: 'built-in',
    desc: 'Comprime el historial preservando lo esencial.',
    example: '/compact mantén el plan de migración y descarta logs'
  },
  {
    cmd: '/context',
    level: 2,
    category: 'built-in',
    desc: 'Muestra el uso actual de la ventana de contexto.',
    example: '/context'
  },
  {
    cmd: '/usage',
    level: 2,
    category: 'built-in',
    desc: 'Muestra el consumo de tokens y costo estimado de la sesión.',
    example: '/usage'
  },
  {
    cmd: '/mcp',
    level: 2,
    category: 'built-in',
    desc: 'Lista los servidores MCP conectados y sus herramientas.',
    example: '/mcp'
  },

  // --- Nivel 3: Experto / Skills ---
  {
    cmd: '/skill-name',
    level: 3,
    category: 'custom',
    desc: 'Invoca una Skill personalizada definida en .claude/skills/<name>/SKILL.md',
    example: '/security-audit'
  },
  {
    cmd: '/fork',
    level: 3,
    category: 'built-in',
    desc: 'Bifurca la conversación en una nueva sesión paralela.',
    example: '/fork'
  },
  {
    cmd: '/team-onboarding',
    level: 3,
    category: 'built-in',
    desc: 'Genera una guía de onboarding desde tu CLAUDE.md, skills y hooks.',
    example: '/team-onboarding'
  }
]

export const SCENARIOS = {
  setupInstall: [
    { type: 'prompt', text: '$ npm install -g @anthropic-ai/claude-code', delay: 200 },
    { type: 'output', text: 'npm notice Checking for updates...', delay: 800 },
    { type: 'output', text: 'npm info it worked if it ends with ok', delay: 500 },
    { type: 'success', text: '✓ claude-code installed successfully', delay: 1200 }
  ],
  initProject: [
    { type: 'prompt', text: '$ claude /init', delay: 200 },
    { type: 'output', text: 'Scanning project structure...', delay: 1000 },
    { type: 'output', text: 'Found: package.json, .git, src/', delay: 600 },
    { type: 'success', text: '✓ CLAUDE.md generated', delay: 800 }
  ],
  mcpSetup: [
    { type: 'prompt', text: '$ claude mcp add github -e GITHUB_TOKEN', delay: 200 },
    { type: 'output', text: 'Registering MCP server: github', delay: 1000 },
    { type: 'success', text: '✓ github server connected', delay: 600 },
    { type: 'info', text: 'Available tools: create_issue, list_prs, search_repos', delay: 800 }
  ]
}
