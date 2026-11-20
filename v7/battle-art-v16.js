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
 // V16.2: damage and repairs are visual projections of existing faction state.
 for(const side of sides){
  const faction=side.left?war.a:war.b;
  const state=war.visualFactions&&war.visualFactions[faction]||{};
  const ruins=clamp(state.ruins,0,20),forts=clamp(state.fortifications,0,20);
  const hp=clamp(side.hp,0,100),broken=Math.min(5,Math.floor((100-hp)/22)+Math.floor(ruins/3));
  const base=side.left?30:282,center=base+24;
  ctx.fillStyle='#c4b89d';
  for(let i=0;i<Math.max(0,5-broken);i++)ctx.fillRect(base-5+i*12,137,9,12);
  ctx.fillStyle='#6b6966';
  for(let i=0;i<broken;i++){
   const x=base-5+i*12;
   ctx.fillRect(x,214+(i%2)*3,12,5);
   ctx.fillRect(x+3,220+(i%3)*2,7,4);
  }
  // Rebuilt defenses appear only when the underlying fortification count exists.
  ctx.fillStyle='#c9c1a9';
  for(let i=0;i<Math.min(4,Math.floor(forts));i++){
   const x=base-3+i*14;
   ctx.fillRect(x,205,10,12);
   ctx.fillRect(x-2,202,14,4);
  }
  if(hp<50||ruins>0){
   ctx.fillStyle='#343b41';
   const smoke=Math.min(4,1+Math.floor(ruins/3)+(hp<30?1:0));
   for(let i=0;i<smoke;i++){
    const drift=Math.sin(t/28+i*2)*5;
    ctx.globalAlpha=.12+.09*(i%3);
    ctx.beginPath();ctx.arc(center+drift,155-i*13-(t%18),7+i*2,0,Math.PI*2);ctx.fill();
   }
   ctx.globalAlpha=1;
  }
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
