const channelName = 'peteco-live-projection-v1';

const localView = document.documentElement.dataset.localView;
export const mode = location.protocol === 'http:' && location.hostname === '127.0.0.1'
  && ['direction', 'projection'].includes(localView) ? localView : 'public';

export function openProjection(receive) {
  try {
    const channel = new BroadcastChannel(channelName);
    channel.onmessage = ({data}) => receive(data);
    return data => channel.postMessage(data);
  } catch {
    // Storage events reach other tabs, even without BroadcastChannel.
    // Remove the transport payload immediately. It never becomes a save.
    window.addEventListener('storage', event => {
      if (event.key !== channelName || !event.newValue) return;
      try { receive(JSON.parse(event.newValue)); } catch {}
    });
    return data => {
      try {
        localStorage.setItem(channelName, JSON.stringify(data));
        localStorage.removeItem(channelName);
      } catch {}
    };
  }
}

const publicIds = new Set(['world', 'stage-status']);
export function isolateStage() {
  document.body.classList.add('viewer');
  const main = document.querySelector('main');
  const backstage = document.createDocumentFragment();
  for (const node of [...main.children]) {
    if (node.classList.contains('viewer-stage') || publicIds.has(node.id)) continue;
    backstage.append(node);
  }
  for (const node of [...document.body.children]) {
    if (node !== main && node.tagName !== 'SCRIPT') backstage.append(node);
  }
  // The existing engine can still update its internal reporting elements.
  return backstage;
}

export function previewStorage() {
  const changes = new Map();
  return {
    getItem(key) {
      if (changes.has(key)) return changes.get(key);
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    setItem(key, value) { changes.set(key, String(value)); },
    removeItem(key) { changes.set(key, null); },
  };
}

export function withDirectionLock(onWait, run) {
  if (!navigator.locks) {
    onWait('Este navegador não oferece o bloqueio necessário para abrir a direção.');
    return;
  }
  onWait('Aguardando a direção local. Se já houver outra aba ADMIN, feche-a para assumir.');
  navigator.locks.request('peteco-village-author-v1', async () => {
    await run();
    // This document owns the simulation for its entire lifetime.
    await new Promise(() => {});
  }).catch(error => {
    console.error(error);
    onWait('A direção local falhou ao iniciar. Recarregue o ADMIN.');
  });
}
