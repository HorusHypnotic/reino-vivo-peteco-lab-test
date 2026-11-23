'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('ADMIN button launches Edge via relay instead of window.open',()=>{
 const html=read('index.html');
 assert.match(html,/live\.textContent = 'Abrir LIVE no Edge'/);
 assert.match(html,/await relay\.openEdge\(\)/);
 assert.doesNotMatch(html,/window\.open\('\/', 'peteco-live'/);
});
test('Edge launch requires authorized local session and uses fixed arguments',()=>{
 const relay=read('tools/live-relay.cjs');
 assert.ok(relay.indexOf("pathname === prefix + 'open-edge'")>relay.indexOf("!authorized(credential, author.token)"));
 assert.match(relay,/process\.platform !== 'win32'/);
 assert.match(relay,/execFile\('cmd\.exe'/);
 assert.match(relay,/origin \+ '\/'/);
 assert.doesNotMatch(relay,/exec\(/);
});
test('client passes session token to fixed launch endpoint',()=>{
 const client=read('live/relay.js');
 assert.match(client,/post\('open-edge', token\)/);
});
