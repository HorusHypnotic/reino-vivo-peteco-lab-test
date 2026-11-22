/* Reusable V18 visual package contract. This registers recovered assets; it
 * does not synthesize frames, actors, simulation events, or persistent state. */
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
  id:'forest-cycle-v19',kind:'environment',asset:'v19/assets/forest-cycle-atlas.png',
  width:2172,height:724,channels:4,grid:Object.freeze({columns:4,rows:1}),
  states:Object.freeze({tree:0,falling:1,stump:2,sapling:3}),framesPerState:1,
  render:Object.freeze({width:66,height:88,anchor:'feet',feetOffsetY:0,direction:'fixed'}),
  interaction:Object.freeze({target:'woodcutter-v18',contact:'tree-worksite',occlusion:'behind-actor'}),
  sha256:'422978a6e7c430d7fcd7e30aebd0fec7e51a71af79f18ad659922a282faf4a1f',
  provenance:'Original illustrated environment atlas recorded in docs/V19-MUNDO-EM-MOVIMENTO.md.',
  license:'Original project artwork; no third-party asset attribution recorded.'
 })
});
function get(name){return PACKS[name]||null;}
function frameRect(name,state,index=0){
 const p=get(name);if(!p||!Object.hasOwn(p.states,state))return null;
 const i=Math.max(0,Math.min(p.framesPerState-1,Math.floor(Number(index)||0)));
 const cellWidth=p.width/p.grid.columns,cellHeight=p.height/p.grid.rows;
 const row=p.kind==='actor'?p.states[state]:0,column=p.kind==='actor'?i:p.states[state];
 return Object.freeze({x:column*cellWidth,y:row*cellHeight,width:cellWidth,height:cellHeight});
}
root.PetecoVisualFactoryV18=Object.freeze({version:1,list:()=>Object.keys(PACKS),get,frameRect});
})(typeof window!=='undefined'?window:globalThis);
