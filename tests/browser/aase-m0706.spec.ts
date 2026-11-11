import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const normalized=(s:string)=>s.replace(/`/g,'').replace(/^### /gm,'').replace(/^> /gm,'').replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/^\s*(?:[-*]|\d+\.)\s+/gm,'').replace(/\s+/g,' ').trim();
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m07-c06.json','utf8'));
for(const lang of ['zh','en']){
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m07/concepts/m07-06/`;
 test(`${lang} complete body, responsive figures and exports`,async({page,request})=>{
  await page.goto(path);await expect(page.locator('[data-agent-review-figure]')).toHaveCount(5);
  for(const section of lesson.text[lang].sections){
   const node=page.locator(`h2#${section.id}`).locator('..');const body=normalized(await node.innerText());
   for(const p of section.paragraphs)expect(body).toContain(normalized(p));
   for(const b of section.blocks??[]){
    for(const value of [b.caption,b.description,b.heading].filter(Boolean))expect(body).toContain(normalized(value));
    for(const p of b.paragraphs??[])expect(body).toContain(normalized(p));
    for(const row of b.rows??[])for(const cell of row)expect(body).toContain(normalized(cell));
    for(const item of b.items??[]){expect(body).toContain(normalized(item.title));expect(body).toContain(normalized(item.body));}
    if(b.code)expect(await node.locator('code').allTextContents()).toContain(b.code);
   }
  }
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   for(let n=1;n<=5;n++)await page.locator(`[data-agent-review-figure="${n}"]`).screenshot({path:`.local/aase/m0706/${lang}-${width}-fig${n}.png`});
  }
  expect(await page.locator('article').evaluate(el=>Array.from(el.querySelectorAll('p,td')).every(x=>{const s=getComputedStyle(x);return parseFloat(s.fontSize)>=16&&parseFloat(s.lineHeight)/parseFloat(s.fontSize)>=1.7;}))).toBeTruthy();
  await page.setViewportSize({width:390,height:900});await page.addStyleTag({content:'html{font-size:200% !important}'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  for(let n=1;n<=5;n++){
   const asset=`/images/aase/m07-06-${n}-${lang}.svg`;const response=await request.get(asset);expect(response.ok()).toBeTruthy();expect(await response.body()).toEqual(readFileSync(`site${asset}`));
   await page.goto(asset);
   expect(await page.locator('svg').evaluate(svg=>{const v=(svg as unknown as SVGSVGElement).viewBox.baseVal;const boxes=Array.from(svg.querySelectorAll('text')).filter(x=>x.textContent?.trim()).map(el=>el.getBBox());return boxes.every(b=>b.x>=0&&b.y>=0&&b.x+b.width<=v.width&&b.y+b.height<=v.height)&&boxes.every((a,i)=>boxes.slice(i+1).every(b=>a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y));})).toBeTruthy();
   await page.screenshot({path:`.local/aase/m0706/${lang}-svg${n}.png`,fullPage:true});
  }
 });
 test(`${lang} no-JavaScript text, keyboard and reference answers`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}});const page=await context.newPage();await page.goto(path);
  await expect(page.locator('[data-agent-review-figure]')).toHaveCount(5);await page.keyboard.press('Tab');expect(await page.locator(':focus').count()).toBe(1);
  for(const q of lesson.text[lang].openChecks){const summary=page.locator(`[id="${q.id}"]`).locator('..').locator('summary');await summary.focus();await page.keyboard.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');for(const a of q.answer)expect(normalized(await summary.locator('..').innerText())).toContain(normalized(a));await page.keyboard.press('Space');await expect(summary.locator('..')).not.toHaveAttribute('open','');}
  const region=page.locator('.code-region').first();await region.focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(region).toBeFocused();
  await context.close();
 });
}
