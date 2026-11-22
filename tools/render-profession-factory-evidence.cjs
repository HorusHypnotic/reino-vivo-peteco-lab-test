#!/usr/bin/env node
'use strict';
/* Reproducible, isolated composition evidence. Uses production renderers,
 * confirmed V20 controller events, source scene and processed profession art. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {createCanvas,loadImage}=require('@napi-rs/canvas'),root=path.resolve(__dirname,'..'),out=path.join(root,'docs/evidence/profession-factory');
function load(files){const box={console,Date,Math,Number,Object,Array};box.window=box;box.globalThis=box;for(const file of files)vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),box,{filename:file});return box;}
function card(g,x,y,w,h,title){g.fillStyle='#1e342e';g.fillRect(x,y,w,h);g.strokeStyle='#6c845c';g.lineWidth=2;g.strokeRect(x+1,y+1,w-2,h-2);g.fillStyle='#f3dda9';g.font='bold 14px sans-serif';g.fillText(title,x+12,y+22);}
function digest(file){return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');}
async function main(){
 fs.mkdirSync(out,{recursive:true});const box=load(['v20/factory-core.js','v20/scene-map.js','v20/actor-controller.js','v20/profession-renderer.js']);
 const jobs=[['farm','farmer.png','AGRICULTORA'],['quarry','miner.png','MINEIRA'],['construction','builder.png','CONSTRUTORA']],states=[['idle','REPOUSO'],['walk','CAMINHADA'],['work','TRABALHO'],['carry','TRANSPORTE']];
 const sheet=createCanvas(1080,780),sg=sheet.getContext('2d');sg.fillStyle='#152521';sg.fillRect(0,0,sheet.width,sheet.height);const loaded={};
 for(let j=0;j<jobs.length;j++){const[job,file,label]=jobs[j],image=await loadImage(path.join(root,'v20/assets/professions',file));loaded[job]=image;box.PetecoProfessionRendererV20.registerAtlas(job,image,{width:72,height:90});
  for(let r=0;r<4;r++){const x=12+j*356,y=12+r*190;card(sg,x,y,344,178,label+' · '+states[r][1]);for(let frame=0;frame<4;frame++){const actor={job,phase:states[r][0],x:x+48+frame*78,y:y+160,facing:1};box.PetecoProfessionRendererV20.draw(sg,actor,frame*8);}}
 }
 const sheetPath=path.join(out,'three-profession-atlases.png');fs.writeFileSync(sheetPath,sheet.toBuffer('image/png'));

 const scene=await loadImage(path.join(root,'v18/assets/village-scene.svg')),canvas=createCanvas(720,960),g=canvas.getContext('2d');g.fillStyle='#17241f';g.fillRect(0,0,720,960);g.save();g.scale(2,2);g.drawImage(scene,0,0,360,480);g.restore();
 g.save();g.fillStyle='#142a31e8';g.fillRect(12,12,696,62);g.fillStyle='#ffe4ae';g.font='bold 24px sans-serif';g.fillText('VILA VIVA · FÁBRICA DE PROFISSÕES',28,42);g.fillStyle='#e1e9d4';g.font='16px sans-serif';g.fillText('QA sintético isolado · eventos V20 confirmados · salvamento inalterado',28,64);g.restore();
 const snapshots={},actions={farm:'harvest',quarry:'mine',construction:'build'};
 for(const[job]of jobs){const actor=box.PetecoActorV20.create(box.PetecoFactoryV20,box.PetecoSceneMapV20,job),event=box.PetecoFactoryV20.event({job,action:actions[job],cycle:5,confirmed:true,priority:2});if(!event||!box.PetecoFactoryV20.queue([event]).length||!actor.start(event))throw Error('synthetic confirmed event rejected for '+job);
  const delay=job==='farm'?.22:job==='quarry'?.68:1.37;for(let n=0;n<delay;n+=.1)actor.tick(Math.min(.1,delay-n));snapshots[job]=actor.snapshot();
 }
 const order=jobs.map(x=>x[0]).sort((a,b)=>snapshots[a].y-snapshots[b].y);g.save();g.scale(2,2);for(const job of order)box.PetecoProfessionRendererV20.draw(g,snapshots[job],12);g.restore();
 g.save();g.fillStyle='#142a31e8';g.fillRect(12,842,696,94);g.fillStyle='#fff0c5';g.font='bold 18px sans-serif';g.fillText(jobs.map(([j,,label])=>label+' '+snapshots[j].phase.toUpperCase()).join('  ·  '),25,875);g.font='15px sans-serif';g.fillText('Agricultura: harvest confirmado · Pedreira: mine confirmado · Obra: build confirmado',25,906);g.restore();
 const scenePath=path.join(out,'three-workers-confirmed-v20-scene.png');fs.writeFileSync(scenePath,canvas.toBuffer('image/png'));
 const files=[sheetPath,scenePath];fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({kind:'synthetic-renderer-evidence',createdAt:'2026-11-22',sourceScene:'v18/assets/village-scene.svg',renderer:'v20/profession-renderer.js',controllers:['v20/factory-core.js','v20/scene-map.js','v20/actor-controller.js'],eventsConfirmed:true,syntheticState:true,saveRead:false,saveWritten:false,browserHomologation:false,browserBlocker:'Executor loopback recusou conexão; Chromium de QA bloqueou file:///tmp/vila-pr17-current/index.html por política da organização.',frames:files.map(file=>({file:path.relative(root,file),sha256:digest(file)})),phases:Object.fromEntries(jobs.map(([j])=>[j,snapshots[j].phase]))},null,2)+'\n');
 console.log(`PASS visual evidence: ${path.relative(root,sheetPath)} and ${path.relative(root,scenePath)}; synthetic confirmed events only; no save read/write; browser QA not asserted`);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
