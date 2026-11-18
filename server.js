const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT) || 3000;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

const aliases = {
  '/': 'index.html',
  '/mods': 'mods.html',
  '/mods/': 'mods.html',
  '/plugins': 'plugins.html',
  '/plugins/': 'plugins.html',
};

function send(res, status, body, type) {
  res.writeHead(status, {
    'content-type': type,
    'cache-control': 'no-cache',
    'x-content-type-options': 'nosniff',
  });
  res.end(body);
}

function sendFile(res, filePath, status) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, 'Not found', 'text/plain; charset=utf-8');
      return;
    }
    const type = types[path.extname(filePath)] || 'application/octet-stream';
    send(res, status, data, type);
  });
}

function safePath(rel) {
  const filePath = path.resolve(root, rel);
  if (filePath !== root && !filePath.startsWith(root + path.sep)) return null;
  if (rel.split(/[/\\]/).includes('.git')) return null;
  return filePath;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const trimmed = pathname.slice(0, -1);
    if (aliases[pathname] === undefined) pathname = trimmed;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'Method not allowed', 'text/plain; charset=utf-8');
    return;
  }

  if (pathname === '/api/health') {
    send(res, 200, JSON.stringify({ ok: true }), 'application/json; charset=utf-8');
    return;
  }

  if (pathname === '/api/projects') {
    sendFile(res, path.join(root, 'data', 'projects.json'), 200);
    return;
  }

  const rel = aliases[pathname] || pathname.replace(/^\/+/, '');
  const filePath = safePath(rel);
  if (!filePath) {
    sendFile(res, path.join(root, '404.html'), 404);
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      sendFile(res, filePath, 200);
      return;
    }
    const indexPath = !err && stat.isDirectory()
      ? path.join(filePath, 'index.html')
      : null;
    if (indexPath) {
      fs.stat(indexPath, (indexErr, indexStat) => {
        if (!indexErr && indexStat.isFile()) {
          sendFile(res, indexPath, 200);
          return;
        }
        sendFile(res, path.join(root, '404.html'), 404);
      });
      return;
    }
    sendFile(res, path.join(root, '404.html'), 404);
  });
});

server.listen(port, () => {
  console.log(`Casual_DAViD site listening on http://localhost:${port}`);
});
