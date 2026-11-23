#!/usr/bin/env node
'use strict';

/* Conservative V19 matte cleanup. It removes only very low-alpha warm spill
 * outside a 2px neighborhood of fully opaque forest artwork. Opaque foliage,
 * bark, autumn color, and edge antialiasing remain byte-for-byte unchanged. */
const fs=require('node:fs');
const path=require('node:path');
const zlib=require('node:zlib');
const crypto=require('node:crypto');
const {decodePng,loadCatalog}=require('./validate-visual-assets.cjs');
const ROOT=path.resolve(__dirname,'..');

function crc32(buffer){
 let crc=0xffffffff;
 for(const byte of buffer){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc&1)?0xedb88320^(crc>>>1):crc>>>1;}
 return (crc^0xffffffff)>>>0;
}
function chunk(type,data){
 const name=Buffer.from(type),len=Buffer.alloc(4),crc=Buffer.alloc(4);len.writeUInt32BE(data.length);
 crc.writeUInt32BE(crc32(Buffer.concat([name,data])));
 return Buffer.concat([len,name,data,crc]);
}
function encodePng(width,height,pixels){
 const header=Buffer.alloc(13);header.writeUInt32BE(width,0);header.writeUInt32BE(height,4);
 header[8]=8;header[9]=6;header[10]=0;header[11]=0;header[12]=0;
 const stride=width*4,raw=Buffer.alloc(height*(stride+1));
 for(let y=0;y<height;y++){const offset=y*(stride+1);raw[offset]=0;pixels.copy(raw,offset+1,y*stride,(y+1)*stride);}
 return Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),chunk('IHDR',header),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
}
function build(source){
 const decoded=decodePng(source,4,1,true),{width,height}=decoded,pixels=Buffer.from(decoded.pixels),stride=width*4,cellWidth=width/4;
 const integral=new Uint32Array((width+1)*(height+1)),iw=width+1;
 for(let y=0;y<height;y++){
  let row=0;for(let x=0;x<width;x++){
   row+=pixels[(y*width+x)*4+3]>=230?1:0;
   integral[(y+1)*iw+x+1]=integral[y*iw+x+1]+row;
  }
 }
 let removed=0,red=0,yellow=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const i=y*stride+x*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];
  if(!a||a>=64)continue;
  const suspiciousRed=r>150&&r>g*1.8&&r>b*1.6;
  const suspiciousYellow=r>190&&g>150&&b<130&&r>b*1.45&&g>b*1.4;
  if(!suspiciousRed&&!suspiciousYellow)continue;
  const left=Math.max(Math.floor(x/cellWidth)*cellWidth,x-2),right=Math.min(Math.floor(x/cellWidth+1)*cellWidth-1,x+2);
  const top=Math.max(0,y-2),bottom=Math.min(height-1,y+2),x1=left,x2=right+1,y1=top,y2=bottom+1;
  const core=integral[y2*iw+x2]-integral[y1*iw+x2]-integral[y2*iw+x1]+integral[y1*iw+x1];
  if(core)continue;
  pixels.fill(0,i,i+4);removed++;if(suspiciousRed)red++;if(suspiciousYellow)yellow++;
 }
 if(removed<100)throw new Error(`refusing cleanup with unexpectedly few edge pixels (${removed})`);
 for(let frame=0;frame<4;frame++){
  let visible=0;for(let y=0;y<height;y++)for(let x=frame*cellWidth;x<(frame+1)*cellWidth;x++)if(pixels[(y*width+x)*4+3])visible++;
  if(visible<1000)throw new Error(`forest frame ${frame} is empty or damaged`);
 }
 return {png:encodePng(width,height,pixels),metrics:{width,height,removed,red,yellow,sha256:crypto.createHash('sha256').update(encodePng(width,height,pixels)).digest('hex')}};
}
function main(){
 const spec=loadCatalog().get('forest'),source=path.join(ROOT,spec.sourceAsset),output=path.join(ROOT,spec.asset);
 const result=build(source);
 if(process.argv.includes('--check')){
  if(!fs.existsSync(output)||!fs.readFileSync(output).equals(result.png))throw new Error('clean atlas is not reproducible; run the cleaner');
  console.log(`PASS: V19 matte cleanup ${JSON.stringify(result.metrics)}`);return;
 }
 fs.writeFileSync(output,result.png);
 console.log(`PASS: wrote ${path.relative(ROOT,output)} ${JSON.stringify(result.metrics)}`);
}
if(require.main===module){try{main();}catch(error){console.error('FAIL forest atlas cleanup:',error.message);process.exitCode=1;}}
module.exports={build};
