import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m02-04/replacement-2026-11-07/';
const lesson=read('content/aase/lessons/aase-m02-c04.json'),before=read(root+'previous.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-07',read('content/aase/course.en.json'));
test('M02-04 preserves supplied questions, archives, old anchors and publication dates',()=>{
 assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.deepEqual(lesson.qa,[]);
 const raw=readFileSync(root+'pasted-text-1.txt','utf8');
 for(const q of lesson.checks){assert.ok(raw.includes(q.text.zh.prompt));for(const o of q.text.zh.options)assert.ok(raw.includes(o));assert.equal(q.text.zh.options.length,3);}
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,1,2]);
 for(const lang of ['zh','en']){const t=lesson.text[lang];assert.equal(t.sections.length,9);for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));const f=t.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.items);assert.deepEqual(f.map((b:any)=>b.items.length),[4,6,6,4]);}
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:root}).status,0);assert.doesNotThrow(()=>build(lesson));
});
test('agent diagram shapes reject missing branches and altered flow kind',()=>{
 for(const id of ['control','stopping','hybrid']){const l=structuredClone(lesson);for(const lang of ['zh','en'])l.text[lang].sections.find((s:any)=>s.id===id).blocks.find((b:any)=>b.items).items.pop();assert.throws(()=>build(l),/agent control figure/);}
 const l=structuredClone(lesson);for(const lang of ['zh','en'])l.text[lang].sections.find((s:any)=>s.id==='hybrid').blocks[0].kind='cards';assert.throws(()=>build(l),/agent control figure/);
});
test('diagram exports are synchronized and the actual teaching program enforces both limits',()=>{
 const r=spawnSync('python3',['scripts/aase_m0204_svg.py','--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);
 const code=lesson.text.zh.sections.find((s:any)=>s.id==='control').blocks.find((b:any)=>b.code).code;
 const p=spawnSync('python3',['-c',code+'\nassert can_save(False, 2)\nassert can_save(True, 0)\nassert not can_save(False, 4)'],{encoding:'utf8'});assert.equal(p.status,0,p.stderr);assert.equal(p.stdout.trim(),'weekend 3: allowed; weekday 3: rejected; weekend 4: rejected');
});
