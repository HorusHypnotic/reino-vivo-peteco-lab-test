/* V26: stage-aware decorative architecture. Rendering only; no economy mutation. */
(function(root){'use strict';
function roof(g,home){
 if(!g||!home||home.stage!==3||!Number.isFinite(home.x)||!Number.isFinite(home.y))return false;
 const x=home.x,y=home.y;
 g.save();g.beginPath();g.moveTo(x-28,y-31);g.lineTo(x,y-53);g.lineTo(x+28,y-31);g.closePath();g.fillStyle='#754636';g.fill();
 g.beginPath();g.moveTo(x-23,y-34);g.lineTo(x,y-49);g.lineTo(x+23,y-34);g.closePath();g.fillStyle='#b76e4c';g.fill();
 g.strokeStyle='rgba(238,186,124,.42)';g.lineWidth=1;
 for(let i=0;i<3;i++){const dy=i*4;g.beginPath();g.moveTo(x-18+i*5,y-36-dy);g.lineTo(x+18-i*5,y-36-dy);g.stroke();}
 g.fillStyle='#6e4a35';g.fillRect(x-18,y-23,8,9);g.fillRect(x+10,y-23,8,9);
 g.fillStyle='#b9e1d5';g.fillRect(x-16,y-21,4,5);g.fillRect(x+12,y-21,4,5);
 g.fillStyle='#e2c39a';g.fillRect(x-1,y-10,2,3);
 g.restore();return true;
}
/* Scene-only lifecycle cues for the already saved V2 houses. The painted
 * V18 house stays the underlying illustration; scaffolds, damage and repairs
 * are overlays derived from that structure's persisted stage and integrity. */
function structureState(g,state,layout,tick=0){
 if(!g||!state||!layout)return false;
 const x=Number(layout.x),y=Number(layout.y),w=Number(layout.width),h=Number(layout.height);
 if(![x,y,w,h].every(Number.isFinite)||w<20||h<20)return false;
 const stage=Math.max(0,Math.min(3,Math.floor(Number(state.stage)||0)));
 const integrity=Math.max(0,Math.min(100,Number(state.integrity)||0));
 if(stage===3&&integrity>=90)return false;
 g.save();
 if(stage<3){
  const top=y-h;
  g.lineCap='round';g.lineJoin='round';g.strokeStyle='#71523c';g.lineWidth=2;
  for(const side of [-1,1]){
   const sx=x+side*(w/2+5);
   g.beginPath();g.moveTo(sx,y+2);g.lineTo(sx,top+8);g.lineTo(x,y-h-20);g.stroke();
   g.beginPath();g.moveTo(sx,top+18);g.lineTo(x-side*3,top+18);g.stroke();
  }
  if(stage===0){
   g.fillStyle='#80694d';g.fillRect(x-w*.43,y-5,w*.86,5);
   for(let i=0;i<Math.max(3,Math.floor(w/13));i++){
    const bx=x-w*.4+i*w*.8/Math.max(2,Math.floor(w/13));
    g.fillStyle=i%2?'#c2ae8e':'#a59175';g.fillRect(bx,y-11,9,6);
   }
  }else{
   g.strokeStyle='#a9855d';g.beginPath();g.moveTo(x-w/2-5,top+18);g.lineTo(x+w/2+5,top+18);g.stroke();
   if(stage===2){g.strokeStyle='#684b3a';g.lineWidth=3;g.beginPath();g.moveTo(x-w/2-8,top+3);g.lineTo(x,top-18);g.lineTo(x+w/2+8,top+3);g.stroke();}
  }
 }
 if(integrity<90){
  g.strokeStyle=integrity===0?'#342d2b':'#593d35';g.lineWidth=integrity===0?3:2;
  const crackX=x+w*.16,top=y-h+Math.max(7,h*.22);
  g.beginPath();g.moveTo(crackX,top);g.lineTo(crackX-5,top+8);g.lineTo(crackX+2,top+15);g.lineTo(crackX-4,top+25);g.stroke();
  if(integrity<45){
   g.fillStyle='rgba(53,43,39,.72)';g.beginPath();g.moveTo(x+w*.22,y-h);g.lineTo(x+w*.48,y-h);g.lineTo(x+w*.42,y-h+10);g.lineTo(x+w*.29,y-h+6);g.closePath();g.fill();
  }
  if(integrity===0){
   for(let i=0;i<4;i++){
    g.fillStyle=i%2?'#846e59':'#a18b70';g.beginPath();
    g.moveTo(x-w*.38+i*w*.17,y-2);g.lineTo(x-w*.31+i*w*.17,y-8-(i%2)*3);g.lineTo(x-w*.22+i*w*.17,y-2);g.closePath();g.fill();
   }
  }
 }
 g.restore();return true;
}
root.PetecoV26Architecture=Object.freeze({roof,structureState});
})(typeof window!=='undefined'?window:globalThis);
