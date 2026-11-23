// Áudio procedural local. Melodia original; nenhum sample ou gravação externa.
const Sound = (() => {
  const read = (key, fallback) => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, String(value)); } catch {} };
  const clamp = value => Number.isFinite(Number(value)) ? Math.max(0, Math.min(1, Number(value))) : 0;
  let muted = read('reino_muted', '0') === '1', forcedMute = false;
  let musicVolume = clamp(read('reino_music_volume', '0.25'));
  let effectsVolume = clamp(read('reino_effects_volume', '0.55'));
  let ctx, master, musicBus, effectsBus, musicSource, noiseBuffer, analyser;
  let voices = 0, lastEffect = -Infinity;
  const cooldown = new Map();
  const notify = () => window.dispatchEvent(new Event('reino-audio-change'));
  const audible = () => ctx?.state === 'running' && !muted && !forcedMute;
  function mix() {
    if (ctx) {
      master.gain.setTargetAtTime(muted || forcedMute ? 0 : 0.7, ctx.currentTime, 0.025);
      musicBus.gain.setTargetAtTime(musicVolume, ctx.currentTime, 0.025);
      effectsBus.gain.setTargetAtTime(effectsVolume, ctx.currentTime, 0.025);
    }
    notify();
  }
  // 16 compassos em ré dórico, cordas dedilhadas, flauta suave e bordão.
  // Um buffer mono de 32 s (~2,7 MiB) e uma fonte em loop, sem timers musicais.
  function compose() {
    const rate = 22050, seconds = 32;
    const buffer = ctx.createBuffer(1, seconds * rate, rate), data = buffer.getChannelData(0);
    const fluteWave = new Float32Array(2048), stringWave = new Float32Array(2048);
    for (let i=0; i<2048; i++) {
      const phase = 2*Math.PI*i/2048;
      fluteWave[i] = Math.sin(phase);
      stringWave[i] = Math.sin(phase)+0.35*Math.sin(2*phase)+0.12*Math.sin(3*phase);
    }
    const melody = [62,69,65,67,69,65,64,62, 65,72,69,67,65,64,62,57,
      67,69,74,72,69,67,65,64, 65,67,69,64,62,57,60,62];
    const roots = [50,50,48,48,55,55,50,50,53,53,48,48,55,55,50,50];
    function note(midi, at, duration, volume, flute = false) {
      const hz = 440 * 2 ** ((midi - 69) / 12);
      const count = (duration*rate)|0, offset = (at*rate)|0, step = hz*2048/rate;
      const table = flute ? fluteWave : stringWave;
      for (let i = 0; i < count; i++) {
        const attack = i/(rate*0.025), tail = 1-i/count;
        const envelope = (attack<1?attack:1)*(flute?tail:tail*tail*tail);
        data[(offset+i)%data.length] += table[((i*step)|0)&2047]*envelope*volume;
      }
    }
    roots.forEach((root, bar) => {
      note(root - 12, bar * 2, 2, 0.08, true);
      [0,7,12,7].forEach((interval, beat) => note(root + interval, bar * 2 + beat * 0.5, 0.8, 0.12));
    });
    melody.forEach((midi, i) => note(midi + 12, i, 0.85, 0.075, true));
    return buffer;
  }
  function init() {
    if (ctx || forcedMute) return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) { notify(); return; }
    ctx = new Audio();
    master = ctx.createGain(); musicBus = ctx.createGain(); effectsBus = ctx.createGain();
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -12; compressor.ratio.value = 6;
    analyser = ctx.createAnalyser(); analyser.fftSize = 256;
    musicBus.connect(master); effectsBus.connect(master);
    master.connect(compressor).connect(analyser).connect(ctx.destination);
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const samples = noiseBuffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    musicSource = ctx.createBufferSource(); musicSource.buffer = compose(); musicSource.loop = true;
    musicSource.connect(musicBus); musicSource.start();
    ctx.onstatechange = notify;
    mix();
  }
  async function unlock() {
    if (forcedMute) return;
    try { init(); if (ctx?.state === 'suspended') await ctx.resume(); } catch { /* repetir no próximo gesto */ }
    notify();
  }
  // Eventos do servidor nunca abrem o contexto: a liberação vem de um gesto local.
  if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('autoplay') === '1') {
    window.addEventListener('load', unlock, { once: true });
  }
  document.addEventListener('pointerdown', unlock);
  document.addEventListener('keydown', unlock);
  function tone(freq, start, duration, {type='triangle', volume=0.14, end=freq, noise=false} = {}) {
    if (!audible() || effectsVolume === 0 || voices >= 12) return;
    const t = ctx.currentTime + start, source = noise ? ctx.createBufferSource() : ctx.createOscillator();
    const gain = ctx.createGain(), filter = ctx.createBiquadFilter();
    if (noise) { source.buffer = noiseBuffer; filter.type = 'bandpass'; filter.frequency.value = freq; filter.Q.value = 0.7; }
    else { source.type = type; source.frequency.setValueAtTime(freq,t); source.frequency.exponentialRampToValueAtTime(Math.max(20,end),t+duration); filter.type='lowpass'; filter.frequency.value=5000; }
    gain.gain.setValueAtTime(0.0001,t);
    gain.gain.linearRampToValueAtTime(volume,t+0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001,t+duration);
    source.connect(filter).connect(gain).connect(effectsBus);
    voices++;
    source.onended = () => { voices--; source.disconnect(); filter.disconnect(); gain.disconnect(); };
    source.start(t); source.stop(t+duration+0.02);
  }
  function effect(key, notes, interval=350, priority=false) {
    if (!audible() || effectsVolume === 0) return;
    const now = ctx.currentTime;
    if (now - (cooldown.get(key) ?? -Infinity) < interval/1000 || (!priority && now-lastEffect < 0.12)) return;
    cooldown.set(key,now); lastEffect=now;
    notes.forEach(n=>tone(...n));
  }
  const fanfare = [[294,0,0.2],[392,0.2,0.2],[440,0.4,0.2],[587,0.6,0.65]];
  const api = {
    unlock,
    setMuted(value) { muted=Boolean(value); save('reino_muted',muted?'1':'0'); mix(); },
    isMuted:()=>muted,
    forceMute(value) { forcedMute=Boolean(value); mix(); },
    setMusicVolume(value) { musicVolume=clamp(value); save('reino_music_volume',musicVolume); mix(); },
    setEffectsVolume(value) { effectsVolume=clamp(value); save('reino_effects_volume',effectsVolume); mix(); },
    status() { const samples=new Float32Array(256); analyser?.getFloatTimeDomainData(samples); return {state:ctx?.state ?? 'locked',muted,forcedMute,musicVolume,effectsVolume,voices,musicLoop:musicSource?.loop ?? false,rms:Math.sqrt(samples.reduce((s,v)=>s+v*v,0)/samples.length)}; },
    sword:()=>effect('sword',[[2100,0,0.09,{noise:true,volume:0.2}],[880,0.02,0.12,{end:330,volume:0.1}]]),
    arrow:()=>effect('arrow',[[3400,0,0.16,{noise:true,volume:0.16}],[170,0.13,0.07,{volume:0.12}]]),
    impact:()=>effect('impact',[[95,0,0.2,{end:35,volume:0.23}],[600,0,0.12,{noise:true,volume:0.18}]],450),
    construction:()=>effect('construction',[[280,0,0.09],[420,0.18,0.09],[560,0.36,0.15]],1500),
    evolution:()=>effect('evolution',fanfare,2000,true),
    giftLow:()=>effect('magic',[[440,0,0.3,{end:1200}],[880,0.08,0.3,{type:'sine'}]]),
    giftMedium:()=>effect('magic',[[440,0,0.3,{end:1600}],[660,0.15,0.4],[990,0.3,0.4]]),
    giftHigh:()=>effect('magic',[[220,0,0.4,{end:880}],[587,0.15,0.4],[880,0.3,0.6]],650),
    follow:()=>effect('follow',[[440,0,0.12],[660,0.1,0.18]]),
    share:()=>api.arrow(),
    waveCleared:()=>effect('wave',[[523,0,0.08],[659,0.06,0.12]],900),
    bossSpawned:()=>effect('boss',[[147,0,0.55,{type:'sawtooth',volume:0.1}],[110,0.4,0.8,{type:'sawtooth',volume:0.1}],[55,0,0.9,{volume:0.2}]],2000,true),
    bossDefeated:()=>effect('victory',fanfare,1500,true),
    kingdomFall:()=>effect('fall',[[220,0,0.4,{end:110}],[160,0.3,0.6,{end:55}]],2000,true),
    newSeason:()=>effect('season',[[392,0,0.1],[494,0.1,0.1],[587,0.2,0.3]],1500),
    thunder:()=>effect('thunder',[[180,0,0.95,{noise:true,volume:0.35}]],3000),
  };
  return api;
})();
