import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createAaseCatalog,type AaseCourse,type AaseCourseTranslation,type AaseLesson,type AaseSource} from '../src/lib/aase.ts';
import {getPage,routes,searchEntries} from '../src/lib/server/catalog.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const course=read('content/aase/course.json') as AaseCourse;
const english=read('content/aase/course.en.json') as AaseCourseTranslation;
const sources=read('content/aase/sources.json') as AaseSource[];
const lessons=readdirSync('content/aase/lessons').map(f=>read('content/aase/lessons/'+f)) as AaseLesson[];
const build=(ls=lessons,en=english)=>createAaseCatalog(course,ls,sources,'2026-11-05',en);
const first=(ls:AaseLesson[])=>ls.find(l=>l.id==='AASE-M01-C01')!;
test('AASE English publishes reviewed teaching with complete directory metadata and stable identities',()=>{
 const c=build(),en=c.forLanguage('en')!;
 assert.equal(c.lessons.length,49);assert.equal(en.concepts.length,49);assert.equal(en.lessons.length,49);
 assert.deepEqual(en.modules.map(m=>[m.id,m.minutes,m.practiceMinutes]),c.modules.map(m=>[m.id,m.minutes,m.practiceMinutes]));
 assert.deepEqual(en.concepts.map(c=>c.id),c.concepts.map(c=>c.id));
 assert.equal(routes.filter(r=>r.kind.startsWith('aase')&&r.lang==='en').length,60);
 for(const row of en.concepts)assert.equal(Boolean(getPage(row.href)),Boolean(row.lesson));
 const page=getPage('/en/courses/aase/v1/m01/concepts/m01-01/')!;
 assert.equal(page.aaseConcept!.lesson!.text.en!.summary,first(lessons).text.en!.summary);
 assert.ok(!('zh' in page.aaseConcept!.lesson!.text));
 assert.equal(page.aaseCounterpart,'/courses/aase/v1/m01/concepts/m01-01/');
 assert.equal(page.aaseNavigation[0].href,'/en/courses/aase/v1/m01/concepts/m01-02/');assert.equal(page.aaseNavigation[0].pending,false);
 assert.equal(getPage('/courses/aase/v1/m01/concepts/m01-02/')!.aaseCounterpart,'/en/courses/aase/v1/m01/concepts/m01-02/');
 assert.equal(getPage('/courses/aase/v1/m09/concepts/m09-01/')!.aaseCounterpart,'/en/courses/aase/v1/m09/concepts/m09-01/');
 assert.ok(searchEntries.some(e=>e.id==='AASE-M01-C01'&&e.lang==='en'&&e.text.includes('production release')));
 assert.ok(searchEntries.some(e=>e.id==='AASE-M01-C02'&&e.lang==='en'));
 assert.ok(searchEntries.some(e=>e.id==='AASE-M09-C01'&&e.lang==='en'));
});
test('AASE translation drafts and future dates stay out of all public payloads without hiding Chinese',()=>{
 for(const state of ['draft','future'] as const){
  const ls=structuredClone(lessons),l=first(ls);l.text.en!.summary='EN_PRIVATE_MARKER';
  l.checks[0].text.en!.rationales[0]='EN_PRIVATE_CHECK_MARKER';
  l.qa=[{id:'translation-private-qa',text:{zh:{question:'合成問題',answer:['公開中文']},en:{question:'EN_PRIVATE_QA_MARKER',answer:['Private translation']}}}];
  if(state==='draft')l.translations!.en.status='draft';else l.translations!.en.publishedOn='2099-01-01';
  const c=build(ls);assert.equal(c.forLanguage('en')!.lessons.length,48);assert.equal(c.lessons.length,49);
  assert.ok(c.searchEntries.some(e=>e.text.includes('公開中文')));
  for(const publicPart of [c.concepts,c.searchEntries,c.forLanguage('en')])assert.ok(!JSON.stringify(publicPart).includes('EN_PRIVATE_'));
 }
});
test('AASE course translation and base article gates independently close English publication',()=>{
 for(const state of ['draft','future'] as const){
  const en=structuredClone(english);if(state==='draft')en.status='draft';else en.publishedOn='2099-01-01';
  const c=build(lessons,en);assert.equal(c.forLanguage('en'),null);assert.equal(c.lessons.length,49);
  const ls=structuredClone(lessons),l=first(ls);
  if(state==='draft')l.status='draft';else l.publishedOn=l.date=l.translations!.en.publishedOn='2099-01-01';
  const closed=build(ls);assert.equal(closed.lessons.length,48);assert.equal(closed.forLanguage('en')!.lessons.length,48);
 }
});
test('AASE rejects incomplete, misaligned or unauthorized translation structures',()=>{
 const mutations:((l:AaseLesson)=>void)[]=[
  l=>{delete l.translations;},l=>{(l.translations!.en as any).unknown='not allowed';},l=>{l.translations!.en.publishedOn='2026-02-30';},
  l=>{l.text.en!.sections.pop();},l=>{l.text.en!.sections[0].paragraphs.pop();},
  l=>{l.text.en!.sections[0].id='renamed';},l=>{l.text.en!.exercise.steps.pop();},
  l=>{delete l.checks[0].text.en;},l=>{l.checks[0].text.en!.options.pop();},
  l=>{(l.text as any).fr=l.text.en;},l=>{(l.translations as any).fr=l.translations!.en;},
  l=>{(l.text.en!.sections.find(s=>s.id==='trace')!.blocks![0] as any).items.pop();},
  l=>{l.text.en!.sections[3].sourceIds=['c4'];}
 ];
 for(const mutate of mutations){const ls=structuredClone(lessons);mutate(first(ls));assert.throws(()=>build(ls));}
 const injected=structuredClone(english);(injected.modules[0].concepts[0] as any).slug='overridden';assert.throws(()=>build(lessons,injected));
 const en=structuredClone(english);en.modules[0].concepts[0].id='M01-01';assert.throws(()=>build(lessons,en));
 const reordered=structuredClone(english);reordered.modules.reverse();assert.throws(()=>build(lessons,reordered));
});
test('AASE bilingual code and graph identity remain invariant, and search uses localized graph labels',()=>{
 const ls=structuredClone(lessons),l=first(ls);
 for(const lang of ['zh','en'] as const)l.text[lang]!.sections[0].blocks=[{kind:'step',id:'example',heading:'Example',paragraphs:['Example'],code:'print(42)'}];
 build(ls);(l.text.en!.sections[0].blocks![0] as any).code='print(43)';assert.throws(()=>build(ls));
 const graph=structuredClone(lessons.find(l=>l.id==='AASE-M06-C02')!.text.zh.sections.flatMap(s=>s.blocks??[]).find(b=>b.kind==='architecture')!);
 for(const lang of ['zh','en'] as const)l.text[lang]!.sections[0].blocks=[structuredClone(graph)];
 const c=build(ls);assert.ok(c.forLanguage('en')!.searchEntries[0].text.includes('Outside the system scope'));
 const enGraph=l.text.en!.sections[0].blocks![0];if(enGraph.kind==='architecture')enGraph.relations[0].to=enGraph.relations[0].from;
 assert.throws(()=>build(ls));
});
test('historic AASE first-English edition preserves Chinese teaching in the pre-replacement archive',()=>{
 const before=read('docs/sources/aase/bilingual-2026-11-05/aase-m01-c01.before.json');const l=read('docs/sources/aase/m01-01/replacement-2026-11-06/previous-v1.0.3.json');
 assert.deepEqual(l.text.zh,before.text.zh);assert.equal(l.publishedOn,before.publishedOn);assert.deepEqual(l.sourceIds,before.sourceIds);assert.deepEqual(l.qa,[]);
 assert.equal(l.revision,before.revision+2);assert.equal(l.contentVersion,'1.0.3');
 for(const [i,q] of l.checks.entries()){assert.equal(q.id,before.checks[i].id);assert.equal(q.answer,before.checks[i].answer);assert.deepEqual(q.text.zh,before.checks[i].text.zh);}
 const current=first(lessons);const en=build().forLanguage('en')!.lessons.find(x=>x.id===l.id)!;assert.equal(en.publishedOn,current.publishedOn);assert.equal(en.date,current.date);assert.equal(en.contentVersion,current.contentVersion);
});

