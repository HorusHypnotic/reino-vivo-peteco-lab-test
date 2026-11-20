'use strict';
const assert = require('node:assert/strict');
const Economy = require('../v7/war-economy.js');
const state = Economy.create();
const trade = { villages: { 'BR-PA': { stock: { wood: 1000, stone: 1000, food: 1000 } } }, warLedger: [] };
let current = state;
for (let i = 0; i < 125; i++) {
  const result = Economy.settle(current, trade, { warId: 'war-' + i, winner: 'BR-PE', loser: 'BR-PA' });
  assert.equal(result.ok, true);
  current = result.state;
  const applied = Economy.reconcile(current, trade);
  current = applied.state;
  Object.assign(trade, applied.trade);
}
assert.equal(trade.warLedger.length, 125, 'old charges must remain recognized');
const before = { ...trade.villages['BR-PA'].stock };
const stale = Economy.restore({ ...current, charges: current.charges.map(c => ({ ...c, applied: false })) });
const replay = Economy.reconcile(stale, trade);
assert.deepEqual(replay.trade.villages['BR-PA'].stock, before, 'stale journal must not double debit');
assert.equal(replay.applied.length, 0);
console.log('PASS: 125 charges, replay after stale journal, no duplicate debit');

const routes = Economy.create();
const routeTrade = { villages: { A: { stock: { wood: 30, stone: 30 } }, B: { stock: { wood: 30, stone: 30 } } } };
let routeState = Economy.settle(routes, routeTrade, { warId: 'route-1', winner: 'A', loser: 'B' }).state;
assert.equal(Economy.routeStatus(routeState, 'A', 'B').blocked, true);
routeState = Economy.advance(routeState);
routeState = Economy.settle(routeState, routeTrade, { warId: 'route-2', winner: 'B', loser: 'A' }).state;
assert.equal(Economy.routeStatus(routeState, 'A', 'B').wars, 2);
assert.equal(Economy.routeStatus(routeState, 'A', 'B').remaining, 4, 'new war resets recovery');
for (let i = 0; i < 4; i++) routeState = Economy.advance(routeState);
assert.equal(Economy.routeStatus(routeState, 'A', 'B').blocked, false);
console.log('PASS: repeated wars extend interruption; trade rounds restore route');
