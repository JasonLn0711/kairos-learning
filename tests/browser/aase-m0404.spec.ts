import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m04-c04.json','utf8'));
const norm=(s:string)=>s.replace(/\s+/g,' ').trim();
for(const lang of ['zh','en'] as const){
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m04/concepts/m04-04/`;
 test(`${lang}: full body, responsive figures, keyboard, no JS and downloads`,async({browser,page,request})=>{
  await page.goto(path);await expect(page.locator('body')).toContainText('v1.1.0');
  const body=norm(await page.locator('article').innerText());
  const verify=(value:string)=>expect(body).toContain(norm(value.replace(/^- /gm,'').replace(/^\d+\. /gm,'')));
  for(const section of lesson.text[lang].sections){
   await expect(page.locator('#'+section.id)).toHaveText(section.heading);
   for(const p of section.paragraphs)verify(p);
   for(const block of section.blocks??[]){
    if(block.kind==='prose')for(const p of block.paragraphs)verify(p);
    if(block.kind==='step')verify(block.code??'');
    if(block.kind==='table')for(const row of [block.headers,...block.rows])for(const cell of row)verify(cell);
    if(['cards','flow'].includes(block.kind))for(const item of block.items){
     if(section.id==='transitions')for(const end of item.title.split(' → '))verify(end);else verify(item.title);
     verify(item.body);
    }
   }
  }
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   await expect(page.locator('.wireframe-diagram')).toHaveCount(5);
   if(width===390||width===1280)for(let n=1;n<=5;n++)await page.locator(`.wireframe-diagram[data-figure="${n}"]`).screenshot({path:`.local/aase/m0404/${lang}-figure-${n}-${width}.png`});
   await page.screenshot({path:`.local/aase/m0404/${lang}-${width}.png`,fullPage:true});
  }
  await page.addStyleTag({content:'html{font-size:200%!important}'});
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   const bad=await page.locator('article p,article li,article figcaption').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,80)));expect(bad).toEqual([]);
  }
  await page.goto(path);const summary=page.locator('section').filter({has:page.locator('h2#checks')}).locator('details summary').first();await summary.focus();await page.keyboard.press('Enter');await expect(page.locator('section').filter({has:page.locator('h2#checks')}).locator('details').first()).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(page.locator('section').filter({has:page.locator('h2#checks')}).locator('details').first()).not.toHaveAttribute('open','');
  for(let n=1;n<=5;n++){
   const response=await request.get(`/images/aase/m04-04-${n}-${lang}.svg`);expect(response.ok()).toBeTruthy();
   expect(await response.body()).toEqual(readFileSync(`site/images/aase/m04-04-${n}-${lang}.svg`));
   const link=page.locator(`a[href="/images/aase/m04-04-${n}-${lang}.svg"]`);await link.focus();const popup=page.waitForEvent('popup');await page.keyboard.press('Enter');const svgPage=await popup;await svgPage.waitForLoadState();await svgPage.evaluate(()=>document.fonts.ready);
   const issues=await svgPage.locator('text').evaluateAll(es=>{
    const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox(),v:(e as SVGGraphicsElement).ownerSVGElement!.viewBox.baseVal}));
    return boxes.flatMap((a,i)=>[...(a.b.x<0||a.b.y<0||a.b.x+a.b.width>a.v.width||a.b.y+a.b.height>a.v.height?[a.text]:[]),...boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>a.text+' / '+c.text)]);
   });expect(issues).toEqual([]);await svgPage.close();
  }
  const context=await browser.newContext({javaScriptEnabled:false});const staticPage=await context.newPage();await staticPage.goto(new URL(path,page.url()).href);await expect(staticPage.locator('.wireframe-diagram')).toHaveCount(5);await expect(staticPage.locator('#file')).toBeVisible();expect(norm(await staticPage.locator('article').innerText())).toBe(body);const answer=staticPage.locator('h3#AASE-M04-C04-Q04').locator('..').locator('summary');await answer.focus();await answer.press('Enter');await expect(answer.locator('..')).toHaveAttribute('open','');await context.close();
 });
}
