/* V18.1: read-only forest choreography. No economy or save mutation. */
(function(root){'use strict';
const TREE=Object.freeze({x:118,y:290});
function model(actor={},cycle=0){
 const n=Math.max(0,Math.floor(Number(cycle)||0));
 const ledger=actor.ledger||null;
 const confirmed=!!(ledger&&ledger.deliveryConfirmed);
 const phase=actor.phase||'idle';
 // A felled tree is only visualized after the production ledger confirms delivery.
 const felled=confirmed&&(phase==='carry'||phase==='return');
 const regrowth=felled?0:Math.min(1,.65+(n%7)*.05);
 return Object.freeze({x:TREE.x,y:TREE.y,felled,regrowth,logs:confirmed?2:0,phase});
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
  g.fillStyle='#5c3c28';g.fillRect(m.x-7,m.y-72*m.regrowth,14,72*m.regrowth);
  g.fillStyle='#2e6d3f';g.beginPath();g.ellipse(m.x,m.y-76*m.regrowth,32*m.regrowth,41*m.regrowth,0,0,Math.PI*2);g.fill();
  g.fillStyle='#4a8d4c';g.beginPath();g.ellipse(m.x-11*m.regrowth,m.y-86*m.regrowth,18*m.regrowth,24*m.regrowth,0,0,Math.PI*2);g.fill();
 }
 g.restore();return true;
}
root.PetecoBosqueV181=Object.freeze({model,draw,TREE});
})(typeof window!=='undefined'?window:globalThis);
