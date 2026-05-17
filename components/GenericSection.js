'use client'

import { ALL_SECTIONS_CONTENT } from '@/lib/allSectionsContent'
import SectionRenderer from './SectionRenderer'

export default function GenericSection({ sectionId }) {
  const sectionData = ALL_SECTIONS_CONTENT[sectionId]

  if (!sectionData) {
    return (
      <section className="content-section">
        <div className="dashboard-header">
          <h1>Sección no encontrada</h1>
          <p className="subtitle">Lo sentimos, esta sección no existe.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="content-section">
      <div className="dashboard-header">
        {sectionData.breadcrumb && <span className="breadcrumb">{sectionData.breadcrumb}</span>}
        <h1>{sectionData.title}</h1>
        {sectionData.lead && <p className="subtitle">{sectionData.lead}</p>}
      </div>

      {sectionData.content && sectionData.content.length > 0 ? (
        <SectionRenderer content={sectionData.content} />
      ) : (
        <div style={{
          padding: '32px',
          background: 'var(--bg-secondary)',
          borderRadius: '8px',
          border: '1px solid var(--border-default)',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <p>📝 <strong>Sección vacía</strong></p>
        </div>
      )}
    </section>
  )
}
