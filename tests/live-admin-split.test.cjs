'use strict';

const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const http = require('node:http');
const {spawn} = require('node:child_process');
const {once} = require('node:events');

const root = path.join(__dirname, '..');
const live = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const publicAdmin = fs.readFileSync(path.join(root, 'admin/index.html'), 'utf8');

test('public page uses the 9:16 stage and ignores former debug and direction query flags', () => {
  assert.doesNotMatch(live, /get\('admin'\)/);
  assert.match(live, /\.viewer \.viewer-stage\{display:flex;flex-direction:column;aspect-ratio:9\/16/);
  assert.match(live, /html:not\(\[data-local-view="direction"\]\) main>:not\(\.viewer-stage\)/);
  assert.match(live, /mode === 'direction' \? new URLSearchParams\(location.search\) : new URLSearchParams\(\)/);
  assert.match(live, /isolateStage\(\)/);
  assert.match(live, /if \(mode === 'projection'\) \{[\s\S]*?watchScene\(c,[\s\S]*?return;/);
  assert.match(publicAdmin, /QA público/);
  assert.match(publicAdmin, /export-save/);
  assert.doesNotMatch(publicAdmin, /admin=1|location.replace|data-a=|data-fake=/);
});

test('the standalone projection reads legacy saves without committing writes or removals', async () => {
  const previous = {document: global.document, location: global.location, window: global.window};
  global.document = {documentElement: {dataset: {}}};
  global.location = {protocol: 'https:', hostname: 'example.test'};
  const original = new Map([['legacy', 'previous']]);
  global.window = {localStorage: {getItem: key => original.get(key) ?? null}};
  try {
    const {mode, previewStorage} = await import('../live/session.js');
    assert.equal(mode, 'public');
    const store = previewStorage();
    assert.equal(store.getItem('legacy'), 'previous');
    store.setItem('legacy', 'simulated');
    assert.equal(store.getItem('legacy'), 'simulated');
    store.removeItem('legacy');
    assert.equal(store.getItem('legacy'), null);
    assert.equal(original.get('legacy'), 'previous');
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete global[key];
      else global[key] = value;
    }
  }
});

test('the migration preserves known saves, rejects overwrite and rolls back partial writes', async () => {
  const {exportSave, importSave} = await import('../live/save-transfer.js');
  const village = 'peteco-lab-vila-v2';
  const checkpoint = 'peteco-lab-collective-checkpoint-v1';
  const values = new Map([[village, '{"v":2}'], ['peteco-v36-territory-qa-v1', '{}'], [checkpoint, '{}']]);
  const storage = map => ({
    getItem: key => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, value),
    removeItem: key => map.delete(key),
  });
  const backup = exportSave(storage(values));
  assert.deepEqual(backup.saves, {[village]: '{"v":2}', [checkpoint]: '{}'});
  const destination = new Map();
  importSave(storage(destination), backup);
  assert.deepEqual([...destination], Object.entries(backup.saves));
  assert.throws(() => importSave(storage(destination), backup), /Já há progresso/);
  const broken = new Map();
  assert.throws(() => importSave(storage(broken), {version: 1, saves: {[village]: '{}', [checkpoint]: 'invalid'}}));
  assert.equal(broken.size, 0);
});

test('loopback serves distinct LIVE and ADMIN documents and limits cross-origin access', async t => {
  const temporary = net.createServer();
  temporary.listen(0, '127.0.0.1');
  await once(temporary, 'listening');
  const {port} = temporary.address();
  await new Promise(resolve => temporary.close(resolve));
  const server = spawn(process.execPath, ['tools/live-local.cjs'], {
    cwd: root,
    env: {...process.env, PETECO_LIVE_PORT: String(port)},
  });
  t.after(() => server.kill());
  await once(server.stdout, 'data');

  function request(url, headers = {}, method = 'GET') {
    return new Promise((resolve, reject) => {
      const req = http.request({hostname: '127.0.0.1', port, path: url, headers, method}, res => {
        let body = '';
        res.setEncoding('utf8').on('data', chunk => { body += chunk; });
        res.on('end', () => resolve({status: res.statusCode, headers: res.headers, body}));
      });
      req.on('error', reject);
      req.end();
    });
  }
  const [scene, direction, script, foreign, remoteHost, mutation] = await Promise.all([
    request('/?admin=1&territory=1'), request('/admin/'), request('/live/projection.js'),
    request('/admin/', {'Sec-Fetch-Site': 'cross-site'}), request('/admin/', {Host: 'other.test'}),
    request('/admin/', {}, 'POST'),
  ]);
  assert.match(scene.body, /data-local-view="projection"/);
  assert.match(direction.body, /data-local-view="direction"/);
  assert.match(direction.headers['content-security-policy'], /frame-ancestors 'none'/);
  assert.match(script.headers['content-type'], /javascript/);
  assert.deepEqual([foreign.status, remoteHost.status, mutation.status], [403, 403, 403]);
});

test('inline scripts compile independently', () => {
  const {spawnSync} = require('node:child_process');
  for (const [, attributes, code] of live.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!code.trim()) continue;
    const inputType = attributes.includes('module') ? 'module' : 'commonjs';
    const result = spawnSync(process.execPath, ['--check', '--input-type=' + inputType], {input: code, encoding: 'utf8'});
    assert.equal(result.status, 0, result.stderr);
  }
});

