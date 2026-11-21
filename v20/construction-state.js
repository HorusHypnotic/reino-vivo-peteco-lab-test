/* V20/V21 construction view: derive the public wall project from persisted V2 fields. */
(function(root){'use strict';
const finite=(value,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;
function derive(state){
 const s=state||{},goal=Math.max(1,finite(s.projectGoal,30));
 const completed=Math.max(0,Math.floor(finite(s.projectCount)));
 const progress=Math.max(0,finite(s.project));
 const ratio=Math.min(1,progress/goal);
 // Match the published 30-unit milestones: 1–10 foundation, 11–20 walls,
 // 21–29 finish. Exact thirds belong to the earlier milestone.
 const phase=progress<=0?(completed?'complete':'idle'):ratio<=1/3?'foundation':ratio<=2/3?'walls':'finish';
 return Object.freeze({phase,completed,progress,goal,ratio,brick:Math.min(31,completed)});
}
function workUnits(state){const d=derive(state);return d.completed*d.goal+d.progress;}
// Called only after contribute() accepts and commits a public action.
function confirmedContribution(factory,beforeUnits,state){
 if(!factory||!Number.isSafeInteger(beforeUnits))return null;
 const after=workUnits(state);
 if(!Number.isSafeInteger(after)||after<=beforeUnits)return null;
 return factory.event({job:'construction',action:'build',cycle:after,confirmed:true,priority:4});
}
function draw(g,state,tick=0,options={}){
 if(!g||!state)return false;
 const d=derive(state),courses=4,x0=finite(options.x,140),baseY=finite(options.y,313);
 const width=Math.max(40,finite(options.width,80)),rowHeight=Math.max(7,finite(options.rowHeight,9));
 if(d.completed<=0&&d.progress<=0)return false;
 g.save();
 // The visible line is four slots long. Every persisted completion fills one
 // full slot; the current project uses the next slot, so a new 0/30 cycle can
 // never erase or draw over completed masonry.
 const slots=Math.max(1,Math.min(4,Math.floor(finite(options.slots,courses))));
 const slotWidth=width/slots,hasNext=d.progress>0,completedSlots=Math.min(hasNext?Math.max(0,slots-1):slots,d.completed);
 // Window the visible completed sections when the village has built more than
 // the available slots. Reserve the final slot for the active construction.
 // The persisted completion count is never reduced or rewritten.
 function masonry(x,w,height){
  const builtCourses=Math.max(1,Math.min(courses,Math.round(height/rowHeight)));
  for(let row=0;row<builtCourses;row++){
   const y=baseY-(row+1)*rowHeight;
   g.fillStyle=row%2?'#a99b82':'#c1b39a';g.fillRect(x,y,w,rowHeight-1);
   g.fillStyle='#786c5a';for(let seam=1;seam<Math.max(2,Math.floor(w/9));seam++)g.fillRect(x+seam*w/Math.max(2,Math.floor(w/9)),y,1,rowHeight-1);
  }
  const top=baseY-builtCourses*rowHeight;
  g.fillStyle='#756651';for(let crenel=0;crenel<Math.max(1,Math.floor(w/12));crenel+=2)g.fillRect(x+crenel*w/Math.max(1,Math.floor(w/12)),top-3,Math.max(3,w/12),3);
  g.fillStyle='#9f927c';g.fillRect(x-2,top,3,builtCourses*rowHeight+1);g.fillRect(x+w-1,top,3,builtCourses*rowHeight+1);
 }
 for(let i=0;i<completedSlots;i++)masonry(x0+i*slotWidth,slotWidth,courses*rowHeight);
 if(d.progress>0&&d.completed<slots){
  const x=x0+completedSlots*slotWidth,w=slotWidth,y=baseY-courses*rowHeight;
  if(d.phase==='foundation'){
   g.fillStyle='#795d40';g.fillRect(x-1,baseY-3,w+2,3);
   g.fillStyle='#b9a47e';for(let i=0;i<4;i++)g.fillRect(x+i*w/4,baseY-rowHeight+1,w/5,rowHeight-3);
   g.strokeStyle='#745b41';g.lineWidth=1;g.strokeRect(x-1,y,w+2,courses*rowHeight);
  }else if(d.phase==='walls'){
   const ratioWithinWalls=(d.ratio-1/3)/(1/3),height=rowHeight*Math.max(1,Math.ceil(3*ratioWithinWalls));
   masonry(x,w,height);
  }else masonry(x,w,courses*rowHeight);
  if(tick%48<24){g.fillStyle='#f2ce78';g.fillRect(x+Math.floor(w/2),y-6,2,2);}
 }
 g.restore();return true;
}
root.PetecoConstructionV20=Object.freeze({derive,workUnits,confirmedContribution,draw});
})(typeof window!=='undefined'?window:globalThis);
