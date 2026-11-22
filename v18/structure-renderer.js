/* V18 renderer for the approved painted medieval house. Pure visual mapping. */
(function(root){'use strict';
const PACK=root.PetecoVisualFactoryV18&&root.PetecoVisualFactoryV18.get('house');
const CELL=PACK?Object.freeze({width:PACK.width/PACK.grid.columns,height:PACK.height/PACK.grid.rows}):Object.freeze({width:543,height:724});
const FRAME=PACK?PACK.states:Object.freeze({foundation:0,construction:1,complete:2,damaged:3});
const RENDER=PACK?PACK.render:Object.freeze({width:94,height:126,anchor:'feet',baselineY:700});
function frameFor(structure){
 if(!structure||typeof structure!=='object')return null;
 const stage=Math.max(0,Math.min(3,Math.floor(Number(structure.stage)||0)));
 const integrity=structure.integrity==null?100:Math.max(0,Math.min(100,Number(structure.integrity)||0));
 const state=stage===0?'foundation':stage<3?'construction':integrity<70?'damaged':'complete';
 return Object.freeze({state,frame:FRAME[state],stage,integrity});
}
function draw(ctx,structure,image,layout){
 if(!ctx||!image||!image.complete||image.naturalWidth!==CELL.width*4||image.naturalHeight!==CELL.height||!layout)return false;
 const x=Number(layout.x),y=Number(layout.y);if(!Number.isFinite(x)||!Number.isFinite(y))return false;
 const selected=frameFor(structure);if(!selected)return false;
 const rect=root.PetecoVisualFactoryV18&&root.PetecoVisualFactoryV18.frameRect('house',selected.state);
 const sx=rect?rect.x:selected.frame*CELL.width;
 const width=RENDER.width,height=RENDER.height,baseline=Number(RENDER.baselineY)||CELL.height;
 ctx.save();ctx.imageSmoothingEnabled=true;
 ctx.drawImage(image,sx,0,CELL.width,CELL.height,x-width/2,y-height*(baseline/CELL.height),width,height);
 ctx.restore();return selected.state;
}
root.PetecoStructureRendererV18=Object.freeze({CELL,FRAME,RENDER,frameFor,draw});
})(typeof window!=='undefined'?window:globalThis);
