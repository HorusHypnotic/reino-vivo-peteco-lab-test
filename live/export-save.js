import {exportSave} from './save-transfer.js';

document.getElementById('export-save').onclick = () => {
  const status = document.getElementById('save-status');
  try {
    const backup = exportSave(localStorage);
    if (!Object.keys(backup.saves).length) {
      status.textContent = 'Nenhum salvamento da vila encontrado neste navegador.';
      return;
    }
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup)], {type: 'application/json'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reino-vivo-vila.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    status.textContent = 'Cópia preparada para o ADMIN local.';
  } catch {
    status.textContent = 'Não foi possível ler o salvamento deste navegador.';
  }
};
