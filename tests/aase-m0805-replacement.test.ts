import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createAaseCatalog} from '../src/lib/aase.ts';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root='docs/sources/aase/m08-05/replacement-2026-11-11/';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m08-c05.json','utf8'));
const flat=(v:any):string[]=>typeof v==='string'?[v]:Array.isArray(v)?v.flatMap(flat):v&&typeof v==='object'?Object.values(v).flatMap(flat):[];
const norm=(s:string)=>s.replace(/[^\p{L}\p{N}]/gu,'');
test('M08-05: source custody, complete bilingual manuscript adoption and synchronized exports',()=>{
 for(const line of readFileSync(root+'SHA256SUMS','utf8').trim().split('\n')){const [hash,name]=line.split('  ');assert.equal(createHash('sha256').update(readFileSync(root+name)).digest('hex'),hash);}
 execFileSync('python3',['scripts/aase_m0805_content.py','--check']);execFileSync('python3',['scripts/aase_m0805_svg.py','--check']);
 for(const lang of ['zh','en']){
  const corpus=norm(flat(lesson.text[lang]).join(' '));
  for(const line of readFileSync(root+`teaching.${lang}.md`,'utf8').split('\n')){
   if(!line.trim()||/^# |^@figure/.test(line))continue;
   if(line.startsWith('|')){for(const cell of line.split('|').slice(1,-1))if(!/^[- :]+$/.test(cell))assert(corpus.includes(norm(cell)),cell);}
   else assert(corpus.includes(norm(line.replace(/^#{1,3} /,''))),line);
  }
  const ss=lesson.text[lang].sections;assert.equal(ss.length,11);
  for(const id of ['question','analogy','task','observe','notes','misread'])assert(ss.some((s:any)=>s.id===id));
  assert.equal(ss.find((s:any)=>s.id==='workflow').blocks.find((b:any)=>b.kind==='flow').items.length,6);
  assert.equal(ss.find((s:any)=>s.id==='notes').blocks.find((b:any)=>b.kind==='table').rows.length,9);
  for(let n=1;n<=3;n++)assert(readFileSync(`site/images/aase/m08-05-${n}-${lang}.svg`).length<100000);
 }
 assert.equal(lesson.checks[0].answer,2);assert.equal(lesson.publishedOn,'2026-11-05');assert.equal(lesson.contentVersion,'1.1.0');assert.deepEqual(lesson.qa,[]);
});

test('M08-05: rejects changed flow cardinality and record fields',()=>{
 const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
 const course=read('content/aase/course.json'),en=read('content/aase/course.en.json'),sources=read('content/aase/sources.json');
 const lessons=readdirSync('content/aase/lessons').filter(p=>p.endsWith('.json')).map(p=>read('content/aase/lessons/'+p));
 for(const mutate of [(l:any)=>l.text.zh.sections.find((s:any)=>s.id==='workflow').blocks.find((b:any)=>b.kind==='flow').items.pop(),(l:any)=>l.text.zh.sections.find((s:any)=>s.id==='notes').blocks.find((b:any)=>b.kind==='table').rows.pop()]){
  const ls=structuredClone(lessons);const target=ls.find(l=>l.id===lesson.id);mutate(target);const enTarget={text:{zh:target.text.en}};mutate(enTarget);assert.throws(()=>createAaseCatalog(course,ls,sources,'2026-11-11',en),/invalid usability/);
 }
});
