#!/usr/bin/env node
'use strict';

/* Reproducible V18 processor for the user-provided 4-state house artwork.
 * It keeps the painting intact, drops only the confirmed small cut-off
 * neighboring-frame fragment, and aligns each pose horizontally and by feet. */
const fs=require('node:fs');
const path=require('node:path');
const zlib=require('node:zlib');
const crypto=require('node:crypto');
const {decodePng}=require('./validate-visual-assets.cjs');
const ROOT=path.resolve(__dirname,'..');
const SOURCE=path.join(ROOT,'v18/art-source/medieval-house-states-original.png');
const OUTPUT=path.join(ROOT,'v18/assets/structures/medieval-house-atlas.png');
const WIDTH=2172,HEIGHT=724,CELL=543,FRAMES=4,BASELINE=700,ALPHA_FLOOR=8;
function nearWhite(r,g,b){return r>215&&g>215&&b>215&&Math.max(r,g,b)-Math.min(r,g,b)<36;}

function crc32(buffer){let crc=0xffffffff;for(const byte of buffer){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc&1)?0xedb88320^(crc>>>1):crc>>>1;}return (crc^0xffffffff)>>>0;}
function chunk(type,data){const name=Buffer.from(type),len=Buffer.alloc(4),crc=Buffer.alloc(4);len.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([name,data])));return Buffer.concat([len,name,data,crc]);}
function paeth(a,b,c){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;}
function encodePng(width,height,pixels){
 const header=Buffer.alloc(13);header.writeUInt32BE(width,0);header.writeUInt32BE(height,4);header[8]=8;header[9]=6;
 const stride=width*4,raw=Buffer.alloc(height*(stride+1));
 for(let y=0;y<height;y++){const o=y*(stride+1),line=y*stride;raw[o]=4;for(let i=0;i<stride;i++){const left=i>=4?pixels[line+i-4]:0,above=y?pixels[line-stride+i]:0,upperLeft=y&&i>=4?pixels[line-stride+i-4]:0;raw[o+1+i]=(pixels[line+i]-paeth(left,above,upperLeft))&255;}}
 return Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),chunk('IHDR',header),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
}
function removeCutoffSpecks(tile){
 const source=Buffer.from(tile);let defringed=0;
 for(let y=0;y<HEIGHT;y++)for(let x=0;x<CELL;x++){
  const at=(y*CELL+x)*4,a=source[at+3];if(a===0||a>=96||!nearWhite(source[at],source[at+1],source[at+2]))continue;
  let sum=[0,0,0],count=0;
  for(const radius of [1,2]){
   for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
    if(Math.max(Math.abs(dx),Math.abs(dy))!==radius)continue;const nx=x+dx,ny=y+dy;if(nx<0||nx>=CELL||ny<0||ny>=HEIGHT)continue;
    const ni=(ny*CELL+nx)*4;if(source[ni+3]>=200&&!nearWhite(source[ni],source[ni+1],source[ni+2])){sum[0]+=source[ni];sum[1]+=source[ni+1];sum[2]+=source[ni+2];count++;}
   }
   if(count)break;
  }
  if(count){tile[at]=Math.round(sum[0]/count);tile[at+1]=Math.round(sum[1]/count);tile[at+2]=Math.round(sum[2]/count);defringed++;}
 }
 const visited=new Uint8Array(CELL*HEIGHT),queue=new Int32Array(CELL*HEIGHT),components=[];
 for(let start=0;start<CELL*HEIGHT;start++){
  if(visited[start])continue;const a=tile[start*4+3];if(a<ALPHA_FLOOR){visited[start]=1;tile[start*4+3]=0;continue;}
  let head=0,tail=0,minX=CELL,maxX=-1,minY=HEIGHT,maxY=-1;queue[tail++]=start;visited[start]=1;
  while(head<tail){const index=queue[head++],x=index%CELL,y=Math.floor(index/CELL);if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=x+dx,ny=y+dy;if(nx<0||nx>=CELL||ny<0||ny>=HEIGHT)continue;const n=ny*CELL+nx;if(visited[n])continue;visited[n]=1;if(tile[n*4+3]>=ALPHA_FLOOR)queue[tail++]=n;else tile[n*4+3]=0;}
  }
  components.push({indices:queue.slice(0,tail),size:tail,minX,maxX,minY,maxY});
 }
 const removed=[];
 for(const c of components){const touchesCellEdge=c.minX<12||c.maxX>=CELL-12;if(c.size<1024&&touchesCellEdge){for(const p of c.indices)tile[p*4+3]=0;removed.push({pixels:c.size,bounds:[c.minX,c.minY,c.maxX+1,c.maxY+1]});}}
 let minX=CELL,maxX=-1,minY=HEIGHT,maxY=-1;
 for(let y=0;y<HEIGHT;y++)for(let x=0;x<CELL;x++)if(tile[(y*CELL+x)*4+3]>=ALPHA_FLOOR){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}
 if(maxX<minX||maxY<minY)throw new Error('house state became empty');
 const out=Buffer.alloc(CELL*HEIGHT*4),cropW=maxX-minX+1,cropH=maxY-minY+1;
 if(cropW>CELL||cropH>BASELINE)throw new Error('house state does not fit normalized cell');
 const destX=Math.floor((CELL-cropW)/2),destY=BASELINE-cropH;
 for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){const from=(y*CELL+x)*4;if(tile[from+3]<ALPHA_FLOOR)continue;const to=((destY+y-minY)*CELL+destX+x-minX)*4;tile.copy(out,to,from,from+4);}
 return {pixels:out,metrics:{sourceBounds:[minX,minY,maxX+1,maxY+1],normalizedBounds:[destX,destY,destX+cropW,destY+cropH],defringedNearWhiteEdgePixels:defringed,removedBoundaryComponents:removed}};
}
function build(sourcePath=SOURCE){
 const decoded=decodePng(sourcePath,4,1,true);if(decoded.width!==WIDTH||decoded.height!==HEIGHT||decoded.color!==6)throw new Error(`expected RGBA 4x1 atlas ${WIDTH}x${HEIGHT}`);
 const atlas=Buffer.alloc(WIDTH*HEIGHT*4),metrics=[];
 for(let frame=0;frame<FRAMES;frame++){
  const tile=Buffer.alloc(CELL*HEIGHT*4);
  for(let y=0;y<HEIGHT;y++)decoded.pixels.copy(tile,y*CELL*4,y*WIDTH*4+frame*CELL*4,y*WIDTH*4+(frame+1)*CELL*4);
  const normalized=removeCutoffSpecks(tile);metrics.push(normalized.metrics);
  for(let y=0;y<HEIGHT;y++)normalized.pixels.copy(atlas,y*WIDTH*4+frame*CELL*4,y*CELL*4,(y+1)*CELL*4);
 }
 const png=encodePng(WIDTH,HEIGHT,atlas);return {png,metrics:{width:WIDTH,height:HEIGHT,grid:'4x1',baseline:BASELINE,alphaFloor:ALPHA_FLOOR,states:metrics,sha256:crypto.createHash('sha256').update(png).digest('hex')}};
}
function main(){const result=build(SOURCE);if(process.argv.includes('--check')){if(!fs.existsSync(OUTPUT)||!fs.readFileSync(OUTPUT).equals(result.png))throw new Error('house atlas is not reproducible; run this tool to regenerate');console.log(`PASS: V18 house atlas ${JSON.stringify(result.metrics)}`);return;}fs.writeFileSync(OUTPUT,result.png);console.log(`PASS: wrote ${path.relative(ROOT,OUTPUT)} ${JSON.stringify(result.metrics)}`);}
if(require.main===module){try{main();}catch(error){console.error('FAIL house atlas:',error.message);process.exitCode=1;}}
module.exports={build,BASELINE,ALPHA_FLOOR};
