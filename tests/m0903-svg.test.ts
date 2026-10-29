import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { reviewedSvgMarkup } from '../src/lib/reviewed-svg.ts';

test('reviewed SVG registry accepts only explicitly registered assets',()=>{
  for(const unknown of ['__proto__','constructor','/images/ceh/unreviewed.svg','https://example.invalid/x.svg','<svg onload="alert(1)">'])assert.equal(reviewedSvgMarkup(unknown),undefined);
  for(const lang of ['zh','en'])for(let n=1;n<=7;n++)assert.ok(reviewedSvgMarkup(`/images/ceh/m09-03-figure-${n}-${lang}.svg`)?.startsWith('<svg'));
});

test('M09-03 inline SVG bundle is fail-closed and matches every reviewed download',()=>{
  for(const args of [['scripts/test_m0903_svg.py'],['scripts/m0903_svg.py','--check']]){
    const result=spawnSync('python3',args,{encoding:'utf8'});
    assert.equal(result.status,0,result.stdout+result.stderr);
  }
  const component=readFileSync('src/lib/components/ReviewedSvgVisual.svelte','utf8');
  assert.ok(!component.includes('tabindex="0"')&&!component.includes('overflow-x:auto'));
  assert.ok(!component.includes('min-width:800px')&&component.includes('Open full-size SVG'));
  assert.ok(component.includes('width:100%;max-width:100%;height:auto'));
  assert.ok(!/min-width:\s*[1-9]\d*px/.test(component));
  assert.ok(!component.includes('<details'));
  const source=readFileSync('src/lib/components/SourceBody.svelte','utf8');
  assert.ok(source.includes("block.kind === 'visual' && reviewedSvgMarkup(block.src)"));
});

test('M09-03 spatial revision preserves all four published primary-source files byte for byte',()=>{
  const expected:Record<string,string>={
    'primary-2026-10-29.en.md':'6efa36c832843deab54e23ccd12b6053f78506eeb58153930655a6ef42c384f3',
    'primary-2026-10-29.zh-TW.md':'ae90c1b994ce507d340877bf4b880a866c54ba14c079f2e75c15234f8c433550',
    'primary-reference-answers.en.md':'931be44ac7b18b3f3f4df9f8d1c3ac74b2eac6e58db1946019f759dda2c87174',
    'primary-reference-answers.zh-TW.md':'86fe4a8cd32e3b0e1ad6ab3d7d2a46555a16a248969ba3d03bc6135c12966c05'
  };
  for(const [name,sha] of Object.entries(expected))assert.equal(createHash('sha256').update(readFileSync('docs/sources/m09-03/'+name)).digest('hex'),sha,name);
});
