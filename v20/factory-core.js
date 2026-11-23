/* V20 factory core: pure, read-only, no save schema changes. */
(function(root){'use strict';
const JOBS=Object.freeze({
 forest:Object.freeze({actor:'woodcutter',target:'tree',actions:['walk','cut','carry','return'],source:'sectors.forest'}),
 farm:Object.freeze({actor:'farmer',target:'field',actions:['walk','work','plant','harvest','carry','return'],source:'sectors.farm'}),
 quarry:Object.freeze({actor:'miner',target:'rock',actions:['walk','mine','carry','return'],source:'sectors.quarry'}),
 construction:Object.freeze({actor:'builder',target:'project',actions:['walk','build','return'],source:'project'})
});
const finite=n=>Number.isFinite(Number(n))?Number(n):0;
function read(state,job){
 const s=state||{},spec=JOBS[job];if(!spec)return null;
 const value=job==='construction'?finite(s.project):finite((s.sectors||{})[job]);
 const goal=job==='construction'?finite(s.projectGoal):0;
 return Object.freeze({job,actor:spec.actor,target:spec.target,actions:spec.actions,value,goal,progress:goal>0?Math.min(1,Math.max(0,value/goal)):null});
}
function event(input){
 if(!input||!JOBS[input.job]||!JOBS[input.job].actions.includes(input.action))return null;
 const cycle=Number(input.cycle);if(!Number.isSafeInteger(cycle)||cycle<0)return null;
 const confirmed=input.confirmed===true;
 return Object.freeze({id:input.job+':'+cycle+':'+input.action,job:input.job,action:input.action,cycle,confirmed,priority:Math.max(0,Math.min(10,finite(input.priority)))});
}
function queue(events,max=24){
 const seen=new Set();return (Array.isArray(events)?events:[]).filter(e=>e&&e.confirmed===true&&JOBS[e.job]&&JOBS[e.job].actions.includes(e.action)&&Number.isSafeInteger(e.cycle)&&e.cycle>=0&&e.id===e.job+':'+e.cycle+':'+e.action&&!seen.has(e.id)&&seen.add(e.id))
  .sort((a,b)=>b.priority-a.priority||a.cycle-b.cycle).slice(0,Math.max(0,Math.min(64,finite(max))));
}
root.PetecoFactoryV20=Object.freeze({JOBS,read,event,queue});
})(typeof window!=='undefined'?window:globalThis);
