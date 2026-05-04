import fs from 'fs'
import path from 'path'

export function getBodyHTML() {
  const filePath = path.join(process.cwd(), 'public', 'index.html')
  const content = fs.readFileSync(filePath, 'utf-8')
  const match = content.match(/<body[^>]*>([\s\S]*?)<\/body>/)
  return match ? match[1] : ''
}
