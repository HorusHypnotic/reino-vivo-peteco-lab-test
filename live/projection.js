import {watchRelay} from './relay.js';
import {openProjection} from './session.js';

const displayIds = [
  'wood', 'food', 'stone', 'level', 'stage-status',
  'viewer-hero', 'viewer-mission', 'viewer-cue', 'viewer-bag',
];

export function publishScene(canvas, render, audio, relay) {
  const source = crypto.randomUUID();
  let sequence = 0;
  let lastSent = 0;
  let lastRequest = 0;
  const fallback = openProjection(message => {
    if (message?.type !== 'request') return;
    lastRequest = performance.now();
    // The viewer's clock also keeps the stage moving when ADMIN is hidden.
    if (document.hidden) render();
  });

  relay?.listen(() => {
    lastRequest = performance.now();
    if (document.hidden) render();
  });

  return () => {
    const now = performance.now();
    if (!lastRequest || now - lastRequest > 2500 || now - lastSent < 80) return;
    lastSent = now;
    try {
      const frame = {
        type: 'frame', source, sequence: ++sequence,
        picture: canvas.toDataURL('image/webp', 0.92),
        labels: displayIds.map(id => document.getElementById(id).textContent),
        audio: audio(),
      };
      relay?.send(frame);
      fallback(frame);
    } catch (error) {
      console.error('Falha na projeção da LIVE', error);
    }
  };
}

export function watchScene(canvas, onAudio, onDisconnect, useRelay = false) {
  const status = document.getElementById('stage-status');
  const ctx = canvas.getContext('2d');
  let source = null;
  let sequence = 0;
  let lastFrame = 0;
  let pending = null;
  let drawing = false;

  function drawNext() {
    if (!pending) return;
    const frame = pending;
    pending = null;
    drawing = true;
    const picture = new Image();
    picture.onload = () => {
      if (frame.source === source) {
        ctx.drawImage(picture, 0, 0, canvas.width, canvas.height);
        displayIds.forEach((id, index) => {
          const label = document.getElementById(id);
          if (label.textContent !== frame.labels[index]) label.textContent = frame.labels[index];
        });
        onAudio(frame);
      }
      drawing = false;
      drawNext();
    };
    picture.onerror = () => {
      drawing = false;
      drawNext();
    };
    picture.src = frame.picture;
  }

  let lastRelay = -Infinity;
  function receive(frame) {
    if (frame?.type !== 'frame' || typeof frame.source !== 'string'
      || !Number.isSafeInteger(frame.sequence) || frame.sequence < 1
      || !/^data:image\/(webp|png);base64,/.test(frame.picture)
      || !Array.isArray(frame.labels) || frame.labels.length !== displayIds.length
      || !frame.labels.every(label => typeof label === 'string')) return;
    if (frame.source !== source) {
      source = frame.source;
      sequence = 0;
    }
    if (frame.sequence <= sequence) return;
    sequence = frame.sequence;
    lastFrame = performance.now();
    pending = frame;
    if (!drawing) drawNext();
  }
  const send = openProjection(frame => {
    if (performance.now() - lastRelay > 1500) receive(frame);
  });
  if (useRelay) watchRelay(frame => {
    lastRelay = performance.now();
    receive(frame);
  });

  status.textContent = 'Aguardando a direção local';
  document.getElementById('viewer-cue').textContent = status.textContent;
  function request() {
    if (lastFrame && performance.now() - lastFrame > 2500) {
      lastFrame = 0;
      status.textContent = 'Reconectando à direção local';
      document.getElementById('viewer-cue').textContent = status.textContent;
      onDisconnect();
    }
    if (!document.hidden) send({type: 'request'});
  }
  request();
  setInterval(request, 1000 / 24);
}
