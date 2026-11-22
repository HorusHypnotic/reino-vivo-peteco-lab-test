#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib'),vm=require('node:vm');
const ROOT=path.resolve(__dirname,'..');
const table=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
function crc32(buf){let c=0xffffffff;for(const b of buf)c=table[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function paeth(a,b,c){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;}
function decodePng(file,columns=4,rows=4,withPixels=false){
 const data=fs.readFileSync(file);if(data.toString('hex',0,8)!=='89504e470d0a1a0a')throw Error(`${file}: not PNG`);
 let width=0,height=0,depth=0,color=0,interlace=0;const idat=[];
 for(let o=8;o<data.length;){if(o+12>data.length)throw Error(`${file}: truncated chunk`);const n=data.readUInt32BE(o),type=data.toString('ascii',o+4,o+8),end=o+12+n;if(end>data.length)throw Error(`${file}: truncated ${type}`);const body=data.subarray(o+4,o+8+n);if(crc32(body)!==data.readUInt32BE(o+8+n))throw Error(`${file}: ${type} CRC mismatch`);if(type==='IHDR'){width=data.readUInt32BE(o+8);height=data.readUInt32BE(o+12);depth=data[o+16];color=data[o+17];interlace=data[o+20];}if(type==='IDAT')idat.push(data.subarray(o+8,o+8+n));o=end;if(type==='IEND')break;}
 if(depth!==8||color!==6||interlace!==0)throw Error(`${file}: expected non-interlaced 8-bit RGBA PNG`);
 const raw=zlib.inflateSync(Buffer.concat(idat)),stride=width*4;if(raw.length!==height*(stride+1))throw Error(`${file}: decoded size mismatch`);
 if(!Number.isInteger(columns)||!Number.isInteger(rows)||columns<1||rows<1||width/columns<1||height/rows<1)throw Error(`${file}: invalid atlas grid`);
 const prev=Buffer.alloc(stride),counts=[],pixels=withPixels?Buffer.alloc(width*height*4):null;
 for(let y=0;y<height;y++){
  const offset=y*(stride+1),filter=raw[offset],row=Buffer.from(raw.subarray(offset+1,offset+1+stride));
  for(let i=0;i<stride;i++){const a=i>=4?row[i-4]:0,b=prev[i],c=i>=4?prev[i-4]:0;if(filter===1)row[i]=(row[i]+a)&255;else if(filter===2)row[i]=(row[i]+b)&255;else if(filter===3)row[i]=(row[i]+Math.floor((a+b)/2))&255;else if(filter===4)row[i]=(row[i]+paeth(a,b,c))&255;else if(filter!==0)throw Error(`${file}: unsupported PNG filter ${filter}`);}
  const cellHeight=height/rows,cellWidth=width/columns,rowIndex=Math.floor(y/cellHeight);
  if(!counts[rowIndex])counts[rowIndex]=Array(Math.round(width/cellWidth)).fill(0);
  for(let x=0;x<width;x++)if(row[x*4+3])counts[rowIndex][Math.floor(x/cellWidth)]++;
  if(pixels)row.copy(pixels,y*stride);row.copy(prev);
 }
 return {width,height,depth,color,sha256:crypto.createHash('sha256').update(data).digest('hex'),cells:counts.flat(),...(pixels?{pixels}:{})};
}
function loadCatalog(){const box={};vm.runInNewContext(fs.readFileSync(path.join(ROOT,'v18/visual-factory.js'),'utf8'),box);return box.PetecoVisualFactoryV18;}
function validate(){const catalog=loadCatalog();let checks=0;for(const name of catalog.list()){
 const spec=catalog.get(name),file=path.join(ROOT,spec.asset),png=decodePng(file,spec.grid.columns,spec.grid.rows);
 if(spec.sourceAsset&&!fs.existsSync(path.join(ROOT,spec.sourceAsset)))throw Error(`${name}: recovered source asset is missing`);else if(spec.sourceAsset)checks++;
 if(png.width!==spec.width||png.height!==spec.height)throw Error(`${name}: expected ${spec.width}x${spec.height}, got ${png.width}x${png.height}`);checks++;
 if(spec.channels!==png.color-2)throw Error(`${name}: alpha/channel metadata mismatch`);checks++;
 if(spec.grid.columns*spec.grid.rows!==Object.keys(spec.states).length*spec.framesPerState)throw Error(`${name}: state/grid count mismatch`);checks++;
 if(png.cells.length!==spec.grid.columns*spec.grid.rows||png.cells.some(n=>n<20))throw Error(`${name}: empty or malformed frame cell`);checks++;
 if(png.sha256!==spec.sha256)throw Error(`${name}: SHA-256 mismatch (${png.sha256})`);checks++;
 console.log(`PASS ${name} ${png.width}x${png.height} RGBA ${spec.grid.columns}x${spec.grid.rows}; ${png.cells.length} non-empty frames; sha256 ${png.sha256}`);
 }
 for(const name of catalog.listScenery()){
  const spec=catalog.getScenery(name),file=path.join(ROOT,spec.asset),source=path.join(ROOT,spec.sourceAsset);
  if(!fs.existsSync(source)||!fs.existsSync(file))throw Error(`${name}: scenery source or layer missing`);
  const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if(hash!==spec.sha256)throw Error(`${name}: SVG manifest SHA-256 mismatch (${hash})`);
  const svg=fs.readFileSync(file,'utf8');if(!svg.startsWith('<svg ')||!svg.includes(`viewBox="${spec.viewBox}"`)||!svg.includes(spec.sourceTransform))throw Error(`${name}: invalid extracted SVG layer`);
  checks++;console.log(`PASS ${name} ${spec.format} layer; saved-house slot; sha256 ${hash}`);
 }
 const wood=catalog.get('woodcutter'),tree=catalog.get('forest');
 if(wood.interaction.target!=='v19:forest-tree'||tree.interaction.target!==wood.id||wood.interaction.contact!==tree.interaction.contact)throw Error('woodcutter/forest contact contract mismatch');checks++;
 console.log(`PASS factory contact ${wood.id} ↔ ${tree.id}; ${checks} structural checks`);
 return checks;
}
if(require.main===module){try{validate();}catch(error){console.error(`FAIL visual asset validation: ${error.message}`);process.exitCode=1;}}
module.exports={decodePng,loadCatalog,validate};
