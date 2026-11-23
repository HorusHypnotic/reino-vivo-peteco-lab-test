/* V19 forest states: illustrated, read-only overlays driven by V18 ledger events. */
(function(root){'use strict';
const PACK=root.PetecoVisualFactoryV18&&root.PetecoVisualFactoryV18.get('forest');
const CELL=PACK?Object.freeze({width:PACK.width/PACK.grid.columns,height:PACK.height/PACK.grid.rows}):Object.freeze({width:543,height:724});
const FRAME=PACK?PACK.states:Object.freeze({tree:0,falling:1,stump:2,sapling:3});
const SIZE=PACK?PACK.render:Object.freeze({width:66,height:88,feetOffsetY:0});
const TREE=Object.freeze({x:118,y:290});
let cycle=null,stumpUntil=0,regrowUntil=0;
function state(actor,now){
 const ledger=actor&&actor.ledger;
 const confirmed=!!(ledger&&ledger.deliveryConfirmed);
 const active=confirmed&&actor.phase==='carry';
 if(active&&cycle!==actor.cycle){
  cycle=actor.cycle;
  // Short falling window, followed by a visible stump and regrowth.
  // Timed from a confirmed delivery, never from speculative work.
  stumpUntil=now+850;regrowUntil=now+1900;
 }
 if(active&&now<stumpUntil-600)return 'falling';
 if(now<stumpUntil)return 'stump';
 if(now<regrowUntil)return 'sapling';
 return 'tree';
}
function draw(g,actor,image,now=Date.now(),options={}){
 if(!g||!image||!image.complete||!image.naturalWidth||image.naturalWidth!==CELL.width*4||image.naturalHeight!==CELL.height)return false;
 const override=typeof options.previewState==='string'&&Object.prototype.hasOwnProperty.call(FRAME,options.previewState)?options.previewState:null;
 const phase=override||state(actor||{},Number(now)||0),frame=FRAME[phase],rect=root.PetecoVisualFactoryV18&&root.PetecoVisualFactoryV18.frameRect('forest',phase);
 const x=Number.isFinite(options.x)?options.x:TREE.x,y=Number.isFinite(options.y)?options.y:TREE.y;
 const width=Number.isFinite(options.width)?options.width:SIZE.width,height=Number.isFinite(options.height)?options.height:SIZE.height;
 g.drawImage(image,rect?rect.x:frame*CELL.width,rect?rect.y:0,CELL.width,CELL.height,x-width/2,y-height+SIZE.feetOffsetY,width,height);
 return phase;
}
root.PetecoForestArtV19=Object.freeze({CELL,FRAME,SIZE,TREE,state,draw});
})(typeof window!=='undefined'?window:globalThis);