test('historic M01 English additions retain Chinese teaching and original acceptance keys',()=>{
 for(const number of ['02','03','04']){
  const before=read(`docs/sources/aase/m01-en/aase-m01-c${number}.before.json`),l=read(`docs/sources/aase/m01-${number}/replacement-2026-11-06/${number==='04'?'previous.json':'previous-v1.0.2.json'}`);
  assert.deepEqual(l.text.zh,before.text.zh);assert.equal(l.publishedOn,before.publishedOn);assert.deepEqual(l.sourceIds,before.sourceIds);assert.deepEqual(l.qa,before.qa);
  assert.equal(l.contentVersion,'1.0.2');assert.equal(l.revision,before.revision+2);assert.equal(l.date,'2026-11-05');
  assert.equal(l.text.en!.sections.length,before.text.zh.sections.length);assert.equal(l.checks.length,3);
  for(const [i,q] of l.checks.entries()){assert.equal(q.id,before.checks[i].id);assert.equal(q.answer,before.checks[i].answer);assert.deepEqual(q.text.zh,before.checks[i].text.zh);assert.equal(q.text.en!.options.length,4);assert.equal(q.text.en!.rationales.length,4);}
 }
 const en=build().forLanguage('en')!;
 assert.deepEqual(en.lessons.map(l=>l.id).sort(),['AASE-M01-C01','AASE-M01-C02','AASE-M01-C03','AASE-M01-C04',...Array.from({length:6},(_,i)=>`AASE-M02-C0${i+1}`),...Array.from({length:5},(_,i)=>`AASE-M03-C0${i+1}`),...Array.from({length:6},(_,i)=>`AASE-M04-C0${i+1}`),...Array.from({length:5},(_,i)=>`AASE-M05-C0${i+1}`),...Array.from({length:6},(_,i)=>`AASE-M06-C0${i+1}`),...Array.from({length:7},(_,i)=>`AASE-M07-C0${i+1}`),...Array.from({length:6},(_,i)=>`AASE-M08-C0${i+1}`),...Array.from({length:4},(_,i)=>`AASE-M09-C0${i+1}`)]);
 const last=getPage('/en/courses/aase/v1/m08/concepts/m08-06/')!;
 assert.equal(last.aaseNavigation.find(n=>n.side==='next')!.href,'/en/courses/aase/v1/m09/concepts/m09-01/');
});

