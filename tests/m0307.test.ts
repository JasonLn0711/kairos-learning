import {spawnSync} from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createConceptCatalog,type SourceBlock} from '../src/lib/concepts.ts';
import {allConceptTeachings,concepts} from '../src/lib/server/catalog.ts';
const lesson=allConceptTeachings.find(t=>t.id==='M03-07')!;
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[];
test('M03-07 bilingual structure, source order, answers, searchable figures and next pending unit',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.date,'2026-11-03');assert.equal(lesson.publishedOn,'2026-11-03');assert.deepEqual(lesson.qa,[]);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-11-03');
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='visual').length,4);assert.equal(body.filter(b=>b.kind==='answer').length,4);
  assert.deepEqual(body.filter(b=>b.kind==='answer').map(b=>b.id),['answer-scope','answer-discovery','answer-features','answer-comparison']);
  assert.equal(body.filter(b=>b.kind==='code').length,17);assert.deepEqual(body.filter(b=>b.kind==='visual').map(b=>b.visual.kind),['flow','cards','flow','cards']);
  const text=body.flatMap(flatten).join('\n');let cursor=0;
  for(let line of readFileSync(`docs/sources/m03-07/M03-07-teaching.${suffix}.md`,'utf8').split('\n')){
   line=line.trim();if(!line||line==='>'||line.startsWith('```')||/^[| :\-]+$/.test(line))continue;
   const values=line.startsWith('|')?line.slice(1,-1).split(/(?<!\\)\|/):[line.replace(/^#{1,3} /,'').replace(/^- /,'').replace(/^> ?/,'')];
   for(let value of values){value=value.replaceAll('**','').replaceAll('\\|','|').trim();const at=text.indexOf(value,cursor);assert.ok(at>=0,`${lang}: ${value}`);cursor=at+value.length;}
  }
  const page=catalog.get('M03-07',lang)!;assert.equal(page.navigation.previous?.id,'M03-06');assert.equal(page.navigation.next?.id,'M03-08');assert.equal(page.navigation.next?.href,null);assert.equal(catalog.get('M03-08',lang),null);
  const search=catalog.searchEntries.find(e=>e.id==='M03-07'&&e.lang===lang)!;
  for(const b of body.filter(b=>b.kind==='answer'||b.kind==='visual'))for(const t of flatten(b))assert.ok(search.text.includes(t));
  assert.ok(!/Sentinel_|libfile_|sandbox:/.test(text));
 }
 const shape=(l:'zh'|'en')=>lesson.text[l].sourceBody!.filter(b=>['heading','table','answer','visual'].includes(b.kind)).map(b=>({kind:b.kind,id:'id'in b?b.id:undefined,rows:b.kind==='table'?b.rows.map(r=>r.length):undefined}));assert.deepEqual(shape('zh'),shape('en'));
});
test('M03-07 models, safe SVG, manuscript generation and reference answers are deterministic',()=>{
 for(const script of ['m0307_content.py','m0307_diagrams.py']){const r=spawnSync('python3',[`scripts/${script}`,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const body=lesson.text[lang].sourceBody!;
  for(const b of body.filter(b=>b.kind==='visual')){const svg=readFileSync('site'+b.src,'utf8');assert.ok(Buffer.byteLength(svg)<100000);assert.ok(svg.includes('viewBox=')&&svg.includes('<title')&&svg.includes('<desc'));assert.ok(!/<(?:script|foreignObject|image|use)\b|\bon\w+=|\bhref=/i.test(svg));}
  const answers=body.filter(b=>b.kind==='answer');const chunks=readFileSync(`docs/sources/m03-07/M03-07-answers.${suffix}.md`,'utf8').split('\n## ').slice(1);for(let i=0;i<chunks.length;i++){const [head,...paras]=chunks[i].trim().split('\n\n');assert.ok(head.startsWith(answers[i].id));assert.deepEqual(answers[i].paragraphs,paras);}
 }
});


test('M03-07 retains the entire supplied manuscript with only declared editorial changes',()=>{
 const source=readFileSync('docs/sources/m03-07/supplied-2026-11-03.zh-TW.md','utf8');
 const changes=JSON.parse(readFileSync('docs/sources/m03-07/editorial-changes.json','utf8'));
 let expected=source;
 for(const {old:from,new:to} of changes){assert.ok(expected.includes(from),from);expected=expected.replaceAll(from,to);}
 const actual=readFileSync('docs/sources/m03-07/M03-07-teaching.zh-TW.md','utf8');
 assert.equal(actual.split('\n\n### 官方參考來源')[0],expected);
 const sections=JSON.parse(readFileSync('docs/sources/m03-07/detailed-section-map.json','utf8'));
 for(const lang of ['zh','en'] as const){
  assert.deepEqual(lesson.text[lang].sourceBody!.filter(b=>'id'in b&&b.id&&(b.kind==='heading'||b.kind==='paragraph')).map(b=>({id:'id'in b?b.id:undefined,text:'text'in b?b.text:''})),sections.map((s:any)=>({id:s.id,text:s[lang]})));
 }
});
