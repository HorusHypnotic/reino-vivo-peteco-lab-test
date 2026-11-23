/* Draws the original 4x4 painted sprite atlas; no primitive substitute actors. */
(function(root){'use strict';
const PACK=root.PetecoVisualFactoryV18&&root.PetecoVisualFactoryV18.get('woodcutter');
const CELL=PACK?Object.freeze({width:PACK.width/PACK.grid.columns,height:PACK.height/PACK.grid.rows}):{width:280.5,height:350.5};
const DEST=PACK?PACK.render:Object.freeze({width:72,height:90,feetOffsetY:11});
const ROW=PACK?PACK.states:Object.freeze({idle:0,walk:1,work:2,carry:3});
function draw(g,actor,image){
 if(!g||!actor||!image||!image.complete||!image.naturalWidth)return false;
 const row=ROW[actor.state];if(row==null)return false;
 const frame=Math.max(0,Math.min(3,Math.floor(Number(actor.frame)||0))),rect=root.PetecoVisualFactoryV18&&root.PetecoVisualFactoryV18.frameRect('woodcutter',actor.state,frame),sx=rect?rect.x:frame*CELL.width,sy=rect?rect.y:row*CELL.height,x=Number(actor.x)||0,y=Number(actor.y)||0;
 g.save();g.globalAlpha=.3;g.fillStyle='#14291c';g.beginPath();g.ellipse(x,y-3,15,5,0,0,Math.PI*2);g.fill();g.restore();
 g.save();g.imageSmoothingEnabled=true;g.translate(x,y-DEST.height+DEST.feetOffsetY);if(actor.facing<0)g.scale(-1,1);g.drawImage(image,sx,sy,CELL.width,CELL.height,-DEST.width/2,0,DEST.width,DEST.height);g.restore();return true;
}
root.PetecoWoodcutterRendererV18=Object.freeze({draw,cell:Object.freeze({...CELL}),rows:ROW});
})(typeof window!=='undefined'?window:globalThis);
