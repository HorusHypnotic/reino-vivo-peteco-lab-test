/* V27: fixed forest silhouettes share the scene's depth queue. Decorative only. */
(function(root){'use strict';
const TREES=Object.freeze([{x:42,y:224,size:1},{x:94,y:205,size:.82},{x:112,y:266,size:.7}].map(t=>Object.freeze(t)));
function draw(g,tree,activity){if(!g||!tree||![tree.x,tree.y,tree.size].every(Number.isFinite)||tree.size<=0)return false;
 const {x,y,size:k}=tree;g.save();g.translate(x,y);g.scale(k,k);
 g.fillStyle='rgba(22,35,25,.24)';g.beginPath();g.ellipse(0,1,17,5,0,0,Math.PI*2);g.fill();
 g.fillStyle='#694a32';g.fillRect(-4,-26,8,25);g.fillStyle='#3e6547';
 g.beginPath();g.moveTo(0,-73);g.lineTo(-25,-31);g.lineTo(-13,-31);g.lineTo(-29,-18);g.lineTo(29,-18);g.lineTo(13,-31);g.lineTo(25,-31);g.closePath();g.fill();
 g.fillStyle='#57875c';g.beginPath();g.moveTo(-2,-69);g.lineTo(-19,-35);g.lineTo(-7,-35);g.lineTo(-21,-23);g.lineTo(0,-23);g.closePath();g.fill();
 if(activity==='gather'){g.fillStyle='#e4c18b';g.fillRect(-18,-4,4,2);g.fillRect(12,-7,3,2);g.fillRect(-7,-2,3,2);}\n g.restore();return true;}
function activeTree(agents,trees=TREES){\n if(!Array.isArray(agents)||!Array.isArray(trees))return null;\n const worker=agents.find(a=>a&&a.job==='lenhador'&&a.task==='gather');\n if(!worker)return null;\n const x=Number.isFinite(worker.toX)?worker.toX:worker.x,y=Number.isFinite(worker.toY)?worker.toY:worker.y;\n if(!Number.isFinite(x)||!Number.isFinite(y))return null;\n return trees.reduce((best,t)=>{const d=(t.x-x)**2+(t.y-y)**2;return !best||d<best.distance?{tree:t,distance:d}:best;},null)?.tree||null;\n}\nroot.PetecoV27Forest=Object.freeze({TREES,draw,activeTree});
})(typeof window!=='undefined'?window:globalThis);
