const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const scene=html.slice(html.indexOf('function draw(g,s,t){'),html.indexOf('// V17.4 territorial view:'));
test('construction meter reads existing persisted project and goal',()=>{
 assert.match(scene,/const actualGoal=Math\.max\(1,Number\(s\.projectGoal\)\|\|30\)/);
 assert.match(scene,/const actualProgress=Math\.max\(0,Number\(s\.project\)\|\|0\)/);
 assert.match(scene,/const constructionFraction=Math\.min\(1,actualProgress\/actualGoal\)/);
 assert.match(scene,/g\.fillText\('OBRA '\+Math\.floor\(constructionFraction\*100\)\+'%'/);
});
test('construction meter does not grant resources or persist fake work',()=>{
 const start=scene.indexOf('const actualGoal=');
 const end=scene.indexOf(' // Small workers are located along meaningful production routes.',start);
 assert.ok(start>=0&&end>start);
 assert.doesNotMatch(scene.slice(start,end),/save\(|localStorage|s\.project\s*=|s\.wood\s*=|s\.stone\s*=/);
});
