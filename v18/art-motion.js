/* V18 compositing: read-only dynamic foreground. Draws world-linked activity on top of illustrated art. */
(function(root){'use strict';
const colors={woodcut:'#8f6245',farm:'#8baf66',build:'#dfaa67',carry:'#a6c6d4',guard:'#a7a6c6',trade:'#d58b75'};
function worker(g,w,t){
 const machine=root.PetecoActorV18;const state=machine?machine.jobState(w.job,w.phase||'idle'):'walk';const actor=machine?machine.advance({state,elapsed:t/60,frame:0},0):{frame:Math.floor(t/6)%6};const stride=state==='walk'||state==='carry'?Math.sin(actor.frame*Math.PI/3)*4:0;const dx=state==='walk'&&w.target?Math.sin(t/65+w.x)*11:0,dy=state==='walk'&&w.target?Math.cos(t/65+w.x)*3:0;
 const x=w.x+dx,y=w.y+dy;g.save();g.translate(x,y);
 g.fillStyle='#183b35aa';g.beginPath();g.ellipse(0,2,7,3,0,0,7);g.fill();
 g.fillStyle='#493a32';g.fillRect(-5,-9+stride,4,11);g.fillRect(2,-9-stride,4,11);
 g.fillStyle=colors[w.job]||'#af9771';g.fillRect(-8,-25,16,18);
 if(state==='work'){g.save();g.translate(8,-19);g.rotate(Math.sin(actor.frame*Math.PI/4)*.55);g.fillStyle='#e6bd92';g.fillRect(0,0,5,17);g.fillStyle='#8b9ca0';g.fillRect(2,12,14,5);g.restore();}g.fillStyle='#e6bd92';g.beginPath();g.arc(0,-31,7,0,7);g.fill();
 g.fillStyle='#5a443a';g.fillRect(-8,-37,16,5);
 if(w.job==='carry'||w.job==='build'){g.fillStyle='#b78951';g.fillRect(9,-21,11,8);g.strokeStyle='#765536';g.strokeRect(9,-21,11,8)}
 if(w.job==='guard'){g.fillStyle='#d9d2a9';g.fillRect(11,-29,3,27)}
 g.restore();
}
function draw(g,art,t){
 if(!g||!art)return;
 g.save();
 // Subtle atmospheric particles that do not alter the underlying illustration.
 for(let i=0;i<15;i++){const x=(i*83+t*.08)%360,y=(i*113+t*.025)%480;g.globalAlpha=.16+(i%4)*.04;g.fillStyle='#ffe5a6';g.beginPath();g.arc(x,y,1.2+i%3,0,7);g.fill()}
 g.globalAlpha=1;
 // The illustrated central build is the persisted public wall project, not one of s.structures.
 const p=art.construction.progress||0,projectState={project:art.construction.project||0,projectGoal:art.construction.goal||30,projectCount:art.construction.completed||0};
 const v20OptIn=!!(root.location&&new URLSearchParams(root.location.search).get('v20')==='1');
 if(v20OptIn&&root.PetecoConstructionV20){root.PetecoConstructionV20.draw(g,projectState,t,{x:152,y:259,width:66,rowHeight:8,slots:2});}
 else if(p>0){const x=169,y=274;g.strokeStyle='#d4ad73';g.lineWidth=3;g.strokeRect(x,y-45,56,47);g.beginPath();g.moveTo(x-6,y-22);g.lineTo(x+62,y-22);g.moveTo(x+15,y-48);g.lineTo(x+15,y+3);g.moveTo(x+41,y-48);g.lineTo(x+41,y+3);g.stroke();g.fillStyle='#4a3529b8';g.fillRect(x-9,y-66,75,17);g.fillStyle='#ffe2a0';g.font='bold 11px system-ui';g.fillText('OBRA '+Math.round(p*100)+'%',x-4,y-53)}
 // Foreground actors are depth sorted, never drawn on top of the HUD.
 art.workers.slice().sort((a,b)=>a.y-b.y).forEach(w=>worker(g,w,t));
 g.restore();
}
root.PetecoArtMotionV18=Object.freeze({draw});
})(typeof window!=='undefined'?window:globalThis);
