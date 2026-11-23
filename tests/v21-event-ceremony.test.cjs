const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('ceremony is triggered only by a confirmed wall completion chronicle',()=>{
 assert.match(html,/const completed=t\.match\(\/obra pública concluída! muralha \(\\d\+\)\/\)/);
 assert.match(html,/Number\(completed\[1\]\)===s\.projectCount/);
 assert.match(html,/villageCeremony=\{number:s\.projectCount,start:s\.t,until:s\.t\+300\}/);
 assert.match(html,/chronicle\('Obra pública concluída! Muralha '\+s\.projectCount\+'\.'/);
});
test('ceremony stays transient and never hides battles',()=>{
 assert.match(html,/if\(!warOnScreen&&s\.phase==='vila'\)\{drawCivicDeliveryScene\(\);drawVillageCeremony\(\);\}/);
 assert.match(html,/s\.t>=villageCeremony\.until/);
 const scene=html.slice(html.indexOf('function drawVillageCeremony(){'),html.indexOf('function focusEvent(message){'));
 assert.doesNotMatch(scene,/localStorage|(^|[^.\w])save\s*\(|s\.projectCount\s*\+\+|s\.wood\s*=/);
});
