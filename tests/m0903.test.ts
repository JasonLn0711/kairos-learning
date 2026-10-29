import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createConceptCatalog, type SourceBlock } from '../src/lib/concepts.ts';
import { allConceptTeachings, concepts } from '../src/lib/server/catalog.ts';

const lesson=allConceptTeachings.find(t=>t.id==='M09-03')!;
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text' in b?[b.text]:[];

test('M09-03 keeps complete aligned bilingual teaching, seven diagrams, five reference answers and pending M09-04',()=>{
  assert.equal(lesson.contentVersion,'1.2.0');assert.equal(lesson.revision,3);assert.deepEqual(lesson.qa,[]);
  const catalog=createConceptCatalog(concepts,allConceptTeachings,'2026-10-29');
  for(const lang of ['zh','en'] as const){
    const body=lesson.text[lang].sourceBody!;
    assert.ok(body.length>=140);assert.equal(body.filter(b=>b.kind==='table').length,3);
    assert.equal(body.filter(b=>b.kind==='heading').length,10);assert.equal(body.filter(b=>b.kind==='visual').length,7);
    assert.deepEqual(body.filter(b=>b.kind==='answer').map(b=>b.id),['answer-tabletop','answer-classification','answer-otp','answer-response','answer-visual-reasoning']);
    const text=body.flatMap(flatten).join('\n');
    for(const term of ['Vishing','Smishing','Impersonation','Northstar','OTP','MFA','Authentication','Authorization','M09-04'])assert.ok(text.toLowerCase().includes(term.toLowerCase()),term);
    assert.ok(!/Sentinel_|libfile_|CalpicoFile_|sandbox:|chatgpt-content-reference/.test(text));
    const page=catalog.get('M09-03',lang)!;
    assert.equal(page.navigation.previous?.id,'M09-02');assert.ok(page.navigation.previous?.href);
    assert.equal(page.navigation.next?.id,'M09-04');assert.equal(page.navigation.next?.href,null);
    assert.equal(catalog.get('M09-04',lang),null);
    const search=catalog.searchEntries.find(e=>e.id==='M09-03'&&e.lang===lang)!;
    for(const b of body.filter(b=>b.kind==='answer'))for(const p of b.paragraphs)assert.ok(search.text.includes(p));
    for(const image of body.filter(b=>b.kind==='visual')){assert.equal(image.kind,'visual');
    const svg=readFileSync(`site${image.src}`,'utf8');assert.ok(Buffer.byteLength(svg)<100000);
    assert.ok(svg.includes('<title')&&svg.includes('<desc'));
    assert.ok(!/<(?:script|foreignObject|image|use)\b|\bon\w+=|\bhref=/i.test(svg));
    }
  }
  const shape=(lang:'zh'|'en')=>lesson.text[lang].sourceBody!.map(b=>({kind:b.kind,id:'id'in b?b.id:undefined,rows:b.kind==='table'?b.rows.map(r=>r.length):undefined,items:b.kind==='list'?b.items.length:undefined}));
  assert.deepEqual(shape('zh'),shape('en'));
});

test('M09-03 preserves all source teaching and reference-answer text in order with documented reading adaptations',()=>{
  for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
    const text=lesson.text[lang].sourceBody!.flatMap(flatten).join('\n');
    for(const source of ['teaching','reference-answers']){
      const raw=readFileSync(`docs/sources/m09-03/${source==='teaching'?'primary-2026-10-29':'primary-reference-answers'}.${suffix}.md`,'utf8');
      let cursor=0,count=0,started=source==='teaching',inFigure4=false;
      const figure4=lesson.text[lang].sourceBody!.filter(b=>b.kind==='visual')[3];
      const figure4Text=flatten(figure4).join('\n');
      for(let line of raw.split('\n')){
        line=line.trim();
        if(source==='reference-answers'&&line.startsWith('## 1.'))started=true;
        if(!started||!line||/^[| :\-]+$/.test(line))continue;
        if(source==='teaching'&&['傳統 OTP','Traditional OTP'].includes(line))inFigure4=true;
        if(inFigure4){assert.ok(figure4Text.includes(line),`Figure 4 must retain ${line}`);if(/^(?:圖|Figure)\s*4\s*[｜|]/.test(line))inFigure4=false;continue;}
        const units=line.startsWith('|')?line.slice(1,-1).split('|'):[line.replace(/^#{1,3} /,'').replace(/^> /,'').replace(/^- /,'')];
        for(let value of units){
          value=value.replaceAll('**','').trim();
          const at=text.indexOf(value,cursor);assert.ok(at>=0,`${lang}/${source}: missing or reordered ${value}`);
          cursor=at+value.length;count++;
        }
      }
      assert.ok(count>=(source==='teaching'?170:15), `${lang}/${source}: ${count} units`);
    }
  }
});
