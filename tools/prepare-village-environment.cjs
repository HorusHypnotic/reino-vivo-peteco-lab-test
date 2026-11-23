#!/usr/bin/env node
'use strict';

/* Build the shared V18 environment layer without its baked-in workers,
 * temporary OBRA billboard, scaffold, or the tree replaced by the live V19
 * worksite atlas. The remaining landscape and houses stay in the canonical
 * renderer as static art; simulation actors and construction stay dynamic. */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'v18/assets/village-scene.svg');
const OUTPUT = path.join(ROOT, 'v18/assets/village-environment.svg');
const HOUSE_DIR = path.join(ROOT, 'v18/assets/houses');
const HOUSES = Object.freeze({
  northwest: 'translate(150 600) scale(0.87)',
  northeast: 'translate(540 585) scale(0.88)',
  south: 'translate(360 855) scale(1.06)'
});
const REMOVE = Object.freeze([
  'translate(345 515)', // temporary scaffold and OBRA text
  'translate(80 570)', 'translate(151 653)', 'translate(222 736)',
  'translate(293 819)', 'translate(364 572)', 'translate(435 655)',
  'translate(506 738)', 'translate(577 821)', 'translate(648 574)',
  'translate(129 657)', 'translate(200 740)', 'translate(271 823)',
  'translate(342 576)', // baked-in decorative residents
  'translate(126 825) scale(0.7200000000000001)',
  'translate(200 801) scale(1.06)' // second background tree at the live V21 axe contact
]);

function removeTopLevelGroup(svg, transform) {
  const opening = `<g transform="${transform}">`;
  const start = svg.indexOf(opening);
  if (start < 0) throw new Error(`required source group missing: ${transform}`);
  let cursor = start, depth = 0;
  const tag = /<\/?g(?:\s[^>]*)?>/g;
  tag.lastIndex = start;
  let match;
  while ((match = tag.exec(svg))) {
    if (match[0].startsWith('</')) depth--;
    else if (!match[0].endsWith('/>')) depth++;
    if (depth === 0) {
      return svg.slice(0, start) + svg.slice(tag.lastIndex);
    }
    cursor = tag.lastIndex;
  }
  throw new Error(`unterminated source group: ${transform} at ${cursor}`);
}

function extractTopLevelGroup(svg, transform) {
  const opening = `<g transform="${transform}">`;
  const start = svg.indexOf(opening);
  if (start < 0) throw new Error(`required source group missing: ${transform}`);
  let depth = 0;
  const tag = /<\/?g(?:\s[^>]*)?>/g;
  tag.lastIndex = start;
  let match;
  while ((match = tag.exec(svg))) {
    if (match[0].startsWith('</')) depth--;
    else if (!match[0].endsWith('/>')) depth++;
    if (depth === 0) return svg.slice(start, tag.lastIndex);
  }
  throw new Error(`unterminated source group: ${transform}`);
}

function build(source) {
  if (!source.startsWith('<svg ') || !source.includes('viewBox="0 0 720 960"')) {
    throw new Error('unexpected V18 scene source geometry');
  }
  let result = source;
  const definitionsEnd = source.indexOf('</defs>');
  const header = source.slice(0, definitionsEnd + 7);
  const houseLayers = {};
  for (const [name, transform] of Object.entries(HOUSES)) {
    houseLayers[name] = `${header}${extractTopLevelGroup(source, transform)}</svg>`;
    result = removeTopLevelGroup(result, transform);
  }
  for (const transform of REMOVE) result = removeTopLevelGroup(result, transform);
  if (result.includes('OBRA') || result.includes('#e6b487')) {
    throw new Error('baked-in label or resident remains in environment layer');
  }
  if (Object.keys(houseLayers).length !== 3 || Object.values(HOUSES).some(transform => result.includes(transform)) ||
      !Object.values(houseLayers).every(layer => layer.includes('<g transform=')) || !result.includes('url(#stone)')) {
    throw new Error('required house, path, or terrain art was removed');
  }
  return { environment: result, houseLayers };
}

function main() {
  const result = build(fs.readFileSync(SOURCE, 'utf8'));
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(OUTPUT) || fs.readFileSync(OUTPUT, 'utf8') !== result.environment) {
      throw new Error('village environment asset is out of date; run this tool to rebuild');
    }
    for (const [name, svg] of Object.entries(result.houseLayers)) {
      const file = path.join(HOUSE_DIR, `${name}.svg`);
      if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== svg) throw new Error(`${name} house layer is out of date`);
    }
    console.log('PASS: V18 environment layer has no baked-in workers, work label, scaffold, or duplicate forest target');
    return;
  }
  fs.mkdirSync(HOUSE_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT, result.environment);
  for (const [name, svg] of Object.entries(result.houseLayers)) fs.writeFileSync(path.join(HOUSE_DIR, `${name}.svg`), svg);
  console.log(`PASS: wrote canonical environment and ${Object.keys(result.houseLayers).length} simulation-driven house layers from the existing V18 scene source`);
}

if (require.main === module) {
  try { main(); } catch (error) { console.error('FAIL village environment build:', error.message); process.exitCode = 1; }
}

module.exports = { build, REMOVE };
