/* V26: stage-aware decorative architecture. Rendering only; no economy mutation. */
(function(root){'use strict';
function roof(g,home){
 if(!g||!home||home.stage!==3||!Number.isFinite(home.x)||!Number.isFinite(home.y))return false;
 const x=home.x,y=home.y;
 g.save();g.beginPath();g.moveTo(x-28,y-31);g.lineTo(x,y-53);g.lineTo(x+28,y-31);g.closePath();g.fillStyle='#754636';g.fill();
 g.beginPath();g.moveTo(x-23,y-34);g.lineTo(x,y-49);g.lineTo(x+23,y-34);g.closePath();g.fillStyle='#b76e4c';g.fill();
 g.strokeStyle='rgba(238,186,124,.42)';g.lineWidth=1;
 for(let i=0;i<3;i++){const dy=i*4;g.beginPath();g.moveTo(x-18+i*5,y-36-dy);g.lineTo(x+18-i*5,y-36-dy);g.stroke();}
 g.fillStyle='#6e4a35';g.fillRect(x-18,y-23,8,9);g.fillRect(x+10,y-23,8,9);
 g.fillStyle='#b9e1d5';g.fillRect(x-16,y-21,4,5);g.fillRect(x+12,y-21,4,5);
 g.fillStyle='#e2c39a';g.fillRect(x-1,y-10,2,3);
 g.restore();return true;
}
root.PetecoV26Architecture=Object.freeze({roof});
})(typeof window!=='undefined'?window:globalThis);
