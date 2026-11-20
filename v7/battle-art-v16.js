/* Peteco Lab V16.1: deterministic, read-only battle art. No storage, timers or game mutations. */
(function(root){
'use strict';
function clamp(n,a,b){return Math.max(a,Math.min(b,Number.isFinite(Number(n))?Number(n):a));}
function draw(ctx,war,tick,hit){
 if(!ctx||!war)return;
 const t=clamp(tick,0,1e9), sides=[{hp:war.hpA,left:true,color:'#7cd9ba'},{hp:war.hpB,left:false,color:'#e9a28b'}];
 ctx.save();
 for(const side of sides){
  const count=Math.min(8,Math.ceil(clamp(side.hp,0,100)/13));
  for(let i=0;i<count;i++){
   const lane=i%4,rank=Math.floor(i/4),phase=t/17+i*1.7;
   const x=(side.left?102:258)+(side.left?1:-1)*(rank*15+Math.sin(phase)*5);
   const y=244+lane*12+Math.cos(phase)*2;
   ctx.fillStyle='#283d43';ctx.fillRect(x-5,y+9,12,3);
   ctx.fillStyle=side.color;ctx.fillRect(x-4,y-2,8,11);
   ctx.fillStyle='#e7c9a0';ctx.fillRect(x-3,y-7,6,6);
   ctx.fillStyle='#d3d7db';ctx.fillRect(x-4,y-9,8,3);
   ctx.strokeStyle='#f1e5c5';ctx.lineWidth=2;
   ctx.beginPath();ctx.moveTo(x+(side.left?5:-5),y);ctx.lineTo(x+(side.left?10:-10),y-5);ctx.stroke();
  }
  const damage=100-clamp(side.hp,0,100), rubble=Math.floor(damage/20);
  ctx.fillStyle='#777b75';
  for(let i=0;i<rubble;i++){const x=(side.left?24:304)+(i*9);ctx.fillRect(x,220+(i%2)*4,10,4);}
 }
 if(hit&&Number.isFinite(hit.until)&&t<hit.until){
  const life=clamp((hit.until-t)/95,0,1),x=hit.side==='a'?90:270;
  ctx.globalAlpha=(1-life)*.65;
  ctx.strokeStyle=hit.cmd==='heal'?'#8cf0b5':'#ffd08b';ctx.lineWidth=2+life*5;
  ctx.beginPath();ctx.arc(x,208,5+(1-life)*22,0,Math.PI*2);ctx.stroke();
 }
 ctx.restore();
}
root.PetecoBattleArt={draw};
})(typeof window!=='undefined'?window:globalThis);
