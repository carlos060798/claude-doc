'use client'

export default function Card({
  variant = 'default',
  title,
  description,
  icon,
  badge,
  onClick,
  href,
  children,
  className = '',
}) {
  const baseStyles = {
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid var(--border-default)',
    background: 'var(--bg-secondary)',
    cursor: onClick || href ? 'pointer' : 'default',
    transition: 'all var(--transition-fast)',
  }

  const variantStyles = {
    path: {
      ...baseStyles,
      padding: '24px',
      borderColor: 'var(--border-subtle)',
      background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
      '&:hover': {
        borderColor: 'var(--accent-primary)',
        background: 'var(--bg-tertiary)',
        transform: 'translateY(-2px)',
      }
    },
    stat: {
      ...baseStyles,
      textAlign: 'center',
      padding: '20px',
    },
    skill: {
      ...baseStyles,
      padding: '20px',
    },
  }

  const style = variantStyles[variant] || baseStyles

  const handleClick = () => {
    if (href) window.location.hash = href
    if (onClick) onClick()
  }

  return (
    <div onClick={handleClick} style={style} className={className}>
      {icon && <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>}
      {title && <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>{title}</h3>}
      {description && <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '14px' }}>{description}</p>}
      {badge && <span style={{ marginTop: '8px', display: 'inline-block', fontSize: '12px', background: 'var(--accent-primary)', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>{badge}</span>}
      {children}
    </div>
  )
}
