import {examplePrefix,networkDiagram} from '../src/lib/m0206-network.ts';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {reviewedSvgMarkup} from '../src/lib/reviewed-svg.ts';
import svgLabels from '../src/lib/m0206-svg-labels.json' with {type:'json'};
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createConceptCatalog,type SourceBlock} from '../src/lib/concepts.ts';
import {allConceptTeachings,concepts} from '../src/lib/server/catalog.ts';
const lesson=allConceptTeachings.find(t=>t.id==='M02-06')!;
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text' in b?[b.text]:[];
test('M02-06 complete bilingual lesson, eight diagrams, paired closed-answer data records and next linked unit',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,3);assert.deepEqual(lesson.qa,[]);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-11-01');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.ok(body.length>=40);
  assert.equal(body.filter(b=>b.kind==='heading'&&/^section-\d+$/.test(b.id??'')).length,9);
  assert.deepEqual(body.filter(b=>b.kind==='answer').map(b=>b.id),['answer-local-prefix', 'answer-address-count', 'answer-asn-role', 'answer-missing-reply', 'answer-service-correlation','answer-integrated-prefix','answer-integrated-operator','answer-integrated-origin','answer-integrated-smb']);
  const text=body.flatMap(flatten).join('\n');
  for(const term of ['TTL','ASN','192.0.2.0/24','RTT','Traceroute'])assert.ok(text.includes(term));
  assert.ok(!/Sentinel_|libfile_|CalpicoFile_|sandbox:|chatgpt-content-reference/.test(text));
  const page=catalog.get('M02-06',lang)!;
  assert.equal(page.navigation.previous?.id,'M02-05');assert.ok(page.navigation.previous?.href);
  assert.equal(page.navigation.next?.id,'M02-07');assert.equal(page.navigation.next?.href,null);
  assert.equal(catalog.get('M02-07',lang),null);
  const search=catalog.searchEntries.find(e=>e.id==='M02-06'&&e.lang===lang)!;
  for(const b of body.filter(b=>b.kind==='answer'))for(const p of b.paragraphs)assert.ok(search.text.includes(p));
 }
 const shape=(lang:'zh'|'en')=>lesson.text[lang].sourceBody!.filter(b=>b.kind==='heading'||b.kind==='answer'||b.kind==='visual'||b.kind==='table').map(b=>({kind:b.kind,id:'id'in b?b.id:undefined,rows:b.kind==='table'?b.rows.map(r=>r.length):undefined}));
 assert.deepEqual(shape('zh'),shape('en'));
});
test('M02-06 source teaching text is retained in order with formatting-only normalization',()=>{
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const text=lesson.text[lang].sourceBody!.flatMap(flatten).join('\n');let cursor=0;
  for(let line of readFileSync(`docs/sources/m02-06/M02-06-teaching.${suffix}.md`,'utf8').split('\n')){
   line=line.trim();if(!line||line.startsWith('```')||line.startsWith('![')||/^[| :\-]+$/.test(line))continue;
   const values=line.startsWith('|')?line.slice(1,-1).split('|'):[line.replace(/^#{1,3} /,'').replace(/^- /,'')];
   for(let value of values){value=value.replaceAll('**','').trim();const at=text.indexOf(value,cursor);assert.ok(at>=0,`${lang}: missing or reordered ${value}`);cursor=at+value.length;}
  }
 }
});

test('M02-06 reviewed inline bundle and search labels match deterministic allowlisted assets',()=>{
 const result=spawnSync('python3',['scripts/m0206_svg.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-11-01');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='visual').length,8);
  for(const b of body.filter(b=>b.kind==='visual')){
   const svg=readFileSync('site'+b.src,'utf8');assert.equal(reviewedSvgMarkup(b.src),svg);assert.ok(Buffer.byteLength(svg)<100000);
   assert.ok(!/<(?:script|foreignObject|image|use)\b|\bon\w+=|\bhref=/i.test(svg));
  }
  const search=catalog.searchEntries.find(e=>e.id==='M02-06'&&e.lang===lang)!;
  for(const label of svgLabels[lang])assert.ok(search.text.includes(label));
 }
});

