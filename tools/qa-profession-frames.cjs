#!/usr/bin/env node
'use strict';
/* Read-only diagnostic for the real four-state atlases. Raster boundaries are
 * partitioned by floor so fractional source cells (e.g. 1122/4) are supported. */
const path=require('node:path');
const {decodePng,loadCatalog}=require('./validate-visual-assets.cjs');
const ROOT=path.resolve(__dirname,'..');
const STATES=['idle','walk','work','carry'];
function bounds(size,index,cells){return [Math.floor(index*size/cells),Math.floor((index+1)*size/cells)];}
function inspect(file){
 const {width,height,pixels}=decodePng(file,4,4,true),frames=[],deltas=[];
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){
  const [x0,x1]=bounds(width,col,4),[y0,y1]=bounds(height,row,4);let red=0,strong=0,opaque=0,semi=0,visible=0,redEdge=0;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
   const i=(y*width+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];if(!a)continue;visible++;if(a>=128)opaque++;else semi++;
   if(r>150&&r>g*1.8&&r>b*1.6){red++;if(a>=128)strong++;if(x-x0<8||x1-1-x<8||y-y0<8||y1-1-y<8)redEdge++;}
  }
  frames.push({state:STATES[row],frame:col,visible,semi,opaque,red,strong,redEdge,redRatio:+(red/Math.max(1,visible)).toFixed(5)});
 }
 for(let row=0;row<4;row++)for(let col=0;col<3;col++){
  const [x0,x1]=bounds(width,col,4),[nx0,nx1]=bounds(width,col+1,4),[y0,y1]=bounds(height,row,4),[ny0,ny1]=bounds(height,row+1,4);let changed=0,union=0;
  const w=Math.min(x1-x0,nx1-nx0),h=y1-y0;
  for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){const a=((y0+y)*width+x0+x)*4,b=((y0+y)*width+nx0+x)*4,aa=pixels[a+3],bb=pixels[b+3];if(aa>24||bb>24){union++;if(Math.abs(aa-bb)>40||Math.abs(pixels[a]-pixels[b])>35||Math.abs(pixels[a+1]-pixels[b+1])>35)changed++;}}
  deltas.push({state:STATES[row],from:col,to:col+1,changedRatio:+(changed/Math.max(1,union)).toFixed(4)});
 }
 return {width,height,frames,deltas,warning:'red clothing can be legitimate; low frame delta does not alone prove a defective animation'};
}
function main(){const catalog=loadCatalog();for(const job of ['woodcutter','farm','quarry','construction']){const asset=catalog.get(job).asset,report=inspect(path.join(ROOT,asset));console.log(JSON.stringify({job,asset,redStrong:report.frames.reduce((n,f)=>n+f.strong,0),redVisible:report.frames.reduce((n,f)=>n+f.red,0),deltas:report.deltas}));}}
if(require.main===module){try{main();}catch(e){console.error('FAIL frame QA:',e.message);process.exitCode=1;}}
module.exports={inspect};
