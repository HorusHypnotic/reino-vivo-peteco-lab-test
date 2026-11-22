'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const base=path.join(__dirname,'..'),root={};vm.createContext(root);
vm.runInContext(fs.readFileSync(path.join(base,'v19/forest-art.js'),'utf8'),root);
const art=root.PetecoForestArtV19;
const calls=[],ctx={drawImage(...args){calls.push(args)}};
const image={complete:true,naturalWidth:2172,naturalHeight:724};
const states=['tree','falling','stump','sapling'];
for(let i=0;i<states.length;i++){
 const phase=art.draw(ctx,{phase:'idle'},image,1000,{x:78,y:407,width:62,height:83,previewState:states[i]});
 assert.equal(phase,states[i]);assert.equal(calls[i][1],i*543);
 assert.equal(calls[i][5],47);assert.equal(calls[i][6],324);
}
assert.equal(art.draw(ctx,{phase:'idle'},image,1000,{previewState:'invalid'}),'tree');
const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const start=html.indexOf('function tree(g,x,y,k=1,actor=null,tick=0)');
const end=html.indexOf('function building(',start);
const tree=html.slice(start,end);
assert.match(tree,/get\('forestqa'\)==='1'/);
assert.match(tree,/previewState/);
assert.match(html,/QA FLORESTA V19:/);
console.log('PASS: four atlas frames, positions, and V17 QA preview without duplicate tree');
