const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const art=html.indexOf('function completedWalls(g,count)');
const scene=html.indexOf('function illustratedVillage(',art);
const end=html.indexOf('function draw(g,s,t,actors)',scene);
const village=html.slice(scene,end);
test('V21 module is loaded before the live simulation script',()=>{
 const moduleAt=html.indexOf('<script src="v20/construction-state.js"></script>');
 const gameAt=html.indexOf('const woodcutterActivity=');
 assert.ok(moduleAt>0&&gameAt>moduleAt);
});
test('real village calls V21 renderer and retains fallback and persistent monument',()=>{
 assert.match(village,/PetecoConstructionV20\.draw\(g,\{project:s\.project,projectGoal:s\.projectGoal,projectCount:s\.projectCount\}/);
 assert.match(village,/completedWalls\(g,s\.projectCount\)/);
});
test('V21 display integration does not change persisted state',()=>{
 assert.doesNotMatch(village,/localStorage|s\.(?:project|projectCount|projectGoal)\s*(?:=|\+\+|--)/);
});

test('six persisted wall completions occupy six scene positions without changing the save',()=>{
 const start=html.indexOf('function completedWalls(g,count)');
 const end=html.indexOf('function projectSite(g,',start);
 const walls=html.slice(start,end);
 assert.match(walls,/const visible=Math\.min\(6,n\)/);
 assert.match(walls,/const row=Math\.floor\(i\/3\),column=i%3/);
 assert.match(walls,/box\(g,x,y-24,21,24/);
 assert.doesNotMatch(walls,/localStorage|(^|[^.\w])save\s*\(/);
});
