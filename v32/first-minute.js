/* V32: viewer onboarding from real public village state; no chat or gift automation. */
(function(root){'use strict';
function brief(state){
 if(!state||typeof state!=='object')return null;
 const people=Math.max(0,Math.floor(Number(state.people)||0));
 const court=Array.isArray(state.court)?state.court:[];
 const goal=Math.max(1,Math.floor(Number(state.projectGoal)||1));
 const progress=Math.max(0,Math.min(goal,Math.floor(Number(state.project)||0)));
 const project=Math.max(1,Math.floor(Number(state.projectCount)||0)+1);
 if(state.phase==='batalha')return Object.freeze({mission:'⚔️ Defenda a vila · batalha em andamento',cue:'💬 Comente !defender para participar',detail:'Defesa coletiva em curso'});
 if(Number(state.food)<people*2)return Object.freeze({mission:'🌾 A vila precisa de alimento',cue:'💬 Comente !entrar para conhecer a vila',detail:'Estoque abaixo de duas unidades por morador'});
 return Object.freeze({mission:'🏗️ Muralha '+project+' · '+progress+'/'+goal+' · '+court.length+' na corte',cue:court.length?'💬 !profissao para escolher seu papel · !defender para proteger':'💬 Novo por aqui? Comente !entrar para participar',detail:'A vila produz enquanto o público participa'});
}
root.PetecoV32FirstMinute=Object.freeze({brief});
})(typeof window!=='undefined'?window:globalThis);
