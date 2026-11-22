'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {decodePng,loadCatalog}=require('../tools/validate-visual-assets.cjs');
const cleaner=require('../tools/clean-forest-atlas.cjs');

const root=path.join(__dirname,'..');
const sourcePath=path.join(root,'v19/assets/forest-cycle-atlas.png');
const cleanPath=path.join(root,'v19/assets/forest-cycle-atlas-clean.png');

test('V19 cleaner removes only low-alpha warm spill outside the illustrated silhouette',()=>{
 const source=decodePng(sourcePath,4,1,true),output=decodePng(cleanPath,4,1,true);
 assert.deepEqual([output.width,output.height],[2172,724]);
 assert.equal(output.cells.length,4);assert.ok(output.cells.every(n=>n>1000));
 let changed=0;
 for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++){
  const i=(y*source.width+x)*4,a=source.pixels[i+3],b=output.pixels[i+3];
  if(a===b){for(let c=0;c<3;c++)assert.equal(output.pixels[i+c],source.pixels[i+c]);continue;}
  changed++;assert.equal(b,0);assert.equal(output.pixels[i],0);assert.equal(output.pixels[i+1],0);assert.equal(output.pixels[i+2],0);
  assert.ok(a>0&&a<64,'only faint edge pixels may be cleared');
  const r=source.pixels[i],g=source.pixels[i+1],blue=source.pixels[i+2];
  assert.ok((r>150&&r>g*1.8&&r>blue*1.6)||(r>190&&g>150&&blue<130&&r>blue*1.45&&g>blue*1.4),'only red/yellow fringe colors may be cleared');
  let opaqueNear=false;for(let dy=-2;dy<=2&&!opaqueNear;dy++)for(let dx=-2;dx<=2;dx++){
   const xx=x+dx,yy=y+dy;if(xx<Math.floor(x/(source.width/4))*(source.width/4)||xx>=Math.floor(x/(source.width/4)+1)*(source.width/4)||yy<0||yy>=source.height)continue;
   if(source.pixels[(yy*source.width+xx)*4+3]>=230){opaqueNear=true;break;}
  }
  assert.equal(opaqueNear,false,'legitimate colors touching the silhouette are preserved');
 }
 assert.ok(changed>1000);
 const rebuilt=cleaner.build(sourcePath).png;assert.ok(rebuilt.equals(fs.readFileSync(cleanPath)),'cleaned atlas is deterministic');
 assert.equal(loadCatalog().get('forest').asset,'v19/assets/forest-cycle-atlas-clean.png');
});
