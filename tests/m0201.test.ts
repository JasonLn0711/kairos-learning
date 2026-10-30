import {spawnSync} from 'node:child_process';
import {reviewedSvgMarkup} from '../src/lib/reviewed-svg.ts';
import svgLabels from '../src/lib/m0201-svg-labels.json' with {type:'json'};
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createConceptCatalog,type SourceBlock} from '../src/lib/concepts.ts';
import {allConceptTeachings,concepts} from '../src/lib/server/catalog.ts';
const lesson=allConceptTeachings.find(t=>t.id==='M02-01')!;
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text' in b?[b.text]:[];
test('M02-01 complete bilingual lesson, four diagrams, four closed-answer data records and next published unit',()=>{
 assert.equal(lesson.contentVersion,'1.0.0');assert.equal(lesson.revision,1);assert.deepEqual(lesson.qa,[]);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-10-30');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.ok(body.length>=45);
  assert.equal(body.filter(b=>b.kind==='heading').length,8);
  assert.deepEqual(body.filter(b=>b.kind==='answer').map(b=>b.id),['answer-paths','answer-dns','answer-evidence','answer-scope']);
  const text=body.flatMap(flatten).join('\n');
  for(const term of ['DNS','OSINT','coffee.example'])assert.ok(text.includes(term));
  assert.ok(!/Sentinel_|libfile_|CalpicoFile_|sandbox:|chatgpt-content-reference/.test(text));
  const page=catalog.get('M02-01',lang)!;
  assert.equal(page.navigation.previous?.id,'M09-06');assert.ok(page.navigation.previous?.href);
  assert.equal(page.navigation.next?.id,'M02-02');assert.ok(page.navigation.next?.href);
  assert.ok(catalog.get('M02-02',lang));
  const search=catalog.searchEntries.find(e=>e.id==='M02-01'&&e.lang===lang)!;
  for(const b of body.filter(b=>b.kind==='answer'))for(const p of b.paragraphs)assert.ok(search.text.includes(p));
 }
 const shape=(lang:'zh'|'en')=>lesson.text[lang].sourceBody!.filter(b=>b.kind==='heading'||b.kind==='answer'||b.kind==='visual'||b.kind==='table').map(b=>({kind:b.kind,id:'id'in b?b.id:undefined,rows:b.kind==='table'?b.rows.map(r=>r.length):undefined}));
 assert.deepEqual(shape('zh'),shape('en'));
});
test('M02-01 source teaching text is retained in order with formatting-only normalization',()=>{
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const text=lesson.text[lang].sourceBody!.flatMap(flatten).join('\n');let cursor=0;
  for(let line of readFileSync(`docs/sources/m02-01/M02-01-teaching.${suffix}.md`,'utf8').split('\n')){
   line=line.trim();if(!line||line.startsWith('![')||/^[| :\-]+$/.test(line))continue;
   const values=line.startsWith('|')?line.slice(1,-1).split('|'):[line.replace(/^#{1,3} /,'').replace(/^- /,'')];
   for(let value of values){value=value.replaceAll('**','').trim();const at=text.indexOf(value,cursor);assert.ok(at>=0,`${lang}: missing or reordered ${value}`);cursor=at+value.length;}
  }
 }
});

test('M02-01 reviewed inline bundle and search labels match deterministic allowlisted assets',()=>{
 const result=spawnSync('python3',['scripts/m0201_svg.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-10-30');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='visual').length,4);
  for(const b of body.filter(b=>b.kind==='visual')){
   const svg=readFileSync('site'+b.src,'utf8');assert.equal(reviewedSvgMarkup(b.src),svg);assert.ok(Buffer.byteLength(svg)<100000);
   assert.ok(!/<(?:script|foreignObject|image|use)\b|\bon\w+=|\bhref=/i.test(svg));
  }
  const search=catalog.searchEntries.find(e=>e.id==='M02-01'&&e.lang===lang)!;
  for(const label of svgLabels[lang])assert.ok(search.text.includes(label));
 }
});

test('M02-01 caps largest SVG text at inherited body size and shrinks below the cap',()=>{
 const c=readFileSync('src/lib/components/ReviewedSvgVisual.svelte','utf8');
 assert.ok(c.includes('width:min(100%,23.076923em)'));
 assert.ok(c.includes('class:body-sized={block.src.startsWith("/images/ceh/m02-01-") || block.src.startsWith("/images/ceh/m02-02-")}'));
 for(const lang of ['zh','en'] as const)for(const b of lesson.text[lang].sourceBody!.filter(b=>b.kind==='visual')){
  const svg=readFileSync('site'+b.src,'utf8');const fonts=[...svg.matchAll(/font-size="([0-9.]+)"/g)].map(m=>Number(m[1]));
  assert.equal(Math.max(...fonts),26);assert.ok(svg.includes('viewBox="0 0 600 765"'));
  assert.ok(23.076923*26/600<=1);
 }
});
