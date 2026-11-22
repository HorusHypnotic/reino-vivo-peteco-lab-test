const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const controller={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../v18/woodcutter-controller.js'),'utf8'),controller);
test('V31 actual V21 renderer displays the chopping trunk in the same branch as its woodcutter',()=>{
 const start=html.indexOf('else if(worldMapEnabled&&!eventCloseup)');const end=html.indexOf('}else if(eventCloseup',start);const branch=html.slice(start,end);
 assert.ok(start>0&&end>start);assert.ok(branch.includes('PetecoArtV17.draw(g,s,s.t)'));
 assert.ok(branch.includes("PetecoV27Forest.draw(g,{x:100,y:407,size:.64},worker.phase==='cut'?'gather':null)"));
 assert.ok(branch.indexOf('PetecoV27Forest.draw')<branch.indexOf('PetecoWoodcutterRendererV18.draw'));
 assert.ok(branch.includes("facing:worker.phase==='cut'?1:worker.facing"));
 assert.ok(branch.includes('const px=94+i*3'));
});
test('V31 mapped cut point reaches visible trunk without altering the controller',()=>{
 const cut=controller.PetecoWoodcutterV18.TREE;
 const x=200+(cut.x-200)*(122/82),y=404+(cut.y-404)*(-3/114);
 assert.equal(x,78);assert.equal(y,407);assert.ok(Math.hypot(100-x,407-y)<=28);
 const actor=controller.PetecoWoodcutterV18.create();assert.equal(actor.snapshot().phase,'idle');
});
