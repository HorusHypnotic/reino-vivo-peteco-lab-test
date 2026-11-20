/* V16 visual layer: original canvas artwork, no game-state mutations. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PetecoVisualV16=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function draw(g,s,frame){
 if(!g||!s)return;
 const t=Number(frame)||0, level=Math.max(1,Number(s.level)||1);
 const house=(x,y,scale,roof,damage)=>{
  g.save();g.translate(x,y);g.scale(scale,scale);
  g.fillStyle='#36433d';g.fillRect(-23,21,52,8);
  g.fillStyle='#c5a67c';g.fillRect(-19,-2,42,27);
  g.fillStyle='#6c4638';g.beginPath();g.moveTo(-25,0);g.lineTo(2,-21);g.lineTo(28,0);g.closePath();g.fill();
  g.fillStyle=roof;g.beginPath();g.moveTo(-18,-3);g.lineTo(2,-17);g.lineTo(20,-3);g.closePath();g.fill();
  g.fillStyle='#483d37';g.fillRect(-2,10,10,15);g.fillStyle='#f2d990';g.fillRect(-14,6,8,8);g.fillRect(14,6,6,8);
  if(damage){g.fillStyle='#55504a';g.fillRect(-21,17,14,12);g.fillRect(13,19,18,9);}
  g.restore();
 };
 house(166,196,0.85,'#976647',s.damage>30);
 house(201,194,0.7,'#6e7c68',s.damage>55);
 house(183,217,0.6,'#a87d51',s.damage>75);
 // Animated, state-based chimney smoke and workers.
 g.save();g.globalAlpha=.3;g.fillStyle='#e4e3d0';
 for(let i=0;i<3;i++){const y=166-((t*.18+i*13)%45);g.beginPath();g.arc(201+Math.sin(t*.012+i)*5,y,3+i*1.2,0,Math.PI*2);g.fill();}
 g.restore();
 const workers=Math.min(4,Math.max(1,Math.floor((Number(s.people)||3)/25)));
 for(let i=0;i<workers;i++){const x=146+i*17+Math.sin(t*.025+i*2)*7,y=253+i%2*9;
  g.fillStyle='#f4d2a3';g.fillRect(x,y,5,5);g.fillStyle=['#477d72','#a67b56','#7189a0','#8d655a'][i];g.fillRect(x-1,y+5,7,10);
  g.fillStyle='#4e443c';g.fillRect(x,y+15,2,4);g.fillRect(x+4,y+15,2,4);
 }
 if(level>=5){g.fillStyle='#d4ba8c';g.fillRect(142,230,75,3);g.fillStyle='#84664e';for(let i=0;i<5;i++)g.fillRect(145+i*16,230,3,9);}
}
return {draw};
});
