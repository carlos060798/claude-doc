'use client'

import { useState, useEffect } from 'react'

export default function TerminalSimulator({ lines = [] }) {
  const [displayedLines, setDisplayedLines] = useState([])

  useEffect(() => {
    let currentLine = 0
    let totalDelay = 0

    const timeouts = lines.map((line, idx) => {
      totalDelay += line.delay || 200
      return setTimeout(() => {
        setDisplayedLines(prev => [...prev, { ...line, id: idx }])
      }, totalDelay)
    })

    return () => timeouts.forEach(t => clearTimeout(t))
  }, [lines])

  const getLineStyle = (type) => {
    const styles = {
      prompt: { color: '#4ade80', fontWeight: 'bold' },
      user: { color: 'var(--text-primary)' },
      output: { color: 'var(--text-secondary)' },
      success: { color: '#4ade80' },
      error: { color: '#ef4444' },
      warning: { color: '#fbbf24' },
      comment: { color: '#707080', fontStyle: 'italic' },
      info: { color: '#4a9eff' },
    }
    return styles[type] || styles.output
  }

  return (
    <div style={{
      background: '#0f0f12',
      border: '1px solid var(--border-default)',
      borderRadius: '8px',
      padding: '16px',
      fontFamily: 'Menlo, Monaco, Courier New, monospace',
      fontSize: '13px',
      lineHeight: 1.6,
      overflowX: 'auto',
      marginBottom: '24px',
    }}>
      {displayedLines.map(line => (
        <div key={line.id} style={getLineStyle(line.type)}>
          {line.type === 'prompt' && '$ '}
          {line.text}
        </div>
      ))}
      {displayedLines.length < lines.length && (
        <div style={{ color: '#4ade80', animation: 'blink 1s infinite' }}>█</div>
      )}
    </div>
  )
}
