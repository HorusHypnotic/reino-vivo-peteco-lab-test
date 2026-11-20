/* Peteco Lab V7: deterministic, browser-independent NPC economy. No external dependencies. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PetecoLife=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const JOBS=[['lenhador','Lenhador',65,250],['construtor','Construtor',180,300],['comerciante','Comerciante',275,385]];
function create(seed=1){return {version:1,seed:Number(seed)||1,tick:0,stock:{wood:0,stone:0,food:12},delivered:0,gathered:0,spent:0,logistics:{orders:[],trips:0,delivered:0},home:{id:'home-1',x:180,y:300,stage:0,progress:0,occupied:false},agents:JOBS.map((j,i)=>({id:'npc-'+(i+1),name:j[1],job:j[0],x:j[2],y:j[3],energy:100,inventory:{wood:0},fromX:j[2],fromY:j[3],toX:j[2],toY:j[3],task:'idle',history:[]})),events:[]};}
function event(w,actor,kind,detail){const e={tick:w.tick,actor,kind,detail};w.events.push(e);if(w.events.length>80)w.events.shift();return e;}
function request(w,resource,quantity,destination){if(!Number.isSafeInteger(quantity)||quantity<=0||resource!=='wood')throw Error('Invalid logistics order');const order={id:'order-'+(w.logistics.orders.length+1),resource,quantity,destination,status:'requested',loaded:0,delivered:0};w.logistics.orders.push(order);return order;}
function move(a,x,y){a.fromX=a.x;a.fromY=a.y;a.toX=x;a.toY=y;a.x=x;a.y=y;}
function step(w){if(!w||w.version!==1||!Array.isArray(w.agents))throw Error('Invalid life state');w.tick++;const [l,b,m]=w.agents;for(const a of w.agents){a.energy=Math.max(0,a.energy-1);if(a.energy<15){a.energy=Math.min(100,a.energy+24);a.task='rest';continue;}}
if(l.task==='rest')l.task='idle';
if(l.inventory.wood===0){l.inventory.wood=2;w.gathered+=2;l.task='gather';move(l,65,250);event(w,l.id,'gather','2 wood');}
else {w.stock.wood+=l.inventory.wood;w.delivered+=l.inventory.wood;l.inventory.wood=0;l.task='deliver';move(l,180,300);event(w,l.id,'deliver','2 wood to depot');}
if(m.task==='rest')m.task='idle';
if(w.stock.food>0&&w.tick%4===0){w.stock.food--;m.task='trade';move(m,220,305);event(w,m.id,'trade','1 food consumed');}
else {m.task='market';move(m,275,385);}
if(b.task==='rest')b.task='idle';
if(!w.home.occupied&&!w.logistics.orders.length)request(w,'wood',12,'home-1');const order=w.logistics.orders[0];if(order&&order.status!=='delivered'&&w.stock.wood>0){const amount=Math.min(2,w.stock.wood,order.quantity-order.loaded);if(amount>0){w.stock.wood-=amount;order.loaded+=amount;order.status='in-transit';m.task='transport';move(m,w.home.x,w.home.y);event(w,m.id,'dispatch',amount+' wood for '+order.destination);}else if(order.loaded===order.quantity){order.delivered=order.loaded;order.status='delivered';w.logistics.delivered+=order.delivered;w.logistics.trips++;event(w,m.id,'delivery-confirmed',order.destination+' received '+order.delivered+' wood');}}if(!w.home.occupied&&order&&order.status==='delivered'&&order.delivered>=4){order.delivered-=4;w.spent+=4;w.home.progress++;w.home.stage=Math.min(3,w.home.progress);b.task='build';move(b,w.home.x,w.home.y);event(w,b.id,'build','home-1 stage '+w.home.stage);if(w.home.stage===3){w.home.occupied=true;event(w,b.id,'occupy','home-1 occupied');}}
else {b.task=w.home.occupied?'maintenance':'waiting-materials';if(!w.home.occupied)move(b,220,305);}
for(const a of w.agents){a.history.push({tick:w.tick,task:a.task});if(a.history.length>24)a.history.shift();}
return w;}
function validate(w){if(!w||!w.stock||!Array.isArray(w.agents)||w.agents.length!==3||!Number.isSafeInteger(w.gathered)||!Number.isSafeInteger(w.delivered)||!Number.isSafeInteger(w.spent)||w.delivered<0||w.delivered>w.gathered)return false;if(!w.logistics||!Array.isArray(w.logistics.orders)||w.logistics.orders.some(o=>o.loaded<0||o.delivered<0||o.delivered>o.loaded||o.loaded>o.quantity))return false;if(w.stock.wood<0||w.spent<0||w.agents.some(a=>a.inventory.wood<0))return false;const inOrders=w.logistics.orders.reduce((n,o)=>n+(o.status==='delivered'?o.delivered:o.loaded),0);return w.gathered===w.stock.wood+w.spent+inOrders+w.agents.reduce((n,a)=>n+a.inventory.wood,0)&&w.delivered===w.stock.wood+w.spent+inOrders;}
function restore(data){try{const w=typeof data==='string'?JSON.parse(data):data;if(!w||w.version!==1||!Array.isArray(w.agents)||w.agents.length!==3||!w.home||!w.stock||!Number.isSafeInteger(w.tick)||w.tick<0)return null;if(w.delivered===0&&w.gathered>0&&w.stock.wood+w.spent>0&&w.gathered===w.stock.wood+w.spent+w.agents.reduce((n,a)=>n+a.inventory.wood,0))w.delivered=w.stock.wood+w.spent; if(!w.logistics){w.logistics={orders:[],trips:0,delivered:0};}if(!validate(w))return null;return w;}catch{return null;}}
return {create,step,validate,restore,request};
});
