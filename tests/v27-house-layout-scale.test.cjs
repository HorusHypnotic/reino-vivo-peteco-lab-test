'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../v18/structure-renderer.js'),'utf8'),ctx);
const renderer=ctx.PetecoStructureRendererV18;
const image={complete:true,naturalWidth:2172,naturalHeight:724},calls=[];
const g={save(){},restore(){},drawImage(...a){calls.push(a)},set imageSmoothingEnabled(v){}};
for(const layout of [{x:75,y:302,width:54,height:50},{x:270,y:302,width:55,height:50},{x:180,y:430,width:72,height:65}]){
 assert.equal(renderer.draw(g,{stage:3,integrity:100},image,layout),'complete');
}
assert.equal(calls.length,3);
for(const [i,layout] of [{x:75,y:302,width:54,height:50},{x:270,y:302,width:55,height:50},{x:180,y:430,width:72,height:65}].entries()){
 const a=calls[i],width=Math.min(94,layout.width*1.45),height=Math.min(126,layout.height*1.75);
 assert.equal(a[7],width);assert.equal(a[8],height);assert.equal(a[5],layout.x-width/2);
}
assert.ok(calls[2][7]>calls[0][7],'larger southern plot should draw a larger illustrated house');
assert.equal(renderer.frameFor({stage:0,integrity:100}).state,'foundation');
assert.equal(renderer.frameFor({stage:2,integrity:100}).state,'construction');
assert.equal(renderer.frameFor({stage:3,integrity:40}).state,'damaged');
console.log('PASS: illustrated houses respect plot sizes and persisted construction states');
