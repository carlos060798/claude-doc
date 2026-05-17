'use client'

import { useState, useMemo } from 'react'
import { COMMANDS_DATA } from '@/lib/commandsData'
import { SECTIONS_CONFIG } from '@/lib/sectionsData'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import CourseSection from '@/components/CourseSection'
import ChallengesSection from '@/components/ChallengesSection'
import CommandsTable from '@/components/CommandsTable'
import GenericSection from '@/components/GenericSection'

export default function Home() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [mode, setMode] = useState('technical')

  const levelCommands = useMemo(() => {
    const level = parseInt(activeSection.split('-')[1])
    if (isNaN(level)) return []
    return COMMANDS_DATA.filter(cmd => cmd.level === level)
  }, [activeSection])

  const isLevelSection = activeSection.startsWith('nivel-')

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} mode={mode} />
      <main className="main-content">
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'curso' && <CourseSection />}
        {activeSection === 'desafios' && <ChallengesSection />}

        {isLevelSection && (
          <section className="content-section">
            <div className="dashboard-header">
              <h1>
                {activeSection === 'nivel-1' && 'Nivel 1 — Fundamentos'}
                {activeSection === 'nivel-2' && 'Nivel 2 — Avanzado (MCP)'}
                {activeSection === 'nivel-3' && 'Nivel 3 — Experto (Skills)'}
                {activeSection === 'nivel-4' && 'Nivel 4 — Maestría Práctica'}
              </h1>
              <p className="subtitle">Domina los comandos y herramientas esenciales de Claude Code.</p>
            </div>
            <div className="commands-section">
              <h2>Comandos ({levelCommands.length})</h2>
              <CommandsTable commands={levelCommands} />
            </div>
          </section>
        )}

        {!['dashboard', 'curso', 'desafios'].includes(activeSection) && !isLevelSection && (
          <GenericSection sectionId={activeSection} />
        )}
      </main>
    </div>
  )
}
