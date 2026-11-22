const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const scene=html.slice(html.indexOf('function illustratedVillage('),html.indexOf('function draw(g,s,t,actors){'));
test('first-minute village identifies activity through illustrated sectors without billboards',()=>{
 assert.match(scene,/cropField\(g,322,390,s\.sectors&&s\.sectors\.farm,t\)/);
 assert.match(scene,/quarryFace\(g,328,345,s\.stone,t\)/);
 assert.doesNotMatch(scene,/siteLabel\(|fillText\(/);
 assert.match(scene,/PetecoConstructionV20\.draw\(g,\{project:s\.project/);
});
test('worksite labels are scene-only and leave economy untouched',()=>{
 assert.doesNotMatch(scene,/localStorage|s\.food\s*=|s\.wood\s*=|s\.stone\s*=|s\.project\s*=/);
 assert.ok(scene.indexOf('tree(g,78,407,1,worker||null,t)')>=0);
 assert.ok(scene.indexOf('cropField(g,322,390')>=0);
});
test('idle residents stay bounded and economic actors own purposeful movement',()=>{
 assert.doesNotMatch(scene,/Math\.sin\(t\/115\+i\*1\.8\)/);
 assert.match(html,/PetecoProfessionRendererV20\.draw\(g,actor\.snapshot\(\),s\.t\)/);
});
