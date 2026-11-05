import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
mkdirSync('.local/m04-retirement/screenshots',{recursive:true});
for(const lang of ['zh','en']){
 const prefix=lang==='en'?'/en':'';
 test(`${lang}: pending route, responsive HTML, keyboard and no old URLs`,async({page,request})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${prefix}/courses/ceh/v13/m04/`);
  await expect(page.locator('.concept-map li')).toHaveCount(10);
  await expect(page.locator('.concept-map a')).toHaveCount(4);
  for(const i of [4,6,7,8,9,10])await expect(page.locator(`#ceh26-m04-c${String(i).padStart(2,'0')}`)).toContainText(lang==='zh'?'待發布':'Pending publication');
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await page.screenshot({path:`.local/m04-retirement/screenshots/${lang}-${width}.png`});
  }
  await page.setViewportSize({width:390,height:900});await page.addStyleTag({content:'html{font-size:200% !important}'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.keyboard.press('Tab');expect(await page.locator(':focus').count()).toBe(1);
  expect(await page.locator(':focus').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
  await page.goto(`${prefix}/courses/ceh/v13/m03/concepts/m03-08/`);
  const next=page.locator('.next-links a').last();await expect(next).toHaveAttribute('href',`${prefix}/courses/ceh/v13/m04/concepts/m04-01/`);await next.click();await expect(page.locator('h1')).toContainText('CEH M04-01');
  for(const path of ['concepts/ceh26-m04-c01/','concepts/m04-12/','concepts/ceh26-m04-c02/','service-responses-and-enumeration/','quiz/','labs/'])expect((await request.get(`${prefix}/courses/ceh/v13/m04/${path}`)).status()).toBe(404);
  expect((await request.get('/images/ceh/m04-01-access-results.svg')).status()).toBe(404);
  expect((await request.get('/archive/ceh/m04-legacy-2026-11-04/manifest.json')).status()).toBe(404);
  await page.goto(`${prefix}/search/`);await Promise.all([page.waitForResponse(r=>r.url().endsWith('/search-index.json')),page.locator('input[type=search]').fill('M04')]);await expect(page.locator('.reading-list a[href*="/courses/ceh/v13/m04/"]')).toHaveCount(4);await expect(page.locator('.reading-list a[href*="/courses/ceh/v13/m04/"]').first()).toHaveAttribute('href',`${prefix}/courses/ceh/v13/m04/concepts/m04-01/`);
  expect(errors).toEqual([]);
 });
 test(`${lang}: CEH overview distinguishes published lessons and pending M04`,async({page})=>{
  await page.goto(`${prefix}/courses/ceh/v13/`);
  const main=page.locator('main');
  await expect(main.locator('.lead')).toContainText(lang==='zh'?'已發布的章節提供雙語入門閱讀':'Published modules offer bilingual introductory reading');
  await expect(main.locator('.lead')).toContainText(lang==='zh'?'依實際教學逐步發布':'released progressively as teaching proceeds');
  await expect(main.locator('p.notice')).toContainText(lang==='zh'?'隨實際教學逐步發布':'will be released as teaching proceeds');
  await expect(main.locator('p.notice')).toContainText(lang==='zh'?'待發布項目尚無正文':'pending topics have no teaching body');
  await expect(main.locator('.notice').first()).toContainText(lang==='zh'?'不是 EC-Council 官方教材':'not official EC-Council courseware');
  await expect(main).not.toContainText(lang==='zh'?'每章都有完整雙語閱讀':'Each module includes complete bilingual reading');
  await expect(main).not.toContainText(lang==='zh'?'目前從 M04 開始':'starting with M04');
  const m04=main.locator('.module-list > li').filter({has:page.locator('a[href="'+prefix+'/courses/ceh/v13/m04/"]')});
  await expect(m04).toContainText(lang==='zh'?'10 個目錄項目，4 篇已整理':'10 topics, 4 available');
 });
 test(`${lang}: no JavaScript route and neighboring module`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();
  await page.goto(`${prefix}/courses/ceh/v13/m04/`);await expect(page.locator('.concept-map li')).toHaveCount(10);
  await page.goto(`${prefix}/courses/ceh/v13/m03/concepts/m03-08/`);await expect(page.locator('main details')).toHaveCount(4);await page.locator('main details summary').first().click();await expect(page.locator('main details').first()).toHaveAttribute('open','');
  await page.goto('/courses/matlab-practice/index.html');await expect(page.locator('h1')).toBeVisible();await context.close();
 });
}
