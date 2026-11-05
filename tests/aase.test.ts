import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createAaseCatalog,type AaseLesson,type AaseCourse,type AaseSource} from '../src/lib/aase.ts';
import {getPage,routes,searchEntries} from '../src/lib/server/catalog.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const course=read('content/aase/course.json') as AaseCourse;
const lessons=readdirSync('content/aase/lessons').map(f=>read('content/aase/lessons/'+f)) as AaseLesson[];
const sources=read('content/aase/sources.json') as AaseSource[];
const catalog=(ls=lessons,c=course)=>createAaseCatalog(c,ls,sources,'2026-11-05');
test('AASE has independent 49 IDs, nine modules and exact workshop allocation',()=>{
 const c=catalog();assert.equal(c.concepts.length,49);assert.equal(c.lessons.length,4);
 assert.equal(course.modules.reduce((n,m)=>n+m.minutes,0),600);
 assert.equal(course.modules.reduce((n,m)=>n+m.practiceMinutes,0),150);
 for(const mutate of [(c:AaseCourse)=>{c.modules[0].minutes++;},(c:AaseCourse)=>{c.modules[0].concepts[0].id='M01-01';},(c:AaseCourse)=>{c.modules[0].concepts.pop();}]){const c=structuredClone(course);mutate(c);assert.throws(()=>catalog(lessons,c));}
});
test('AASE draft and future content never enters public concepts or search',()=>{
 for(const state of ['draft','future']){
  const ls=structuredClone(lessons);ls[0].summary='unpublished-marker';
  if(state==='draft')ls[0].status='draft';else ls[0].publishedOn=ls[0].revisedOn='2099-01-01';
  const c=catalog(ls);assert.equal(c.lessons.length,3);assert.equal(c.concepts.find(x=>x.id===ls[0].id)!.lesson,null);
  assert.ok(!JSON.stringify(c.concepts).includes('unpublished-marker'));assert.ok(!JSON.stringify(c.searchEntries).includes('unpublished-marker'));
 }
});
test('AASE validation rejects malformed dates, sources, figures and answer keys',()=>{
 for(const mutate of [(l:AaseLesson)=>{l.publishedOn='2026-02-30';},(l:AaseLesson)=>{l.sourceIds=['missing'];},(l:AaseLesson)=>{l.checks[0].answer=4;},(l:AaseLesson)=>{l.sections[2].figure!.kind='html' as 'flow';},(l:AaseLesson)=>{l.exercise.steps=[];}]){const ls=structuredClone(lessons);const l=ls.find(x=>x.id==='AASE-M01-C01')!;mutate(l);assert.throws(()=>catalog(ls));}
});
test('only published AASE routes exist; pending neighbors land on directory anchors',()=>{
 assert.equal(routes.filter(r=>r.kind.startsWith('aase')).length,15);
 for(const c of catalog().concepts){
  const page=getPage(c.href);
  if(c.lesson){assert.equal(page?.aaseConcept?.id,c.id);assert.equal(page!.selected.length,0);assert.equal(page!.module,undefined);for(const n of page!.aaseNavigation){assert.ok(n.pending?n.href.includes('#'):getPage(n.href));}}
  else assert.equal(page,null);
  assert.equal(getPage('/en'+c.href),null);
 }
 assert.equal(getPage('/en/courses/aase/v1/'),null);
 assert.ok(getPage('/courses/ceh/v13/m01/concepts/m01-01/'));
 assert.ok(!searchEntries.some(e=>e.id.startsWith('AASE-M')&&!catalog().lessons.some(l=>l.id===e.id)));
 const aaseSearch=searchEntries.find(e=>e.id==='AASE-M05-C03')!;
 assert.ok(aaseSearch.text.includes('結果過期'));
 assert.ok(aaseSearch.text.includes('字串'));
});
