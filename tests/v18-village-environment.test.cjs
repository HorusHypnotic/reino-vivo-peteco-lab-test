'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');

const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'v18/assets/village-scene.svg'),'utf8');
const environment=fs.readFileSync(path.join(root,'v18/assets/village-environment.svg'),'utf8');

test('canonical V18 environment keeps the illustrated village and removes baked-in figures and temporary work sign',()=>{
 for(const transform of ['translate(150 600)','translate(540 585)','translate(360 855)','translate(525 875)'])assert.ok(environment.includes(transform));
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
