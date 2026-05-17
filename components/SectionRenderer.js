'use client'

import CodeBlock from './CodeBlock'
import Card from './Card'
import InfoBanner from './InfoBanner'

const StatsCard = ({ label, value, subtitle }) => (
  <div style={{
    padding: '16px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: '8px',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '8px' }}>{value}</div>
    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</div>
    {subtitle && <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{subtitle}</div>}
  </div>
)

const PathCard = ({ level, title, description, tag, link }) => (
  <div
    onClick={() => window.location.href = `?section=${link}`}
    style={{
      padding: '20px',
      background: 'var(--bg-secondary)',
      border: '2px solid var(--border-default)',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--accent-primary)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-default)'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
  >
    <div style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 'bold', marginBottom: '8px' }}>{level}</div>
    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>{title}</div>
    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{description}</div>
  </div>
)

const ContentTypeMap = {
  heading: ({ level = 2, text }) => {
    const Tag = `h${level}`
    return <Tag style={{ marginTop: '24px', marginBottom: '12px' }}>{text}</Tag>
  },

  paragraph: ({ text }) => (
    <p style={{ marginBottom: '12px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{text}</p>
  ),

  'code-block': ({ lang, code, title }) => (
    <CodeBlock lang={lang} code={code} title={title} />
  ),

  list: ({ items = [], ordered = false }) => {
    const Tag = ordered ? 'ol' : 'ul'
    return (
      <Tag style={{ marginLeft: '20px', marginBottom: '12px' }}>
        {Array.isArray(items) && items.map((item, idx) => (
          <li key={idx} style={{ marginBottom: '6px', color: 'var(--text-secondary)' }}>
            {item}
          </li>
        ))}
      </Tag>
    )
  },

  table: ({ headers = [], rows = [] }) => (
    <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid var(--border-default)',
        borderRadius: '8px'
      }}>
        <thead style={{ background: 'var(--bg-tertiary)' }}>
          <tr>
            {Array.isArray(headers) && headers.map((h, i) => (
              <th key={i} style={{
                padding: '12px',
                textAlign: 'left',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                borderBottom: '1px solid var(--border-default)'
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(rows) && rows.map((row, rowIdx) => (
            <tr key={rowIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {(Array.isArray(row) ? row : Object.values(row)).map((cell, cellIdx) => (
                <td key={cellIdx} style={{
                  padding: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),

  'info-banner': ({ type, title, text }) => (
    <InfoBanner type={type} title={title} text={text} />
  ),

  'info-box': ({ type, title, text }) => (
    <InfoBanner type={type || 'info'} title={title} text={text} />
  ),

  card: (props) => <Card {...props} />,

  grid: ({ columns = 3, items = [] }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
      gap: '16px',
      marginBottom: '24px'
    }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <Card key={idx} {...item} />
      ))}
    </div>
  ),

  'stats-grid': ({ items = [] }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <StatsCard key={idx} {...item} />
      ))}
    </div>
  ),

  'course-stats': ({ items = [] }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <StatsCard key={idx} {...item} />
      ))}
    </div>
  ),

  'stats': ({ items = [] }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <StatsCard key={idx} {...item} />
      ))}
    </div>
  ),

  'path-cards': ({ items = [] }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <PathCard key={idx} {...item} />
      ))}
    </div>
  ),

  'flow-card': ({ items = [] }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <Card key={idx} {...item} />
      ))}
    </div>
  ),

  'mcp-card': ({ items = [] }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <Card key={idx} {...item} />
      ))}
    </div>
  ),

  'hook-card': ({ items = [] }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <Card key={idx} {...item} />
      ))}
    </div>
  ),

  'workflow-card': ({ items = [] }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <Card key={idx} {...item} />
      ))}
    </div>
  ),

  'orchestration-card': ({ items = [] }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <Card key={idx} {...item} />
      ))}
    </div>
  ),

  'pattern-cards': ({ items = [] }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <Card key={idx} {...item} />
      ))}
    </div>
  ),

  'cheatsheet': ({ items = [] }) => (
    <div style={{ marginBottom: '24px' }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <div key={idx} style={{
          padding: '12px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: '4px',
          marginBottom: '8px',
          fontSize: '13px'
        }}>
          {item}
        </div>
      ))}
    </div>
  ),

  'checklist': ({ items = [] }) => (
    <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <li key={idx} style={{ marginBottom: '6px', color: 'var(--text-secondary)' }}>
          ☐ {item}
        </li>
      ))}
    </ul>
  ),

  'course-tips': ({ items = [] }) => (
    <div style={{ marginBottom: '24px' }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <div key={idx} style={{
          padding: '12px',
          background: 'rgba(74, 222, 128, 0.1)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          borderRadius: '4px',
          marginBottom: '8px',
          color: 'var(--text-secondary)'
        }}>
          💡 {item}
        </div>
      ))}
    </div>
  ),

  'sprint': ({ title = '', items = [] }) => (
    <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
      {title && <h4 style={{ marginBottom: '12px' }}>{title}</h4>}
      {Array.isArray(items) && items.map((item, idx) => (
        <div key={idx} style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>• {item}</div>
      ))}
    </div>
  ),

  'comparison-table': ({ headers = [], rows = [] }) => (
    <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid var(--border-default)'
      }}>
        <thead style={{ background: 'var(--bg-tertiary)' }}>
          <tr>
            {Array.isArray(headers) && headers.map((h, i) => (
              <th key={i} style={{
                padding: '12px',
                textAlign: 'left',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                borderBottom: '1px solid var(--border-default)'
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(rows) && rows.map((row, rowIdx) => (
            <tr key={rowIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {(Array.isArray(row) ? row : Object.values(row)).map((cell, cellIdx) => (
                <td key={cellIdx} style={{
                  padding: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),

  'comparison-grid': ({ items = [] }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <Card key={idx} {...item} />
      ))}
    </div>
  ),

  'roadmap': ({ items = [] }) => (
    <div style={{ marginBottom: '24px' }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <div key={idx} style={{
          padding: '16px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: '8px',
          marginBottom: '12px'
        }}>
          {item.title && <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{item.title}</div>}
          {item.description && <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.description}</div>}
        </div>
      ))}
    </div>
  ),

  'filters': ({ items = [] }) => (
    <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <button key={idx} style={{
          padding: '8px 12px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          transition: 'all 0.2s'
        }}>
          {item}
        </button>
      ))}
    </div>
  ),

  'memory-commands': ({ items = [] }) => (
    <div style={{ marginBottom: '24px' }}>
      {Array.isArray(items) && items.map((item, idx) => (
        <div key={idx} style={{
          padding: '12px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: '4px',
          marginBottom: '8px',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          {item}
        </div>
      ))}
    </div>
  ),

  divider: () => (
    <hr style={{
      border: 'none',
      borderTop: '1px solid var(--border-subtle)',
      margin: '32px 0'
    }} />
  ),

  'custom-html': ({ html }) => (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  ),

  'spacer': ({ height = 24 }) => <div style={{ height: `${height}px` }} />,
}

export default function SectionRenderer({ content = [] }) {
  return (
    <div>
      {content.map((item, idx) => {
        const Component = ContentTypeMap[item.type]
        if (!Component) {
          console.warn(`Unknown content type: ${item.type}`)
          return null
        }
        return <div key={idx}>{Component(item)}</div>
      })}
    </div>
  )
}
