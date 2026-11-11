import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m09-01/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m09-c01.json'),prior=read(root+'previous-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('M09-01 retains source, publication, six anchors and complete bilingual structure',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,prior.revision+1);assert.equal(lesson.publishedOn,prior.publishedOn);assert.deepEqual(lesson.translations,prior.translations);assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang],blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  assert.equal(t.sections.length,11);for(const s of prior.text[lang].sections)assert.ok(t.sections.some((v:any)=>v.id===s.id),s.id);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='flow'||b.kind==='cards').map((b:any)=>[b.kind,b.items.length]),[['flow',4],['cards',4]]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[3,4,4,4,9]);
  assert.equal(blocks.filter((b:any)=>b.kind==='step').length,10);
  const entry=build(lesson).forLanguage(lang)!.searchEntries[0];for(const b of blocks)if(b.kind==='prose')for(const p of b.paragraphs)assert.ok(entry.text.includes(p));
 }
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,1,2]);assert.ok(lesson.checks.every((q:any)=>q.text.zh.options.length===4&&q.text.en.options.length===4));
 for(const script of ['scripts/aase_m0901_content.py','scripts/aase_m0901_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root}).status,0);
});
test('M09-01 rejects changed topology, action order and markup while retaining publication gates',()=>{
 for(const change of ['extra','kind','label','markup']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id==='analogy').blocks[0];if(change==='extra')b.items.push({...b.items[0]});if(change==='kind')b.kind='cards';if(change==='label')b.items[0].body='draft\ngit push';if(change==='markup')b.items[0].html='<svg/>';}
  assert.throws(()=>build(l),/invalid Git/);
 }
 for(const state of ['draft','future']){const l=structuredClone(lesson);if(state==='draft')l.status='draft';else l.publishedOn=l.date=l.translations.en.publishedOn='2099-01-01';for(const lang of ['zh','en'] as const)assert.equal(build(l).forLanguage(lang)!.searchEntries.length,0);}
});
test('published A–D commands restore only the selected file and preserve the other edit, backup and history',()=>{
 const dir=mkdtempSync(join(tmpdir(),'aase-git-'));
 const blocks=lesson.text.zh.sections.find((s:any)=>s.id==='lab').blocks.filter((b:any)=>b.kind==='step');assert.equal(blocks.length,5);
 try{
  const result=spawnSync('bash',['-e','-c',blocks.map((b:any)=>b.code).join('\n')+'\n'+[
   'test "$(cat slice-notes.md)" = "切片一：三欄輸入及未檢核預覽"',
   'test "$(cat keep.txt)" = "$(printf "其他工作：原始紀錄\\n其他工作：尚待完成")"',
   'test "$(cat slice-notes.backup.md)" = "$(printf "切片一：三欄輸入及未檢核預覽\\n誤加：完整報告已完成")"',
   'test "$(git rev-list --count HEAD)" = 1',
   'test -z "$(git diff --cached)"',
   'test -z "$(git diff -- slice-notes.md)"',
   'test "$(git status --short)" = "$(printf " M keep.txt\\n?? slice-notes.backup.md")"'
  ].join('\n')],{cwd:dir,encoding:'utf8',env:{...process.env,GIT_CONFIG_GLOBAL:'/dev/null',GIT_CONFIG_NOSYSTEM:'1'}});
  assert.equal(result.status,0,result.stdout+result.stderr);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
