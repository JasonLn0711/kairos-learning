import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateNoteDiagram,noteDiagramSpecs,tlsDirections,noteReferenceImage,type NoteDiagram} from '../src/lib/note-diagrams.ts';
import {createNotesCatalog,noteBodyText,type DailyNote} from '../src/lib/ceh-notes.ts';

const references=JSON.parse(readFileSync('docs/sources/ceh-notes/2026-11-10/reconstruction/reference-diagrams.json','utf8')) as {part:number;reference:number;text:{zh:NoteDiagram;en:NoteDiagram}}[];
test('the supplied diagrams preserve their bilingual fixed relationships and searchable text',()=>{
  assert.equal(references.length,10); // CIA is the existing three-card figure.
  assert.deepEqual(references.map(r=>r.reference),[1,3,4,5,6,7,8,9,10,11]);
  const n=JSON.parse(readFileSync('content/ceh-notes/2026-11-10.json','utf8')) as DailyNote;
  // A dedicated in-memory part exercises both public serialization and language alignment.
  n.expectedParts=4;
  const part={number:4,status:'published' as const,publishedOn:n.publishedOn,text:{zh:{title:'Reference fixture',sections:[] as typeof n.parts[0]['text']['zh']['sections']},en:{title:'Reference fixture',sections:[] as typeof n.parts[0]['text']['en']['sections']}}};
  for(const lang of ['zh','en'] as const)part.text[lang].sections=[{id:'p4-reference-fixture',heading:'References',body:references.map(r=>r.text[lang])}];
  n.parts.push(part);
  const catalog=createNotesCatalog([n],'2026-11-10');
  for(const lang of ['zh','en'] as const){
    for(const r of references){
      validateNoteDiagram(r.text[lang]);
      assert.equal(r.text[lang].items.length,noteDiagramSpecs[r.text[lang].name].count);
      for(const text of noteBodyText(r.text[lang]))assert.ok(catalog.searchEntries.find(e=>e.lang===lang)!.text.includes(text));
    }
  }
  assert.deepEqual(tlsDirections,['to-server','to-client','both','to-client','to-client','to-client','client','to-server','to-server','to-client']);
});
test('reference data cannot inject markup fields or alter endpoint layout and node counts',()=>{
  assert.equal(noteReferenceImage('2026-11-11','cia'),null);
  assert.equal(noteReferenceImage('2026-11-10','../../other'),null);
  assert.ok(noteReferenceImage('2026-11-10','tls')?.endsWith('/image-11.png'));
  const original=references[0].text.zh;
  for(const change of [
    (b:Record<string,unknown>)=>{b.name='../../unreviewed';},
    (b:Record<string,unknown>)=>{b.html='<script>alert(1)</script>';},
    (b:Record<string,unknown>)=>{b.items=[];},
    (b:Record<string,unknown>)=>{(b.items as Record<string,unknown>[])[0].path='M0 0';},
    (b:Record<string,unknown>)=>{(b.items as Record<string,unknown>[])[0].title='';},
  ]){
    const b=structuredClone(original) as unknown as Record<string,unknown>;change(b);
    assert.throws(()=>validateNoteDiagram(b as unknown as NoteDiagram),/invalid reference diagram/);
  }
});
test('new supplied four-option checks and six/eight recall cards preserve existing boundaries',()=>{
  for(const count of [6,8]){
    const n=JSON.parse(readFileSync('content/ceh-notes/2026-11-10.json','utf8')) as DailyNote;
    for(const lang of ['zh','en'] as const){
      const blocks=n.parts[0].text[lang].sections.flatMap(s=>s.body);
      const recall=blocks.find(b=>b.kind==='recall')!;
      assert.equal(recall.kind,'recall');if(recall.kind!=='recall')throw Error('Fixture');
      recall.cards=Array.from({length:count},()=>structuredClone(recall.cards[0]));
      const checks=blocks.find(b=>b.kind==='checks'&&b.items[0].options.length===3)!;
      if(checks.kind!=='checks')throw Error('Fixture');
      checks.items[0].options.push('Fourth option');checks.items[0].rationales.push('Fourth rationale');checks.items[0].answer=3;
    }
    assert.equal(createNotesCatalog([n],'2026-11-10').notes.length,1);
    const invalid=structuredClone(n);
    const b=invalid.parts[0].text.zh.sections.flatMap(s=>s.body).find(b=>b.kind==='checks')!;
    if(b.kind==='checks')b.items[0].answer=4;
    assert.throws(()=>createNotesCatalog([invalid],'2026-11-10'),/invalid check/);
  }
});
