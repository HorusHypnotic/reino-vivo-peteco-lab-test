const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('civic delivery scene requires a completed deferred job',()=>{
 assert.match(html,/job&&job\.status==='done'&&job\.deferred&&!job\.applied/);
 assert.match(html,/job\.applied=true;effectSound\(job\.action\)/);
 assert.match(html,/civicDeliveryScene=\{start:s\.t,until:s\.t\+240/);
 assert.match(html,/\[job\.action\]\|\|'ENTREGA CONCLUÍDA'/);
});
test('short scene is hidden during war and does not alter economy or save',()=>{
 assert.match(html,/if\(!warOnScreen&&s\.phase==='vila'\)\{drawCivicDeliveryScene\(\);drawVillageCeremony\(\);\}/);
 assert.match(html,/s\.t>=civicDeliveryScene\.until/);
 const scene=html.slice(html.indexOf('function drawCivicDeliveryScene(){'),html.indexOf('let villageCeremony=null;'));
 assert.doesNotMatch(scene,/(^|[^.\w])save\s*\(|localStorage|civicEconomy\.|s\.wood\s*=|s\.food\s*=/);
});
