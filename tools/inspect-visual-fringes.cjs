#!/usr/bin/env node
'use strict';
/* Read-only diagnostic for suspicious chroma-key/red fringes. Does not claim that
 * all red pixels are defects: red clothing and props can be legitimate. */
const path=require('node:path'),fs=require('node:fs');
const {decodePng,loadCatalog}=require('./validate-visual-assets.cjs');
const ROOT=path.resolve(__dirname,'..');
function inspect(file){
 const {width,height,pixels}=decodePng(file,4,4,true);
 let redVisible=0,redStrong=0,redNearTransparent=0,semiTransparent=0,visible=0;
 for(let i=0;i<pixels.length;i+=4){
  const r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];
  if(a>0)visible++;
  if(a>0&&a<128)semiTransparent++;
  const red=r>150&&r>g*1.8&&r>b*1.6;
  if(red&&a>0){redVisible++;if(a>=128)redStrong++;else redNearTransparent++;}
 }
 return {width,height,visible,semiTransparent,redVisible,redStrong,redNearTransparent,
  redFractionOfVisible:Number((redVisible/Math.max(1,visible)).toFixed(5))};
}
function main(){
 const catalog=loadCatalog();
 for(const job of ['woodcutter','farm','quarry','construction']){
  const asset=catalog.get(job).asset,result=inspect(path.join(ROOT,asset));
  console.log(JSON.stringify({job,asset,...result}));
 }
 console.log('DIAGNOSTIC ONLY: inspect suspected red spill against character silhouettes before deleting any pixel.');
}
if(require.main===module){try{main();}catch(e){console.error(e);process.exitCode=1;}}
module.exports={inspect};
