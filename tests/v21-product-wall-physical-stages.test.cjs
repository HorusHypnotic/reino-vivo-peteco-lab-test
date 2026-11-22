const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const scene=html.slice(html.indexOf('function draw(g,s,t){'),html.indexOf('// V17.4 territorial view:'));
test('three physical construction stages use saved work ratio',()=>{
 assert.match(scene,/if\(s\.project>0\)\{/);
 assert.match(scene,/const fraction=Math\.min\(1,Math\.max\(0,Number\(s\.project\)\|\|0\)\/Math\.max\(1,Number\(s\.projectGoal\)\|\|30\)\)/);
 assert.match(scene,/const stage=fraction<=1\/3\?1:fraction<=2\/3\?2:3/);
 assert.match(scene,/if\(stage>=2\)/);
 assert.match(scene,/if\(stage===3\)/);
 assert.match(scene,/Math\.ceil\(fraction\*6\)/);
});
test('physical construction art cannot grant resources or alter saves',()=>{
 const start=scene.indexOf(' // P0: construction has three visible physical states');
 const end=scene.indexOf(' completedWalls(g,s.projectCount);',start);
 assert.ok(start>=0&&end>start);
 assert.doesNotMatch(scene.slice(start,end),/save\(|localStorage|s\.project\s*=|s\.stone\s*=|s\.wood\s*=|s\.projectCount\+\+/);
});
