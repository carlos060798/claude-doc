export const SECTIONS_CONFIG = [
  // Inicio
  { id: 'dashboard', icon: '▣', label: 'Dashboard', group: 'Inicio', mode: 'both' },
  { id: 'curso', icon: '🎓', label: 'Curso Interactivo', group: 'Inicio', mode: 'technical' },

  // Fundamentos
  { id: 'instalacion', icon: '⚙️', label: 'Instalación', group: '📚 Fundamentos', mode: 'technical' },
  { id: 'primeros-pasos', icon: '🚀', label: 'Primeros Pasos', group: '📚 Fundamentos', mode: 'technical' },
  { id: 'claude-md', icon: '📝', label: 'CLAUDE.md', group: '📚 Fundamentos', mode: 'technical' },

  // Arquitectura & Producción
  { id: 'branching', icon: '🌿', label: 'Branching Strategy', group: '🏗️ Arquitectura & Producción', mode: 'technical' },
  { id: 'rules', icon: '📋', label: '.rules & Config', group: '🏗️ Arquitectura & Producción', mode: 'technical' },
  { id: 'memory', icon: '💾', label: 'Memory Management', group: '🏗️ Arquitectura & Producción', mode: 'technical' },
  { id: 'patrones', icon: '🔄', label: 'Patrones de Comandos', group: '🏗️ Arquitectura & Producción', mode: 'technical' },

  // Casos Prácticos
  { id: 'proyectos', icon: '🚀', label: 'Proyectos de Ejemplo', group: '💡 Casos Prácticos', mode: 'technical' },
  { id: 'desafios', icon: '🧠', label: 'Desafíos', group: '💡 Casos Prácticos', mode: 'technical' },
  { id: 'flujos-dev', icon: '🔄', label: 'Flujos Dev Reales', group: '💡 Casos Prácticos', mode: 'technical' },

  // Niveles de Aprendizaje
  { id: 'nivel-1', icon: '1️⃣', label: 'Fundamentos', group: 'Niveles de Aprendizaje', mode: 'technical', level: 1 },
  { id: 'nivel-2', icon: '2️⃣', label: 'Avanzado (MCP)', group: 'Niveles de Aprendizaje', mode: 'technical', level: 2 },
  { id: 'nivel-3', icon: '3️⃣', label: 'Experto (Skills)', group: 'Niveles de Aprendizaje', mode: 'technical', level: 3 },
  { id: 'nivel-4', icon: '4️⃣', label: 'Maestría Práctica', group: 'Niveles de Aprendizaje', mode: 'technical', level: 4 },

  // Producción Avanzada
  { id: 'git-workflows', icon: '🌿', label: 'Git Workflows Reales', group: '🔧 Producción Avanzada', mode: 'technical' },
  { id: 'mcp-use-cases', icon: '🔗', label: 'MCPs por Caso de Uso', group: '🔧 Producción Avanzada', mode: 'technical' },
  { id: 'hooks-production', icon: '🎣', label: 'Hooks en Producción', group: '🔧 Producción Avanzada', mode: 'technical' },
  { id: 'multi-mcp-orchestration', icon: '🎼', label: 'Multi-MCP Orchestration', group: '🔧 Producción Avanzada', mode: 'technical' },

  // Profundización
  { id: 'agente-sdk', icon: '🤖', label: 'Agent SDK', group: 'Profundización', mode: 'technical' },
  { id: 'api-anthropic', icon: '⚡', label: 'Anthropic API', group: 'Profundización', mode: 'technical' },
  { id: 'skills-avanzados', icon: '🧩', label: 'Skills Avanzados', group: 'Profundización', mode: 'technical' },
  { id: 'ci-cd', icon: '🔁', label: 'CI/CD & Headless', group: 'Profundización', mode: 'technical' },

  // No-Programadores
  { id: 'intro-acc', icon: '📘', label: '¿Qué es Claude Code?', group: 'Para No-Programadores', mode: 'accessible', hidden: true },
  { id: 'casos-rol', icon: '👥', label: 'Casos por Rol', group: 'Para No-Programadores', mode: 'accessible', hidden: true },
  { id: 'glosario', icon: '📚', label: 'Glosario', group: 'Para No-Programadores', mode: 'accessible', hidden: true },

  // Producción
  { id: 'memoria', icon: '💾', label: 'Tu Progreso', group: 'Producción', mode: 'both' },
  { id: 'seguridad', icon: '⛨', label: 'Seguridad & Hardening', group: 'Producción', mode: 'both' },
  { id: 'casos-uso', icon: '⚙', label: 'Casos de Uso', group: 'Producción', mode: 'both' },
  { id: 'mejores-practicas', icon: '✦', label: 'Mejores Prácticas', group: 'Producción', mode: 'both' },
  { id: 'terminal', icon: '▶', label: 'Simulador Terminal', group: 'Producción', mode: 'both' },
  { id: 'recursos', icon: '↗', label: 'Recursos Externos', group: 'Producción', mode: 'both' },
]

