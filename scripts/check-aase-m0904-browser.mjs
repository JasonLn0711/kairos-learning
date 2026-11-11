import {chromium} from '@playwright/test';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.AASE_BASE_URL??'http://127.0.0.1:4184';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m09-c04.json','utf8'));
const evidence='.local/aase-m0904';mkdirSync(evidence,{recursive:true});
const browser=await chromium.launch({headless:true});
const norm=s=>s.replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/^### /gm,'').replace(/^- /gm,'').replace(/\s+/g,' ').trim();
const results=[];
try{
 for(const lang of ['zh','en']){
  const url=base+(lang==='en'?'/en':'')+'/courses/aase/v1/m09/concepts/m09-04/';
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();page.setDefaultTimeout(15000);console.log('checking '+lang);
  await page.goto(url);const body=norm(await page.locator('body').innerText());assert.ok(body.includes('v1.1.0'));
  for(const section of lesson.text[lang].sections){
   assert.equal(await page.locator('#'+section.id).count(),1);
   for(const p of section.paragraphs)assert.ok(body.includes(norm(p)),`missing ${lang}/${section.id}: ${p}`);
   for(const b of section.blocks??[]){
    const strings=b.kind==='prose'?b.paragraphs:b.kind==='table'?[...b.headers,...b.rows.flat()]:[b.caption,b.description,...b.items.flatMap(i=>[i.title,i.body])];
    for(const text of strings)assert.ok(body.includes(norm(text)),`missing block ${lang}/${section.id}: ${text}`);
   }
  }
  for(const q of lesson.checks)for(const text of [q.text[lang].prompt,...q.text[lang].options])assert.ok(body.includes(norm(text)));
  assert.equal(await page.locator('figure[data-figure]').count(),3);
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:1000});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${lang}/${width} overflow`);
   const figure=page.locator('figure[data-figure="1"]');await figure.screenshot({path:`${evidence}/${lang}-${width}-comparison.png`});
   for(const n of [2,3])if(width===390||width===1280)await page.locator(`figure[data-figure="${n}"]`).screenshot({path:`${evidence}/${lang}-${width}-figure-${n}.png`});
   results.push(`${lang}/${width}: full text, no JS, no page overflow`);
  }
  console.log('200% '+lang);await page.evaluate(()=>document.documentElement.style.setProperty('font-size','200%','important'));console.log('font applied '+lang);await page.setViewportSize({width:320,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:`${evidence}/${lang}-200-percent.png`});
  const details=page.locator('#'+lesson.checks[0].id).locator('..').locator('details');await details.locator('summary').focus();await page.keyboard.press('Enter');assert.ok(await details.getAttribute('open')!==null);
  await page.keyboard.press('Space');assert.equal(await details.getAttribute('open'),null);
  await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement?.tagName),'SUMMARY');
  const region=page.locator('.table-scroll').first();await region.focus();assert.equal(await region.evaluate(e=>e===document.activeElement),true);await page.keyboard.press('ArrowRight');
  for(let n=1;n<=3;n++){
   const href=`/images/aase/m09-04-${n}-${lang}.svg`;const response=await context.request.get(base+href);assert.equal(response.status(),200);assert.deepEqual(await response.body(),readFileSync('site'+href));
   const svg=await context.newPage();await svg.goto(base+href);
   assert.deepEqual(await svg.locator('text').evaluateAll(nodes=>nodes.filter(e=>{const b=e.getBBox(),v=e.ownerSVGElement.viewBox.baseVal;return b.x<0||b.y<0||b.x+b.width>v.width+1||b.y+b.height>v.height+1}).map(e=>e.textContent)),[]);
   await svg.setContent(`<html><body style="margin:0"><img src="${base+href}" style="width:1000px;height:auto"></body></html>`);await svg.locator('img').screenshot({path:`${evidence}/${lang}-svg-${n}.png`});await svg.close();
  }
  await context.close();results.push(`${lang}: 200% text, native answer keyboard, local table focus, six source-matched download checks`);
 }
 writeFileSync(`${evidence}/results.json`,JSON.stringify({base,results},null,2)+'\n');console.log(results.join('\n'));
}finally{await browser.close();}
