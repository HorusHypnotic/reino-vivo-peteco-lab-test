const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const scene=html.slice(html.indexOf('function frame(){'),html.indexOf('function frame(){')+7000);
test('factory starts on normal public URL without opt-in',()=>{
 assert.match(html,/const factoryV20=window\.PetecoFactoryV20&&window\.PetecoSceneMapV20/);
 assert.doesNotMatch(html,/const factoryV20=new URLSearchParams\(location\.search\)/);
});
test('default V21 village draws original woodcutter and real V20 jobs',()=>{
 assert.match(scene,/PetecoArtV17\.draw\(g,s,s\.t,\{woodcutter:woodcutterActivity\.snapshot\(\)\}\)/);
 assert.match(scene,/woodcutterActivity\.snapshot\(\)/);
 assert.match(scene,/PetecoWoodcutterRendererV18\.draw\(g,woodV21,atlas\.image\)/);
 assert.match(scene,/for\(const job of \['farm','quarry','construction'\]\)/);
 assert.match(scene,/PetecoProfessionRendererV20\.draw\(g,actor\.snapshot\(\),s\.t\)/);
});
test('visual factory consumes real sector changes and never writes economic state',()=>{
 const bridge=fs.readFileSync(path.join(__dirname,'../v20/economy-bridge.js'),'utf8');
 const actor=fs.readFileSync(path.join(__dirname,'../v20/actor-controller.js'),'utf8');
 assert.match(bridge,/after\.farm>before\.farm/);
 assert.match(bridge,/after\.quarry>before\.quarry/);
 assert.match(actor,/e\.confirmed!==true/);
 assert.doesNotMatch(actor,/localStorage|\.food\s*[+\-]?=|\.stone\s*[+\-]?=/);
});
