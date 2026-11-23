'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const live=fs.readFileSync(path.join(root,'index.html'),'utf8');
const admin=fs.readFileSync(path.join(root,'admin','index.html'),'utf8');
test('official root starts in 9:16 viewer mode without direction toggles',()=>{
 assert.match(live,/get\('admin'\)!=='1'/);
 assert.match(live,/document\.body\.classList\.add\('viewer'\)/);
 for(const id of ['view-toggle','map-toggle','region-toggle'])assert.ok(live.includes("document.querySelector('#"+id+"').hidden=true"));
 assert.match(live,/body\.viewer \.stagebar\{display:none\}/);
 assert.match(live,/\.viewer \.viewer-stage\{display:flex;flex-direction:column;aspect-ratio:9\/16/);
});
test('admin has a distinct address and can open direction view',()=>{
 assert.match(admin,/\.\.\/\?admin=1/);
 assert.match(live,/Prévia LIVE/);
 assert.match(live,/Voltar ao ADMIN/);
});
test('territorial QA stays opt-in and save remains isolated',()=>{
 const ui=fs.readFileSync(path.join(root,'v36','territory-ui.js'),'utf8');
 assert.match(ui,/get\('territory'\)!=='1'/);
 assert.match(ui,/peteco-v36-territory-qa-v1/);
 assert.match(ui,/\.viewer #territory-v36\{display:none\}/);
});
