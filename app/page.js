'use client'

import { useState } from 'react'
import { SECTIONS, GIT_WORKFLOWS, MCP_SERVERS, HOOKS_PRODUCTION, MULTI_MCP_ORCHESTRATION, COMMANDS_DATA, LESSONS_DATA, SCENARIOS } from '@/lib/data'
import './globals.css'

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(null)

  const filteredCommands = COMMANDS_DATA.filter(cmd => {
    const matchesSearch = cmd.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cmd.desc.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = !selectedLevel || cmd.level === parseInt(selectedLevel)
    return matchesSearch && matchesLevel
  })

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId)
    setSearchQuery('')
  }

  const groupedSections = {}
  SECTIONS.forEach(section => {
    if (!groupedSections[section.group]) {
      groupedSections[section.group] = []
    }
    groupedSections[section.group].push(section)
  })

  return (
    <div className="app-shell">
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
      </header>

      <div className="main-wrapper">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <nav>
            {Object.entries(groupedSections).map(([group, sections]) => (
              <div key={group}>
                <p className="nav-group-title">{group}</p>
                <ul className="nav-list">
                  {sections.map(section => (
                    <li key={section.id}>
                      <button
                        className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
                        onClick={() => handleSectionClick(section.id)}
                      >
                        <span className="nav-icon">{section.icon}</span>
                        {section.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {/* DASHBOARD */}
          {activeSection === 'dashboard' && (
            <section className="content-section active">
              <div className="dashboard-header">
                <h1>Claude Code Mastery</h1>
                <p className="subtitle">La guía interactiva para dominar Claude Code desde fundamentos hasta producción avanzada.</p>
              </div>

              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Busca comandos... ej: /compact, mcp, git, hooks"
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="level-filters">
                <button
                  className={`filter-btn ${!selectedLevel ? 'active' : ''}`}
                  onClick={() => setSelectedLevel(null)}
                >
                  Todos
                </button>
                {[1, 2, 3, 4].map(level => (
                  <button
                    key={level}
                    className={`filter-btn ${selectedLevel === level ? 'active' : ''}`}
                    onClick={() => setSelectedLevel(level)}
                  >
                    Nivel {level}
                  </button>
                ))}
              </div>

              <div className="commands-section">
                <h2>Comandos Disponibles ({filteredCommands.length})</h2>
                <div className="commands-grid">
                  {filteredCommands.map((cmd, idx) => (
                    <CommandCard key={idx} command={cmd} />
                  ))}
                </div>
              </div>

              <div className="quick-start">
                <h2>Primeros Pasos</h2>
                <div className="quick-start-cards">
                  <div className="card">
                    <h3>📦 Instalar</h3>
                    <code>npm install -g @anthropic-ai/claude-code</code>
                  </div>
                  <div className="card">
                    <h3>🚀 Iniciar sesión</h3>
                    <code>claude</code>
                  </div>
                  <div className="card">
                    <h3>❓ Obtener ayuda</h3>
                    <code>/help</code>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* GIT WORKFLOWS */}
          {activeSection === 'git-workflows' && (
            <section className="content-section active">
              <h2>{GIT_WORKFLOWS.title}</h2>
              <p className="section-intro">{GIT_WORKFLOWS.intro}</p>

              {GIT_WORKFLOWS.workflows.map((workflow, idx) => (
                <article key={idx} className="card workflow-card">
                  <h3>{workflow.title}</h3>
                  <p className="badge-small">{workflow.badge}</p>
                  <div className="info-block">
                    <strong>¿Cuándo usar?</strong>
                    <ul>
                      {workflow.when.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="code-example">
                    <strong>Workflow típico:</strong>
                    <pre><code>{workflow.code}</code></pre>
                  </div>
                  <div className="pros-cons">
                    <div className="pros">
                      <strong>✓ Ventajas:</strong>
                      <ul>
                        {workflow.pros.map((pro, i) => (
                          <li key={i}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="cons">
                      <strong>✗ Desventajas:</strong>
                      <ul>
                        {workflow.cons.map((con, i) => (
                          <li key={i}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}

              <article className="card">
                <h3>Tabla Comparativa: ¿Cuál elegir?</h3>
                <div className="responsive-table">
                  <table>
                    <thead>
                      <tr>
                        {GIT_WORKFLOWS.comparison.headers.map((header, i) => (
                          <th key={i}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {GIT_WORKFLOWS.comparison.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}><strong>{j === 0 ? cell : cell}</strong></td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
          )}

          {/* MCP SERVERS */}
          {activeSection === 'mcp-use-cases' && (
            <section className="content-section active">
              <h2>{MCP_SERVERS.title}</h2>
              <p className="section-intro">{MCP_SERVERS.intro}</p>

              {MCP_SERVERS.servers.map((server, idx) => (
                <article key={idx} className="card mcp-card">
                  <h3>{server.title}</h3>
                  <p className="badge-small">{server.badge}</p>
                  <div className="info-block">
                    <strong>¿Por qué?</strong>
                    <ul>
                      {server.why.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="code-example">
                    <strong>Setup (copy-paste):</strong>
                    <pre><code>{server.setup}</code></pre>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* HOOKS */}
          {activeSection === 'hooks-production' && (
            <section className="content-section active">
              <h2>{HOOKS_PRODUCTION.title}</h2>
              <p className="section-intro">{HOOKS_PRODUCTION.intro}</p>

              {HOOKS_PRODUCTION.hooks.map((hook, idx) => (
                <article key={idx} className="card hook-card">
                  <h3>{hook.title}</h3>
                  <p className="description">{hook.description}</p>
                  <div className="code-example">
                    <strong>Configuración:</strong>
                    <pre><code>{hook.config}</code></pre>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* MULTI-MCP ORCHESTRATION */}
          {activeSection === 'multi-mcp-orchestration' && (
            <section className="content-section active">
              <h2>{MULTI_MCP_ORCHESTRATION.title}</h2>
              <p className="section-intro">{MULTI_MCP_ORCHESTRATION.intro}</p>

              {MULTI_MCP_ORCHESTRATION.patterns.map((pattern, idx) => (
                <article key={idx} className="card orchestration-card">
                  <h3>{pattern.title}</h3>
                  <p className="description">{pattern.description}</p>
                  <div className="diagram-block">
                    <pre>{pattern.diagram}</pre>
                  </div>
                </article>
              ))}

              <article className="card">
                <h3>Recomendaciones por Tamaño de Equipo</h3>
                <div className="responsive-table">
                  <table>
                    <thead>
                      <tr>
                        {MULTI_MCP_ORCHESTRATION.recommendations.headers.map((header, i) => (
                          <th key={i}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MULTI_MCP_ORCHESTRATION.recommendations.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}><strong>{j === 0 ? cell : cell}</strong></td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

function CommandCard({ command }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`command-card level-${command.level}`}>
      <div className="command-header" onClick={() => setExpanded(!expanded)}>
        <code className="command-name">{command.cmd}</code>
        <span className={`command-level level-${command.level}`}>Nivel {command.level}</span>
      </div>
      <p className="command-desc">{command.desc}</p>
      {expanded && (
        <div className="command-example">
          <strong>Ejemplo:</strong>
          <code>{command.example}</code>
        </div>
      )}
      <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
        {expanded ? '▼ Ocultar' : '▶ Ver ejemplo'}
      </button>
    </div>
  )
}
