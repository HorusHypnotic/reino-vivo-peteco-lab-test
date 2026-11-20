const assert=require('node:assert/strict');const {test}=require('node:test');const life=require('./life.js');
test('three persistent unique NPCs',()=>{const w=life.create();assert.deepEqual(w.agents.map(a=>a.id),['npc-1','npc-2','npc-3']);});
test('wood conservation across 100 cycles',()=>{const w=life.create();for(let i=0;i<100;i++){life.step(w);assert.equal(life.validate(w),true);}});
test('house progresses and is occupied',()=>{const w=life.create();for(let i=0;i<30;i++)life.step(w);assert.equal(w.home.stage,3);assert.equal(w.home.occupied,true);});
test('deterministic replay',()=>{const a=life.create(17),b=life.create(17);for(let i=0;i<100;i++){life.step(a);life.step(b);}assert.deepEqual(a,b);});
test('save and restore retains identity, stock and history',()=>{const w=life.create();for(let i=0;i<40;i++)life.step(w);assert.deepEqual(life.restore(JSON.stringify(w)),w);});
test('invalid saves rejected',()=>{assert.equal(life.restore('{'),null);const w=life.create();w.stock.wood=-1;assert.equal(life.restore(w),null);});

test('logistics requires confirmed delivery before construction',()=>{const w=life.create();let firstBuild=-1,confirmed=-1;for(let i=0;i<40;i++){life.step(w);if(confirmed<0&&w.events.some(e=>e.kind==='delivery-confirmed'))confirmed=w.tick;if(firstBuild<0&&w.home.stage>0)firstBuild=w.tick;assert.equal(life.validate(w),true);}assert.ok(confirmed>0);assert.ok(firstBuild>=confirmed);assert.equal(w.home.stage,3);assert.equal(w.logistics.trips,1);});
test('materials are conserved across stock, transit and worksite',()=>{const w=life.create();for(let i=0;i<1000;i++){life.step(w);assert.equal(life.validate(w),true);}assert.equal(w.spent,12);assert.equal(w.logistics.delivered,12);});
test('logistics rejects invalid orders',()=>{const w=life.create();assert.throws(()=>life.request(w,'wood',-1,'home-1'));assert.throws(()=>life.request(w,'stone',3,'home-1'));});
test('pre-logistics experimental saves migrate',()=>{const w=life.create();for(let i=0;i<30;i++)life.step(w);delete w.logistics;assert.ok(life.restore(JSON.stringify(w)));});
