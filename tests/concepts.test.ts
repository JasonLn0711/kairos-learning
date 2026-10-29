import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { compareContentVersions, conceptVersionLabel, createConceptCatalog, type ConceptTeaching } from '../src/lib/concepts.ts';
import { concepts, allConceptTeachings, getPage } from '../src/lib/server/catalog.ts';
const first=allConceptTeachings.find(t=>t.id==='M04-01')!;
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
    assert.equal(catalog.get(t.id,'zh'),null);assert.equal(catalog.list('zh').find(c=>c.id===t.id)!.href,null);
    assert.ok(!JSON.stringify(catalog.searchEntries).includes('SECOND_CONCEPT_FIXTURE'));
  }
  assert.equal(getPage('/courses/ceh/v13/m04/concepts/m04-13/'),null);
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
  assert.equal(first.revision,10);assert.equal(first.text.zh.sections.length,0);
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
 assert.equal(first.revision,10);assert.equal(first.contentVersion,'2.0.2');
 assert.equal(conceptVersionLabel(first),'v2.0.2');
 assert.equal(conceptVersionLabel({revision:7}),'v7');
 assert.equal(compareContentVersions('2.10.0','2.9.99'),1);
 assert.equal(compareContentVersions('2.0.10','2.0.9'),1);
 assert.equal(compareContentVersions('2.0.0','3.0.0'),-1);
 assert.equal(compareContentVersions('2.0.0','2.0.0'),0);
 for(const v of ['v2.0.0','2.0','02.0.0','2.01.0','0.1.0','2.0.0-beta','2.-1.0','2.0.0 ']) {
  const t=structuredClone(first);t.contentVersion=v;
  assert.throws(()=>createConceptCatalog(concepts,[t],'2026-10-25'),/content version/);
 }
 assert.ok(allConceptTeachings.filter(t=>['M04-04','M04-05','M04-06','M04-07'].includes(t.id)).every(t=>t.contentVersion===undefined));
 assert.ok(createConceptCatalog(concepts,[first],'2026-10-25').searchEntries.every(e=>e.text.includes('v2.0.2')));
});

test('DNS source edition keeps eleven sections, five questions and searchable diagram evidence',()=>{
 const dns=allConceptTeachings.find(t=>t.id==='M04-02')!;
 assert.equal(dns.contentVersion,'1.2.0');assert.equal(dns.revision,4);
 const blocks=dns.text.zh.sourceBody!;
 assert.equal(blocks.filter(b=>b.kind==='heading').length,11);
 assert.equal(blocks.filter(b=>'text' in b&&/^Q[1-5]\./.test(b.text)).length,5);
 assert.equal(blocks.filter(b=>b.kind==='dnsDiagram').length,4);
 assert.equal(dns.checks?.length,4);
 const catalog=createConceptCatalog(concepts,[dns],'2026-10-25');
 assert.ok(catalog.searchEntries.every(e=>e.text.includes('Recursive Resolver')));
 assert.ok(catalog.searchEntries.every(e=>e.text.includes('udp: 65494') && e.text.includes('11774')));
 const bad=structuredClone(dns);
 bad.text.zh.sourceBody!.push({kind:'dnsDiagram',id:'unknown'} as never);
 assert.throws(()=>createConceptCatalog(concepts,[bad],'2026-10-25'),/invalid DNS diagram/);
});

test('reference answers are searchable but not learner responses and require safe unique anchors',()=>{
  const t=second();t.qa=[];
  for(const lang of ['zh','en'] as const) t.text[lang]={summary:'Reference answer fixture',sections:[],sourceBody:[{kind:'heading',id:'check',text:'Check'},{kind:'answer',id:'answer-check',summary:'Reference answer',paragraphs:['Answer is not proof of understanding.']}]};
  const catalog=createConceptCatalog(concepts,[t],'2026-10-23');
  assert.ok(catalog.searchEntries.every(e=>e.text.includes('Answer is not proof')));
  assert.deepEqual(catalog.get(t.id,'zh')!.teaching.qa,[]);
  for(const id of ['discussion','qa-actual','answer-']) {
    const bad=structuredClone(t);const answer=bad.text.zh.sourceBody![1];if(answer.kind==='answer')answer.id=id;
    assert.throws(()=>createConceptCatalog(concepts,[bad],'2026-10-23'),/reference answer/);
  }
  const duplicate=structuredClone(t);duplicate.text.zh.sourceBody!.push(structuredClone(duplicate.text.zh.sourceBody![1]));
  assert.throws(()=>createConceptCatalog(concepts,[duplicate],'2026-10-23'),/reference answer/);
});

