import {spawnSync} from 'node:child_process';
import {reviewedSvgMarkup} from '../src/lib/reviewed-svg.ts';
import svgLabels from '../src/lib/m0906-svg-labels.json' with {type:'json'};
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createConceptCatalog,type SourceBlock} from '../src/lib/concepts.ts';
import {allConceptTeachings,concepts} from '../src/lib/server/catalog.ts';
const lesson=allConceptTeachings.find(t=>t.id==='M09-06')!;
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text' in b?[b.text]:[];
test('M09-06 complete bilingual lesson, four diagrams, three closed-answer data records and next pending unit',()=>{
 assert.equal(lesson.contentVersion,'1.0.0');assert.equal(lesson.revision,1);assert.deepEqual(lesson.qa,[]);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-10-30');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.ok(body.length>=60);
  assert.equal(body.filter(b=>b.kind==='heading').length,8);
  assert.deepEqual(body.filter(b=>b.kind==='answer').map(b=>b.id),['answer-boundary','answer-evidence','answer-response']);
  const text=body.flatMap(flatten).join('\n');
  for(const term of ['DMARC','WebAuthn','Northstar'])assert.ok(text.includes(term));
  assert.ok(!/Sentinel_|libfile_|CalpicoFile_|sandbox:|chatgpt-content-reference/.test(text));
  const page=catalog.get('M09-06',lang)!;
  assert.equal(page.navigation.previous?.id,'M09-05');assert.ok(page.navigation.previous?.href);
  assert.equal(page.navigation.next?.id,'M02-01');assert.ok(page.navigation.next?.href);
  assert.ok(catalog.get('M02-01',lang));
  const search=catalog.searchEntries.find(e=>e.id==='M09-06'&&e.lang===lang)!;
  for(const b of body.filter(b=>b.kind==='answer'))for(const p of b.paragraphs)assert.ok(search.text.includes(p));
 }
 const shape=(lang:'zh'|'en')=>lesson.text[lang].sourceBody!.filter(b=>b.kind==='heading'||b.kind==='answer'||b.kind==='visual'||b.kind==='table').map(b=>({kind:b.kind,id:'id'in b?b.id:undefined,rows:b.kind==='table'?b.rows.map(r=>r.length):undefined}));
 assert.deepEqual(shape('zh'),shape('en'));
});
test('M09-06 source teaching text is retained in order with formatting-only normalization',()=>{
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const text=lesson.text[lang].sourceBody!.flatMap(flatten).join('\n');let cursor=0;
  for(let line of readFileSync(`docs/sources/m09-06/M09-06-teaching.${suffix}.md`,'utf8').split('\n')){
   line=line.trim();if(!line||line.startsWith('![')||/^[| :\-]+$/.test(line))continue;
   const values=line.startsWith('|')?line.slice(1,-1).split('|'):[line.replace(/^#{1,3} /,'').replace(/^- /,'')];
   for(let value of values){value=value.replaceAll('**','').trim();const at=text.indexOf(value,cursor);assert.ok(at>=0,`${lang}: missing or reordered ${value}`);cursor=at+value.length;}
  }
 }
});

test('M09-06 reviewed inline bundle and search labels match deterministic allowlisted assets',()=>{
 const result=spawnSync('python3',['scripts/m0906_svg.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-10-30');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='visual').length,4);
  for(const b of body.filter(b=>b.kind==='visual')){
   const svg=readFileSync('site'+b.src,'utf8');assert.equal(reviewedSvgMarkup(b.src),svg);assert.ok(Buffer.byteLength(svg)<100000);
   assert.ok(!/<(?:script|foreignObject|image|use)\b|\bon\w+=|\bhref=/i.test(svg));
  }
  const search=catalog.searchEntries.find(e=>e.id==='M09-06'&&e.lang===lang)!;
  for(const label of svgLabels[lang])assert.ok(search.text.includes(label));
 }
});
