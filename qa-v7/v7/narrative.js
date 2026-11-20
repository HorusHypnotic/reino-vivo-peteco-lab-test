/* Event-driven narrator: no audio backend, no game-state mutations. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PetecoNarrative=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const META={
'care-shortage':[5,'A enfermaria precisa de remédios e alimentos para atender os feridos.'],
harvest:[2,'Os campos produziram alimentos para a vila.'],
'medicine-stocked':[3,'A enfermaria recebeu novos remédios.'],
injury:[5,'Um construtor se feriu. A obra vai esperar pelo atendimento.'],
care:[2,'O morador recebeu atendimento e está se recuperando.'],
recovered:[4,'O construtor se recuperou e pode voltar ao trabalho.'],
'house-damaged':[5,'Uma casa foi danificada pelo temporal. Os construtores precisam de madeira.'],
repair:[4,'Os trabalhadores repararam os danos da casa.'],
storm:[5,'Tempestade na vila. As novas entregas foram suspensas.'],
'weather-clear':[4,'O temporal passou. As estradas estão liberadas.'],
'delivery-confirmed':[3,'A carroça chegou à obra com materiais.'],
'order-complete':[3,'Todos os materiais chegaram à obra.'],
occupy:[5,'Uma nova casa foi ocupada.'],
build:[2,'Os construtores avançaram uma etapa da casa.'],
dispatch:[1,'Uma carga de madeira partiu para a obra.']
};
function create(){return {lastTick:-1,seen:[],queue:[],lastSpoken:-10000,history:[]};}
function ingest(state,events){if(!Array.isArray(events))return state;for(const e of events){if(!e||!Number.isSafeInteger(e.tick)||typeof e.kind!=='string'||!META[e.kind])continue;const key=e.tick+'|'+e.actor+'|'+e.kind+'|'+e.detail;if(state.seen.includes(key))continue;state.seen.push(key);if(state.seen.length>200)state.seen.shift();const [priority,line]=META[e.kind];state.queue.push({key,tick:e.tick,priority,kind:e.kind,line});}state.queue.sort((a,b)=>b.priority-a.priority||a.tick-b.tick);if(state.queue.length>24)state.queue.length=24;return state;}
function next(state,tick,cooldown=8){if(!Number.isSafeInteger(tick)||tick-state.lastSpoken<cooldown)return null;state.queue=state.queue.filter(e=>tick-e.tick<=45);const e=state.queue.shift();if(!e)return null;state.lastSpoken=tick;state.history.push({tick,kind:e.kind,line:e.line});if(state.history.length>40)state.history.shift();return e;}
function restore(raw){try{const s=typeof raw==='string'?JSON.parse(raw):raw;if(!s||!Array.isArray(s.seen)||!Array.isArray(s.queue)||!Array.isArray(s.history)||!Number.isSafeInteger(s.lastSpoken))return null;return s;}catch{return null;}}
return {create,ingest,next,restore};
});
