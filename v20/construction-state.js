/* V20/V21 construction view: derive the public wall project from persisted V2 fields. */
(function(root){'use strict';
const finite=(value,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;
function derive(state){
 const s=state||{},goal=Math.max(1,finite(s.projectGoal,30));
 const completed=Math.max(0,Math.floor(finite(s.projectCount)));
 const progress=Math.max(0,finite(s.project));
 const ratio=Math.min(1,progress/goal);
 const phase=progress<=0?(completed?'complete':'idle'):ratio<1/3?'foundation':ratio<2/3?'walls':'finish';
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
 // projectCount is the persisted count of completed public wall works. Each
 // completion adds a visible masonry course; no house or resource is invented.
 for(let i=0;i<Math.min(courses,d.completed);i++){
  const y=baseY-i*rowHeight;
  g.fillStyle=i%2?'#a99b82':'#c1b39a';g.fillRect(x0,y,width,rowHeight-1);
  g.fillStyle='#786c5a';for(let seam=1;seam<6;seam++)g.fillRect(x0+seam*width/6,y,1,rowHeight-1);
  g.fillStyle='#756651';for(let crenel=0;crenel<6;crenel+=2)g.fillRect(x0+crenel*width/6,y-3,width/12,3);
 }
 if(d.progress>0&&d.completed<courses){
  const y=baseY-d.completed*rowHeight;
  // A quiet site is omitted instead of claiming 0% work.
  if(d.phase==='foundation'){
   g.fillStyle='#795d40';g.fillRect(x0-2,y+rowHeight-2,width+4,3);
   g.fillStyle='#b9a47e';for(let i=0;i<8;i++)g.fillRect(x0+i*width/8,y+1,width/10,Math.max(2,rowHeight-3));
   g.strokeStyle='#745b41';g.lineWidth=1;g.beginPath();g.moveTo(x0-2,y-2);g.lineTo(x0-2,y+rowHeight+2);g.moveTo(x0+width+2,y-2);g.lineTo(x0+width+2,y+rowHeight+2);g.stroke();
  }else if(d.phase==='walls'){
   const built=Math.max(1,Math.round(width*(.35+.45*d.ratio)));
   g.fillStyle='#b4a58d';g.fillRect(x0,y-4,built,rowHeight+3);g.fillStyle='#80694d';g.fillRect(x0-2,y-6,2,rowHeight+7);g.fillRect(x0+built,y-6,2,rowHeight+7);
  }else{
   g.fillStyle='#c5b89e';g.fillRect(x0,y-5,width,rowHeight+5);
   g.fillStyle='#756651';for(let crenel=0;crenel<6;crenel+=2)g.fillRect(x0+crenel*width/6,y-8,width/12,3);
  }
  if(tick%48<24){g.fillStyle='#f2ce78';g.fillRect(x0+Math.floor(width/2),y-10,2,2);}
 }
 if(d.completed>=courses){
  for(const x of [x0-5,x0+width-1]){g.fillStyle='#9f927c';g.fillRect(x,baseY-courses*rowHeight,6,courses*rowHeight+2);g.fillStyle='#c0b39b';g.fillRect(x-2,baseY-courses*rowHeight-3,10,4);}
 }
 g.restore();return true;
}
root.PetecoConstructionV20=Object.freeze({derive,workUnits,confirmedContribution,draw});
})(typeof window!=='undefined'?window:globalThis);
