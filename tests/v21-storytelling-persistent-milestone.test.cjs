const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const village=html.slice(html.indexOf('function draw(g,s,t){'),html.indexOf('// V17.4 territorial view:'));
test('persistent village milestone derives from saved wall completions',()=>{
 assert.match(village,/if\(Number\(s\.projectCount\)>0\)/);
 assert.match(village,/MARCO DA VILA/);
 assert.match(village,/Math\.floor\(s\.projectCount\)\+' muralhas erguidas'/);
 const start=village.indexOf('// The last completed wall is a permanent milestone');
 const end=village.indexOf(' foreground(g,t,level);',start);
 assert.ok(start>=0&&end>start);
 assert.doesNotMatch(village.slice(start,end),/save\(|localStorage|s\.projectCount\s*=|s\.projectCount\+\+/);
});
test('recap removes technical cycle prefix for viewers',()=>{
 assert.ok(html.includes("latest.replace(/^Ciclo\\s+\\d+\\s*[·:]\\s*/,'')"));
});
