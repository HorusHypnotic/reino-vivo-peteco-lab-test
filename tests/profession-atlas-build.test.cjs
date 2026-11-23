'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const root=path.join(__dirname,'..'),{build}=require('../tools/build-profession-atlas.cjs'),{buildAll}=require('../tools/build-profession-batch.cjs'),{decodePng}=require('../tools/validate-visual-assets.cjs'),{prepare}=require('../tools/prepare-profession-atlas.cjs');
const jobs=[['farm','farmer-source.png'],['quarry','miner-source.png'],['construction','builder-source.png']];
function cellBounds(png,col,row){const x0=col*png.width/4,y0=row*png.height/4,w=png.width/4,h=png.height/4;let l=w,t=h,r=-1,b=-1;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(png.pixels[((y+y0)*png.width+x+x0)*4+3]>12){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}return{l,t,r,b};}
function frameDiff(png,row,a,b){const cw=png.width/4,ch=png.height/4,x0=a*cw,x1=b*cw,y0=row*ch;let changed=0;for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){const i=((y+y0)*png.width+x+x0)*4,j=((y+y0)*png.width+x+x1)*4;if(Math.abs(png.pixels[i+3]-png.pixels[j+3])>12||Math.abs(png.pixels[i]-png.pixels[j])>24||Math.abs(png.pixels[i+1]-png.pixels[j+1])>24||Math.abs(png.pixels[i+2]-png.pixels[j+2])>24)changed++;}return changed/(cw*ch);}
test('factory builds three deterministic painted 4x4 RGBA atlases with animation and aligned feet',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'peteco-art-factory-'));
 try{for(const[job,file]of jobs){const source=path.join(root,'v20/art-source',file),spec=path.join(root,'v20/art-manifests',job+'.json'),out=path.join(temp,job+'.png');const a=build(job,source,spec,out),first=fs.readFileSync(out);assert.equal(a.occupiedCells,16);assert.equal(a.width,1120);assert.equal(a.height,1400);assert.equal(a.channels,4);
   const png=decodePng(out,4,4,true),manifest=JSON.parse(fs.readFileSync(out.replace('.png','.manifest.json'),'utf8'));assert.equal(manifest.sha256,a.sha256);assert.equal(prepare(job,out,manifest).sha256,a.sha256);
   const again=build(job,source,spec,path.join(temp,job+'-again.png'));assert.equal(again.sha256,a.sha256,'same source and manifest must produce identical bytes');assert.equal(fs.readFileSync(path.join(temp,job+'-again.png')).equals(first),true);
   for(const row of [1,2,3])assert.ok(frameDiff(png,row,0,1)>.002,job+' row '+row+' must contain a distinct adjacent animation frame');
   const bottoms=[0,1,2,3].map(col=>cellBounds(png,col,1).b);assert.ok(Math.max(...bottoms)-Math.min(...bottoms)<=1,job+' walk feet align');
   const alpha=png.pixels.filter((_,i)=>i%4===3);assert.ok(alpha.some(a=>a===0),'transparent background preserved');
   assert.ok(!png.pixels.some((v,i)=>i%4===0&&v>220&&png.pixels[i+1]<80&&png.pixels[i+2]<80&&png.pixels[i+3]>8),'bright red generation fringe removed');
   console.log(`PASS ${job}: source→normalized atlas ${a.sha256}; 16 frames; walk/work/carry movement; aligned feet; transparent PNG`);
  }}finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('one batch command builds the configured farmer, miner and builder without per-job setup',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'peteco-art-batch-'));
 try{const result=buildAll(root,temp);assert.deepEqual(result.map(x=>x.job),['farm','quarry','construction']);for(const x of result){const file=path.join(temp,'v20/assets/professions',x.asset);assert.ok(fs.existsSync(file));assert.equal(decodePng(file,4,4).sha256,x.sha256);}console.log('PASS one factory batch emitted farmer, miner and builder atlases with manifest-driven inputs');}
 finally{fs.rmSync(temp,{recursive:true,force:true});}
});
