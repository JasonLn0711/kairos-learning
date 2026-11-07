import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const lesson=read('content/aase/lessons/aase-m02-c05.json');
const root='docs/sources/aase/m02-05/replacement-2026-11-07/';
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-07',read('content/aase/course.en.json'));
test('Harness source custody, six detailed roles, parallel topology and open questions are retained',()=>{
 for(const line of readFileSync(root+'SHA256SUMS.txt','utf8').trim().split('\n')){const [hash,file]=line.split(/\s+/);assert.equal(createHash('sha256').update(readFileSync(root+file)).digest('hex'),hash);}
 const raw=readFileSync(root+'pasted-text-1.txt','utf8');assert.equal(lesson.revision,4);assert.equal(lesson.publishedOn,'2026-11-05');assert.equal(lesson.checks.length,0);
 for(const lang of ['zh','en']){const t=lesson.text[lang];const figures=t.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>['cards','flow'].includes(b.kind));assert.deepEqual(figures.map((f:any)=>f.items.length),[9,3,3,5]);assert.equal(t.openChecks.length,3);assert.equal(figures[3].kind,'flow');assert.ok(figures[3].description.includes('Security'));assert.ok(figures[3].description.includes('Observability'));}
 for(const f of lesson.text.zh.sections.find((s:any)=>s.id==='six-aspects').blocks)for(const item of f.items)for(const p of item.body.split('\n\n'))assert.ok(raw.includes(p),p);
 for(const q of lesson.text.zh.openChecks)assert.ok(raw.includes(q.prompt));assert.doesNotThrow(()=>build(lesson));
 const catalog=build(lesson);for(const lang of ['zh','en'] as const){const entry=catalog.forLanguage(lang)!.searchEntries[0];for(const q of lesson.text[lang].openChecks){assert.ok(entry.text.includes(q.prompt));for(const p of q.answer)assert.ok(entry.text.includes(p));}}
});
test('all-open lessons still reject missing checks, empty answers and malformed fixed diagrams',()=>{
 for(const kind of ['none','empty','layout','flow']){const l=structuredClone(lesson);for(const lang of ['zh','en']){if(kind==='none')delete l.text[lang].openChecks;else if(kind==='empty')l.text[lang].openChecks[0].answer=[];else {const s=l.text[lang].sections.find((s:any)=>s.id==='analogy');if(kind==='layout')s.blocks[0].items.pop();else s.blocks[0].kind='flow';}}assert.throws(()=>build(l),/checks|open check|harness figure/);}
});
test('all eight Harness SVGs reproduce the shared data and remain within the reviewed export boundary',()=>{
 const result=spawnSync('python3',['scripts/aase_m0205_svg.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
 for(const lang of ['zh','en']){const figures=lesson.text[lang].sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>['cards','flow'].includes(b.kind));for(const [i,f] of figures.entries()){const svg=readFileSync(`site/images/aase/m02-05-${i+1}-${lang}.svg`,'utf8');assert.ok(Buffer.byteLength(svg)<100000);const plain=svg.replace(/<[^>]*>/g,'').replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&#x27;',"'").replaceAll('&quot;','"').replace(/\s/g,'');for(const item of f.items)for(const v of [item.title,item.body])assert.ok(plain.includes(v.replace(/\s/g,'')));}}
});
