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
function construction(g,x,y,w,stage,integrity,t){
 const st=clamp(stage,0,3),hp=clamp(integrity,0,100);
 if(st===3&&hp>=70)return false;
 g.save();g.translate(x,y);
 box(g,-w/2,-5,w,10,'#918471');
 if(st===0||hp===0){
  for(let i=0;i<7;i++){const px=-w/2+5+(i*17)%(w-8);box(g,px,-5-(i%3)*4,12,7,i%2?'#b49c83':'#887b6a');}
 }else{
  for(const xx of [-w/2+7,w/2-12])box(g,xx,-38,6,36,'#85694e');
  box(g,-w/2+5,-39,w-10,6,'#ad8b64');
  if(st>=2)poly(g,[[-w/2-5,-39],[0,-62],[w/2+5,-39]],'#86604a');
 }
 g.restore();return true;
}
function projectSite(g,project,goal,t){
 const p=clamp(project,0,100000),total=Math.max(1,Number(goal)||30),ratio=clamp(p/total,0,1);
 const x=180,y=309;g.save();
 box(g,147,304,66,5,'#927c5b');
 for(let i=0;i<6;i++){const xx=149+i*11;box(g,xx,299-(Math.floor(ratio*6)>i?13:0),9,Math.floor(ratio*6)>i?17:5,'#c5b59a');}
 if(ratio>.3){box(g,146,282,5,22,'#80654d');box(g,208,282,5,22,'#80654d');}
 if(ratio>.7)box(g,146,280,67,6,'#c4ae8c');
 // Small construction cue, not a HUD that hides the world.
 g.fillStyle='#f5dfad';g.font='bold 9px system-ui';g.fillText('OBRA '+Math.floor(ratio*100)+'%',149,275);
 g.restore();
}
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
 if(!construction(g,64,274,62,s.structures?.[1]?.stage??3,s.structures?.[1]?.integrity??100,t))building(g,64,274,62,48,'#865744',damage>35?1:0);
 if(!construction(g,294,270,65,s.structures?.[2]?.stage??3,s.structures?.[2]?.integrity??100,t))building(g,294,270,65,48,'#8d644d',damage>55?1:0);
 if(level>=4)building(g,177,245,85,66,'#87513f',damage>20?1:0);
 // Foreground functional sectors, driven by actual level.
 tree(g,35,379,1.3);tree(g,78,407,1.15);
 for(let i=0;i<5;i++){box(g,244+i*19,373,13,7,'#b4a75e');box(g,244+i*19,386,13,7,'#d4ba6c');}
 if(!construction(g,183,418,89,s.structures?.[0]?.stage??3,s.structures?.[0]?.integrity??100,t))building(g,183,418,89,60,level>=12?'#945d45':'#754c3e',damage>0?1:0);
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
 projectSite(g,s.project,s.projectGoal,t);
 foreground(g,t,level);
 // Compact cinematic location caption; leave central world unobscured.
 box(g,10,39,183,31,'#18342ddd');g.fillStyle='#f9e5b5';g.font='bold 12px system-ui';g.fillText('VILA VIVA  ·  NÍVEL '+level,18,58,166);
 if(damage>0){box(g,10,79,136,23,'#492e2be6');g.fillStyle='#ffd6a9';g.font='bold 11px system-ui';g.fillText('REPAROS · '+damage+'%',18,94);}
 g.restore();
}
// V17.4 territorial view: five visually distinct biomes, no game-state mutation.
function world(g,s,t){
 if(!g||!s)return;
 const level=clamp(s.level,1,100),unlocked=Math.max(1,Math.min(5,1+Math.floor((level-1)/7)));
 const biomes=[
  {sky:'#8eb4aa',ground:'#416c50',hill:'#315d4a',roof:'#865342',name:'VALE FLORESTAL'},
  {sky:'#d6b989',ground:'#a8895a',hill:'#806b4c',roof:'#8d5840',name:'SERTÃO'},
  {sky:'#b3cbd5',ground:'#819da2',hill:'#68828f',roof:'#596b7e',name:'PLANALTO'},
  {sky:'#84b6bc',ground:'#438e9c',hill:'#376d86',roof:'#b16f52',name:'COSTA'},
  {sky:'#e7c88e',ground:'#cba365',hill:'#a98552',roof:'#8e5e43',name:'DUNAS'}
 ];
 g.save();box(g,0,0,360,480,'#162d35');
 // A panoramic overview with the active province expanded; time-driven pan is slow.
 const selected=Math.floor(t/900)%unlocked,biome=biomes[selected];
 const sky=g.createLinearGradient(0,0,0,480);sky.addColorStop(0,biome.sky);sky.addColorStop(1,biome.ground);box(g,0,0,360,480,sky);
 g.fillStyle='#f6e5b0';g.globalAlpha=.8;g.beginPath();g.arc(289,92,30,0,7);g.fill();g.globalAlpha=1;
 for(let i=0;i<4;i++){const dx=Math.sin(t/1200+i)*14;poly(g,[[i*130-80+dx,229],[i*130+45+dx,99+i*11],[i*130+160+dx,229]],i%2?biome.hill:'#638f83');}
 poly(g,[[0,235],[360,217],[360,480],[0,480]],biome.ground);
 // Winding road and river follow the same camera, never detach from terrain.
 poly(g,[[158,480],[207,480],[201,402],[174,352],[188,294],[166,247],[181,247],[210,290],[197,351],[225,402]],'#bfa681');
 if(selected===3){poly(g,[[0,260],[52,273],[85,314],[56,373],[0,405]],'#6ab7c5');}
 if(selected===4){for(let i=0;i<7;i++)poly(g,[[i*62-12,286],[i*62+14,268],[i*62+51,287]],'#e4bd79');}
 if(selected===2){for(let i=0;i<5;i++)poly(g,[[i*93-12,227],[i*93+29,174],[i*93+73,227]],'#dce5dc');}
 for(let i=0;i<9;i++){const x=17+(i*67)%350,y=245+(i*83)%180;if(selected===0||selected===2)tree(g,x,y,.6+(i%3)*.14);else{box(g,x,y,3,8,'#6b6449');box(g,x-5,y-7,13,7,'#71855a');}}
 // Buildings in actual persisted integrity states.
 const structures=Array.isArray(s.structures)?s.structures:[];
 const houses=[[81,344,62,43],[272,355,66,44],[183,416,84,57]];
 for(let i=0;i<houses.length;i++){const [x,y,w,h]=houses[i],st=structures[i]||{stage:3,integrity:100};if(!construction(g,x,y,w,st.stage,st.integrity,t))building(g,x,y,w,h,biome.roof,clamp(s.damage,0,100)>50?1:0);}
 const workers=Math.min(9,Math.max(2,Math.ceil(clamp(s.people,0,200)/13)));
 for(let i=0;i<workers;i++){const phase=t/150+i*1.5;villager(g,125+Math.sin(phase)*56,332+(i%3)*35,phase*3,['#d0a56b','#7897ac','#a7b77d'][i%3],i%3===0);}
 projectSite(g,s.project,s.projectGoal,t);
 // Cinematic location identification rather than overlapping sector labels.
 box(g,12,43,336,56,'#152f34e8');g.fillStyle='#f7dfaa';g.font='bold 16px system-ui';g.fillText(biome.name,24,65);g.fillStyle='#d2dfd4';g.font='11px system-ui';g.fillText('REGIÃO '+(selected+1)+' / '+unlocked+'  ·  VILA NÍVEL '+level,24,84);
 for(let i=0;i<unlocked;i++){box(g,15+i*24,108,18,4,i===selected?'#f0ca7f':'#44676a');}
 g.restore();
}
root.PetecoArtV17={draw,world};
})(typeof window!=='undefined'?window:globalThis);
