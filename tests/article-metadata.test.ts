import test from 'node:test';
import assert from 'node:assert/strict';
import {validateContent} from '../src/lib/validate.ts';
import {lessons,modules,sources,terms} from '../src/lib/server/catalog.ts';
test('chapter revision dates are real dates after first publication and remain distinct from review dates',()=>{
 const copy=structuredClone(lessons);copy[0].revisedOn='2026-11-01';
 assert.equal(validateContent(copy,modules,sources,terms).length,0);
 for(const invalid of ['2026-02-30','2020-01-01','today']){
  copy[0].revisedOn=invalid;
  assert.ok(validateContent(copy,modules,sources,terms).some(e=>e.includes('invalid revision date')));
 }
 copy[0].contentVersion='1.0';assert.ok(validateContent(copy,modules,sources,terms).some(e=>e.includes('invalid content version')));delete copy[0].contentVersion;
 delete copy[0].revisedOn;
 assert.equal(validateContent(copy,modules,sources,terms).length,0);
});
