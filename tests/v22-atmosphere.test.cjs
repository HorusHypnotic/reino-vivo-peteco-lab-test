const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const sandbox={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../v22/atmosphere.js'),'utf8'),sandbox);
test('contact shadow uses balanced canvas state and foot anchor',()=>{
 const calls=[];const g={save:()=>calls.push('save'),restore:()=>calls.push('restore'),beginPath:()=>calls.push('begin'),ellipse:(...a)=>calls.push(a),fill:()=>calls.push('fill')};
 assert.equal(sandbox.PetecoV22Atmosphere.groundShadow(g,20,30,9,3),true);
 assert.deepEqual(calls[3],[20,32,9,3,0,0,Math.PI*2]);
 assert.equal(calls.at(-1),'restore');
 assert.equal(sandbox.PetecoV22Atmosphere.groundShadow(g,NaN,30),false);
});
test('V7 viewer includes visual-only grounding for home and actors',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 assert.ok(html.includes('src="v22/atmosphere.js"'));
 assert.ok(html.includes('groundShadow(g,h.x,h.y,25,7)'));
 assert.ok(html.includes('groundShadow(g,px,py,9,3)'));
});
