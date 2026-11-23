/* V23 spectator direction: prioritize verified simulation activity, never invent events. */
(function(root){'use strict';
const priority=Object.freeze({build:5,deliver:4,gather:3,transport:2,trade:1});
function highlights(agents,limit=2){
 if(!Array.isArray(agents)||!Number.isInteger(limit)||limit<1)return [];
 return agents.map((agent,index)=>({agent,index,score:priority[agent?.task]||0}))
 .filter(item=>item.score>0).sort((a,b)=>b.score-a.score||a.index-b.index)
 .slice(0,limit).map(item=>item.agent);
}
root.PetecoV23Direction=Object.freeze({highlights});
})(typeof window!=='undefined'?window:globalThis);
