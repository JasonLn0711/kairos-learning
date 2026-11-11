import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const normalized=(s:string)=>s.replace(/`/g,'').replace(/^\s*(?:[-*]|\d+\.)\s+/gm,'').replace(/\s+/g,' ').trim();
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m06-c06.json','utf8'));
for(const lang of ['zh','en']){
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m06/concepts/m06-06/`;
 test(`${lang} complete body, four widths and exports`,async({page,request})=>{
  await page.goto(path);
  for(const section of lesson.text[lang].sections){
   const node=page.locator(`h2#${section.id}`).locator('..');await expect(node).toBeVisible();
   for(const paragraph of section.paragraphs)expect(normalized(await node.innerText())).toContain(normalized(paragraph));
   for(const block of section.blocks??[]){
    if(block.kind==='prose')for(const p of block.paragraphs)expect(normalized(await node.innerText())).toContain(normalized(p));
    if(block.kind==='table')for(const row of block.rows)for(const cell of row)expect(normalized(await node.innerText())).toContain(normalized(cell));
    if(block.kind==='step'){for(const p of block.paragraphs)expect(normalized(await node.innerText())).toContain(normalized(p));if(block.code)expect(await node.locator('code').allTextContents()).toContain(block.code);}
   }
  }
  await expect(page.locator('[data-tls-figure]')).toHaveCount(3);
  const search=await request.get('/search-index.json');expect(search.ok()).toBeTruthy();
  const entry=(await search.json()).find((e:any)=>e.id===lesson.id&&e.lang===lang);expect(entry).toBeTruthy();
  for(const section of lesson.text[lang].sections)expect(entry.text).toContain(section.heading);
  for(const figure of lesson.text[lang].sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>['cards','flow'].includes(b.kind)))for(const item of figure.items){expect(entry.text).toContain(item.title);for(const part of item.body.split('\n→ '))expect(entry.text).toContain(part);}
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   for(let n=1;n<=3;n++)await page.locator(`[data-tls-figure="${n}"]`).screenshot({path:`.local/aase/m0606/${lang}-${width}-figure-${n}.png`});
   await page.screenshot({path:`.local/aase/m0606/${lang}-${width}.png`,fullPage:true});
  }
  await page.setViewportSize({width:390,height:900});
  await page.addStyleTag({content:'html{font-size:200% !important}'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  for(let n=1;n<=3;n++){
   const asset=`/images/aase/m06-06-${n}-${lang}.svg`;
   const response=await request.get(asset);expect(response.ok()).toBeTruthy();
   expect(await response.body()).toEqual(readFileSync(`site${asset}`));
   const svgPage=await page.context().newPage();await svgPage.setContent(await response.text());
   expect(await svgPage.locator('svg').evaluate(svg=>{const v=(svg as SVGSVGElement).viewBox.baseVal;const boxes=[...svg.querySelectorAll('text')].map(t=>t.getBBox());return boxes.every(b=>b.x>=0&&b.y>=0&&b.x+b.width<=v.width&&b.y+b.height<=v.height)&&boxes.every((a,i)=>boxes.slice(i+1).every(b=>Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)<=1||Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)<=1));})).toBeTruthy();await svgPage.close();
  }
 });
 test(`${lang} no-JavaScript reading and keyboard`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto(path);
  await expect(page.locator('[data-tls-figure]')).toHaveCount(3);
  await page.keyboard.press('Tab');expect(await page.locator(':focus').count()).toBe(1);
  const summary=page.locator('summary').first();if(await summary.count()){await summary.focus();await page.keyboard.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');}
  await context.close();
 });
}
