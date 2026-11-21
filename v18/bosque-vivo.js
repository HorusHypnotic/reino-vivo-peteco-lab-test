/* V18.1: read-only forest choreography. No economy or save mutation. */
(function(root){'use strict';
const TREE=Object.freeze({x:118,y:290});
function model(actor={},cycle=0){
 const n=Math.max(0,Math.floor(Number(cycle)||0));
 const ledger=actor.ledger||null;
 const confirmed=!!(ledger&&ledger.deliveryConfirmed);
 const phase=actor.phase||'idle';
 // A felled tree is only visualized after the production ledger confirms delivery.
 const falling=confirmed&&phase==='carry';
 const fallProgress=falling?Math.min(1,Math.max(0,(Number(actor.elapsed)||0)/.34)):0;
 const felled=confirmed&&(phase==='return'||(falling&&fallProgress>=1));
 const regrowth=felled?0:Math.min(1,.72+(n%7)*.04);
 const chopping=phase==='cut'||actor.state==='work';
 const lean=chopping?Math.sin((Number(actor.elapsed)||0)*18)*.075:0;
 return Object.freeze({x:TREE.x,y:TREE.y,felled,regrowth,logs:felled?2:0,phase,chopping,lean,falling,fallProgress});
}
function draw(g,actor,cycle){
 if(!g)return false;const m=model(actor,cycle);
 g.save();
 // Forest patch deliberately sits behind the worker at its actual chopping coordinate.
 g.fillStyle='#355f3b';g.beginPath();g.ellipse(m.x,m.y+3,56,22,0,0,Math.PI*2);g.fill();
 if(m.felled){
  g.fillStyle='#67452e';g.fillRect(m.x-9,m.y-14,18,15);
  g.fillStyle='#b58b58';g.fillRect(m.x-7,m.y-15,14,4);
  for(let i=0;i<m.logs;i++){g.fillStyle='#795036';g.fillRect(m.x+18+i*10,m.y+1-i*3,25,8);g.fillStyle='#d5a56e';g.fillRect(m.x+18+i*10,m.y+1-i*3,4,8);}
 }else{
  g.save();g.translate(m.x,m.y);g.rotate(m.falling?m.fallProgress*1.4:m.lean);g.translate(-m.x,-m.y);
  g.fillStyle='#5c3c28';g.fillRect(m.x-7,m.y-72*m.regrowth,14,72*m.regrowth);
  g.fillStyle='#2e6d3f';g.beginPath();g.ellipse(m.x,m.y-76*m.regrowth,32*m.regrowth,41*m.regrowth,0,0,Math.PI*2);g.fill();
  g.fillStyle='#4a8d4c';g.beginPath();g.ellipse(m.x-11*m.regrowth,m.y-86*m.regrowth,18*m.regrowth,24*m.regrowth,0,0,Math.PI*2);g.fill();
  g.restore();
  if(m.chopping){g.fillStyle='#dcb66e';for(let i=0;i<3;i++){g.fillRect(m.x+11+i*6,m.y-35-i*7,3,3);}}
 }
 g.restore();return true;
}
root.PetecoBosqueV181=Object.freeze({model,draw,TREE});
})(typeof window!=='undefined'?window:globalThis);
