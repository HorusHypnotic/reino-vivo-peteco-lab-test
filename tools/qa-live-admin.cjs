'use strict';

const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const {chromium} = require(process.env.PETECO_PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const evidence = path.resolve(process.env.PETECO_QA_OUTPUT || path.join(root, 'qa/evidence/live-admin'));
const mime = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png'};
const seed = {v: 2, wood: 777, food: 120, stone: 100, level: 6, cycles: 6, people: 8,
  sectors: {forest: 2, farm: 2, quarry: 2, workshop: 2}, deliveries: 6};

function serveStatic(request, response) {
  const url = new URL(request.url, 'http://127.0.0.1');
  const file = path.resolve(root, '.' + (url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname));
  if (!file.startsWith(root + path.sep) || !mime[path.extname(file)] || !fs.existsSync(file)) {
    response.writeHead(404).end();
    return;
  }
  response.setHeader('Content-Type', mime[path.extname(file)]);
  fs.createReadStream(file).pipe(response);
}

async function listen(server) {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return server.address().port;
}

async function qa() {
  const server = http.createServer(serveStatic);
  const staticPort = await listen(server);
  const temporary = net.createServer();
  const localPort = await listen(temporary);
  await new Promise(resolve => temporary.close(resolve));
  const local = spawn(process.execPath, ['tools/live-local.cjs'], {
    cwd: root, env: {...process.env, PETECO_LIVE_PORT: String(localPort)},
  });

  const errors = [];
  let browser;
  try {
    const [startup] = await once(local.stdout, 'data');
    const code = String(startup).match(/Código ADMIN: ([a-f0-9]+)/)[1];
    async function claim(page) {
      const input = page.getByLabel('Código ADMIN');
      await input.evaluate((field, value) => {
        field.value = value;
        field.form.requestSubmit();
      }, code);
      await input.waitFor({state: 'detached'});
    }
    browser = await chromium.launch({
      executablePath: process.env.PETECO_CHROMIUM, args: ['--no-sandbox'],
      ignoreDefaultArgs: ['--mute-audio'],
    });
    fs.mkdirSync(evidence, {recursive: true});
    const publicUrl = 'http://127.0.0.1:' + staticPort;
    const localUrl = 'http://127.0.0.1:' + localPort;
    const context = await browser.newContext({viewport: {width: 360, height: 640}});
    context.setDefaultTimeout(10000);
    if (process.env.PETECO_QA_FONT) {
      // Optional fixture for Linux runners without a system font service.
      const font = fs.readFileSync(process.env.PETECO_QA_FONT).toString('base64');
      await context.addInitScript(async font => {
        const family = 'PetecoQAFallback';
        const face = new FontFace(family, `url(data:font/ttf;base64,${font})`);
        document.fonts.add(await face.load());
        if (!document.head) await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve, {once: true}));
        const style = document.createElement('style');
        style.textContent = 'body,button,input,select{font-family:PetecoQAFallback!important}';
        document.head.append(style);
        const descriptor = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'font');
        Object.defineProperty(CanvasRenderingContext2D.prototype, 'font', {
          ...descriptor,
          set(value) { descriptor.set.call(this, value.replace(/system-ui|sans-serif|monospace|serif/g, family)); },
        });
      }, font);
    }
    const fixture = 'peteco-lab-vila-v2';
    await context.addInitScript(({publicUrl, fixture, seed}) => {
      if (location.origin === publicUrl && !localStorage.getItem(fixture)) {
        localStorage.setItem(fixture, JSON.stringify(seed));
      }
      // Keep the public read-only check independent of browser tab focus.
      window.qaAudioChanges = 0;
      window.addEventListener('reino-audio-change', () => { window.qaAudioChanges++; });
    }, {publicUrl, fixture, seed});
    context.on('page', page => {
      page.on('pageerror', error => errors.push(page.url() + ' ' + error.message));
      page.on('response', response => { if (response.status() >= 400) errors.push(response.status() + ' ' + response.url()); });
    });
    const publicLive = await context.newPage();
    await publicLive.goto(publicUrl + '/?admin=1&visualqa=1&territory=1');
    await stage(publicLive);
    await publicLive.waitForFunction(() => /^🪵 77/.test(document.querySelector('#wood').textContent));
    const before = await publicLive.locator('#game').evaluate(canvas => canvas.toDataURL());
    await publicLive.waitForFunction(before => document.querySelector('#game').toDataURL() !== before, before);
    assert.deepEqual(await publicLive.evaluate(key => JSON.parse(localStorage.getItem(key)), fixture), seed);
    assert.deepEqual(await publicLive.evaluate(() => Object.keys(localStorage)), [fixture]);

    const publicAdmin = await context.newPage();
    await publicAdmin.goto(publicUrl + '/admin/');
    assert.equal(await publicAdmin.getByRole('heading', {name: /QA público/}).count(), 1);
    assert.equal(await publicAdmin.locator('[data-a], [data-fake], #war-start').count(), 0);
    const downloaded = publicAdmin.waitForEvent('download');
    await publicAdmin.locator('#export-save').click();
    const download = await downloaded;
    const backup = await download.path();
    assert.deepEqual(JSON.parse(fs.readFileSync(backup)).saves[fixture], JSON.stringify(seed));

    const live = await context.newPage();
    await live.goto(localUrl + '/?admin=1&territory=1');
    await stage(live);
    assert.match(await live.locator('#viewer-cue').textContent(), /Aguardando/);
    assert.equal(await live.evaluate(() => Object.keys(localStorage).length), 0);
    const admin = await context.newPage();
    await admin.setViewportSize({width: 1280, height: 800});
    const territory = fs.existsSync(path.join(root, 'v36/territory-ui.js'));
    await admin.goto(localUrl + '/admin/' + (territory ? '?territory=1' : ''));
    await claim(admin);
    await admin.locator('input[type=file]').setInputFiles(backup);
    await admin.getByRole('button', {name: 'Importar', exact: true}).click();
    await admin.locator('[data-fake=join]').click();
    await live.waitForFunction(() => !document.querySelector('#viewer-hero').textContent.includes('Aguardando'));
    assert.match(await live.locator('#wood').textContent(), /^🪵 77/);
    const visitor = await live.locator('#viewer-hero').textContent();
    assert.match(await live.locator('#viewer-bag').textContent(), /🪵/);
    assert.match(await live.locator('#viewer-hero').textContent(), /👤/);
    await live.locator('canvas').click();
    await live.waitForFunction(() => Sound.status().state === 'running' && Sound.status().musicLoop);
    await admin.locator('#ambient-volume').evaluate(slider => {
      slider.value = 20;
      slider.dispatchEvent(new Event('input', {bubbles: true}));
    });
    await live.waitForFunction(() => Sound.status().musicVolume === 0.2);

    if (territory) {
      const panel = admin.locator('#territory-v36');
      await panel.getByRole('button', {name: 'Começar ciclo territorial'}).click();
      await panel.getByRole('button', {name: /Trabalhar/}).first().click();
      assert.ok(await admin.evaluate(() => localStorage.getItem('peteco-v36-territory-qa-v1')));
      assert.equal(await live.locator('#territory-v36').count(), 0);
    }
    await admin.evaluate(() => window.scrollTo(0, 0));
    await admin.screenshot({path: path.join(evidence, 'admin-desktop.png')});

    await live.waitForFunction(() => {
      const ticker = document.querySelector('.spectator-ticker').getBoundingClientRect();
      const line = document.querySelector('.spectator-ticker span').getBoundingClientRect();
      return line.left < ticker.right && line.right > ticker.left;
    });
    await live.screenshot({path: path.join(evidence, 'live-360x640.png')});
    await live.setViewportSize({width: 1080, height: 1920});
    await stage(live);
    await live.screenshot({path: path.join(evidence, 'live-1080x1920.png')});
    await live.setViewportSize({width: 1280, height: 800});
    await stage(live);
    await live.screenshot({path: path.join(evidence, 'live-desktop.png')});

    const region = admin.locator('#region-toggle');
    await region.click();
    assert.equal(await region.getAttribute('aria-pressed'), 'false');
    await region.click();
    assert.equal(await region.getAttribute('aria-pressed'), 'true');
    await admin.locator('#war-demo').click();
    await live.waitForFunction(() => document.getElementById('stage-status').textContent.includes('Guerra:'));
    await admin.locator('#war-attack').click();

    const standby = await context.newPage();
    await standby.goto(localUrl + '/admin/');
    await standby.waitForFunction(() => document.getElementById('direction-status')?.textContent.startsWith('Aguardando a direção local.'));
    assert.equal(await standby.locator('main').evaluate(node => node.inert), true);
    assert.equal(await standby.evaluate(async () => (await navigator.locks.query()).held.filter(x => x.name === 'peteco-village-author-v1').length), 1);
    await admin.close();
    await claim(standby);
    await standby.locator('[data-fake=join]').click({timeout: 10000, trial: true});
    await live.waitForFunction(visitor => document.querySelector('#viewer-hero').textContent === visitor, visitor);
    await standby.close();
    await live.waitForFunction(() => document.getElementById('viewer-cue').textContent === 'Reconectando à direção local');
    const restored = await context.newPage();
    await restored.goto(localUrl + '/admin/');
    await claim(restored);
    await live.waitForFunction(visitor => document.querySelector('#viewer-hero').textContent === visitor, visitor);
    await live.reload();
    await live.waitForFunction(visitor => document.querySelector('#viewer-hero').textContent === visitor, visitor);
    assert.equal(await restored.evaluate(() => JSON.parse(localStorage.getItem('peteco-lab-vila-v2')).court.length), 1);
    assert.ok(await restored.evaluate(() => JSON.parse(localStorage.getItem('peteco-lab-faction-war-v1')).active));

    await restored.close();
    const fallback = await browser.newContext({viewport: {width: 360, height: 640}});
    fallback.setDefaultTimeout(10000);
    await fallback.route('**/__live/events', route => route.abort());
    await fallback.addInitScript(() => { window.BroadcastChannel = undefined; });
    const failedOver = await fallback.newPage();
    await failedOver.goto(localUrl + '/');
    const fallbackAdmin = await fallback.newPage();
    await fallbackAdmin.goto(localUrl + '/admin/');
    await claim(fallbackAdmin);
    await fallbackAdmin.getByRole('button', {name: 'Começar vila'}).click();
    await fallbackAdmin.locator('[data-fake=join]').click();
    await failedOver.waitForFunction(() => !document.querySelector('#viewer-hero').textContent.includes('Aguardando'));
    assert.equal(await failedOver.evaluate(() => localStorage.getItem('peteco-live-projection-v1')), null);
    assert.deepEqual(errors, []);
    console.log('PASS: LIVE pública, ADMIN público somente QA, migração, 9:16 em três viewports, áudio Web Audio, autor único, reconexão, reload e fallback.');
    console.log('Capturas em ' + evidence);
  } finally {
    if (browser) await browser.close();
    local.kill();
    server.close();
  }
}

async function stage(page) {
  await page.locator('body.viewer').waitFor();
  assert.equal(await page.locator('button, input, select, #territory-v36, #visual-qa-v20').count(), 0);
  const frame = await page.locator('.viewer-stage').boundingBox();
  assert.ok(frame && Math.abs(frame.width / frame.height - 9 / 16) < 0.002);
  assert.equal(await page.locator('.spectator-ticker').isVisible(), true);
  assert.ok(frame.y + frame.height <= page.viewportSize().height + 1);
  const ticker = await page.locator('.spectator-ticker').boundingBox();
  assert.ok(ticker.y + ticker.height <= frame.y + frame.height);
}

qa().catch(error => { console.error(error); process.exitCode = 1; });
