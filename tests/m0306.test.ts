import {spawnSync} from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createConceptCatalog,type SourceBlock} from '../src/lib/concepts.ts';
import {allConceptTeachings,concepts} from '../src/lib/server/catalog.ts';
const lesson=allConceptTeachings.find(t=>t.id==='M03-06')!;
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[];
test('M03-06 bilingual structure, source order, answers, searchable figures and next pending unit',()=>{
 assert.equal(lesson.contentVersion,'1.0.0');assert.equal(lesson.date,'2026-11-03');assert.equal(lesson.publishedOn,'2026-11-03');assert.deepEqual(lesson.qa,[]);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-11-03');
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='visual').length,2);assert.equal(body.filter(b=>b.kind==='answer').length,4);
  assert.deepEqual(body.filter(b=>b.kind==='answer').map(b=>b.id),['answer-ttl','answer-active-passive','answer-proxy','answer-confidence']);
  const text=body.flatMap(flatten).join('\n');let cursor=0;
  for(let line of readFileSync(`docs/sources/m03-06/M03-06-teaching.${suffix}.md`,'utf8').split('\n')){
   line=line.trim();if(!line||line.startsWith('```')||/^[| :\-]+$/.test(line))continue;
   const values=line.startsWith('|')?line.slice(1,-1).split(/(?<!\\)\|/):[line.replace(/^#{1,3} /,'')];
   for(let value of values){value=value.replaceAll('**','').trim();const at=text.indexOf(value,cursor);assert.ok(at>=0,`${lang}: ${value}`);cursor=at+value.length;}
  }
  const page=catalog.get('M03-06',lang)!;assert.equal(page.navigation.previous?.id,'M03-05');assert.equal(page.navigation.next?.id,'M03-07');assert.equal(page.navigation.next?.href,null);assert.equal(catalog.get('M03-07',lang),null);
  const search=catalog.searchEntries.find(e=>e.id==='M03-06'&&e.lang===lang)!;
  for(const b of body.filter(b=>b.kind==='answer'||b.kind==='visual'))for(const t of flatten(b))assert.ok(search.text.includes(t));
  assert.ok(!/Sentinel_|libfile_|sandbox:/.test(text));
 }
 const shape=(l:'zh'|'en')=>lesson.text[l].sourceBody!.filter(b=>['heading','table','answer','visual'].includes(b.kind)).map(b=>({kind:b.kind,id:'id'in b?b.id:undefined,rows:b.kind==='table'?b.rows.map(r=>r.length):undefined}));assert.deepEqual(shape('zh'),shape('en'));
});
test('M03-06 models, safe SVG, manuscript generation and reference answers are deterministic',()=>{
 for(const script of ['m0306_content.py','m0306_diagrams.py']){const r=spawnSync('python3',[`scripts/${script}`,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const body=lesson.text[lang].sourceBody!;
  for(const b of body.filter(b=>b.kind==='visual')){const svg=readFileSync('site'+b.src,'utf8');assert.ok(Buffer.byteLength(svg)<100000);assert.ok(svg.includes('viewBox=')&&svg.includes('<title')&&svg.includes('<desc'));assert.ok(!/<(?:script|foreignObject|image|use)\b|\bon\w+=|\bhref=/i.test(svg));}
  const answers=body.filter(b=>b.kind==='answer');const chunks=readFileSync(`docs/sources/m03-06/M03-06-answers.${suffix}.md`,'utf8').split('\n## ').slice(1);for(let i=0;i<chunks.length;i++){const [head,...paras]=chunks[i].trim().split('\n\n');assert.ok(head.startsWith(answers[i].id));assert.deepEqual(answers[i].paragraphs,paras);}
 }
});
