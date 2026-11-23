const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const sandbox={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../v24/scene.js'),'utf8'),sandbox);
const scene=sandbox.PetecoV24Scene.scene;
const world=(overrides={})=>({home:{stage:1,occupied:false,damage:0},agents:[],logistics:{trip:null},...overrides});
test('V24 prioritizes repair and actual building activity',()=>{
 assert.match(scene(world({home:{stage:2,damage:15},agents:[{task:'build'}]})).title,/reparo/);
 assert.match(scene(world({agents:[{task:'build'}]})).detail,/1 trabalhador/);
});
test('V24 narrates only confirmed logistics, occupation and gather',()=>{
 assert.match(scene(world({logistics:{trip:{quantity:5}}})).title,/Madeira a caminho/);
 assert.match(scene(world({home:{occupied:true,stage:3}})).title,/Casa habitada/);
 assert.match(scene(world({agents:[{task:'gather'}]})).title,/Lenhadores/);
 assert.doesNotMatch(scene(world()).title,/Madeira a caminho/);
 assert.equal(scene(null),null);
});
test('V24 is integrated without changing the existing visitor identity',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 assert.ok(html.includes('src="v24/scene.js"'));
 assert.ok(html.includes('PetecoV24Scene.scene(v7World)'));
 assert.ok(html.includes("$('viewer-mission').textContent=v24Scene.title"));
 assert.ok(html.includes("$('viewer-hero').textContent=hero?"));
});
