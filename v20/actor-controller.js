/* V20 universal visual actor. Never writes economy or save; requires confirmed events. */
(function(root){'use strict';
function create(factory,map,job){
 const spec=factory&&factory.JOBS&&factory.JOBS[job],route=map&&map.route&&map.route(job);
 if(!spec||!route)return null;
 const origin=route.depot,target=route.target;
 let actor={job,phase:'idle',x:origin.x,y:origin.y,elapsed:0,cycle:null,action:null};
 let pending=null,segment=null;
 const snapshot=()=>Object.freeze({...actor,pending:!!pending});
 function start(e){
  if(!e||e.job!==job||e.confirmed!==true||!spec.actions.includes(e.action)||!Number.isSafeInteger(e.cycle)||e.cycle<0||e.id!==job+':'+e.cycle+':'+e.action)return false;
  if(actor.phase!=='idle'){pending=e;return true;}
  actor={job,phase:'walk',x:origin.x,y:origin.y,elapsed:0,cycle:e.cycle,action:e.action};
  segment={from:origin,to:target,duration:.6};return true;
 }
 function tick(dt){
  let remaining=Math.max(0,Math.min(.1,Number(dt)||0));
  if(!Number.isFinite(remaining))remaining=0;
  actor.elapsed+=remaining;
  if(segment){
   const p=Math.min(1,actor.elapsed/segment.duration);
   actor.x=segment.from.x+(segment.to.x-segment.from.x)*p;
   actor.y=segment.from.y+(segment.to.y-segment.from.y)*p;
   if(p>=1){segment=null;actor.elapsed=0;if(actor.phase==='walk')actor.phase='work';else actor.phase='idle';}
  }else if(actor.phase==='work'&&actor.elapsed>=.65){
   actor.phase='return';actor.elapsed=0;segment={from:target,to:origin,duration:.6};
  }else if(actor.phase==='idle'&&pending){const next=pending;pending=null;start(next);}
  return snapshot();
 }
 function cancel(){pending=null;segment=null;actor={job,phase:'idle',x:origin.x,y:origin.y,elapsed:0,cycle:null,action:null};return snapshot();}
 return Object.freeze({start,tick,cancel,snapshot});
}
root.PetecoActorV20=Object.freeze({create});
})(typeof window!=='undefined'?window:globalThis);
