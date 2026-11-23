import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const glyphs=process.argv[2]==='glyphs';
const dir='.local/interactive-v2/task0'+(glyphs?'4':'3');
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
const receipts=[];
try {
 for(const width of [1280,390]) for(const dpr of [1,2]) for(const forcedColors of ['none','active']){
  const height=width===390?844:720;
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr,forcedColors});
  await page.goto('http://127.0.0.1:4613/tests/visual-gallery/'+(glyphs?'?glyphs':''));
  await page.locator('main section').first().waitFor();
  if(glyphs && dpr===2)await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  const metrics=await page.evaluate(()=>({
   doc:document.documentElement.scrollWidth,
   ids:[...document.querySelectorAll('[id]')].map(e=>e.id),
   frames:[...document.querySelectorAll('section svg')].map(e=>e.getBoundingClientRect().width)
  }));
  assert.equal(metrics.doc,width);
  assert.equal(new Set(metrics.ids).size,metrics.ids.length);
  assert.ok(metrics.frames.length && metrics.frames.every(w=>w>0));
  if(glyphs){
    for(const card of await page.locator('[data-gallery-role]').all()){
      const role=await card.getAttribute('data-gallery-role');
      const samples=card.locator('[data-glyph="'+role+'"]');
      assert.ok(await samples.count()>=2);
      assert.ok(await card.getByRole('heading').textContent());
      assert.equal(await samples.first().getAttribute('data-state'),'idle');
      if(await samples.count()>2) assert.equal(await samples.nth(4).getAttribute('data-state'),'failed');
      const inside=await samples.evaluateAll(items=>items.every(g=>{
        const svg=g.ownerSVGElement, a=g.getBoundingClientRect(), b=svg.getBoundingClientRect();
        return a.left>=b.left-1 && a.right<=b.right+1 && a.top>=b.top-1 && a.bottom<=b.bottom+1;
      }));
      assert.ok(inside,'Clipped '+role);
    }
  }
  const name=width+'-'+dpr+'-'+forcedColors+'.png';
  const bytes=await page.screenshot({path:dir+'/'+name,fullPage:true});
  receipts.push({name,width,height,dpr,forcedColors,frames:metrics.frames.length,browser:browser.version(),utc:new Date().toISOString(),sha256:createHash('sha256').update(bytes).digest('hex')});
  if(glyphs && dpr===1 && forcedColors==='none'){
   for(const card of await page.locator('[data-gallery-role]').all()) await card.screenshot({path:dir+'/'+width+'-'+await card.getAttribute('data-gallery-role')+'.png'});
  }
  await page.close();
 }
 await writeFile(dir+'/manifest.json',JSON.stringify(receipts,null,2));
 console.log(receipts.length+' gallery captures passed');
}finally{await browser.close()}
