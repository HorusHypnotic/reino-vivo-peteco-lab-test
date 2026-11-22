const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const scene=html.slice(html.indexOf('function draw(g,s,t){'),html.indexOf('// V17.4 territorial view:'));
test('first-minute village names resource sites and leaves the wall renderer one label',()=>{
 assert.match(scene,/function siteLabel\(name,x,y,w\)/);
 for(const name of ['BOSQUE','PEDREIRA','LAVOURA'])assert.ok(scene.includes("siteLabel('"+name+"'"),name);
 assert.doesNotMatch(scene,/siteLabel\('OBRA'/);
 assert.match(scene,/projectSite\(g,s\.project,s\.projectGoal,t\)/);
 assert.match(scene,/v21WallRenderer\.draw\(g,\{project:s\.project/);
});
test('worksite labels are scene-only and leave economy untouched',()=>{
 const start=scene.indexOf('function siteLabel(name,x,y,w)');
 const end=scene.indexOf(' // The renderer below owns the single worksite label',start);
 const labels=scene.slice(start,end);
 assert.ok(start>=0&&end>start);
 assert.doesNotMatch(labels,/localStorage|s\.food\s*=|s\.wood\s*=|s\.stone\s*=|s\.project\s*=/);
 assert.ok(scene.indexOf("siteLabel('BOSQUE'")>scene.indexOf('g.translate(78,407)'));
 assert.ok(scene.indexOf("siteLabel('LAVOURA'")>scene.indexOf('garden(g,286,420,t)'));
});
test('idle residents stay bounded and economic actors own purposeful movement',()=>{
 assert.match(scene,/const residents=Math\.min\(3,Math\.max\(1,Math\.floor\(population\/35\)\)\)/);
 assert.match(scene,/const resting=\[\[109,348\],\[252,348\],\[188,365\]\]/);
 assert.doesNotMatch(scene,/Math\.sin\(t\/115\+i\*1\.8\)/);
});
