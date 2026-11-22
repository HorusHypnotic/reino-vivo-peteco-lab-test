#!/usr/bin/env node
'use strict';
/* Factory intake: rejects an illustration sheet masquerading as an animated atlas.
 * Uses the existing PNG decoder and never modifies the game or its saves. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {decodePng}=require('./validate-visual-assets.cjs');
const JOBS=new Set(['farm','quarry','construction']);
const STATES=['idle','walk','work','carry'];
function prepare(job,filename,metadata){
 if(!JOBS.has(job))throw Error('unknown profession');
 if(!metadata||metadata.job!==job||metadata.states?.join(',')!==STATES.join(','))throw Error('invalid profession/state contract');
 if(metadata.columns!==4||metadata.rows!==4)throw Error('expected 4x4 atlas: four frames per state');
 if(!metadata.license||!metadata.provenance||!metadata.source)throw Error('license, provenance and source are mandatory');
 const png=decodePng(filename,4,4);
 if(png.width%4||png.height%4)throw Error('atlas dimensions must divide exactly into 4x4');
 if(png.cells.length!==16||png.cells.some(v=>v<20))throw Error('all sixteen frames must be populated');
 if(metadata.sha256&&metadata.sha256!==png.sha256)throw Error('source hash mismatch');
 return Object.freeze({job,asset:path.basename(filename),sha256:png.sha256,width:png.width,height:png.height,grid:{columns:4,rows:4},states:STATES,framesPerState:4,license:metadata.license,provenance:metadata.provenance,source:metadata.source,review:'requires visual pose review and runtime QA'});
}
if(require.main===module){
 try{
  const [job,file,manifest]=process.argv.slice(2);
  if(!job||!file||!manifest)throw Error('usage: node tools/prepare-profession-atlas.cjs <farm|quarry|construction> <atlas.png> <manifest.json>');
  const result=prepare(job,file,JSON.parse(fs.readFileSync(manifest,'utf8')));
  console.log(JSON.stringify(result,null,2));
 }catch(e){console.error('FAIL profession atlas intake:',e.message);process.exitCode=1;}
}
module.exports={prepare,STATES};
