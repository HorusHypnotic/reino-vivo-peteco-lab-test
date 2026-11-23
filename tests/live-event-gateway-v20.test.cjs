const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const context={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../v20/live-event-gateway.js'),'utf8'),context);
test('existing Node fx envelopes cross a decoupled, deduplicated bridge',()=>{
 const events=[],statuses=[];const bridge=context.PetecoLiveEventGatewayV20.create({onEvent:e=>events.push(e),onStatus:s=>statuses.push(s.status)});
 const listeners={};const socket={readyState:0,addEventListener:(n,f)=>listeners[n]=f,removeEventListener:(n)=>delete listeners[n],close(){this.closed=true;}};
 assert.equal(bridge.connect(socket),true);listeners.open();assert.equal(bridge.status,'connected');
 const envelope={type:'fx',seq:7,payload:{type:'comment',timestamp:123,user:{userId:'42',username:'viewer'},comment:'!entrar'}};
 assert.equal(listeners.message({data:JSON.stringify(envelope)}),true);
 assert.equal(listeners.message({data:JSON.stringify(envelope)}),false,'duplicate sequence/event is ignored');
 assert.equal(events.length,1);assert.equal(events[0].bridgeSequence,7);assert.equal(events[0].comment,'!entrar');
 assert.equal(listeners.message({data:JSON.stringify({...envelope,seq:8,payload:{...envelope.payload,type:'unsupported'}})}),false);
 listeners.close();assert.equal(bridge.status,'disconnected');
 assert.equal(bridge.connect({...socket,readyState:1}),true);assert.equal(bridge.status,'connected');
 assert.equal(bridge.disconnect(),true);assert.equal(bridge.status,'offline');assert.ok(statuses.includes('disconnected'));
});
test('bridge disconnects without touching game saves or accepting malformed payloads',()=>{
 const events=[];const bridge=context.PetecoLiveEventGatewayV20.create({onEvent:e=>events.push(e)});
 const handlers={};bridge.connect({addEventListener:(n,f)=>handlers[n]=f,removeEventListener(){},close(){}});
 for(const data of ['not-json',JSON.stringify({type:'state',seq:1,payload:{type:'comment'}}),JSON.stringify({type:'fx',seq:-1,payload:{type:'gift'}})])assert.equal(handlers.message({data}),false);
 assert.equal(events.length,0);assert.equal(bridge.lastSequence,-1);
});
