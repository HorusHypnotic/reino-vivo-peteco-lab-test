'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
test('default V17 village paints three persisted houses through the original atlas',()=>{
 for(const [slot,x,y] of [[1,64,274],[2,294,270],[0,183,418]]){
  assert.match(html,new RegExp('houseArt\\('+slot+','+x+','+y+','));
 }
 assert.match(html,/root\.PetecoStructureRendererV18/);
 assert.match(html,/root\.PetecoHouseAtlasV18/);
 assert.match(html,/renderer\.draw\(g,item,atlas\.image,\{x,y,width,height\}\)/);
 assert.match(html,/if\(!houseArt\(0,183,418,89,60\)&&!construction/);
});
test('the default village remains on V17, with world camera opt-in for cinematic focus',()=>{
 assert.match(html,/get\('worldcamera'\)==='1'\)worldCamera\(\);else if\(window\.PetecoArtV17\)/);
 assert.match(html,/PetecoArtV17\.draw\(g,s,s\.t,\{woodcutter:woodcutterActivity\.snapshot\(\)\}\)/);
});
test('V19 forest is loaded and drawn at the worker actual fallback worksite',()=>{
 assert.match(html,/tree\(g,78,407,1\.48,actors&&actors\.woodcutter,t\)/);
 assert.match(html,/PetecoForestArtV19\.draw\(g,actor,im,Date\.now\(\)/);
 assert.match(html,/forestSpec\?forestSpec\.asset:/);
});
