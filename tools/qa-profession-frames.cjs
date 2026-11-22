#!/usr/bin/env node
'use strict';
/* Read-only visual QA for actual normalized 4x4 atlases.
 * Metrics are diagnostics, not proof of natural motion or clean edges. */
const path=require('node:path');
const {decodePng,loadCatalog}=require('./validate-visual-assets.cjs');
const ROOT=path.resolve(__dirname,'..');
function inspect(file){
 const {width,height,pixels}=decodePng(file,4,4,true);
 if(width%4||height%4)throw Error('expected exact 4x4 cells');
 const cw=width/4,ch=height/4,frames=[],states=['idle','walk','work','carry'];
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){
  let red=0,strong=0,opaque=0,semi=0,visible=0,redEdge=0;
  for(let y=row*ch;y<(row+1)*ch;y++)for(let x=col*cw;x<(col+1)*cw;x++){
   const i=(y*width+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];
   if(!a)continue;visible++;if(a>=128)opaque++;else semi++;
   const suspicious=r>150&&r>g*1.8&&r>b*1.6;
   if(suspicious){red++;if(a>=128)strong++;
    if(x-col*cw<8||((col+1)*cw-1-x)<8||y-row*ch<8||((row+1)*ch-1-y)<8)redEdge++;
   }
  }
  frames.push({state:states[row],frame:col,visible,semi,red,strong,redEdge,redRatio:+(red/Math.max(1,visible)).toFixed(5)});
 }
 const deltas=[];
 for(let row=0;row<4;row++)for(let col=0;col<3;col++){
  let changed=0,union=0;
  for(let y=0;y<ch;y+=2)for(let x=0;x<cw;x+=2){
   const a=((row*ch+y)*width+col*cw+x)*4,b=a+cw*4;
   const aa=pixels[a+3],bb=pixels[b+3];
   if(aa>24||bb>24){union++;if(Math.abs(aa-bb)>40||Math.abs(pixels[a]-pixels[b])>35||Math.abs(pixels[a+1]-pixels[b+1])>35)changed++;}
  }
  deltas.push({state:states[row],from:col,to:col+1,changedRatio:+(changed/Math.max(1,union)).toFixed(4)});
 }
 return {width,height,frames,deltas,warning:'red clothing can be legitimate; low frame delta does not alone prove a defective animation'};
}
function main(){
 const catalog=loadCatalog();for(const job of ['woodcutter','farm','quarry','construction']){
  const asset=catalog.get(job).asset,report=inspect(path.join(ROOT,asset));
  console.log(JSON.stringify({job,asset,redStrong:report.frames.reduce((n,f)=>n+f.strong,0),redVisible:report.frames.reduce((n,f)=>n+f.red,0),deltas:report.deltas}));
 }
}
if(require.main===module){try{main();}catch(e){console.error('FAIL frame QA:',e.message);process.exitCode=1;}}
module.exports={inspect};
