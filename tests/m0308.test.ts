import {spawnSync} from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createConceptCatalog,type SourceBlock} from '../src/lib/concepts.ts';
import {allConceptTeachings,concepts} from '../src/lib/server/catalog.ts';
const lesson=allConceptTeachings.find(t=>t.id==='M03-08')!;
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[];
test('M03-08 bilingual structure, source order, answers, searchable figures and next pending unit',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.date,'2026-11-04');assert.equal(lesson.publishedOn,'2026-11-04');assert.deepEqual(lesson.qa,[]);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-11-04');
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='visual').length,2);assert.equal(body.filter(b=>b.kind==='answer').length,4);
  assert.equal(body.filter(b=>b.kind==='heading').length,11);
  for(const b of body.filter(b=>b.kind==='visual'))assert.equal(b.visual.items.length,5);
  assert.deepEqual(body.filter(b=>b.kind==='answer').map(b=>b.id),['answer-blocking','answer-viewpoint','answer-visibility','answer-exception']);
  assert.ok(body.filter(b=>b.kind==='code').length>20);assert.deepEqual(body.filter(b=>b.kind==='visual').map(b=>b.visual.kind),['cards','cards']);
  const text=body.flatMap(flatten).join('\n');let cursor=0;
  for(let line of readFileSync(`docs/sources/m03-08/M03-08-teaching.${suffix}.md`,'utf8').split('\n')){
   line=line.trim();if(!line||line==='>'||line.startsWith('```')||/^[| :\-]+$/.test(line))continue;
   const values=line.startsWith('|')?line.slice(1,-1).split(/(?<!\\)\|/):[line.replace(/^#{1,3} /,'').replace(/^- /,'').replace(/^> ?/,'')];
   for(let value of values){value=value.replaceAll('**','').replaceAll('\\|','|').trim();const at=text.indexOf(value,cursor);assert.ok(at>=0,`${lang}: ${value}`);cursor=at+value.length;}
  }
  const page=catalog.get('M03-08',lang)!;assert.equal(page.navigation.previous?.id,'M03-07');assert.equal(page.navigation.next?.id,'CEH26-M04-C01');assert.ok(page.navigation.next?.href?.endsWith('/m04/concepts/m04-01/'));
  const search=catalog.searchEntries.find(e=>e.id==='M03-08'&&e.lang===lang)!;
  for(const b of body.filter(b=>b.kind==='answer'||b.kind==='visual'))for(const t of flatten(b))assert.ok(search.text.includes(t));
  assert.ok(!/Sentinel_|libfile_|sandbox:/.test(text));
 }
 const shape=(l:'zh'|'en')=>lesson.text[l].sourceBody!.filter(b=>['heading','table','answer','visual'].includes(b.kind)).map(b=>({kind:b.kind,id:'id'in b?b.id:undefined,rows:b.kind==='table'?b.rows.map(r=>r.length):undefined}));assert.deepEqual(shape('zh'),shape('en'));
});
test('M03-08 models, safe SVG, manuscript generation and reference answers are deterministic',()=>{
 for(const script of ['m0308_content.py','m0308_diagrams.py']){const r=spawnSync('python3',[`scripts/${script}`,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const body=lesson.text[lang].sourceBody!;
  for(const b of body.filter(b=>b.kind==='visual')){const svg=readFileSync('site'+b.src,'utf8');assert.ok(Buffer.byteLength(svg)<100000);assert.ok(svg.includes('viewBox=')&&svg.includes('<title')&&svg.includes('<desc'));assert.ok(!/<(?:script|foreignObject|image|use)\b|\bon\w+=|\bhref=/i.test(svg));}
  const answers=body.filter(b=>b.kind==='answer');const chunks=readFileSync(`docs/sources/m03-08/M03-08-answers.${suffix}.md`,'utf8').split('\n## ').slice(1);for(let i=0;i<chunks.length;i++){const [head,...paras]=chunks[i].trim().split('\n\n');assert.ok(head.startsWith(answers[i].id));assert.deepEqual(answers[i].paragraphs,paras);}
 }
});

test('M03-08 supplied text and images stay byte-exact; prior edition stays recoverable',()=>{
 const dir='docs/sources/m03-08/supplied-2026-11-04/';
 const manifest=JSON.parse(readFileSync(dir+'manifest.json','utf8'));
 assert.deepEqual(Object.keys(manifest).sort(),['image-1.png','image-2.png','pasted-text-1.txt']);
 for(const [name,hash] of Object.entries(manifest))assert.equal(createHash('sha256').update(readFileSync(dir+name)).digest('hex'),hash);
 const old=JSON.parse(readFileSync('docs/sources/m03-08/archive-v1.0.0/concept.json','utf8'));
 assert.equal(old.contentVersion,'1.0.0');assert.equal(old.publishedOn,lesson.publishedOn);
});