test('M01-03 primary revision preserves ten sections, seven tables, full flow and three reference answers',()=>{
  const t=allConceptTeachings.find(t=>t.id==='M01-03')!;
  assert.equal(t.contentVersion,'1.1.0');
  for(const lang of ['zh','en'] as const){
    const b=t.text[lang].sourceBody!;
    assert.equal(b.filter(x=>x.kind==='heading').length,10);
    assert.equal(b.filter(x=>x.kind==='table').length,7);
    assert.equal(b.filter(x=>x.kind==='answer').length,3);
    assert.equal(b.filter(x=>x.kind==='code').length,1);
    assert.ok(b.some(x=>x.kind==='paragraph'&&x.text.includes('403')));
    assert.ok(b.some(x=>x.kind==='paragraph'&&x.text.includes('358')));
  }
  assert.deepEqual(t.qa,[]);
});

test('M01-04 primary revision and M01-05 retain complete beginner lessons',()=>{
  for(const id of ['M01-04','M01-05']) {
    const t=allConceptTeachings.find(t=>t.id===id)!; assert.ok(t);
    assert.equal(t.contentVersion,'1.1.0');assert.deepEqual(t.qa,[]);
    for(const lang of ['zh','en'] as const){
      const b=t.text[lang].sourceBody!;
      assert.equal(b.filter(x=>x.kind==='heading').length,id==='M01-04'?7:9);
      assert.equal(b.filter(x=>x.kind==='answer').length,3);
      if(id==='M01-05'){assert.equal(b.filter(x=>x.kind==='table').length,7);assert.equal(b.filter(x=>x.kind==='code').length,2);assert.ok(b.some(x=>x.kind==='paragraph'&&x.text.includes('403')));}
      if(id==='M01-04'){assert.equal(b.filter(x=>x.kind==='table').length,5);assert.equal(b.filter(x=>x.kind==='code').length,3);}
      assert.ok(b.length>60);
    }
  }
});

test('M01-06 preserves full beginner teaching and a closed reference answer, not learner Q&A',()=>{
 const t=allConceptTeachings.find(t=>t.id==='M01-06')!;
 assert.equal(t.contentVersion,'1.1.0');assert.deepEqual(t.qa,[]);
 for(const lang of ['zh','en'] as const){
  const b=t.text[lang].sourceBody!;
  assert.equal(b.filter(x=>x.kind==='heading').length,9);
  assert.equal(b.filter(x=>x.kind==='answer').length,3);
  assert.equal(b.filter(x=>x.kind==='table').length,5);
  assert.equal(b.filter(x=>x.kind==='code').length,7);
  assert.ok(b.length>200);
  assert.ok(b.some(x=>'text'in x&&x.text.includes('MFA')));
 }
});

