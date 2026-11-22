const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('illustrated trunk stays rooted at the mapped woodcutter target before actors are drawn',()=>{
 assert.match(html,/tree\(g,78,407,1,worker\|\|null,t\)/);
 assert.ok(html.indexOf('tree(g,78,407,1,worker||null,t)')<html.indexOf('PetecoWoodcutterRendererV18.draw(g,woodV21'));
 assert.match(html,/village-environment\.svg/);
});
test('forestry visual effects require actual actor phases and confirmed ledger',()=>{
 assert.match(html,/if\(worker\.phase==='cut'\)/);
 assert.match(html,/if\(worker\.phase==='carry'&&worker\.ledger&&worker\.ledger\.deliveryConfirmed\)/);
 assert.match(html,/PetecoWoodcutterRendererV18\.draw\(g,woodV21,atlas\.image\)/);
});
