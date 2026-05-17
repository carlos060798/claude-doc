'use client'

import { useState, useMemo } from 'react'
import { COMMANDS_DATA } from '@/lib/commandsData'

export default function SearchCommand({ onSelectCommand }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return COMMANDS_DATA.filter(cmd =>
      cmd.cmd.toLowerCase().includes(q) ||
      cmd.desc.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    ).slice(0, 10)
  }, [query])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        placeholder="🔍 Busca comandos... (Ctrl+K)"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        style={{
          width: '100%',
          padding: '8px 12px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: '6px',
          color: 'var(--text-primary)',
          fontSize: '14px',
          outline: 'none'
        }}
      />

      {isOpen && filtered.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: '6px',
          zIndex: 1000,
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {filtered.map((cmd) => (
            <div
              key={cmd.id || cmd.cmd}
              onClick={() => {
                onSelectCommand(cmd)
                setQuery('')
                setIsOpen(false)
              }}
              style={{
                padding: '10px 12px',
                borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                cursor: 'pointer',
                ':hover': { background: 'var(--bg-tertiary)' }
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <div style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: '13px' }}>
                {cmd.cmd}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {cmd.desc}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
