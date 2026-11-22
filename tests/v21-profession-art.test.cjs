const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../v20/profession-renderer.js'),'utf8');
function context(){const c={};vm.runInNewContext(source,c);return c.PetecoProfessionRendererV20;}
function mock(){const calls=[];const g={save(){},restore(){},translate(){},scale(){},beginPath(){},ellipse(){},fill(){},moveTo(){},lineTo(){},closePath(){},stroke(){},rotate(){},set fillStyle(x){},set strokeStyle(x){},set lineWidth(x){},set lineCap(x){}};return {g,calls};}
test('all three existing professions render in walk, work and return',()=>{
 const renderer=context();
 for(const job of ['farm','quarry','construction'])for(const phase of ['walk','work','return']){
  const {g}=mock();assert.equal(renderer.draw(g,{job,phase,x:180,y:320},120),true,job+' '+phase);
 }
});
test('idle falls back when no painted atlas exists; unknown professions never draw',()=>{
 const renderer=context(),{g}=mock();
 assert.equal(renderer.draw(g,{job:'farm',phase:'idle',x:0,y:0},1),false);
 assert.equal(renderer.draw(g,{job:'imaginary',phase:'work',x:0,y:0},1),false);
 assert.equal(renderer.draw(g,{job:'farm',phase:'work',x:NaN,y:0},1),false);
});
test('visual art remains read-only, with job-specific tools and cargo',()=>{
 assert.match(source,/a\.job==='farm'/);
 assert.match(source,/a\.job==='quarry'/);
 assert.match(source,/a\.job==='construction'/);
 assert.match(source,/a\.phase==='return'/);
 assert.doesNotMatch(source,/localStorage|indexedDB|\.food\s*[+\-]?=|\.stone\s*[+\-]?=/);
});
test('painted profession atlases are loaded only by v20 canary and displayed in the real V18 village map',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 assert.match(html,/get\('v20'\)!=='1'\)return/,'normal play does not fetch the experimental profession atlases');
 assert.match(html,/PetecoVisualFactoryV18\.get\(job\)/,'atlas paths come from the canonical asset catalog');
 assert.match(html,/registerAtlas\(job,image,spec\.render\)/,'loaded atlas is registered with the existing renderer');
 assert.match(html,/get\('v20'\)==='1'\)\);const sceneClean/,'v20 canary opens the same illustrated village scene');
 assert.match(html,/if\(factoryV20&&window\.PetecoProfessionRendererV20&&new URLSearchParams\(location\.search\)\.get\('v20'\)==='1'\)/,'workers draw from controller snapshots only in the canary');
});
