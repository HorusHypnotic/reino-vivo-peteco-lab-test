'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');

const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'v18/assets/village-scene.svg'),'utf8');
const environment=fs.readFileSync(path.join(root,'v18/assets/village-environment.svg'),'utf8');
const houses=path.join(root,'v18/assets/houses');
const factory=fs.readFileSync(path.join(root,'v18/visual-factory.js'),'utf8');

test('canonical V18 environment keeps the illustrated village and removes baked-in figures and temporary work sign',()=>{
 for(const transform of ['translate(150 600)','translate(540 585)','translate(360 855)']){
  assert.ok(source.includes(transform),'source house art retained');
  assert.ok(!environment.includes(transform),'simulation-owned houses are not baked into the environment');
 }
 for(const name of ['northwest','northeast','south']){
  assert.ok(fs.readFileSync(path.join(houses,name+'.svg'),'utf8').includes('<g transform='));
  assert.ok(factory.includes(`${name}:Object.freeze({id:'v18-house-${name}'`),'house artwork must be registered in the visual factory');
 }
 assert.ok(environment.includes('translate(525 875)'),'decorative workshop remains in the scenic layer');
 for(const transform of ['translate(80 570)','translate(151 653)','translate(345 515)','translate(126 825)','translate(200 801)']){
  assert.ok(source.includes(transform),'source provenance retained');
  assert.ok(!environment.includes(transform),'decorative figure/temporary overlay removed');
 }
 assert.ok(environment.includes('url(#stone)'),'illustrated paths remain');
 assert.ok(!environment.includes('OBRA'),'temporary billboard removed');
});

test('V18 environment asset is reproducible from the recovered source',()=>{
 const result=spawnSync(process.execPath,[path.join(root,'tools/prepare-village-environment.cjs'),'--check'],{encoding:'utf8'});
 assert.equal(result.status,0,result.stderr||result.stdout);
 assert.match(result.stdout,/PASS: V18 environment layer/);
});
