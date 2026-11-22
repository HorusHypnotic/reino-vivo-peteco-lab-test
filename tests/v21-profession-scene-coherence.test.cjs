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
 assert.deepEqual([map.route('farm').target.x,map.route('farm').target.y],[322,390]);
 assert.deepEqual([map.route('quarry').target.x,map.route('quarry').target.y],[328,345]);
 assert.deepEqual([map.route('construction').target.x,map.route('construction').target.y],[183,311]);
 assert.match(html,/cropField\(g,322,390,s\.sectors&&s\.sectors\.farm,t\)/);
 assert.match(html,/quarryFace\(g,328,345,s\.stone,t\)/);
 assert.match(html,/village-environment\.svg/);
 assert.match(html,/root\.PetecoV18Houses&&root\.PetecoV18Houses\[slot\]/);
 assert.match(html,/status\.stage===3&&status\.integrity>=70&&frame&&frame\.ready/);
 assert.match(html,/slot==='northwest'&&houseAtlas&&houseAtlas\.ready&&root\.PetecoStructureRendererV18/);
 assert.match(html,/root\.PetecoStructureRendererV18\.draw\(g,status,houseAtlas\.image,layout\)/);
 assert.match(html,/painted house atlas/);
});
test('V21 woodcutter is translated onto forest without changing V18 controller',()=>{
 assert.match(html,/const woodV21=\{\.\.\.worker,x:110\+\(worker\.x-200\)\*\(32\/82\),y:449\+\(worker\.y-404\)\*\(42\/114\),facing:/);
 const transform=(x,y)=>({x:110+(x-200)*(32/82),y:449+(y-404)*(42/114)});
 assert.ok(Math.abs(transform(118,290).x-78)<1e-8);
 assert.ok(Math.abs(transform(118,290).y-407)<1e-8);
 assert.deepEqual(transform(200,404),{x:110,y:449});
 assert.match(html,/PetecoWoodcutterRendererV18\.draw\(g,woodV21,atlas\.image\)/);
});
test('continuous production does not scatter decorative gold particle squares over the forest',()=>{
 const harvest=html.match(/function harvest\(\)\{[\s\S]*?\nfunction action\(/)?.[0]||'';
 assert.ok(harvest.includes('progress()'));
 assert.doesNotMatch(harvest,/burst\(/,'harvest no longer emits unrelated screen-wide particles; confirmed work remains visible through the worker and atlas states');
 assert.doesNotMatch(html,/if\(s\.busy&&s\.t%14===0\)burst\(82,255,3/,'continuous busy state no longer scatters decorative particles');
 assert.match(html,/if\(worker\.phase==='cut'\)/,'forest chips remain tied to actual cutting activity');
});
