import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {aaseUI} from '../src/lib/aase-ui.ts';
import {createAaseCatalog,type AaseLesson} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m01-04/replacement-2026-11-06/';
const lesson=read('content/aase/lessons/aase-m01-c04.json');
const before=read(root+'previous.json');
const build=(l:AaseLesson)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-06',read('content/aase/course.en.json'));
test('M01-04 keeps publication identity and all supplied content with complete paired teaching',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.equal(lesson.date,'2026-11-06');assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en']){
  const t=lesson.text[lang];assert.equal(t.sections.length,9);assert.deepEqual(t.exercise,before.text[lang].exercise);
  for(const id of before.text[lang].sections.map((s:any)=>s.id))assert.ok(t.sections.some((s:any)=>s.id===id));
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);assert.equal(blocks.filter((b:any)=>b.kind==='table').length,2);assert.equal(blocks.filter((b:any)=>b.kind==='flow').length,1);assert.equal(blocks.filter((b:any)=>b.kind==='cards').length,2);
  assert.deepEqual(lesson.checks.map((q:any)=>q.text[lang].options.length),[3,3,3]);
 }
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,2,1]);assert.doesNotThrow(()=>build(lesson));
 const map=read(root+'source-paragraph-map.json');const raw=readFileSync(root+'pasted-text-1.txt','utf8').split('\n\n').map(s=>s.trim());assert.deepEqual(map.map((r:any)=>r.source),raw);assert.equal(map.length,123);assert.ok(map.every((r:any)=>r.anchor&&r.disposition&&r.evidence));assert.deepEqual(map.filter((r:any)=>r.disposition==='retained-question-option').map((r:any)=>r.evidence),lesson.checks.flatMap((q:any)=>q.text.zh.options));assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:root}).status,0);
});
test('the three bounded diagram relationships reject wrong kinds and node counts',()=>{
 for(const id of ['analogy','workflow','testing'])for(const change of ['add','remove','kind']){
  const l=structuredClone(lesson);
  for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===id).blocks[0];if(change==='add')b.items.push({...b.items[0]});else if(change==='remove')b.items.pop();else b.kind=b.kind==='cards'?'flow':'cards';}
  assert.throws(()=>build(l),/invalid requirements interview figure/);
 }
});
test('the supplied form-validation fragment rejects an omitted type and accepts a selected type',()=>{
 const code=lesson.text.zh.sections.find((s:any)=>s.id==='synthetic').blocks.find((b:any)=>b.code).code;
 const check=new Function('documentType','showError',code+'\nreturn "accepted";');
 for(const input of [undefined,null,'']){const errors:string[]=[];assert.equal(check(input,(message:string)=>errors.push(message)),undefined);assert.deepEqual(errors,['請選擇文件類型']);}
 assert.equal(check('report',()=>assert.fail('unexpected error')),'accepted');
});
test('downloaded SVG exports remain generated from the same bilingual figure data',()=>{
 const result=spawnSync('python3',['scripts/aase_m0104_svg.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
});

test('each adopted source paragraph has substantive evidence in the body, tables, code or shared check heading',()=>{
 const strings=(value:any):string[]=>typeof value==='string'?[value]:Array.isArray(value)?value.flatMap(strings):value&&typeof value==='object'?Object.values(value).flatMap(strings):[];
 const body=strings({text:lesson.text.zh,checks:lesson.checks}).join('\n');
 for(const row of read(root+'source-paragraph-map.json')){
  if(row.disposition==='replaced-static-quiz-ui')continue;
  if(row.disposition==='shared-check-heading'){assert.equal(row.evidence,aaseUI.zh.lesson.checks);continue;}
  if([24,54].includes(row.index)){for(const line of row.source.split('\n').slice(2))for(const cell of line.replace(/^\||\|$/g,'').split('|'))assert.ok(body.includes(cell.trim()));}
  else if(row.index===72)assert.ok(body.includes(row.source.slice(4,-4)));
  else assert.ok(body.includes(row.evidence),`missing source ${row.index}`);
 }
});