test('M02-06 reference answers preserve the paired source documents',()=>{
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const answers=lesson.text[lang].sourceBody!.filter(b=>b.kind==='answer');
  const source=readFileSync(`docs/sources/m02-06/M02-06-answers.${suffix}.md`,'utf8');
  const parts=source.split('\n## ').slice(1);assert.equal(parts.length,answers.length);
  for(let i=0;i<parts.length;i++){const [heading,...paragraphs]=parts[i].trim().split('\n\n');assert.ok(heading.startsWith(answers[i].id));assert.deepEqual(answers[i].paragraphs,paragraphs);}
 }
});

test('M02-06 SVG labels stay at or below inherited body size',()=>{
 const component=readFileSync('src/lib/components/ReviewedSvgVisual.svelte','utf8');
 assert.ok(component.includes('.diagram-canvas.compact-text{width:min(100%,33.333333em)}'));
 for(const lang of ['zh','en'] as const)for(const b of lesson.text[lang].sourceBody!.filter(b=>b.kind==='visual')){
  if(!/m02-06-0[1-4]-/.test(b.src))continue;
  const svg=readFileSync('site'+b.src,'utf8');const sizes=[...svg.matchAll(/font-size="([0-9.]+)"/g)].map(m=>Number(m[1]));
  assert.equal(Math.max(...sizes),18);assert.ok(/viewBox="0 0 600 (700|750)"/.test(svg));assert.ok(33.333333*18/600<=1);
 }
});




test('M02-06 CIDR explorer computes every supported prefix and rejects other input',()=>{
 const expected=[[24,0,255,256],[25,0,127,128],[26,0,63,64],[27,0,31,32],[28,16,31,16],[29,24,31,8],[30,24,27,4]];
 for(const [prefix,start,end,count] of expected)assert.deepEqual(examplePrefix(prefix),{network:`192.0.2.${start}/${prefix}`,start:`192.0.2.${start}`,end:`192.0.2.${end}`,count});
 for(const n of [23,31,24.5,NaN,Infinity])assert.throws(()=>examplePrefix(n),RangeError);
});
test('M02-06 network diagrams have bounded bilingual structures and primary text fidelity',()=>{
 const counts={'network-map':4,'prefix-bits':4,'private-network':4,'bgp-routing':3,'cdn-origin':4,'proxy-modes':5};
 for(const [id,count] of Object.entries(counts))for(const lang of ['zh','en']){
  const d=networkDiagram(`/images/ceh/m02-06-${id}-${lang}.svg`)!;assert.equal(d.data.nodes.length,count);
  const block=lesson.text[lang as 'zh'|'en'].sourceBody!.find(b=>b.kind==='visual' && b.src.endsWith(`-${id}-${lang}.svg`));assert.ok(block?.kind==='visual');
  assert.deepEqual(block.visual.items,d.data.nodes.map(n=>({title:n.title,body:n.body})));
 }
 assert.equal(networkDiagram('/images/ceh/untrusted.svg'),undefined);
 const result=spawnSync('python3',['scripts/m0206_network.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
});

test('M02-06 keeps the Traceroute sections and runs both offline Python examples',()=>{
 for(const suffix of ['zh-TW','en']){
  const before=readFileSync(`docs/sources/m02-06/archive-v1.0.1/M02-06-teaching.${suffix}.md`,'utf8');
  const after=readFileSync(`docs/sources/m02-06/M02-06-teaching.${suffix}.md`,'utf8');
  assert.equal(after.slice(after.indexOf('## 5'),after.indexOf('## 8')),before.slice(before.indexOf('## 5'),before.indexOf('## 8')));
  assert.equal(after.slice(after.indexOf('## 9')),before.slice(before.indexOf('## 9')));
 }
 const blocks=lesson.text.zh.sourceBody!.filter(b=>b.kind==='code'&&b.text.startsWith('from ipaddress'));
 assert.equal(blocks.length,2);
 for(const block of blocks){
  assert.ok(block.kind==='code');const result=spawnSync('python3',['-c',block.text],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
  assert.equal(result.stdout,block.text.includes('ip_interface')?'IP: 192.0.2.25\nNetwork: 192.0.2.0/24\nStart: 192.0.2.0\nEnd: 192.0.2.255\nAddresses: 256\n':'256\n192.0.2.0 192.0.2.255\nTrue\n');
 }
});
