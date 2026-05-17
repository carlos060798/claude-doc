// Datos centralizados para Claude Code Mastery

export const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', group: 'Inicio', icon: '▣' },
  { id: 'git-workflows', label: '🌿 Git Workflows Reales', group: '🔧 Producción Avanzada', icon: '🌿' },
  { id: 'mcp-use-cases', label: '🔗 MCPs por Caso de Uso', group: '🔧 Producción Avanzada', icon: '🔗' },
  { id: 'hooks-production', label: '🎣 Hooks en Producción', group: '🔧 Producción Avanzada', icon: '🎣' },
  { id: 'multi-mcp-orchestration', label: '🎼 Multi-MCP Orchestration', group: '🔧 Producción Avanzada', icon: '🎼' },
]

export const GIT_WORKFLOWS = {
  title: '🌿 Git Workflows Reales en Producción',
  intro: 'Tres flujos probados: Trunk-based, Gitflow, Worktrees. Con commits reales del repo y comandos copy-paste.',
  workflows: [
    {
      title: 'Flujo A: Trunk-Based Development',
      badge: '✅ Recomendado para: Equipos 2-8, ciclos cortos',
      when: ['Equipos pequeños (2-8 personas)', 'Ciclos de release cortos (diarios/semanales)', 'CI/CD sólido y tests confiables'],
      code: `# 1. Sincroniza master
git checkout master && git pull origin master

# 2. Feature branch corta (max 1 día)
git checkout -b fix/auth-token-refresh

# 3. Commits atómicos
git commit -m "fix: refresh token antes de expiración
- Valida expiration en middleware
- Usa /refresh endpoint
- Tests en auth.spec.ts"

# 4. Push + PR
git push -u origin fix/auth-token-refresh

# 5. Cleanup
git checkout master
git pull origin master
git branch -d fix/auth-token-refresh`,
      pros: ['Integración continua = menos conflictos', 'Deploy más seguro (cambios pequeños)', 'Feedback rápido en code review'],
      cons: ['Requiere CI/CD sólido', 'Tests deben ser confiables', 'Presión para merge rápido'],
    },
    {
      title: 'Flujo B: Feature Branches + Gitflow',
      badge: '📊 Recomendado para: Equipos 8-20, releases planeadas',
      when: ['Equipos medianos (8-20 personas)', 'Releases cada 2-4 semanas', 'Necesitas branches de release/staging'],
      code: `# STEP 1: Feature branch desde develop
git checkout -b feature/otp-auth develop
git commit -m "feat: agregar TOTP authentication"
git push origin feature/otp-auth

# STEP 2: Code freeze para release
git checkout -b release/2.5.0 develop
git commit -m "chore: bump to v2.5.0"

# STEP 3: Tests finales + tag
npm test && npm run build
git tag -a v2.5.0 -m "Release 2.5.0"

# STEP 4: Merge a master + back a develop
git checkout master && git pull origin master
git merge --no-ff release/2.5.0
git push origin master v2.5.0`,
      pros: ['Estructura clara (develop ≠ production)', 'Releases controladas', 'Hotfixes sin afectar features'],
      cons: ['Más complicado que trunk-based', 'Merge frequentes entre branches', 'Riesgo de divergencia'],
    },
    {
      title: 'Flujo C: Git Worktrees (Paralelismo)',
      badge: '⚡ Recomendado para: Trabajar en múltiples branches en paralelo',
      when: ['Necesitas trabajar en 2-3 cosas en paralelo', 'Quieres mantener clean la rama principal'],
      code: `# Opción 1: Manual git worktree
git worktree add ~/work/auth-refactor -b feature/auth-refactor
cd ~/work/auth-refactor

# Opción 2: Automático con Claude Code
claude --worktree feature/auth-refactor

# Listing
git worktree list

# Cleanup
git worktree remove ~/work/auth-refactor`,
      pros: ['Paralelismo sin conflictos', 'Contexto aislado', 'Sin "git checkout"'],
      cons: ['Requiere más storage', 'Puede ser confuso con directorios', 'Cleanup manual'],
    }
  ],
  comparison: {
    headers: ['Aspecto', 'Trunk-Based', 'Gitflow', 'Worktrees'],
    rows: [
      ['Complejidad', 'Baja', 'Media', 'Media (intuitiva)'],
      ['Release cycle', 'Diario/semanal', 'Cada 2-4 sem', 'Variable'],
      ['Equipo ideal', '2-8', '8-20+', 'Cualquiera'],
      ['CI/CD req', 'Sólido', 'Moderado', 'Sólido'],
      ['Merge conflicts', 'Frecuentes (pequeños)', 'Menos frecuentes', 'Cero (isolated)'],
    ]
  }
}

