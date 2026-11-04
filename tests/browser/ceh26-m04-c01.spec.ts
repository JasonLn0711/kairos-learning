import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
const source=JSON.parse(readFileSync('content/concepts/ceh26-m04-c01.json','utf8'));
const dir='.local/ceh26-m04-c01/'+(process.env.CEH_BASE_URL?'live':'local');mkdirSync(dir,{recursive:true});
const norm=(s:string)=>s.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/\s+/g,' ').trim();
for(const lang of ['zh','en']){
 const prefix=lang==='en'?'/en':'';const url=`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c01/`;
 test(`${lang}: complete new lesson, readable code, responsive text, one closed answer and navigation`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
  await expect(page.locator('h1')).toContainText('CEH M04-01');await expect(page.locator('.article-metadata')).toContainText('v1.0.0');
  const dates=page.locator('.article-metadata time');await expect(dates).toHaveCount(2);for(const date of await dates.all())await expect(date).toHaveAttribute('datetime','2026-11-04');
  await expect(page.locator('article h2[id^=section-]')).toHaveCount(10);await expect(page.locator('article details')).toHaveCount(1);const answer=page.locator('#answer-projects');await expect(answer).not.toHaveAttribute('open','');
  const text=norm((await page.locator('article').textContent())!);let cursor=0;
  for(const b of source.text[lang].sourceBody){
   const units=b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:[b.text];
   for(const unit of units){const v=norm(unit);const at=text.indexOf(v,cursor);expect(at,`Preserve source order: ${v.slice(0,90)}`).toBeGreaterThanOrEqual(cursor);cursor=at+v.length;}
  }
  await expect(page.locator('article pre')).toHaveCount(4);for(const pre of await page.locator('article pre').all()){
   expect(await pre.evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(242, 246, 245)');await expect(pre).toHaveAttribute('tabindex','0');await expect(pre).toHaveAttribute('role','region');
  }
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   expect(await page.locator('article p,article li').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,70)))).toEqual([]);
   if([390,1280].includes(width)){await page.screenshot({path:`${dir}/${lang}-${width}.png`,fullPage:true});await page.screenshot({path:`${dir}/${lang}-${width}-viewport.png`});}
  }
  await page.setViewportSize({width:320,height:900});await page.addStyleTag({content:'html{font-size:200% !important}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await answer.locator('summary').focus();await page.keyboard.press('Enter');await expect(answer).toHaveAttribute('open','');await expect(answer.locator('p')).toBeVisible();await page.keyboard.press('Space');await expect(answer).not.toHaveAttribute('open','');
  const pre=page.locator('article pre').first();await pre.focus();await page.keyboard.press('ArrowRight');await expect.poll(()=>pre.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);expect(await pre.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
  const links=page.locator('.next-links a');await expect(links.first()).toHaveAttribute('href',`${prefix}/courses/ceh/v13/m03/concepts/m03-08/`);await expect(links.last()).toHaveAttribute('href',`${prefix}/courses/ceh/v13/m04/#ceh26-m04-c02`);
  await page.goto(`${prefix}/search/`);await Promise.all([page.waitForResponse(r=>r.url().endsWith('/search-index.json')),page.locator('input[type=search]').fill('labreader')]);await expect(page.locator(`.reading-list a[href="${url}"]`)).toBeVisible();
  expect(errors).toEqual([]);
 });
 test(`${lang}: no JavaScript preserves complete lesson, sources and answer disclosure`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();await page.goto(url);
  await expect(page.locator('article h2[id^=section-]')).toHaveCount(10);await expect(page.locator('article pre')).toHaveCount(4);await expect(page.locator('article a[href^="https://"]')).toHaveCount(9);
  const answer=page.locator('#answer-projects');await expect(answer).not.toHaveAttribute('open','');await answer.locator('summary').click();await expect(answer.locator('p')).toBeVisible();await expect(page.locator('article')).toContainText('labreader');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
 });
}
