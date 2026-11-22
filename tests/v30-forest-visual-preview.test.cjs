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
 assert.equal(phase,states[i]);
 assert.equal(calls[i][1],i*543);
 assert.equal(calls[i][5],47);
 assert.equal(calls[i][6],324);
}
assert.equal(art.draw(ctx,{phase:'idle'},image,1000,{previewState:'invalid'}),'tree');
const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const i=html.indexOf('PetecoArtV17.draw(g,s,s.t,{woodcutter:woodcutterActivity.snapshot()})');
const j=html.indexOf('// Existing V20 professions only appear',i);
assert.ok(i>=0&&j>i);
const scene=html.slice(i,j);
assert.match(scene,/get\('forestqa'\)==='1'/);
assert.match(scene,/PetecoForestArtV19\.draw\(g,worker,forestAtlas\.image,Date\.now\(\),\{x:78,y:407,width:62,height:83,previewState\}\)/);
console.log('PASS: four visual-only atlas frames, canvas positions and V21 QA entrypoint');
