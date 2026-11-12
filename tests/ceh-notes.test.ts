import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNotesCatalog,noteBodyText,type DailyNote} from '../src/lib/ceh-notes.ts';
import {getPage,searchEntries} from '../src/lib/server/catalog.ts';
const original=JSON.parse(readFileSync('content/ceh-notes/2026-11-10.json','utf8')) as DailyNote;
const today='2026-11-10';
const fixture=()=>structuredClone(original);
test('one date owns the supplied part, paired routes, full text search and all nine references',()=>{
 const catalog=createNotesCatalog([fixture()],today);
 assert.equal(catalog.notes.length,1);assert.equal(catalog.notes[0].parts.length,3);
 assert.equal(catalog.notes[0].expectedParts,3);
 for(const lang of ['zh','en'] as const){
  const page=getPage((lang==='en'?'/en':'')+'/ceh-notes/2026-11-10/')!;
  assert.equal(page.dailyNote?.date,today);
  assert.equal(page.dailyNote?.parts[0].text[lang].sections.length,19);
  const text=catalog.searchEntries.find(e=>e.lang===lang)!.text;
  for(const id of ['EC-Q001','P1-Q003','P3-Q113','EC-Q054','P3-Q124','EC-Q166','EC-Q189','EC-Q331','EC-Q476'])assert.ok(text.includes(id));
  for(const keyword of ['192.0.2.10','192.0.2.11','TLS','Non-Repudiation'.toLowerCase()])assert.ok(text.toLowerCase().includes(keyword.toLowerCase()));
  assert.ok(searchEntries.some(e=>e.id==='CEH-NOTES-'+today&&e.lang===lang));
 }
});
test('draft/future notes and parts never enter public data, indexes or search',()=>{
 for(const mode of ['draft-note','future-note','draft-part','future-part']){
  const n=fixture();
  if(mode==='draft-note')n.status='draft';
  if(mode==='future-note'){n.publishedOn=n.revisedOn='2099-01-01';for(const p of n.parts)p.publishedOn='2099-01-01';}
  if(mode==='draft-part')for(const p of n.parts)p.status='draft';
  if(mode==='future-part')for(const p of n.parts)p.publishedOn='2099-01-01';
  const c=createNotesCatalog([n],today);assert.deepEqual(c.notes,[]);assert.deepEqual(c.searchEntries,[]);
 }
 const n=fixture(),pending=structuredClone(n.parts[0]);n.expectedParts=4;pending.number=4;pending.status='draft';
 for(const lang of ['zh','en'] as const){pending.text[lang].title='PRIVATE_DRAFT_MARKER';pending.text[lang].sections=JSON.parse(JSON.stringify(pending.text[lang].sections).replaceAll('p1-','p4-'));}
 n.parts.push(pending);
 const c=createNotesCatalog([n],today);
 assert.equal(c.notes[0].parts.length,3);assert.ok(!JSON.stringify(c).includes('PRIVATE_DRAFT_MARKER'));
});
test('notes reject duplicate days, invalid dates, unsafe source/figure fields and misaligned languages',()=>{
 assert.throws(()=>createNotesCatalog([fixture(),fixture()],today),/identity/);
 const mutations=[
  (n:DailyNote)=>{n.date='2026-02-30';},
  (n:DailyNote)=>{n.sources[0].url='javascript:alert(1)';},
  (n:DailyNote)=>{(n as unknown as Record<string,unknown>).privateSource='hidden';},
  (n:DailyNote)=>{n.parts[0].text.en.sections.pop();},
  (n:DailyNote)=>{const b=n.parts[0].text.zh.sections.flatMap(s=>s.body).find(b=>b.kind==='figure')!;(b as unknown as Record<string,unknown>).html='<script/>';},
  (n:DailyNote)=>{const b=n.parts[0].text.en.sections.flatMap(s=>s.body).find(b=>b.kind==='checks')!;if(b.kind==='checks')b.items[0].answer=3;},
 ];
 for(const mutate of mutations){const n=fixture();mutate(n);assert.throws(()=>createNotesCatalog([n],today));}
});
test('the three illustrated relationships and scenario keys retain their intended meaning',()=>{
 for(const lang of ['zh','en'] as const){
  const blocks=original.parts[0].text[lang].sections.flatMap(s=>s.body);
  const workflow=blocks.find(b=>b.kind==='diagram'&&b.name==='testing');
  assert.ok(workflow?.kind==='diagram');assert.equal(workflow.items.length,5);
  const cia=blocks.find(b=>b.kind==='figure'&&b.name==='cia');assert.ok(cia?.kind==='figure');
  assert.deepEqual(cia.items.map(i=>i.title),['C · Confidentiality','I · Integrity','A · Availability']);
  const recall=blocks.find(b=>b.kind==='recall');assert.ok(recall?.kind==='recall');assert.equal(recall.cards.length,3);
  assert.ok(noteBodyText(recall).includes(recall.cards[2].answer[1]));
  const checks=original.parts[0].text[lang].sections.find(s=>s.id==='p1-checks')!.body.find(b=>b.kind==='checks');assert.ok(checks?.kind==='checks');
  assert.deepEqual(checks.items.map(q=>q.answer),[1,1,0]);
  assert.ok(checks.items.every(q=>q.options.length===3&&q.rationales.length===3));
 }
});
test('the reconstructed CIA chapter retains all seven supplied subsections, examples and reasoning',()=>{
  for(const lang of ['zh','en'] as const){
    const section=original.parts[0].text[lang].sections.find(s=>s.id==='p1-cia')!;
    const anchors=section.body.flatMap(b=>'id' in b&&b.id?[b.id]:[]);
    for(const id of ['p1-cia-case','p1-confidentiality','p1-why-encrypt','p1-integrity','p1-availability','p1-nonrepudiation','p1-objective-comparison','p1-q003-reasoning'])assert.ok(anchors.includes(id));
    assert.deepEqual(section.body.filter(b=>b.kind==='table').map(b=>b.rows.length),[6,5,4]);
    const text=section.body.flatMap(noteBodyText).join(' ');
    for(const retained of ['5','50','100,000','900,000','Ubuntu','SHA-256','TLS','7F A2 9C 41','P1-Q003','sensitive legal documents','intercepting the traffic','unauthorized individuals','Backup','Redundancy','Non-Repudiation'])assert.ok(text.toLowerCase().includes(retained.toLowerCase()),`${lang}: ${retained}`);
    const reasoning=section.body.find(b=>b.kind==='list'&&b.items[0].startsWith(lang==='zh'?'第一步':'Step 1'));
    assert.ok(reasoning?.kind==='list');assert.equal(reasoning.items.length,4);
  }
});
test('all three supplied parts retain their reference sets, mechanisms and mixed exercises',()=>{
 assert.deepEqual(original.parts.map(p=>p.number),[1,2,3]);
 assert.deepEqual(original.parts.map(p=>p.text.zh.sections.length),[19,16,16]);
 const expected=[['EC-Q001','P1-Q003','P3-Q113','EC-Q054','P3-Q124','EC-Q166','EC-Q189','EC-Q331','EC-Q476'],['EC-Q535','P3-Q110','P1-Q063','P3-Q086','P3-Q088','EC-Q284','EC-Q032','P3-Q074','P3-Q121'],['EC-Q493','EC-Q024','P1-Q114','EC-Q053','P3-Q056','P1-Q085','P2-Q034','P3-Q071','EC-Q084']];
 for(const lang of ['zh','en'] as const)for(const [index,p] of original.parts.entries()){
  const blocks=p.text[lang].sections.flatMap(s=>s.body),text=blocks.flatMap(noteBodyText).join(' ');
  for(const id of expected[index])assert.ok(text.includes(id),`${lang}: ${id}`);
  assert.equal(blocks.find(b=>b.kind==='recall')?.cards.length,[3,8,6][index]);
 }
 for(const lang of ['zh','en'] as const){
  const third=original.parts[2].text[lang].sections.flatMap(s=>s.body);
  for(const id of ['p3-open-q4','p3-open-q5','p3-dsa-k','p3-dh-example','p3-q19-q21','p3-q27'])assert.ok(third.some(b=>'id' in b&&b.id===id));
  const text=third.flatMap(noteBodyText).join(' ');
  for(const value of ['19^6 mod 23 = 2','8^15 mod 23 = 2','s = k^(-1) × (H(m) + x r) mod q','Rijndael','MARS','RC6','Serpent','FIPS 186-5','Signature'])assert.ok(text.includes(value));
 }
 assert.equal(19n**6n%23n,2n);assert.equal(8n**15n%23n,2n);
 assert.equal(2n**32n*8n,34359738368n);
});
test('a hidden later part cannot leak while another part remains public',()=>{
 const n=fixture();n.parts[1].status='draft';n.parts[2].publishedOn='2099-01-01';
 for(const lang of ['zh','en'] as const){n.parts[1].text[lang].title='HIDDEN_DRAFT_PART';n.parts[2].text[lang].title='HIDDEN_FUTURE_PART';}
 const c=createNotesCatalog([n],today);
 assert.deepEqual(c.notes[0].parts.map(p=>p.number),[1]);
 assert.ok(!JSON.stringify(c).includes('HIDDEN_'));
});

