const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const scene=fs.readFileSync(path.join(root,'v20/scene-map.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
test('profession routes land on actual V21 visible production sites',()=>{
 const context={};vm.runInNewContext(scene,context);
 const map=context.PetecoSceneMapV20;
 assert.equal(map.validate(),true);
 assert.deepEqual([map.route('farm').target.x,map.route('farm').target.y],[286,420]);
 assert.deepEqual([map.route('quarry').target.x,map.route('quarry').target.y],[315,314]);
 assert.deepEqual([map.route('construction').target.x,map.route('construction').target.y],[183,311]);
 assert.match(html,/garden\(g,286,420,t\)/);
 assert.match(html,/Quarry: visible stone deposits/);
});
test('V21 woodcutter is translated onto forest without changing V18 controller',()=>{
 assert.match(html,/const woodV21=\{\.\.\.worker,x:200\+\(worker\.x-200\)\*\(122\/82\),y:404\+\(worker\.y-404\)\*\(-3\/114\),facing:/);
 const transform=(x,y)=>({x:200+(x-200)*(122/82),y:404+(y-404)*(-3/114)});
 assert.ok(Math.abs(transform(118,290).x-78)<1e-8);
 assert.ok(Math.abs(transform(118,290).y-407)<1e-8);
 assert.deepEqual(transform(200,404),{x:200,y:404});
 assert.match(html,/PetecoWoodcutterRendererV18\.draw\(g,woodV21,atlas\.image\)/);
});
