'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '..', 'v7/reino-sound.js'), 'utf8') + '\nglobalThis.__Sound = Sound;';
const handlers = {};
class AudioContext {
  constructor() { this.state = 'suspended'; this.currentTime = 0; this.sampleRate = 22050; this.destination = {}; AudioContext.instances.push(this); }
  resume() { this.state = 'running'; this.resumeCount = (this.resumeCount || 0) + 1; return Promise.resolve(); }
  createGain() { return { gain: { setTargetAtTime() {}, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() { return this; }, disconnect() { return this; } }; }
  createDynamicsCompressor() { return { threshold: { value: 0 }, ratio: { value: 0 }, connect() { return this; } }; }
  createAnalyser() { return { fftSize: 0, getFloatTimeDomainData(a) { a.fill(0); }, connect() { return this; } }; }
  createBuffer(_channels, length) { const data = new Float32Array(length); return { getChannelData() { return data; } }; }
  createBufferSource() { return { connect() { return this; }, start() {}, stop() {}, disconnect() { return this; } }; }
  createOscillator() { return { frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() { return this; }, start() {}, stop() {}, disconnect() { return this; } }; }
  createBiquadFilter() { return { frequency: { value: 0 }, Q: { value: 0 }, connect() { return this; }, disconnect() { return this; } }; }
}
AudioContext.instances = [];
const sandbox = {
  AudioContext, Float32Array, Math, Number, String, Map, URLSearchParams,
  localStorage: { getItem() { return null; }, setItem() {} },
  window: { AudioContext, dispatchEvent() {}, addEventListener() {} },
  document: { addEventListener(type, fn) { handlers[type] = fn; } },
  Event: class Event {},
};
sandbox.globalThis = sandbox;
vm.runInNewContext(source, sandbox);
(async () => {
  const sound = sandbox.__Sound;
  await sound.unlock();
  const context = AudioContext.instances[0];
  assert.equal(context.state, 'running');
  context.state = 'suspended';
  await sound.unlock(); // same entry point used after a user gesture on resume
  assert.equal(context.state, 'running');
  assert.equal(context.resumeCount, 2);
  assert.equal(sound.status().state, 'running');
  assert.equal(typeof handlers.pointerdown, 'function');
  assert.equal(typeof handlers.keydown, 'function');
  console.log('PASS audio context resumes after suspension through the next user gesture');
})().catch(error => { console.error(error); process.exitCode = 1; });