export const MCP_SERVERS = {
  title: '🔗 MCP Servers by Use Case',
  intro: 'GitHub, PostgreSQL, Slack y otros MCPs configurados para casos reales. Setup copy-paste listo.',
  servers: [
    {
      title: 'GitHub MCP: PR Reviews & Issue Creation',
      badge: 'Perfect for: Code review automation, issue tracking',
      why: ['Automaticar code review línea-por-línea', 'Crear issues desde sesión Claude', 'Query PR diffs sin salir del CLI', 'Integrar feedback en tiempo real'],
      setup: `# Opción 1: User scope (global)
claude mcp add --scope user github \\
  -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxx \\
  -- npx -y @modelcontextprotocol/server-github`,
    },
    {
      title: 'PostgreSQL MCP: Data Exploration',
      badge: 'Perfect for: Database debugging, schema analysis',
      why: ['Ejecutar queries sin psql CLI', 'Explorar schema de la DB en tiempo real', 'Debugging de datos en producción', 'Backups y exports automáticos'],
      setup: `# Local database
claude mcp add --scope project postgres \\
  -e DATABASE_URL=postgresql://user:pass@localhost:5432/mydb \\
  -- npx -y @modelcontextprotocol/server-postgres`,
    },
    {
      title: 'Slack MCP: Notifications & Audit Trail',
      badge: 'Perfect for: Team notifications, audit logging',
      why: ['Notificar al equipo desde Claude automáticamente', 'Crear audit trail en Slack', 'Alertas de CI/CD failures', 'Integración con workflows'],
      setup: `# 1. Ir a https://api.slack.com/apps
# 2. Create New App → From scratch
# 3. App name: "Claude Code Bot"
# 4. OAuth & Permissions → Scopes: chat:write, files:write
# 5. Copy Bot Token

claude mcp add --scope user slack \\
  -e SLACK_BOT_TOKEN=xoxb-xxxxx \\
  -- npx -y @modelcontextprotocol/server-slack`,
    }
  ]
}

export const HOOKS_PRODUCTION = {
  title: '🎣 Hooks in Production',
  intro: '5 hooks reales que automatizan seguridad, tests, y monitoreo. Configuración lista para copiar.',
  hooks: [
    {
      title: 'Hook 1: Security Audit (PreToolUse)',
      description: 'Valida cada acción antes de ejecutarla — bloquea comandos peligrosos.',
      config: `{
  "hooks": {
    "PreToolUse": {
      "enabled": true,
      "rules": [
        {
          "name": "Block dangerous commands",
          "pattern": "(rm -rf|eval|curl.*\\\\||sh -c|sudo)",
          "action": "block",
          "message": "Comando potencialmente peligroso."
        },
        {
          "name": "Block PII exposure",
          "pattern": "(password|token|secret)\\\\s*=",
          "action": "block",
          "message": "No se permite escribir credenciales."
        }
      ]
    }
  }
}`
    },
    {
      title: 'Hook 2: Auto-Format + Tests (PostToolUse)',
      description: 'Después de escribir código, formatea automáticamente y corre tests.',
      config: `{
  "hooks": {
    "PostToolUse": {
      "enabled": true,
      "sequence": [
        { "name": "Format code", "command": "npm run format", "onError": "warn" },
        { "name": "Lint check", "command": "npm run lint", "onError": "warn" },
        { "name": "Run tests", "command": "npm test -- --watch=false", "onError": "abort" }
      ]
    }
  }
}`
    },
    {
      title: 'Hook 3: Context Injection (UserPromptSubmit)',
      description: 'Inyecta automáticamente contexto relevante (git status, memory) antes de procesar prompts.',
      config: `{
  "hooks": {
    "UserPromptSubmit": {
      "enabled": true,
      "injections": [
        { "name": "Git status", "command": "git status -s", "inject": true },
        { "name": "Session memory", "command": "head -20 ~/.claude/memory", "inject": true }
      ]
    }
  }
}`
    },
    {
      title: 'Hook 4: Cost Warning (PreToolUse)',
      description: 'Advierte si una acción va a consumir muchos tokens o hacer muchas API calls.',
      config: `{
  "hooks": {
    "PreToolUse": {
      "enabled": true,
      "costWarnings": [
        { "name": "Large file", "pattern": "@.*(\\\\.log|\\\\.csv)", "fileSize": "10MB", "action": "warn" },
        { "name": "Database bulk op", "pattern": "DELETE|DROP|TRUNCATE", "action": "warn" }
      ]
    }
  }
}`
    },
    {
      title: 'Hook 5: Performance Monitoring (PostToolUse)',
      description: 'Registra timing, tokens, y recursos de cada acción para análisis posterior.',
      config: `{
  "hooks": {
    "PostToolUse": {
      "enabled": true,
      "monitoring": {
        "logFile": "~/.claude/performance.log",
        "metrics": ["duration", "tokensUsed", "errorsEncountered"],
        "alerts": [{ "metric": "duration", "threshold": "60s", "action": "log" }]
      }
    }
  }
}`
    }
  ]
}

