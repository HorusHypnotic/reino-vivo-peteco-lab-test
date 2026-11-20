/* V17 art direction: read-only isometric village stage. Zero changes to simulation. */
(function(root){'use strict';
const C={grass:'#426b50',grass2:'#527c58',path:'#b9a079',stone:'#9c9a8b',wall:'#d6bd90',roof:'#784c40',roofLight:'#a56a50',wood:'#76553e',ink:'#253a39',gold:'#f5d18c'};
const clamp=(n,a,b)=>Math.min(b,Math.max(a,Number(n)||0));
function poly(g,pts,color){g.fillStyle=color;g.beginPath();g.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)g.lineTo(...pts[i]);g.closePath();g.fill();}
function box(g,x,y,w,h,col){g.fillStyle=col;g.fillRect(x,y,w,h);}
function tree(g,x,y,k=1){g.save();g.translate(x,y);g.scale(k,k);box(g,-4,-22,8,25,'#655039');for(const [dx,dy,r,c] of [[-11,-29,13,'#244f3e'],[9,-33,15,'#2e6246'],[0,-45,17,'#387552']]){g.fillStyle=c;g.beginPath();g.arc(dx,dy,r,0,7);g.fill();}g.restore();}
function building(g,x,y,w,h,roof,damage=0){g.save();g.translate(x,y);box(g,-w/2+4,3,w,h,'#2b4b3b55');box(g,-w/2,-h,w,h,C.wall);box(g,w/2-7,-h,7,h,'#9c8567');poly(g,[[-w/2-8,-h], [0,-h-24],[w/2+8,-h]],roof);poly(g,[[0,-h-24],[w/2+8,-h],[w/2,-h+5],[0,-h-18]],'#533a35');box(g,-6,-19,12,19,C.wood);box(g,-w/2+9,-h+16,10,10,'#f2d79c');box(g,-w/2+11,-h+18,6,6,'#a7c8bf');if(damage>0){box(g,w/2-17,-h+6,12,4,'#75443c');box(g,w/2-10,-h+10,4,12,'#75443c');}g.restore();}
function villager(g,x,y,t,color,tool){const bob=Math.sin(t)*1.6;g.save();g.translate(x,y+bob);g.fillStyle='#243c3a66';g.beginPath();g.ellipse(0,3,8,3,0,0,7);g.fill();box(g,-4,-18,8,8,'#dfb38a');box(g,-5,-10,10,13,color);box(g,-4,3,3,6,'#2c424b');box(g,2,3,3,6,'#2c424b');if(tool)box(g,6,-8,2,12,C.gold);g.restore();}
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
 if(level>=9){box(g,132,300,10,42,C.stone);box(g,216,300,10,42,C.stone);box(g,131,297,96,8,'#c2b5a0');}
 if(level>=20){box(g,111,452,140,13,'#999487');for(let i=0;i<6;i++)box(g,111+i*24,445,16,8,'#c5bca8');}
 // Small workers are located along meaningful production routes.
 const workers=Math.min(12,Math.max(2,Math.ceil(population/10)));
 const routes=[[72,371,116,350],[266,381,224,352],[159,426,185,365],[54,289,137,320]];
 for(let i=0;i<workers;i++){const a=routes[i%4],p=(Math.sin(t/115+i*1.8)+1)/2,x=a[0]+(a[2]-a[0])*p,y=a[1]+(a[3]-a[1])*p;villager(g,x,y,t/12+i,['#698aa1','#b78754','#7c9467','#8d719d'][i%4],i%3===0);}
 // Compact cinematic location caption; leave central world unobscured.
 box(g,10,39,183,31,'#18342ddd');g.fillStyle='#f9e5b5';g.font='bold 12px system-ui';g.fillText('VILA VIVA  ·  NÍVEL '+level,18,58,166);
 if(damage>0){box(g,10,79,136,23,'#492e2be6');g.fillStyle='#ffd6a9';g.font='bold 11px system-ui';g.fillText('REPAROS · '+damage+'%',18,94);}
 g.restore();
}
root.PetecoArtV17={draw};
})(typeof window!=='undefined'?window:globalThis);
