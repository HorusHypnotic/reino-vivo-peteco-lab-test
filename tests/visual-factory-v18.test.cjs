'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),factoryFile=path.join(root,'v18/visual-factory.js');
test('visual factory registers recovered woodcutter and forest atlases with compatible frames',()=>{
 const box={};vm.runInNewContext(fs.readFileSync(factoryFile,'utf8'),box);const factory=box.PetecoVisualFactoryV18;
 const plain=value=>JSON.parse(JSON.stringify(value));
 assert.deepEqual(plain(factory.list()),['woodcutter','forest','farm','quarry','construction']);
 assert.deepEqual(plain(Object.keys(factory.get('woodcutter').states)),['idle','walk','work','carry']);
 assert.deepEqual(plain(Object.keys(factory.get('forest').states)),['tree','falling','stump','sapling']);
 assert.deepEqual(plain(factory.frameRect('woodcutter','work',3)),{x:841.5,y:701,width:280.5,height:350.5});
 assert.deepEqual(plain(factory.frameRect('forest','sapling')),{x:1629,y:0,width:543,height:724});
 for(const job of ['farm','quarry','construction']){const spec=factory.get(job);assert.equal(spec.width,1120);assert.equal(spec.height,1400);assert.equal(spec.grid.columns,4);assert.equal(Object.keys(spec.states).length,4);assert.ok(spec.license);assert.match(spec.provenance,/art-manifests/);}
 assert.equal(factory.frameRect('woodcutter','unknown'),null);
});
test('production renderers consume factory frame metadata with legacy fallback intact',()=>{
 const box={};for(const file of ['v18/visual-factory.js','v18/woodcutter-renderer.js','v19/forest-art.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),box);
 const calls=[],ctx={save(){},restore(){},translate(){},scale(){},beginPath(){},ellipse(){},fill(){},drawImage(...args){calls.push(args)},set fillStyle(v){}};
 assert.equal(box.PetecoWoodcutterRendererV18.draw(ctx,{state:'carry',frame:2,x:90,y:100},{complete:true,naturalWidth:1122}),true);
 assert.equal(calls[0][1],561);assert.equal(calls[0][2],1051.5);
 calls.length=0;assert.equal(box.PetecoForestArtV19.draw(ctx,{phase:'idle'}, {complete:true,naturalWidth:2172,naturalHeight:724},5000),'tree');
 assert.equal(calls[0][1],0);assert.equal(calls[0][5],85);
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.ok(html.includes('<script src="v18/visual-factory.js"></script><script src="v18/woodcutter-renderer.js"></script>'));
});
test('asset validator decodes atlas integrity and confirms every frame is populated',()=>{
 const output=execFileSync(process.execPath,[path.join(root,'tools/validate-visual-assets.cjs')],{encoding:'utf8'});
 assert.match(output,/PASS woodcutter 1122x1402 RGBA 4x4; 16 non-empty frames/);
 assert.match(output,/PASS forest 2172x724 RGBA 4x1; 4 non-empty frames/);
 assert.match(output,/PASS farm 1120x1400 RGBA 4x4; 16 non-empty frames/);
 assert.match(output,/PASS quarry 1120x1400 RGBA 4x4; 16 non-empty frames/);
 assert.match(output,/PASS construction 1120x1400 RGBA 4x4; 16 non-empty frames/);
 assert.match(output,/PASS factory contact/);
});
