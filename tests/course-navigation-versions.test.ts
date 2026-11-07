import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {compareContentVersions} from '../src/lib/concepts.ts';
const manifest=JSON.parse(readFileSync('docs/releases/2026-11-05-course-navigation-versions.json','utf8'));
test('navigation readability patches retain original publication and all teaching content',()=>{
 assert.equal(manifest.items.length,53);assert.equal(new Set(manifest.items.map((r:any)=>r.id)).size,53);
 for(const row of manifest.items){
  const value=JSON.parse(readFileSync(row.file,'utf8'));
  assert.equal(value.id,row.id);assert.equal(value.publishedOn,row.publishedOn);
  assert.ok(compareContentVersions(value.contentVersion,row.after.contentVersion)>=0);
  assert.ok(value.revision>=row.after.revision);assert.ok(value[row.dateKey]>=row.after[row.dateKey]);
  assert.equal(row.after.revision,row.before.revision+1);
  const prior=(row.before.contentVersion??'1.0.0').split('.').map(Number);prior[2]++;
  assert.equal(row.after.contentVersion,prior.join('.'));
  if(value.contentVersion===row.after.contentVersion){
   const excluded=new Set(['revision','contentVersion',row.dateKey]);
   const body=Object.fromEntries(Object.entries(value).filter(([k])=>!excluded.has(k)));
   const canonical=(v:any):any=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
   const hash=createHash('sha256').update(JSON.stringify(canonical(body))).digest('hex');
   assert.equal(hash,row.contentSha256,row.id+' teaching must remain unchanged for this navigation-only patch');
  }
 }
});