test('projection reconnects to a new author, discards repeated frames and supports storage events', async () => {
  const restore = new Map();
  const setGlobal = (key, value) => {
    restore.set(key, Object.getOwnPropertyDescriptor(global, key));
    Object.defineProperty(global, key, {configurable: true, value});
  };
  const labels = new Map();
  const listeners = [];
  const stored = new Map();
  const scheduled = [];
  const drawn = [];
  let now = 100;
  setGlobal('document', {
    hidden: false,
    getElementById(id) {
      if (!labels.has(id)) labels.set(id, {textContent: id});
      return labels.get(id);
    },
  });
  setGlobal('performance', {now: () => now});
  setGlobal('BroadcastChannel', undefined);
  setGlobal('window', {addEventListener: (event, handler) => listeners.push(handler)});
  setGlobal('localStorage', {
    setItem(key, newValue) {
      stored.set(key, newValue);
      for (const listener of listeners) listener({key, newValue});
    },
    removeItem: key => stored.delete(key),
  });
  setGlobal('Image', class {set src(value) { this.value = value; this.onload(); }});
  setGlobal('setInterval', fn => scheduled.push(fn));
  try {
    const {publishScene, watchScene} = await import('../live/projection.js');
    const view = {
      width: 360,
      height: 480,
      getContext: () => ({drawImage: picture => drawn.push(picture.value)}),
    };
    const pixels = 'data:image/webp;base64,';
    const canvas = {toDataURL: () => pixels + 'first'};
    const publish = publishScene(canvas, () => {}, () => ({enabled: true}));
    const audio = [];
    let disconnected = 0;
    watchScene(view, frame => audio.push(frame), () => { disconnected++; });
    publish();
    publish();
    assert.deepEqual(drawn, [pixels + 'first']);
    assert.equal(audio.length, 1);
    assert.equal(stored.size, 0);

    const key = 'peteco-live-projection-v1';
    localStorage.setItem(key, JSON.stringify({...audio[0], picture: pixels + 'repeated'}));
    localStorage.removeItem(key);
    assert.equal(drawn.length, 1);
    now += 3000;
    scheduled[0]();
    assert.equal(disconnected, 1);
    assert.equal(labels.get('viewer-cue').textContent, 'Reconectando à direção local');

    const replacement = publishScene({toDataURL: () => pixels + 'replacement'}, () => {}, () => ({}));
    scheduled[0]();
    replacement();
    assert.deepEqual(drawn, [pixels + 'first', pixels + 'replacement']);
    assert.notEqual(audio[0].source, audio[1].source);
    assert.equal(audio[1].sequence, 1);
    assert.equal(stored.size, 0);
  } finally {
    for (const [key, descriptor] of restore) {
      if (descriptor) Object.defineProperty(global, key, descriptor);
      else delete global[key];
    }
  }
});
