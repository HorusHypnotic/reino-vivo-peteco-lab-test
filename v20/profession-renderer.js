/* V21 visual workshop: distinct profession silhouettes, tools, animation and loads.
 * Reads confirmed V20 actor snapshots only. Never mutates save/economy.
 * Sprite atlas support can replace these drawings without changing controllers. */
(function(root){'use strict';
const STYLE=Object.freeze({
 farm:{coat:'#829953',dark:'#4f683f',hat:'#d6ae65',accent:'#d9c384'},
 quarry:{coat:'#547b91',dark:'#385466',hat:'#8c9a9c',accent:'#c9c9bd'},
 construction:{coat:'#a97646',dark:'#765032',hat:'#d9ad60',accent:'#d8c4a0'}
});
function ellipse(g,x,y,rx,ry,color){g.fillStyle=color;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();}
function line(g,x1,y1,x2,y2,width,color){g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();}
function poly(g,points,color){g.fillStyle=color;g.beginPath();g.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)g.lineTo(points[i][0],points[i][1]);g.closePath();g.fill();}
/* Optional painted atlases: each job has four columns (idle/walk/work/carry).
 * Registration is explicit and isolated from the economic controller.
 * Until an atlas has loaded successfully the existing procedural renderer remains. */
const PAINTED=Object.create(null);
const STATES=Object.freeze({idle:0,walk:1,work:2,carry:3,return:3});
function registerAtlas(job,image,options){
 if(!Object.hasOwn(STYLE,job)||!image||!options)return false;
 const width=Number(options.width),height=Number(options.height);
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return false;
 PAINTED[job]={image,width,height};
 return true;
}
function drawPainted(g,a,tick){
 const pack=PAINTED[a.job];if(!pack||!pack.image.complete||!pack.image.naturalWidth)return false;
 const x=Number(a.x),y=Number(a.y);if(!Number.isFinite(x)||!Number.isFinite(y))return false;
 const row=STATES[a.phase];if(row==null)return false;
 const col=a.phase==='idle'?Math.floor(Math.max(0,Number(tick)||0)/24)%4:Math.floor(Math.max(0,Number(tick)||0)/8)%4;
 const iw=pack.image.naturalWidth/4,ih=pack.image.naturalHeight/4;
 if(!iw||!ih)return false;
 // The original atlas render dimensions are for close-ups. The 360px
 // village stage needs smaller actors with a shared feet anchor.
 const scale=.62,drawW=pack.width*scale,drawH=pack.height*scale;
 g.save();g.translate(x,y);
 g.fillStyle='#142d274a';g.beginPath();g.ellipse(0,1,drawW*.32,3.4,0,0,Math.PI*2);g.fill();
 if(a.facing<0)g.scale(-1,1);
 g.drawImage(pack.image,col*iw,row*ih,iw,ih,-drawW/2,-drawH,drawW,drawH);
 g.restore();return true;
}
function draw(g,a,tick){
 if(!g||!a||!STYLE[a.job])return false;
 if(drawPainted(g,a,tick))return true;
 if(a.phase==='idle')return false;
 const x=Number(a.x),y=Number(a.y);if(!Number.isFinite(x)||!Number.isFinite(y))return false;
 const s=STYLE[a.job],moving=a.phase==='walk'||a.phase==='return';
 const step=moving?Math.sin(tick*.28)*3:0,work=a.phase==='work',swing=work?Math.sin(tick*.32)*.65:0;
 const face=a.phase==='return'?-1:1;
 g.save();g.translate(x,y);g.scale(face*.88,.88);
 ellipse(g,0,1,15,4,'#15271b77');
 // Boots and articulated walking legs, not static rectangles.
 line(g,-5,-12,-6+step,0,4,'#3b3430');line(g,5,-12,6-step,0,4,'#3b3430');
 line(g,-6+step,0,-10+step,0,5,'#282b2a');line(g,6-step,0,10-step,0,5,'#282b2a');
 // Cloth, belt, shoulders and a recognizable silhouette for each trade.
 poly(g,[[-11,-34],[10,-34],[12,-12],[-12,-12]],s.coat);
 poly(g,[[-11,-34],[-5,-37],[8,-37],[12,-32]],s.dark);
 line(g,-10,-21,10,-21,3,'#584534');ellipse(g,1,-21,2,2,'#c9b07a');
 line(g,-8,-31,-13,-17,5,s.dark);
 ellipse(g,0,-42,8,10,'#d4a17c');ellipse(g,3,-43,1.3,1.4,'#493b31');
 // Different headwear, not recolors of the same generic hat.
 if(a.job==='farm'){
  poly(g,[[-11,-50],[10,-50],[7,-58],[-6,-58]],'#a77b46');
  line(g,-17,-50,17,-50,5,s.hat);
 }else if(a.job==='quarry'){
  poly(g,[[-10,-50],[10,-50],[8,-58],[-8,-58]],s.hat);
  line(g,-12,-50,12,-50,3,'#dae0d6');
 }else{
  poly(g,[[-10,-49],[10,-49],[8,-58],[-8,-58]],'#c88b36');
  line(g,-12,-49,12,-49,4,s.hat);
  line(g,0,-58,0,-51,2,'#f4c96e');
 }
 // Profession-specific tools animate only on confirmed work events.
 g.save();g.translate(10,-29);g.rotate(swing);
 line(g,0,0,7,9,4,'#d6a27d');
 if(a.job==='farm'){
  line(g,7,9,15,-16,3,'#75523b');
  line(g,9,-15,22,-15,3,'#c3c9b2');
  for(let i=0;i<3;i++)line(g,14+i*4,-15,13+i*4,-8,2,'#c3c9b2');
 }else if(a.job==='quarry'){
  line(g,7,9,18,-15,3,'#735440');
  poly(g,[[10,-17],[24,-20],[29,-15],[18,-11]],'#b6c0c2');
 }else{
  line(g,7,9,19,-13,4,'#73513a');
  poly(g,[[13,-18],[27,-18],[26,-9],[18,-9]],'#b2b9b3');
 }
 g.restore();
 if(work&&a.job==='quarry'&&Math.floor(tick/8)%2===0){
  ellipse(g,15,-4,2,2,'#e5c783');ellipse(g,21,-9,1.5,1.5,'#f4d68e');
 }
 if(work&&a.job==='farm'){line(g,-15,-1,-15,-7,2,'#789b4c');line(g,-11,-1,-10,-5,2,'#9ab65b');}
 if(work&&a.job==='construction'&&Math.floor(tick/10)%2===0)ellipse(g,19,-9,2,2,'#f1d184');
 // Carrying cargo on the return trip makes the production cycle legible.
 if(a.phase==='return'){
  if(a.job==='farm'){ellipse(g,-14,-24,10,8,'#b08a4b');ellipse(g,-15,-29,6,3,'#a4b965');}
  else if(a.job==='quarry')poly(g,[[-23,-30],[-9,-31],[-7,-19],[-21,-18]],'#9b9e98');
  else poly(g,[[-24,-28],[-10,-28],[-10,-20],[-24,-20]],'#bb9762');
 }
 g.restore();return true;
}
root.PetecoProfessionRendererV20=Object.freeze({draw,registerAtlas});
})(typeof window!=='undefined'?window:globalThis);
