/** Assertions only: long-page evidence screenshots are deliberately separate. */
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.CEH_NOTES_BASE_URL||'http://127.0.0.1:4227';
const models=JSON.parse(readFileSync('docs/sources/ceh-notes/2026-11-12/c30-c38-supplement/diagrams.json','utf8')).diagrams;
const specs=JSON.parse(readFileSync('src/lib/note-diagram-specs.json','utf8'));
const clean=value=>value.replace(/\s/g,'');const values=b=>[b.caption,b.description,...b.items.flatMap(i=>[i.title,i.body])];
const out=process.env.CEH_SOC_EVIDENCE_DIR||'.local/ceh-soc-diagrams';mkdirSync(out,{recursive:true});
const results=[];const links=[];const browser=await chromium.launch({headless:true});
try{
 for(const lang of ['zh','en'])for(const javascript of [true,false]){
  const context=await browser.newContext({javaScriptEnabled:javascript,acceptDownloads:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+(lang==='en'?'/en':'')+'/ceh-notes/2026-11-12/');
  for(const width of [320,390,768,1280])for(const zoom of [1,2]){
   await page.setViewportSize({width,height:900});await page.evaluate(z=>document.documentElement.style.fontSize=z===2?'200%':'',zoom);
   for(const model of models){
    const b=model[lang];const figure=page.locator(`[data-diagram="${b.name}"]`);assert.equal(await figure.count(),1);
    await figure.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
    const text=clean(await figure.innerText());for(const value of values(b))assert.ok(text.includes(clean(value)),`missing ${lang}/${b.name}: ${value}`);
    assert.equal(await figure.evaluate(el=>el.scrollWidth>el.clientWidth+1),false,`figure overflow ${lang}/${javascript}/${width}/${zoom}/${b.name}`);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`page overflow ${lang}/${javascript}/${width}/${zoom}`);
    const spec=specs[b.name];
    if(spec.layout==='continuation-graph'){
     assert.equal(await figure.locator('[data-node]').count(),spec.count);
     assert.equal(await figure.locator('.relations li').count(),spec.edges.length);
     for(const [from,to] of spec.edges)assert.ok((await figure.locator('.relations').innerText()).includes(b.items[from].title+' → '+b.items[to].title));
     if(javascript){await figure.locator('.connections path').first().waitFor({state:'attached'});assert.equal(await figure.locator('.connections path').count(),spec.edges.length);assert.equal(await figure.locator('.connections path').evaluateAll(ps=>ps.every(p=>{const d=p.getAttribute('d')||'';return d.length>0&&!/(NaN|Infinity)/.test(d)&&[...d.matchAll(/-?\d+(?:\.\d+)?/g)].every(m=>Number.isFinite(Number(m[0])));})),true);}
     if(b.name==='socgovernance'){assert.equal(await figure.locator('.rank.governance [data-node]').count(),3);assert.match(await figure.locator('.group-label').innerText(),lang==='zh'?/平行治理文件/:/Parallel governance documents/);}
    }else{
     const widths=await figure.locator('.segments').evaluate(el=>({rpo:el.querySelector('.rpo').getBoundingClientRect().width,rto:el.querySelector('.rto').getBoundingClientRect().width}));assert.ok(Math.abs(widths.rto/widths.rpo-8)<.01);
     assert.deepEqual(await figure.locator('[data-timeline-point]').evaluateAll(els=>els.map(e=>Number(e.dataset.timelinePoint))),[-15,0,120]);
    }
    assert.equal(await figure.locator('a[download]').count(),1);assert.equal(await figure.locator('.links a:not([download])').count(),1);
    const dl=await figure.locator('a[download]').getAttribute('href');assert.equal(dl,`/images/ceh-notes/2026-11-12-part-4-${b.name}-${lang}.svg`);
    assert.ok((await figure.locator('.links a:not([download])').getAttribute('href')).endsWith(`/c30-c38-supplement/image-${model.reference}.png`));
    results.push({lang,javascript,width,zoom,name:b.name});
   }
  }
  // All eight bilingual SVG links use the exact source-derived standalone artifact.
  for(const model of models){const b=model[lang];const anchor=page.locator(`[data-diagram="${b.name}"] a[download]`);const path=await anchor.getAttribute('href');const url=new URL(path,page.url());assert.equal(url.origin,new URL(base).origin);const response=await page.request.get(url.href);assert.equal(response.status(),200);assert.match(response.headers()['content-type'],/image\/svg\+xml/);const bytes=await response.body();assert.ok(bytes.length<100000);assert.deepEqual(bytes,readFileSync('site'+path));
   await anchor.focus();const [download]=await Promise.all([page.waitForEvent('download'),page.keyboard.press('Enter')]);assert.deepEqual(readFileSync(await download.path()),bytes);links.push({lang,javascript,path,bytes:bytes.length});}
  const index=await page.request.get(base+'/search-index.json');assert.equal(index.status(),200);const entry=(await index.json()).find(e=>e.id==='CEH-NOTES-2026-11-12'&&e.lang===lang);assert.ok(entry);for(const model of models)for(const value of values(model[lang]))assert.ok(clean(entry.text).includes(clean(value)),`search ${lang}/${model[lang].name}: ${value}`);
  assert.equal(errors.length,0,errors.join('\n'));writeFileSync(out+'/checks.json',JSON.stringify({base,checks:results,links},null,2)+'\n');console.log(`PASS ${lang} JavaScript=${javascript}: 32 figure checks; source text/search; graph/timeline semantics; same-origin assets and keyboard downloads`);await context.close();
 }
 console.log(`PASS ${results.length} figure checks and ${links.length} SVG/download checks`);
}finally{await browser.close();}
