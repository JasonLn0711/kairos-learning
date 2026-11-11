import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
const normalized=(s:string)=>s.replace(/`/g,'').replace(/^\s*(?:[-*]|\d+\.)\s+/gm,'').replace(/\s+/g,' ').trim();
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m07-c07.json','utf8'));
mkdirSync('.local/aase/m0707',{recursive:true});
for(const lang of ['zh','en']){
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m07/concepts/m07-07/`;
 test(`${lang} complete body, four widths, 200 percent and SVG downloads`,async({page,request})=>{
  await page.goto(path);
  for(const section of lesson.text[lang].sections){
   const node=page.locator(`h2#${section.id}`).locator('..');await expect(node).toBeVisible();
   for(const paragraph of section.paragraphs)expect(normalized(await node.innerText())).toContain(normalized(paragraph));
   for(const block of section.blocks??[]){
    if(block.kind==='prose')for(const p of block.paragraphs)expect(normalized(await node.innerText())).toContain(normalized(p));
    if(block.kind==='table')for(const row of [block.headers,...block.rows])for(const cell of row)expect(normalized(await node.innerText())).toContain(normalized(cell));
    if(block.kind==='step'){for(const p of block.paragraphs)expect(normalized(await node.innerText())).toContain(normalized(p));if(block.code)expect(await node.locator('code').allTextContents()).toContain(block.code);}
    if(block.kind==='flow'||block.kind==='cards'){expect(normalized(await node.innerText())).toContain(normalized(block.caption));expect(normalized(await node.innerText())).toContain(normalized(block.description));}
   }
  }
  await expect(page.locator('[data-debugging-figure]')).toHaveCount(4);
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   for(const figure of await page.locator('[data-debugging-figure]').all()){
    expect(await figure.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBeTruthy();
    for(const text of await figure.locator('p,strong,label,button,a').all())expect(await text.evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
   }
   await page.screenshot({path:`.local/aase/m0707/${lang}-${width}.png`,fullPage:true});
   if(width===390||width===1280)for(let n=1;n<=4;n++)await page.locator(`[data-debugging-figure="${n}"]`).screenshot({path:`.local/aase/m0707/figure-${n}-${lang}-${width}.png`});
  }
  await page.setViewportSize({width:390,height:900});
  for(const region of await page.locator('#main .code-region,#main .table-scroll').all()){
   await region.focus();await expect(region).toBeFocused();
   if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await page.keyboard.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}
  }
  await page.addStyleTag({content:'html{font-size:200% !important}'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:`.local/aase/m0707/${lang}-200percent.png`,fullPage:true});
  for(let n=1;n<=4;n++){
   const asset=`/images/aase/m07-07-${n}-${lang}.svg`,link=page.locator(`a[href="${asset}"]`);
   await link.focus();await expect(link).toBeFocused();
   const popup=page.waitForEvent('popup');await page.keyboard.press('Enter');const svgPage=await popup;await svgPage.waitForLoadState('domcontentloaded');
   expect(new URL(svgPage.url()).pathname).toBe(asset);await svgPage.close();
   const response=await request.get(asset);expect(response.ok()).toBeTruthy();
   expect(await response.body()).toEqual(readFileSync(`site${asset}`));
  }
  const index=await request.get('/search-index.json');expect(index.ok()).toBeTruthy();const data=await index.json();
  const entry=data.find((e:any)=>e.id==='AASE-M07-C07'&&e.lang===lang);expect(entry.text).toContain('git restore -p --source=HEAD -- app.py');
 });
 test(`${lang} real stale-state comparison, export and clipboard`,async({page,context})=>{
  await page.goto(path);const sim=page.locator('[data-debugging-figure="2"]');
  const fields=sim.locator('input[type=text]'),check=sim.getByRole('button',{name:lang==='zh'?'執行資料檢查':'Check data',exact:true});
  const report=sim.getByRole('link',{name:lang==='zh'?'下載合成報告':'Download synthetic report',exact:true});
  await expect(check).toBeEnabled();await expect(report).toHaveCount(0);
  await check.click();await expect(report).toBeVisible();await fields.nth(2).fill('');await expect(report).toBeVisible();
  const stale=JSON.parse(decodeURIComponent((await report.getAttribute('href'))!.split(',')[1]));expect(stale.checkedInput.docType).toBe('財務報表');
  await sim.getByRole('radio',{name:lang==='zh'?'有 Bug':'Bug',exact:true}).focus();await page.keyboard.press('ArrowRight');await expect(sim.getByRole('radio',{name:lang==='zh'?'已修復':'Fixed',exact:true})).toBeChecked();await expect(report).toHaveCount(0);
  await fields.nth(2).fill(' ');await check.click();await expect(report).toHaveCount(0);
  await fields.nth(2).fill('財務報表');await check.click();await expect(report).toBeVisible();
  await fields.nth(2).fill('資產負債表');await expect(report).toHaveCount(0);await fields.nth(2).fill('財務報表');await expect(report).toHaveCount(0);
  await check.click();await expect(report).toBeVisible();await fields.nth(0).fill('乙公司');await expect(report).toHaveCount(0);await check.click();
  const download=page.waitForEvent('download');await report.click();const saved=await download;expect(saved.suggestedFilename()).toBe('synthetic-report.txt');
  const parsed=JSON.parse(decodeURIComponent((await report.getAttribute('href'))!.split(',')[1]));expect(parsed).toEqual({simulation:true,checkedInput:{name:'乙公司',taxId:'12345678',docType:'財務報表'}});expect(JSON.parse(readFileSync((await saved.path())!,'utf8'))).toEqual(parsed);
  const copy=page.locator('[data-debugging-figure="4"] button');await expect(copy).toBeEnabled();
  await context.grantPermissions(['clipboard-read','clipboard-write']);await copy.focus();await page.keyboard.press('Enter');
  const copied=await page.evaluate(()=>navigator.clipboard.readText());expect(copied).toContain(lesson.text[lang].sections.find((s:any)=>s.id==='agent-task').blocks[0].items[2].body);
  await copy.focus();await page.keyboard.press('Shift+Tab');expect(await page.locator(':focus').count()).toBe(1);
  const actual=page.locator('details').filter({has:page.locator('summary')}).last().locator('summary');await actual.focus();await page.keyboard.press('Enter');await expect(actual.locator('..')).toHaveAttribute('open','');
 });
 test(`${lang} no-JavaScript reading`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();await page.goto(path);
  await expect(page.locator('[data-debugging-figure]')).toHaveCount(4);
  for(const control of await page.locator('[data-debugging-figure="2"] input,[data-debugging-figure] button').all())await expect(control).toBeDisabled();
  await expect(page.locator('[data-debugging-figure="2"] .static-example')).toBeVisible();
  const summary=page.locator('summary').last();await summary.focus();await page.keyboard.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await context.close();
 });
 test(`${lang} SVG label bounds and no text overlap`,async({page,request})=>{
  for(let n=1;n<=4;n++){
   const response=await request.get(`/images/aase/m07-07-${n}-${lang}.svg`);expect(response.ok()).toBeTruthy();
   await page.setContent(await response.text());await page.evaluate(()=>document.fonts.ready);
   const errors=await page.evaluate(()=>{
    const svg=document.querySelector('svg')!,v=svg.viewBox.baseVal;const nodes=[...document.querySelectorAll('text')].map(e=>({text:e.textContent,box:e.getBBox()}));const errors:string[]=[];
    for(const {text,box:b} of nodes)if(b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height)errors.push('outside: '+text);
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i].box,b=nodes[j].box;if(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>1)errors.push('overlap: '+nodes[i].text+' / '+nodes[j].text);}
    return errors;
   });expect(errors).toEqual([]);await page.locator('svg').screenshot({path:`.local/aase/m0707/svg-${n}-${lang}.png`});
  }
 });
}
