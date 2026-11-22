/* Adapter for the existing local Node bridge's {type:'fx', payload, seq} envelope.
   It only forwards normalized events; it never executes game commands or writes saves. */
(function(root){'use strict';
const TYPES=new Set(['comment','like','gift','follow','share']);
function create({onEvent=()=>{},onStatus=()=>{},maxSeen=500}={}){
 const seen=new Set(),limit=Math.max(32,Math.min(2000,Math.floor(Number(maxSeen)||500)));
 let socket=null,status='offline',lastSequence=-1;
 function report(next,detail){status=next;onStatus(Object.freeze({status,detail:detail||null}));}
 function detach(){if(!socket)return;const s=socket;socket=null;if(s.removeEventListener){s.removeEventListener('open',onOpen);s.removeEventListener('close',onClose);s.removeEventListener('error',onError);s.removeEventListener('message',onMessage);}else{s.onopen=null;s.onclose=null;s.onerror=null;s.onmessage=null;}}
 function onOpen(){report('connected');}
 function onClose(){if(socket){detach();report('disconnected');}}
 function onError(){report('error','socket-error');}
 function eventKey(seq,p){const user=p.user||{};return String(p.eventId||[seq,p.type,p.timestamp,user.userId||user.id||user.username||''].join(':'));}
 function onMessage(message){
  let envelope;try{envelope=JSON.parse(typeof message?.data==='string'?message.data:String(message?.data??message));}catch{return false;}
  if(!envelope||envelope.type!=='fx'||!Number.isSafeInteger(envelope.seq)||envelope.seq<0||!envelope.payload||!TYPES.has(envelope.payload.type))return false;
  const key=eventKey(envelope.seq,envelope.payload);if(seen.has(key))return false;
  seen.add(key);if(seen.size>limit)seen.delete(seen.values().next().value);
  lastSequence=Math.max(lastSequence,envelope.seq);
  onEvent(Object.freeze({...envelope.payload,bridgeSequence:envelope.seq}));return true;
 }
 function connect(nextSocket){
  if(!nextSocket||typeof nextSocket!=='object')return false;
  detach();socket=nextSocket;report('connecting');
  if(socket.addEventListener){socket.addEventListener('open',onOpen);socket.addEventListener('close',onClose);socket.addEventListener('error',onError);socket.addEventListener('message',onMessage);}
  else{socket.onopen=onOpen;socket.onclose=onClose;socket.onerror=onError;socket.onmessage=onMessage;}
  if(socket.readyState===1)onOpen();return true;
 }
 function disconnect(){const current=socket;if(!current){report('offline');return false;}detach();try{if(typeof current.close==='function')current.close();}catch{}report('offline');return true;}
 return Object.freeze({connect,disconnect,get status(){return status;},get lastSequence(){return lastSequence;}});
}
root.PetecoLiveEventGatewayV20=Object.freeze({create});
})(typeof window!=='undefined'?window:globalThis);
