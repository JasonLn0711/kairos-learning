import {spawnSync} from 'node:child_process';
import {reviewedSvgMarkup} from '../src/lib/reviewed-svg.ts';
import svgLabels from '../src/lib/m0203-svg-labels.json' with {type:'json'};
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createConceptCatalog,type SourceBlock} from '../src/lib/concepts.ts';
import {allConceptTeachings,concepts} from '../src/lib/server/catalog.ts';
const lesson=allConceptTeachings.find(t=>t.id==='M02-03')!;
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text' in b?[b.text]:[];
test('M02-03 complete bilingual lesson, four diagrams, four closed-answer data records and next linked unit',()=>{
 assert.equal(lesson.contentVersion,'1.0.1');assert.equal(lesson.revision,1);assert.deepEqual(lesson.qa,[]);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-10-31');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.ok(body.length>=40);
  assert.equal(body.filter(b=>b.kind==='heading').length,9);
  assert.deepEqual(body.filter(b=>b.kind==='answer').map(b=>b.id),['answer-1']);
  const text=body.flatMap(flatten).join('\n');
  for(const term of ['robots.txt','noindex','coffee.example'])assert.ok(text.includes(term));
  assert.ok(!/Sentinel_|libfile_|CalpicoFile_|sandbox:|chatgpt-content-reference/.test(text));
  const page=catalog.get('M02-03',lang)!;
  assert.equal(page.navigation.previous?.id,'M02-02');assert.ok(page.navigation.previous?.href);
  assert.equal(page.navigation.next?.id,'M02-04');assert.equal(page.navigation.next?.href,null);
  assert.equal(catalog.get('M02-04',lang),null);
  const search=catalog.searchEntries.find(e=>e.id==='M02-03'&&e.lang===lang)!;
  for(const b of body.filter(b=>b.kind==='answer'))for(const p of b.paragraphs)assert.ok(search.text.includes(p));
 }
 const shape=(lang:'zh'|'en')=>lesson.text[lang].sourceBody!.filter(b=>b.kind==='heading'||b.kind==='answer'||b.kind==='visual'||b.kind==='table').map(b=>({kind:b.kind,id:'id'in b?b.id:undefined,rows:b.kind==='table'?b.rows.map(r=>r.length):undefined}));
 assert.deepEqual(shape('zh'),shape('en'));
});
test('M02-03 source teaching text is retained in order with formatting-only normalization',()=>{
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const text=lesson.text[lang].sourceBody!.flatMap(flatten).join('\n');let cursor=0;
  for(let line of readFileSync(`docs/sources/m02-03/M02-03-teaching.${suffix}.md`,'utf8').split('\n')){
   line=line.trim();if(!line||line.startsWith('![')||/^[| :\-]+$/.test(line))continue;
   const values=line.startsWith('|')?line.slice(1,-1).split('|'):[line.replace(/^#{1,3} /,'').replace(/^- /,'')];
   for(let value of values){value=value.replaceAll('**','').trim();const at=text.indexOf(value,cursor);assert.ok(at>=0,`${lang}: missing or reordered ${value}`);cursor=at+value.length;}
  }
 }
});

test('M02-03 reviewed inline bundle and search labels match deterministic allowlisted assets',()=>{
 const result=spawnSync('python3',['scripts/m0203_svg.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-10-31');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='visual').length,4);
  for(const b of body.filter(b=>b.kind==='visual')){
   const svg=readFileSync('site'+b.src,'utf8');assert.equal(reviewedSvgMarkup(b.src),svg);assert.ok(Buffer.byteLength(svg)<100000);
   assert.ok(!/<(?:script|foreignObject|image|use)\b|\bon\w+=|\bhref=/i.test(svg));
  }
  const search=catalog.searchEntries.find(e=>e.id==='M02-03'&&e.lang===lang)!;
  for(const label of svgLabels[lang])assert.ok(search.text.includes(label));
 }
});

test('M02-03 reference answers preserve the paired source documents',()=>{
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const answers=lesson.text[lang].sourceBody!.filter(b=>b.kind==='answer');
  const source=readFileSync(`docs/sources/m02-03/M02-03-answers.${suffix}.md`,'utf8');
  const parts=source.split('\n## ').slice(1);assert.equal(parts.length,answers.length);
  for(let i=0;i<parts.length;i++){const [heading,...paragraphs]=parts[i].trim().split('\n\n');assert.ok(heading.startsWith(answers[i].id));assert.deepEqual(answers[i].paragraphs,paragraphs);}
 }
});

test('M02-03 SVG labels stay at or below inherited body size',()=>{
 const component=readFileSync('src/lib/components/ReviewedSvgVisual.svelte','utf8');
 assert.ok(component.includes('.diagram-canvas.compact-text{width:min(100%,33.333333em)}'));
 for(const lang of ['zh','en'] as const)for(const b of lesson.text[lang].sourceBody!.filter(b=>b.kind==='visual')){
  const svg=readFileSync('site'+b.src,'utf8');const sizes=[...svg.matchAll(/font-size="([0-9.]+)"/g)].map(m=>Number(m[1]));
  assert.equal(Math.max(...sizes),18);assert.ok(svg.includes('viewBox="0 0 600 640"'));assert.ok(33.333333*18/600<=1);
 }
});
