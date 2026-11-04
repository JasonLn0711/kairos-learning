import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
mkdirSync('.local/m04-retirement/screenshots',{recursive:true});
for(const lang of ['zh','en']){
 const prefix=lang==='en'?'/en':'';
 test(`${lang}: pending route, responsive HTML, keyboard and no old URLs`,async({page,request})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${prefix}/courses/ceh/v13/m04/`);
  await expect(page.locator('.concept-map li')).toHaveCount(10);
  await expect(page.locator('.concept-map a')).toHaveCount(0);
  for(let i=1;i<=10;i++)await expect(page.locator(`#ceh26-m04-c${String(i).padStart(2,'0')}`)).toContainText(lang==='zh'?'待發布':'Pending publication');
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
  const next=page.locator('.next-links a').last();await expect(next).toHaveAttribute('href',`${prefix}/courses/ceh/v13/m04/#ceh26-m04-c01`);await next.click();await expect(page.locator('#ceh26-m04-c01')).toBeVisible();
  for(const path of ['concepts/m04-01/','concepts/m04-12/','concepts/ceh26-m04-c01/','service-responses-and-enumeration/','quiz/','labs/'])expect((await request.get(`${prefix}/courses/ceh/v13/m04/${path}`)).status()).toBe(404);
  expect((await request.get('/images/ceh/m04-01-access-results.svg')).status()).toBe(404);
  expect((await request.get('/archive/ceh/m04-legacy-2026-11-04/manifest.json')).status()).toBe(404);
  await page.goto(`${prefix}/search/`);await Promise.all([page.waitForResponse(r=>r.url().endsWith('/search-index.json')),page.locator('input[type=search]').fill('M04')]);await expect(page.locator('.reading-list a[href*="/m04/"]')).toHaveCount(0);
  expect(errors).toEqual([]);
 });
 test(`${lang}: no JavaScript route and neighboring module`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();
  await page.goto(`${prefix}/courses/ceh/v13/m04/`);await expect(page.locator('.concept-map li')).toHaveCount(10);
  await page.goto(`${prefix}/courses/ceh/v13/m03/concepts/m03-08/`);await expect(page.locator('main details')).toHaveCount(4);await page.locator('main details summary').first().click();await expect(page.locator('main details').first()).toHaveAttribute('open','');
  await page.goto('/courses/matlab-practice/index.html');await expect(page.locator('h1')).toBeVisible();await context.close();
 });
}
