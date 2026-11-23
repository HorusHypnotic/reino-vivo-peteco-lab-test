'use strict';
const assert=require('node:assert/strict');
const {prepare,STATES}=require('../tools/prepare-profession-atlas.cjs');
const m={job:'farm',states:STATES,columns:4,rows:4,license:'original',provenance:'test',source:'test'};
assert.throws(()=>prepare('unknown','missing.png',m),/unknown profession/);
assert.throws(()=>prepare('farm','missing.png',{...m,columns:3}),/expected 4x4/);
assert.throws(()=>prepare('farm','missing.png',{...m,license:''}),/license/);
assert.throws(()=>prepare('farm','missing.png',{...m,states:['idle']}),/state contract/);
console.log('PASS profession atlas rejects incomplete, misidentified and unlicensed inputs');
