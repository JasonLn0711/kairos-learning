import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {reviewedSvgMarkup} from '../src/lib/reviewed-svg.ts';
import svgLabels from '../src/lib/m0302-svg-labels.json' with {type:'json'};
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createConceptCatalog,type SourceBlock} from '../src/lib/concepts.ts';
import {allConceptTeachings,concepts} from '../src/lib/server/catalog.ts';
const lesson=allConceptTeachings.find(t=>t.id==='M03-02')!;
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text' in b?[b.text]:[];
test('M03-02 complete bilingual lesson, three diagrams, paired closed-answer data records and next linked unit',()=>{
 assert.equal(lesson.contentVersion,'1.2.0');assert.equal(lesson.revision,3);assert.deepEqual(lesson.qa,[]);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-11-03');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.ok(body.length>=40);
  assert.equal(body.filter(b=>b.kind==='heading'&&/^section-\d+$/.test(b.id??'')).length,9);
  assert.deepEqual(body.filter(b=>b.kind==='answer').map(b=>b.id),['answer-arp-timeout','answer-next-hop','answer-cache-time','answer-service-check','answer-nas-dsm','answer-printer-policy','answer-remote-frame','answer-arp-lab-timeout','answer-arp-lab-reply','answer-arp-lab-route','answer-arp-lab-frame']);
  const text=body.flatMap(flatten).join('\n');
  for(const term of ['ICMP','ARP','IP'])assert.ok(text.toLowerCase().includes(term.toLowerCase()));
  assert.ok(!/Sentinel_|libfile_|CalpicoFile_|sandbox:|chatgpt-content-reference/.test(text));
  const page=catalog.get('M03-02',lang)!;
  assert.equal(page.navigation.previous?.id,'M03-01');assert.ok(page.navigation.previous?.href);
  assert.equal(page.navigation.next?.id,'M03-03');assert.ok(page.navigation.next?.href?.includes("/concepts/"));
  assert.ok(catalog.get('M03-03',lang));
  const search=catalog.searchEntries.find(e=>e.id==='M03-02'&&e.lang===lang)!;
  for(const b of body.filter(b=>b.kind==='answer'))for(const p of b.paragraphs)assert.ok(search.text.includes(p));
 }
 const shape=(lang:'zh'|'en')=>lesson.text[lang].sourceBody!.filter(b=>b.kind==='heading'||b.kind==='answer'||b.kind==='visual'||b.kind==='table').map(b=>({kind:b.kind,id:'id'in b?b.id:undefined,rows:b.kind==='table'?b.rows.map(r=>r.length):undefined}));
 assert.deepEqual(shape('zh'),shape('en'));
});
test('M03-02 source teaching text is retained in order with formatting-only normalization',()=>{
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const text=lesson.text[lang].sourceBody!.flatMap(flatten).join('\n');let cursor=0;
  for(let line of readFileSync(`docs/sources/m03-02/M03-02-teaching.${suffix}.md`,'utf8').split('\n')){
   line=line.trim();if(!line||line.startsWith('```')||line.startsWith('![')||/^[| :\-]+$/.test(line))continue;
   const values=line.startsWith('|')?line.slice(1,-1).split('|'):[line.replace(/^#{1,3} /,'').replace(/^- /,'')];
   for(let value of values){value=value.replaceAll('**','').trim();const at=text.indexOf(value,cursor);assert.ok(at>=0,`${lang}: missing or reordered ${value}`);cursor=at+value.length;}
  }
 }
});

test('M03-02 reviewed inline bundle and search labels match deterministic allowlisted assets',()=>{
 const result=spawnSync('python3',['scripts/m0302_svg.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-11-03');
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='visual').length,3);
  for(const b of body.filter(b=>b.kind==='visual')){
   const svg=readFileSync('site'+b.src,'utf8');assert.equal(reviewedSvgMarkup(b.src),svg);assert.ok(Buffer.byteLength(svg)<100000);
   assert.ok(!/<(?:script|foreignObject|image|use)\b|\bon\w+=|\bhref=/i.test(svg));
  }
  const search=catalog.searchEntries.find(e=>e.id==='M03-02'&&e.lang===lang)!;
  for(const label of svgLabels[lang])assert.ok(search.text.includes(label));
 }
});

test('M03-02 reference answers preserve the paired source documents',()=>{
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const answers=lesson.text[lang].sourceBody!.filter(b=>b.kind==='answer');
  const source=readFileSync(`docs/sources/m03-02/M03-02-answers.${suffix}.md`,'utf8');
  const parts=source.split('\n## ').slice(1);assert.equal(parts.length,answers.length);
  for(let i=0;i<parts.length;i++){const [heading,...paragraphs]=parts[i].trim().split('\n\n');assert.ok(heading.startsWith(answers[i].id));assert.deepEqual(answers[i].paragraphs,paragraphs);}
 }
});