export const SECTION_CONTENT = {
  'instalacion': { title: 'Instalación', lead: 'Configura Claude Code en tu máquina.' },
  'primeros-pasos': { title: 'Primeros Pasos', lead: 'Tus primeros comandos con Claude Code.' },
  'claude-md': { title: 'CLAUDE.md', lead: 'La configuración persistente de tus proyectos.' },
  'branching': { title: 'Branching Strategy', lead: 'Estrategias de branches profesionales.' },
  'rules': { title: '.rules & Config', lead: 'Configuración avanzada y reglas de proyecto.' },
  'memory': { title: 'Memory Management', lead: 'Manejo de memoria persistente.' },
  'patrones': { title: 'Patrones de Comandos', lead: 'Patrones recurrentes en Claude Code.' },
  'proyectos': { title: 'Proyectos de Ejemplo', lead: 'Casos de uso completos y funcionales.' },
  'flujos-dev': { title: 'Flujos Dev Reales', lead: 'Workflows diarios del desarrollador.' },
  'git-workflows': { title: 'Git Workflows Reales', lead: 'Workflows avanzados con Git.' },
  'mcp-use-cases': { title: 'MCPs por Caso de Uso', lead: 'MCPs especializados para cada tarea.' },
  'hooks-production': { title: 'Hooks en Producción', lead: 'Automatización con hooks de producción.' },
  'multi-mcp-orchestration': { title: 'Multi-MCP Orchestration', lead: 'Orquestación de múltiples MCPs.' },
  'agente-sdk': { title: 'Agent SDK', lead: 'Construcción programática de agentes.' },
  'api-anthropic': { title: 'Anthropic API', lead: 'La API de mensajes de Anthropic.' },
  'skills-avanzados': { title: 'Skills Avanzados', lead: 'Crea Skills personalizadas complejas.' },
  'ci-cd': { title: 'CI/CD & Headless', lead: 'Integración en pipelines de CI/CD.' },
  'intro-acc': { title: '¿Qué es Claude Code?', lead: 'Una introducción amable para todos.' },
  'casos-rol': { title: 'Casos por Rol', lead: 'Claude Code para tu rol específico.' },
  'glosario': { title: 'Glosario', lead: 'Términos y conceptos clave explicados.' },
  'memoria': { title: 'Tu Progreso', lead: 'Sigue tu avance en el curso.' },
  'seguridad': { title: 'Seguridad & Hardening', lead: 'Protege tus proyectos y datos.' },
  'casos-uso': { title: 'Casos de Uso', lead: 'Cómo usar Claude Code en la práctica.' },
  'mejores-practicas': { title: 'Mejores Prácticas', lead: 'Patrones ganadores en producción.' },
  'terminal': { title: 'Simulador Terminal', lead: 'Practica comandos interactivamente.' },
  'recursos': { title: 'Recursos Externos', lead: 'Enlaces a documentación oficial.' },
  'nivel-4': { title: 'Nivel 4 — Maestría Práctica', lead: 'Domina Claude Code en casos reales.' },
}
