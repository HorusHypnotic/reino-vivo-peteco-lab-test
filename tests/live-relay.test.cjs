'use strict';

const {test} = require('node:test');
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const net = require('node:net');
const {setTimeout: delay} = require('node:timers/promises');

test('loopback relay isolates the author and replays the latest frame without cookies', {timeout: 6000}, async t => {
  const temporary = net.createServer().listen(0, '127.0.0.1');
  await once(temporary, 'listening');
  const {port} = temporary.address();
  await new Promise(resolve => temporary.close(resolve));
  const origin = 'http://127.0.0.1:' + port;
  const child = spawn(process.execPath, ['tools/live-local.cjs'], {
    env: {...process.env, PETECO_LIVE_PORT: String(port)},
  });
  t.after(() => child.kill());
  const [startup] = await once(child.stdout, 'data');
  const code = String(startup).match(/Código ADMIN: ([a-f0-9]+)/)[1];
  const post = (endpoint, secret, body, proposedOrigin = origin) => fetch(origin + '/__live/' + endpoint, {
    method: 'POST',
    headers: {Origin: proposedOrigin, Authorization: 'Bearer ' + secret, ...(body && {'Content-Type': 'application/json'})},
    body,
  });
  assert.equal((await post('claim', code, undefined, 'https://foreign.example')).status, 403);
  assert.equal((await post('claim', 'incorrect')).status, 403);
  const claim = await post('claim', code);
  assert.equal(claim.status, 200);
  const {token} = await claim.json();
  assert.equal((await post('claim', code)).status, 409);
  assert.equal((await post('frame', code, '{}')).status, 403);

  const viewer = await fetch(origin + '/__live/events');
  assert.match(viewer.headers.get('content-type'), /text\/event-stream/);
  const reader = viewer.body.getReader();
  assert.match(Buffer.from((await reader.read()).value).toString(), /retry: 500/);
  const frame = {type: 'frame', source: 'admin', sequence: 1, picture: 'data:image/webp;base64,dGVzdA==', labels: Array(9).fill('Vila')};
  const body = JSON.stringify(frame);
  assert.equal((await post('frame', token, body)).status, 204);
  assert.match(Buffer.from((await reader.read()).value).toString(), /"sequence":1/);
  assert.equal((await post('frame', token, body)).status, 429);
  await delay(75);
  assert.equal((await post('frame', token, body)).status, 400);
  await delay(75);
  assert.equal((await post('frame', token, 'X'.repeat(800000))).status, 413);
  await reader.cancel();

  const reconnect = await fetch(origin + '/__live/events');
  const reconnected = reconnect.body.getReader();
  assert.match(Buffer.from((await reconnected.read()).value).toString(), /"sequence":1/);
  await reconnected.cancel();
  assert.equal((await post('release', token)).status, 204);
  assert.equal((await post('heartbeat', token)).status, 403);
  assert.equal((await post('claim', code)).status, 200);
});
