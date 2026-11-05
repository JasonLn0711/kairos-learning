import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {reviewedSvgMarkup} from '../src/lib/reviewed-svg.ts';
import svgLabels from '../src/lib/m0303-svg-labels.json' with {type:'json'};
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createConceptCatalog,type SourceBlock} from '../src/lib/concepts.ts';
import {allConceptTeachings,concepts} from '../src/lib/server/catalog.ts';
const lesson=allConceptTeachings.find(t=>t.id==='M03-03')!;
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text' in b?[b.text]:[];
test('M03-03 complete bilingual lesson, four diagrams, paired closed-answer data records and next linked unit',()=>{
 assert.equal(lesson.contentVersion,'1.1.1');assert.equal(lesson.revision,3);assert.deepEqual(lesson.qa,[]);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-11-03');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.ok(body.length>=40);
  assert.equal(body.filter(b=>b.kind==='heading'&&/^section-\d+$/.test(b.id??'')).length,10);
  assert.deepEqual(body.filter(b=>b.kind==='answer').map(b=>b.id),['answer-connect-syn','answer-udp-silence','answer-test-conditions','answer-application-check']);
  const text=body.flatMap(flatten).join('\n');
  for(const term of ['TCP','SYN','UDP'])assert.ok(text.toLowerCase().includes(term.toLowerCase()));
  assert.ok(!/Sentinel_|libfile_|CalpicoFile_|sandbox:|chatgpt-content-reference/.test(text));
  const page=catalog.get('M03-03',lang)!;
  assert.equal(page.navigation.previous?.id,'M03-02');assert.ok(page.navigation.previous?.href?.includes("/concepts/"));
  assert.equal(page.navigation.next?.id,'M03-04');assert.ok(page.navigation.next?.href?.includes("/concepts/"));
  assert.ok(catalog.get('M03-04',lang));
  const search=catalog.searchEntries.find(e=>e.id==='M03-03'&&e.lang===lang)!;
  for(const b of body.filter(b=>b.kind==='answer'))for(const p of b.paragraphs)assert.ok(search.text.includes(p));
 }
 const shape=(lang:'zh'|'en')=>lesson.text[lang].sourceBody!.filter(b=>b.kind==='heading'||b.kind==='answer'||b.kind==='visual'||b.kind==='table').map(b=>({kind:b.kind,id:'id'in b?b.id:undefined,rows:b.kind==='table'?b.rows.map(r=>r.length):undefined}));
 assert.deepEqual(shape('zh'),shape('en'));
});
test('M03-03 source teaching text is retained in order with formatting-only normalization',()=>{
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const text=lesson.text[lang].sourceBody!.flatMap(flatten).join('\n');let cursor=0;
  for(let line of readFileSync(`docs/sources/m03-03/M03-03-teaching.${suffix}.md`,'utf8').split('\n')){
   line=line.trim();if(!line||line.startsWith('```')||line.startsWith('![')||/^[| :\-]+$/.test(line))continue;
   const values=line.startsWith('|')?line.slice(1,-1).split(/(?<!\\)\|/).map(v=>v.replaceAll('\\|','|')):[line.replace(/^#{1,3} /,'').replace(/^- /,'')];
   for(let value of values){value=value.replaceAll('**','').trim();const at=text.indexOf(value,cursor);assert.ok(at>=0,`${lang}: missing or reordered ${value}`);cursor=at+value.length;}
  }
 }
});

test('M03-03 reviewed inline bundle and search labels match deterministic allowlisted assets',()=>{
 const result=spawnSync('python3',['scripts/m0303_svg.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-11-03');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='visual').length,4);
  for(const b of body.filter(b=>b.kind==='visual')){
   const svg=readFileSync('site'+b.src,'utf8');assert.equal(reviewedSvgMarkup(b.src),svg);assert.ok(Buffer.byteLength(svg)<100000);
   assert.ok(!/<(?:script|foreignObject|image|use)\b|\bon\w+=|\bhref=/i.test(svg));
  }
  const search=catalog.searchEntries.find(e=>e.id==='M03-03'&&e.lang===lang)!;
  for(const label of svgLabels[lang])assert.ok(search.text.includes(label));
 }
});

test('M03-03 reference answers preserve the paired source documents',()=>{
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const answers=lesson.text[lang].sourceBody!.filter(b=>b.kind==='answer');
  const source=readFileSync(`docs/sources/m03-03/M03-03-answers.${suffix}.md`,'utf8');
  const parts=source.split('\n## ').slice(1);assert.equal(parts.length,answers.length);
  for(let i=0;i<parts.length;i++){const [heading,...paragraphs]=parts[i].trim().split('\n\n');assert.ok(heading.startsWith(answers[i].id));assert.deepEqual(answers[i].paragraphs,paragraphs);}
 }
});

test('M03-03 constrained scan model keeps bilingual packet directions and all states',()=>{
 const r=spawnSync('python3',['scripts/m0303_diagrams.py','--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
 const models=JSON.parse(readFileSync('src/lib/m0303-scan-diagrams.json','utf8'));assert.equal(Object.keys(models).length,8);
 for(const lang of ['zh','en']){
  const get=(name:string)=>models[`/images/ceh/m03-03-${name}-${lang}.svg`];
  for(const name of ['01-connect-flow','02-syn-flow']) assert.deepEqual(get(name).rows.map((r:any)=>r.direction),['right','left','right']);
  assert.equal(get('01-connect-flow').rows[2].title,'ACK');assert.equal(get('02-syn-flow').rows[2].title,'RST');
  assert.deepEqual(get('03-udp-responses').rows.map((r:any)=>r.title),['open','closed','filtered','open|filtered']);
  assert.equal(get('05-scan-positions').rows.length,3);
 }
});
test('M03-03 original teaching archive and supplied material remain separately available',()=>{
 const original=JSON.parse(readFileSync('docs/sources/m03-03/archive-v1.0.0/m03-03.json','utf8'));
 assert.equal(original.contentVersion,'1.0.0');assert.equal(original.revision,1);
 const source=readFileSync('docs/sources/m03-03/supplied-2026-11-03/teaching-original.txt','utf8');assert.ok(source.includes('sock.sendto(b"OK", addr)'));
 for(const lang of ['zh','en'] as const){const text=lesson.text[lang].sourceBody!.flatMap(flatten).join('\n');for(const term of ['--max-rate 10','127.0.0.1','sock.sendto(b"OK", addr)','connect()','open|filtered'])assert.ok(text.includes(term));}
});
