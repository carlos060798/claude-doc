'use client'

import { useState } from 'react'
import Link from 'next/link'
import { COMMANDS_DATA, LESSONS_DATA, SCENARIOS } from '@/lib/data'

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(null)

  // Filtrar comandos
  const filteredCommands = COMMANDS_DATA.filter(cmd => {
    const matchesSearch = cmd.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cmd.desc.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = !selectedLevel || cmd.level === parseInt(selectedLevel)
    return matchesSearch && matchesLevel
  })

  return (
    <div className="app-shell">
      {/* TOPBAR */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h10M4 18h16" />
              <circle cx="20" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="brand-title">Claude Code</h1>
            <span className="brand-subtitle">Mastery Guide</span>
          </div>
        </div>

        <nav className="topbar-nav">
          <Link href="/" className="nav-link active">Dashboard</Link>
          <Link href="/prompt-maestro" className="nav-link">Prompt Maestro</Link>
          <Link href="/playground" className="nav-link">Playground</Link>
        </nav>
      </header>

      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-group">
            <h3 className="sidebar-title">Niveles</h3>
            <button
              className={`sidebar-filter ${!selectedLevel ? 'active' : ''}`}
              onClick={() => setSelectedLevel(null)}
            >
              Todos
            </button>
            {[1, 2, 3].map(level => (
              <button
                key={level}
                className={`sidebar-filter level-${level} ${selectedLevel === level ? 'active' : ''}`}
                onClick={() => setSelectedLevel(level)}
              >
                Nivel {level}
              </button>
            ))}
          </div>

          <div className="sidebar-group">
            <h3 className="sidebar-title">Aprendizaje</h3>
            <ul className="sidebar-links">
              {[1, 2, 3].map(level => (
                <li key={level}>
                  <a href={`#nivel-${level}`} className="sidebar-link">
                    {LESSONS_DATA[level].title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-group">
            <h3 className="sidebar-title">Recursos</h3>
            <ul className="sidebar-links">
              <li><a href="#hooks" className="sidebar-link">🪝 Hooks</a></li>
              <li><a href="#cli-flags" className="sidebar-link">🚀 CLI Flags</a></li>
              <li><a href="#scenarios" className="sidebar-link">▶ Escenarios</a></li>
            </ul>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {/* SEARCH BAR */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Busca comandos, ej: /init, claude mcp, hooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* HERO SECTION */}
          {!searchQuery && (
            <section className="hero">
              <h2>Claude Code Mastery</h2>
              <p>La guía interactiva para dominar comandos, MCP, Skills y Hooks</p>
              <div className="hero-cta">
                <Link href="#nivel-1" className="btn btn-primary">
                  Comenzar Nivel 1
                </Link>
                <Link href="/prompt-maestro" className="btn btn-secondary">
                  Prompt Maestro
                </Link>
              </div>
            </section>
          )}

          {/* RESULTADOS DE BÚSQUEDA */}
          {searchQuery && (
            <div className="search-results">
              <p className="results-count">
                {filteredCommands.length} resultado{filteredCommands.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* TABLA DE COMANDOS */}
          <section className="commands-section">
            <h3 className="section-title">
              {selectedLevel ? `Nivel ${selectedLevel}` : 'Todos los Comandos'}
            </h3>
            <div className="commands-grid">
              {filteredCommands.map((cmd, idx) => (
                <CommandCard key={idx} command={cmd} />
              ))}
            </div>
            {filteredCommands.length === 0 && (
              <div className="empty-state">
                <p>No se encontraron comandos</p>
                <button onClick={() => { setSearchQuery(''); setSelectedLevel(null); }} className="btn btn-secondary">
                  Limpiar filtros
                </button>
              </div>
            )}
          </section>

          {/* SECCIÓN HOOKS */}
          <section id="hooks" className="feature-section">
            <h2>🪝 Hooks — Automatización de Eventos</h2>
            <p>Configura comandos shell que se ejecutan automáticamente en momentos clave del ciclo de vida.</p>
            <div className="hooks-examples">
              <div className="hook-card">
                <h4>after-tool-execution</h4>
                <p>Se ejecuta después de que una herramienta termina</p>
                <pre><code>{`#!/bin/bash
if [ $1 -gt 10000ms ]; then
  notify-send "Tarea completada"
fi`}</code></pre>
              </div>
              <div className="hook-card">
                <h4>on-file-save</h4>
                <p>Se ejecuta cuando un archivo es guardado</p>
                <pre><code>{`#!/bin/bash
prettier --write $FILE
eslint --fix $FILE`}</code></pre>
              </div>
            </div>
          </section>

          {/* SECCIÓN ESCENARIOS */}
          <section id="scenarios" className="feature-section">
            <h2>▶ Escenarios Interactivos</h2>
            <p>Ejemplos prácticos de flujos comunes con Claude Code</p>
            <div className="scenarios-list">
              {Object.entries(SCENARIOS).map(([key, scenario]) => (
                <TerminalSimulator key={key} scenario={scenario} title={key} />
              ))}
            </div>
          </section>

          {/* NIVELES DE APRENDIZAJE */}
          {[1, 2, 3].map(level => (
            <section key={level} id={`nivel-${level}`} className="lesson-section">
              <div className={`lesson-header level-${level}`}>
                <span className="level-badge">Nivel {level}</span>
                <h2>{LESSONS_DATA[level].title}</h2>
              </div>
              <p className="lesson-subtitle">
                Tiempo estimado: {LESSONS_DATA[level].estimatedTime}
              </p>
              <div className="lesson-objectives">
                <h4>Objetivos</h4>
                <ul>
                  {LESSONS_DATA[level].objectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </div>
              <div className="lesson-tools">
                <h4>Herramientas</h4>
                <div className="tools-grid">
                  {LESSONS_DATA[level].tools.map((tool, idx) => (
                    <span key={idx} className="tool-badge">{tool}</span>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}

// Componente CommandCard
function CommandCard({ command }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`command-card level-${command.level}`}>
      <div className="command-header" onClick={() => setExpanded(!expanded)}>
        <code className="command-name">{command.cmd}</code>
        <span className={`command-level level-${command.level}`}>Nivel {command.level}</span>
        <span className="command-category">{command.category}</span>
      </div>
      <p className="command-desc">{command.desc}</p>
      {expanded && command.examples && (
        <div className="command-examples">
          {command.examples.map((ex, idx) => (
            <div key={idx} className="example">
              <code>{ex.input}</code>
              <p>{ex.desc}</p>
            </div>
          ))}
        </div>
      )}
      <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
        {expanded ? '▼ Ocultar' : '▶ Ver ejemplos'}
      </button>
    </div>
  )
}

// Componente TerminalSimulator
function TerminalSimulator({ scenario, title }) {
  return (
    <div className="terminal-simulator">
      <div className="terminal-header">{title}</div>
      <div className="terminal-content">
        {scenario.map((line, idx) => (
          <div key={idx} className={`terminal-line ${line.type}`}>
            {line.type === 'prompt' && <span className="prompt">$ </span>}
            <span>{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
