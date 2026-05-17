'use client'

import { useState, useMemo } from 'react'
import { COMMANDS_DATA } from '@/lib/commandsData'
import SearchBar from './SearchBar'
import CommandsTable from './CommandsTable'

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(0)

  const filteredCommands = useMemo(() => {
    return COMMANDS_DATA.filter(cmd => {
      const matchesSearch = cmd.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           cmd.desc.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLevel = selectedLevel === 0 || cmd.level === selectedLevel
      return matchesSearch && matchesLevel
    })
  }, [searchQuery, selectedLevel])

  return (
    <section className="content-section">
      <div className="dashboard-header">
        <h1>Claude Code Mastery</h1>
        <p className="subtitle">Aprende los comandos y herramientas más potentes de Claude Code. Desde instalación hasta Skills avanzados y MCP.</p>
      </div>

      <div className="dashboard-controls">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Busca comandos..." />

        <div className="level-filters">
          <button
            className={`filter-btn ${selectedLevel === 0 ? 'active' : ''}`}
            onClick={() => setSelectedLevel(0)}
          >
            Todos
          </button>
          <button
            className={`filter-btn ${selectedLevel === 1 ? 'active' : ''}`}
            onClick={() => setSelectedLevel(1)}
          >
            Nivel 1 — Fundamentos
          </button>
          <button
            className={`filter-btn ${selectedLevel === 2 ? 'active' : ''}`}
            onClick={() => setSelectedLevel(2)}
          >
            Nivel 2 — Avanzado
          </button>
          <button
            className={`filter-btn ${selectedLevel === 3 ? 'active' : ''}`}
            onClick={() => setSelectedLevel(3)}
          >
            Nivel 3 — Experto
          </button>
        </div>
      </div>

      <div className="commands-section">
        <h2>Comandos Disponibles ({filteredCommands.length})</h2>
        <CommandsTable commands={filteredCommands} />
      </div>

      <div className="quick-start">
        <h2>Primeros Pasos</h2>
        <div className="quick-start-cards">
          <div className="card">
            <h3>📦 Instalar</h3>
            <code>npm install -g @anthropic-ai/claude-code</code>
            <p style={{ marginTop: '8px', fontSize: '13px', color: '#a0a0aa' }}>Instala Claude Code globalmente en tu máquina.</p>
          </div>
          <div className="card">
            <h3>🚀 Iniciar sesión</h3>
            <code>claude</code>
            <p style={{ marginTop: '8px', fontSize: '13px', color: '#a0a0aa' }}>Abre una sesión interactiva en tu directorio actual.</p>
          </div>
          <div className="card">
            <h3>❓ Obtener ayuda</h3>
            <code>/help</code>
            <p style={{ marginTop: '8px', fontSize: '13px', color: '#a0a0aa' }}>Lista todos los comandos disponibles.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
