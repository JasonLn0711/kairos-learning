import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
const source=JSON.parse(readFileSync('content/concepts/ceh26-m04-c03.json','utf8'));
const norm=(s:string)=>s.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/`/g,'').replace(/\s+/g,' ').trim();
const dir='.local/c03';mkdirSync(dir,{recursive:true});
for(const lang of ['zh','en']){
 const prefix=lang==='en'?'/en':'';const path=`${prefix}/courses/ceh/v13/m04/concepts/m04-03/`;
 test(`${lang}: complete content, four widths, enlargement, keyboard, metadata and search`,async({page,request})=>{
  expect((await page.goto(path))?.status()).toBe(200);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://learn.cs-kairos.com'+path);
  await expect(page.locator('.article-metadata')).toContainText('v'+source.contentVersion);
  for(const [dateIndex,date] of (await page.locator('.article-metadata time').all()).entries())await expect(date).toHaveAttribute('datetime',dateIndex===0?'2026-11-04':'2026-11-05');
  await expect(page.locator('h1')).toContainText('M04-03');await expect(page.locator('h1')).not.toContainText('CEH26');await expect(page.locator('.ftp-smtp-diagram')).toHaveCount(2);const answer=page.locator('#answer-ftp-smtp-evidence');await expect(answer).not.toHaveAttribute('open','');await expect(page.locator('article details')).toHaveCount(1);
  const text=norm((await page.locator('article').textContent())!);let cursor=0;
  for(const b of source.text[lang].sourceBody)for(const unit of b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='visual'?[b.visual.caption,...(b.src.includes('-protocols-')?[0,2,3,1,4,5,8,6,9,7,10].map(i=>b.visual.items[i]):b.visual.items).flatMap((x:any)=>[x.title,...x.body.split('\n')]),b.visual.description]:[b.text]){const value=norm(unit);const at=text.indexOf(value,cursor);expect(at,value).toBeGreaterThanOrEqual(cursor);cursor=at+value.length;}
  for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await page.locator('article p, article li').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7)}).length)).toBe(0);for(const [i,figure] of (await page.locator('.ftp-smtp-diagram').all()).entries())await figure.screenshot({path:`${dir}/${lang}-${width}-diagram-${i}.png`});await page.screenshot({path:`${dir}/${lang}-${width}.png`,fullPage:true});}
  await page.setViewportSize({width:320,height:900});await page.addStyleTag({content:'html{font-size:200%!important}'});const zoom=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,articleRight:document.querySelector('article')!.getBoundingClientRect().right}));console.log(lang+' 200% text '+JSON.stringify(zoom));expect(zoom.articleRight).toBeLessThanOrEqual(zoom.width);expect(zoom.scrollWidth).toBeLessThanOrEqual(zoom.width);
  await answer.locator('summary').focus();await page.keyboard.press('Enter');await expect(answer).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(answer).not.toHaveAttribute('open','');await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await expect(answer.locator('summary')).toBeFocused();expect(await answer.locator('summary').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
  await expect(page.locator('.next-links a').first()).toHaveAttribute('href',`${prefix}/courses/ceh/v13/m04/concepts/m04-02/`);await expect(page.locator('.next-links a').last()).toHaveAttribute('href',`${prefix}/courses/ceh/v13/m04/concepts/m04-04/`);
  for(const link of await page.locator('.ftp-smtp-diagram a[download]').all()){const href=(await link.getAttribute('href'))!;await link.focus();const pending=page.waitForEvent('download');await page.keyboard.press('Enter');const download=await pending;expect(download.suggestedFilename()).toBe(href.split('/').at(-1));const response=await request.get(href);expect(response.status()).toBe(200);expect(await response.body()).toEqual(readFileSync('site'+href));}await page.goto(`${prefix}/search/`);await page.locator('input[type=search]').fill('employee_salary.xlsx');await expect(page.locator(`.reading-list a[href="${path}"]`)).toBeVisible();
  for(const slug of ['ceh26-m04-c03','m04-10','m04-11','m04-12'])expect((await request.get(`${prefix}/courses/ceh/v13/m04/concepts/${slug}/`)).status()).toBe(404);
  const sitemap=await (await request.get('/sitemap.xml')).text();expect(sitemap).toContain(path);expect(sitemap).not.toMatch(/\/courses\/ceh\/v13\/m04\/concepts\/m04-1[0-2]\//);
 });
 test(`${lang}: no JavaScript retains body, sources and native answer`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();await page.goto(path);await expect(page.locator('article')).toContainText('employee_salary.xlsx');await expect(page.locator('article h2[id^=section-]')).toHaveCount(11);await expect(page.locator('#part-smtp')).toBeVisible();await expect(page.locator('#recap')).toBeVisible();await expect(page.locator('#check')).toBeVisible();expect(await page.locator('article a[href^="https://"]').count()).toBeGreaterThanOrEqual(6);const answer=page.locator('#answer-ftp-smtp-evidence');await expect(answer).not.toHaveAttribute('open','');await answer.locator('summary').click();await expect(answer.locator('p').first()).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
 });
}

test('four downloadable FTP/SMTP SVGs retain bounded text geometry',async({page,request})=>{
 await page.setViewportSize({width:1280,height:1600});
 for(const lang of ['zh','en'])for(const key of ['protocols','evidence']){
  const path=`/images/ceh/m04-03-${key}-${lang}-v1-1-0.svg`;const response=await request.get(path);expect(response.status()).toBe(200);await page.setContent(await response.text());await page.evaluate(()=>window.scrollTo(0,0));
  const bad=await page.locator('svg text').evaluateAll(es=>es.flatMap(e=>{const b=e.getBoundingClientRect(),r=(e as SVGGraphicsElement).ownerSVGElement!.getBoundingClientRect();return b.left<r.left-.1||b.top<r.top-.1||b.right>r.right+.1||b.bottom>r.bottom+.1?[e.textContent]:[]}));expect(bad).toEqual([]);if(key==='protocols'){await expect(page.locator('g[id*="node-"]')).toHaveCount(5);const clipped=await page.locator('g[id*="node-"]').evaluateAll(gs=>gs.flatMap(g=>{const r=g.querySelector('rect')!.getBoundingClientRect();return [...g.querySelectorAll('text')].filter(t=>{const b=t.getBoundingClientRect();return b.left<r.left-.1||b.top<r.top-.1||b.right>r.right+.1||b.bottom>r.bottom+.1}).map(t=>t.textContent)}));expect(clipped).toEqual([]);}
  await page.screenshot({path:`${dir}/${lang}-${key}-svg.png`,fullPage:true});
 }
});
