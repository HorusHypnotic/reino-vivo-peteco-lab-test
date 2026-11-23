export const JOURNEY_KEY = 'peteco-v36-journey-v1';
export const DURATION = 900;

const farmer = 'aurora';
const carrier = 'bento';
const lot = '01';

export const chapters = [
  [0, 'Entrada', 'Aurora chega à vila como agricultora.', (e, s) => {
    const result = e.join(s, farmer, 'agricultor');
    if (result.ok) s.players[farmer].inventory.enxada = 1;
    return result;
  }],
  [20, 'Profissões', 'Bento assume as entregas da vila.', (e, s) => {
    const result = e.join(s, carrier, 'carreteiro');
    if (result.ok) s.players[carrier].inventory.carroca = 1;
    return result;
  }],
  [45, 'Primeira missão', 'Missão: colher trigo e abastecer a cooperativa.', () => ({ok: true})],
  [80, 'Trabalho', 'Aurora trabalhou no campo e recebeu 10 moedas.', (e, s) => e.work(s, farmer)],
  [115, 'Propriedade', 'Aurora comprou o lote 01 por 100 moedas.', (e, s) => e.buy(s, farmer, lot)],
  [155, 'Registro', 'O lote 01 foi regularizado por 10 moedas.', (e, s) => e.register(s, farmer, lot)],
  [195, 'Plantio', 'Aurora plantou trigo. A lavoura precisa de quatro ciclos.', (e, s) => e.plant(s, farmer, lot, 'trigo')],
  ...[235, 270, 305, 340].map((at, i) => [at, 'Cultivo', 'Trigo · ciclo ' + (i + 1) + '/4.', (e, s) => e.advance(s)]),
  [380, 'Colheita', 'O lote 01 produziu 8 sacas de trigo.', (e, s) => e.harvest(s, farmer, lot)],
  [425, 'Cooperativa', 'Aurora fundou a Cooperativa da Vila e Bento se associou.', (e, s) => {
    const result = e.createCooperative(s, farmer);
    return result.ok ? e.joinCooperative(s, carrier) : result;
  }],
  [465, 'Caixa coletivo', 'Cada associado aportou 25 moedas para financiar a primeira compra.', (e, s) => {
    const result = e.contribute(s, farmer, 25);
    return result.ok ? e.contribute(s, carrier, 25) : result;
  }],
  [510, 'Contrato', 'A cooperativa reservou 45 moedas pela produção e pelo frete.', (e, s) => e.cooperativeContract(s, farmer, lot, 'trigo', 8)],
  [550, 'Transporte', 'Bento partiu com 8 sacas rumo à cooperativa.', (e, s, id) => {
    const result = e.dispatch(s, id, carrier);
    if (result.ok) s.players[carrier].inventory.trigo = s.contracts[id].amount;
    return result;
  }],
  [580, 'Estrada', 'A carroça chegou à metade do trajeto.', (e, s) => e.advance(s)],
  [610, 'Chegada', 'A carroça chegou ao armazém da cooperativa.', (e, s) => e.advance(s)],
  [635, 'Pagamento', 'Trigo entregue. Aurora recebeu 40 moedas e Bento, 5.', (e, s, id) => {
    const result = e.deliver(s, id);
    if (result.ok) delete s.players[carrier].inventory.trigo;
    return result;
  }],
  [700, 'Ameaça', 'Batedores avistaram tropas na estrada do trigo.', (e, s, id, war) => war.start()],
  [721, 'Defesa', 'A guarda recebeu 2 sacas do armazém e montou a defesa da passagem.', (e, s, id, war) => {
    if (s.cooperative.warehouse.trigo < 2) return {ok: false};
    const result = war.defend();
    if (result.ok) s.cooperative.warehouse.trigo -= 2;
    return result;
  }],
  [790, 'Consequências', 'O desfecho do cerco mudou as fortificações da região.', (e, s, id, war) => war.result()],
  [900, 'Próxima missão', 'Nova missão: reconstruir a passagem e abastecer o próximo comboio.', () => ({ok: true})],
];

export function createJourney(economy, automatic) {
  return {
    version: 1, id: globalThis.crypto.randomUUID(), economy: economy.create(),
    elapsed: 0, step: 0, automatic, running: true, contract: null, journal: [],
  };
}

export function restoreJourney(raw, economy) {
  if (raw === null) return null;
  const state = JSON.parse(raw);
  if (state?.version !== 1 || typeof state.id !== 'string'
    || !Number.isInteger(state.step) || state.step < 0 || state.step > chapters.length
    || !Number.isFinite(state.elapsed) || state.elapsed < 0 || state.elapsed > DURATION
    || typeof state.running !== 'boolean' || typeof state.automatic !== 'boolean'
    || !Array.isArray(state.journal) || state.journal.length !== state.step
    || !economy.restore(state.economy)) throw new Error('Salvamento da jornada inválido.');
  return state;
}

export function advanceJourney(state, economy, requestedStep, war) {
  const chapter = chapters[requestedStep];
  if (!chapter || !state.running || state.step !== requestedStep || state.elapsed < chapter[0]) return null;
  const next = structuredClone(state);
  const result = chapter[3](economy, next.economy, next.contract, war);
  if (!result.ok) return null;
  next.contract = result.contractId ?? next.contract;
  next.journal.push({
    step: requestedStep, at: Math.floor(state.elapsed), chapter: chapter[1],
    message: result.message ?? chapter[2], economySeq: next.economy.seq, war: result.war ?? null,
  });
  next.step++;
  if (next.step === chapters.length) next.running = false;
  return next;
}

export function journeyBrief(state) {
  const next = chapters[state.step];
  const economy = state.economy;
  const field = economy.lots[lot];
  const contract = economy.contracts[state.contract];
  const latest = state.journal.at(-1);
  const minutes = Math.floor(state.elapsed / 60);
  const seconds = String(Math.floor(state.elapsed % 60)).padStart(2, '0');
  const stock = economy.cooperative?.warehouse.trigo ?? 0;
  const balance = economy.cooperative?.treasury ?? 0;
  let property = field.registered ? 'Lote 01 registrado' : field.owner ? 'Lote 01 comprado' : 'Lote 01 livre';
  if (field.crop) property += ' · trigo ' + (4 - Math.max(0, field.readyAt - economy.cycle)) + '/4';
  if (field.stock.trigo) property += ' · ' + field.stock.trigo + ' sacas colhidas';
  if (contract?.status === 'in-transit') {
    const arrived = economy.cycle >= (economy.shipments[state.contract]?.arrival ?? Infinity);
    property = 'Carroça · ' + economy.players[carrier].inventory.trigo
      + (arrived ? ' sacas no armazém · aguardando conferência' : ' sacas em trânsito');
  }
  return {
    title: minutes + ':' + seconds + ' / 15:00 · ' + (latest?.chapter ?? 'Entrada'),
    mission: next ? 'Missão · ' + next[1] + ' · ' + property : 'Missão · Reconstruir a passagem',
    command: latest?.message ?? 'Aguardando entrada na vila',
    balance: 'Moedas · Aurora ' + (economy.players[farmer]?.coins ?? '—')
      + ' | Bento ' + (economy.players[carrier]?.coins ?? '—') + ' | Coop ' + balance + ' · ' + stock + ' sacas',
  };
}
