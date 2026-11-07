import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {reviewedSvgMarkup} from '../src/lib/reviewed-svg.ts';
import svgLabels from '../src/lib/m0304-svg-labels.json' with {type:'json'};
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createConceptCatalog,type SourceBlock} from '../src/lib/concepts.ts';
import {allConceptTeachings,concepts} from '../src/lib/server/catalog.ts';
const lesson=allConceptTeachings.find(t=>t.id==='M03-04')!;
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text' in b?[b.text]:[];
test('M03-04 complete bilingual lesson, four diagrams, paired closed-answer data records and next linked unit',()=>{
 assert.equal(lesson.contentVersion,'1.1.2');assert.equal(lesson.revision,4);assert.deepEqual(lesson.qa,[]);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-11-03');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.ok(body.length>=40);
  assert.equal(body.filter(b=>b.kind==='heading'&&/^section-\d+$/.test(b.id??'')).length,10);
  assert.deepEqual(body.filter(b=>b.kind==='answer').map(b=>b.id),['answer-response-states','answer-udp-uncertainty','answer-observation-location','answer-ack-followup','answer-report-fields']);
  const text=body.flatMap(flatten).join('\n');
  for(const term of ['open','closed','filtered'])assert.ok(text.toLowerCase().includes(term.toLowerCase()));
  assert.ok(!/Sentinel_|libfile_|CalpicoFile_|sandbox:|chatgpt-content-reference/.test(text));
  const page=catalog.get('M03-04',lang)!;
  assert.equal(page.navigation.previous?.id,'M03-03');assert.ok(page.navigation.previous?.href?.includes("/concepts/"));
  assert.equal(page.navigation.next?.id,'M03-05');assert.ok(page.navigation.next?.href?.includes('/concepts/'));
  assert.ok(catalog.get('M03-05',lang));
  const search=catalog.searchEntries.find(e=>e.id==='M03-04'&&e.lang===lang)!;
  for(const b of body.filter(b=>b.kind==='answer'))for(const p of b.paragraphs)assert.ok(search.text.includes(p));
 }
 const shape=(lang:'zh'|'en')=>lesson.text[lang].sourceBody!.filter(b=>b.kind==='heading'||b.kind==='answer'||b.kind==='visual'||b.kind==='table').map(b=>({kind:b.kind,id:'id'in b?b.id:undefined,rows:b.kind==='table'?b.rows.map(r=>r.length):undefined}));
 assert.deepEqual(shape('zh'),shape('en'));
});
test('M03-04 source teaching text is retained in order with formatting-only normalization',()=>{
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const text=lesson.text[lang].sourceBody!.flatMap(flatten).join('\n');let cursor=0;
  const lines=readFileSync(`docs/sources/m03-04/M03-04-teaching.${suffix}.md`,'utf8').split('\n');
  for(let i=0;i<lines.length;i++){
   let line=lines[i].trim();
   if(!line||line.startsWith('![')||/^[| :\-]+$/.test(line))continue;
   let values:string[];
   if(line.startsWith('```')){
    const code:string[]=[];while(++i<lines.length&&!lines[i].startsWith('```'))code.push(lines[i]);
    values=[code.join('\n')];
   }else values=line.startsWith('|')?line.slice(1,-1).split(/(?<!\\)\|/).map(s=>s.replaceAll('\\|','|')):[line.replace(/^#{1,3} /,'').replace(/^(?:- |> )/,'')];
   for(let value of values){value=value.replaceAll('**','').trim();const at=text.indexOf(value,cursor);assert.ok(at>=0,`${lang}: missing or reordered ${value}`);cursor=at+value.length;}
  }
 }
});

test('M03-04 reviewed inline bundle and search labels match deterministic allowlisted assets',()=>{
 const result=spawnSync('python3',['scripts/m0304_svg.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-11-03');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='visual').length,4);
  for(const b of body.filter(b=>b.kind==='visual')){
   const svg=readFileSync('site'+b.src,'utf8');assert.equal(reviewedSvgMarkup(b.src),svg);assert.ok(Buffer.byteLength(svg)<100000);
   assert.ok(!/<(?:script|foreignObject|image|use)\b|\bon\w+=|\bhref=/i.test(svg));
  }
  const search=catalog.searchEntries.find(e=>e.id==='M03-04'&&e.lang===lang)!;
  for(const label of svgLabels[lang])assert.ok(search.text.includes(label));
 }
});

test('M03-04 reference answers preserve the paired source documents',()=>{
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const answers=lesson.text[lang].sourceBody!.filter(b=>b.kind==='answer');
  const source=readFileSync(`docs/sources/m03-04/M03-04-answers.${suffix}.md`,'utf8');
  const parts=source.split('\n## ').slice(1);assert.equal(parts.length,answers.length);
  for(let i=0;i<parts.length;i++){const [heading,...paragraphs]=parts[i].trim().split('\n\n');assert.ok(heading.startsWith(answers[i].id));assert.deepEqual(answers[i].paragraphs,paragraphs);}
 }
});

