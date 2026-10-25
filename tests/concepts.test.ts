import test from 'node:test';
import assert from 'node:assert/strict';
import { compareContentVersions, conceptVersionLabel, createConceptCatalog, type ConceptTeaching } from '../src/lib/concepts.ts';
import { concepts, allConceptTeachings, getPage } from '../src/lib/server/catalog.ts';
const first=allConceptTeachings[0];
function second(): ConceptTeaching {
  const t=structuredClone(first);t.id='M04-02';delete t.checks;
  for(const lang of ['zh','en'] as const) t.text[lang]={summary:`${lang} SECOND_CONCEPT_FIXTURE`,sections:[{id:'own-section',heading:`${lang} Own heading`,paragraphs:[`${lang} Own teaching`]}]};
  t.qa=[{id:'own-question',text:{zh:{question:'第二課測試問題',answer:['第二課測試答案']},en:{question:'Second fixture question',answer:['Second fixture answer']}}}];
  return t;
}
test('second concept owns its teaching, Q&A, search and adjacent navigation in both languages',()=>{
  const catalog=createConceptCatalog(concepts,[first,second()],'2026-10-23');
  for(const lang of ['zh','en'] as const){
    const page=catalog.get('M04-02',lang)!;
    assert.equal(page.teaching.id,'M04-02');assert.match(page.teaching.text[lang].summary,/SECOND_CONCEPT_FIXTURE/);
    assert.equal(page.navigation.previous?.id,'M04-01');assert.equal(page.navigation.next?.id,'M04-03');assert.equal(page.navigation.next?.href,null);
    assert.equal(catalog.get('M04-01',lang)?.navigation.next?.href,page.navigation.previous?.href?.replace('m04-01','m04-02'));
    const entry=catalog.searchEntries.find(e=>e.id==='M04-02'&&e.lang===lang)!;
    assert.ok(entry.text.includes(page.teaching.qa![0].text[lang].answer[0]));assert.ok(!entry.text.includes('Finance'));
    assert.ok(!catalog.get('M04-01',lang)!.teaching.text[lang].summary.includes('SECOND_CONCEPT_FIXTURE'));
  }
});
test('draft, future, pending and nonexistent concepts have no public body or search entry',()=>{
  for(const status of ['draft','future'] as const){
    const t=second();if(status==='draft')t.status='draft';else t.publishedOn='2099-01-01';
    const catalog=createConceptCatalog(concepts,[first,t],'2026-10-23');
    assert.equal(catalog.get(t.id,'zh'),null);assert.equal(catalog.list('zh')[1].href,null);
    assert.ok(!JSON.stringify(catalog.searchEntries).includes('SECOND_CONCEPT_FIXTURE'));
  }
  assert.equal(getPage('/courses/ceh/v13/m04/concepts/m04-08/'),null);
  assert.equal(getPage('/courses/ceh/v13/m04/concepts/m04-99/'),null);
  assert.equal(createConceptCatalog(concepts,[first],'2026-10-23').get('M99-99','en'),null);
});
test('empty Q&A is optional; invalid translations, duplicates and reserved anchors fail closed',()=>{
  const t=second();delete t.qa;assert.doesNotThrow(()=>createConceptCatalog(concepts,[t],'2026-10-23'));
  const bad=second();bad.qa![0].text.en.answer=[];assert.throws(()=>createConceptCatalog(concepts,[bad],'2026-10-23'),/Q&A/);
  assert.throws(()=>createConceptCatalog(concepts,[first,first],'2026-10-23'),/duplicate/);
  const anchor=second();anchor.text.zh.sections[0].id='discussion';assert.throws(()=>createConceptCatalog(concepts,[anchor],'2026-10-23'),/invalid section/);
});
test('verbatim Chinese source replaces old sections and quizzes while English stays intact',()=>{
  assert.equal(first.revision,9);assert.equal(first.text.zh.sections.length,0);
  assert.equal(first.text.en.sections.length,7);assert.equal(first.text.zh.sourceBody?.length,81);
  assert.ok(first.checks?.every(q=>!q.text.zh && q.text.en));assert.deepEqual(first.qa?.map(q=>q.id),['smb-basics','smb-kafka']);
  const codes=first.text.zh.sourceBody!.flatMap(b=>b.kind==='code'?[b.text]:[]).join('\n');
  assert.ok(codes.includes('Test-NetConnection 192.168.56.10 -Port 445'));
  assert.ok(!JSON.stringify(first.text.zh.sourceBody).includes('favicons'));
  const bad=structuredClone(first);bad.text.zh.sourceBody=[];
  assert.throws(()=>createConceptCatalog(concepts,[bad],'2026-10-23'));
});
test('test explanations and table cells are searchable and incomplete test keys fail closed',()=>{
  const catalog=createConceptCatalog(concepts,[first],'2026-10-23');
  assert.ok(catalog.searchEntries.find(e=>e.lang==='en')!.text.includes('NTFS'));
  assert.ok(catalog.searchEntries.find(e=>e.lang==='zh')!.text.includes('主機名稱、DNS 記錄'));
  const bad=structuredClone(first);bad.checks![0].answer=5;assert.throws(()=>createConceptCatalog(concepts,[bad],'2026-10-23'),/test identity/);
});

