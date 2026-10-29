import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { allConceptTeachings } from '../src/lib/server/catalog.ts';
import inline from '../src/lib/m0903-inline-svg.json' with {type:'json'};

test('full teaching SVGs fit their columns; fixed-size node icons remain separate',()=>{
  const component=readFileSync('src/lib/components/ReviewedSvgVisual.svelte','utf8');
  assert.match(component,/\.diagram-canvas\{width:100%;max-width:100%;min-width:0;/);
  assert.match(component,/:global\(svg\)\{display:block;width:100%;max-width:100%;height:auto\}/);
  assert.doesNotMatch(component,/[;{](?:min-width|max-width|height):\s*\d+px|overflow(?:-x)?:\s*(?:auto|scroll|hidden)/);
  assert.doesNotMatch(component,/scroll sideways|可左右捲動|Scrollable diagram|tabindex=/);
  assert.ok(component.includes('open the original SVG to zoom')&&component.includes('圖中文字也會變小'));
  for(const markup of Object.values(inline)){
    const root=markup.slice(0,markup.indexOf('>')+1);
    assert.match(root,/viewBox="0 0 [\d.]+ [\d.]+"/);
    assert.match(root,/preserveAspectRatio="xMidYMid meet"/);
    assert.doesNotMatch(root,/\s(?:width|height)=/);
  }
  for(const [file,pattern] of [
    ['AccessDiagram.svelte',/\.icon\{width:22px;height:22px/],
    ['DnsDiagram.svelte',/\.card svg\{width:24px;height:24px/],
    ['FtpDiagram.svelte',/\.endpoints svg\{width:42px;height:34px/],
    ['M0401Visual.svelte',/\.icon\{width:24px;height:24px/]
  ] as const)assert.match(readFileSync('src/lib/components/'+file,'utf8'),pattern);
});

test('existing source-image and MATLAB SVG renderers already preserve column-fit aspect ratio',()=>{
  const source=readFileSync('src/lib/components/SourceBody.svelte','utf8');
  assert.match(source,/\.original-image img\{display:block;width:100%;height:auto;max-width:100%\}/);
  const assets=new Set<string>();
  for(const lesson of allConceptTeachings)for(const lang of ['zh','en'] as const)
    for(const block of lesson.text[lang].sourceBody??[])if(block.kind==='sourceImage'&&block.src.endsWith('.svg'))assets.add('site'+block.src);
  assert.ok(assets.size>0);
  assets.add('site/courses/matlab-practice/images/area-grid.svg');
  for(const file of assets){
    const svg=readFileSync(file,'utf8');
    assert.match(svg,/<svg[^>]+viewBox="[^\"]+"/);
    assert.doesNotMatch(svg,/<svg[^>]+preserveAspectRatio="(?:none|[^\"]*slice)"/);
  }
  assert.match(readFileSync('site/style.css','utf8'),/figure img\{display:block;width:100%;height:auto;max-width:100%/);
  assert.match(readFileSync('site/courses/matlab-practice/case2.html','utf8'),/<img[^>]+src="images\/area-grid.svg"/);
});
