'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const {decodePng}=require('../tools/validate-visual-assets.cjs');
const {build,BASELINE}=require('../tools/prepare-house-atlas.cjs');
const root=path.join(__dirname,'..');
const source=path.join(root,'v18/art-source/medieval-house-states-original.png');
const atlas=path.join(root,'v18/assets/structures/medieval-house-atlas.png');

test('user house art is transparent RGBA, preserves four paintings, cleans the inter-frame fragment and aligns feet',()=>{
 const sourceData=fs.readFileSync(source),sourceHash=crypto.createHash('sha256').update(sourceData).digest('hex');
 assert.equal(sourceHash,'46e3423bed91b646e3fa9a30f6abaac29c59e2d7de962498ed05271feaa0d211');
 const input=decodePng(source,4,1,true);assert.deepEqual([input.width,input.height,input.color],[2172,724,6]);
 assert.ok(input.pixels[(0*input.width+0)*4+3]===0,'checkerboard area is alpha-transparent');
 const result=build(source),current=fs.readFileSync(atlas);assert.ok(result.png.equals(current),'checked-in atlas matches factory output');
 const clean=decodePng(atlas,4,1,true);assert.equal(clean.cells.length,4);assert.ok(clean.cells.every(n=>n>50000));
 for(let frame=0;frame<4;frame++){
  let minY=724,maxY=-1,visible=0;
  for(let y=0;y<724;y++)for(let x=frame*543;x<(frame+1)*543;x++)if(clean.pixels[(y*2172+x)*4+3]>=8){minY=Math.min(minY,y);maxY=Math.max(maxY,y);visible++;}
  assert.ok(visible>50000,`frame ${frame} remains painted`);assert.equal(maxY,BASELINE-1,`frame ${frame} baseline aligned`);assert.ok(minY<maxY);
 }
 assert.ok(result.metrics.states[0].removedBoundaryComponents.some(c=>c.pixels===229));
 for(let y=0;y<724;y++)assert.equal(clean.pixels[(y*2172+542)*4+3],0,'clipped scaffold fragment removed from foundation cell edge');
});

test('house renderer maps persisted stage and integrity to painted states without mutating saves',()=>{
 const box={};for(const file of ['v18/visual-factory.js','v18/structure-renderer.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),box);
 const renderer=box.PetecoStructureRendererV18;
 for(const [state,expected] of [
  [{stage:0,integrity:100},'foundation'],[{stage:1,integrity:100},'construction'],
  [{stage:2,integrity:100},'construction'],[{stage:3,integrity:100},'complete'],
  [{stage:3,integrity:69},'damaged'],[{stage:3,integrity:0},'damaged']
 ]){const before=JSON.stringify(state);assert.equal(renderer.frameFor(state).state,expected);assert.equal(JSON.stringify(state),before);}
 const calls=[],ctx={save(){},restore(){},drawImage(...args){calls.push(args)}};
 const image={complete:true,naturalWidth:2172,naturalHeight:724};
 assert.equal(renderer.draw(ctx,{stage:3,integrity:50},image,{x:75,y:302}),'damaged');
 assert.equal(calls.length,1);assert.equal(calls[0][1],1629);assert.equal(calls[0][2],0);assert.equal(calls[0][5],28);assert.ok(Math.abs(calls[0][6]-(302-126*700/724))<1e-8);assert.equal(calls[0][7],94);assert.equal(calls[0][8],126);
 assert.equal(renderer.draw(ctx,{stage:3,integrity:50},{complete:true,naturalWidth:0,naturalHeight:724},{x:75,y:302}),false);
 assert.equal(renderer.draw(ctx,{stage:3,integrity:50},image,{x:NaN,y:302}),false);
});

test('canonical V21 draws one illustrated house in the real village and keeps existing fallback and other house slots',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const scene=html.slice(html.indexOf('function illustratedVillage('),html.indexOf('function draw(g,s,t,actors){'));
 for(const slot of ["slot:'northwest'","slot:'northeast'","slot:'south'"])assert.ok(scene.includes(slot),`painted slot ${slot}`);
 assert.match(scene,/houseAtlas&&houseAtlas\.ready&&root\.PetecoStructureRendererV18&&root\.PetecoStructureRendererV18\.draw\(g,status,houseAtlas\.image,layout\)/);
 assert.match(scene,/if\(painted\)return/);
 assert.match(html,/Visual asset failed: illustrated house atlas/);
 assert.match(scene,/root\.PetecoV26Architecture\.structureState\(g,status,layout,t\)/);
});
