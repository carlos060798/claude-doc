'use client'

import ChallengeEngine from './ChallengeEngine'

export default function ChallengesSection() {
  return (
    <section className="content-section">
      <div className="dashboard-header">
        <h1>🧠 Desafíos Interactivos</h1>
        <p className="subtitle">
          Resuelve desafíos prácticos para validar lo que aprendiste.
          Cada desafío te pone en una situación real de developer.
        </p>
      </div>

      <ChallengeEngine />

      <div style={{ marginTop: '40px' }}>
        <h2>Cómo funcionan los desafíos</h2>
        <ul style={{ marginLeft: '20px', color: 'var(--text-secondary)' }}>
          <li>✅ Lee la pregunta cuidadosamente</li>
          <li>✅ Selecciona la opción que crees es correcta</li>
          <li>✅ Lee la explicación para entender por qué</li>
          <li>✅ Tu progreso se guarda automáticamente</li>
        </ul>
      </div>
    </section>
  )
}
