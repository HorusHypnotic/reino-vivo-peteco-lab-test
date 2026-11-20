/* V7.7: deterministic physical road geometry, independent of game state. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PetecoRoads=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const ROUTE=Object.freeze([[275,385],[245,375],[225,350],[205,325],[180,300]]);
function point(progress){const p=Math.max(0,Math.min(1,Number.isFinite(progress)?progress:0));const segments=ROUTE.length-1,scaled=p*segments,i=Math.min(segments-1,Math.floor(scaled)),f=scaled-i;const a=ROUTE[i],b=ROUTE[i+1];return {x:a[0]+(b[0]-a[0])*f,y:a[1]+(b[1]-a[1])*f};}
function progress(trip,tick,travelTicks){if(!trip||!Number.isFinite(trip.eta)||!Number.isFinite(tick)||!Number.isFinite(travelTicks)||travelTicks<=0)return 0;return Math.max(0,Math.min(1,1-(trip.eta-tick)/travelTicks));}
function path(){return ROUTE.map(p=>p.slice());}
return {point,progress,path};
});
