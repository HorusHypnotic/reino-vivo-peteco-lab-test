const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const art=html.indexOf('function completedWalls(g,count)');
const scene=html.indexOf('function draw(g,s,t)',art);
const end=html.indexOf('function world(g,s,t)',scene);
const village=html.slice(scene,end);
test('V21 module is loaded before the live simulation script',()=>{
 const moduleAt=html.indexOf('<script src="v20/construction-state.js"></script>');
 const gameAt=html.indexOf('const woodcutterActivity=');
 assert.ok(moduleAt>0&&gameAt>moduleAt);
});
test('real village calls V21 renderer and retains fallback and persistent monument',()=>{
 assert.match(village,/v21WallRenderer\.draw\(g,\{project:s\.project,projectGoal:s\.projectGoal,projectCount:0\}/);
 assert.match(village,/if\(!v21Drawn\)projectSite\(g,s\.project,s\.projectGoal,t\)/);
 assert.match(village,/completedWalls\(g,s\.projectCount\)/);
});
test('V21 display integration does not change persisted state',()=>{
 const integration=village.slice(village.indexOf('// V21 renderer'),village.indexOf('foreground(g,t,level)'));
 assert.doesNotMatch(integration,/\bsave\s*\(|localStorage|s\.(?:project|projectCount|projectGoal)\s*(?:=|\+\+|--)/);
});
