const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const controller={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../v18/woodcutter-controller.js'),'utf8'),controller);
test('V34 actual V21 renderer keeps one visible trunk aligned with the V18 woodcutter',()=>{
 const start=html.indexOf('else if(worldMapEnabled&&!eventCloseup)');const end=html.indexOf('}else if(eventCloseup',start);const branch=html.slice(start,end);
 assert.ok(start>0&&end>start);assert.ok(branch.includes('PetecoArtV17.draw(g,s,s.t,{woodcutter:woodcutterActivity.snapshot()})'));
 assert.ok(branch.includes('V34: PetecoArtV17 already renders the real trunk at (78,407).'));
 assert.ok(!branch.includes('PetecoV27Forest.draw(g,{x:100,y:407,size:.64}'),'the duplicate overlay removed by V34 must stay absent');
 assert.ok(branch.includes('g.translate(woodV21.x,woodV21.y);g.scale(.52,.52)'));
 assert.ok(branch.includes("facing:worker.phase==='cut'?1:worker.facing"));
 assert.ok(branch.includes('const px=78+i*3'));
});
test('V31 mapped cut point reaches visible trunk without altering the controller',()=>{
 const cut=controller.PetecoWoodcutterV18.TREE;
 const x=110+(cut.x-200)*(32/82),y=449+(cut.y-404)*(42/114);
 assert.equal(x,78);assert.equal(y,407);assert.ok(Math.hypot(100-x,407-y)<=28);
 const actor=controller.PetecoWoodcutterV18.create();assert.equal(actor.snapshot().phase,'idle');
});
