'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const engine = require('../v7/war-engine.js');
const director = require('../v7/war-director.js');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

let result = engine.command({ id: '5', a: 'BR-PA', b: 'BR-PE', hpA: 90, hpB: 1, round: 0 }, 'attack', 'a');
assert.deepEqual([result.winner, result.loser, result.battle.hpB], ['BR-PA', 'BR-PE', 0], 'victory resolves against B');
result = engine.command({ a: 'BR-PA', b: 'BR-PE', hpA: 1, hpB: 90, round: 0 }, 'attack', 'b');
assert.deepEqual([result.winner, result.loser, result.battle.hpA], ['BR-PE', 'BR-PA', 0], 'victory resolves against A');
result = engine.command({ a: 'A', b: 'B', hpA: 40, hpB: 55, round: 19, guardA: 0, guardB: 0 }, 'defend', 'b');
assert.deepEqual([result.battle.round, result.winner], [20, 'B'], 'round limit uses remaining HP');
result = engine.command({ a: 'A', b: 'B', hpA: 50, hpB: 50, round: 19 }, 'defend', 'a');
assert.equal(result.winner, 'A', 'round limit tie is deterministic');
for (const phase of ['alert', 'approach']) {
  const active = { a: 'A', b: 'B', hpA: 80, hpB: 80, round: 0 };
  assert.equal(engine.command(active, 'attack', 'a').ok, true, `commands remain valid during ${phase}`);
}
const saved = { a: 'BR-PA', b: 'BR-PE', hpA: 71, hpB: 44, round: 9 };
const resumedDirector = director.restore(saved, 1000);
assert.equal(director.advance(resumedDirector, 1180), 'approach');
assert.equal(director.advance(resumedDirector, 1360), 'combat');
assert.equal(engine.command(saved, 'attack', 'b').ok, true, 'reloaded battle can accept a combat action');
assert.equal(engine.scene(saved, null, 2000), true);
assert.equal(engine.scene(null, { until: 3000 }, 2999), true, 'result remains visible through aftermath');
assert.equal(engine.scene(null, { until: 3000 }, 3000), false, 'canvas returns to village at end of aftermath');
assert.ok(html.indexOf('if(warOnScreen){') < html.indexOf("else if(s.phase==='vila')"), 'war canvas takes precedence over village camera');
assert.match(html, /warDirector\.event=\{cmd,side,at:s\.t\}/, 'audience commands create a timed camera/impact cue');
assert.match(html, /if\(warLastHit\.cmd==='attack'&&progress>\.72\)/, 'impact flash follows an actual attack event');
assert.match(html, /warStart\(\);/, 'automatic and manual triggers share the same battle start routine');
assert.doesNotMatch(html.slice(html.indexOf('function warDispatch'), html.indexOf('function warTick')), /warDirector\.phase/);
console.log('PASS war outcomes, turn limit, transition commands, reload, aftermath return, and scene priority');
