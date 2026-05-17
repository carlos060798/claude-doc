'use client'

import { useState } from 'react'

const CHALLENGES = [
  // ===== NIVEL 1: FUNDAMENTOS (8 desafíos) =====
  {
    id: 1,
    level: 1,
    question: '¿Cuál es el comando para instalar Claude Code?',
    options: [
      'npm install -g @anthropic-ai/claude-code',
      'pip install claude-code',
      'brew install claude-code',
      'apt-get install claude-code'
    ],
    correct: 0,
    explanation: 'Claude Code se instala vía npm como un paquete global de Node.js. Asegúrate de tener Node.js v18+ instalado.'
  },
  {
    id: 2,
    level: 1,
    question: '¿Qué comando inicia una sesión de Claude Code en tu directorio?',
    options: ['claude start', 'claude', 'claude init', 'claude session'],
    correct: 1,
    explanation: 'El comando "claude" simplemente inicia una sesión en el directorio actual. No requiere argumentos adicionales.'
  },
  {
    id: 3,
    level: 1,
    question: '¿Cómo mencionas un archivo en una conversación?',
    options: ['file@archivo.js', '@archivo.js', '#archivo.js', '->archivo.js'],
    correct: 1,
    explanation: 'Usa @ seguido del nombre del archivo para incluirlo en el contexto. Ejemplo: @package.json'
  },
  {
    id: 4,
    level: 1,
    question: '¿Cuál es el archivo de configuración principal de Claude Code?',
    options: ['.claude.json', 'CLAUDE.md', '.claude.yml', 'claude-config.js'],
    correct: 1,
    explanation: 'El archivo CLAUDE.md contiene la documentación y configuración del proyecto. Se crea con /init.'
  },
  {
    id: 5,
    level: 1,
    question: '¿Qué hace el comando /help?',
    options: [
      'Abre la página web de ayuda',
      'Muestra lista de comandos disponibles',
      'Busca en la documentación',
      'Reinicia la sesión'
    ],
    correct: 1,
    explanation: '/help muestra todos los comandos disponibles y sus descripciones breves en tu sesión actual.'
  },
  {
    id: 6,
    level: 1,
    question: '¿Cuál es el propósito del comando /init?',
    options: [
      'Inicializa git en el proyecto',
      'Instala dependencias npm',
      'Crea archivo CLAUDE.md con documentación del proyecto',
      'Compila el código fuente'
    ],
    correct: 2,
    explanation: '/init genera un archivo CLAUDE.md que documenta la estructura y configuración de tu proyecto para Claude.'
  },
  {
    id: 7,
    level: 1,
    question: '¿Cómo mencionar múltiples archivos en una sola línea?',
    options: [
      '@archivo1.js @archivo2.js',
      '@[archivo1.js, archivo2.js]',
      '@(archivo1.js|archivo2.js)',
      'all: archivo1.js archivo2.js'
    ],
    correct: 0,
    explanation: 'Simplemente escribe múltiples referencias @ separadas por espacios. Ejemplo: @index.js @utils.js @config.js'
  },
  {
    id: 8,
    level: 1,
    question: '¿Qué comando establece el modelo de IA a usar?',
    options: ['/model claude-3-opus', '/set-model claude-opus', '/model', '/select-ai'],
    correct: 0,
    explanation: '/model claude-3-opus cambia el modelo. Usa /model sin argumentos para ver opciones disponibles.'
  },

  // ===== NIVEL 2: AVANZADO (8 desafíos) =====
  {
    id: 9,
    level: 2,
    question: '¿Qué comando muestra tu uso actual de tokens?',
    options: ['/tokens', '/usage', '/context', '/stats'],
    correct: 1,
    explanation: '/usage muestra el consumo de tokens, costo estimado y límites de contexto en la sesión actual.'
  },
  {
    id: 10,
    level: 2,
    question: '¿Qué comando comprime el historial preservando lo esencial?',
    options: ['/compress', '/compact', '/shrink', '/archive'],
    correct: 1,
    explanation: '/compact comprime el historial mientras preserva información crítica para ahorrar tokens.'
  },
  {
    id: 11,
    level: 2,
    question: '¿Qué herramienta permite exponer funciones a Claude Code?',
    options: ['Claude SDK', 'Model Context Protocol (MCP)', 'Claude API', 'REST API'],
    correct: 1,
    explanation: 'El Model Context Protocol (MCP) permite integrar herramientas, servidores y APIs de forma estructurada.'
  },
  {
    id: 12,
    level: 2,
    question: '¿Cuál es el comando para ver el contexto completo de tu sesión?',
    options: ['/show-context', '/context', '/view-history', '/list-files'],
    correct: 1,
    explanation: '/context muestra todos los archivos, configuraciones y contexto actualmente cargado en tu sesión.'
  },
  {
    id: 13,
    level: 2,
    question: '¿Qué hace el comando /memory?',
    options: [
      'Limpia la cache de memoria',
      'Administra el sistema de memoria persistente de Claude',
      'Muestra RAM disponible',
      'Descarga archivos grandes'
    ],
    correct: 1,
    explanation: '/memory gestiona la memoria persistente: puedes guardar hechos, preferencias y contexto para futuras sesiones.'
  },
  {
    id: 14,
    level: 2,
    question: '¿Cómo configuras un servidor MCP localmente?',
    options: [
      'Crear carpeta /mcp y colocar archivos',
      'Editar CLAUDE.md con configuración MCP bajo sección "mcp"',
      'Usar /install-mcp nombre-servidor',
      'Agregar a environment variables'
    ],
    correct: 1,
    explanation: 'En CLAUDE.md, crea sección [mcp] con configuración de servidores (nombre, cmd, args, env).'
  },
  {
    id: 15,
    level: 2,
    question: '¿Qué ventaja ofrece usar /compact vs /memory?',
    options: [
      'Son idénticos',
      '/compact limpia historial actual; /memory guarda info persistente para futuras sesiones',
      '/memory es más rápido',
      '/compact solo funciona con archivos'
    ],
    correct: 1,
    explanation: '/compact optimiza la sesión actual. /memory persiste datos entre sesiones, ideal para patrones recurrentes.'
  },
  {
    id: 16,
    level: 2,
    question: '¿Cuál es el comando para ver hooks configurados?',
    options: ['/list-hooks', '/hooks', '/show-hooks', '/hook-status'],
    correct: 0,
    explanation: '/list-hooks (o /hooks) muestra todos los hooks automáticos configurados en settings.json de tu proyecto.'
  },

  // ===== NIVEL 3: EXPERTO/SKILLS (8 desafíos) =====
  {
    id: 17,
    level: 3,
    question: '¿Cómo invocas una Skill personalizada?',
    options: ['/exec-skill nombre', '/skill nombre', '/skill-name', '/invoke nombre'],
    correct: 2,
    explanation: 'Las Skills se invocan con patrón /skill-name donde "name" es el identificador de la Skill. Ejemplo: /curso-mastery'
  },
  {
    id: 18,
    level: 3,
    question: '¿Qué comando bifurca la conversación en una sesión paralela?',
    options: ['/branch', '/parallel', '/fork', '/split'],
    correct: 2,
    explanation: '/fork crea una nueva sesión independiente a partir del punto actual. Útil para explorar alternativas.'
  },
  {
    id: 19,
    level: 3,
    question: '¿Cuál es la diferencia entre /fork y /branch?',
    options: [
      'No hay diferencia',
      '/fork crea sesión independiente; /branch es un alias',
      '/branch es para git; /fork es para Claude Code',
      '/fork es más rápido'
    ],
    correct: 2,
    explanation: '/fork en Claude Code crea sesiones paralelas. /branch es para git versionado. Son contextos diferentes.'
  },
  {
    id: 20,
    level: 3,
    question: '¿Cómo se estructura una Skill personalizada?',
    options: [
      'Solo como función JavaScript',
      'JSON config + función handler + documentación',
      'Como archivo .md puro',
      'Usando decoradores Python'
    ],
    correct: 1,
    explanation: 'Una Skill requiere: archivo de config (skills.json), función handler que procesa input, y documentación clara.'
  },
  {
    id: 21,
    level: 3,
    question: '¿Qué permite el comando /team-onboarding?',
    options: [
      'Invita usuarios al proyecto',
      'Genera guía personalizada para onboarding de equipo usando Skills',
      'Sincroniza GitHub Teams',
      'Crea cuenta corporativa'
    ],
    correct: 1,
    explanation: '/team-onboarding genera documentación de onboarding y configuraciones compartidas para tu equipo.'
  },
  {
    id: 22,
    level: 3,
    question: '¿Cuál es el propósito de los placeholder en Skills?',
    options: [
      'Decorar el código',
      'Permitir valores dinámicos en tiempo de ejecución de la Skill',
      'Solo documentación',
      'No tienen propósito actual'
    ],
    correct: 1,
    explanation: 'Los placeholders (ej: ${variableName}) permiten parametrización dinámica de comportamiento en Skills.'
  },
  {
    id: 23,
    level: 3,
    question: '¿Cómo compartes una Skill con el equipo?',
    options: [
      'Copiar código manualmente',
      'Exportar como ZIP',
      'Usar /share-skill o incluir en repositorio compartido con documentación clara',
      'Email a todos'
    ],
    correct: 2,
    explanation: 'Comparte via repositorio con estructura clara, documenta en SKILLS.md y usa /share-skill si disponible.'
  },
  {
    id: 24,
    level: 3,
    question: '¿Qué archivo define comportamientos automáticos para hooks?',
    options: ['.hookrc', 'hooks.json', 'settings.json (sección hooks)', '.claude-hooks'],
    correct: 2,
    explanation: 'Los hooks se configuran en settings.json en sección "hooks". Ejecutan automaticamente en eventos específicos.'
  },

  // ===== NIVEL 4: PRODUCCIÓN (6 desafíos) =====
  {
    id: 25,
    level: 4,
    question: '¿Cuál es el propósito del comando /workspace?',
    options: [
      'Gestiona carpetas del proyecto',
      'Crea múltiples sesiones paralelas aisladas para diferentes contextos',
      'Configura el IDE',
      'Descarga dependencias'
    ],
    correct: 1,
    explanation: '/workspace crea contextos paralelos aislados. Ideal para manejar múltiples features o experimentos simultáneamente.'
  },
  {
    id: 26,
    level: 4,
    question: '¿Qué hace el comando /orchestrate?',
    options: [
      'Ordena los archivos del proyecto',
      'Crea un orquesta de servidores MCP',
      'Ejecuta sub-agentes en paralelo para tareas complejas',
      'Sincroniza con un servidor remoto'
    ],
    correct: 2,
    explanation: '/orchestrate distribuye tareas complejas entre múltiples agentes especializados para paralelización eficiente.'
  },
  {
    id: 27,
    level: 4,
    question: '¿Cuál es la ventaja del modo /autopilot?',
    options: [
      'Aumenta la velocidad de escritura',
      'Modo autónomo con checkpoints y rollback inteligente ante errores',
      'Automatiza las compilaciones',
      'Sincroniza cambios en tiempo real'
    ],
    correct: 1,
    explanation: '/autopilot permite trabajo autónomo con puntos de recuperación. Detiene ante errores y permite rollback seguro.'
  },
  {
    id: 28,
    level: 4,
    question: '¿Cómo monitoreas el rendimiento en producción?',
    options: [
      '/monitor es una Skill que rastrea métrica de error y performance',
      'Usa /metrics para ver estadísticas de sesión',
      'Revisa logs con /logs y configura alertas en settings.json',
      'Todas las anteriores son parcialmente correctas'
    ],
    correct: 3,
    explanation: 'Monitoreo integral: /metrics muestra stats, /logs revisa eventos, /monitor rastrea con alertas configuradas en settings.json'
  },
  {
    id: 29,
    level: 4,
    question: '¿Cuál es el patrón recomendado para integrar múltiples MCP en producción?',
    options: [
      'Cargarlos todos en una sola instancia',
      'Usar /orchestrate para distribuir carga; configurar en settings.json con health-checks',
      'Ejecutarlos secuencialmente',
      'No mezclar múltiples MCP'
    ],
    correct: 1,
    explanation: 'Usa /orchestrate para distribuir MCPs, configura health-checks en settings.json, monitorea con /metrics.'
  },
  {
    id: 30,
    level: 4,
    question: '¿Cómo implementas resiliencia en workflows complejos con /orchestrate?',
    options: [
      'No es necesario, /orchestrate maneja todo',
      'Configura retry logic, timeouts y fallbacks en settings.json; usa /autopilot con checkpoints',
      'Manual con try-catch',
      'No hay forma de implementar resiliencia'
    ],
    correct: 1,
    explanation: 'Resiliencia requiere: retry config en settings.json, timeouts, fallback strategies, /autopilot con checkpoints de recuperación.'
  }
]

