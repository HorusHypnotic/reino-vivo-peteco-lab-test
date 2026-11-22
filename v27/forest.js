/* V27: fixed forest silhouettes share the scene's depth queue. Decorative only. */
(function(root){'use strict';
const TREES=Object.freeze([{x:42,y:224,size:1},{x:94,y:205,size:.82},{x:112,y:266,size:.7}].map(t=>Object.freeze(t)));
function draw(g,tree){if(!g||!tree||![tree.x,tree.y,tree.size].every(Number.isFinite)||tree.size<=0)return false;
 const {x,y,size:k}=tree;g.save();g.translate(x,y);g.scale(k,k);
 g.fillStyle='rgba(22,35,25,.24)';g.beginPath();g.ellipse(0,1,17,5,0,0,Math.PI*2);g.fill();
 g.fillStyle='#694a32';g.fillRect(-4,-26,8,25);g.fillStyle='#3e6547';
 g.beginPath();g.moveTo(0,-73);g.lineTo(-25,-31);g.lineTo(-13,-31);g.lineTo(-29,-18);g.lineTo(29,-18);g.lineTo(13,-31);g.lineTo(25,-31);g.closePath();g.fill();
 g.fillStyle='#57875c';g.beginPath();g.moveTo(-2,-69);g.lineTo(-19,-35);g.lineTo(-7,-35);g.lineTo(-21,-23);g.lineTo(0,-23);g.closePath();g.fill();
 g.restore();return true;}
root.PetecoV27Forest=Object.freeze({TREES,draw});
})(typeof window!=='undefined'?window:globalThis);
