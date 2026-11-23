const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('village chronicles require confirmed wall and delivery events',()=>{
 assert.match(html,/showVillageChronicle\('CAPÍTULO · A MURALHA ERGUIDA'/);
 assert.match(html,/Number\(completed\[1\]\)===s\.projectCount/);
 assert.match(html,/job&&job\.status==='done'&&job\.deferred&&!job\.applied/);
 assert.match(html,/showVillageChronicle\('CAPÍTULO · A VILA TRABALHA'/);
});
test('chronicles are spectator-only, brief and battle-safe',()=>{
 assert.match(html,/if\(!isSpectatorComposition\(\)\|\|!villageChronicleScene/);
 assert.match(html,/until:s\.t\+360/);
 assert.match(html,/if\(!warOnScreen&&s\.phase==='vila'\)drawVillageChronicle\(\)/);
 const scene=html.slice(html.indexOf('// Storytelling is a read-only projection'),html.indexOf('let civicDeliveryScene=null;'));
 assert.doesNotMatch(scene,/localStorage|(^|[^.\w])save\s*\(|s\.wood\s*=|s\.project\s*=|s\.stone\s*=/);
});
