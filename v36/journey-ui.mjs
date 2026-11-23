import {advanceJourney, chapters, createJourney, DURATION, JOURNEY_KEY, journeyBrief, restoreJourney} from './journey.mjs';

export function mountJourney({storage, economy, anchor, active, war, onConfirm}) {
  let state, error = '';
  try { state = restoreJourney(storage.getItem(JOURNEY_KEY), economy); }
  catch (failure) { error = failure.message; }

  const panel = document.createElement('section');
  panel.id = 'journey-v36';
  panel.innerHTML = '<h2>Jornada da Cooperativa</h2><p role="status"></p><button type="button">Jogar missão</button> <button type="button">Ensaiar 15 minutos</button> <button type="button">Salvar registro</button>';
  anchor.after(panel);
  const status = panel.querySelector('p');
  const [play, rehearse, exportLog] = panel.querySelectorAll('button');
  let lastTime, lastDisplayed = '', checkpoint = state?.elapsed ?? 0;

  function save(next) {
    try {
      storage.setItem(JOURNEY_KEY, JSON.stringify(next));
      state = next;
      checkpoint = next.elapsed;
      error = '';
      return true;
    } catch {
      error = 'Falha ao salvar a jornada. A próxima ação aguarda o armazenamento.';
      return false;
    }
  }

  function render() {
    const next = state && chapters[state.step];
    const display = error || (state
      ? journeyBrief(state).title + ' · ' + (next ? next[1] + ' aos ' + next[0] + ' s' : 'Sessão concluída')
      : 'Entre com dois perfis simulados e abasteça a cooperativa.');
    if (display !== lastDisplayed) status.textContent = lastDisplayed = display;
    play.textContent = state ? next?.[1] ?? 'Jornada concluída' : 'Jogar missão';
    play.disabled = !active() || (state ? !next || state.elapsed < next[0] : Boolean(error));
    rehearse.textContent = state?.running ? (state.automatic ? 'Controlar ações' : 'Continuar ensaio') : state ? 'Novo ensaio' : 'Ensaiar 15 minutos';
    rehearse.disabled = !active() || (!state && Boolean(error));
    exportLog.disabled = !state;
  }

  function act(expected) {
    if (!state || !active()) return;
    const next = advanceJourney(state, economy, expected, war(state.id));
    if (next && save(next)) onConfirm(next.journal.at(-1), next);
    render();
  }

  function start(automatic) {
    if (!active() || state || error) return;
    if (save(createJourney(economy, automatic))) act(0);
    render();
  }

  play.onclick = () => state ? act(state.step) : start(false);
  rehearse.onclick = () => {
    if (!active()) return;
    if (!state) return start(true);
    if (state.running) {
      save({...state, automatic: !state.automatic});
      render();
      return;
    }
    try {
      storage.setItem(JOURNEY_KEY + '-archive-' + state.id, JSON.stringify(state));
      if (save(createJourney(economy, true))) act(0);
    } catch {
      error = 'Não foi possível arquivar a jornada anterior.';
      render();
    }
  };
  exportLog.onclick = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], {type: 'application/json'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'jornada-cooperativa.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  render();
  return {
    get state() { return state; },
    tick(now) {
      const delta = lastTime === undefined ? 0 : Math.max(0, Math.min(1, (now - lastTime) / 1000));
      lastTime = now;
      if (!active() || !state?.running) return;
      const elapsed = Math.min(DURATION, state.elapsed + delta);
      state = {...state, elapsed};
      if (state.automatic && elapsed >= (chapters[state.step]?.[0] ?? Infinity)) act(state.step);
      if (state.elapsed - checkpoint >= 2) save(state);
      render();
    },
  };
}

export function drawJourney(ctx, state) {
  const field = state.economy.lots['01'];
  if (!field.owner) return;
  ctx.save();
  ctx.translate(309, 386);
  ctx.transform(1, .16, -.65, 1, 0, 0);
  ctx.fillStyle = '#604530';
  ctx.fillRect(-33, -12, 59, 27);
  ctx.strokeStyle = field.registered ? '#ecd09a' : '#b18f66';
  ctx.strokeRect(-33, -12, 59, 27);
  for (let row = 0; row < 3; row++) {
    ctx.fillStyle = field.crop ? (state.economy.cycle >= field.readyAt ? '#e3ba62' : '#a7be69') : '#aa7750';
    for (let furrow = 0; furrow < 8; furrow++) ctx.fillRect(-28 + furrow * 7, -6 + row * 8, 4, 4);
  }
  ctx.restore();
  const contract = state.economy.contracts[state.contract];
  if (contract?.status !== 'in-transit') return;
  const dispatched = state.journal.find(entry => entry.chapter === 'Transporte');
  const progress = Math.min(1, Math.max(0, (state.elapsed - dispatched.at) / 60));
  const x = 307 - 181 * progress;
  const y = 397 + 48 * progress;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#392b24';
  ctx.fillRect(-12, -6, 24, 9);
  ctx.fillStyle = '#c89953';
  ctx.fillRect(-9, -11, 17, 6);
  ctx.fillStyle = '#26242a';
  for (const wheel of [-7, 7]) {
    ctx.beginPath();
    ctx.arc(wheel, 5, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
