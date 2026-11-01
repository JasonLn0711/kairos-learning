import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {diagramAsset,diagramText,renderDiagramSvg,validateDiagram} from '../src/lib/perspective-diagrams.ts';
import {validatePerspectives,type Perspective} from '../src/lib/perspectives.ts';
import {searchEntries,getPage} from '../src/lib/server/catalog.ts';
const article=()=>JSON.parse(readFileSync('content/perspectives/nas-offline-recovery.json','utf8')) as Perspective;
const known={lesson:new Set(['ceh-m04-enumeration']),concept:new Set<string>()};
test('NAS diagrams are bilingual, searchable and exactly match reviewed exports',()=>{
 const p=article();validatePerspectives([p],known);
 for(const lang of ['zh','en'] as const){
  const diagrams=p.text[lang].sections.flatMap(s=>s.diagram?[s.diagram]:[]);assert.equal(diagrams.length,6);
  for(const d of diagrams){const svg=readFileSync('site'+diagramAsset(p.id,d,lang),'utf8');assert.equal(svg,renderDiagramSvg(d,lang==='zh'?'zh-Hant':'en'));assert.ok(Buffer.byteLength(svg)<100000);assert.doesNotMatch(svg,/<script|foreignObject|onload=|href=/);for(const text of diagramText(d))assert.ok(searchEntries.find(e=>e.id===p.id&&e.lang===lang)!.text.includes(text));}
  assert.ok(getPage(`${lang==='en'?'/en':''}/perspectives/${p.slug}/`)?.perspective);
 }
});
test('diagram boundary rejects markup controls, malformed nodes and bilingual structural drift',()=>{
 for(const mutate of [(d:any)=>d.groups[0].items[0].icon='constructor',(d:any)=>d.groups[0].items[0].tone='url(evil)',(d:any)=>d.groups=[],(d:any)=>d.groups[0].mode='html',(d:any)=>d.groups[0].items[0].body='']){const d=article().text.zh.sections.find(s=>s.diagram)!.diagram!;mutate(d);assert.throws(()=>validateDiagram(d));}
 const p=article();p.text.en.sections.find(s=>s.diagram)!.diagram!.id='mismatch';assert.throws(()=>validatePerspectives([p],known),/diagrams mismatch/);
 const d=article().text.zh.sections.find(s=>s.diagram)!.diagram!;d.note='<script>alert("x")</script>';assert.doesNotMatch(renderDiagramSvg(d,'en'),/<script>/);
});

test('CVE article exports fifteen matching bilingual diagrams and reciprocal reading links',()=>{
 const p=JSON.parse(readFileSync('content/perspectives/nas-cve-patching.json','utf8')) as Perspective;
 validatePerspectives([p],known);assert.match(p.contentVersion,/^\d+\.\d+\.\d+$/);
 for(const lang of ['zh','en'] as const){
  const ds=p.text[lang].sections.flatMap(s=>s.diagram?[s.diagram]:[]);assert.equal(ds.length,15);
  for(const d of ds){const svg=readFileSync('site'+diagramAsset(p.id,d,lang),'utf8');assert.equal(svg,renderDiagramSvg(d,lang==='zh'?'zh-Hant':'en'));assert.ok(Buffer.byteLength(svg)<100000);assert.doesNotMatch(svg,/<script|foreignObject|onload=|href=/);for(const text of diagramText(d))assert.ok(searchEntries.find(e=>e.id===p.id&&e.lang===lang)!.text.includes(text));}
  assert.ok(getPage(`${lang==='en'?'/en':''}/perspectives/${p.slug}/`)?.perspective);
  assert.ok(p.text[lang].sections.some(s=>s.paragraphs.some(t=>t.includes('/nas-offline-recovery/'))));
  assert.ok(article().text[lang].sections.some(s=>s.paragraphs.some(t=>t.includes('/nas-cve-patching/'))));
 }
});

test('structured layouts validate shape, cell values and bilingual presentation',()=>{
 const p=JSON.parse(readFileSync('content/perspectives/nas-cve-patching.json','utf8')) as Perspective;
 const sample=p.text.zh.sections.find(s=>s.diagram?.layout==='cells')!.diagram!;
 for(const mutate of [(d:any)=>d.layout='html',(d:any)=>d.groups[0].mode='flow',(d:any)=>d.groups[0].items.pop(),(d:any)=>d.groups[0].items[0].cells=['too-long-cell'],(d:any)=>d.groups[0].items[0].state='onclick']){const d=structuredClone(sample);mutate(d);assert.throws(()=>validateDiagram(d));}
 const legacy=article().text.zh.sections.find(s=>s.diagram)!.diagram!;legacy.groups[0].items[0].cells=['A'];assert.throws(()=>validateDiagram(legacy));
 const escaped=structuredClone(sample);escaped.groups[0].items[0].title='<script>bad()</script>';assert.doesNotMatch(renderDiagramSvg(escaped,'en'),/<script>/);
 p.text.en.sections.find(s=>s.diagram?.layout==='cells')!.diagram!.groups[0].items[0].cells=['1','2'];assert.throws(()=>validatePerspectives([p],known));
});
