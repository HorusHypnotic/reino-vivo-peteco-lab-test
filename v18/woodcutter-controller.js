/* V18 woodcutter: transient, read-only choreography for aggregated forest events. */
(function(root){'use strict';
const DEPOT=Object.freeze({x:200,y:404}),TREE=Object.freeze({x:118,y:290});
const DURATION=Object.freeze({walkToTree:.34,carry:.34,return:.34});
function create(){
 let actor={phase:'idle',x:DEPOT.x,y:DEPOT.y,frame:0,elapsed:0,epoch:null,cycle:null,ledger:null};
 let segment=null,pending=null,clock=0;
 const stateFor=phase=>phase==='walkToTree'||phase==='return'?'walk':phase==='cut'?'work':phase==='carry'?'carry':'idle';
 function begin(run){actor={...actor,phase:'walkToTree',x:DEPOT.x,y:DEPOT.y,frame:0,elapsed:0,epoch:run.epoch,cycle:run.cycle,ledger:null};segment={from:DEPOT,to:TREE,duration:DURATION.walkToTree};actor.facing=Math.sign(TREE.x-DEPOT.x)||1;}
 function start(input={}){
  const run={epoch:Number(input.epoch),cycle:Number(input.cycle)};
  if(!Number.isSafeInteger(run.epoch)||!Number.isSafeInteger(run.cycle)||run.cycle<1)return false;
  if(actor.phase==='carry'||actor.phase==='return'){pending=run;return true;}
  pending=null;begin(run);return true;
 }
 function commit(event={}){
  if(!event||Number(event.epoch)!==actor.epoch||Number(event.cycle)!==actor.cycle||actor.phase==='idle')return false;
  const forestBefore=Number(event.forestBefore)||0,forestAfter=Number(event.forestAfter)||0;
  const deliveriesBefore=Number(event.deliveriesBefore)||0,deliveriesAfter=Number(event.deliveriesAfter)||0;
  const producedWood=Math.max(0,Number(event.producedWood)||0);
  const confirmed=deliveriesAfter>deliveriesBefore&&producedWood>0;
  actor.ledger=Object.freeze({cycle:actor.cycle,forestBefore,forestAfter,producedWood,deliveriesBefore,deliveriesAfter,woodBefore:Number(event.woodBefore)||0,woodAfter:Number(event.woodAfter)||0,deliveryConfirmed:confirmed});
  actor.elapsed=0;actor.frame=0;
  if(confirmed){actor.phase='carry';segment={from:TREE,to:DEPOT,duration:DURATION.carry};actor.facing=Math.sign(DEPOT.x-TREE.x)||1;}
  else {actor.phase='return';segment={from:TREE,to:DEPOT,duration:DURATION.return};actor.facing=Math.sign(DEPOT.x-TREE.x)||1;}
  return true;
 }
 function cancel(epoch){
  if(epoch!=null&&actor.epoch!==Number(epoch)&&pending?.epoch!==Number(epoch))return false;
  pending=null;segment=null;actor={phase:'idle',x:DEPOT.x,y:DEPOT.y,frame:0,elapsed:0,epoch:null,cycle:null,ledger:epoch==null?null:actor.ledger,facing:1};return true;
 }
 function update(dt){
  let remaining=Math.min(.1,Math.max(0,Number(dt)||0));clock+=remaining;
  if(segment){actor.elapsed+=remaining;const p=Math.min(1,actor.elapsed/segment.duration);actor.x=segment.from.x+(segment.to.x-segment.from.x)*p;actor.y=segment.from.y+(segment.to.y-segment.from.y)*p;
   if(p>=1){const finished=actor.phase;segment=null;actor.elapsed=0;actor.frame=0;
    if(finished==='walkToTree')actor.phase='cut';
    else {actor.phase='idle';actor.x=DEPOT.x;actor.y=DEPOT.y;if(pending){const next=pending;pending=null;begin(next);}}
   }
  }else if(actor.phase==='cut')actor.elapsed+=remaining;
  const state=stateFor(actor.phase),fps=state==='walk'?8:state==='work'?5:state==='carry'?7:2;
  actor.frame=Math.floor((actor.elapsed+clock)*fps)%4;
  return snapshot();
 }
 function snapshot(){return Object.freeze({...actor,state:stateFor(actor.phase),pending:!!pending});}
 return Object.freeze({start,commit,cancel,update,snapshot});
}
root.PetecoWoodcutterV18=Object.freeze({create,DEPOT,TREE,DURATION});
})(typeof window!=='undefined'?window:globalThis);
