// V16.2 regression: battle art is deterministic, read-only and bounded.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync(require('node:path').join(__dirname,'../v7/battle-art-v16.js'),'utf8');
const sandbox={};vm.runInNewContext(src,sandbox);
const art=sandbox.PetecoBattleArt;assert.equal(typeof art.draw,'function');
function mock(){const calls=[];const ctx={save(){calls.push('save')},restore(){calls.push('restore')},fillRect(...a){calls.push(['rect',...a])},beginPath(){},arc(){},fill(){},stroke(){},moveTo(){},lineTo(){}};return {ctx,calls};}
const war={a:'BR-PA',b:'BR-SP',hpA:35,hpB:80,round:4,visualFactions:{'BR-PA':{ruins:5,fortifications:2},'BR-SP':{ruins:0,fortifications:4}}};
const before=JSON.stringify(war);
const first=mock();art.draw(first.ctx,war,200,{until:250,side:'a',cmd:'attack'});
assert.equal(JSON.stringify(war),before,'render must not mutate game state');
assert.equal(first.calls[0],'save');assert.equal(first.calls.at(-1),'restore');
const second=mock();art.draw(second.ctx,war,200,{until:250,side:'a',cmd:'attack'});
assert.deepEqual(first.calls,second.calls,'same state and frame must render identically');
const empty=mock();art.draw(empty.ctx,null,200,null);assert.equal(empty.calls.length,0);
const extreme=mock();art.draw(extreme.ctx,{a:'A',b:'B',hpA:-1e9,hpB:1e9,visualFactions:{A:{ruins:1e9,fortifications:1e9}}},999999999,null);
assert.ok(extreme.calls.length<300,'visual loops must be bounded');
console.log('PASS battle-art V16.2: deterministic, immutable, bounded, null-safe');

const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const scene=html.slice(html.indexOf('function drawWarScene(){'),html.indexOf('function drawWarScene(){')+4200);
assert.match(scene,/PetecoBattleArt\.draw\(/,'art layer must be connected');
assert.doesNotMatch(scene,/const stride=\(s\.t\*\.3/,'legacy troop overlay must not duplicate V16 troops');
assert.doesNotMatch(scene,/const broken=Math\.min\(4/,'legacy fortress damage must not duplicate V16 rubble');
console.log('PASS V16.3 scene integration: no duplicate legacy troop or rubble renderer');