test('all seventeen continuation references preserve fixed relationships, source links and bilingual text',async()=>{
 const {noteDiagramSpecs,noteReferenceImage}=await import('../src/lib/note-diagrams.ts');
 const refs=JSON.parse(readFileSync('docs/sources/ceh-notes/2026-11-10/continuation-17-reference/reference-diagrams.json','utf8'));
 assert.deepEqual(refs.map((r:any)=>r.reference),Array.from({length:17},(_,i)=>i+1));
 for(const r of refs){
  const spec=(noteDiagramSpecs as any)[r.text.zh.name];
  if(spec.rows){
   assert.deepEqual(spec.rows.flat().sort((a:number,b:number)=>a-b),Array.from({length:spec.count},(_,i)=>i));
   for(const [a,b] of spec.edges){assert.ok(a>=0&&a<spec.count&&b>=0&&b<spec.count&&a!==b);}
  }
  for(const lang of ['zh','en'] as const){
   const actual=original.parts[r.part-1].text[lang].sections.flatMap(s=>s.body).find(b=>b.kind==='diagram'&&b.name===r.text[lang].name);
   assert.deepEqual(actual,r.text[lang]);
   assert.ok(noteReferenceImage(original.date,r.text[lang].name)?.endsWith(`/continuation-17-reference/image-${r.reference}.png`));
   const mutated=fixture();
   const block=mutated.parts[r.part-1].text[lang].sections.flatMap(s=>s.body).find(b=>b.kind==='diagram'&&b.name===r.text[lang].name)!;
   (block as any).edges=[[0,1,'injected']];
   assert.throws(()=>createNotesCatalog([mutated],today));
  }
 }
 assert.deepEqual((noteDiagramSpecs.soc as any).edges.slice(-3),[[4,5,'optional'],[4,6,''],[5,6,'']]);
 assert.deepEqual((noteDiagramSpecs.mitm as any).edges,[[0,1,'K1','both'],[1,2,'K2','both']]);
 assert.equal(noteDiagramSpecs.storage.layout,'continuation-parallel');
 assert.equal(noteDiagramSpecs.hidden.layout,'continuation-nested');
});
