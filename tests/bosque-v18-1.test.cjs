const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const sandbox={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../v18/bosque-vivo.js'),'utf8'),sandbox);
const forest=sandbox.PetecoBosqueV181;
assert.equal(forest.TREE.x,118);assert.equal(forest.TREE.y,290);
assert.equal(forest.model({phase:'cut',ledger:null},12).felled,false);
assert.equal(forest.model({phase:'carry',ledger:{deliveryConfirmed:false}},12).felled,false);
assert.equal(forest.model({phase:'carry',elapsed:0,ledger:{deliveryConfirmed:true}},12).felled,false,'tree begins falling before stump');
assert.equal(forest.model({phase:'carry',elapsed:.17,ledger:{deliveryConfirmed:true}},12).fallProgress,.5);
assert.equal(forest.model({phase:'carry',elapsed:.20,ledger:{deliveryConfirmed:true}},12).felled,false,'tree remains during early fall');
assert.equal(forest.model({phase:'carry',elapsed:.24,ledger:{deliveryConfirmed:true}},12).felled,true,'stump appears before carry resets');
assert.equal(forest.model({phase:'return',ledger:{deliveryConfirmed:true}},12).logs,2);
assert.equal(forest.model({phase:'idle',ledger:{deliveryConfirmed:true}},12).felled,false);
assert.equal(forest.model({phase:'idle',ledger:{deliveryConfirmed:true}},12).logs,0,'do not display stale delivered logs');
assert.equal(forest.model({phase:'cut',elapsed:.2},12).chopping,true);
assert.notEqual(forest.model({phase:'cut',elapsed:.2},12).lean,0);
assert.equal(forest.model({phase:'idle',elapsed:.2},12).lean,0);
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert.ok(html.includes('v18/bosque-vivo.js'));
assert.ok(html.includes('PetecoBosqueV181.draw(g,workerState,s.cycles);PetecoWoodcutterRendererV18.draw'));
assert.ok(html.indexOf('PetecoBosqueV181.draw(g,workerState,s.cycles)')<html.indexOf('PetecoWoodcutterRendererV18.draw(g,workerState,workerAtlas.image)'));

// Regression: a completed cut must remain visible after the 0.34s carry segment.
// A fake clock makes this deterministic without waiting in real time.
let fakeNow=10000;
const visualSandbox={Date:{now:()=>fakeNow}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../v18/bosque-vivo.js'),'utf8'),visualSandbox);
const forestVisual=visualSandbox.PetecoBosqueV181;
const fills=[];
const g={save(){},restore(){},beginPath(){},ellipse(){},fill(){},fillRect(...a){fills.push(a)},translate(){},rotate(){}};
forestVisual.draw(g,{phase:'carry',cycle:14,elapsed:.25,ledger:{deliveryConfirmed:true}},14);
fills.length=0;fakeNow+=700;
forestVisual.draw(g,{phase:'idle',cycle:14,elapsed:0,ledger:{deliveryConfirmed:true}},14);
assert.ok(fills.some(([x,y,w,h])=>x===109&&y===276&&w===18&&h===15),'stump persists after carrier returns idle');
fills.length=0;fakeNow+=3700;
forestVisual.draw(g,{phase:'idle',cycle:14,elapsed:0,ledger:{deliveryConfirmed:true}},14);
assert.ok(!fills.some(([x,y,w,h])=>x===109&&y===276&&w===18&&h===15),'stump expires after regrowth');

console.log('PASS bosque target, read-only ledger gate, foreground ordering and regrowth');
