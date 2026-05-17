'use client'

import CodeBlock from './CodeBlock'
import Card from './Card'
import InfoBanner from './InfoBanner'

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

  list: ({ items, ordered = false }) => {
    const Tag = ordered ? 'ol' : 'ul'
    return (
      <Tag style={{ marginLeft: '20px', marginBottom: '12px' }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ marginBottom: '6px', color: 'var(--text-secondary)' }}>
            {item}
          </li>
        ))}
      </Tag>
    )
  },

  table: ({ headers, rows }) => (
    <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid var(--border-default)',
        borderRadius: '8px'
      }}>
        <thead style={{ background: 'var(--bg-tertiary)' }}>
          <tr>
            {headers.map((h, i) => (
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
          {rows.map((row, rowIdx) => (
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

  card: (props) => <Card {...props} />,

  grid: ({ columns = 3, items }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
      gap: '16px',
      marginBottom: '24px'
    }}>
      {items.map((item, idx) => (
        <Card key={idx} {...item} />
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
