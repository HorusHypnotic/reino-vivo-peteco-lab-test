/* V17 art direction: read-only isometric village stage. Zero changes to simulation. */
(function(root){'use strict';
const C={grass:'#426b50',grass2:'#527c58',path:'#b9a079',stone:'#9c9a8b',wall:'#d6bd90',roof:'#784c40',roofLight:'#a56a50',wood:'#76553e',ink:'#253a39',gold:'#f5d18c'};
const clamp=(n,a,b)=>Math.min(b,Math.max(a,Number(n)||0));
function poly(g,pts,color){g.fillStyle=color;g.beginPath();g.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)g.lineTo(...pts[i]);g.closePath();g.fill();}
function box(g,x,y,w,h,col){g.fillStyle=col;g.fillRect(x,y,w,h);}
function tree(g,x,y,k=1){g.save();g.translate(x,y);g.scale(k,k);box(g,-4,-22,8,25,'#655039');for(const [dx,dy,r,c] of [[-11,-29,13,'#244f3e'],[9,-33,15,'#2e6246'],[0,-45,17,'#387552']]){g.fillStyle=c;g.beginPath();g.arc(dx,dy,r,0,7);g.fill();}g.restore();}
function building(g,x,y,w,h,roof,damage=0){
 g.save();g.translate(x,y);
 // Occlusion, depth and architectural silhouette.
 g.fillStyle='#1b382f55';g.beginPath();g.ellipse(8,8,w*.7,13,0,0,7);g.fill();
 box(g,-w/2,-h,w,h,'#d6bd90');box(g,w/2-10,-h,10,h,'#967c60');
 // Exposed timber frame, not a flat rectangular wall.
 for(const sx of [-w/2+5,w/2-16])box(g,sx,-h+8,5,h-8,'#76553e');
 box(g,-w/2,-h+17,w,5,'#947456');
 poly(g,[[-w/2-11,-h+3],[0,-h-29],[w/2+11,-h+3]],roof);
 poly(g,[[0,-h-29],[w/2+11,-h+3],[w/2+3,-h+9],[0,-h-18]],'#573c37');
 // Rows of shingles, clipped to the roof's pitched planes.
 for(let i=0;i<4;i++){const yy=-h-21+i*7,spread=8+i*12;box(g,-spread/2,yy,spread,2,'#c68d66aa');}
 box(g,-8,-26,16,26,C.wood);box(g,-5,-22,10,20,'#4b3a32');box(g,2,-15,2,3,C.gold);
 for(const wx of [-w/2+14,w/2-26]){box(g,wx,-h+28,13,15,'#674e3b');box(g,wx+2,-h+30,9,11,'#b2d1c6');box(g,wx+6,-h+30,2,11,'#ead2a4');box(g,wx+2,-h+35,9,2,'#ead2a4');}
 // Stone foundation and irregular facade blocks.
 for(let i=0;i<Math.floor(w/14);i++)box(g,-w/2+i*14,-4,12,4,i%2?'#b3a08b':'#aa957d');
 if(damage){poly(g,[[w/2-17,-h+8],[w/2-6,-h+8],[w/2-11,-h+19]],'#6d443c');box(g,w/2-13,-h+20,5,18,'#78544a');}
 g.restore();
}
function well(g,x,y,t){g.save();g.translate(x,y);box(g,-19,1,38,8,'#61574b55');box(g,-16,-10,32,14,'#b1a38a');box(g,-12,-8,24,7,'#487c87');box(g,-17,-34,4,28,C.wood);box(g,13,-34,4,28,C.wood);poly(g,[[-22,-34],[0,-48],[22,-34]],'#885a45');box(g,-2,-28,4,19,'#d6c399');g.restore();}
function garden(g,x,y,t){g.save();g.translate(x,y);poly(g,[[-47,-13],[40,-13],[53,17],[-35,17]],'#735d3c');for(let row=0;row<3;row++)for(let i=0;i<7;i++){const px=-35+i*12+row*3,py=-7+row*10;box(g,px,py,8,3,'#5b9456');box(g,px+3,py-3-Math.sin(t/35+i)*1,2,5,'#9cb86a');}g.restore();}
function cart(g,x,y,t){g.save();g.translate(x,y);box(g,-21,-13,39,16,'#9b6d46');box(g,-17,-18,32,6,'#d2ad72');for(const dx of [-13,12]){g.fillStyle='#344343';g.beginPath();g.arc(dx,6,6,0,7);g.fill();g.fillStyle='#d3bb8c';g.beginPath();g.arc(dx,6,2,0,7);g.fill();}box(g,17,-7,17,3,C.wood);g.restore();}
function lantern(g,x,y,t){box(g,x-2,y-29,4,29,'#5c4a39');box(g,x-6,y-32,12,4,'#77563b');box(g,x-4,y-28,8,9,'#f6c878');g.fillStyle='#f7d88b';g.globalAlpha=.12+.06*Math.sin(t/23);g.beginPath();g.arc(x,y-23,18,0,7);g.fill();g.globalAlpha=1;}
function chimney(g,x,y,t){box(g,x,y,11,19,'#b8a58c');box(g,x-2,y-3,15,5,'#d3c2a3');g.fillStyle='#b6c2b8';for(let i=0;i<3;i++){g.globalAlpha=.17;g.beginPath();g.arc(x+5+Math.sin(t/30+i)*5,y-13-i*11-(t%13),6+i*2,0,7);g.fill();}g.globalAlpha=1;}
function villager(g,x,y,t,color,tool){const bob=Math.sin(t)*1.6;g.save();g.translate(x,y+bob);g.fillStyle='#243c3a66';g.beginPath();g.ellipse(0,3,8,3,0,0,7);g.fill();box(g,-4,-18,8,8,'#dfb38a');box(g,-5,-10,10,13,color);box(g,-4,3,3,6,'#2c424b');box(g,2,3,3,6,'#2c424b');if(tool)box(g,6,-8,2,12,C.gold);g.restore();}
function foreground(g,t,level){
 // Near-field silhouette frames the center without obscuring the village.
 tree(g,-6,482,1.55);tree(g,363,493,1.45);
 for(let i=0;i<8;i++){const x=12+i*48;box(g,x,470+(i%3)*3,16,4,'#688d59');}
 if(level>=8){box(g,6,455,83,7,'#846b4d');for(let i=0;i<4;i++)box(g,12+i*22,445,4,15,'#9b7a55');}
}
function draw(g,s,t){
 if(!g||!s)return;
 const level=clamp(s.level,1,100),population=clamp(s.people,0,200),damage=clamp(s.damage,0,100);
 g.save();g.clearRect(0,0,360,480);
 box(g,0,0,360,480,'#7ba69b');poly(g,[[0,112],[92,49],[168,111]],'#648f86');poly(g,[[125,122],[252,45],[360,117]],'#6b9890');
 box(g,0,132,360,348,C.grass);
 for(let i=0;i<44;i++){const x=(i*79+13)%360,y=143+(i*53)%320;box(g,x,y,8,3,i%3?C.grass2:'#5b895b');}
 // Cobblestone street, visible in front of architecture.
 poly(g,[[157,480],[204,480],[195,270],[165,270]],'#b39c78');
 poly(g,[[0,327],[360,327],[360,355],[0,355]],C.path);
 for(let i=0;i<16;i++){const x=(i*41)%360;box(g,x,335+(i%2)*8,18,2,'#d9c39d');}
 // Depth layers: distant buildings and foliage behind workers.
 for(let i=0;i<6;i++)tree(g,19+i*68,206+(i%2)*9,.76);
 building(g,64,274,62,48,'#865744',damage>35?1:0);
 building(g,294,270,65,48,'#8d644d',damage>55?1:0);
 if(level>=4)building(g,177,245,85,66,'#87513f',damage>20?1:0);
 // Foreground functional sectors, driven by actual level.
 tree(g,35,379,1.3);tree(g,78,407,1.15);
 for(let i=0;i<5;i++){box(g,244+i*19,373,13,7,'#b4a75e');box(g,244+i*19,386,13,7,'#d4ba6c');}
 building(g,183,418,89,60,level>=12?'#945d45':'#754c3e',damage>0?1:0);
 // One readable production tableau: well, crops, workshop cart and lamps.
 garden(g,286,420,t);well(g,111,356,t);
 if(level>=4)chimney(g,200,154,t);
 if(level>=7)cart(g,245+Math.sin(t/170)*13,340,t);
 if(level>=10){lantern(g,139,341,t);lantern(g,223,341,t);}

 if(level>=9){box(g,132,300,10,42,C.stone);box(g,216,300,10,42,C.stone);box(g,131,297,96,8,'#c2b5a0');}
 if(level>=20){box(g,111,452,140,13,'#999487');for(let i=0;i<6;i++)box(g,111+i*24,445,16,8,'#c5bca8');}
 // Small workers are located along meaningful production routes.
 const workers=Math.min(12,Math.max(2,Math.ceil(population/10)));
 const routes=[[72,371,116,350],[266,381,224,352],[159,426,185,365],[54,289,137,320]];
 for(let i=0;i<workers;i++){const a=routes[i%4],p=(Math.sin(t/115+i*1.8)+1)/2,x=a[0]+(a[2]-a[0])*p,y=a[1]+(a[3]-a[1])*p;villager(g,x,y,t/12+i,['#698aa1','#b78754','#7c9467','#8d719d'][i%4],i%3===0);}
 foreground(g,t,level);
 // Compact cinematic location caption; leave central world unobscured.
 box(g,10,39,183,31,'#18342ddd');g.fillStyle='#f9e5b5';g.font='bold 12px system-ui';g.fillText('VILA VIVA  ·  NÍVEL '+level,18,58,166);
 if(damage>0){box(g,10,79,136,23,'#492e2be6');g.fillStyle='#ffd6a9';g.font='bold 11px system-ui';g.fillText('REPAROS · '+damage+'%',18,94);}
 g.restore();
}
root.PetecoArtV17={draw};
})(typeof window!=='undefined'?window:globalThis);
