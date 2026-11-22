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
test('idle or unknown professions do not draw',()=>{
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
