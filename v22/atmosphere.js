/* V22 visual-only grounding: no changes to simulation, saves or coordinates. */
(function(root){'use strict';
function groundShadow(ctx,x,y,rx=10,ry=4){
 if(!ctx||!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(rx)||!Number.isFinite(ry)||rx<=0||ry<=0)return false;
 ctx.save();ctx.beginPath();ctx.ellipse(x,y+2,rx,ry,0,0,Math.PI*2);
 ctx.fillStyle='rgba(22,29,26,0.24)';ctx.fill();ctx.restore();return true;
}
root.PetecoV22Atmosphere=Object.freeze({groundShadow});
})(typeof window!=='undefined'?window:globalThis);