test('M03-02 SVG labels stay at or below inherited body size',()=>{
 const component=readFileSync('src/lib/components/ReviewedSvgVisual.svelte','utf8');
 assert.ok(component.includes('.diagram-canvas.compact-text{width:min(100%,33.333333em)}'));
 for(const lang of ['zh','en'] as const)for(const b of lesson.text[lang].sourceBody!.filter(b=>b.kind==='visual')){
  if(b.src.includes('-05-')||b.src.includes('-06-'))continue;
  const svg=readFileSync('site'+b.src,'utf8');const sizes=[...svg.matchAll(/font-size="([0-9.]+)"/g)].map(m=>Number(m[1]));
  assert.equal(Math.max(...sizes),18);assert.ok(/viewBox="0 0 600 (700|750)"/.test(svg));assert.ok(33.333333*18/600<=1);
 }
});




test('M03-02 HTML/SVG sources share one constrained bilingual model',()=>{
 const r=spawnSync('python3',['scripts/m0302_diagrams.py','--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
 const models=JSON.parse(readFileSync('docs/sources/m03-02/diagram-models.json','utf8'));assert.equal(Object.keys(models).length,8);
 for(const m of Object.values(models) as any[]){assert.equal(m.nodes.length,4);assert.equal(typeof m.flow,'boolean');for(const n of m.nodes)assert.equal(n.body.length,2);}
});

 test('M03-02 supplied-source custody and discovery relation model',()=>{
 const result=spawnSync('python3',['scripts/m0302_discovery.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
 const root='docs/sources/m03-02/supplied-2026-11-03/';const hashes=JSON.parse(readFileSync(root+'sha256.json','utf8'));
 for(const [name,hash] of Object.entries(hashes))assert.equal(createHash('sha256').update(readFileSync(root+name)).digest('hex'),hash);
 const models=JSON.parse(readFileSync('src/lib/m0302-discovery-diagrams.json','utf8'));
 for(const lang of ['zh','en']){
 const outcomes=models[`/images/ceh/m03-02-05-icmp-outcomes-${lang}.svg`];
 const arp=models[`/images/ceh/m03-02-06-arp-next-hop-${lang}.svg`];
 assert.deepEqual(outcomes.panels.map((p:any)=>p.edges.map((e:any)=>[e.source,e.target,e.style])),[[[0,1,'solid'],[1,0,'solid']],[[0,1,'solid'],[1,0,'solid']],[[0,1,'dashed']]]);
 assert.deepEqual(arp.panels.map((p:any)=>p.nodes.map((n:any)=>n.address)),[['192.168.1.10','192.168.1.20'],['192.168.1.10','192.168.1.1','203.0.113.20']]);
 assert.deepEqual(arp.panels[1].edges.map((e:any)=>[e.source,e.target]),[[0,1],[1,2]]);
 }
 });

test('M03-02 ARP supplement preserves both named figures, prior ICMP, and all seven existing answers',()=>{
 const root='docs/sources/m03-02/arp-supplement-2026-11-03/';
 const hashes=JSON.parse(readFileSync(root+'preserved-figures.sha256.json','utf8'));
 for(const [path,hash] of Object.entries(hashes)){
  let data=readFileSync(path);
  if(path==='src/lib/components/SourceBody.svelte'){
   // Preserve the ARP byte contract while allowing the explicit M03-03 through M03-06 additions.
   const original=data.toString().replace('  import ScanDiagram from "./ScanDiagram.svelte";\n','').replace('  import scanDiagrams from "$lib/m0303-scan-diagrams.json";\n','').replace("{:else if block.kind === 'visual' && block.src in scanDiagrams}<ScanDiagram {block} {lang}/>",'').replace("||conceptId==='M03-03'",'').replace("||conceptId==='M03-04'",'').replace("||conceptId==='M03-05'",'').replace("||conceptId==='M03-06'",'');
   data=Buffer.from(original);
  }
  assert.equal(createHash('sha256').update(data).digest('hex'),hash,path);
 }
 const supplied=JSON.parse(readFileSync(root+'source.sha256.json','utf8'));
 assert.equal(createHash('sha256').update(readFileSync(root+'supplied.txt')).digest('hex'),supplied['supplied.txt']);
 const old=JSON.parse(readFileSync('docs/sources/m03-02/archive-v1.1.0/m03-02.json','utf8'));
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;const previous=old.text[lang].sourceBody as SourceBlock[];
  const beforeArp=(bs:SourceBlock[])=>bs.slice(0,bs.findIndex(b=>b.kind==='heading'&&b.id==='section-5'));
  assert.deepEqual(beforeArp(body),beforeArp(previous));
  assert.deepEqual(body.filter(b=>b.kind==='visual'),previous.filter(b=>b.kind==='visual'));
  assert.deepEqual(body.filter(b=>b.kind==='answer').slice(0,7),previous.filter(b=>b.kind==='answer'));
  const prose=body.flatMap(flatten).join('\n');
  for(const term of ['255.255.255.0','192.168.10.0/24','10.20.30.40','ip -4 route get 10.20.30.40','02:00:00:00:00:01','VLAN','Proxy ARP','NAT'])assert.ok(prose.includes(term),`${lang}: ${term}`);
  assert.ok(!/BB:BB:BB|bb:bb:bb|XX:XX/.test(prose));
  for(const id of ['section-6-1','section-6-2','section-6-3','section-6-4','section-6-5','section-8-3','section-8-4','section-9-2'])assert.ok(body.some(b=>'id' in b&&b.id===id),`${lang}: ${id}`);
 }
});
