const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const village=html.slice(html.indexOf('function illustratedVillage('),html.indexOf('function draw(g,s,t,actors){'));
test('persistent village milestone derives from saved wall completions',()=>{
 assert.match(village,/completedWalls\(g,s\.projectCount\)/);
 assert.match(village,/PetecoConstructionV20\.draw\(g,\{project:s\.project,projectGoal:s\.projectGoal,projectCount:s\.projectCount\}/);
 assert.doesNotMatch(village,/localStorage|s\.projectCount\s*=|s\.projectCount\+\+/);
});
test('recap removes technical cycle prefix for viewers',()=>{
 assert.ok(html.includes("latest.replace(/^Ciclo\\s+\\d+\\s*[·:]\\s*/,'')"));
});
