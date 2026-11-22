const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const source=fs.readFileSync(path.join(root,'v20/construction-state.js'),'utf8');
const sandbox={};vm.runInNewContext(source,sandbox);
const renderer=sandbox.PetecoConstructionV20;

test('physical foundation, wall and finish stages follow saved work',()=>{
 for(const [progress,phase] of [[0,'idle'],[1,'foundation'],[10,'foundation'],[11,'walls'],[20,'walls'],[21,'finish'],[29,'finish']])
  assert.equal(renderer.derive({project:progress,projectGoal:30,projectCount:0}).phase,phase,`${progress}/30`);
});

test('renderer only draws state and keeps completed wall separate from new work',()=>{
 const scene=html.slice(html.indexOf('function draw(g,s,t){'),html.indexOf('// V17.4 territorial view:'));
 assert.match(scene,/v21WallRenderer\.draw\(g,\{project:s\.project,projectGoal:s\.projectGoal,projectCount:0\}/);
 assert.match(scene,/completedWalls\(g,s\.projectCount\)/);
 assert.match(source,/const d=derive\(state\)/);
 assert.match(source,/completedSlots=Math\.min\(hasNext\?/);
 assert.doesNotMatch(source,/localStorage|s\.wood\s*=|s\.stone\s*=|s\.projectCount\s*=/);
});
