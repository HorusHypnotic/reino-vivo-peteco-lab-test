const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const calls=[];
const context={PetecoWoodcutterRendererV18:{draw:(g,a,image)=>{calls.push(['wood',a,image]);return true;}},PetecoProfessionRendererV20:{draw:(g,a,t)=>{calls.push(['builder',a,t]);return true;}}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../v7/actor-renderer.js'),'utf8'),context);
const atlas={complete:true,naturalWidth:100};
test('V7 tree work and confirmed delivery use the V18 sprite states',()=>{
 const draw=context.PetecoV7ActorRenderer.draw;
 assert.equal(draw({}, {job:'lenhador',task:'gather',fromX:65,toX:65,fromY:250,toY:250},65,250,20,atlas),true);
 assert.equal(calls.at(-1)[1].state,'work');
 assert.equal(context.PetecoV7ActorRenderer.activity({task:'idle'}),null,'idle villagers carry no permanent labels');
 assert.equal(context.PetecoV7ActorRenderer.activity({task:'gather'}),'CORTANDO');
 draw({}, {job:'lenhador',task:'deliver',fromX:65,toX:180,fromY:250,toY:300},120,280,25,atlas);
 assert.equal(calls.at(-1)[1].state,'carry');assert.equal(calls.at(-1)[1].facing,1);
});
test('V7 builder animates only during the life model build event',()=>{
 const draw=context.PetecoV7ActorRenderer.draw;
 draw({}, {job:'construtor',task:'waiting-materials',fromX:220,toX:220,fromY:305,toY:305},220,305,30,atlas);
 assert.equal(calls.at(-1)[0],'builder');assert.equal(calls.at(-1)[1].phase,'idle');
 draw({}, {job:'construtor',task:'build',fromX:220,toX:180,fromY:305,toY:300},180,300,35,atlas);
 assert.equal(calls.at(-1)[1].phase,'work');
 assert.equal(context.PetecoV7ActorRenderer.activity({task:'build'}),'CONSTRUINDO');
});
test('main viewer routes V7 agents through the renderer and keeps the sprite atlas loaded',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 assert.ok(html.includes('src="v7/actor-renderer.js"'));
 assert.ok(html.includes('PetecoV7ActorRenderer.draw(g,a,px,py,v7World.tick'));
 assert.ok(html.includes('PetecoV22Depth.order([{kind:'home',ref:h},...(v7Cargo?[{kind:'cargo',ref:v7Cargo}]:[]),...v7World.agents.map(agent=>({kind:'agent',ref:agent}))]'));
});
test('existing V7 economy completes woodcutting, confirmed logistics, construction and persisted home evolution',()=>{
 const life=require('../v7/life.js');const world=life.create(1);let sawFoundation=false,sawWalls=false;
 for(let i=0;i<80&&!world.home.occupied;i++){life.step(world);sawFoundation||=world.home.stage===1;sawWalls||=world.home.stage===2;}
 assert.equal(world.home.occupied,true);assert.ok(sawFoundation&&sawWalls,'real home renderer receives distinct stage values');
 const kinds=world.events.map(e=>e.kind);const delivery=kinds.indexOf('delivery-confirmed'),build=kinds.indexOf('build');
 assert.ok(kinds.includes('gather')&&kinds.includes('dispatch')&&delivery>=0&&build>delivery&&kinds.includes('occupy'));
 assert.equal(world.gathered,world.delivered,'delivery does not create wood');assert.equal(world.spent,12,'house construction consumes the real logged wood cost');
 assert.equal(life.validate(world),true);const restored=life.restore(JSON.stringify(world));
 assert.equal(restored.home.stage,3);assert.equal(restored.home.occupied,true);assert.equal(restored.gathered,world.gathered);
});
