/* Peteco V18: read-only art direction bridge. The renderer never changes game state.
   Scene commands are independent of Canvas and can later target sprite atlases. */
(function(root){'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number(v)||0));
const ARCHETYPES=Object.freeze({
  settlement:['foundation','hamlet','village','town','fortress','capital'],
  structure:['foundation','scaffold','framed','complete','damaged','ruined'],
  biome:['forest','drylands','highlands','coast','dunes']
});
function scene(state,region=0){
 const s=state||{},level=clamp(s.level,1,100),population=clamp(s.people,0,500);
 const tier=Math.min(5,Math.floor(level/15));
 const structures=Array.isArray(s.structures)?s.structures:[];
 const buildings=Array.from({length:Math.min(38,Math.max(4,Math.floor(level/3)+Math.floor(population/12)))},(_,i)=>{
  const structure=structures[i%Math.max(1,structures.length)]||{};
  const integrity=structure.integrity==null?100:clamp(structure.integrity,0,100);
  const stage=structure.stage==null?3:clamp(structure.stage,0,3);
  const status=integrity===0?'ruined':integrity<65?'damaged':ARCHETYPES.structure[stage];
  return {id:'building-'+i,kind:i%11===0?'workshop':i%7===0?'farm':i%9===0?'storehouse':'home',status,
   x:((i*71+37)%310)+25,y:155+Math.floor(i/7)*58+(i%2)*15,depth:Math.floor(i/7)};
 });
 const jobs=['woodcut','farm','build','carry','guard','trade'];
 const workers=Array.from({length:Math.min(24,Math.ceil(population/5))},(_,i)=>({
  id:'worker-'+i,job:jobs[i%jobs.length],x:36+(i*83)%290,y:190+(i*53)%245,
  destination:jobs[i%jobs.length]==='build'?'construction':jobs[i%jobs.length]==='carry'?'depot':'worksite'
 }));
 return {biome:ARCHETYPES.biome[clamp(region,0,4)],tier,population,level,
  construction:{progress:clamp((Number(s.project)||0)/Math.max(1,Number(s.projectGoal)||30),0,1)},
  layers:['ground','paths','water','vegetation','structures','workers','effects'],
  buildings,workers,sceneFocus:'village',saveSchemaChanged:false};
}
root.PetecoArtBridgeV18=Object.freeze({scene,ARCHETYPES});
})(typeof window!=='undefined'?window:globalThis);
