const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const ctx={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../v23/direction.js'),'utf8'),ctx);
test('spectator highlights prefer verified construction and delivery, never idle actors',()=>{
 const agents=[{task:'idle'},{task:'gather'},{task:'deliver'},{task:'build'},{task:'trade'}];
 const before=JSON.stringify(agents);
 assert.deepEqual(Array.from(ctx.PetecoV23Direction.highlights(agents),a=>a.task),['build','deliver']);
 assert.equal(JSON.stringify(agents),before);
 assert.equal(ctx.PetecoV23Direction.highlights([{task:'idle'}]).length,0);
});
test('equal priority remains stable and spectator labels are capped',()=>{
 const a=[{task:'gather',id:1},{task:'gather',id:2},{task:'gather',id:3}];
 assert.deepEqual(Array.from(ctx.PetecoV23Direction.highlights(a,2),x=>x.id),[1,2]);
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 assert.ok(html.includes('src="v23/direction.js"'));
 assert.ok(html.includes('PetecoV23Direction.highlights(v7World.agents,2)'));
 assert.ok(html.includes('if(cue&&v7Highlights.includes(a))'));
});
