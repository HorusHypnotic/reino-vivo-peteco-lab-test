/* V33: mobile-safe spectator identity layout, isolated from game state. */
(function(root){'use strict';
function label(name,job,x,y){
 const safeName=String(name||'Visitante').replace(/[\u0000-\u001f]/g,' ').trim();
 const safeJob=String(job||'Aprendiz').replace(/[\u0000-\u001f]/g,' ').trim();
 const short=safeName.length>15?safeName.slice(0,14)+'…':safeName;
 const width=Math.min(152,Math.max(92,34+short.length*7));
 const left=Math.max(6,Math.min(354-width,Math.round(x-width/2)));
 const top=Math.max(58,Math.min(420,Math.round(y-74)));
 return Object.freeze({name:short,job:safeJob.slice(0,17),left,top,width});
}
function draw(g,info){if(!g||!info)return false;g.save();g.fillStyle='rgba(17,39,45,.91)';g.fillRect(info.left,info.top,info.width,25);g.fillStyle='#f5dca3';g.font='bold 11px system-ui';g.textAlign='center';g.fillText('★ '+info.name,info.left+info.width/2,info.top+16,info.width-10);g.restore();return true;}
root.PetecoV33Identity=Object.freeze({label,draw});
})(typeof window!=='undefined'?window:globalThis);