test('M09-02 preserves the full primary manuscript, aligned languages and five unchanged original SVGs',()=>{
 const t=allConceptTeachings.find(t=>t.id==='M09-02')!;
 assert.equal(t.contentVersion,'1.1.0');assert.equal(t.revision,2);assert.deepEqual(t.qa,[]);
 for(const lang of ['zh','en'] as const){
  const body=t.text[lang].sourceBody!;
  assert.ok(body.length>=270);
  assert.equal(body.filter(b=>b.kind==='table').length,4);
  assert.equal(body.filter(b=>b.kind==='answer').length,4);
  assert.equal(body.filter(b=>b.kind==='heading').length,10);
  const images=body.filter(b=>b.kind==='sourceImage');
  assert.deepEqual(images.map(b=>b.src),[1,3,2,4,5].map(n=>`/images/ceh/m09-02-original-${n}.svg`));
  const text=JSON.stringify(body);
  for(const word of ['Phishing','Spear Phishing','Whaling','Northstar','Trust Boundary','T1566.004','WebAuthn','DMARC']) assert.ok(text.toLowerCase().includes(word.toLowerCase()));
  assert.ok(!/Sentinel_|libfile_|CalpicoFile_|sandbox:|chatgpt-content-reference/.test(text));
 }
 const shape=(lang:'zh'|'en')=>t.text[lang].sourceBody!.map(b=>({kind:b.kind,id:'id'in b?b.id:undefined,rows:b.kind==='table'?b.rows.map(r=>r.length):undefined,items:b.kind==='list'?b.items.length:undefined}));
 assert.deepEqual(shape('zh'),shape('en'));
 const raw=readFileSync('docs/sources/m09-02/user-primary-2026-10-29.md','utf8');
 assert.equal(createHash('sha256').update(raw).digest('hex'),'d3125240593f7d15483a5049b47099f40109c855e1c98c469cfaf1449099d2aa');
 const text=t.text.zh.sourceBody!.flatMap(b=>b.kind==='sourceImage'?[b.alt,b.caption]:b.kind==='list'?b.items:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[]).join('\n');
 let cursor=0;let count=0;
 for(let line of raw.split('\n')){
  line=line.trim();if(!line||line==='---'||line.startsWith('# ')||line==='>'||line.includes('/images/ceh/m09-02-original-')||line.includes('/downloads/ceh-m09-02-original-svg.zip')||/^[| :\-]+$/.test(line))continue;
  const units=line.startsWith('|')?line.slice(1,-1).split('|'): [line.replace(/^#{2,3} /,'').replace(/^> /,'').replace(/^(?:- |\d+\. )/,'')];
  for(let unit of units){unit=unit.replaceAll('**','').replaceAll('?utm_source=chatgpt.com','').replaceAll('&utm_source=chatgpt.com','').trim();const at=text.indexOf(unit,cursor);assert.ok(at>=0,`Missing/out-of-order source: ${unit}`);cursor=at+unit.length;count++;}
 }
 assert.ok(count>270);
 const hashes=["9b5d90ad2e2b90da290117d04fabf77b0deafe43962167d9a556ee8fdde4261b", "f692cbf0e8e7bd26d11203f78ba88fbce52188e959447c646c03dcd758d3b03e", "6d540bbea409fe6894d0d6297e02eda98a96fb322bc6ea1474ff3bd68b3f1e22", "6fe0e29867826e199ed7c6373dbc3ae7ea300f3a2df728f46c5ddd0c5fc6e1e5", "4a4a28c1462f3f03e4aaba2cf0e04913f4cf1ba41603c4f9a2914339f1b48a67"];
 for(const [i,hash] of hashes.entries())assert.equal(createHash('sha256').update(readFileSync(`site/images/ceh/m09-02-original-${i+1}.svg`)).digest('hex'),hash);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-10-29');
 assert.equal(catalog.searchEntries.filter(e=>e.id==='M09-02').length,2);
});

test('M01-07 preserves the primary manuscript, four original SVG images and four closed reference answers',()=>{
 const t=allConceptTeachings.find(t=>t.id==='M01-07')!;
 assert.equal(t.contentVersion,'1.0.1');assert.deepEqual(t.qa,[]);
 for(const lang of ['zh','en'] as const){
  const b=t.text[lang].sourceBody!;
  assert.equal(b.filter(x=>x.kind==='heading').length,9);
  assert.equal(b.filter(x=>x.kind==='table').length,9);
  assert.equal(b.filter(x=>x.kind==='sourceImage').length,4);
  assert.equal(b.filter(x=>x.kind==='answer').length,4);
  assert.ok(b.length>220);
  for(const term of ['450','500','2025','Govern','Residual Risk','ISO/IEC 27001']) assert.ok(JSON.stringify(b).includes(term));
  assert.ok(!JSON.stringify(b).includes('sandbox:'));
  assert.ok(!JSON.stringify(b).includes('chatgpt-content-reference'));
 }
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-10-29');
 assert.ok(catalog.searchEntries.filter(e=>e.id==='M01-07').every(e=>e.text.includes('Govern')));
});

test('source images preserve local paths and searchable alternatives, and reject unsafe or incomplete metadata',()=>{
 const original=allConceptTeachings.find(t=>t.id==='M01-07')!;
 const catalog=createConceptCatalog(concepts,[original],'2026-10-29');
 for(const lang of ['zh','en'] as const){
  const image=original.text[lang].sourceBody!.find(b=>b.kind==='sourceImage')!;
  assert.equal(image.kind,'sourceImage');
  assert.ok(catalog.searchEntries.find(e=>e.lang===lang)!.text.includes(image.alt));
 }
 for(const bad of [{src:'https://example.com/unsafe.svg'},{alt:''},{width:0}]) {
  const copy=structuredClone(original);const image=copy.text.zh.sourceBody!.find(b=>b.kind==='sourceImage')!;Object.assign(image,bad);
  assert.throws(()=>createConceptCatalog(concepts,[copy],'2026-10-29'));
 }
});

test('M09-01 preserves its source-led bilingual lesson and the four original SVG placements',()=>{
 const t=allConceptTeachings.find(t=>t.id==='M09-01')!;
 assert.equal(t.contentVersion,'1.0.0');assert.deepEqual(t.qa,[]);
 for(const lang of ['zh','en'] as const){
  const b=t.text[lang].sourceBody!;
  assert.ok(b.length>=207);
  assert.equal(b.filter(x=>x.kind==='table').length,3);
  assert.equal(b.filter(x=>x.kind==='answer').length,5);
  const images=b.filter(x=>x.kind==='sourceImage');
  assert.deepEqual(images.map(x=>x.src),[1,2,3,4].map(n=>`/images/ceh/m09-01-original-${n}.svg`));
  for(const term of ['Authentication','Authorization','Least Privilege','T1566.004','M01-07']) assert.ok(JSON.stringify(b).toLowerCase().includes(term.toLowerCase()));
  assert.ok(!JSON.stringify(b).includes('sandbox:'));
  assert.ok(!JSON.stringify(b).includes('chatgpt-content-reference'));
 }
 assert.deepEqual(t.text.zh.sourceBody!.map(b=>b.kind),t.text.en.sourceBody!.map(b=>b.kind));
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-10-29');
 assert.equal(catalog.searchEntries.filter(e=>e.id==='M09-01').length,2);
});
