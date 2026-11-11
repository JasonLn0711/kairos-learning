import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const path='docs/sources/aase/m05-05/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m05-c05.json');
const build=(l=lesson)=>createAaseCatalog(read('content/aase/course.json'),readdirSync('content/aase/lessons').map(f=>f==='aase-m05-c05.json'?l:read('content/aase/lessons/'+f)),read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('OpenSpec replacement preserves originals and regenerates complete bilingual documents',()=>{
 for(const line of readFileSync(path+'SHA256SUMS','utf8').trim().split('\n')){const [hash,file]=line.split('  ');assert.equal(createHash('sha256').update(readFileSync(path+file)).digest('hex'),hash);}
 execFileSync('python3',['scripts/aase_m0505_content.py','--check']);execFileSync('python3',['scripts/aase_m0505_svg.py','--check']);
 const before=read(path+'previous/lesson.json');assert.equal(lesson.publishedOn,before.publishedOn);assert.equal(lesson.contentVersion,'1.1.1');assert.equal(lesson.revision,before.revision+2);assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en']){const t=lesson.text[lang];assert.equal(t.sections.length,9);assert.ok(before.text[lang].sections.every((s:any)=>t.sections.some((n:any)=>n.id===s.id)));const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);assert.equal(blocks.filter((b:any)=>b.kind==='table').length,4);assert.equal(blocks.filter((b:any)=>b.code).length,7);assert.deepEqual(blocks.filter((b:any)=>b.kind==='flow').map((b:any)=>b.items.length),[3,5]);assert.equal(t.openChecks.length,4);assert.equal(lesson.checks.length,0);}
 assert.equal(build().forLanguage('en')!.lessons.find(l=>l.id===lesson.id)!.contentVersion,'1.1.1');
});
test('OpenSpec rejects wrong relationship, node count and markup fields; publication gates remain closed for drafts',()=>{
 for(const mutate of [(f:any)=>f.kind='cards',(f:any)=>f.items.pop(),(f:any)=>f.items[0].html='<script>bad</script>']){const l=structuredClone(lesson);mutate(l.text.zh.sections[2].blocks[0]);mutate(l.text.en.sections[2].blocks[0]);assert.throws(()=>build(l),/OpenSpec/);}
 for(const mutate of [(l:any)=>l.status='draft',(l:any)=>l.publishedOn='2099-01-01']){const l=structuredClone(lesson);mutate(l);if(l.publishedOn==='2099-01-01'){l.date=l.publishedOn;l.translations.en.publishedOn=l.publishedOn;}assert.ok(!build(l).lessons.some(x=>x.id===l.id));assert.ok(!build(l).forLanguage('en')!.lessons.some(x=>x.id===l.id));}
});
