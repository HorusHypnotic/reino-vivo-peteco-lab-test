'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const start=html.indexOf('function illustratedVillage(');
const end=html.indexOf('function draw(g,s,t,actors)',start);
const scene=html.slice(start,end);
test('illustrated houses remain above wall monuments and construction site',()=>{
 assert.ok(start>=0&&end>start,'illustrated scene exists');
 const walls=scene.indexOf('completedWalls(g,s.projectCount)');
 const site=scene.indexOf('PetecoConstructionV20.draw(g,');
 const houses=scene.indexOf('layouts.forEach(');
 assert.ok(walls>=0&&site>=0&&houses>=0,'all scene layers exist');
 assert.ok(walls<houses&&site<houses,'walls and worksite are behind houses');
 assert.equal(scene.split('completedWalls(g,s.projectCount)').length-1,1,'walls painted once');
 assert.equal(scene.split('PetecoConstructionV20.draw(g,').length-1,1,'worksite painted once');
});
test('illustrated atlas does not receive geometric damage overlay',()=>{
 assert.match(scene,/if\(painted\)return/);
 assert.match(scene,/Number\(s\.damage\)>0&&\!\(southAtlas&&southAtlas\.ready&&root\.PetecoStructureRendererV18\)/);
});
