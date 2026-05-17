'use client'

import { useState } from 'react'

const SYNTAX_RULES = {
  bash: [
    { re: /\$\s+\w+/g, cls: 'tok-keyword' },
    { re: /^#.*/gm, cls: 'tok-comment' },
    { re: /['"][^'"]*['"]/g, cls: 'tok-string' },
    { re: /\||\&\&|>|</g, cls: 'tok-operator' },
  ],
  json: [
    { re: /"[^"]*":/g, cls: 'tok-key' },
    { re: /:\s*"[^"]*"/g, cls: 'tok-string' },
    { re: /:\s*\d+/g, cls: 'tok-number' },
    { re: /:\s*(true|false|null)/g, cls: 'tok-keyword' },
  ],
  typescript: [
    { re: /\b(const|let|var|function|interface|type|class|export|import|async|await)\b/g, cls: 'tok-keyword' },
    { re: /\/\/.*/g, cls: 'tok-comment' },
    { re: /['"][^'"]*['"]/g, cls: 'tok-string' },
    { re: /`[^`]*`/g, cls: 'tok-template' },
    { re: /\b\d+\b/g, cls: 'tok-number' },
  ],
  text: [],
}

export default function CodeBlock({ lang = 'bash', code, title, copyable = true }) {
  const [copied, setCopied] = useState(false)

  const highlightCode = (text, language) => {
    let highlighted = text
    const rules = SYNTAX_RULES[language] || []

    rules.forEach(rule => {
      highlighted = highlighted.replace(rule.re, (match) =>
        `<span class="${rule.cls}">${match}</span>`
      )
    })

    return highlighted
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`code-block code-block--${lang}`}>
      {title && <div className="code-block-title">{title}</div>}
      <div style={{ position: 'relative' }}>
        <pre>
          <code
            dangerouslySetInnerHTML={{
              __html: highlightCode(code, lang),
            }}
          />
        </pre>
        {copyable && (
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              padding: '4px 8px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {copied ? '✓ Copiado' : '📋 Copiar'}
          </button>
        )}
      </div>
    </div>
  )
}
