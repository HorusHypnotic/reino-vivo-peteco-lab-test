#!/usr/bin/env node
'use strict';
/* Deterministic second stage of the art factory: clean a reviewed 4x4 painted
 * pose sheet, align feet, normalize its 16 cells and export game-ready RGBA. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib');
const {decodePng}=require('./validate-visual-assets.cjs');
const STATES=['idle','walk','work','carry'];
const JOBS=new Set(['farm','quarry','construction']);
const W=280,H=350,OUT_W=W*4,OUT_H=H*4,PAD_X=9,PAD_BOTTOM=7;
const crcTable=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
function crc32(buf){let c=0xffffffff;for(const b of buf)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function chunk(type,data){const t=Buffer.from(type),out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length,0);t.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc32(out.subarray(4,8+data.length)),8+data.length);return out;}
function encodePng(width,height,pixels){
 const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(width,0);ihdr.writeUInt32BE(height,4);ihdr[8]=8;ihdr[9]=6;
 const rows=Buffer.alloc(height*(width*4+1));for(let y=0;y<height;y++){const o=y*(width*4+1);rows[o]=0;pixels.copy(rows,o+1,y*width*4,(y+1)*width*4);}
 return Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),chunk('IHDR',ihdr),chunk('IDAT',zlib.deflateSync(rows,{level:9})),chunk('IEND',Buffer.alloc(0))]);
}
function hash(buf){return crypto.createHash('sha256').update(buf).digest('hex');}
function bgArtifact(r,g,b){return (r>220&&g<80&&b<80)||(r>238&&g>180&&b<50);}
function sourceCell(src,x0,y0,x1,y1){
 const width=x1-x0,height=y1-y0,pixels=Buffer.alloc(width*height*4),box={l:width,t:height,r:-1,b:-1};
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const si=((y+y0)*src.width+x+x0)*4,di=(y*width+x)*4,r=src.pixels[si],g=src.pixels[si+1],b=src.pixels[si+2],a=src.pixels[si+3];
  if(a&&bgArtifact(r,g,b)){pixels[di+3]=0;continue;}
  pixels[di]=r;pixels[di+1]=g;pixels[di+2]=b;pixels[di+3]=a;
  if(a>12){box.l=Math.min(box.l,x);box.r=Math.max(box.r,x);box.t=Math.min(box.t,y);box.b=Math.max(box.b,y);}
 }
 if(box.r<box.l)throw Error('empty frame after matte cleanup');
 return{width,height,pixels,box};
}
function sampleBilinear(frame,sx,sy){
 const x=Math.max(0,Math.min(frame.width-1,sx)),y=Math.max(0,Math.min(frame.height-1,sy)),x0=Math.floor(x),y0=Math.floor(y),x1=Math.min(frame.width-1,x0+1),y1=Math.min(frame.height-1,y0+1),fx=x-x0,fy=y-y0;
 const pts=[[x0,y0,(1-fx)*(1-fy)],[x1,y0,fx*(1-fy)],[x0,y1,(1-fx)*fy],[x1,y1,fx*fy]],out=[0,0,0,0];let alpha=0;
 for(const[px,py,w]of pts){const i=(py*frame.width+px)*4,a=frame.pixels[i+3]/255* w;alpha+=a;for(let c=0;c<3;c++)out[c]+=frame.pixels[i+c]*a;}
 if(alpha>0){for(let c=0;c<3;c++)out[c]=Math.round(out[c]/alpha);out[3]=Math.round(alpha*255);}return out;
}
function putFrame(dst,frame,dx,dy,scale){
 const b=frame.box,sw=b.r-b.l+1,sh=b.b-b.t+1,dw=Math.max(1,Math.round(sw*scale)),dh=Math.max(1,Math.round(sh*scale));
 const left=dx+Math.round((W-dw)/2),y0=dy+H-PAD_BOTTOM-dh;
 for(let y=0;y<dh;y++)for(let x=0;x<dw;x++){
  const p=sampleBilinear(frame,b.l+(x+.5)/scale-.5,b.t+(y+.5)/scale-.5),px=left+x,py=y0+y;if(p[3]>=8&&px>=0&&px<dx+W&&py>=0&&py<OUT_H){const i=(py*OUT_W+px)*4;dst[i]=p[0];dst[i+1]=p[1];dst[i+2]=p[2];dst[i+3]=p[3];}
 }
 return {width:dw,height:dh,left,top:y0};
}
function build(job,input,manifestPath,output){
 if(!JOBS.has(job))throw Error('unknown profession');
 const spec=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
 if(spec.job!==job||spec.columns!==4||spec.rows!==4||spec.states.join(',')!==STATES.join(','))throw Error('manifest must identify this job and the ordered 4x4 idle/walk/work/carry contract');
 for(const key of ['tool','prompt','provenance','license','reference'])if(!spec[key])throw Error('missing '+key+' in art manifest');
 const source=decodePng(input,4,4,true),frames=[];
 if(source.width<4*32||source.height<4*32)throw Error('source sheet too small for a 4x4 atlas');
 for(let row=0;row<4;row++)for(let col=0;col<4;col++)frames.push(sourceCell(source,Math.round(col*source.width/4),Math.round(row*source.height/4),Math.round((col+1)*source.width/4),Math.round((row+1)*source.height/4)));
 const heights=frames.map(f=>f.box.b-f.box.t+1),maxH=Math.max(...heights),widths=frames.map(f=>f.box.r-f.box.l+1),maxW=Math.max(...widths),scale=Math.min((H-PAD_BOTTOM-12)/maxH,(W-PAD_X*2)/maxW);
 if(!Number.isFinite(scale)||scale<=0)throw Error('invalid normalization scale');
 const outputPixels=Buffer.alloc(OUT_W*OUT_H*4),geometry=[];
 for(let i=0;i<frames.length;i++)geometry.push(putFrame(outputPixels,frames[i],(i%4)*W,Math.floor(i/4)*H,scale));
 const png=encodePng(OUT_W,OUT_H,outputPixels);fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,png);
 const decoded=decodePng(output,4,4),occupied=decoded.cells.length===16&&decoded.cells.every(n=>n>=20);
 if(!occupied)throw Error('normalized atlas failed sixteen-frame occupancy gate');
 const result={job,asset:path.basename(output),sha256:decoded.sha256,width:OUT_W,height:OUT_H,channels:4,columns:4,rows:4,grid:{columns:4,rows:4},states:STATES,stateRows:Object.fromEntries(STATES.map((s,i)=>[s,i])),framesPerState:4,render:{width:72,height:90,anchor:'feet',feetOffsetY:8,direction:'flip-on-facing'},normalizedScale:Number(scale.toFixed(5)),frameGeometry:geometry,occupiedCells:decoded.cells.length,source:{file:path.basename(input),sha256:source.sha256},tool:spec.tool,reference:spec.reference,provenance:spec.provenance,license:spec.license,prompt:spec.prompt,review:'generated atlas; frame sequence and runtime pose require visual review'};
 const outManifest=output.replace(/\.png$/i,'.manifest.json');fs.writeFileSync(outManifest,JSON.stringify(result,null,2)+'\n');
 return result;
}
if(require.main===module){try{const[job,input,manifest,output]=process.argv.slice(2);if(!output)throw Error('usage: node tools/build-profession-atlas.cjs <farm|quarry|construction> <source.png> <art-manifest.json> <output.png>');console.log(JSON.stringify(build(job,input,manifest,output),null,2));}catch(e){console.error('FAIL profession atlas build:',e.message);process.exitCode=1;}}
module.exports={build,STATES,encodePng};
