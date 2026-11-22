const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('tree stays rooted at the woodcutter target before actors are drawn',()=>{
 assert.match(html,/g\.translate\(78,407\)/);
 assert.ok(html.indexOf('g.translate(78,407)')<html.indexOf('PetecoWoodcutterRendererV18.draw(g,woodV21'));
 assert.match(html,/tree\(g,25,426,1\.06\)/);
});
test('forestry visual effects require actual actor phases and confirmed ledger',()=>{
 assert.match(html,/if\(worker\.phase==='cut'\)/);
 assert.match(html,/if\(worker\.phase==='carry'&&worker\.ledger&&worker\.ledger\.deliveryConfirmed\)/);
 assert.match(html,/PetecoWoodcutterRendererV18\.draw\(g,woodV21,atlas\.image\)/);
});
