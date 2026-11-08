import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { conceptPath, conceptModule, createConceptCatalog, type ConceptEntry, type ConceptTeaching } from '../src/lib/concepts.ts';
const entries: ConceptEntry[] = JSON.parse(readFileSync('content/concepts.json','utf8'));
const route = entries.filter(c=>c.module==='m05');
// Verified against source repository study-plan/core-route-2026-10-27.md,
// blob f6dc1a7a733cb192a4286dbb27475817cd34f525. These are scope rows,
// not equivalent renames of the former fourteen pending concept entries.
const titles = ['Vulnerability Assessment vs. Penetration Testing','Asset Inventory & Assessment Scope','Vulnerability Classification & Assessment Types','CVE、CWE、CPE & Vulnerability Databases','CVSS、KEV、EPSS','Authenticated vs. Unauthenticated Scanning','False Positive / False Negative & Validation','Risk Prioritization、Remediation、Reporting'];
function lesson(): ConceptTeaching {
 return {id:'CEH26-M05-C01',revision:1,contentVersion:'1.0.0',date:'2026-11-08',publishedOn:'2026-11-08',status:'published',text:{zh:{summary:'範圍與證據測試',sections:[{id:'scope',heading:'範圍',paragraphs:['測試教材。']}]},en:{summary:'Scope and evidence fixture',sections:[{id:'scope',heading:'Scope',paragraphs:['Fixture teaching.']}]}}};
}
test('M05 registers exactly eight source-ordered units with stable human-readable URLs',()=>{
 assert.deepEqual(route.map(c=>c.title.en),titles);
 for(let i=1;i<=8;i++){
  const suffix=String(i).padStart(2,'0'),id=`CEH26-M05-C${suffix}`;
  assert.equal(route[i-1].id,id);assert.equal(route[i-1].displayId,`CEH M05-${suffix}`);
  for(const lang of ['zh','en'] as const)assert.equal(conceptPath(id,lang),`${lang==='en'?'/en':''}/courses/ceh/v13/m05/concepts/m05-${suffix}/`);
 }
 assert.equal(conceptPath('CEH26-M04-C10','zh'),'/courses/ceh/v13/m04/concepts/m04-10/');
 assert.equal(conceptPath('M03-08','en'),'/en/courses/ceh/v13/m03/concepts/m03-08/');
});
test('M05 preserves publication gates and pending next-unit navigation in both languages',()=>{
 for(const lang of ['zh','en'] as const){
  const catalog=createConceptCatalog(entries,[lesson()],'2026-11-08');
  const page=catalog.get('CEH26-M05-C01',lang)!;
  assert.equal(page.navigation.previous?.id,'CEH26-M04-C10');
  assert.equal(page.navigation.next?.id,'CEH26-M05-C02');assert.equal(page.navigation.next?.href,null);
  assert.equal(catalog.get('CEH26-M05-C02',lang),null);
  assert.equal(catalog.searchEntries.filter(e=>e.lang===lang).length,1);
  for(const mode of ['draft','future'] as const){
   const t=lesson();if(mode==='draft')t.status='draft';else t.publishedOn='2099-01-01';
   const hidden=createConceptCatalog(entries,[t],'2026-11-08');
   assert.equal(hidden.get(t.id,lang),null);assert.equal(hidden.searchEntries.length,0);
   assert.equal(hidden.list(lang).find(c=>c.id===t.id)?.href,null);
  }
 }
});
test('M05 rejects out-of-range IDs, mismatched display identity and colliding old public paths',()=>{
 for(const id of ['CEH26-M05-C00','CEH26-M05-C09','CEH26-M05-C10','CEH26-M05-C1','CEH26-M06-C01']){
  assert.throws(()=>createConceptCatalog([{id,module:conceptModule(id),title:{zh:'測試',en:'Test'}}],[],'2026-11-08'),/invalid or duplicate ID/);
 }
 assert.throws(()=>createConceptCatalog([{...route[0],displayId:'CEH M04-01'}],[],'2026-11-08'),/invalid display identity/);
 assert.throws(()=>createConceptCatalog([...route,{id:'M05-01',module:'m05',title:{zh:'舊項',en:'Legacy'}}],[],'2026-11-08'),/duplicate public path/);
});
