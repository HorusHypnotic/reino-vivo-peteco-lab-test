/* Reproducible renderer composition; synthetic actor states, recovered art. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{createCanvas,loadImage}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/evidence/visual-factory/woodcutter-forest-states.png');
function context(withFactory){const box={console,Date,Math,Number,Object,Array};box.window=box;box.globalThis=box;const files=[...(withFactory?['v18/visual-factory.js']:[]),'v18/woodcutter-renderer.js','v19/forest-art.js'];for(const file of files)vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),box,{filename:file});return box;}
(async()=>{
 const scene=await loadImage(path.join(root,'v18/assets/village-scene.svg'));
 const wood=await loadImage(path.join(root,'v18/assets/woodcutter-atlas-original.png'));
 const forest=await loadImage(path.join(root,'v19/assets/forest-cycle-atlas.png'));
 const panels=[
  ['REPOUSO','idle',0,{phase:'idle',ledger:null},1200],
  ['CAMINHADA','walk',1,{phase:'walk',ledger:null},1300],
  ['CORTE','work',2,{phase:'work',ledger:null},1400],
  ['ENTREGA CONFIRMADA','carry',3,{phase:'carry',ledger:{deliveryConfirmed:true},cycle:1},1500],
  ['ÁRVORE EM REGENERAÇÃO','idle',0,{phase:'idle',ledger:{deliveryConfirmed:true},cycle:1},2900]
 ];
 const render=(box)=>{const canvas=createCanvas(840,760),g=canvas.getContext('2d');g.fillStyle='#17241f';g.fillRect(0,0,canvas.width,canvas.height);for(let i=0;i<panels.length;i++){
  const [title,state,row,actor,now]=panels[i],col=i%3,line=Math.floor(i/3),x=col*280,y=line*380,points=[[200,404],[155,332],[118,290],[145,310],[200,404]],point=points[i];
  g.save();g.beginPath();g.rect(x+8,y+8,264,352);g.clip();g.translate(x+8,y+8);g.scale(.733333,.733333);g.drawImage(scene,0,0,360,480);
  const treeState=box.PetecoForestArtV19.draw(g,actor,forest,now);
  box.PetecoWoodcutterRendererV18.draw(g,{state,frame:row,x:point[0],y:point[1],facing:state==='work'?-1:1},wood);
  g.restore();g.fillStyle='#13251edb';g.fillRect(x+12,y+12,Math.min(255,title.length*8+20),26);g.fillStyle='#fff0ce';g.font='bold 12px sans-serif';g.fillText(title,x+20,y+30);
  console.log(`FRAME ${title}: woodcutter=${state} tree=${treeState}`);
 }return canvas.toBuffer('image/png');};
 const before=render(context(false)),after=render(context(true));if(!before.equals(after))throw Error('catalog-backed renderer changed visible pixels versus the previous hardcoded frame map');
 fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(path.join(path.dirname(out),'before-hardcoded-renderers.png'),before);fs.writeFileSync(out,after);
 console.log(`PASS renderer-only before/after: pixel-identical hardcoded baseline and catalog renderer; ${path.relative(root,out)} (synthetic visual states; no economy/save writes)`);
})().catch(error=>{console.error(error);process.exitCode=1;});
