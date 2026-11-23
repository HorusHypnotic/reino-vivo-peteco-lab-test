'use strict';

const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const fs = require('node:fs/promises');
const net = require('node:net');
const path = require('node:path');
const {chromium} = require(process.env.PETECO_PLAYWRIGHT_MODULE || 'playwright');

const key = 'peteco-v36-journey-v1';
const resumeOnly = process.argv.includes('--resume-only');
const output = process.env.PETECO_QA_OUTPUT || (resumeOnly ? 'qa/evidence/journey/retomada' : 'qa/evidence/journey');

async function run() {
  await fs.mkdir(output, {recursive: true});
  const temporary = net.createServer().listen(0, '127.0.0.1');
  await once(temporary, 'listening');
  const port = temporary.address().port;
  await new Promise(resolve => temporary.close(resolve));
  const origin = 'http://127.0.0.1:' + port;
  const server = spawn(process.execPath, ['tools/live-local.cjs'], {
    env: {...process.env, PETECO_LIVE_PORT: String(port)},
  });
  const browsers = [];
  const errors = [];
  const launch = async () => {
    const browser = await chromium.launch({executablePath: process.env.PETECO_CHROMIUM, args: ['--no-sandbox']});
    browsers.push(browser);
    return browser;
  };
  try {
    const [startup] = await once(server.stdout, 'data');
    const code = String(startup).match(/Código ADMIN: ([a-f0-9]+)/)[1];
    const [source, receiver] = await Promise.all([launch(), launch()]);
    const admin = await source.newPage({viewport: {width: 1280, height: 900}});
    const live = await receiver.newPage({viewport: {width: 360, height: 640}});
    const fontFile = process.env.PETECO_QA_FONT;
    const font = fontFile && (await fs.readFile(fontFile)).toString('base64');
    for (const page of [admin, live]) {
      if (font) await page.addInitScript(async font => {
        const family = 'PetecoQAFallback';
        const face = new FontFace(family, 'url(data:font/ttf;base64,' + font + ')');
        document.fonts.add(await face.load());
        if (!document.head) await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, {once: true}));
        const style = document.createElement('style');
        style.textContent = 'body,button,input,select{font-family:PetecoQAFallback!important}';
        document.head.append(style);
        const descriptor = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'font');
        Object.defineProperty(CanvasRenderingContext2D.prototype, 'font', {
          ...descriptor,
          set(value) { descriptor.set.call(this, value.replace(/system-ui|sans-serif|serif/g, family)); },
        });
      }, font);
      page.setDefaultTimeout(12000);
      page.on('pageerror', error => {
        errors.push(error.message);
        console.error(error.message);
      });
    }
    let competingPage;
    const claim = async page => {
      const input = page.getByLabel('Código ADMIN');
      if (font && page !== competingPage) await page.waitForFunction(() => [...document.fonts].some(face => face.family === 'PetecoQAFallback'));
      await input.fill(code);
      if (await input.inputValue()) await page.getByRole('button', {name: 'Assumir direção'}).click();
      else await input.evaluate((field, value) => {
        field.value = value;
        field.form.requestSubmit();
      }, code);
    };

    await live.goto(origin);
    await admin.goto(origin + '/admin/');
    const localStart = Date.now();
    await claim(admin);
    console.log('Código enviado ao ADMIN');
    await admin.locator('form input[type=password]').waitFor({state: 'detached'});
    const newVillage = admin.getByRole('button', {name: 'Começar vila'});
    if (await newVillage.isVisible()) await newVillage.click();
    console.log('ADMIN: ' + await admin.locator('#direction-status').textContent());
    const competing = competingPage = await receiver.newPage();
    await competing.goto(origin + '/admin/');
    await claim(competing);
    await competing.getByText('Já existe uma direção ativa.').waitFor({timeout: 5000, state: 'attached'});
    assert.equal(await competing.locator('main').evaluate(node => node.inert), true);
    await competing.close();
    console.log('Projeção e autorização testadas');

    await live.locator('canvas').click();
    await live.waitForFunction(() => Sound.status().state === 'running');
    console.log('Áudio LIVE iniciado');
    assert.equal(await live.locator('button, input, select, #journey-v36').count(), 0);
    const stage = await live.locator('.viewer-stage').boundingBox();
    assert.ok(Math.abs(stage.width / stage.height - 9 / 16) < .002);
    const canvas = await live.locator('canvas').evaluate(node => node.toDataURL());
    await live.waitForFunction(before => document.querySelector('canvas').toDataURL() !== before, canvas);
    await admin.getByRole('button', {name: 'Ensaiar 15 minutos'}).click();
    const started = Date.now();
    const timeline = [];
    async function observe(chapter, filename, timeout = 240000) {
      await live.waitForFunction(name => document.querySelector('#viewer-hero').textContent.endsWith(' · ' + name), chapter, {timeout, polling: 250});
      const visible = await live.locator('#viewer-hero').textContent();
      timeline.push({chapter, visible, elapsedMs: Date.now() - started});
      if (filename) await live.screenshot({path: path.join(output, filename)});
      console.log(visible);
    }

    await observe('Entrada', resumeOnly ? null : '01-entrada.png');
    if (resumeOnly) {
      await admin.waitForFunction(key => JSON.parse(localStorage.getItem(key)).elapsed >= 2, key);
      const before = await admin.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
      await admin.reload();
      await claim(admin);
      await observe('Entrada');
      const after = await admin.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
      assert.equal(after.id, before.id);
      assert.equal(after.economy.seq, before.economy.seq);
      assert.ok(after.elapsed >= before.elapsed);
      await admin.evaluate(() => Object.defineProperty(document, 'hidden', {configurable: true, value: true}));
      await observe('Profissões', 'admin-em-segundo-plano.png', 30000);
      const second = await admin.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
      assert.equal(second.economy.players.bento.profession, 'carreteiro');
      assert.equal(second.journal.filter(entry => entry.chapter === 'Entrada').length, 1);
      await admin.evaluate(() => Object.defineProperty(document, 'hidden', {configurable: true, value: false}));
      await admin.getByRole('button', {name: 'Controlar ações'}).click();
      await admin.getByRole('button', {name: 'Primeira missão', exact: true}).click({timeout: 35000});
      await observe('Primeira missão', 'missao-manual.png', 10000);
      const manual = await admin.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
      assert.equal(manual.automatic, false);
      assert.equal(manual.journal.at(-1).chapter, 'Primeira missão');
      assert.deepEqual(await live.evaluate(() => Object.keys(localStorage)), []);
      assert.deepEqual(errors, []);
      await fs.writeFile(path.join(output, 'retomada.json'), JSON.stringify({runtime: source.version(), before, after, second, manual, timeline}, null, 2));
      console.log('PASS: ADMIN reload, checkpoint, document.hidden, server clock, manual action, isolated LIVE.');
      return;
    }
    await observe('Plantio', '02-plantio.png');
    await live.reload();
    await observe('Plantio');
    await observe('Colheita');
    await observe('Transporte', '03-transporte.png');
    await observe('Pagamento', '04-pagamento.png');
    await observe('Defesa', '05-defesa.png');
    await observe('Consequências');
    await live.waitForFunction(() => document.querySelector('#viewer-cue').textContent.includes('fortifica'));
    await live.waitForTimeout(1500);
    await live.screenshot({path: path.join(output, '06-territorio.png')});
    await observe('Próxima missão', '07-nova-missao.png');
    const snapshot = await admin.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
    assert.equal(snapshot.elapsed, 900);
    assert.equal(snapshot.running, false);
    assert.equal(snapshot.economy.players.aurora.coins, 115);
    assert.equal(snapshot.economy.players.bento.coins, 180);
    assert.equal(snapshot.economy.cooperative.warehouse.trigo, 6);
    assert.equal(snapshot.economy.cooperative.ledger.filter(entry => entry.type === 'settlement').length, 1);
    assert.ok(snapshot.journal.find(entry => entry.chapter === 'Consequências').war.fortifications > 0);
    assert.deepEqual(await live.evaluate(() => Object.keys(localStorage)), []);
    assert.deepEqual(errors, []);
    await fs.writeFile(path.join(output, 'sessao.json'), JSON.stringify({
      runtime: source.version(), startupMs: started - localStart, timeline, snapshot,
    }, null, 2));
    console.log('PASS: dois processos Chromium, áudio, autor único, recarga LIVE e jornada integral.');
  } finally {
    await Promise.all(browsers.map(browser => browser.close()));
    server.kill();
  }
}

run().catch(error => { console.error(error); process.exitCode = 1; });
