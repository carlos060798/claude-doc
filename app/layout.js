import './globals.css'

export const metadata = {
  title: 'Claude Code Mastery — Guía Interactiva',
  description: 'Guía interactiva para dominar Claude Code: desde la instalación hasta la creación de Skills y MCP avanzados.',
  charset: 'utf-8',
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