test('M03 English preserves Chinese sources, synthetic records, checks and version history',()=>{
 for(let n=1;n<=5;n++){
  const before=read(`docs/sources/aase/m03-en/aase-m03-c0${n}.before.json`),l=n===3?read('docs/sources/aase/m03-03/replacement-2026-11-11/prior-lesson.json'):n===4?read('docs/sources/aase/m03-04/replacement-2026-11-09/prior-lesson.json'):n===5?read('docs/sources/aase/m03-05/replacement-2026-11-09/prior-lesson.json'):n===1?read('docs/sources/aase/m03-01/replacement-2026-11-07/previous.json'):n===2?read('docs/sources/aase/m03-02/replacement-2026-11-07/prior-lesson.json'):lessons.find(x=>x.id===before.id)!;
  assert.deepEqual(l.text.zh,before.text.zh);assert.equal(l.publishedOn,before.publishedOn);assert.deepEqual(l.sourceIds,before.sourceIds);assert.deepEqual(l.qa,before.qa);
  assert.equal(l.contentVersion,n===1?'1.0.4':'1.0.2');assert.equal(l.revision,before.revision+2);assert.equal(l.date,'2026-11-05');
  for(const [i,q] of l.checks.entries()){assert.equal(q.id,before.checks[i].id);assert.equal(q.answer,before.checks[i].answer);assert.deepEqual(q.text.zh,before.checks[i].text.zh);assert.equal(q.text.en!.options.length,4);assert.equal(q.text.en!.rationales.length,4);}
  const en=getPage('/en/courses/aase/v1/m03/concepts/m03-0'+n+'/')!.aaseConcept!.lesson!;
  assert.ok(en.text.en);assert.ok(!en.text.zh);const historical=l.text.en;assert.deepEqual(historical.sections.flatMap((s:any)=>s.blocks??[]).flatMap((b:any)=>'code' in b?[b.code]:[]),before.text.zh.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>'code' in b).map((b:any)=>b.code));
 }
});

