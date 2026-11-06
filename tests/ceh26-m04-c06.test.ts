import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {spawnSync} from 'node:child_process';
import {allConceptTeachings,getPage,searchEntries} from '../src/lib/server/catalog.ts';
import {createConceptCatalog} from '../src/lib/concepts.ts';
import {permissionBits} from '../src/lib/nfs-permissions.ts';
const lesson=allConceptTeachings.find(t=>t.id==='CEH26-M04-C06')!;
test('NFS four supported modes have independently specified bits; unsupported modes are rejected',()=>{
 for(const [mode,bits] of [[600,['rw-','---','---']],[640,['rw-','r--','---']],[644,['rw-','r--','r--']],[777,['rwx','rwx','rwx']]] as const)assert.deepEqual(permissionBits(mode),bits);
 for(const value of [0,599,601,755,778,NaN,Infinity,600.1])assert.throws(()=>permissionBits(value),RangeError);
});
test('complete paired NFS lesson, preserved source and exports match the current generator',()=>{
 assert.equal(lesson.contentVersion,'1.0.0');assert.equal(lesson.publishedOn,'2026-11-06');assert.deepEqual(lesson.qa,[]);
 const result=spawnSync('python3',['scripts/ceh26_m04_c06_content.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:'docs/sources/ceh26-m04-c06/replacement-2026-11-06'}).status,0);
 const a=lesson.text.zh.sourceBody!,b=lesson.text.en.sourceBody!;assert.equal(a.length,124);assert.deepEqual(a.map(x=>[x.kind,'id'in x?x.id:null]),b.map(x=>[x.kind,'id'in x?x.id:null]));
 for(const lang of ['zh','en'] as const){const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(x=>x.kind==='heading').length,9);assert.equal(body.filter(x=>x.kind==='table').length,7);assert.equal(body.filter(x=>x.kind==='visual').length,4);assert.equal(body.filter(x=>x.kind==='answer').length,1);
 const prefix=lang==='zh'?'':'/en';const p=getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-06/`)!;assert.equal(p.conceptTeaching?.id,lesson.id);assert.equal(p.conceptNavigation?.previous?.href,`${prefix}/courses/ceh/v13/m04/concepts/m04-05/`);assert.equal(p.conceptNavigation?.next?.href,null);assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c06/`),null);
 const search=searchEntries.find(e=>e.id===lesson.id&&e.lang===lang)!;for(const value of ['sec=sys','root_squash','budget.txt','/mnt/data','/srv/share','777'])assert.ok(search.text.includes(value),value);
 }
 const raw=readFileSync('docs/sources/ceh26-m04-c06/replacement-2026-11-06/pasted-text-1.txt','utf8');assert.ok(raw.includes('提交答案並請你評分'));
 const text=JSON.stringify(a);assert.ok(!text.includes('favicons'));assert.ok(!text.includes('請你評分'));assert.ok(text.includes('補充群組'));assert.ok(text.includes('filesystem UID'));
});

test('the source-paragraph ledger accounts for the complete supplied text, with explicit editorial adaptations',()=>{
 const root='docs/sources/ceh26-m04-c06/replacement-2026-11-06/';const raw=readFileSync(root+'pasted-text-1.txt','utf8').split('\n\n').map(s=>s.trim()).filter(Boolean);const map=JSON.parse(readFileSync(root+'source-paragraph-map.json','utf8'));assert.deepEqual(map.map((r:any)=>r.source),raw);assert.equal(map.length,171);
 for(const row of map){assert.ok(['retained','retained-code','retained-table','retained-list','adapted','removed-export-artifact'].includes(row.disposition));assert.ok(row.evidence);if(row.disposition==='removed-export-artifact')assert.match(row.source,/favicons|Linux manual page|IETF Datatracker|RFC Editor|Debian Wiki/);}
});

test('the known NFS visual paths reject malformed role and mode counts',()=>{
 const entries=JSON.parse(readFileSync('content/concepts.json','utf8'));for(const key of ['mount','permissions']){const changed=structuredClone(lesson);const block=changed.text.zh.sourceBody!.find(b=>b.kind==='visual'&&b.src.includes('-'+key+'-'))!;if(block.kind==='visual')block.visual.items.pop();assert.throws(()=>createConceptCatalog(entries,[changed],'2026-11-06'),/invalid NFS diagram structure/);}
});
