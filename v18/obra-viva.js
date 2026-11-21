/* V19.2 · Obra Viva. Visual-only projection of the existing collective project. */
(function(root){'use strict';
function model(state){
 const s=state||{},goal=Number(s.projectGoal),value=Number(s.project);
 const valid=Number.isFinite(goal)&&goal>0&&Number.isFinite(value);
 const ratio=valid?Math.max(0,Math.min(1,value/goal)):0;
 return Object.freeze({ratio,percent:Math.floor(ratio*100),valid,finished:valid&&ratio>=1});
}
function draw(g,state,t){
 if(!g||typeof g.save!=='function')return false;
 const m=model(state);if(!m.valid)return false;
 const x=132,y=220;g.save();
 // Foreground construction at the illustrated central building, not a new structure.
 const lift=m.ratio;
 g.fillStyle='#9d7651';
 for(let i=0;i<4;i++){const xx=x+i*23;g.fillRect(xx,y+22,5,48);}
 g.fillStyle='#d4b98a';
 const layers=Math.floor(lift*4);
 for(let i=0;i<layers;i++)g.fillRect(x+2,y+63-i*12,75,9);
 if(lift>.75){g.fillStyle='#9e4f3c';g.beginPath();g.moveTo(x-4,y+21);g.lineTo(x+41,y-3);g.lineTo(x+86,y+21);g.closePath();g.fill();}
 // Small animated worker cue only while the project is incomplete and has real progress.
 if(lift>0&&lift<1){const bob=Math.sin((Number(t)||0)/140)*2;g.fillStyle='#b58c56';g.fillRect(x+60,y+53+bob,7,13);}
 g.fillStyle='#182b2edb';g.fillRect(x+4,y+72,83,17);
 g.fillStyle='#ffe5ac';g.font='bold 10px sans-serif';g.fillText('OBRA '+m.percent+'%',x+10,y+84);
 g.restore();return true;
}
root.PetecoObraV192=Object.freeze({model,draw});
})(typeof window!=='undefined'?window:globalThis);
