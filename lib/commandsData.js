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
  },

  // --- Nivel 4: Maestría Práctica ---
  {
    cmd: '/workspace',
    level: 4,
    category: 'advanced',
    desc: 'Gestiona múltiples sesiones paralelas de Claude Code en workspaces aislados.',
    example: '/workspace create refactor-api-v2'
  },
  {
    cmd: '/orchestrate',
    level: 4,
    category: 'advanced',
    desc: 'Orquesta sub-agentes en paralelo para resolver tareas complejas.',
    example: '/orchestrate start testing-framework --agents 4'
  },
  {
    cmd: '/autopilot',
    level: 4,
    category: 'advanced',
    desc: 'Modo autónomo con checkpoints automáticos y rollback inteligente.',
    example: '/autopilot enable --checkpoint-interval 5m'
  },
  {
    cmd: '/squad',
    level: 4,
    category: 'advanced',
    desc: 'Configura un equipo de sub-agentes especializados para diferentes funciones.',
    example: '/squad configure architect,reviewer,tester'
  },
  {
    cmd: '/metrics',
    level: 4,
    category: 'advanced',
    desc: 'Monitorea performance, tokens consumidos y eficiencia de agentes.',
    example: '/metrics dashboard --period 24h'
  },
  {
    cmd: '/cascade',
    level: 4,
    category: 'advanced',
    desc: 'Encadena múltiples operaciones con rollback automático en cascada.',
    example: '/cascade schema-migration --stages 5'
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
  ],
  workspaceExample: [
    { type: 'prompt', text: '$ claude /workspace create refactor-api-v2', delay: 300 },
    { type: 'output', text: 'Creating isolated workspace: refactor-api-v2', delay: 900 },
    { type: 'success', text: '✓ Workspace created and activated', delay: 700 },
    { type: 'info', text: 'You can now work independently while keeping other sessions intact', delay: 800 }
  ],
  orchestrateExample: [
    { type: 'prompt', text: '$ claude /orchestrate start testing-framework --agents 4', delay: 300 },
    { type: 'output', text: 'Initializing 4 specialized sub-agents...', delay: 1200 },
    { type: 'output', text: 'Agent 1 (Architect): Ready', delay: 400 },
    { type: 'output', text: 'Agent 2 (Reviewer): Ready', delay: 400 },
    { type: 'output', text: 'Agent 3 (Tester): Ready', delay: 400 },
    { type: 'output', text: 'Agent 4 (Documenter): Ready', delay: 400 },
    { type: 'success', text: '✓ All agents synchronized and working in parallel', delay: 900 }
  ],
  autopilotExample: [
    { type: 'prompt', text: '$ claude /autopilot enable --checkpoint-interval 5m', delay: 300 },
    { type: 'output', text: 'Enabling autonomous mode with 5-minute checkpoints', delay: 1000 },
    { type: 'success', text: '✓ Autopilot activated', delay: 600 },
    { type: 'info', text: 'Checkpoints will be saved at: ~/claude-checkpoints/', delay: 800 }
  ],
  metricsExample: [
    { type: 'prompt', text: '$ claude /metrics dashboard --period 24h', delay: 300 },
    { type: 'output', text: 'Fetching performance metrics for last 24 hours...', delay: 1200 },
    { type: 'output', text: 'Total tokens used: 45,234', delay: 500 },
    { type: 'output', text: 'Agent efficiency: 94.3%', delay: 500 },
    { type: 'success', text: '✓ Metrics dashboard ready', delay: 800 }
  ]
}
