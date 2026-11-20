/* Deterministic rules for the simulated faction battle. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PetecoWarEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function winner(battle) {
    if (battle.hpA <= 0) return battle.b;
    if (battle.hpB <= 0) return battle.a;
    if (battle.round >= 20) return battle.hpA >= battle.hpB ? battle.a : battle.b;
    return null;
  }
  function command(current, cmd, side = 'a') {
    if (!current || !['a', 'b'].includes(side) || !['attack', 'defend', 'heal'].includes(cmd)) return { ok: false, reason: 'invalid-action' };
    const battle = { ...current };
    battle.guardA = Number.isFinite(battle.guardA) ? battle.guardA : 0;
    battle.guardB = Number.isFinite(battle.guardB) ? battle.guardB : 0;
    const own = side === 'b' ? 'hpB' : 'hpA';
    const enemy = side === 'b' ? 'hpA' : 'hpB';
    const guard = side === 'b' ? 'guardB' : 'guardA';
    const enemyGuard = side === 'b' ? 'guardA' : 'guardB';
    if (cmd === 'attack') {
      const damage = 16 + (battle.round % 4) * 4;
      battle[enemy] = Math.max(0, battle[enemy] - Math.max(1, damage - battle[enemyGuard]));
      battle[enemyGuard] = 0;
    } else if (cmd === 'defend') battle[guard] = Math.min(24, battle[guard] + 12);
    else battle[own] = Math.min(100, battle[own] + 7);
    battle.round++;
    const victor = winner(battle);
    return { ok: true, battle, winner: victor, loser: victor ? (victor === battle.a ? battle.b : battle.a) : null };
  }
  function scene(active, aftermath, tick) {
    return Boolean(active || (aftermath && tick < aftermath.until));
  }
  return { command, winner, scene };
});
