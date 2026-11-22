/* V22: read-only depth ordering for V7 agents. No economic or save mutations. */
(function(root){'use strict';
function order(agents,position){
 if(!Array.isArray(agents)||typeof position!=='function')return [];
 return agents.map((agent,index)=>{
  const p=position(agent),x=Number(p?.[0]),y=Number(p?.[1]);
  return {agent,index,x:Number.isFinite(x)?x:0,y:Number.isFinite(y)?y:0};
 }).sort((a,b)=>a.y-b.y||a.index-b.index);
}
root.PetecoV22Depth=Object.freeze({order});
})(typeof window!=='undefined'?window:globalThis);
