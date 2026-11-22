'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
test('spectator village events retain the canonical illustrated scene',()=>{
 const frame=html.slice(html.indexOf('function frame(){'),html.indexOf("const V7_STORE='peteco-lab-v7-life-experiment'"));
 assert.match(frame,/const eventCloseup=[^;]*&&\!\(s\.phase==='vila'&&worldMapEnabled\)/);
 assert.ok(frame.includes('else if(worldMapEnabled&&!eventCloseup)'));
});
test('frame QA supports all sixteen source cells including fractional woodcutter cells',()=>{
 const report=execFileSync(process.execPath,['tools/qa-profession-frames.cjs'],{cwd:root,encoding:'utf8'}).trim().split('\n');
 assert.equal(report.length,4);
 for(const row of report){const item=JSON.parse(row);assert.equal(item.deltas.length,12);assert.ok(item.deltas.every(d=>d.changedRatio>0));}
});
