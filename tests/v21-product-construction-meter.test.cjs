const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const construction=fs.readFileSync(path.join(root,'v20/construction-state.js'),'utf8');
const sandbox={};vm.runInNewContext(construction,sandbox);
const renderer=sandbox.PetecoConstructionV20;

test('construction stages derive from persisted project and goal',()=>{
 assert.equal(renderer.derive({project:0,projectGoal:30,projectCount:0}).phase,'idle');
 assert.equal(renderer.derive({project:10,projectGoal:30,projectCount:0}).phase,'foundation');
 assert.equal(renderer.derive({project:20,projectGoal:30,projectCount:0}).phase,'walls');
 assert.equal(renderer.derive({project:29,projectGoal:30,projectCount:0}).phase,'finish');
 assert.equal(renderer.derive({project:0,projectGoal:30,projectCount:1}).phase,'complete');
});

test('live scene passes saved construction fields into the shared renderer',()=>{
 const scene=html.slice(html.indexOf('function draw(g,s,t){'),html.indexOf('// V17.4 territorial view:'));
 assert.match(scene,/v21WallRenderer\.draw\(g,\{project:s\.project,projectGoal:s\.projectGoal,projectCount:0\}/);
 assert.match(scene,/if\(!v21Drawn\)projectSite\(g,s\.project,s\.projectGoal,t\)/);
 assert.doesNotMatch(scene,/s\.(?:project|projectGoal|wood|stone)\s*(?:=|\+\+|--)/);
});
