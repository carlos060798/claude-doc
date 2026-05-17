const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8765;

const server = http.createServer((req, res) => {
  // Servir archivos estáticos
  let filePath = path.join(__dirname, req.url);

  // Si es un directorio, servir index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Tipos MIME
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      console.log(`[404] ${req.url}`);
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
    console.log(`[200] ${req.url}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
