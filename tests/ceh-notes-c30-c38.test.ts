import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {isDeepStrictEqual} from 'node:util';
import {createNotesCatalog,noteBodyText} from '../src/lib/ceh-notes.ts';
const directory='docs/sources/ceh-notes/2026-11-12/c30-c38-supplement/';
const read=(name:string)=>JSON.parse(readFileSync(directory+name,'utf8'));
const current=()=>JSON.parse(readFileSync('content/ceh-notes/2026-11-12.json','utf8'));

test('C30–C38 preserve the exact source manuscript, four PNGs and preceding note snapshot',()=>{
 const manifest=read('sha256-manifest.json');assert.equal(manifest.length,5);
 assert.equal(manifest.filter((r:any)=>r.file.endsWith('.png')).length,4);
 for(const entry of [...manifest,read('before-note.sha256.json')]){
  const bytes=readFileSync(directory+entry.file);
  assert.equal(bytes.length,entry.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256,entry.file);
  if(entry.file.endsWith('.png'))assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10]);
 }
 const note=current();assert.deepEqual(note.parts.slice(0,3),read('before-note.json').parts);
 assert.equal(note.contentVersion,'1.1.0');assert.equal(note.revision,2);assert.equal(note.expectedParts,4);
});

test('every source unit and nonempty line is adopted or explicitly identified as interface text',()=>{
 const units=read('source-units.json'),mapping=read('adoption-map.json'),lines=read('line-map.json');
 const source=readFileSync(directory+'pasted-text-1.txt','utf8').split(/\r?\n/);if(source.at(-1)==='')source.pop();
 assert.equal(units.length,420);assert.equal(lines.length,source.length);
 const covered=mapping.flatMap((m:any)=>Array.from({length:m.sourceUnits[1]-m.sourceUnits[0]+1},(_,i)=>i+m.sourceUnits[0]));
 assert.deepEqual(covered.toSorted((a:number,b:number)=>a-b),units.map((u:any)=>u.unit));
 for(const [i,line] of source.entries()){
  assert.equal(lines[i].line,i+1);
  assert.equal(lines[i].decision==='blank-separator',!line.trim());
 }
 for(const entry of mapping.filter((m:any)=>m.decision==='source-interface-only')){
  const i=entry.sourceUnits[0],text=units[i].zh;
  assert.ok(text.startsWith('[image](')||units[i-1]?.zh.startsWith('[image](')||text==='CEH-Day01-A-2026-11-12(1).md',text);
 }
 assert.equal(read('chapter-map.json').length,58,'16 chapters plus 42 subsections');
});

test('complete paired teaching enters part 4 with all tables, source questions and searchable mechanisms',()=>{
 const note=current(),part=note.parts.find((p:any)=>p.number===4),adopted=read('adopted.json');
 assert.ok(part,'global reconstruction must include part 4 before running public-note checks');
 assert.ok(isDeepStrictEqual(part,adopted),'public part 4 differs from adopted source artifacts; rerun the global reconstruction');
 const catalog=createNotesCatalog([note],'2026-11-12');
 const models=read('diagrams.json').diagrams;
 for(const lang of ['zh','en']){
  const sections=part.text[lang].sections,blocks=sections.flatMap((s:any)=>s.body);
  assert.equal(sections.length,16);assert.equal(blocks.length,318);
  for(const [kind,count] of [['heading',42],['table',18],['list',11],['diagram',4],['code',2]])assert.equal(blocks.filter((b:any)=>b.kind===kind).length,count);
  assert.equal(blocks.filter((b:any)=>['answer','checks','recall'].includes(b.kind)).length,0);
  for(const section of sections){
   assert.ok(section.id.startsWith('p4-soc-'));
   for(const block of section.body){
    if(block.id)assert.ok(block.id.startsWith('p4-soc-'));
    for(const text of noteBodyText(block)){
     assert.ok(text.trim());assert.ok(!/utm_source=|google\.com\/s2\/favicons|CEH-Day01-A-2026-11-12\(1\)\.md|`|\\(?:text|times|not|Rightarrow)/.test(text),text);
    }
   }
  }
  const questions=sections.at(-1).body.filter((b:any)=>b.kind==='paragraph'&&/^\d\. /.test(b.text));
  assert.deepEqual(questions.map((q:any)=>q.text[0]),['1','2','3','4','5','6']);
  assert.ok(sections.at(-1).body.some((b:any)=>b.text?.includes(lang==='zh'?'事件 F':'Event F')));
  for(const model of models)assert.deepEqual(blocks.find((b:any)=>b.kind==='diagram'&&b.name===model[lang].name),model[lang]);
  const search=catalog.searchEntries.find((e:any)=>e.lang===lang)!.text;
  for(const term of ['FP/(FP+TN)','FP/(TP+FP)','43.2','RTO','RPO','P3-Q086','P3-Q088','Stealth','v2.2.0','1833(b)(5)'])assert.ok(search.includes(term),`${lang}: ${term}`);
  assert.ok(search.includes(lang==='zh'?'2027 年 12 月 31 日':'December 31, 2027'));
 }
 const shape=(lang:string)=>part.text[lang].sections.map((s:any)=>[s.id,s.body.map((b:any)=>[b.kind,b.kind==='table'?[b.headers.length,...b.rows.map((r:any)=>r.length)]:b.kind==='list'?b.items.length:b.kind==='diagram'?[b.name,b.items.length]:null])]);
 assert.deepEqual(shape('zh'),shape('en'));
 const ledger=read('adoption-map.json');assert.equal(ledger.find((m:any)=>m.sourceUnits[0]===146).supplementBodyIndices.length,1);
});

test('C30–C38 source mappings, adoption artifacts and source bytes are reproducible',()=>{
 const output=execFileSync('python3',['scripts/ceh_note_c30_c38.py','--check'],{encoding:'utf8'});
 assert.match(output,/all source units and nonempty lines accounted for/);
});
