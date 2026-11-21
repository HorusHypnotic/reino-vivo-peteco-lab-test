/* V19 forest states: illustrated, read-only overlays driven by V18 ledger events. */
(function(root){'use strict';
const CELL=Object.freeze({width:543,height:724});
const FRAME=Object.freeze({tree:0,falling:1,stump:2,sapling:3});
const SIZE=Object.freeze({width:66,height:88});
let cycle=null,stumpUntil=0,regrowUntil=0;
function state(actor,now){
 const ledger=actor&&actor.ledger;
 const confirmed=!!(ledger&&ledger.deliveryConfirmed);
 const active=confirmed&&actor.phase==='carry';
 if(active&&cycle!==actor.cycle){cycle=actor.cycle;stumpUntil=now+850;regrowUntil=now+1900;}
 if(active)return 'falling';
 if(confirmed&&actor.phase==='return')return 'stump';
 if(now<stumpUntil)return 'stump';
 if(now<regrowUntil)return 'sapling';
 return 'tree';
}
function draw(g,actor,image,now=Date.now()){
 if(!g||!image||!image.complete||!image.naturalWidth||image.naturalWidth!==CELL.width*4||image.naturalHeight!==CELL.height)return false;
 const phase=state(actor||{},Number(now)||0),frame=FRAME[phase];
 const x=Number(actor&&actor.x)||118,y=Number(actor&&actor.y)||290;
 g.drawImage(image,frame*CELL.width,0,CELL.width,CELL.height,x-SIZE.width/2,y-SIZE.height,SIZE.width,SIZE.height);
 return phase;
}
root.PetecoForestArtV19=Object.freeze({CELL,FRAME,SIZE,state,draw});
})(typeof window!=='undefined'?window:globalThis);
