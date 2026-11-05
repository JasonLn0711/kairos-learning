import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createAaseCatalog,type AaseLesson,type AaseCourse,type AaseSource,type AaseCourseTranslation} from '../src/lib/aase.ts';
import {getPage,routes,searchEntries} from '../src/lib/server/catalog.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const course=read('content/aase/course.json') as AaseCourse;
const lessons=readdirSync('content/aase/lessons').map(f=>read('content/aase/lessons/'+f)) as AaseLesson[];
const sources=read('content/aase/sources.json') as AaseSource[];
const english=read('content/aase/course.en.json') as AaseCourseTranslation;
const catalog=(ls=lessons,c=course)=>createAaseCatalog(c,ls,sources,'2026-11-05',english);
test('AASE has independent 49 IDs, nine modules and exact workshop allocation',()=>{
 const c=catalog();assert.equal(c.concepts.length,49);assert.equal(c.lessons.length,49);
 assert.equal(course.modules.reduce((n,m)=>n+m.minutes,0),600);
 assert.equal(course.modules.reduce((n,m)=>n+m.practiceMinutes,0),150);
 for(const mutate of [(c:AaseCourse)=>{c.modules[0].minutes++;},(c:AaseCourse)=>{c.modules[0].concepts[0].id='M01-01';},(c:AaseCourse)=>{c.modules[0].concepts.pop();}]){const c=structuredClone(course);mutate(c);assert.throws(()=>catalog(lessons,c));}
});
test('AASE draft and future content never enters public concepts or search',()=>{
 for(const state of ['draft','future']){
  const ls=structuredClone(lessons);ls[0].text.zh.summary='unpublished-marker';
  if(state==='draft')ls[0].status='draft';else {ls[0].publishedOn=ls[0].date='2099-01-01';if(ls[0].translations)ls[0].translations.en.publishedOn='2099-01-01';}
  const c=catalog(ls);assert.equal(c.lessons.length,lessons.length-1);assert.equal(c.concepts.find(x=>x.id===ls[0].id)!.lesson,null);
  assert.ok(!JSON.stringify(c.concepts).includes('unpublished-marker'));assert.ok(!JSON.stringify(c.searchEntries).includes('unpublished-marker'));
 }
});
test('AASE validation rejects malformed dates, sources, figures and answer keys',()=>{
 for(const mutate of [(l:AaseLesson)=>{l.publishedOn='2026-02-30';},(l:AaseLesson)=>{l.sourceIds=['missing'];},(l:AaseLesson)=>{l.checks[0].answer=4;},(l:AaseLesson)=>{l.text.zh.sections[2].blocks![0].kind='html' as 'flow';},(l:AaseLesson)=>{l.text.zh.exercise.steps=[];}]){const ls=structuredClone(lessons);const l=ls.find(x=>x.id==='AASE-M01-C01')!;mutate(l);assert.throws(()=>catalog(ls));}
});
test('only published AASE routes exist; pending neighbors land on directory anchors',()=>{
 assert.equal(routes.filter(r=>r.kind.startsWith('aase')&&r.lang==='zh').length,11+catalog().lessons.length);
 for(const c of catalog().concepts){
  const page=getPage(c.href);
  if(c.lesson){assert.equal(page?.aaseConcept?.id,c.id);assert.equal(page!.selected.length,0);assert.equal(page!.module,undefined);for(const n of page!.aaseNavigation){assert.ok(n.pending?n.href.includes('#'):getPage(n.href));}}
  else assert.equal(page,null);
  assert.equal(Boolean(getPage('/en'+c.href)),Boolean(catalog().forLanguage('en')?.concepts.find(e=>e.id===c.id)?.lesson));
 }
 assert.ok(getPage('/en/courses/aase/v1/'));
 assert.equal(getPage('/en/courses/aase/v1/m01/concepts/m01-02/'),null);
 assert.ok(getPage('/courses/ceh/v13/m01/concepts/m01-01/'));
 assert.ok(!searchEntries.some(e=>e.id.startsWith('AASE-M')&&!catalog().lessons.some(l=>l.id===e.id)));
 const aaseSearch=searchEntries.find(e=>e.id==='AASE-M05-C03')!;
 assert.ok(aaseSearch.text.includes('結果過期'));
 assert.ok(aaseSearch.text.includes('字串'));
});
test('AASE adopts CEH field names without losing original teaching, examples or answer keys',()=>{
 for(const l of lessons.filter(l=>['AASE-M01-C01','AASE-M03-C01','AASE-M04-C05','AASE-M05-C03'].includes(l.id))){
  const old=read('docs/sources/aase/layout-2026-11-05/'+l.id.toLowerCase()+'.json');
  assert.equal(l.publishedOn,old.publishedOn);assert.equal(l.date,'2026-11-05');const secondPatch=['AASE-M01-C01','AASE-M03-C01','AASE-M05-C03'].includes(l.id);assert.equal(l.contentVersion,secondPatch?'1.0.2':'1.0.1');assert.equal(l.revision,old.revision+(secondPatch?2:1));
  assert.equal(l.text.zh.summary,old.summary);assert.deepEqual(l.text.zh.objectives,old.objectives);assert.deepEqual(l.text.zh.exercise,old.exercise);assert.deepEqual(l.qa,[]);
  assert.equal(l.text.zh.sections.length,old.sections.length);assert.equal(l.checks.length,old.checks.length);
  for(const [i,s] of l.text.zh.sections.entries()){
   assert.equal(s.id,old.sections[i].id);assert.equal(s.heading,old.sections[i].heading);assert.deepEqual(s.paragraphs,old.sections[i].paragraphs);
   if(old.sections[i].figure)assert.deepEqual((s.blocks!.find(b=>b.kind==='flow'||b.kind==='cards') as {items:unknown}).items,old.sections[i].figure.items);
   if(old.sections[i].code)assert.equal((s.blocks!.find(b=>'code'in b&&b.code) as {code:string}).code,old.sections[i].code);
  }
  for(const [i,q] of l.checks.entries()){assert.equal(q.answer,old.checks[i].answer);assert.deepEqual(q.text.zh!.rationales,old.checks[i].rationales);}
 }
});
test('AASE Q&A uses the CEH localized discussion fields without invented translations',()=>{
 const ls=structuredClone(lessons);ls[0].qa=[{id:'synthetic-qa',text:{zh:{question:'合成問題：完整代表什麼？',answer:['只代表教學欄位完整。']}}}];
 const c=catalog(ls);assert.ok(c.searchEntries.some(e=>e.text.includes('合成問題：完整代表什麼？')));
 ls[0].qa.push(structuredClone(ls[0].qa[0]));assert.throws(()=>catalog(ls));
 const bad=structuredClone(lessons);bad[0].text.zh.sections[0].id='discussion';assert.throws(()=>catalog(bad));
});

test('AASE M01 has four published lessons with substantive evidence and original checks',()=>{
 const m01=catalog().concepts.filter(c=>c.module==='m01');assert.equal(m01.length,4);assert.ok(m01.every(c=>c.lesson));
 for(const c of m01.slice(1)){const l=c.lesson!;assert.equal(l.contentVersion,'1.0.0');assert.equal(l.revision,1);assert.ok(l.text.zh.sections.length>=6);assert.ok(l.checks.length>=3);assert.deepEqual(l.qa,[]);assert.ok(l.text.zh.sections.some(s=>s.blocks?.some(b=>b.kind==='flow'||b.kind==='cards')));}
 const m03=m01.find(c=>c.id==='AASE-M01-C03')!.lesson!;assert.ok(m03.text.zh.sections.flatMap(s=>s.paragraphs).join(' ').includes('待實作'));
 const m04=m01.find(c=>c.id==='AASE-M01-C04')!.lesson!;assert.ok(m04.text.zh.sections.flatMap(s=>s.paragraphs).join(' ').includes('虛構示範回答'));
});
