'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas,loadImage}=require('@napi-rs/canvas'),root=path.join(__dirname,'..');
function load(files){const box={console,Date,Math,Number,Object,Array};box.window=box;box.globalThis=box;for(const file of files)vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),box,{filename:file});return box;}
function advance(actor,seconds){for(let t=0;t<seconds;t+=.1)actor.tick(Math.min(.1,seconds-t));}
test('confirmed V20 events animate the three processed atlases through walk, work and delivery frames',async()=>{
 const box=load(['v20/factory-core.js','v20/scene-map.js','v20/actor-controller.js','v20/profession-renderer.js']),canvas=createCanvas(360,480),g=canvas.getContext('2d');
 for(const[job,file]of [['farm','farmer.png'],['quarry','miner.png'],['construction','builder.png']]){
  const image=await loadImage(path.join(root,'v20/assets/professions',file));assert.equal(image.width,1120);assert.equal(image.height,1400);assert.equal(box.PetecoProfessionRendererV20.registerAtlas(job,image,{width:72,height:90}),true);
  const actor=box.PetecoActorV20.create(box.PetecoFactoryV20,box.PetecoSceneMapV20,job),action={farm:'harvest',quarry:'mine',construction:'build'}[job];
  const event=box.PetecoFactoryV20.event({job,action,cycle:1,confirmed:true,priority:2});assert.equal(box.PetecoFactoryV20.queue([event]).length,1);assert.equal(actor.start(event),true);
  assert.equal(actor.snapshot().phase,'walk');g.clearRect(0,0,360,480);assert.equal(box.PetecoProfessionRendererV20.draw(g,actor.snapshot(),0),true);
  advance(actor,.61);assert.equal(actor.snapshot().phase,'work');g.clearRect(0,0,360,480);assert.equal(box.PetecoProfessionRendererV20.draw(g,actor.snapshot(),16),true);
  advance(actor,.66);assert.equal(actor.snapshot().phase,'return');g.clearRect(0,0,360,480);assert.equal(box.PetecoProfessionRendererV20.draw(g,actor.snapshot(),32),true);
  advance(actor,.61);assert.equal(actor.snapshot().phase,'idle');g.clearRect(0,0,360,480);assert.equal(box.PetecoProfessionRendererV20.draw(g,actor.snapshot(),48),true);
  assert.equal(actor.snapshot().cycle,1,'atlas animation consumes a confirmed event cycle only');
  actor.cancel();assert.equal(actor.snapshot().phase,'idle');console.log(`PASS ${job}: confirmed ${action} event → walk/work/carry/idle painted states; no economic mutation`);
 }
});
