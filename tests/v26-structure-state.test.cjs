'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.join(__dirname,'..');
const sandbox={};
vm.runInNewContext(fs.readFileSync(path.join(root,'v26/architecture.js'),'utf8'),sandbox);
const api=sandbox.PetecoV26Architecture;

function canvas(){const calls=[];return {calls,save(){calls.push('save')},restore(){calls.push('restore')},beginPath(){},moveTo(){},lineTo(){},closePath(){},stroke(){calls.push('stroke')},fill(){calls.push('fill')},fillRect(){calls.push('rect')}}}

test('saved structure stage and integrity produce visual progress, damage, ruin, and recovery without mutation',()=>{
 for(const [state,expected] of [
  [{stage:0,integrity:100},'scaffold'],
  [{stage:2,integrity:100},'scaffold'],
  [{stage:3,integrity:55},'damage'],
  [{stage:3,integrity:0},'damage'],
  [{stage:3,integrity:100},'complete']
 ]){
  const g=canvas(),before=JSON.stringify(state),ok=api.structureState(g,state,{x:180,y:400,width:70,height:60},12);
  assert.equal(JSON.stringify(state),before);
  if(expected==='complete')assert.equal(ok,false);else {assert.equal(ok,true);assert.ok(g.calls.includes('stroke')||g.calls.includes('fill'));}
 }
});

test('invalid structure layouts do not draw',()=>{
 assert.equal(api.structureState(canvas(),{stage:2,integrity:80},{x:NaN,y:10,width:60,height:50}),false);
});
