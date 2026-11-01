import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {validatePerspectives,type Perspective} from '../src/lib/perspectives.ts';
import {getPage} from '../src/lib/server/catalog.ts';
const fixture=()=>JSON.parse(readFileSync('tests/fixtures/perspectives/example.json','utf8')) as Perspective;
const known={lesson:new Set(['ceh-m04-enumeration']),concept:new Set<string>()};
test('perspectives have bilingual empty routes without fixture leakage',()=>{for(const path of ['/perspectives/','/en/perspectives/']){const p=getPage(path);assert.ok(p);assert.equal(p.perspectives.length,0);assert.ok(!JSON.stringify(p).includes('preview-perspective'));}});
test('validation rejects missing translation, duplicate identity and invalid relations',()=>{assert.equal(validatePerspectives([fixture()],known).length,1);const a=fixture();a.text.en.summary='';assert.throws(()=>validatePerspectives([a],known));assert.throws(()=>validatePerspectives([fixture(),fixture()],known));const b=fixture();b.related[0].id='missing';assert.throws(()=>validatePerspectives([b],known));});
test('validation rejects invalid date and unmatched headings',()=>{const a=fixture();a.publishedOn='2026-02-30';assert.throws(()=>validatePerspectives([a],known));const b=fixture();b.text.en.sections[0].id='different';assert.throws(()=>validatePerspectives([b],known));});

test('field notes require a valid observed timestamp and avoid shell anchor collisions',()=>{
 const a=fixture();delete a.observedAt;assert.throws(()=>validatePerspectives([a],known),/observation/);
 const b=fixture();b.observedAt='2026-01-01Tgarbage+08:00';assert.throws(()=>validatePerspectives([b],known),/observation/);
 const c=fixture();c.text.zh.sections[0].id='main';assert.throws(()=>validatePerspectives([c],known),/section/);
});
