import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createConceptCatalog,type SourceBlock} from '../src/lib/concepts.ts';
import {allConceptTeachings,concepts} from '../src/lib/server/catalog.ts';
const lesson=allConceptTeachings.find(t=>t.id==='M03-05')!;
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[];
test('M03-05 bilingual structure, source order, answers, searchable figures and next pending unit',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.date,'2026-11-03');assert.equal(lesson.publishedOn,'2026-11-03');assert.deepEqual(lesson.qa,[]);
 const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-11-03');
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='visual').length,2);assert.equal(body.filter(b=>b.kind==='answer').length,4);
  assert.deepEqual(body.filter(b=>b.kind==='answer').map(b=>b.id),['answer-port-label','answer-null-probe','answer-backend-evidence','answer-banner-patching']);
  const text=body.flatMap(flatten).join('\n');let cursor=0;
  const lines=readFileSync(`docs/sources/m03-05/M03-05-teaching.${suffix}.md`,'utf8').split('\n');
  for(let i=0;i<lines.length;i++){
   let line=lines[i].trim();
   if(!line||line.startsWith('![')||/^[| :\-]+$/.test(line))continue;
   let values:string[];
   if(line.startsWith('```')){
    const code:string[]=[];while(++i<lines.length&&!lines[i].startsWith('```'))code.push(lines[i]);
    values=[code.join('\n')];
   }else values=line.startsWith('|')?line.slice(1,-1).split(/(?<!\\)\|/).map(s=>s.replaceAll('\\|','|')):[line.replace(/^#{1,3} /,'').replace(/^(?:- |> )/,'')];
   for(let value of values){value=value.replaceAll('**','').trim();const at=text.indexOf(value,cursor);assert.ok(at>=0,`${lang}: missing or reordered ${value}`);cursor=at+value.length;}
  }
  const page=catalog.get('M03-05',lang)!;assert.equal(page.navigation.previous?.id,'M03-04');assert.equal(page.navigation.next?.id,'M03-06');assert.ok(page.navigation.next?.href?.endsWith('/m03-06/'));assert.ok(catalog.get('M03-06',lang));
  const search=catalog.searchEntries.find(e=>e.id==='M03-05'&&e.lang===lang)!;
  for(const b of body.filter(b=>b.kind==='answer'||b.kind==='visual'))for(const t of flatten(b))assert.ok(search.text.includes(t));
  assert.ok(!/Sentinel_|libfile_|sandbox:/.test(text));
 }
 const shape=(l:'zh'|'en')=>lesson.text[l].sourceBody!.filter(b=>['heading','table','answer','visual'].includes(b.kind)).map(b=>({kind:b.kind,id:'id'in b?b.id:undefined,rows:b.kind==='table'?b.rows.map(r=>r.length):undefined}));assert.deepEqual(shape('zh'),shape('en'));
});
test('M03-05 models, safe SVG, manuscript generation and reference answers are deterministic',()=>{
 for(const script of ['m0305_content.py','m0305_diagrams.py']){const r=spawnSync('python3',[`scripts/${script}`,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const body=lesson.text[lang].sourceBody!;
  for(const b of body.filter(b=>b.kind==='visual')){const svg=readFileSync('site'+b.src,'utf8');assert.ok(Buffer.byteLength(svg)<100000);assert.ok(svg.includes('viewBox=')&&svg.includes('<title')&&svg.includes('<desc'));assert.ok(!/<(?:script|foreignObject|image|use)\b|\bon\w+=|\bhref=/i.test(svg));}
  const answers=body.filter(b=>b.kind==='answer');const chunks=readFileSync(`docs/sources/m03-05/M03-05-answers.${suffix}.md`,'utf8').split('\n## ').slice(1);for(let i=0;i<chunks.length;i++){const [head,...paras]=chunks[i].trim().split('\n\n');assert.ok(head.startsWith(answers[i].id));assert.deepEqual(answers[i].paragraphs,paras);}
 }
});


test('M03-05 full supplied source, subsection depth and preserved assets',()=>{
 const root='docs/sources/m03-05/';
 let expected=readFileSync(root+'supplied-2026-11-03/teaching-original.txt','utf8');
 for(const [before,after] of JSON.parse(readFileSync(root+'detailed-editorial-changes.json','utf8'))){assert.ok(expected.includes(before));expected=expected.replaceAll(before,after);}
 assert.equal(readFileSync(root+'M03-05-teaching.zh-TW.md','utf8'),expected);
 const sourceHash=JSON.parse(readFileSync(root+'supplied-2026-11-03/source.sha256.json','utf8'));
 assert.equal(createHash('sha256').update(readFileSync(root+'supplied-2026-11-03/teaching-original.txt')).digest('hex'),sourceHash['teaching-original.txt']);
 for(const [path,hash] of Object.entries(JSON.parse(readFileSync(root+'supplied-2026-11-03/preserved-assets.sha256.json','utf8'))))assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'),hash);
 const map=JSON.parse(readFileSync(root+'detailed-section-map.json','utf8'));
 assert.equal(map.length,63);assert.deepEqual(map.map((s:any)=>s.zh),[...expected.matchAll(/^#{1,3} (.+)$/gm)].slice(1).map(m=>m[1]));
 const old=JSON.parse(readFileSync(root+'archive-v1.0.0/m03-05.json','utf8'));
 for(const lang of ['zh','en'] as const){
  const body=lesson.text[lang].sourceBody!;
  assert.deepEqual(body.filter(b=>b.kind==='heading'||b.kind==='paragraph'&&b.id).map(b=>({id:'id'in b?b.id:undefined,text:'text'in b?b.text:''})),map.map((s:any)=>({id:s.id,text:s[lang]})));
  assert.deepEqual(body.filter(b=>b.kind==='visual'||b.kind==='answer'),old.text[lang].sourceBody.filter((b:SourceBlock)=>b.kind==='visual'||b.kind==='answer'));
  assert.equal(body.filter(b=>b.kind==='table').length,9);assert.equal(body.filter(b=>b.kind==='code').length,87);
  for(const section of map){const index=body.findIndex(b=>'id'in b&&b.id===section.id);const end=body.findIndex((b,i)=>i>index&&(b.kind==='heading'||b.kind==='paragraph')&&!!b.id&&!b.id.startsWith(section.id+'-'));assert.ok(body.slice(index+1,end<0?undefined:end).some(b=>b.kind==='code'||b.kind==='table'||b.kind==='list'||b.kind==='paragraph'&&!b.id),section.id);}
  const codes=[...readFileSync(root+`M03-05-teaching.${lang==='zh'?'zh-TW':'en'}.md`,'utf8').matchAll(/```[^\n]*\n([\s\S]*?)\n```/g)].map(m=>m[1]);
  assert.deepEqual(body.flatMap(b=>b.kind==='code'?[b.text]:[]),codes);
 }
});
