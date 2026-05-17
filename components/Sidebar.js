'use client'

import { useMemo } from 'react'
import { SECTIONS_CONFIG } from '@/lib/sectionsData'

export default function Sidebar({ activeSection, setActiveSection, mode = 'technical' }) {
  const groupedSections = useMemo(() => {
    const groups = {}
    SECTIONS_CONFIG.forEach(section => {
      if (section.hidden && mode !== section.mode && section.mode !== 'both') return
      if (section.mode !== 'both' && section.mode !== mode) return

      if (!groups[section.group]) groups[section.group] = []
      groups[section.group].push(section)
    })
    return groups
  }, [mode])

  return (
    <aside className="sidebar" aria-label="Navegación principal">
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

      <nav style={{ overflowY: 'auto', flex: 1 }}>
        {Object.entries(groupedSections).map(([group, sections]) => (
          <div key={group}>
            <p className="nav-group-title">{group}</p>
            <ul className="nav-list">
              {sections.map(section => (
                <li key={section.id}>
                  <button
                    className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(section.id)}
                    title={section.label}
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

      <div className="sidebar-footer" style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-muted)' }}>
        <span>Documentación oficial · v2.x</span>
      </div>
    </aside>
  )
}
