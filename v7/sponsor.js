/* V8.2 experimental sponsorship scheduler. No real brand or payment integration. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PetecoSponsor=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const DEMO=Object.freeze({id:'demo-workshop',name:'Oficina da Vila',category:'serviços',copy:'A oficina prepara ferramentas para reconstruir a vila.',disclosure:'PUBLICIDADE · DEMONSTRAÇÃO',approved:false});
function eligible({tick,viewer,village,crisis,activeBattle,realSponsor=false}={}){return Number.isSafeInteger(tick)&&tick>=0&&viewer===true&&village===true&&!crisis&&!activeBattle&&!realSponsor&&tick%900>=150&&tick%900<300;}
function slot(context){return eligible(context)?{...DEMO,visualOnly:true}:null;}
function validateCampaign(c){return !!(c&&typeof c.id==='string'&&typeof c.name==='string'&&c.approved===true&&c.disclosure==='PUBLICIDADE'&&typeof c.copy==='string');}
return {eligible,slot,validateCampaign};
});