export const MULTI_MCP_ORCHESTRATION = {
  title: '🎼 Multi-MCP Orchestration',
  intro: 'Patrones de coordinación: Fork-Join para paralelismo, Cascading Validation para secuencias.',
  patterns: [
    {
      title: 'Patrón 1: Fork-Join (Paralelismo con MCPs)',
      description: 'Ejecuta múltiples MCPs en paralelo y agrega resultados. Ideal para análisis multi-fuente.',
      diagram: `┌─────────────────────────────────────┐
│ Main Claude Session                 │
│ "Analiza PR #247 completamente"     │
└──────────────┬──────────────────────┘
               │
         ┌─────┴─────────┐
         ▼               ▼
    [FORK 1]        [FORK 2]
   GitHub MCP      PostgreSQL MCP
   ├─ Get PR        ├─ Query affected
   └─ Code diff     └─ Data impact

     Aggregate
    Results`,
    },
    {
      title: 'Patrón 2: Cascading Validation',
      description: 'Validaciones secuenciales: cada paso ejecuta solo si anterior pasó.',
      diagram: `Nuevo commit
    ↓
[1] Code Quality
    └─ Lint → Format → Typecheck
        ↓ (OK)
[2] Security
    └─ SAST → Dependencies → Secrets
        ↓ (OK)
[3] Tests
    └─ Unit → Integration → E2E
        ↓ (OK)
[4] Build
    └─ Bundle → Size check
        ↓ (OK)
✅ READY FOR MERGE`,
    }
  ],
  recommendations: {
    headers: ['Tamaño', 'Workflow', 'MCPs Clave', 'Paralelismo'],
    rows: [
      ['Solo tú', 'Trunk-based', 'GitHub', 'Worktrees'],
      ['2-5', 'Trunk-based', 'GitHub + Slack', 'Forks'],
      ['5-15', 'Gitflow', 'GitHub + PostgreSQL + Slack', 'Cascading + Forks'],
      ['15+', 'Multi-repo', '↑ + Custom MCPs', 'Orchestration avanzado'],
    ]
  }
}

export const COMMANDS_DATA = [
  // --- Nivel 1: Fundamentos ---
  { cmd: 'claude', level: 1, category: 'shell', desc: 'Inicia Claude Code en el directorio actual.', example: 'cd mi-proyecto && claude' },
  { cmd: 'claude --version', level: 1, category: 'shell', desc: 'Muestra la versión instalada del CLI.', example: 'claude --version' },
  { cmd: '/help', level: 1, category: 'built-in', desc: 'Lista todos los comandos disponibles en la sesión actual.', example: '/help' },
  { cmd: '/init', level: 1, category: 'built-in', desc: 'Genera un CLAUDE.md inicial analizando tu proyecto.', example: '/init' },
  { cmd: '/clear', level: 1, category: 'built-in', desc: 'Limpia el historial de la conversación e inicia sesión fresca.', example: '/clear' },
  { cmd: '/model', level: 1, category: 'built-in', desc: 'Cambia el modelo activo (Opus / Sonnet / Haiku).', example: '/model claude-sonnet-4-6' },
  { cmd: '@archivo', level: 1, category: 'mention', desc: 'Menciona un archivo o carpeta para cargarlo en contexto.', example: 'Refactoriza @src/auth/login.ts' },

  // --- Nivel 2: Avanzado / MCP ---
  { cmd: '/compact', level: 2, category: 'built-in', desc: 'Comprime el historial preservando lo esencial.', example: '/compact mantén el plan y descarta logs' },
  { cmd: '/context', level: 2, category: 'built-in', desc: 'Muestra el uso actual de la ventana de contexto.', example: '/context' },
  { cmd: '/usage', level: 2, category: 'built-in', desc: 'Muestra el consumo de tokens y costo estimado de la sesión.', example: '/usage' },
  { cmd: '/mcp', level: 2, category: 'built-in', desc: 'Lista los servidores MCP conectados y sus herramientas.', example: '/mcp' },
  { cmd: 'claude mcp add', level: 2, category: 'shell', desc: 'Registra un nuevo servidor MCP.', example: 'claude mcp add github -e GITHUB_TOKEN -- npx @modelcontextprotocol/server-github' },

  // --- Nivel 3: Experto / Skills ---
  { cmd: '/skill-name', level: 3, category: 'custom', desc: 'Invoca una Skill personalizada definida en .claude/skills/SKILL.md', example: '/security-audit' },
  { cmd: '/fork', level: 3, category: 'built-in', desc: 'Bifurca la conversación en una nueva sesión paralela.', example: '/fork' },

  // --- Nivel 4: Producción Avanzada ---
  { cmd: 'git worktree add', level: 4, category: 'git', desc: 'Crea un directorio aislado para trabajar en otra rama en paralelo.', example: 'git worktree add ~/work/feature-auth -b feature/auth' },
  { cmd: 'claude --worktree', level: 4, category: 'shell', desc: 'Inicia sesión en un git worktree aislado — para paralelismo sin conflictos.', example: 'claude --worktree feature-payment' },
  { cmd: 'claude mcp add --scope user', level: 4, category: 'mcp', desc: 'Registra MCP a nivel de usuario (disponible en todos tus proyectos).', example: 'claude mcp add --scope user github -e GITHUB_TOKEN=...' },
  { cmd: 'claude mcp add --scope project', level: 4, category: 'mcp', desc: 'Registra MCP a nivel de proyecto (compartible en git via .mcp.json).', example: 'claude mcp add --scope project postgres -e DATABASE_URL=...' },
  { cmd: '/fork', level: 4, category: 'advanced', desc: 'Bifurca la sesión en paralelo (comparte contexto + caché).', example: '/fork "Analizar código en paralelo"' },
]

