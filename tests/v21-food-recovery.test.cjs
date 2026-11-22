const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const progress=html.slice(html.indexOf('function progress(){'),html.indexOf('function progress(){')+3000);
function farmRate(people,food,level=79,damage=0){
 const efficiency=Math.max(.4,1-damage/100);
 const farmBase=3+Math.min(3,Math.floor(level/3));
 const foodShort=food<people*3;
 const farmBoost=foodShort?Math.min(48,Math.ceil(people/2)):0;
 return Math.max(1,Math.floor((farmBase+farmBoost)*efficiency));
}
test('emergency farm scales with population and keeps consumption unchanged',()=>{
 assert.match(progress,/farmBoost=foodShort\?Math\.min\(48,Math\.ceil\(s\.people\/2\)\):0/);
 assert.match(progress,/s\.cycles%4===0\)\{s\.food=Math\.max\(0,s\.food-s\.people\)/);
 assert.equal(farmRate(81,9),47);
 assert.equal(farmRate(81,500),6);
});
test('famine recovery produces more food than consumption for 81 healthy villagers',()=>{
 let food=9;
 for(let cycle=1;cycle<=24;cycle++){
  const production=farmRate(81,food);
  if(cycle%2===0)food+=2*production;
  if(cycle%4===0)food=Math.max(0,food-81);
 }
 assert.ok(food>9,'reserve should recover during emergency farm response');
 assert.ok(food>=0);
});
test('damaged villages retain bounded farm efficiency without free food',()=>{
 assert.ok(farmRate(81,9,79,60)>0);
 assert.ok(farmRate(81,9,79,60)<farmRate(81,9));
 assert.equal(farmRate(81,500),6);
});
