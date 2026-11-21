/* Draws the original 4x4 painted sprite atlas; no primitive substitute actors. */
(function(root){'use strict';
const CELL={width:280.5,height:350.5},DEST={width:72,height:90};
const ROW=Object.freeze({idle:0,walk:1,work:2,carry:3});
function draw(g,actor,image){
 if(!g||!actor||!image||!image.complete||!image.naturalWidth)return false;
 const row=ROW[actor.state];if(row==null)return false;
 const frame=Math.max(0,Math.min(3,Math.floor(Number(actor.frame)||0))),sx=frame*CELL.width,sy=row*CELL.height,x=Number(actor.x)||0,y=Number(actor.y)||0;
 g.save();g.globalAlpha=.3;g.fillStyle='#14291c';g.beginPath();g.ellipse(x,y-3,15,5,0,0,Math.PI*2);g.fill();g.restore();
 g.save();g.imageSmoothingEnabled=true;g.translate(x,y-DEST.height+11);if(actor.facing<0)g.scale(-1,1);g.drawImage(image,sx,sy,CELL.width,CELL.height,-DEST.width/2,0,DEST.width,DEST.height);g.restore();return true;
}
root.PetecoWoodcutterRendererV18=Object.freeze({draw,cell:Object.freeze({...CELL}),rows:ROW});
})(typeof window!=='undefined'?window:globalThis);