test('M04 English preserves Chinese evidence boundaries, original diagrams, checks and templates',()=>{
 for(let n=1;n<=6;n++){
  const before=read(`docs/sources/aase/m04-en/aase-m04-c0${n}.before.json`),l=n===5?read('docs/sources/aase/m04-05/replacement-2026-11-11/previous/aase-m04-c05.json'):n===3?read('docs/sources/aase/m04-03/replacement-2026-11-11/prior-lesson.json'):n===4?read('docs/sources/aase/m04-04/replacement-2026-11-11/prior-lesson.json'):n===6?read('docs/sources/aase/m04-06/replacement-2026-11-11/prior-lesson.json'):n===2?read('docs/sources/aase/m04-02/replacement-2026-11-11/prior-lesson.json'):n===1?read('docs/sources/aase/m04-01/replacement-2026-11-09/prior-lesson.json'):lessons.find(x=>x.id===before.id)!;
  assert.deepEqual(l.text.zh,before.text.zh);assert.equal(l.publishedOn,before.publishedOn);assert.deepEqual(l.sourceIds,before.sourceIds);assert.deepEqual(l.qa,before.qa);
  assert.equal(l.contentVersion,n===5?'1.0.3':'1.0.2');assert.equal(l.revision,before.revision+2);assert.equal(l.date,'2026-11-05');
  for(const [i,q] of l.checks.entries()){assert.equal(q.id,before.checks[i].id);assert.equal(q.answer,before.checks[i].answer);assert.deepEqual(q.text.zh,before.checks[i].text.zh);assert.equal(q.text.en!.options.length,4);assert.equal(q.text.en!.rationales.length,4);}
  const en=getPage('/en/courses/aase/v1/m04/concepts/m04-0'+n+'/')!.aaseConcept!.lesson!;
  assert.ok(en.text.en);assert.ok(!en.text.zh);assert.deepEqual((l.text.en as typeof en.text.en).sections.flatMap(s=>s.blocks??[]).flatMap(b=>'code' in b?[b.code]:[]),before.text.zh.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>'code' in b).map((b:any)=>b.code));
 }
});

test('M05 English preserves Chinese rules, candidate status, answer keys and template bytes',()=>{
 for(let n=1;n<=5;n++){
  const before=read(`docs/sources/aase/m05-en/aase-m05-c0${n}.before.json`),l=n===3?read('docs/sources/aase/m05-03/replacement-2026-11-11/prior-lesson.json'):n===1?read('docs/sources/aase/m05-01/replacement-2026-11-11/previous/aase-m05-c01.json'):n===4?read('docs/sources/aase/m05-04/replacement-2026-11-11/previous/lesson.json'):lessons.find(x=>x.id===before.id)!;
  assert.deepEqual(l.text.zh,before.text.zh);assert.equal(l.publishedOn,before.publishedOn);assert.deepEqual(l.sourceIds,before.sourceIds);assert.deepEqual(l.qa,before.qa);
  assert.equal(l.contentVersion,n===3?'1.0.4':'1.0.2');assert.equal(l.revision,before.revision+2);assert.equal(l.date,'2026-11-05');
  for(const [i,q] of l.checks.entries()){assert.equal(q.id,before.checks[i].id);assert.equal(q.answer,before.checks[i].answer);assert.deepEqual(q.text.zh,before.checks[i].text.zh);assert.equal(q.text.en!.options.length,4);assert.equal(q.text.en!.rationales.length,4);}
  const en=n===1||n===3||n===4?{text:{en:l.text.en,zh:undefined}}:getPage('/en/courses/aase/v1/m05/concepts/m05-0'+n+'/')!.aaseConcept!.lesson!;
  assert.ok(en.text.en);assert.ok(!en.text.zh);assert.deepEqual(en.text.en.sections.flatMap((s:any)=>s.blocks??[]).flatMap((b:any)=>'code' in b?[b.code]:[]),before.text.zh.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>'code' in b).map((b:any)=>b.code));
 }
 assert.equal(build().concepts.find(c=>c.id==='AASE-M05-C05')!.workshopDepth,'extension');
});

test('M06 English preserves Chinese architecture, graph identities, code and answer semantics',()=>{
 for(let n=1;n<=6;n++){
  const before=read(`docs/sources/aase/m06-en/aase-m06-c0${n}.before.json`),l=lessons.find(x=>x.id===before.id)!;
  assert.deepEqual(l.text.zh,before.text.zh);assert.deepEqual(l.sourceIds,before.sourceIds);assert.deepEqual(l.qa,before.qa);assert.equal(l.publishedOn,before.publishedOn);
  assert.equal(l.contentVersion,'1.0.2');assert.equal(l.revision,before.revision+2);assert.equal(l.date,'2026-11-05');
  for(const [i,q] of l.checks.entries()){assert.equal(q.id,before.checks[i].id);assert.equal(q.answer,before.checks[i].answer);assert.deepEqual(q.text.zh,before.checks[i].text.zh);}
  const shape=(t:any)=>t.sections.flatMap((s:any)=>(s.blocks??[]).map((b:any)=>b.kind==='architecture'?{kind:b.kind,level:b.level,nodes:b.nodes.map(({id,kind,inside}:any)=>({id,kind,inside})),relations:b.relations.map(({from,to}:any)=>({from,to}))}:b.kind==='step'?{kind:b.kind,code:b.code}:{kind:b.kind}));
  assert.deepEqual(shape(l.text.en),shape(before.text.zh));
 }
 const en=build().forLanguage('en')!;assert.ok(en.searchEntries.some(e=>e.id==='AASE-M06-C03'&&e.text.includes('Operator’s download folder')));
});

