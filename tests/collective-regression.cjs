/* Peteco Lab Lote 0 regression tests. Run locally with node tests/collective-regression.cjs. No Actions. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
function moduleAt(name){const m={exports:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'v7',name+'.js'),'utf8'),{module:m,exports:m.exports});return m.exports;}
const C=moduleAt('civic'),D=moduleAt('delivery');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const from=html.indexOf("const COLLECTIVE_CHECKPOINT=");
const to=html.indexOf('function deliveryTick()',from);
assert(from>=0&&to>from,'checkpoint and actions must exist');
const source=html.slice(from,to);
function harness(fail){const e=C.economyCreate(),c=C.create(),d=D.create();const store={data:{},setItem(k,v){if(fail)throw Error('quota');this.data[k]=v;},getItem(k){return this.data[k]||null;}};const build=new Function('civicEconomy','civicState','deliveryState','PetecoCivic','PetecoDelivery','localStorage','CIVIC_STORE','CIVIC_ECON_STORE','DELIVERY_STORE',source+';return {collectiveAction,persistCollective};');return {e,c,d,store,...build(e,c,d,C,D,store,'c','e','d')};}
const players={players:{bot:{faction:'BR-PA'}}};
let x=harness(false);assert(x.collectiveAction(players,'bot','build').ok);assert.equal(x.d.jobs.length,1);assert.equal(x.e.homes,0);assert.equal(x.e.stock.wood,75);assert(x.store.data['peteco-lab-collective-checkpoint-v1']);
const checkpoint=JSON.parse(x.store.data['peteco-lab-collective-checkpoint-v1']);assert(C.restore(checkpoint.civic));assert(C.economyRestore(checkpoint.economy));assert(D.restore(checkpoint.delivery));
x=harness(true);const before=JSON.stringify([x.e,x.c,x.d]);assert.equal(x.collectiveAction(players,'bot','build').ok,false);assert.equal(JSON.stringify([x.e,x.c,x.d]),before);
x=harness(false);assert.equal(x.collectiveAction(players,'bot','bad').ok,false);assert.equal(x.d.jobs.length,0);
let queue=D.create();for(let i=1;i<=75;i++)assert(D.enqueue(queue,{seq:i,action:'build',cost:{}}).ok);assert.equal(D.restore(JSON.stringify(queue)).jobs.length,75);assert.equal(D.enqueue(queue,{seq:1,action:'build',cost:{}}).ok,false);
for(let i=0;i<11;i++)D.step(queue);assert.equal(queue.jobs[0].status,'done');
assert.equal(D.restore('{bad'),null);
console.log('PASS 8 regression checks: success, checkpoint restore x3, storage failure, invalid action, 75 jobs, duplicate, completion, malformed restore');
