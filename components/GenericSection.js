'use client'

import { SECTION_CONTENT } from '@/lib/sectionsData'

export default function GenericSection({ sectionId }) {
  const content = SECTION_CONTENT[sectionId] || {
    title: 'Sección',
    lead: 'Contenido en construcción...'
  }

  return (
    <section className="content-section">
      <div className="dashboard-header">
        <h1>{content.title}</h1>
        <p className="subtitle">{content.lead}</p>
      </div>

      <div style={{
        padding: '32px',
        background: 'var(--bg-secondary)',
        borderRadius: '8px',
        border: '1px solid var(--border-default)',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        <p>📝 <strong>Contenido en construcción</strong></p>
        <p style={{ fontSize: '13px', marginTop: '8px' }}>
          Esta sección está siendo migrada desde el proyecto original. Vuelve pronto.
        </p>
      </div>
    </section>
  )
}
