const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const ctx={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../v22/depth.js'),'utf8'),ctx);
test('V22 orders by feet, preserves stable ties and never mutates simulation',()=>{
 const agents=[{id:'south',y:90},{id:'north',y:10},{id:'same',y:90}];
 const before=JSON.stringify(agents);
 const ordered=ctx.PetecoV22Depth.order(agents,a=>[12,a.y]);
 assert.deepEqual(Array.from(ordered,x=>x.agent.id),['north','south','same']);
 assert.equal(JSON.stringify(agents),before);
 assert.notEqual(ordered[0].agent,undefined);
});
test('V22 is read-only and wired into the viewer',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 assert.ok(html.includes('src="v22/depth.js"'));
 assert.ok(html.includes('PetecoV22Depth.order([{kind:'home',ref:h},...v7World.agents.map(agent=>({kind:'agent',ref:agent}))]'));
});
