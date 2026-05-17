'use client'

import { ALL_SECTIONS_CONTENT } from '@/lib/allSectionsContent'
import SectionRenderer from './SectionRenderer'

export default function CourseSection() {
  const section = ALL_SECTIONS_CONTENT.curso

  if (!section) {
    return (
      <section className="content-section">
        <h1>Curso Interactivo</h1>
        <p>Sección no encontrada</p>
      </section>
    )
  }

  return (
    <section className="content-section">
      <div className="dashboard-header">
        <h1>{section.title}</h1>
        <p className="subtitle">{section.lead}</p>
      </div>
      <SectionRenderer content={section.content} />
    </section>
  )
}
