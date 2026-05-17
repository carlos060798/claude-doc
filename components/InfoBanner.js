'use client'

const iconMap = {
  tip: '💡',
  warn: '⚠️',
  error: '❌',
  info: 'ℹ️',
  success: '✅',
}

const colorMap = {
  tip: { bg: 'rgba(74, 222, 128, 0.1)', border: '#4ade80', text: '#86efac' },
  warn: { bg: 'rgba(251, 191, 36, 0.1)', border: '#fbbf24', text: '#fcd34d' },
  error: { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', text: '#fca5a5' },
  info: { bg: 'rgba(74, 158, 255, 0.1)', border: '#4a9eff', text: '#93c5fd' },
  success: { bg: 'rgba(74, 222, 128, 0.1)', border: '#4ade80', text: '#86efac' },
}

export default function InfoBanner({ type = 'info', title, text, children }) {
  const color = colorMap[type] || colorMap.info

  return (
    <div style={{
      background: color.bg,
      border: `1px solid ${color.border}`,
      borderRadius: '8px',
      padding: '16px',
      marginTop: '24px',
      marginBottom: '24px',
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '20px', flexShrink: 0 }}>{iconMap[type]}</span>
        <div>
          {title && <strong style={{ color: 'var(--text-primary)' }}>{title}</strong>}
          {text && <p style={{ color: 'var(--text-secondary)', marginTop: title ? '4px' : 0 }}>{text}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}
