/* Reusable visual package catalog: recovered V18/V19 art and V20 factory-built
 * worker atlases. Asset processing is reproducible; simulation stays elsewhere. */
(function(root){'use strict';
const PACKS=Object.freeze({
 woodcutter:Object.freeze({
  id:'woodcutter-v18',kind:'actor',asset:'v18/assets/woodcutter-atlas-original.png',
  width:1122,height:1402,channels:4,grid:Object.freeze({columns:4,rows:4}),
  states:Object.freeze({idle:0,walk:1,work:2,carry:3}),framesPerState:4,
  render:Object.freeze({width:72,height:90,anchor:'feet',feetOffsetY:11,direction:'flip-on-facing'}),
  interaction:Object.freeze({target:'v19:forest-tree',contact:'tree-worksite',occlusion:'feet-y'}),
  sha256:'ad8aea4d0c7606c472689d334a6b71ba240e658ac12ca306eb588eca19e75b0d',
  provenance:'Original generated illustration recovered from the V18 deliverable; source prompt and generator session were not versioned.',
  license:'Original project artwork per docs/V18-LENHADOR-REAL.md; no third-party LPC layer was exported.'
 }),
 forest:Object.freeze({
  id:'forest-cycle-v19',kind:'environment',sourceAsset:'v19/assets/forest-cycle-atlas.png',asset:'v19/assets/forest-cycle-atlas-clean.png',
  width:2172,height:724,channels:4,grid:Object.freeze({columns:4,rows:1}),
  states:Object.freeze({tree:0,falling:1,stump:2,sapling:3}),framesPerState:1,
  render:Object.freeze({width:66,height:88,anchor:'feet',feetOffsetY:0,direction:'fixed'}),
  interaction:Object.freeze({target:'woodcutter-v18',contact:'tree-worksite',occlusion:'behind-actor'}),
  sha256:'dcd0fa7eb1e2f5b7aeac17a47a5ad87d00f97be4a34b212c72b2e7016fc721d0',
  provenance:'Original illustrated environment atlas recorded in docs/V19-MUNDO-EM-MOVIMENTO.md.',
  license:'Original project artwork; no third-party asset attribution recorded.'
 }),
 farm:Object.freeze({
  id:'farmer-v20',kind:'actor',asset:'v20/assets/professions/farmer.png',width:1120,height:1400,channels:4,
  grid:Object.freeze({columns:4,rows:4}),states:Object.freeze({idle:0,walk:1,work:2,carry:3}),framesPerState:4,
  render:Object.freeze({width:72,height:90,anchor:'feet',feetOffsetY:8,direction:'flip-on-facing'}),
  interaction:Object.freeze({target:'v20:confirmed-farm-event',contact:'farm-worksite',occlusion:'feet-y'}),
  sha256:'9a4e600a9fc14f8c2788571350751638ac0bc252f3281d83dee070095fc2aa98',
  provenance:'Generated for Reino Vivo from v20/art-manifests/farm.json; raw source retained at v20/art-source/farmer-source.png; normalized by tools/build-profession-atlas.cjs.',
  license:'OpenAI Terms of Use checked 2026-11-22; user owns Output as between user and OpenAI to the extent permitted by law. Non-unique output; no third-party infringement warranty. No external art layers.'
 }),
 quarry:Object.freeze({
  id:'miner-v20',kind:'actor',asset:'v20/assets/professions/miner.png',width:1120,height:1400,channels:4,
  grid:Object.freeze({columns:4,rows:4}),states:Object.freeze({idle:0,walk:1,work:2,carry:3}),framesPerState:4,
  render:Object.freeze({width:72,height:90,anchor:'feet',feetOffsetY:8,direction:'flip-on-facing'}),
  interaction:Object.freeze({target:'v20:confirmed-quarry-event',contact:'quarry-worksite',occlusion:'feet-y'}),
  sha256:'f6d3d14b8b5b0ffa5905ff2c75dc9c8f74b93fc73fe87f948d1a2e6aeebc0b1e',
  provenance:'Generated for Reino Vivo from v20/art-manifests/quarry.json; raw source retained at v20/art-source/miner-source.png; normalized by tools/build-profession-atlas.cjs.',
  license:'OpenAI Terms of Use checked 2026-11-22; user owns Output as between user and OpenAI to the extent permitted by law. Non-unique output; no third-party infringement warranty. Reference is original project art.'
 }),
 construction:Object.freeze({
  id:'builder-v20',kind:'actor',asset:'v20/assets/professions/builder.png',width:1120,height:1400,channels:4,
  grid:Object.freeze({columns:4,rows:4}),states:Object.freeze({idle:0,walk:1,work:2,carry:3}),framesPerState:4,
  render:Object.freeze({width:72,height:90,anchor:'feet',feetOffsetY:8,direction:'flip-on-facing'}),
  interaction:Object.freeze({target:'v20:confirmed-project-event',contact:'construction-site',occlusion:'feet-y'}),
  sha256:'53305edcb4aefc6bf242a8322a9eabe7be2e16f76a89d629c83e9174fc4bc79e',
  provenance:'Generated for Reino Vivo from v20/art-manifests/construction.json; raw source retained at v20/art-source/builder-source.png; normalized by tools/build-profession-atlas.cjs.',
  license:'OpenAI Terms of Use checked 2026-11-22; user owns Output as between user and OpenAI to the extent permitted by law. Non-unique output; no third-party infringement warranty. Reference is original project art.'
 })
});
const SCENERY=Object.freeze({
 northwest:Object.freeze({id:'v18-house-northwest',asset:'v18/assets/houses/northwest.svg',sourceAsset:'v18/assets/village-scene.svg',sourceTransform:'translate(150 600) scale(0.87)',format:'svg',viewBox:'0 0 720 960',sha256:'9b1321de2a0a0131ef744880999ef664e92fdd39df3e42378169734bece3069d',provenance:'Extracted without redrawing from the recovered V18 scene; visibility follows persisted structure slot 1.'}),
 northeast:Object.freeze({id:'v18-house-northeast',asset:'v18/assets/houses/northeast.svg',sourceAsset:'v18/assets/village-scene.svg',sourceTransform:'translate(540 585) scale(0.88)',format:'svg',viewBox:'0 0 720 960',sha256:'0d94bfb64a348021661f1eee06d48a0e7279634d7543ec93cde01e251cfb4fe4',provenance:'Extracted without redrawing from the recovered V18 scene; visibility follows persisted structure slot 2.'}),
 south:Object.freeze({id:'v18-house-south',asset:'v18/assets/houses/south.svg',sourceAsset:'v18/assets/village-scene.svg',sourceTransform:'translate(360 855) scale(1.06)',format:'svg',viewBox:'0 0 720 960',sha256:'5281e48db2b601dab6f2759486324d46dff0935d7a7cee3d014b8a90317f3e59',provenance:'Extracted without redrawing from the recovered V18 scene; visibility follows persisted structure slot 0.'})
});
function get(name){return PACKS[name]||null;}
function getScenery(name){return SCENERY[name]||null;}
function frameRect(name,state,index=0){
 const p=get(name);if(!p||!Object.hasOwn(p.states,state))return null;
 const i=Math.max(0,Math.min(p.framesPerState-1,Math.floor(Number(index)||0)));
 const cellWidth=p.width/p.grid.columns,cellHeight=p.height/p.grid.rows;
 const row=p.kind==='actor'?p.states[state]:0,column=p.kind==='actor'?i:p.states[state];
 return Object.freeze({x:column*cellWidth,y:row*cellHeight,width:cellWidth,height:cellHeight});
}
root.PetecoVisualFactoryV18=Object.freeze({version:1,list:()=>Object.keys(PACKS),get,frameRect,listScenery:()=>Object.keys(SCENERY),getScenery});
})(typeof window!=='undefined'?window:globalThis);
