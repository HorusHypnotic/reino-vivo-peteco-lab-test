#!/usr/bin/env node
'use strict';
/* One reproducible command builds and verifies the current shared art batch. */
const path=require('node:path');
const {build}=require('./build-profession-atlas.cjs');
const ROOT=path.resolve(__dirname,'..');
const JOBS=Object.freeze([
 Object.freeze({job:'farm',source:'v20/art-source/farmer-source.png',manifest:'v20/art-manifests/farm.json',output:'v20/assets/professions/farmer.png'}),
 Object.freeze({job:'quarry',source:'v20/art-source/miner-source.png',manifest:'v20/art-manifests/quarry.json',output:'v20/assets/professions/miner.png'}),
 Object.freeze({job:'construction',source:'v20/art-source/builder-source.png',manifest:'v20/art-manifests/construction.json',output:'v20/assets/professions/builder.png'})
]);
function buildAll(root=ROOT,outputRoot=root){return JOBS.map(item=>build(item.job,path.join(root,item.source),path.join(root,item.manifest),path.join(outputRoot,item.output)));}
if(require.main===module){try{const results=buildAll();for(const x of results)console.log(`PASS ${x.job}: ${x.asset} ${x.width}x${x.height} RGBA 4x4 sha256=${x.sha256}`);}catch(e){console.error('FAIL profession batch:',e.message);process.exitCode=1;}}
module.exports={JOBS,buildAll};