export default function ChallengeEngine() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showExplanation, setShowExplanation] = useState(false)

  const challenge = CHALLENGES[currentIdx]
  const userAnswer = answers[challenge.id]
  const isCorrect = userAnswer === challenge.correct

  const handleAnswer = (optionIdx) => {
    setAnswers(prev => ({ ...prev, [challenge.id]: optionIdx }))
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentIdx < CHALLENGES.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setShowExplanation(false)
    }
  }

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-default)',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            Pregunta {currentIdx + 1} de {CHALLENGES.length}
          </span>
          <span style={{
            background: `var(--level-${challenge.level})`,
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            Nivel {challenge.level}
          </span>
        </div>
        <div style={{
          height: '4px',
          background: 'var(--bg-tertiary)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${((currentIdx + 1) / CHALLENGES.length) * 100}%`,
            background: 'var(--accent-primary)',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      <h3 style={{ marginBottom: '20px' }}>{challenge.question}</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {challenge.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            disabled={userAnswer !== undefined}
            style={{
              padding: '12px',
              background: userAnswer === idx
                ? isCorrect ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                : 'var(--bg-tertiary)',
              border: `2px solid ${userAnswer === idx
                ? isCorrect ? '#4ade80' : '#ef4444'
                : 'var(--border-default)'}`,
              borderRadius: '6px',
              color: 'var(--text-primary)',
              cursor: userAnswer === undefined ? 'pointer' : 'default',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (userAnswer === undefined) {
                e.target.style.borderColor = 'var(--accent-primary)'
                e.target.style.background = 'var(--bg-hover)'
              }
            }}
            onMouseLeave={(e) => {
              if (userAnswer === undefined) {
                e.target.style.borderColor = 'var(--border-default)'
                e.target.style.background = 'var(--bg-tertiary)'
              }
            }}
          >
            {String.fromCharCode(65 + idx)}. {option}
            {userAnswer === idx && (
              <span style={{ marginLeft: '8px' }}>
                {isCorrect ? '✓' : '✗'}
              </span>
            )}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div style={{
          background: isCorrect ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${isCorrect ? '#4ade80' : '#ef4444'}`,
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
          color: 'var(--text-secondary)'
        }}>
          <strong>{isCorrect ? '✓ Correcto!' : '✗ Incorrecto'}</strong>
          <p style={{ marginTop: '8px', fontSize: '13px' }}>
            {challenge.explanation}
          </p>
        </div>
      )}

      {showExplanation && (
        <button
          onClick={handleNext}
          disabled={currentIdx === CHALLENGES.length - 1}
          style={{
            width: '100%',
            padding: '10px',
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: currentIdx === CHALLENGES.length - 1 ? 'default' : 'pointer',
            opacity: currentIdx === CHALLENGES.length - 1 ? 0.5 : 1
          }}
        >
          {currentIdx === CHALLENGES.length - 1 ? '¡Completado!' : 'Siguiente'}
        </button>
      )}
    </div>
  )
}
