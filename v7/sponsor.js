/* V8.2 experimental sponsorship scheduler. No real brand or payment integration. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PetecoSponsor=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const DEMO=Object.freeze({id:'demo-workshop',name:'Oficina da Vila',category:'serviços',copy:'A oficina prepara ferramentas para reconstruir a vila.',disclosure:'PUBLICIDADE · DEMONSTRAÇÃO',approved:false});
function eligible({tick,viewer,village,crisis,activeBattle,realSponsor=false}={}){return Number.isSafeInteger(tick)&&tick>=0&&viewer===true&&village===true&&!crisis&&!activeBattle&&!realSponsor&&tick%900>=150&&tick%900<300;}
function contextualSlot({world,viewer,village,crisis,activeBattle}={}){if(!world||!Number.isSafeInteger(world.tick)||!Array.isArray(world.events)||!viewer||!village||crisis||activeBattle)return null;const event=world.events.slice().reverse().find(e=>e&&e.kind==='repair'&&Number.isSafeInteger(e.tick)&&world.tick-e.tick>=0&&world.tick-e.tick<=2);if(!event)return null;return {...DEMO,visualOnly:true,reason:'repair',eventTick:event.tick,copy:'Oficina da Vila · ferramentas para a reconstrução.'};}
function slot(context){return eligible(context)?{...DEMO,visualOnly:true}:null;}
function validateCampaign(c){return !!(c&&typeof c.id==='string'&&typeof c.name==='string'&&c.approved===true&&c.disclosure==='PUBLICIDADE'&&typeof c.copy==='string');}
return {eligible,slot,contextualSlot,validateCampaign};
});
