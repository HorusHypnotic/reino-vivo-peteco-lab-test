const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert.match(html,/forestBefore=Number\(a\.forest\)\|\|0,woodBefore=s\.wood,deliveriesBefore=s\.deliveries/,'progress snapshots economy before applying its existing rules');
assert.match(html,/forestSectorOutput=Math\.max\(1,Math\.floor\(\(2\+Math\.min\(5,s\.level\)\)\*efficiency\)\);a\.forest\+=forestSectorOutput/,'the forest sector keeps its existing cycle output rule');
assert.match(html,/forestWoodProduced=Math\.max\(0,raw-craft\*2\);s\.wood\+=forestWoodProduced/,'wood is still credited once at the original progress production point');
assert.match(html,/deliveryConfirmed:s\.deliveries>deliveriesBefore&&forestWoodProduced>0/,'carry requires both a production event and confirmed delivery');
assert.match(html,/if\(run!==epoch\|\|!s\.busy\|\|s\.phase!==\x27vila\x27\)\{woodcutterActivity\.cancel\(run\);return\}/,'invalidated harvest cancels only its own actor epoch');
assert.match(html,/if\(a===\x27reset\x27\)\{epoch\+\+;woodcutterActivity\.cancel\(\)/,'reset cancels transient activity');
assert.match(html,/if\(!s\.auto\)\{epoch\+\+;woodcutterActivity\.cancel\(\)/,'pausing automatic production cancels transient activity');
const save=html.match(/function save\(\)\{[\s\S]*?\n/)[0];assert.doesNotMatch(save,/woodcutter|woodLedger/,'V18 visual state is excluded from v2 saves');
assert.match(html,/if\(warOnScreen\)\{rect\(0,0,360,480/,'war rendering keeps priority over the V18 village scene');
assert.match(html,/PetecoArtV17\.world\(g,s,s\.t\)/,'classic renderer fallback remains present');
assert.match(html,/PetecoWoodcutterRendererV18\.draw\(g,workerState,workerAtlas\.image\)/,'V18 painterly atlas is used by the renderer');
assert.match(html,/workerState\.ledger\.producedWood,17,433/,'HUD uses actual confirmed producedWood field');
assert.doesNotMatch(html,/workerState\.ledger\.forestOutput/,'HUD must not display undefined forestOutput');
for(const asset of ['v18/art-bridge.js','v18/actor-state-machine.js','v18/art-motion.js','v18/woodcutter-controller.js','v18/woodcutter-renderer.js','v18/assets/village-scene.svg','v18/assets/village-environment.svg','v18/assets/woodcutter-atlas-original.png']){
 assert.ok(fs.existsSync(path.join(__dirname,'..',asset)),'missing V18 asset: '+asset);
}
assert.ok(html.includes('v18/assets/village-environment.svg'),'canonical environment layer is loaded');
assert.match(html,/window\.PetecoWoodcutterV18\.create\(\)/,'controller must initialize');
assert.match(html,/woodcutterActivity\.update\(1\/60\)/,'animation must advance each frame');
assert.match(html,/PetecoV18Scene\.ready&&window\.PetecoArtBridgeV18&&window\.PetecoWoodcutterAtlasV18&&window\.PetecoWoodcutterAtlasV18\.ready&&window\.PetecoWoodcutterRendererV18/,'V18 scene must not replace V17 before the woodcutter atlas loads');
console.log('PASS economic event hooks preserve parity authority, cancellation, save schema, classic mode and war priority');
