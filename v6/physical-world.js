/* V6 Lote 01: isolated, deterministic, versioned physical-world state.
   No network, no game-engine dependency. Browser and Node compatible. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.VilaPhysicalWorld=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION=1,KEY='peteco-lab-physical-v1';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function seedWorld(level=1){const buildings=[];const count=clamp(Math.floor(level*.9),3,48);for(let i=0;i<count;i++){const region=i%5;buildings.push({id:'building-'+i,region,x:30+region*390+30+(i*79)%290,y:100+75+(i*113)%590,type:i%9===0?'workshop':i%7===0?'market':'house',stage:4,hp:100,history:[]});}return {version:VERSION,revision:0,buildings};}
function valid(b){return b&&typeof b.id==='string'&&/^building-[0-9]+$/.test(b.id)&&Number.isInteger(b.region)&&b.region>=0&&b.region<5&&Number.isFinite(b.x)&&b.x>=0&&b.x<=2000&&Number.isFinite(b.y)&&b.y>=0&&b.y<=1000&&Number.isInteger(b.stage)&&b.stage>=0&&b.stage<=4&&Number.isFinite(b.hp)&&b.hp>=0&&b.hp<=100&&['house','workshop','market','fortress'].includes(b.type)&&Array.isArray(b.history);}
function parse(raw){try{const v=JSON.parse(raw);if(!v||v.version!==VERSION||!Array.isArray(v.buildings)||v.buildings.length>500||!v.buildings.every(valid)||new Set(v.buildings.map(b=>b.id)).size!==v.buildings.length)return null;return v;}catch{return null;}}
function load(storage,level){try{return parse(storage.getItem(KEY))||seedWorld(level);}catch{return seedWorld(level);}}
function save(storage,world){if(!world||!Array.isArray(world.buildings)||!world.buildings.every(valid))return false;try{storage.setItem(KEY,JSON.stringify(world));return true;}catch{return false;}}
function change(world,id,action,amount=25){const b=world.buildings.find(x=>x.id===id);if(!b)return false;const before={stage:b.stage,hp:b.hp};if(action==='damage')b.hp=clamp(b.hp-amount,0,100);else if(action==='repair')b.hp=clamp(b.hp+amount,0,100);else if(action==='build')b.stage=clamp(b.stage+1,0,4);else return false;if(before.stage===b.stage&&before.hp===b.hp)return false;b.history.push({revision:++world.revision,action,from:before,to:{stage:b.stage,hp:b.hp}});return true;}
return {VERSION,KEY,seedWorld,valid,parse,load,save,change};
});
