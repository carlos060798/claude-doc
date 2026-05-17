export const COMMANDS_DATA = [
  // Nivel 1: Fundamentos
  {
    cmd: '/help',
    level: 1,
    category: 'CLI',
    desc: 'Muestra ayuda sobre comandos disponibles',
    examples: [
      { input: 'claude /help', desc: 'Ver todos los comandos disponibles' },
      { input: 'claude /help init', desc: 'Obtener ayuda para el comando /init' }
    ]
  },
  {
    cmd: '/init',
    level: 1,
    category: 'Proyecto',
    desc: 'Inicializa un nuevo proyecto con CLAUDE.md',
    examples: [
      { input: 'claude /init', desc: 'Crear CLAUDE.md en el directorio actual' }
    ]
  },
  {
    cmd: '/model',
    level: 1,
    category: 'Configuración',
    desc: 'Cambia el modelo de Claude a usar',
    examples: [
      { input: 'claude /model opus', desc: 'Usar Claude Opus (más potente)' },
      { input: 'claude /model haiku', desc: 'Usar Claude Haiku (más rápido)' }
    ]
  },
  {
    cmd: '/fast',
    level: 1,
    category: 'Configuración',
    desc: 'Activa modo rápido (respuestas más ágiles)',
    examples: [
      { input: 'claude /fast', desc: 'Alternar modo rápido' }
    ]
  },
  {
    cmd: '@mention',
    level: 1,
    category: 'Archivos',
    desc: 'Menciona archivos o carpetas en el contexto',
    examples: [
      { input: 'claude @package.json', desc: 'Incluir package.json en contexto' },
      { input: 'claude @src/', desc: 'Incluir toda la carpeta src/' }
    ]
  },

  // Nivel 2: Avanzado
  {
    cmd: '/compact',
    level: 2,
    category: 'Contexto',
    desc: 'Compacta el historial para liberar tokens',
    examples: [
      { input: 'claude /compact', desc: 'Resumir conversación anterior' }
    ]
  },
  {
    cmd: '/context',
    level: 2,
    category: 'Contexto',
    desc: 'Muestra el uso actual de contexto y tokens',
    examples: [
      { input: 'claude /context', desc: 'Ver estadísticas de tokens usados' }
    ]
  },
  {
    cmd: '/usage',
    level: 2,
    category: 'Estadísticas',
    desc: 'Muestra estadísticas de uso de Claude Code',
    examples: [
      { input: 'claude /usage', desc: 'Ver estadísticas de sesión' }
    ]
  },
  {
    cmd: '/mcp',
    level: 2,
    category: 'MCP',
    desc: 'Gestiona servidores MCP instalados',
    examples: [
      { input: 'claude /mcp list', desc: 'Listar servidores MCP activos' },
      { input: 'claude /mcp install', desc: 'Instalar nuevo servidor MCP' }
    ]
  },
  {
    cmd: '/config',
    level: 2,
    category: 'Configuración',
    desc: 'Abre el diálogo de configuración',
    examples: [
      { input: 'claude /config', desc: 'Configurar temas, permisos, etc.' }
    ]
  },

  // Nivel 3: Experto
  {
    cmd: '/skill-name',
    level: 3,
    category: 'Skills',
    desc: 'Ejecuta un skill personalizado',
    examples: [
      { input: 'claude /deploy', desc: 'Ejecutar skill de deploy personalizado' },
      { input: 'claude /review', desc: 'Ejecutar skill de revisión de código' }
    ]
  },
  {
    cmd: '/fork',
    level: 3,
    category: 'Desarrollo',
    desc: 'Crea una rama de trabajo independiente',
    examples: [
      { input: 'claude /fork feature/new-ui', desc: 'Crear rama feature/new-ui' }
    ]
  },
  {
    cmd: '/team-onboarding',
    level: 3,
    category: 'Equipo',
    desc: 'Genera guía de onboarding del equipo',
    examples: [
      { input: 'claude /team-onboarding', desc: 'Generar ONBOARDING.md' }
    ]
  }
]

