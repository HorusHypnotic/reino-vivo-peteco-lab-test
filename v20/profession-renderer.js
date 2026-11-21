/* V20 preview-only procedural profession renderer.
   Does not invent economy, jobs, assets, or persistence. */
(function(root){'use strict';
const STYLE=Object.freeze({
 farm:{coat:'#a9b86c',hat:'#c99d57',tool:'#d4bb7a'},
 quarry:{coat:'#6c829b',hat:'#8796a8',tool:'#c3cbd1'},
 construction:{coat:'#b48c5e',hat:'#d4a45d',tool:'#d4bb7a'}
});
function draw(g,snapshot,tick){
 if(!g||!snapshot||snapshot.phase==='idle'||!STYLE[snapshot.job])return false;
 const s=STYLE[snapshot.job],x=snapshot.x,y=snapshot.y;
 if(!Number.isFinite(x)||!Number.isFinite(y))return false;
 const bob=snapshot.phase==='walk'||snapshot.phase==='return'?Math.sin(tick*.24)*1.6:Math.sin(tick*.12)*.8;
 g.save();g.translate(x,y+bob);g.scale(.8,.8);
 g.fillStyle='#14221970';g.beginPath();g.ellipse(0,2,12,4,0,0,Math.PI*2);g.fill();
 // One shared body rig, with per-job clothing and hand-held tools.
 g.strokeStyle='#49382c';g.lineWidth=3;g.lineCap='round';
 g.beginPath();g.moveTo(-4,-13);g.lineTo(-5,0);g.moveTo(4,-13);g.lineTo(6,0);g.stroke();
 g.fillStyle=s.coat;g.beginPath();g.roundRect(-9,-31,18,19,4);g.fill();
 g.fillStyle='#d9b38d';g.beginPath();g.arc(0,-38,7,0,Math.PI*2);g.fill();
 g.fillStyle=s.hat;g.fillRect(-9,-46,18,5);g.fillRect(-6,-51,12,7);
 const swing=snapshot.phase==='work'?Math.sin(tick*.35)*.65:0;
 g.save();g.translate(8,-27);g.rotate(swing);
 g.strokeStyle='#d7af85';g.lineWidth=4;g.beginPath();g.moveTo(0,0);g.lineTo(5,11);g.stroke();
 g.strokeStyle='#5b4632';g.lineWidth=2.5;g.beginPath();g.moveTo(5,10);g.lineTo(13,-14);g.stroke();
 g.strokeStyle=s.tool;g.lineWidth=4;g.beginPath();
 if(snapshot.job==='farm'){g.moveTo(8,-14);g.lineTo(18,-14);g.moveTo(12,-18);g.lineTo(12,-10);}
 else if(snapshot.job==='quarry'){g.moveTo(4,-14);g.lineTo(22,-14);}
 else {g.moveTo(9,-17);g.lineTo(18,-10);}
 g.stroke();g.restore();g.restore();return true;
}
root.PetecoProfessionRendererV20=Object.freeze({draw});
})(typeof window!=='undefined'?window:globalThis);
