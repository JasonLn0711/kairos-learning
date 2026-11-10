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
 assert.equal(catalog.notes.length,1);assert.equal(catalog.notes[0].parts.length,1);
 assert.equal(catalog.notes[0].expectedParts,3);
 for(const lang of ['zh','en'] as const){
  const page=getPage((lang==='en'?'/en':'')+'/ceh-notes/2026-11-10/')!;
  assert.equal(page.dailyNote?.date,today);
  assert.equal(page.dailyNote?.parts[0].text[lang].sections.length,7);
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
  if(mode==='future-note'){n.publishedOn=n.revisedOn=n.parts[0].publishedOn='2099-01-01';}
  if(mode==='draft-part')n.parts[0].status='draft';
  if(mode==='future-part')n.parts[0].publishedOn='2099-01-01';
  const c=createNotesCatalog([n],today);assert.deepEqual(c.notes,[]);assert.deepEqual(c.searchEntries,[]);
 }
 const n=fixture(),pending=structuredClone(n.parts[0]);pending.number=2;pending.status='draft';
 for(const lang of ['zh','en'] as const){pending.text[lang].title='PRIVATE_DRAFT_MARKER';pending.text[lang].sections=JSON.parse(JSON.stringify(pending.text[lang].sections).replaceAll('p1-','p2-'));}
 n.parts.push(pending);
 const c=createNotesCatalog([n],today);
 assert.equal(c.notes[0].parts.length,1);assert.ok(!JSON.stringify(c).includes('PRIVATE_DRAFT_MARKER'));
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
  const workflow=blocks.find(b=>b.kind==='figure'&&b.name==='workflow');
  assert.ok(workflow?.kind==='figure');assert.equal(workflow.items.length,4);
  const cia=blocks.find(b=>b.kind==='figure'&&b.name==='cia');assert.ok(cia?.kind==='figure');
  assert.deepEqual(cia.items.map(i=>i.title),['C · Confidentiality','I · Integrity','A · Availability']);
  const recall=blocks.find(b=>b.kind==='recall');assert.ok(recall?.kind==='recall');assert.equal(recall.cards.length,3);
  assert.ok(noteBodyText(recall).includes(recall.cards[2].answer[1]));
  const checks=blocks.find(b=>b.kind==='checks');assert.ok(checks?.kind==='checks');
  assert.deepEqual(checks.items.map(q=>q.answer),[1,1,0]);
  assert.ok(checks.items.every(q=>q.options.length===3&&q.rationales.length===3));
 }
});
