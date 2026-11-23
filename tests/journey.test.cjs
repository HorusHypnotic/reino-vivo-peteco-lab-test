'use strict';

const {test} = require('node:test');
const assert = require('node:assert/strict');
const economy = require('../v36/economy-core.js');

test('the 15-minute journey resumes through each checkpoint and settles the shipment once', async () => {
  const {advanceJourney, chapters, createJourney, journeyBrief, restoreJourney, DURATION} = await import('../v36/journey.mjs');
  let state = createJourney(economy, false);
  const war = {
    start: () => ({ok: true}),
    defend: () => ({ok: true, war: {guardA: 12}}),
    result: () => ({ok: true, war: {fortifications: 1}}),
  };
  for (const [index, [at, chapter]] of chapters.entries()) {
    if (at) assert.equal(advanceJourney({...state, elapsed: at - 1}, economy, index, war), null);
    state = advanceJourney({...state, elapsed: at}, economy, index, war);
    assert.ok(state, chapter);
    assert.equal(advanceJourney(state, economy, index, war), null, chapter);
    state = restoreJourney(JSON.stringify(state), economy);
    if (chapter === 'Transporte') assert.equal(state.economy.players.bento.inventory.trigo, 8);
    if (chapter === 'Chegada') assert.match(journeyBrief(state).mission, /no armazém · aguardando conferência/);
    if (chapter === 'Pagamento') assert.equal(state.economy.cooperative.warehouse.trigo, 8);
  }
  assert.equal(state.elapsed, DURATION);
  assert.equal(state.running, false);
  assert.equal(state.economy.players.aurora.coins, 115);
  assert.equal(state.economy.players.bento.coins, 180);
  assert.equal(state.economy.players.bento.inventory.trigo, undefined);
  assert.equal(state.economy.cooperative.warehouse.trigo, 6);
  assert.equal(state.economy.cooperative.treasury, 5);
  assert.equal(state.economy.cooperative.reserved, 0);
  assert.equal(state.economy.cooperative.ledger.filter(entry => entry.type === 'settlement').length, 1);
});

test('a postponed defense cannot debit the warehouse or advance the journey', async () => {
  const {advanceJourney, chapters, createJourney} = await import('../v36/journey.mjs');
  const state = createJourney(economy, true);
  state.step = chapters.findIndex(chapter => chapter[1] === 'Defesa');
  state.elapsed = 800;
  state.economy.cooperative = {warehouse: {trigo: 8}};
  assert.equal(advanceJourney(state, economy, state.step, {defend: () => ({ok: false})}), null);
  assert.equal(state.economy.cooperative.warehouse.trigo, 8);
});
