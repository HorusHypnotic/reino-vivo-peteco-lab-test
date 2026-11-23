const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('recap uses only saved world history and runs once per viewer session',()=>{
 assert.match(html,/let villageRecapShown=false/);
 assert.match(html,/function maybeShowVillageRecap\(warOnScreen\)/);
 assert.match(html,/villageRecapShown\|\|s\.t<120\|\|warOnScreen/);
 assert.match(html,/const history=Array\.isArray\(s\.events\)\?s\.events:\[\]/);
 assert.match(html,/showVillageChronicle\('ANTES DE VOCÊ CHEGAR\.\.\.'/);
 assert.match(html,/maybeShowVillageRecap\(warOnScreen\)/);
});
test('recap has no game-state or persistence side effects',()=>{
 const start=html.indexOf('function maybeShowVillageRecap(warOnScreen){');
 const end=html.indexOf('function drawVillageChronicle(){',start);
 assert.ok(start>=0&&end>start);
 assert.doesNotMatch(html.slice(start,end),/localStorage|save\(|s\.events\.push|s\.project\s*=|s\.wood\s*=|s\.stone\s*=/);
});
