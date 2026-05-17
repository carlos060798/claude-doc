'use client'

import { useState } from 'react'

const CHALLENGES = [
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
    explanation: 'Claude Code se instala vía npm como un paquete global de Node.js'
  },
  {
    id: 2,
    level: 1,
    question: '¿Qué comando inicia una sesión de Claude Code en tu directorio?',
    options: ['claude start', 'claude', 'claude init', 'claude session'],
    correct: 1,
    explanation: 'El comando "claude" simplemente inicia una sesión en el directorio actual'
  },
  {
    id: 3,
    level: 2,
    question: '¿Qué comando muestra tu uso actual de tokens?',
    options: ['/tokens', '/usage', '/context', '/stats'],
    correct: 1,
    explanation: 'El comando /usage muestra el consumo de tokens y costo estimado'
  },
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
