/* Restores the presentation phase around an already-persisted faction battle. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PetecoWarDirector = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function restore(active, tick = 0) {
    if (!active) return { phase: 'idle', since: 0, headline: '', event: null };
    const a = String(active.a || '');
    const b = String(active.b || '');
    return {
      phase: 'alert',
      since: Number.isFinite(tick) ? tick : 0,
      headline: `⚠️ Retomando cerco: ${a} contra ${b}`,
      event: null,
    };
  }
  function advance(director, tick) {
    if (director.phase === 'alert' && tick - director.since >= 180) {
      director.phase = 'approach';
      director.since = tick;
      director.headline = 'Tropas se aproximam das muralhas';
    } else if (director.phase === 'approach' && tick - director.since >= 180) {
      director.phase = 'combat';
      director.since = tick;
      director.headline = 'O cerco começou';
    }
    return director.phase;
  }
  return { restore, advance };
});
