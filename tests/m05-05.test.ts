import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createConceptCatalog,conceptPath} from '../src/lib/concepts.ts';
const base='docs/sources/m05-05/';
const load=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const t=load('content/concepts/ceh26-m05-c05.json'),entries=load('content/concepts.json');
test('M05-05 retains original attachment bytes and every supplied teaching unit in order',()=>{
 for(const [name,hash] of Object.entries(load(base+'source-checksums.json')))assert.equal(createHash('sha256').update(readFileSync(base+name)).digest('hex'),hash);
 const source=readFileSync(base+'pasted-text-1.txt','utf8').trim().split(/\n\s*\n/);
 const adopted=readFileSync(base+'teaching.zh-TW.md','utf8').trim().split(/\n\s*\n/);
 const map=load(base+'source-paragraph-map.json');assert.equal(map.length,source.length);
 let cursor=-1;
 for(let i=0;i<map.length;i++){
  const m=map[i];assert.equal(m.source,source[i]);assert.equal(m.sourceChunk,i+1);
  if(m.adopted){assert.ok(m.adoptedChunk>cursor);assert.equal(adopted[m.adoptedChunk-1],m.adopted);cursor=m.adoptedChunk;}
  else assert.ok(source[i].startsWith('[image]')||['first.org+1','first.org','GovDelivery+1','GovDelivery'].includes(source[i]));
 }
 execFileSync('python3',['scripts/m05_05_content.py','--check']);
 for(const lang of ['zh','en']){
  const body=t.text[lang].sourceBody;assert.equal(body.filter((b:any)=>b.kind==='heading').length,9);
  assert.equal(body.filter((b:any)=>b.kind==='table').length,5);assert.equal(body.filter((b:any)=>b.kind==='answer').length,0);
  assert.deepEqual(body.filter((b:any)=>b.kind==='visual').map((b:any)=>b.visual.items.length),[3,4,1,4]);
  const comparison=body.filter((b:any)=>b.kind==='table')[3];assert.deepEqual(comparison.rows.map((r:any)=>r.slice(1)),[['9.8','8.1'],lang==='zh'?['未列入','已列入']:['Not listed','Listed'],['1%','60%'],lang==='zh'?['隔離測試機','對外伺服器']:['Isolated test machine','Internet-facing server'],lang==='zh'?['低','高']:['Low','High'],lang==='zh'?['已確認','已確認']:['Confirmed','Confirmed']]);
 }
 assert.deepEqual(t.text.zh.sourceBody.map((b:any)=>[b.kind,b.id]),t.text.en.sourceBody.map((b:any)=>[b.kind,b.id]));assert.deepEqual(t.qa,[]);
});
test('M05-05 uses its stable URL and closes draft and future publication',()=>{
 assert.equal(conceptPath(t.id,'zh'),'/courses/ceh/v13/m05/concepts/m05-05/');
 assert.ok(createConceptCatalog(entries,[t],'2026-11-09').get(t.id,'en'));
 for(const change of [{status:'draft'},{publishedOn:'2099-01-01'}])assert.equal(createConceptCatalog(entries,[{...t,...change}],'2026-11-09').get(t.id,'zh'),null);
 const route=createConceptCatalog(entries,[t],'2026-11-09').get(t.id,'zh')!;
 assert.equal(route.navigation.previous!.id,'CEH26-M05-C04');assert.equal(route.navigation.next!.id,'M05-08');
});
test('prioritization diagrams reject invented probabilities, sequential metric rows and unknown layouts',()=>{
 for(const mutation of [
  (b:any)=>b.find((x:any)=>x.src?.includes('-probability-')).visual.items[0].title='0.95 = 95%',
  (b:any)=>b.find((x:any)=>x.src?.includes('-signals-')).visual.kind='flow',
  (b:any)=>b.find((x:any)=>x.src?.includes('-groups-')).visual.items.pop(),
  (b:any)=>b.find((x:any)=>x.src?.includes('-workflow-')).src='/images/ceh/m05-05-unknown-zh-v1-0-0.svg',
  (b:any)=>b.find((x:any)=>x.kind==='visual').visual.items[0].markup='<svg/>'
 ]){const broken=structuredClone(t);mutation(broken.text.zh.sourceBody);assert.throws(()=>createConceptCatalog(entries,[broken],'2026-11-09'),/invalid prioritization diagram/);}
 const wrong=structuredClone(t);wrong.id='CEH26-M05-C04';assert.throws(()=>createConceptCatalog(entries,[wrong],'2026-11-09'),/invalid prioritization diagram/);
});