export const LESSONS_DATA = {
  1: {
    title: 'Fundamentos',
    estimatedTime: '45 minutos',
    objectives: [
      'Instalar Claude Code y verificar la instalación',
      'Entender la estructura de CLAUDE.md',
      'Usar comandos básicos: /help, /init, /model',
      'Mencionar archivos con @',
      'Entender el contexto y las limitaciones de tokens'
    ],
    tools: ['CLI', '/help', '/init', '/model', '@archivo']
  },
  2: {
    title: 'Avanzado (MCP)',
    estimatedTime: '60 minutos',
    objectives: [
      'Entender qué es Model Context Protocol (MCP)',
      'Conectar MCPs: GitHub, PostgreSQL, Slack',
      'Usar /compact para limpiar contexto',
      'Gestionar memoria persistente',
      'Configurar .mcp.json en el proyecto'
    ],
    tools: ['/compact', '/context', '/usage', '/mcp', 'MCP Servers']
  },
  3: {
    title: 'Experto (Skills)',
    estimatedTime: '90 minutos',
    objectives: [
      'Crear Skills personalizadas en .claude/skills/',
      'Usar /fork para paralelismo en sesiones',
      'Automatizar tareas complejas con Skills',
      'Integrar MCPs en Skills',
      'Manejar casos avanzados de multiagente'
    ],
    tools: ['/skill-name', '/fork', 'Custom Skills', 'Automation']
  },
  4: {
    title: 'Maestría Práctica',
    estimatedTime: '120 minutos',
    objectives: [
      'Dominar Git Workflows en producción',
      'Orquestar múltiples MCPs en paralelo',
      'Implementar Hooks para seguridad y tests',
      'Patrones Fork-Join y Cascading Validation',
      'Optimización de costos y performance'
    ],
    tools: ['Git Worktrees', 'Multi-MCP', 'Hooks', 'Production Patterns']
  }
}

export const SCENARIOS = {
  'setup-inicial': [
    { type: 'prompt', text: '$ claude' },
    { type: 'output', text: 'Claude Code initialized in /home/user/my-project' },
    { type: 'output', text: 'CLAUDE.md created with project context' },
    { type: 'user', text: '/help' },
    { type: 'output', text: '[Lists available commands...]' },
  ],
  'mcp-github': [
    { type: 'prompt', text: '$ claude mcp add github -e GITHUB_TOKEN' },
    { type: 'output', text: 'GitHub MCP connected ✓' },
    { type: 'user', text: 'Muéstrame los PRs abiertos' },
    { type: 'output', text: '[GitHub MCP] PR #247: Feature X [DRAFT]' },
    { type: 'output', text: '[GitHub MCP] PR #248: Bug fix [READY FOR REVIEW]' },
  ],
  'fork-parallel': [
    { type: 'prompt', text: '/fork "Analizar código en paralelo"' },
    { type: 'output', text: 'Session forked: fork-1' },
    { type: 'output', text: 'Shared context: 8,000 tokens cached' },
    { type: 'user', text: 'Revisa src/auth.ts (en fork)' },
    { type: 'output', text: '[Analysis in parallel...]' },
  ]
}
