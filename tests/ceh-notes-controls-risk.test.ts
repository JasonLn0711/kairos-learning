import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createNotesCatalog} from '../src/lib/ceh-notes.ts';
import {noteBodyText} from '../src/lib/ceh-notes.ts';

const directory='docs/sources/ceh-notes/2026-11-12/controls-risk-supplement/';
const read=(name:string)=>JSON.parse(readFileSync(directory+name,'utf8'));
const note=JSON.parse(readFileSync('content/ceh-notes/2026-11-12.json','utf8'));

test('two original manuscripts and thirteen PNGs retain their exact captured bytes',()=>{
 const manifest=read('sha256-manifest.json');
 assert.equal(manifest.length,15);
 assert.equal(manifest.filter((r:any)=>r.file.endsWith('.txt')).length,2);
 assert.equal(manifest.filter((r:any)=>r.file.endsWith('.png')).length,13);
 for(const entry of manifest){
  const bytes=readFileSync(directory+entry.file);
  assert.equal(bytes.length,entry.bytes,entry.file);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256,entry.file);
  if(entry.file.endsWith('.png'))assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10]);
 }
});

test('every nonempty source line has a destination or an explicit interface-only exclusion',()=>{
 for(const part of [2,3]){
  const source=readFileSync(directory+`pasted-text-${part-1}.txt`,'utf8').split(/\r?\n/);
  if(source.at(-1)==='')source.pop();
  const lines=read(`part-${part}-line-map.json`);
  const units=read(`part-${part}-source-units.json`);
  const mapping=read(`part-${part}-adoption-map.json`);
  assert.equal(units.length,part===2?439:394);
  assert.equal(lines.length,source.length);
  const indices=mapping.flatMap((m:any)=>Array.from({length:m.sourceUnits[1]-m.sourceUnits[0]+1},(_,i)=>i+m.sourceUnits[0]));
  assert.deepEqual(indices.toSorted((a:number,b:number)=>a-b),units.map((u:any)=>u.unit));
  for(const [i,line] of source.entries()){
   assert.equal(lines[i].line,i+1);
   if(!line.trim())assert.equal(lines[i].decision,'blank-separator');
   else assert.notEqual(lines[i].decision,'blank-separator');
  }
  const ui=mapping.filter((m:any)=>m.decision==='source-interface-only').map((m:any)=>units[m.sourceUnits[0]]);
  for(const unit of ui){
   const i=unit.unit;
   assert.ok(unit.zh.startsWith('[image](')||unit.zh==='CEH-Day01-A-2026-11-12(1).md'||units[i-1]?.zh.startsWith('[image]('),`unexpected omission: ${unit.zh}`);
  }
 }
});

test('complete bilingual parts preserve chapters, subsections, tables and twelve unanswered original questions',()=>{
 const catalog=createNotesCatalog([note],'2026-11-12');
 const expected={2:{sections:15,blocks:285,headings:35,tables:12,figures:7},3:{sections:12,blocks:256,headings:29,tables:17,figures:6}};
 for(const number of [2,3] as const){
  const part=note.parts.find((p:any)=>p.number===number);
  const adopted=read(`part-${number}-adopted.json`);
  assert.deepEqual(part,adopted);
  const units=read(`part-${number}-source-units.json`);
  const mapping=read(`part-${number}-adoption-map.json`);
  const originalQuestions=units.filter((u:any)=>/^\d\\\. /.test(u.zh));
  assert.equal(originalQuestions.length,6);
  const prefix=number===2?'p2-controls-':'p3-risk-';
  for(const lang of ['zh','en']){
   const sections=part.text[lang].sections;
   const blocks=sections.flatMap((s:any)=>s.body);
   assert.equal(sections.length,expected[number].sections);
   assert.equal(blocks.length,expected[number].blocks);
   assert.equal(blocks.filter((b:any)=>b.kind==='heading').length,expected[number].headings);
   assert.equal(blocks.filter((b:any)=>b.kind==='table').length,expected[number].tables);
   assert.equal(blocks.filter((b:any)=>b.kind==='diagram').length,expected[number].figures);
   assert.equal(blocks.filter((b:any)=>['answer','checks','recall'].includes(b.kind)).length,0,'original open questions remain unanswered');
   for(const section of sections){
    assert.ok(section.id.startsWith(prefix));
    for(const block of section.body){
     if(block.id)assert.ok(block.id.startsWith(prefix));
     for(const text of noteBodyText(block)){
      assert.ok(text.trim().length);
      assert.ok(!/utm_source=|google\.com\/s2\/favicons|CEH-Day01-A-2026-11-12\(1\)\.md|\\\\[()[\]]|`/.test(text));
     }
    }
   }
   const finalSection=sections.at(-1);
   const questions=finalSection.body.filter((b:any)=>b.kind==='paragraph'&&/^\d\. /.test(b.text));
   assert.equal(questions.length,6,lang);
   assert.deepEqual(questions.map((b:any)=>b.text[0]),['1','2','3','4','5','6']);
   for(const original of originalQuestions){
    const entry=mapping.find((m:any)=>m.sourceUnits[0]===original.unit);
    assert.equal(entry.target,finalSection.id);
    assert.ok(finalSection.body[entry.bodyIndex].text.length>20);
   }
   assert.ok(catalog.searchEntries.find((e:any)=>e.lang===lang)?.text.includes('Cryptographic Erase'));
  }
  const shape=(lang:string)=>part.text[lang].sections.map((s:any)=>[s.id,s.body.map((b:any)=>[b.kind,b.kind==='table'?[b.headers.length,...b.rows.map((r:any)=>r.length)]:b.kind==='list'?b.items.length:b.kind==='diagram'?[b.name,b.items.length]:null])]);
  assert.deepEqual(shape('zh'),shape('en'));
 }
});

test('adoption reconstruction, source coverage, published artifact equality and hashes remain reproducible',()=>{
 const output=execFileSync('python3',['scripts/ceh_note_controls_risk.py','--check'],{encoding:'utf8'});
 assert.match(output,/full source-unit and nonempty-line coverage/);
});