test('M07 English preserves Chinese slices, executable examples, sources and answer keys',()=>{
 let codeCount=0;
 for(let n=1;n<=7;n++){
  const before=read(`docs/sources/aase/m07-en/aase-m07-c0${n}.before.json`),l=lessons.find(x=>x.id===before.id)!;
  assert.deepEqual(l.text.zh,before.text.zh);assert.deepEqual(l.sourceIds,before.sourceIds);assert.deepEqual(l.qa,before.qa);assert.equal(l.publishedOn,before.publishedOn);
  assert.equal(l.contentVersion,'1.0.2');assert.equal(l.revision,before.revision+2);assert.equal(l.date,'2026-11-05');
  for(const [i,q] of l.checks.entries()){assert.equal(q.id,before.checks[i].id);assert.equal(q.answer,before.checks[i].answer);assert.deepEqual(q.text.zh,before.checks[i].text.zh);}
  const codes=(t:any)=>t.sections.flatMap((s:any)=>(s.blocks??[]).filter((b:any)=>'code'in b).map((b:any)=>b.code));
  assert.deepEqual(codes(l.text.en),codes(before.text.zh));codeCount+=codes(l.text.en).length;
 }
 assert.equal(codeCount,10);
 const last=getPage('/en/courses/aase/v1/m08/concepts/m08-06/')!;assert.equal(last.aaseNavigation.find(n=>n.side==='next')!.href,'/en/courses/aase/v1/m09/concepts/m09-01/');
});

test('M08 English preserves Chinese verification layers, executable examples and answer semantics',()=>{
 let codeCount=0;
 for(let n=1;n<=6;n++){
  const before=read(`docs/sources/aase/m08-en/aase-m08-c0${n}.before.json`),l=lessons.find(x=>x.id===before.id)!;
  assert.deepEqual(l.text.zh,before.text.zh);assert.deepEqual(l.sourceIds,before.sourceIds);assert.deepEqual(l.qa,before.qa);assert.equal(l.publishedOn,before.publishedOn);
  assert.equal(l.contentVersion,'1.0.2');assert.equal(l.revision,before.revision+2);assert.equal(l.date,'2026-11-05');
  for(const [i,q] of l.checks.entries()){assert.equal(q.id,before.checks[i].id);assert.equal(q.answer,before.checks[i].answer);assert.deepEqual(q.text.zh,before.checks[i].text.zh);}
  const codes=(t:any)=>t.sections.flatMap((s:any)=>(s.blocks??[]).filter((b:any)=>'code'in b).map((b:any)=>b.code));assert.deepEqual(codes(l.text.en),codes(before.text.zh));codeCount+=codes(l.text.en).length;
 }
 assert.equal(codeCount,10);
 const en=build().forLanguage('en')!;assert.ok(en.searchEntries.some(e=>e.id==='AASE-M08-C05'&&e.text.includes('human observation has not happened')));
});

test('M09 English preserves Chinese handoff, Git examples and actual assessment boundaries',()=>{
 let codeCount=0;
 for(let n=1;n<=4;n++){
  const before=read(`docs/sources/aase/m09-en/aase-m09-c0${n}.before.json`),l=lessons.find(x=>x.id===before.id)!;
  assert.deepEqual(l.text.zh,before.text.zh);assert.deepEqual(l.sourceIds,before.sourceIds);assert.deepEqual(l.qa,before.qa);assert.equal(l.publishedOn,before.publishedOn);
  assert.equal(l.contentVersion,'1.0.2');assert.equal(l.revision,before.revision+2);assert.equal(l.date,'2026-11-05');
  for(const [i,q] of l.checks.entries()){assert.equal(q.id,before.checks[i].id);assert.equal(q.answer,before.checks[i].answer);assert.deepEqual(q.text.zh,before.checks[i].text.zh);}
  const codes=(t:any)=>t.sections.flatMap((s:any)=>(s.blocks??[]).filter((b:any)=>'code'in b).map((b:any)=>b.code));assert.deepEqual(codes(l.text.en),codes(before.text.zh));codeCount+=codes(l.text.en).length;
 }
 assert.equal(codeCount,7);assert.equal(build().forLanguage('en')!.lessons.length,49);
 const last=getPage('/en/courses/aase/v1/m09/concepts/m09-04/')!;assert.ok(!last.aaseNavigation.some(n=>n.side==='next'));
});
