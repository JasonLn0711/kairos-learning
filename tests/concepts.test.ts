import test from 'node:test';
import assert from 'node:assert/strict';
import { createConceptCatalog, type ConceptTeaching } from '../src/lib/concepts.ts';
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
  assert.equal(getPage('/courses/ceh/v13/m04/concepts/m04-06/'),null);
  assert.equal(getPage('/courses/ceh/v13/m04/concepts/m04-99/'),null);
  assert.equal(createConceptCatalog(concepts,[first],'2026-10-23').get('M99-99','en'),null);
});
test('empty Q&A is optional; invalid translations, duplicates and reserved anchors fail closed',()=>{
  const t=second();delete t.qa;assert.doesNotThrow(()=>createConceptCatalog(concepts,[t],'2026-10-23'));
  const bad=second();bad.qa![0].text.en.answer=[];assert.throws(()=>createConceptCatalog(concepts,[bad],'2026-10-23'),/Q&A/);
  assert.throws(()=>createConceptCatalog(concepts,[first,first],'2026-10-23'),/duplicate/);
  const anchor=second();anchor.text.zh.sections[0].id='discussion';assert.throws(()=>createConceptCatalog(concepts,[anchor],'2026-10-23'),/invalid section/);
});
test('M04 revision three keeps seven teaching sections and three tests distinct from empty discussion',()=>{
  assert.equal(first.revision,3);assert.equal(first.text.zh.sections.length,7);
  assert.deepEqual(first.text.zh.sections.map(s=>s.id),first.text.en.sections.map(s=>s.id));
  assert.deepEqual(first.checks?.map(q=>q.answer),[1,2,1]);assert.deepEqual(first.qa,[]);
  for(const lang of ['zh','en'] as const){
    assert.deepEqual(first.text[lang].sections.filter(s=>s.blocks?.length).map(s=>s.blocks!.map(b=>b.kind)),first.text.zh.sections.filter(s=>s.blocks?.length).map(s=>s.blocks!.map(b=>b.kind)));
    const codes=first.text[lang].sections.flatMap(s=>s.blocks??[]).map(b=>b.kind==='step' ? b.code??'' : '').join('\n');
    assert.ok(codes.includes('get test.txt downloaded-test.txt'));assert.ok(!codes.includes("-c 'ls'"));
    assert.ok(codes.includes('mktemp -d'));assert.ok(!codes.includes('%PASSWORD'));
    const serialized=JSON.stringify(first.text[lang]);assert.ok(!/utm_|favicons|&#x20;/.test(serialized));
  }
});
test('test explanations and table cells are searchable and incomplete test keys fail closed',()=>{
  const catalog=createConceptCatalog(concepts,[first],'2026-10-23');
  assert.ok(catalog.searchEntries.find(e=>e.lang==='en')!.text.includes('NTFS'));
  assert.ok(catalog.searchEntries.find(e=>e.lang==='zh')!.text.includes(first.checks![1].text.zh.rationales[2]));
  const bad=structuredClone(first);bad.checks![0].answer=5;assert.throws(()=>createConceptCatalog(concepts,[bad],'2026-10-23'),/test identity/);
});

test('visuals have searchable text and reject missing descriptions',()=>{
  const visual=first.text.zh.sections.flatMap(s=>s.blocks??[]).find(b=>b.kind==='flow')!;
  assert.equal(visual.kind,'flow');
  const bad=structuredClone(first);const block=bad.text.zh.sections.flatMap(s=>s.blocks??[]).find(b=>b.kind==='flow');
  if(block?.kind==='flow')block.description='';
  assert.throws(()=>createConceptCatalog(concepts,[bad],'2026-10-23'),/invalid visual/);
});

test("published DNS uses its own body and adjacent concepts",()=>{const p=getPage("/courses/ceh/v13/m04/concepts/m04-02/")!;assert.equal(p.conceptTeaching?.id,"M04-02");assert.equal(p.conceptNavigation?.previous?.id,"M04-01");assert.equal(p.conceptNavigation?.next?.id,"M04-03");assert.deepEqual(p.conceptTeaching?.qa,[]);});
