import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m05-02/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m05-c02.json');
const flat=(v:any):string[]=>typeof v==='string'?[v]:Array.isArray(v)?v.flatMap(flat):v&&typeof v==='object'?Object.values(v).flatMap(flat):[];
const norm=(s:string)=>s.replace(/[^\p{L}\p{N}]/gu,'');
test('M05-02 preserves original source bytes and reproduces complete bilingual content and figures',()=>{
 for(const [name,m] of Object.entries(read(root+'manifest.json')) as any){const b=readFileSync(root+name);assert.equal(b.length,m.bytes);assert.equal(createHash('sha256').update(b).digest('hex'),m.sha256);}
 execFileSync('python3',['scripts/aase_m0502_content.py','--check']);execFileSync('python3',['scripts/aase_m0502_svg.py','--check']);
 const corpus=norm(flat(lesson.text.zh).join(' ')+' '+flat(lesson.checks.map((q:any)=>q.text.zh)).join(' '));
 const missing:string[]=[];
 for(let line of readFileSync(root+'teaching.zh.md','utf8').split('\n')){
  line=line.trim();if(!line||line==='```'||/^# AASE|^## 九|^1\\\.|^2\\\.|^3\\\./.test(line))continue;
  if(line.startsWith('|')){for(const cell of line.split('|').slice(1,-1)){if(!/^[- :]+$/.test(cell)&&!corpus.includes(norm(cell)))missing.push(cell);}continue;}
  line=line.replace(/^#{1,3} /,'').replace(/^\d+\. /,'').replace(/^[A-D]\. /,'');
  if(!corpus.includes(norm(line)))missing.push(line);
 }
 assert.deepEqual(missing,[],'all adopted source lines, tables, code, examples and options must reach the lesson');
 for(const lang of ['zh','en']){const sections=lesson.text[lang].sections;assert.equal(sections.length,12);for(const id of ['story','analogy','types','examples','acceptance','review'])assert(sections.some((s:any)=>s.id===id));const figs=sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>['cards','flow'].includes(b.kind));assert.deepEqual(figs.map((f:any)=>f.items.length),[5,2,2,5,5]);for(let n=1;n<=5;n++)assert(readFileSync(`site/images/aase/m05-02-${n}-${lang}.svg`).length<100000);}
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,2,2]);assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.publishedOn,'2026-11-05');
});
test('M05-02 rejects unreviewed figure structure and preserves bilingual publication gates',()=>{
 const course=read('content/aase/course.json'),english=read('content/aase/course.en.json'),sources=read('content/aase/sources.json');
 const lessons=readdirSync('content/aase/lessons').filter(p=>p.endsWith('.json')).map(p=>read('content/aase/lessons/'+p));
 const build=(ls:any[])=>createAaseCatalog(course,ls,sources,'2026-11-11',english);
 for(const mutate of [(f:any)=>f.items.pop(),(f:any)=>f.kind='flow',(f:any)=>f.items[0].html='<script/>']){const ls=structuredClone(lessons),l=ls.find(l=>l.id===lesson.id);for(const lang of ['zh','en'])mutate(l.text[lang].sections.find((s:any)=>s.id==='analogy').blocks.find((b:any)=>b.kind==='cards'));assert.throws(()=>build(ls),/specification figure/);}
 for(const state of ['draft','future']){const ls=structuredClone(lessons),l=ls.find(l=>l.id===lesson.id);if(state==='draft')l.status='draft';else l.publishedOn=l.date=l.translations.en.publishedOn='2099-01-01';const c=build(ls);for(const lang of ['zh','en'])assert(!c.forLanguage(lang as 'zh'|'en')!.searchEntries.some(e=>e.id===lesson.id));}
});
