'use strict';

const {randomBytes, timingSafeEqual} = require('node:crypto');
const {execFile} = require('node:child_process');

const prefix = '/__live/';
const maxFrame = 768 * 1024;
const leaseMs = 30000;

function createRelay(origin) {
  const code = randomBytes(8).toString('hex');
  const viewers = new Set();
  const clocks = new Set();
  let author, latest, nextFrame = 0, nextClaim = 0, nextEdgeLaunch = 0;

  function authorized(value, expected) {
    const candidate = Buffer.from(value || '');
    const secret = Buffer.from('Bearer ' + expected);
    return candidate.length === secret.length && timingSafeEqual(candidate, secret);
  }

  function broadcast(clients, message) {
    for (const client of clients) {
      if (!client.writableNeedDrain) client.write(message);
    }
  }

  const clock = setInterval(() => {
    if (author && Date.now() >= author.expires) {
      author = undefined;
      latest = undefined;
    }
    broadcast(clocks, 'event: tick\ndata: ' + viewers.size + '\n\n');
  }, 100);
  clock.unref();

  function subscribe(response, clients, initial) {
    if (clients.size >= 12) return response.writeHead(503).end();
    response.writeHead(200, {'Content-Type': 'text/event-stream', Connection: 'keep-alive'});
    response.write('retry: 500\n\n' + (initial || ''));
    clients.add(response);
    response.on('close', () => clients.delete(response));
  }

  async function handle(request, response, pathname) {
    if (request.headers.origin && request.headers.origin !== origin) return response.writeHead(403).end();
    if (request.method === 'GET' && pathname === prefix + 'events') return subscribe(response, viewers, latest);
    if (request.method === 'GET' && pathname === prefix + 'clock') return subscribe(response, clocks);
    if (request.method !== 'POST' || request.headers.origin !== origin) return response.writeHead(403).end();

    const credential = request.headers.authorization;
    const now = Date.now();
    if (pathname === prefix + 'claim') {
      if (!authorized(credential, code)) {
        const status = now < nextClaim ? 429 : 403;
        nextClaim = now + 500;
        return response.writeHead(status).end();
      }
      if (author && now < author.expires) return response.writeHead(409).end();
      author = {token: randomBytes(24).toString('hex'), expires: now + leaseMs, sequence: 0};
      latest = undefined;
      nextFrame = 0;
      return response.writeHead(200, {'Content-Type': 'application/json'}).end(JSON.stringify({token: author.token}));
    }
    if (!author || now >= author.expires || !authorized(credential, author.token)) return response.writeHead(403).end();
    if (pathname === prefix + 'open-edge') {
      if (process.platform !== 'win32') return response.writeHead(501).end();
      if (now < nextEdgeLaunch) return response.writeHead(429).end();
      nextEdgeLaunch = now + 2000;
      // Fixed executable and fixed loopback URL: no client-controlled shell arguments.
      execFile('cmd.exe', ['/d', '/s', '/c', 'start', '""', 'msedge.exe', origin + '/'],
        {windowsHide: true, timeout: 5000}, error => {
          if (!response.writableEnded) response.writeHead(error ? 503 : 204).end();
        });
      return;
    }
    if (pathname === prefix + 'release') {
      author = latest = undefined;
      return response.writeHead(204).end();
    }
    if (pathname === prefix + 'heartbeat') {
      author.expires = now + leaseMs;
      return response.writeHead(204).end();
    }
    if (pathname !== prefix + 'frame') return response.writeHead(404).end();
    if (now < nextFrame) return response.writeHead(429).end();
    nextFrame = now + 55;
    const owner = author;
    if (request.headers['content-type'] !== 'application/json') return response.writeHead(415).end();
    const declared = Number(request.headers['content-length']);
    if (!Number.isSafeInteger(declared) || declared < 1 || declared > maxFrame) {
      return response.writeHead(413, {Connection: 'close'}).end();
    }
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
      size += chunk.length;
      if (size > maxFrame) return response.writeHead(413, {Connection: 'close'}).end();
      chunks.push(chunk);
    }
    let frame;
    try { frame = JSON.parse(Buffer.concat(chunks)); }
    catch { return response.writeHead(400).end(); }
    if (!frame || frame.type !== 'frame' || typeof frame.source !== 'string' || frame.source.length > 60
      || !Number.isSafeInteger(frame.sequence) || frame.sequence <= owner.sequence
      || typeof frame.picture !== 'string' || !/^data:image\/(webp|png);base64,[A-Za-z0-9+/=]+$/.test(frame.picture)
      || !Array.isArray(frame.labels) || frame.labels.length !== 9
      || !frame.labels.every(label => typeof label === 'string' && label.length <= 1024)) {
      return response.writeHead(400).end();
    }
    if (owner !== author || Date.now() >= owner.expires) return response.writeHead(403).end();
    owner.sequence = frame.sequence;
    latest = 'event: frame\ndata: ' + JSON.stringify(frame) + '\n\n';
    broadcast(viewers, latest);
    response.writeHead(204).end();
  }
  return {code, handle};
}

module.exports = {createRelay, prefix};
