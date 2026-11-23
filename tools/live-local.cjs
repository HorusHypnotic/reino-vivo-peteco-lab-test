'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PETECO_LIVE_PORT || 8787);
const host = '127.0.0.1';
const address = `${host}:${port}`;
const contentTypes = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp'};

http.createServer((request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Content-Security-Policy', "frame-ancestors 'none'; base-uri 'self'");
  response.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  response.setHeader('Cache-Control', 'no-store');
  const crossSite = request.headers['sec-fetch-site'] === 'cross-site';
  const directNavigation = request.headers['sec-fetch-mode'] === 'navigate'
    && request.headers['sec-fetch-dest'] === 'document' && request.headers['sec-fetch-user'] === '?1';
  if (request.headers.host !== address || (crossSite && !directNavigation)
      || !['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(403).end();
    return;
  }

  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, `http://${address}`).pathname); }
  catch { response.writeHead(400).end(); return; }
  if (pathname === '/admin') {
    response.writeHead(302, {Location: '/admin/'}).end();
    return;
  }
  const mode = pathname === '/admin/' || pathname === '/admin/index.html' ? 'direction'
    : pathname === '/' || pathname === '/index.html' ? 'projection' : null;
  const file = mode ? path.join(root, 'index.html') : path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep) || pathname.split('/').some(segment => segment.startsWith('.'))
      || (!mode && path.extname(file) === '.html')
      || !Object.hasOwn(contentTypes, path.extname(file))) {
    response.writeHead(404).end();
    return;
  }
  try {
    let body = fs.readFileSync(file);
    if (mode) {
      body = body.toString().replace('<html lang="pt-BR">', `<html lang="pt-BR" data-local-view="${mode}">`)
        .replace('<head>', '<head><base href="/">');
    }
    response.writeHead(200, {'Content-Type': contentTypes[path.extname(file)]});
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404).end();
  }
}).listen(port, host, () => {
  console.log(`LIVE  http://${address}/\nADMIN http://${address}/admin/`);
});
