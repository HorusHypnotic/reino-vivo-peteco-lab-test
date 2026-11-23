/* V20 runtime QA, read-only, opt-in. No economy or save mutation. */
(function(root){'use strict';
function inspect(actors,state,warOnScreen){
 const snapshots={};let active=0;
 for(const job of ['farm','quarry','construction']){
  const actor=actors&&actors[job],s=actor&&actor.snapshot();
  if(!s){snapshots[job]={phase:'unavailable'};continue;}
  const valid=['idle','walk','work','return'].includes(s.phase)&&Number.isFinite(s.x)&&Number.isFinite(s.y);
  snapshots[job]={phase:s.phase,cycle:s.cycle,x:s.x,y:s.y,valid};
  if(s.phase!=='idle')active++;
 }
 const phase=state&&state.phase||'unknown',war=!!warOnScreen;
 return Object.freeze({cycle:state&&state.cycles||0,phase,war,active,actors:snapshots,violations:Object.keys(snapshots).filter(j=>snapshots[j].valid===false).concat(war&&active?['actor-active-during-war']:[])});
}
root.PetecoQAV20=Object.freeze({inspect});
})(typeof window!=='undefined'?window:globalThis);
