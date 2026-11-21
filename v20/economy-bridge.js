/* V20: translate genuine economic deltas into confirmed visual jobs.
   Read-only; call only AFTER progress() has committed the economic cycle. */
(function(root){'use strict';
function capture(s){const x=s||{},a=x.sectors||{};return Object.freeze({cycle:Number(x.cycles)||0,deliveries:Number(x.deliveries)||0,food:Number(x.food)||0,stone:Number(x.stone)||0,project:Number(x.project)||0,farm:Number(a.farm)||0,quarry:Number(a.quarry)||0});}
function diff(before,after,factory){
 if(!before||!after||!factory||after.cycle<=before.cycle)return [];
 const out=[],cycle=after.cycle,delivered=after.deliveries>before.deliveries;
 // On delivery cycles, farm/quarry sector counters reset to zero.
 // The actual inventory delta may be masked by consumption; delivery counter is the
 // confirmed transaction, but individual profession credit is not independently proven.
 // Emit sector-work only on observed positive accumulation, never invent deliveries.
 if(after.farm>before.farm)out.push(factory.event({job:'farm',action:'harvest',cycle,confirmed:true,priority:2}));
 if(after.quarry>before.quarry)out.push(factory.event({job:'quarry',action:'mine',cycle,confirmed:true,priority:2}));
 // A collective construction animation needs a real increase in the project.
 if(after.project>before.project)out.push(factory.event({job:'construction',action:'build',cycle,confirmed:true,priority:4}));
 return out.filter(Boolean);
}
root.PetecoEconomyBridgeV20=Object.freeze({capture,diff});
})(typeof window!=='undefined'?window:globalThis);
