/* V20 scene map: read-only layout contract, not simulated workers. */
(function(root){'use strict';
const POINTS=Object.freeze({
 forest:Object.freeze({target:Object.freeze({x:118,y:290}),depot:Object.freeze({x:200,y:404})}),
 // Unique frontages around the shared store keep idle sprites legible. These
 // are visual positions only; delivery/resource accounting remains in V7/V20.
 farm:Object.freeze({target:Object.freeze({x:322,y:390}),depot:Object.freeze({x:152,y:404})}),
 quarry:Object.freeze({target:Object.freeze({x:328,y:345}),depot:Object.freeze({x:200,y:404})}),
 construction:Object.freeze({target:Object.freeze({x:183,y:311}),depot:Object.freeze({x:248,y:404})})
});
function route(job){return POINTS[job]||null;}
function position(job,progress=0){const r=route(job);if(!r)return null;const p=Math.min(1,Math.max(0,Number(progress)||0));return Object.freeze({x:r.depot.x+(r.target.x-r.depot.x)*p,y:r.depot.y+(r.target.y-r.depot.y)*p});}
function validate(){return Object.keys(POINTS).every(k=>{const r=POINTS[k];return ['target','depot'].every(part=>Number.isFinite(r[part].x)&&Number.isFinite(r[part].y)&&r[part].x>=0&&r[part].x<=360&&r[part].y>=0&&r[part].y<=480);});}
root.PetecoSceneMapV20=Object.freeze({POINTS,route,position,validate});
})(typeof window!=='undefined'?window:globalThis);
