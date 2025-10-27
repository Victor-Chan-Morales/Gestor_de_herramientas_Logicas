const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5500;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.br': 'application/octet-stream'
};

const server = http.createServer((req, res) => {
  // Decodificar la URL para manejar espacios (%20) correctamente
  let decodedUrl = decodeURIComponent(req.url);
  let filePath = '.' + decodedUrl;
  if (filePath === './') filePath = './index.html';

  console.log(`Solicitud: ${req.url} -> Archivo: ${filePath}`);

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Manejar archivos .br con Content-Encoding
  let actualPath = filePath;
  let isBrotli = false;
  
  if (filePath.endsWith('.br')) {
    isBrotli = true;
    // Detectar el tipo real del archivo
    if (filePath.includes('.js.br')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.includes('.wasm.br')) {
      res.setHeader('Content-Type', 'application/wasm');
    } else if (filePath.includes('.data.br')) {
      res.setHeader('Content-Type', 'application/octet-stream');
    }
    res.setHeader('Content-Encoding', 'br');
  } else {
    res.setHeader('Content-Type', contentType);
  }

  fs.readFile(actualPath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.log(`❌ Archivo no encontrado: ${actualPath}`);
        res.writeHead(404);
        res.end('404 - File Not Found: ' + actualPath);
      } else {
        console.log(`❌ Error: ${error.code} - ${actualPath}`);
        res.writeHead(500);
        res.end('500 - Internal Server Error: ' + error.code);
      }
    } else {
      console.log(`✅ Archivo servido: ${actualPath} (${content.length} bytes)`);
      res.writeHead(200);
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/`);
  console.log(`Con soporte para archivos Brotli (.br)`);
});

