/* Deterministic, save-isolated visual fixtures. Uses the production scene and draw modules.
   This is a renderer-level canvas capture, not browser/device homologation. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/evidence/v21-wall-stages');
const canvas=createCanvas(720,960),g=canvas.getContext('2d');g.scale(2,2);
const context={console,URLSearchParams,location:{search:'?v20=1'},Date,Math,Number,Object,Array};context.window=context;context.globalThis=context;
for(const file of ['v18/actor-state-machine.js','v18/art-bridge.js','v20/construction-state.js','v18/art-motion.js','v18/woodcutter-renderer.js','v19/forest-art.js','v20/profession-renderer.js'])
 vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const stages=[
 ['00-idle',{project:0,projectGoal:30,projectCount:0}],
 ['10-foundation',{project:10,projectGoal:30,projectCount:0}],
 ['20-walls',{project:20,projectGoal:30,projectCount:0}],
 ['29-finish',{project:29,projectGoal:30,projectCount:0}],
 ['30-goal',{project:30,projectGoal:30,projectCount:0}],
 ['01-complete',{project:0,projectGoal:30,projectCount:1}],
 ['15-next',{project:15,projectGoal:30,projectCount:1}],
 ['reload-preserved',JSON.parse(JSON.stringify({v:2,project:15,projectGoal:30,projectCount:1}))]
];
(async()=>{
 const scene=await loadImage(path.join(root,'v18/assets/village-scene.svg'));
 const wood=await loadImage(path.join(root,'v18/assets/woodcutter-atlas-original.png'));
 const forest=await loadImage(path.join(root,'v19/assets/forest-cycle-atlas.png'));
 const manifest=[];let nextWallPixels=null;
 for(let i=0;i<stages.length;i++){
  const [name,state]=stages[i];g.clearRect(0,0,360,480);g.drawImage(scene,0,0,360,480);
  const art=context.PetecoArtBridgeV18.scene({level:79,people:81,project:state.project,projectGoal:state.projectGoal,projectCount:state.projectCount,structures:[],artWorkers:[{id:'synthetic-builder',job:'build',phase:'work',x:198,y:329}]});
  const tick=480;context.PetecoArtMotionV18.draw(g,art,tick);
  // Draw a fixed atlas frame to retain the real V18 woodcutter art in every comparison.
  context.PetecoWoodcutterRendererV18.draw(g,{state:'idle',frame:0,x:112,y:353,facing:1},wood);
  const treeActor={state:'idle',frame:0,x:112,y:353,facing:1,phase:'idle',cycle:1,ledger:null};
  context.PetecoForestArtV19.draw(g,treeActor,forest,1000);
  // One synthetic builder is rendered only as a composition fixture, never from live game state.
  context.PetecoProfessionRendererV20.draw(g,{job:'construction',phase:'work',x:234,y:330},tick);
  g.fillStyle='#14232ee8';g.fillRect(8,9,344,47);g.fillStyle='#ffe2a0';g.font='bold 14px sans-serif';g.fillText('QA ISOLADO · '+name.toUpperCase(),17,28);g.fillStyle='#fff0cf';g.font='12px sans-serif';g.fillText(`${state.project}/${state.projectGoal} · muralhas concluídas: ${state.projectCount}`,17,45);
  const file=path.join(out,`${name}.png`);fs.writeFileSync(file,canvas.toBuffer('image/png'));
  const crop=Buffer.from(g.getImageData(300,500,180,160).data);
  if(name==='15-next')nextWallPixels=crop;
  if(name==='reload-preserved'&&!nextWallPixels.equals(crop))throw Error('reloaded persistent wall composition changed');
  manifest.push({file:path.relative(root,file),state,phase:context.PetecoConstructionV20.derive(state).phase,sha256:require('node:crypto').createHash('sha256').update(fs.readFileSync(file)).digest('hex')});
 }
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({type:'synthetic-renderer-captures',saveMutated:false,browserHomologation:false,reloadCropMatches:true,frames:manifest},null,2)+'\n');
 console.log(`PASS rendered ${manifest.length} production-renderer fixtures; synthetic state only; no game save read or written`);
})().catch(e=>{console.error(e);process.exitCode=1});
