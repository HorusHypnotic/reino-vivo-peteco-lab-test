// Static V16.4 spectator composition regression. Run: node tests/spectator-v16-regression.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert.match(html,/Math\.floor\(s\.t\/720\)/,'camera dwell must be at least twelve seconds');
assert.match(html,/director\.zoom\+=\(targetZoom-director\.zoom\)\*\.028/,'camera easing must remain gentle');
assert.match(html,/g\.scale\(\.72,\.72\);actor\(0,0/,'featured avatar should remain scaled down');
assert.match(html,/translateX\(360px\)/,'ticker must enter from viewport edge');
assert.match(html,/scrollticker 38s linear infinite/,'ticker must move at a readable speed');
assert.match(html,/class="ticker spectator-ticker"/,'spectator ticker must remain present');
assert.match(html,/peteco-lab-vila-v2/,'legacy save key must remain available');
console.log('PASS spectator V16.4 static integration assertions');