test('M03-04 SVG labels stay at or below inherited body size',()=>{
 const component=readFileSync('src/lib/components/ReviewedSvgVisual.svelte','utf8');
 assert.ok(component.includes('.diagram-canvas.compact-text{width:min(100%,33.333333em)}'));
 for(const lang of ['zh','en'] as const)for(const b of lesson.text[lang].sourceBody!.filter(b=>b.kind==='visual')){
  const svg=readFileSync('site'+b.src,'utf8');const sizes=[...svg.matchAll(/font-size="([0-9.]+)"/g)].map(m=>Number(m[1]));
  assert.equal(Math.max(...sizes),18);assert.ok(/viewBox="0 0 600 (700|750)"/.test(svg));assert.ok(33.333333*18/600<=1);
 }
});




test('M03-04 HTML/SVG sources share one constrained bilingual model',()=>{
 const r=spawnSync('python3',['scripts/m0304_diagrams.py','--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
 const models=JSON.parse(readFileSync('docs/sources/m03-04/diagram-models.json','utf8'));assert.equal(Object.keys(models).length,8);
 for(const m of Object.values(models) as any[]){assert.equal(m.nodes.length,4);assert.equal(typeof m.flow,'boolean');for(const n of m.nodes)assert.equal(n.body.length,2);}
});

test('M03-04 escaped pipes remain one table cell with complete state tokens',()=>{
 for(const lang of ['zh','en'] as const){const tables=lesson.text[lang].sourceBody!.filter(b=>b.kind==='table');assert.equal(tables.length,15);for(const t of tables)for(const row of t.rows)assert.equal(row.length,t.headers.length);assert.ok(tables.flatMap(t=>t.rows.flat()).some(s=>s.toLowerCase()==='open|filtered'));assert.ok(!tables.flatMap(t=>t.rows.flat()).some(t=>t.includes('\\|')));}
});

test('M03-04 replacement retains original diagrams and covers supplied evidence distinctions',()=>{
 const root='docs/sources/m03-04/supplied-2026-11-03/';
 const hashes=JSON.parse(readFileSync(root+'preserved-figures.sha256.json','utf8'));
 for(const [path,hash] of Object.entries(hashes))assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'),hash,path);
 const source=JSON.parse(readFileSync(root+'source.sha256.json','utf8'));
 assert.equal(createHash('sha256').update(readFileSync(root+'teaching-original.txt')).digest('hex'),source['teaching-original.txt']);
 const old=JSON.parse(readFileSync('docs/sources/m03-04/archive-v1.0.0/m03-04.json','utf8'));
 assert.equal(lesson.publishedOn,old.publishedOn);
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;
  assert.deepEqual(body.filter(b=>b.kind==='visual'),old.text[lang].sourceBody.filter((b:SourceBlock)=>b.kind==='visual'));
  const text=body.flatMap(flatten).join('\n');
  for(const term of ['open|filtered','closed|filtered','unfiltered','--reason','ss -lnt','127.0.0.1:8443','0.0.0.0:8443','2026-11-03 10:30 UTC+08:00','dig @192.0.2.53 example.com A','TCP','UDP'])assert.ok(text.toLowerCase().includes(term.toLowerCase()),term);
  for(let i=1;i<=5;i++)assert.ok(body.some(b=>'id' in b&&b.id===`section-10-${i}`));
 }
});


test('M03-04 retains every supplied subsection and full Chinese source with only listed corrections',()=>{
 const root='docs/sources/m03-04/';
 let expected=readFileSync(root+'supplied-2026-11-03/teaching-original.txt','utf8');
 for(const [before,after] of JSON.parse(readFileSync(root+'detailed-editorial-changes.json','utf8'))){assert.ok(expected.includes(before));expected=expected.replaceAll(before,after);}
 assert.equal(readFileSync(root+'M03-04-teaching.zh-TW.md','utf8'),expected);
 const map=JSON.parse(readFileSync(root+'detailed-section-map.json','utf8'));
 const sourceHeadings=[...expected.matchAll(/^#{1,3} (.+)$/gm)].slice(1).map(m=>m[1]);
 assert.equal(map.length,64);assert.deepEqual(map.map((s:any)=>s.zh),sourceHeadings);
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;
  assert.deepEqual(body.filter(b=>b.kind==='heading'||b.kind==='paragraph'&&b.id).map(b=>({id:'id'in b?b.id:undefined,text:'text'in b?b.text:''})),map.map((s:any)=>({id:s.id,text:s[lang]})));
  for(const section of map){const index=body.findIndex(b=>'id'in b&&b.id===section.id);assert.ok(index>=0);const end=body.findIndex((b,i)=>i>index&&(b.kind==='heading'||b.kind==='paragraph')&&!!b.id&&!b.id.startsWith(section.id+'-'));const segment=body.slice(index+1,end<0?undefined:end);assert.ok(segment.some(b=>b.kind==='code'||b.kind==='table'||b.kind==='list'||b.kind==='paragraph'&&!b.id),section.id+' requires explanatory content');}
  const sourceCodes=[...readFileSync(root+`M03-04-teaching.${lang==='zh'?'zh-TW':'en'}.md`,'utf8').matchAll(/```[^\n]*\n([\s\S]*?)\n```/g)].map(m=>m[1]);
  assert.equal(sourceCodes.length,33);assert.deepEqual(body.flatMap(b=>b.kind==='code'?[b.text]:[]),sourceCodes);
 }
});
