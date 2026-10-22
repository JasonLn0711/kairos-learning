import test from 'node:test';
import assert from 'node:assert/strict';
import { allLessons, lessons, modules, sources, allTerms as terms, routes, searchEntries, getPage } from '../src/lib/server/catalog.ts';
import { validateContent } from '../src/lib/validate.ts';
import { isPublic, search, lessonPath } from '../src/lib/model.ts';
import { emptyProgress, readProgress, recordAnswer, wrongQuestions } from '../src/lib/progress.ts';
const q=lessons.find(l=>l.id==='ceh-m04-enumeration')!.questions[0];
test('published curriculum is complete, bilingual and internally consistent',()=>{
  assert.deepEqual(validateContent(allLessons,modules,sources,terms),[]);
  assert.ok(lessons.length >= 23); assert.ok(lessons.filter(l=>l.module==='m01').length >= 2);
  for(const m of modules) assert.ok(lessons.some(l=>l.course==='ceh'&&l.module===m.id));
  for(const c of ['ai-ml','networking']) assert.ok(lessons.filter(l=>l.course===c).length >= 1);
  assert.ok(lessons.filter(l=>l.module==='m01').flatMap(l=>l.questions).length>=5);
});
test('validation rejects missing translations, broken relations and invalid answer keys',()=>{
  const changed=structuredClone(allLessons); const l=changed[0];
  l.text.en.summary=''; l.related.push('missing-lesson'); l.questions[0].answer=4;
  const errors=validateContent(changed,modules,sources,terms);
  assert.ok(errors.some(e=>e.includes('title/summary'))); assert.ok(errors.some(e=>e.includes('missing-lesson'))); assert.ok(errors.some(e=>e.includes('valid answer')));
});
test('validation catches prerequisite cycles and missing rationale',()=>{
  const changed=structuredClone(allLessons); changed[0].prerequisites=[changed[1].id]; changed[1].prerequisites=[changed[0].id]; changed[0].questions[0].text.en.rationales.pop();
  const errors=validateContent(changed,modules,sources,terms); assert.ok(errors.some(e=>e.includes('cycle'))); assert.ok(errors.some(e=>e.includes('rationales')));
});
test('drafts and future dates are closed at the shared publication gate',()=>{
  assert.equal(isPublic({status:'draft',publishedOn:'2026-10-23'},'2026-10-23'),false);
  assert.equal(isPublic({status:'published',publishedOn:'2099-01-01'},'2026-10-23'),false);
  assert.equal(isPublic({status:'published',publishedOn:'2026-10-23'},'2026-10-23'),true);
});
test('every lesson has paired routes and translated content without broken paths',()=>{
  assert.equal(new Set(routes.map(r=>r.path)).size,routes.length);
  for(const l of lessons) for(const lang of ['zh','en'] as const) assert.equal(getPage(lessonPath(l,lang))?.selected[0].id,l.id);
  assert.equal(getPage('/missing/'),null);
});
test('search supports Chinese, case folding and fullwidth input without HTML execution',()=>{
  assert.ok(search(searchEntries,'列舉','zh').some(e=>e.id==='ceh-m04-enumeration'));
  assert.ok(search(searchEntries,'ＳＭＢ','en').some(e=>e.id==='ceh-m04-enumeration'));
  assert.equal(search(searchEntries,'<script>missing</script>','en').length,0);
  assert.equal(search(searchEntries,'  ','zh').length,0);
});
test('corrupt or structurally invalid browser data recovers without crashing',()=>{
  for(const raw of ['{','null','[]','{"version":2,"answers":{}}','{"version":1,"answers":[]}']) assert.deepEqual(readProgress(raw),emptyProgress());
  assert.deepEqual(readProgress('{"version":1,"answers":{"bad":{"choice":99}}}'),emptyProgress());
});
test('wrong answers persist, corrections leave the review set, and revisions reset attempts',()=>{
  const wrong=(q.answer+1)%4;
  let p=recordAnswer(emptyProgress(),q,wrong,'low','2026-10-23T01:00:00Z');
  p=readProgress(JSON.stringify(p)); assert.deepEqual(wrongQuestions(p,[q]),[q]);
  p=recordAnswer(p,q,q.answer,'high','2026-10-23T01:01:00Z'); assert.equal(wrongQuestions(p,[q]).length,0); assert.equal(p.answers[q.id].attempts,2);
  const revised={...q,revision:q.revision+1}; assert.equal(wrongQuestions(p,[revised]).length,0);
  p=recordAnswer(p,revised,wrong,'medium','2026-10-23T01:02:00Z'); assert.equal(p.answers[q.id].attempts,1);
});
test('review checks the current answer key instead of trusting stored correctness',()=>{
  const p=recordAnswer(emptyProgress(),q,(q.answer+1)%4,'low','2026-10-23T01:00:00Z'); p.answers[q.id].correct=true;
  assert.equal(wrongQuestions(p,[q]).length,1);
  assert.throws(()=>recordAnswer(p,q,8,'low','2026-10-23T01:00:00Z'));
});
test('M04 port-open example preserves the approved answer B in both languages',()=>{
  assert.equal(q.answer,1); assert.match(q.text.zh.options[1],/服務與實際回應/); assert.match(q.text.en.options[1],/service and actual response/);
});

test('search reaches worked examples, exercise checks and answer explanations',()=>{
  const lesson=lessons.find(l=>l.id==='ceh-m04-enumeration')!;
  for(const lang of ['zh','en'] as const) {
    for(const query of [lesson.text[lang].example.conclusion,lesson.text[lang].lab.check,lesson.questions[0].text[lang].rationales[1]])
      assert.ok(search(searchEntries,query,lang).some(e=>e.id===lesson.id));
  }
});
