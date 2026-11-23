/* V25: deterministic, inexpensive terrain details behind the existing V7 economy. */
(function(root){'use strict';
function rand(n){const v=Math.sin(n*127.1+78.233)*43758.5453;return v-Math.floor(v);}
function ground(ctx,home){
 if(!ctx||!home||!Number.isFinite(home.x)||!Number.isFinite(home.y))return false;
 ctx.save();
 // Grass clusters are spatially stable, with no frame-to-frame randomness.
 for(let i=0;i<32;i++){
  const x=14+rand(i*3+1)*332,y=90+rand(i*3+2)*365;
  if(Math.abs(x-home.x)<39&&Math.abs(y-home.y)<38)continue;
  ctx.fillStyle=i%3===0?'rgba(178,190,118,.20)':'rgba(38,82,54,.22)';
  ctx.fillRect(x,y,3+rand(i+41)*8,1.5+rand(i+67)*2.5);
 }
 ctx.restore();return true;
}
function road(ctx,points){
 if(!ctx||!Array.isArray(points)||points.length<2||points.some(p=>!Array.isArray(p)||!Number.isFinite(p[0])||!Number.isFinite(p[1])))return false;
 ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
 ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);
 ctx.strokeStyle='#594a36';ctx.lineWidth=12;ctx.stroke();
 ctx.strokeStyle='#a98c62';ctx.lineWidth=9;ctx.stroke();
 ctx.strokeStyle='rgba(231,199,145,.55)';ctx.lineWidth=1.5;ctx.setLineDash([3,10]);ctx.stroke();ctx.setLineDash([]);
 ctx.restore();return true;
}
root.PetecoV25Terrain=Object.freeze({ground,road});
})(typeof window!=='undefined'?window:globalThis);
