import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateScanEvidenceDiagram} from '../src/lib/scan-evidence-diagrams.ts';
const a=JSON.parse(readFileSync('content/concepts/ceh26-m05-c06.json','utf8'));
test('M05-06 preserves eight complete paired sections and three reviewed figures',()=>{
 assert.equal(a.id,'CEH26-M05-C06');assert.equal(a.status,'published');
 for(const lang of ['zh','en']){
 const b=a.text[lang].sourceBody;assert.equal(b.filter(x=>x.kind==='heading').length,8);assert.equal(b.filter(x=>x.kind==='table').length,2);
 const figures=b.filter(x=>x.kind==='visual');assert.equal(figures.length,3);
 for(const f of figures){assert.doesNotThrow(()=>validateScanEvidenceDiagram(a.id,f.src,f.visual));assert.ok(readFileSync('site'+f.src).length<100000);assert.throws(()=>validateScanEvidenceDiagram(a.id,f.src,{...f.visual,items:[]}));assert.throws(()=>validateScanEvidenceDiagram('M05-08',f.src,f.visual));}
 assert.ok(JSON.stringify(b).includes('Permission denied'));assert.ok(JSON.stringify(b).includes('MFA'));
 }
 assert.deepEqual(a.text.zh.sourceBody.map(x=>x.kind),a.text.en.sourceBody.map(x=>x.kind));
});
