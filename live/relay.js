const prefix = '/__live/';

function post(endpoint, token, body, keepalive = false) {
  return fetch(prefix + endpoint, {
    method: 'POST',
    headers: {Authorization: 'Bearer ' + token, ...(body && {'Content-Type': 'application/json'})},
    body,
    keepalive,
  });
}

export async function authorizeDirection(status) {
  const form = document.createElement('form');
  form.innerHTML = '<label>Código ADMIN <input required type="password" autocomplete="off"></label> <button>Assumir direção</button>';
  status.after(form);
  status.textContent = 'Digite o código mostrado no terminal do servidor local.';
  return new Promise(resolve => {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const button = form.querySelector('button');
      button.disabled = true;
      try {
        const response = await post('claim', form.querySelector('input').value.trim());
        if (!response.ok) {
          status.textContent = response.status === 409 ? 'Já existe uma direção ativa.' : 'Código recusado. Confira o terminal e tente novamente.';
          return;
        }
        const {token} = await response.json();
        form.remove();
        resolve(createDirectionRelay(token, status));
      } catch {
        status.textContent = 'Servidor local indisponível. Confira o terminal e tente novamente.';
      } finally {
        button.disabled = false;
      }
    });
  });
}

function createDirectionRelay(token, status) {
  const clock = new EventSource(prefix + 'clock');
  let listeners = () => {}, viewers = 0, sending = false, stopped = false;
  let lastHeartbeat = Date.now(), nextHeartbeat = lastHeartbeat + 3000;
  clock.addEventListener('tick', event => {
    if (Date.now() >= nextHeartbeat) heartbeat();
    viewers = Number(event.data);
    if (viewers) listeners();
  });

  function stop() {
    stopped = true;
    clock.close();
    status.textContent = 'Sessão de direção encerrada. Recarregue o ADMIN para assumir novamente.';
    document.querySelector('main').inert = true;
    document.getElementById('faction-lab').inert = true;
  }

  async function heartbeat() {
    if (stopped) return clearInterval(interval);
    nextHeartbeat = Date.now() + 3000;
    try {
      const started = Date.now();
      const response = await post('heartbeat', token, undefined, true);
      if (response.status === 403) stop();
      if (response.ok) lastHeartbeat = Math.max(lastHeartbeat, started);
    } catch {}
    if (Date.now() - lastHeartbeat >= 25000) stop();
  }
  const interval = setInterval(() => {
    if (Date.now() >= nextHeartbeat) heartbeat();
  }, 3000);

  window.addEventListener('pagehide', () => {
    stop();
    post('release', token, undefined, true).catch(() => {});
  }, {once: true});

  return {
    active: () => !stopped && Date.now() - lastHeartbeat < 25000,
    listen: handler => { listeners = handler; },
    send(frame) {
      if (stopped || sending || !viewers) return;
      sending = true;
      post('frame', token, JSON.stringify(frame)).then(response => {
        if (response.status === 403) stop();
      }).catch(() => {}).finally(() => { sending = false; });
    },
  };
}

export function watchRelay(receive) {
  const events = new EventSource(prefix + 'events');
  events.addEventListener('frame', event => {
    try { receive(JSON.parse(event.data)); } catch {}
  });
}
