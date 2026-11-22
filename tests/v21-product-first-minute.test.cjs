const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const scene=html.slice(html.indexOf('function draw(g,s,t){'),html.indexOf('// V17.4 territorial view:'));
test('first-minute village labels all four physical work sites',()=>{
 assert.match(scene,/function siteLabel\(name,x,y,w\)/);
 for(const name of ['BOSQUE','PEDREIRA','LAVOURA','OBRA'])assert.ok(scene.includes("siteLabel('"+name+"'"),name);
});
test('worksite labels are scene-only and leave economy untouched',()=>{
 const start=scene.indexOf('function siteLabel(name,x,y,w)');
 const end=scene.indexOf(' // Small workers are located along meaningful production routes.',start);
 const labels=scene.slice(start,end);
 assert.ok(start>=0&&end>start);
 assert.doesNotMatch(labels,/localStorage|s\.food\s*=|s\.wood\s*=|s\.stone\s*=|s\.project\s*=/);
 assert.ok(scene.indexOf("siteLabel('BOSQUE'")>scene.indexOf('g.translate(78,407)'));
 assert.ok(scene.indexOf("siteLabel('LAVOURA'")>scene.indexOf('garden(g,286,420,t)'));
});
