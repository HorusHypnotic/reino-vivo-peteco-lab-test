/* Durable, idempotent economic consequences for simulated faction wars. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PetecoWarEconomy = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const pair = (a, b) => [String(a), String(b)].sort().join('|');
  const clone = value => JSON.parse(JSON.stringify(value));
  function create() { return { version: 1, round: 0, routes: {}, settlements: {}, events: [], charges: [] }; }
  function restore(raw) {
    try {
      const x = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!x || x.version !== 1 || !Number.isSafeInteger(x.round) || x.round < 0 || !x.routes || Array.isArray(x.routes) || !x.settlements || Array.isArray(x.settlements) || !Array.isArray(x.events) || !Array.isArray(x.charges)) return null;
      const next = create(); next.round = x.round;
      for (const [id, route] of Object.entries(x.routes)) {
        if (!route || !Number.isSafeInteger(route.remaining) || route.remaining < 0 || !Number.isSafeInteger(route.wars) || route.wars < 1) return null;
        next.routes[id] = { remaining: route.remaining, wars: route.wars };
      }
      for (const [id, record] of Object.entries(x.settlements)) {
        if (!record || record.warId !== id || !record.loser || !record.winner || !record.repairPaid || !['wood', 'stone'].every(k => Number.isSafeInteger(record.repairPaid[k]) && record.repairPaid[k] >= 0)) return null;
        next.settlements[id] = { warId: id, winner: record.winner, loser: record.loser, repairPaid: { wood: record.repairPaid.wood, stone: record.repairPaid.stone }, repairSeq: Number.isSafeInteger(record.repairSeq) && record.repairSeq >= 0 ? record.repairSeq : 0 };
      }
      for (const charge of x.charges) {
        if (!charge || typeof charge.id !== 'string' || !next.settlements[charge.warId] || !charge.cost || !['wood', 'stone'].every(k => Number.isSafeInteger(charge.cost[k]) && charge.cost[k] >= 0)) return null;
        next.charges.push({ id: charge.id, warId: charge.warId, cost: { wood: charge.cost.wood, stone: charge.cost.stone }, applied: Boolean(charge.applied) });
      }
      next.events = x.events.slice(-100).filter(e => e && typeof e.type === 'string');
      return next;
    } catch { return null; }
  }
  function settle(state, trade, { warId, winner, loser }) {
    const id = String(warId || '');
    if (!id || !winner || !loser) return { ok: false, reason: 'invalid-war' };
    if (state.settlements[id]) return { ok: true, duplicate: true, state, settlement: state.settlements[id] };
    const stock = trade?.villages?.[loser]?.stock;
    if (!stock) return { ok: false, reason: 'missing-territory' };
    const next = clone(state), settlement = { warId: id, winner, loser, repairPaid: { wood: 0, stone: 0 }, repairSeq: 0 };
    next.settlements[id] = settlement;
    const cost = { wood: Math.min(5, Math.max(0, Math.floor(Number(stock.wood) || 0))), stone: Math.min(3, Math.max(0, Math.floor(Number(stock.stone) || 0))) };
    next.charges.push({ id: `${id}:siege`, warId: id, cost, applied: false });
    const key = pair(winner, loser), route = next.routes[key] || { remaining: 0, wars: 0 };
    route.remaining = Math.max(route.remaining, 4); route.wars = Math.min(1000, route.wars + 1); next.routes[key] = route;
    next.events.push({ type: 'war-route-interrupted', warId: id, route: key, round: next.round });
    if (next.events.length > 100) next.events.shift();
    return { ok: true, duplicate: false, state: next, settlement };
  }
  function importLegacy(state, warId, record) {
    const id = String(warId || '');
    if (!id || !record?.winner || !record?.loser || state.settlements[id]) return { ok: Boolean(id && state.settlements[id]), state };
    const paid = record.repairCost || { wood: 0, stone: 0 };
    const next = clone(state);
    next.settlements[id] = { warId: id, winner: record.winner, loser: record.loser, repairPaid: { wood: Math.min(5, Math.max(0, Math.floor(Number(paid.wood) || 0))), stone: Math.min(3, Math.max(0, Math.floor(Number(paid.stone) || 0))) }, repairSeq: 0 };
    return { ok: true, state: next };
  }
  function repair(state, trade, warId) {
    const id = String(warId || ''), existing = state.settlements[id], stock = trade?.villages?.[existing?.loser]?.stock;
    if (!existing || !stock) return { ok: false, reason: 'missing-settlement' };
    const pending = state.charges.filter(c => c.warId === id && !c.applied).reduce((sum, c) => ({ wood: sum.wood + c.cost.wood, stone: sum.stone + c.cost.stone }), { wood: 0, stone: 0 });
    const needed = { wood: Math.max(0, 5 - existing.repairPaid.wood - pending.wood), stone: Math.max(0, 3 - existing.repairPaid.stone - pending.stone) };
    const available = { wood: Math.max(0, Math.floor(Number(stock.wood) || 0) - pending.wood), stone: Math.max(0, Math.floor(Number(stock.stone) || 0) - pending.stone) };
    const cost = { wood: Math.min(needed.wood, available.wood), stone: Math.min(needed.stone, available.stone) };
    if (!cost.wood && !cost.stone) return { ok: true, changed: false, state };
    const next = clone(state), record = next.settlements[id]; record.repairSeq++;
    next.charges.push({ id: `${id}:repair:${record.repairSeq}`, warId: id, cost, applied: false });
    return { ok: true, changed: true, state: next };
  }
  /* Returns copies so callers can checkpoint stock+ledger before adopting journal progress. */
  function reconcile(state, trade) {
    const nextState = clone(state), nextTrade = clone(trade);
    if (!Array.isArray(nextTrade.warLedger)) nextTrade.warLedger = [];
    const applied = [];
    for (const charge of nextState.charges) {
      if (charge.applied) continue;
      const settlement = nextState.settlements[charge.warId];
      if (nextTrade.warLedger.includes(charge.id)) {
        charge.applied = true;
        settlement.repairPaid.wood += charge.cost.wood; settlement.repairPaid.stone += charge.cost.stone;
        continue;
      }
      const stock = nextTrade.villages?.[settlement.loser]?.stock;
      if (!stock) continue;
      const wood = Math.min(charge.cost.wood, Math.max(0, Math.floor(Number(stock.wood) || 0)));
      const stone = Math.min(charge.cost.stone, Math.max(0, Math.floor(Number(stock.stone) || 0)));
      stock.wood -= wood; stock.stone -= stone;
      nextTrade.warLedger.push(charge.id);
      // Keep charge IDs permanently: truncating this ledger permits a stale journal replay to debit stock twice.
      charge.applied = true;
      settlement.repairPaid.wood += wood; settlement.repairPaid.stone += stone;
      applied.push({ warId: charge.warId, loser: settlement.loser, wood, stone, chargeId: charge.id });
    }
    return { state: nextState, trade: nextTrade, applied };
  }
  function advance(state) { state.round++; for (const route of Object.values(state.routes)) if (route.remaining > 0) route.remaining--; return state; }
  function isBlocked(state, a, b) { return (state.routes[pair(a, b)]?.remaining || 0) > 2; }
  function routeStatus(state, a, b) { const route = state.routes[pair(a, b)]; return route ? { blocked: route.remaining > 2, remaining: route.remaining, wars: route.wars, recovery: Math.min(1, Math.max(0, 1 - route.remaining / 4)) } : { blocked: false, remaining: 0, wars: 0, recovery: 1 }; }
  return { create, restore, settle, importLegacy, repair, reconcile, advance, isBlocked, routeStatus, pair };
});
