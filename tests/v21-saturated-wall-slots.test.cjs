const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../v20/construction-state.js'),'utf8');
const context={};context.globalThis=context;vm.runInNewContext(source,context);
const renderer=context.PetecoConstructionV20;
function capture(project,projectCount){const calls=[];const g={save(){},restore(){},fillRect(...a){calls.push(['fill',...a])},strokeRect(...a){calls.push(['stroke',...a])},set fillStyle(v){},set strokeStyle(v){},set lineWidth(v){}};renderer.draw(g,{project,projectGoal:30,projectCount},0,{x:152,y:259,width:66,rowHeight:8,slots:2});return calls;}
for(const completed of [0,1,2,3,10,100]){
 const idle=capture(0,completed),working=capture(10,completed);
 assert.ok(working.some(c=>c[0]==='stroke'),'foundation remains visible at completed='+completed);
 assert.ok(!idle.some(c=>c[0]==='stroke'),'idle state has no active foundation at completed='+completed);
 assert.equal(renderer.derive({project:10,projectGoal:30,projectCount:completed}).completed,completed);
}
for(const p of [11,20,21,29])assert.ok(capture(p,20).some(c=>c[0]==='fill'&&c[1]>=185),'progress remains visible in reserved slot at '+p);
// The active slot must remain inside the canvas bounds and not overwrite
// completed sections when the saved completion counter exceeds the display.
for(const completed of [0,1,2,3,10,100])for(const p of [10,11,20,21,29]){
 const calls=capture(p,completed);
 assert.ok(calls.length>0,'nonempty draw at '+completed+'/'+p);
 for(const call of calls){
  const [,x,y,w,h]=call;
  assert.ok(Number.isFinite(x)&&Number.isFinite(y)&&Number.isFinite(w)&&Number.isFinite(h),'finite geometry');
  assert.ok(x>=150&&x+w<=220,'construction within canvas slot bounds at '+completed+'/'+p);
 }
}
assert.equal(renderer.derive({project:10,projectGoal:30}).phase,'foundation');
assert.equal(renderer.derive({project:20,projectGoal:30}).phase,'walls');
assert.equal(renderer.derive({project:29,projectGoal:30}).phase,'finish');
console.log('PASS V21 construction visibility with saturated wall slots');
