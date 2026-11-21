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
 // Only real structures may appear as state-linked buildings. Decorative scenery belongs to the background.
 const buildings=structures.slice(0,64).map((structure,i)=>{
  const integrity=structure.integrity==null?100:clamp(structure.integrity,0,100);
  const stage=structure.stage==null?3:clamp(structure.stage,0,3);
  const status=integrity===0?'ruined':integrity<65?'damaged':ARCHETYPES.structure[stage];
  return {id:'structure-'+(structure.id??i),kind:'home',status,integrity,stage,
   x:72+i*93,y:260+(i%2)*64,depth:i};
 });
 // Explicit visual worker descriptors only. Population is not evidence of an individual's job.
 const workers=(Array.isArray(s.artWorkers)?s.artWorkers:[]).slice(0,24)
  .filter(w=>w&&Number.isFinite(w.x)&&Number.isFinite(w.y)&&typeof w.job==='string')
  .map((w,i)=>({id:String(w.id??'actor-'+i),job:w.job,phase:w.phase||'idle',
   x:clamp(w.x,0,360),y:clamp(w.y,0,480),target:w.target||null}));
 return {biome:ARCHETYPES.biome[clamp(region,0,4)],tier,population,level,
  construction:{progress:clamp((Number(s.project)||0)/Math.max(1,Number(s.projectGoal)||30),0,1)},
  layers:['ground','paths','water','vegetation','structures','workers','effects'],
  buildings,workers,sceneFocus:'village',saveSchemaChanged:false};
}
root.PetecoArtBridgeV18=Object.freeze({scene,ARCHETYPES});
})(typeof window!=='undefined'?window:globalThis);
