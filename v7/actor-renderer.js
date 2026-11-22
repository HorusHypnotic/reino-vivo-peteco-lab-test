/* V7 live-economy actors rendered with the approved V18/V20 art. */
(function(root){'use strict';
function moving(a){return Number(a?.fromX)!==Number(a?.toX)||Number(a?.fromY)!==Number(a?.toY);}
function activity(agent){const task=agent?.task;return task==='gather'?'CORTANDO':task==='deliver'?'MADEIRA':task==='transport'?'ENTREGA':task==='build'?'CONSTRUINDO':task==='trade'?'TROCA':null;}
function draw(g,agent,x,y,tick,atlas){
 if(!g||!agent||!Number.isFinite(Number(x))||!Number.isFinite(Number(y)))return false;
 if(agent.job==='lenhador'&&root.PetecoWoodcutterRendererV18&&atlas&&atlas.complete&&atlas.naturalWidth){
  const task=agent.task,atTarget=Math.hypot(Number(x)-Number(agent.toX),Number(y)-Number(agent.toY))<=5;const state=task==='gather'?(atTarget?'work':'walk'):task==='deliver'||task==='transport'?'carry':moving(agent)?'walk':'idle';
  return root.PetecoWoodcutterRendererV18.draw(g,{x:Number(x),y:Number(y),state,frame:Math.floor(Number(tick||0)/5)%4,facing:task==='gather'?1:Number(agent.toX)-Number(agent.fromX)<0?-1:1},atlas);
 }
 if(agent.job==='construtor'&&root.PetecoProfessionRendererV20){
  const task=agent.task,phase=task==='build'?'work':moving(agent)?(Number(agent.toX)<Number(agent.fromX)?'return':'walk'):'idle';
  return root.PetecoProfessionRendererV20.draw(g,{job:'construction',phase,x:Number(x),y:Number(y),action:task},Number(tick)||0);
 }
 return false;
}
root.PetecoV7ActorRenderer=Object.freeze({draw,activity});
})(typeof window!=='undefined'?window:globalThis);
