import {chromium} from '@playwright/test';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.CEH_NOTES_BASE_URL||'http://127.0.0.1:4227';
const source='docs/sources/ceh-notes/2026-11-10/c01-c05-replacement-2026-11-12/';
const models=JSON.parse(readFileSync(source+'diagram-models.json','utf8'));
const out='.local/ceh-c01-c05';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const results=[];
try{
 for(const lang of ['zh','en']){
  const page=await browser.newPage();
  await page.goto(base+(lang==='en'?'/en':'')+'/ceh-notes/2026-11-12/');
  for(const width of [320,390,768,1280])for(const zoom of [1,2]){
   await page.setViewportSize({width,height:900});
   await page.evaluate(z=>document.documentElement.style.fontSize=z===2?'200%':'',zoom);
   for(const m of models){
    const name=m.text[lang].name;const figure=page.locator(`[data-diagram="${name}"]`);
    if(m.spec.edges.length)await figure.locator('.connections path').first().waitFor({state:'attached'});
    await figure.evaluate(el=>el.scrollIntoView({block:'start'}));
    const geometry=await figure.evaluate(el=>{
     const svg=el.querySelector('.connections');
     return {nodes:el.querySelectorAll('[data-node]').length,edges:svg.querySelectorAll('path').length,valid:[...svg.querySelectorAll('path')].every(p=>!/(NaN|Infinity)/.test(p.getAttribute('d'))),overflow:document.documentElement.scrollWidth>innerWidth};
    });
    assert.deepEqual(geometry,{nodes:m.spec.count,edges:m.spec.edges.length,valid:true,overflow:false},`${lang}/${width}/${zoom}/${name}`);
    if(zoom===1&&(width===390||width===1280))await page.screenshot({path:`${out}/${name}-${lang}-${width}.png`});
    results.push({lang,width,zoom,name,...geometry});
   }
  }
  await page.close();
 }
 writeFileSync(out+'/checks.json',JSON.stringify({base,checks:results},null,2)+'\n');
 console.log(`PASS: ${results.length} hydrated figure checks; bilingual, four widths, 200%, fixed endpoints and no page overflow`);
}finally{await browser.close();}