export const LESSONS_DATA = {
  1: {
    title: 'Fundamentos de Claude Code',
    estimatedTime: '30-45 minutos',
    objectives: [
      'Instalar y configurar Claude Code',
      'Entender la estructura de archivos básica',
      'Aprender comandos CLI esenciales (/help, /init, /model)',
      'Usar @mentions para incluir archivos en contexto',
      'Escribir prompts efectivos para tareas de código'
    ],
    tools: ['/help', '/init', '/model', '@mention', '/fast']
  },
  2: {
    title: 'Avanzado: MCP y Contexto',
    estimatedTime: '1-2 horas',
    objectives: [
      'Entender Model Context Protocol (MCP)',
      'Instalar y usar servidores MCP',
      'Gestionar contexto y tokens de forma eficiente',
      'Usar comandos avanzados (/compact, /context)',
      'Integrar herramientas externas con MCP'
    ],
    tools: ['/mcp', '/compact', '/context', '/usage', '/config']
  },
  3: {
    title: 'Experto: Skills y Automatización',
    estimatedTime: '2-3 horas',
    objectives: [
      'Crear skills personalizados',
      'Automatizar flujos de trabajo con hooks',
      'Usar /fork para desarrollo independiente',
      'Generar documentación con /team-onboarding',
      'Optimizar workflows con placeholders y variables'
    ],
    tools: ['/skill-name', '/fork', '/team-onboarding', 'hooks', 'placeholders']
  }
}

export const SCENARIOS = {
  'Crear un nuevo proyecto': [
    { type: 'prompt', text: 'usuario@project:~$' },
    { type: 'user', text: 'claude /init', delay: 500 },
    { type: 'output', text: 'Inicializando proyecto...', delay: 300 },
    { type: 'success', text: '✓ CLAUDE.md creado exitosamente', delay: 500 },
    { type: 'output', text: 'Versión: 1.0.0', delay: 200 },
    { type: 'output', text: 'Descripción: Documentación del proyecto', delay: 200 }
  ],
  'Buscar comando específico': [
    { type: 'prompt', text: 'usuario@project:~$' },
    { type: 'user', text: 'claude /help init', delay: 500 },
    { type: 'info', text: 'Buscando documentación...', delay: 300 },
    { type: 'output', text: '/init — Inicializa CLAUDE.md con estructura base', delay: 400 },
    { type: 'output', text: 'Uso: claude /init [opciones]', delay: 200 },
    { type: 'output', text: 'Flags: --force, --template', delay: 200 }
  ],
  'Cambiar modelo de Claude': [
    { type: 'prompt', text: 'usuario@project:~$' },
    { type: 'user', text: 'claude /model opus', delay: 500 },
    { type: 'success', text: '✓ Modelo cambiado a Claude Opus', delay: 400 },
    { type: 'info', text: 'Más potente, ideal para tareas complejas', delay: 300 },
    { type: 'comment', text: '# Próximas sesiones usarán Opus por defecto', delay: 200 }
  ],
  'Instalar servidor MCP': [
    { type: 'prompt', text: 'usuario@project:~$' },
    { type: 'user', text: 'claude /mcp install postgres', delay: 500 },
    { type: 'output', text: 'Buscando servidores MCP compatibles...', delay: 400 },
    { type: 'success', text: '✓ postgres-mcp v2.1.0 instalado', delay: 500 },
    { type: 'info', text: 'Herramientas disponibles: query, insert, update, delete', delay: 300 }
  ],
  'Usar @mention para incluir archivos': [
    { type: 'prompt', text: 'usuario@project:~$' },
    { type: 'user', text: 'claude fix bugs @src/app.js @tests/', delay: 500 },
    { type: 'info', text: 'Cargando archivos...', delay: 300 },
    { type: 'output', text: 'app.js (2.3 KB) — 145 líneas', delay: 200 },
    { type: 'output', text: 'tests/ (5.1 KB) — 3 archivos', delay: 200 },
    { type: 'success', text: '✓ Contexto actualizado', delay: 300 }
  ]
}
