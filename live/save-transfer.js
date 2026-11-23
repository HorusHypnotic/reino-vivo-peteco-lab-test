const keys = [
  'peteco-v36-journey-v1',
  'reino_muted', 'reino_music_volume', 'reino_effects_volume',
  'peteco-lab-vila-v2', 'peteco-lab-v7-life-experiment', 'peteco-lab-v7-narrative',
  'peteco-lab-anomalies-v1', 'peteco-lab-audio-enabled-v1', 'peteco-lab-civic-economy-v1',
  'peteco-lab-civic-v1', 'peteco-lab-collective-checkpoint-v1', 'peteco-lab-crowd-round-v1',
  'peteco-lab-delivery-v1', 'peteco-lab-diplomacy-v1', 'peteco-lab-faction-war-v1',
  'peteco-lab-factions-crowd-v1', 'peteco-lab-factions-v1', 'peteco-lab-labor-trade-v1',
  'peteco-lab-social-market-v1', 'peteco-lab-village-trade-v1', 'peteco-lab-war-territory-v1',
];

export function exportSave(storage) {
  const entries = keys.map(key => [key, storage.getItem(key)]).filter(([, value]) => value !== null);
  return {version: 1, saves: Object.fromEntries(entries)};
}

export function importSave(storage, backup) {
  if (backup?.version !== 1 || !backup.saves || Array.isArray(backup.saves)
      || typeof backup.saves !== 'object') throw new Error('Arquivo de salvamento inválido.');
  const entries = Object.entries(backup.saves);
  if (!entries.length || entries.some(([key, value]) => !keys.includes(key) || typeof value !== 'string')) {
    throw new Error('Arquivo sem salvamentos válidos da vila.');
  }
  if (keys.some(key => storage.getItem(key) !== null)) {
    throw new Error('Já há progresso neste endereço. A importação foi cancelada para preservá-lo.');
  }
  const written = [];
  try {
    for (const [key, value] of entries) {
      JSON.parse(value);
      storage.setItem(key, value);
      written.push(key);
    }
  } catch {
    for (const key of written) storage.removeItem(key);
    throw new Error('Não foi possível importar. O salvamento anterior foi preservado.');
  }
}

export function offerImport(container) {
  if (Object.keys(exportSave(localStorage).saves).length) return;
  return new Promise(resolve => {
    const form = document.createElement('form');
    form.innerHTML = '<p>Começar uma vila ou importar o salvamento baixado no QA público.</p><label>Salvamento da vila <input type="file" accept="application/json,.json" required></label> <button>Importar</button> <button type="button">Começar vila</button><p role="status"></p>';
    const finish = () => { form.remove(); resolve(); };
    form.querySelector('[type=button]').onclick = finish;
    form.onsubmit = async event => {
      event.preventDefault();
      const input = form.querySelector('input');
      const buttons = [...form.querySelectorAll('button')];
      buttons.forEach(button => { button.disabled = true; });
      try {
        const file = input.files[0];
        if (!file || file.size > 5_000_000) throw new Error('Escolha um arquivo de salvamento de até 5 MB.');
        importSave(localStorage, JSON.parse(await file.text()));
        finish();
      } catch (error) {
        form.querySelector('[role=status]').textContent = error.message;
        buttons.forEach(button => { button.disabled = false; });
      }
    };
    container.after(form);
  });
}
