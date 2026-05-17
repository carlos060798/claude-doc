import './globals.css'

export const metadata = {
  title: 'Claude Code Mastery',
  description: 'Aprende Claude Code desde fundamentos hasta skills avanzados. Guía interactiva con ejemplos prácticos.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
