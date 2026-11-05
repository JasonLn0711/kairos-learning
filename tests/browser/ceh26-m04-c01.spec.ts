import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
const flatten=(b:any)=>b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:[b.text];
const source=JSON.parse(readFileSync('content/concepts/ceh26-m04-c01.json','utf8'));
const dir='.local/m04-public-slugs/'+(process.env.CEH_BASE_URL?'live':'local');mkdirSync(dir,{recursive:true});
const norm=(s:string)=>s.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/\s+/g,' ').trim();
for(const lang of ['zh','en']){
 const prefix=lang==='en'?'/en':'';const url=`${prefix}/courses/ceh/v13/m04/concepts/m04-01/`;
 test(`${lang}: complete new lesson, readable code, responsive text, one closed answer and navigation`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));const response=await page.goto(url);expect(response?.status()).toBe(200);
  const base='https://learn.cs-kairos.com';const zhPath='/courses/ceh/v13/m04/concepts/m04-01/';
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',base+url);
  await expect(page.locator('link[hreflang=zh-Hant]')).toHaveAttribute('href',base+zhPath);
  await expect(page.locator('link[hreflang=en]')).toHaveAttribute('href',base+'/en'+zhPath);
  await expect(page.locator('link[hreflang=x-default]')).toHaveAttribute('href',base+zhPath);
  await expect(page.locator('article')).toContainText('Finance');await expect(page.locator('article')).toContainText('demo.txt');await expect(page.locator('article')).not.toContainText('SMB/Kafka');
  await expect(page.locator('h1')).toContainText('CEH M04-01');await expect(page.locator('.article-metadata')).toContainText('v1.1.0');
  const dates=page.locator('.article-metadata time');await expect(dates).toHaveCount(2);for(const date of await dates.all())await expect(date).toHaveAttribute('datetime','2026-11-04');
  await expect(page.locator('article h2[id^=section-]')).toHaveCount(10);await expect(page.locator('article details')).toHaveCount(1);const answer=page.locator('#answer-projects');await expect(answer).not.toHaveAttribute('open','');
  await expect(page.locator('.source-body h2[id]')).toHaveCount(14);await expect(page.locator('.source-body table')).toHaveCount(9);
  const headings=JSON.parse(readFileSync('docs/sources/ceh26-m04-c01/detailed-section-map.json','utf8'));
  expect(await page.locator('.source-body h2[id],.source-body h3[id]').evaluateAll(es=>es.map(e=>({id:e.id,text:e.textContent})))).toEqual(headings.map((h:any)=>({id:h.id,text:h[lang]})));
  const text=norm((await page.locator('article').textContent())!);let cursor=0;
  for(const b of source.text[lang].sourceBody){
   const units=flatten(b);
   for(const unit of units){const v=norm(unit);const at=text.indexOf(v,cursor);expect(at,`Preserve source order: ${v.slice(0,90)}`).toBeGreaterThanOrEqual(cursor);cursor=at+v.length;}
  }
  await expect(page.locator('article pre')).toHaveCount(source.text[lang].sourceBody.filter((b:any)=>b.kind==='code').length);for(const pre of await page.locator('article pre').all()){
   expect(await pre.evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(242, 246, 245)');await expect(pre).toHaveAttribute('tabindex','0');await expect(pre).toHaveAttribute('role','region');
  }
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   expect(await page.locator('article p,article li,article td,article th,.source-body h3[id],.source-body pre').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||(e.tagName!=='PRE'&&e.scrollWidth>e.clientWidth+1))}).map(e=>e.textContent?.slice(0,70)))).toEqual([]);
   if([390,1280].includes(width)){await page.screenshot({path:`${dir}/${lang}-${width}.png`,fullPage:true});await page.screenshot({path:`${dir}/${lang}-${width}-viewport.png`});await page.locator('#section-4').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/${lang}-${width}-smb.png`});await page.locator('article .table-scroll').nth(5).screenshot({path:`${dir}/${lang}-${width}-table.png`});}
  }
  await page.waitForLoadState('networkidle');await page.keyboard.press('Tab');await expect(page.locator('.skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();
  const table=page.locator('article .table-scroll').first();await table.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await expect(table).toBeFocused();expect(await table.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
  await page.setViewportSize({width:320,height:900});await page.addStyleTag({content:'html{font-size:200% !important}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await answer.locator('summary').focus();await page.keyboard.press('Enter');await expect(answer).toHaveAttribute('open','');await expect(answer.locator('p')).toBeVisible();await page.keyboard.press('Space');await expect(answer).not.toHaveAttribute('open','');
  const pre=page.locator('article pre').first();await pre.focus();await page.keyboard.press('ArrowRight');await expect.poll(()=>pre.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);expect(await pre.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
  const links=page.locator('.next-links a');await expect(links.first()).toHaveAttribute('href',`${prefix}/courses/ceh/v13/m03/concepts/m03-08/`);await expect(links.last()).toHaveAttribute('href',`${prefix}/courses/ceh/v13/m04/concepts/m04-02/`);
  await page.goto(`${prefix}/search/`);await Promise.all([page.waitForResponse(r=>r.url().endsWith('/search-index.json')),page.locator('input[type=search]').fill('labuser')]);await expect(page.locator(`.reading-list a[href="${url}"]`)).toBeVisible();await page.locator('input[type=search]').fill('CEH26-M04-C01');await expect(page.locator(`.reading-list a[href="${url}"]`)).toBeVisible();
  expect(errors).toEqual([]);
 });
 test(`${lang}: no JavaScript preserves complete lesson, sources and answer disclosure`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();await page.goto(url);
  await expect(page.locator('article h2[id^=section-]')).toHaveCount(10);await expect(page.locator('article pre')).toHaveCount(source.text[lang].sourceBody.filter((b:any)=>b.kind==='code').length);await expect(page.locator('article a[href^="https://"]')).toHaveCount(source.text[lang].sourceBody.flatMap(flatten).reduce((n:number,s:string)=>n+(s.match(/\[[^\]]+\]\(https:\/\/[^)]+\)/g)||[]).length,0));
  const answer=page.locator('#answer-projects');await expect(answer).not.toHaveAttribute('open','');await answer.locator('summary').click();await expect(answer.locator('p')).toBeVisible();await expect(page.locator('article')).toContainText('labuser');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
 });
}

for(const prefix of ['', '/en'])test(`${prefix||'zh'}: former stable-ID URL is a real 404, public data and sitemap use one canonical`,async({request})=>{
 for(const path of ['ceh26-m04-c01','ceh26-m04-c02','ceh26-m04-c03','ceh26-m04-c04','m04-05','m04-09','m04-10','m04-11','m04-12']){const response=await request.get(`${prefix}/courses/ceh/v13/m04/concepts/${path}/`);expect(response.status()).toBe(404);expect(await response.text()).not.toContain('reference-answer');}
 const response=await request.get(`${prefix}/courses/ceh/v13/m04/concepts/m04-01/__data.json`);expect(response.status()).toBe(200);const data=await response.text();expect(data).toContain('CEH26-M04-C01');expect(data).toContain('demo.txt');expect(data).not.toContain('concepts/ceh26-m04-c01/');
 const index=await (await request.get('/search-index.json')).json();const entries=index.filter((e:any)=>e.label==='CEH M04');expect(entries).toHaveLength(8);expect(entries.map((e:any)=>e.id)).toEqual(['CEH26-M04-C01','CEH26-M04-C02','CEH26-M04-C03','CEH26-M04-C04','CEH26-M04-C01','CEH26-M04-C02','CEH26-M04-C03','CEH26-M04-C04']);expect(entries.find((e:any)=>e.lang===(prefix?'en':'zh')).href).toBe(`${prefix}/courses/ceh/v13/m04/concepts/m04-01/`);
 const sitemap=await (await request.get('/sitemap.xml')).text();expect(sitemap).toContain(`${prefix}/courses/ceh/v13/m04/concepts/m04-01/`);expect(sitemap).not.toContain('/concepts/ceh26-m04-c');expect(sitemap).not.toMatch(/m04\/concepts\/m04-(?:0[5-9]|1[0-2])\//);
});