test('visuals have searchable text and reject missing descriptions',()=>{
  const visual=first.text.en.sections.flatMap(s=>s.blocks??[]).find(b=>b.kind==='flow')!;
  assert.equal(visual.kind,'flow');
  const bad=structuredClone(first);const block=bad.text.en.sections.flatMap(s=>s.blocks??[]).find(b=>b.kind==='flow');
  if(block?.kind==='flow')block.description='';
  assert.throws(()=>createConceptCatalog(concepts,[bad],'2026-10-23'),/invalid visual/);
});

test("published DNS uses its own body and adjacent concepts",()=>{const p=getPage("/courses/ceh/v13/m04/concepts/m04-02/")!;assert.equal(p.conceptTeaching?.id,"M04-02");assert.equal(p.conceptNavigation?.previous?.id,"M04-01");assert.equal(p.conceptNavigation?.next?.id,"M04-03");assert.deepEqual(p.conceptTeaching?.qa,[]);});

test('semantic content versions preserve legacy revisions and sort numerically',()=>{
 assert.equal(first.revision,9);assert.equal(first.contentVersion,'2.0.1');
 assert.equal(conceptVersionLabel(first),'v2.0.1');
 assert.equal(conceptVersionLabel({revision:7}),'v7');
 assert.equal(compareContentVersions('2.10.0','2.9.99'),1);
 assert.equal(compareContentVersions('2.0.10','2.0.9'),1);
 assert.equal(compareContentVersions('2.0.0','3.0.0'),-1);
 assert.equal(compareContentVersions('2.0.0','2.0.0'),0);
 for(const v of ['v2.0.0','2.0','02.0.0','2.01.0','0.1.0','2.0.0-beta','2.-1.0','2.0.0 ']) {
  const t=structuredClone(first);t.contentVersion=v;
  assert.throws(()=>createConceptCatalog(concepts,[t],'2026-10-25'),/content version/);
 }
 assert.ok(allConceptTeachings.filter(t=>!['M04-01','M04-02'].includes(t.id)).every(t=>t.contentVersion===undefined));
 assert.ok(createConceptCatalog(concepts,[first],'2026-10-25').searchEntries.every(e=>e.text.includes('v2.0.1')));
});

test('DNS source edition keeps eleven sections, five questions and searchable diagram evidence',()=>{
 const dns=allConceptTeachings.find(t=>t.id==='M04-02')!;
 assert.equal(dns.contentVersion,'1.1.0');assert.equal(dns.revision,3);
 const blocks=dns.text.zh.sourceBody!;
 assert.equal(blocks.filter(b=>b.kind==='heading').length,11);
 assert.equal(blocks.filter(b=>'text' in b&&/^Q[1-5]\./.test(b.text)).length,5);
 assert.equal(blocks.filter(b=>b.kind==='dnsDiagram').length,4);
 assert.equal(dns.checks?.length,4);
 const catalog=createConceptCatalog(concepts,[dns],'2026-10-25');
 assert.ok(catalog.searchEntries.every(e=>e.text.includes('Recursive Resolver')));
 const bad=structuredClone(dns);
 bad.text.zh.sourceBody!.push({kind:'dnsDiagram',id:'unknown'} as never);
 assert.throws(()=>createConceptCatalog(concepts,[bad],'2026-10-25'),/invalid DNS diagram/);
});
