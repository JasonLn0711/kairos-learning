/** Run against a built preview. Covers hydrated and JavaScript-disabled diagrams. */
import {chromium} from '@playwright/test';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.CEH_NOTES_BASE_URL||'http://127.0.0.1:4227';
const models=JSON.parse(readFileSync('docs/sources/ceh-notes/2026-11-12/controls-risk-supplement/diagrams.json','utf8')).diagrams;
const specs=JSON.parse(readFileSync('src/lib/note-diagram-specs.json','utf8'));
const normalize=v=>v.replace(/[\s/／]/g,'');
const out='.local/ceh-day01-diagrams';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const results=[];
try{
 for(const lang of ['zh','en'])for(const javascript of [true,false]){
  const context=await browser.newContext({javaScriptEnabled:javascript});const page=await context.newPage();const cdp=await context.newCDPSession(page);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+(lang==='en'?'/en':'')+'/ceh-notes/2026-11-12/');
  for(const width of [320,390,768,1280])for(const zoom of [1,2]){
   await page.setViewportSize({width,height:900});await page.evaluate(z=>document.documentElement.style.fontSize=z===2?'200%':'',zoom);
   for(const model of models){
    const figure=page.locator(`[data-diagram="${model[lang].name}"]`);await figure.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
    assert.equal(await figure.count(),1);
    const actual=normalize(await figure.innerText());
    for(const value of [model[lang].caption,model[lang].description,...model[lang].items.flatMap(item=>[item.title,item.body])])assert.ok(actual.includes(normalize(value)),`missing model text ${lang}/${model[lang].name}: ${value}`);
    const spec=specs[model[lang].name];
    if(spec.layout==='continuation-graph'){
     assert.equal(await figure.locator('[data-node]').count(),spec.count);
     assert.equal(await figure.locator('.relations li').count(),spec.edges.length);
     for(const [from,to] of spec.edges)assert.ok((await figure.locator('.relations').innerText()).includes(model[lang].items[from].title+' → '+model[lang].items[to].title));
     if(javascript){
      await figure.locator('.connections path').first().waitFor({state:'attached'});
      assert.equal(await figure.locator('.connections path').count(),spec.edges.length);
      assert.equal(await figure.locator('.connections path').evaluateAll(paths=>paths.every(p=>{const d=p.getAttribute('d')||'';return d.length>0&&!/(NaN|Infinity)/.test(d)&&[...d.matchAll(/-?\d+(?:\.\d+)?/g)].every(m=>Number.isFinite(Number(m[0])));})),true);
     }
    }
    if(model[lang].name==='defenselayers')assert.equal(await figure.locator('.layer > .layer > .layer > .card').count(),1);
    if(model[lang].name==='pdcacycle'){
     const positions=await figure.locator('.pdca li').evaluateAll(els=>els.map(el=>({x:el.getBoundingClientRect().x,y:el.getBoundingClientRect().y})));
     const isGrid=await figure.locator('.pdca').evaluate(el=>getComputedStyle(el).display==='grid');
     if(isGrid){assert.ok(positions[0].x<positions[1].x);assert.ok(positions[3].x<positions[2].x);assert.ok(positions[0].y<positions[3].y);}else{assert.ok(positions.every((p,i)=>i===0||p.y>positions[i-1].y));}
    }
    assert.equal(await figure.locator('a[download]').count(),1);
    assert.equal(await figure.evaluate(el=>el.scrollWidth>el.clientWidth+1),false,`${lang}/${javascript}/${width}/${zoom}/${model[lang].name} figure overflow`);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'page overflow');
    if(process.env.CEH_DIAGRAM_SCREENSHOTS!=='0'&&javascript&&zoom===1&&(width===390||width===1280)){const clip=await figure.evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height};});const shot=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{...clip,scale:1}});writeFileSync(`${out}/${model[lang].name}-${lang}-${width}.png`,Buffer.from(shot.data,'base64'));}
    results.push({lang,javascript,width,zoom,name:model[lang].name});
   }
  }
  const risk=page.locator('[data-diagram="riskmatrix"]');const sliders=risk.locator('input[type="range"]');assert.equal(await sliders.count(),2);
  assert.match(await risk.locator('.result').innerText(),/3 × 5 = 15/);
  for(let i=0;i<2;i++)assert.equal(await sliders.nth(i).isEnabled(),javascript);
  if(javascript){
   for(const [l,i,score,level] of [[1,1,1,lang==='zh'?'低風險':'Low risk'],[1,5,5,lang==='zh'?'中風險':'Medium risk'],[5,5,25,lang==='zh'?'高風險':'High risk']]){
    for(const [n,v] of [[0,l],[1,i]])await sliders.nth(n).fill(String(v));
    assert.match(await risk.locator('.result').innerText(),new RegExp(`${l} × ${i} = ${score} / 25 · ${level}`));
   }
   await sliders.nth(0).focus();await page.keyboard.press('ArrowLeft');assert.equal(await sliders.nth(0).inputValue(),'4');await page.keyboard.press('ArrowRight');assert.equal(await sliders.nth(0).inputValue(),'5');
   assert.equal(await risk.locator('.result').getAttribute('aria-live'),'polite');
   await risk.locator('button').focus();await page.keyboard.press('Enter');assert.match(await risk.locator('.result').innerText(),/3 × 5 = 15/);
   assert.equal(await page.evaluate(()=>Object.keys(localStorage).some(k=>/risk|score/i.test(k))),false);
  }
  const widths=await page.locator('[data-diagram="controlcounts"] .bar').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().width/el.parentElement.getBoundingClientRect().width));
  [37/93,8/93,14/93,34/93].forEach((p,i)=>assert.ok(Math.abs(p-widths[i])<.002));
  await page.reload();assert.match(await page.locator('[data-diagram="riskmatrix"] .result').innerText(),/3 × 5 = 15/);
  assert.equal(errors.length,0,errors.join('\n'));writeFileSync(out+'/checks.json',JSON.stringify({base,checks:results},null,2)+'\n');console.log(`PASS ${lang} JavaScript=${javascript}: 104 figure checks and risk/geometry checks`);await context.close();
 }
 writeFileSync(out+'/checks.json',JSON.stringify({base,checks:results},null,2)+'\n');console.log(`PASS ${results.length} diagram checks plus interactive, keyboard, reset, no-JS and proportional bars`);
}finally{await browser.close();}
