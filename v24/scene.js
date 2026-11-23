/* V24: truthful, concise scene copy derived only from current V7 simulation. */
(function(root){'use strict';
function scene(world){
 if(!world||!world.home)return null;
 const home=world.home,trip=world.logistics?.trip;
 const builders=Array.isArray(world.agents)?world.agents.filter(a=>a?.task==='build').length:0;
 const gatherers=Array.isArray(world.agents)?world.agents.filter(a=>a?.task==='gather').length:0;
 if(home.damage>0)return {title:'🛠️ Casa precisa de reparo',detail:'Danos registrados: '+Math.round(home.damage)+'%'};
 if(builders>0)return {title:'🏗️ Construção em andamento',detail:builders+' trabalhador(es) construindo · etapa '+Math.min(3,Math.max(0,home.stage||0))+'/3'};
 if(trip&&Number(trip.quantity)>0)return {title:'🪵 Madeira a caminho',detail:trip.quantity+' unidade(s) em transporte confirmado'};
 if(home.occupied)return {title:'🏡 Casa habitada',detail:'Construção concluída · moradores instalados'};
 if(gatherers>0)return {title:'🪓 Lenhadores em atividade',detail:gatherers+' trabalhador(es) coletando madeira'};
 return {title:'🌿 Vila em atividade',detail:'Aguardando a próxima ação da economia'};
}
root.PetecoV24Scene=Object.freeze({scene});
})(typeof window!=='undefined'?window:globalThis);
