import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
const article=JSON.parse(readFileSync('content/perspectives/nas-cve-patching.json','utf8'));
const dir=process.env.NAS_CVE_BASE_URL?'.local/nas-cve/live':'.local/nas-cve/local';mkdirSync(dir,{recursive:true});
const route=(lang:string)=>`${lang==='en'?'/en':''}/perspectives/nas-cve-patching/`;
for(const lang of ['zh','en']){
 for(const width of [320,390,768,1280])test(`${lang} ${width}: content, layout and SVG downloads`,async({page,request})=>{
  await page.setViewportSize({width,height:900});await page.goto(route(lang));
  await expect(page.locator('.article-metadata')).toContainText('v1.0.0');await expect(page.locator('.article-metadata')).toContainText('2026-11-01');
  await expect(page.locator('figure.teaching-diagram')).toHaveCount(8);
  for(const s of article.text[lang].sections){await expect(page.getByRole('heading',{name:s.heading,exact:true})).toBeVisible();for(const para of s.paragraphs.filter((p:string)=>!p.includes('[')))await expect(page.locator('.prose')).toContainText(para);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await page.locator('.node p').evaluateAll(es=>es.every(e=>parseFloat(getComputedStyle(e).fontSize)>=16&&e.scrollWidth<=e.clientWidth))).toBe(true);
  for(const a of await page.locator('.svg-download').all()){const href=(await a.getAttribute('href'))!;const r=await request.get(href);expect(r.status()).toBe(200);expect(await r.body()).toEqual(readFileSync('site'+href));}
  await page.screenshot({path:`${dir}/${lang}-${width}.png`,fullPage:true});
  if(width===390)await page.locator('figure').first().screenshot({path:`${dir}/${lang}-diagram-mobile.png`});
  if(width===1280)await page.locator('figure').nth(6).screenshot({path:`${dir}/${lang}-offline-desktop.png`});
 });
 test(`${lang}: keyboard, 200% text and no JavaScript`,async({page,browser,baseURL})=>{
  await page.setViewportSize({width:390,height:844});await page.goto(route(lang));await page.waitForLoadState('networkidle');
  await page.keyboard.press('Tab');await expect(page.locator('.skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();
  for(let i=0;i<90;i++){await page.keyboard.press('Tab');if(await page.locator('.svg-download').first().evaluate(e=>e===document.activeElement))break;}
  await expect(page.locator('.svg-download').first()).toBeFocused();expect(await page.locator('.svg-download').first().evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await expect(page.locator('.svg-download').first()).toBeFocused();
  const download=page.waitForEvent('download');await page.keyboard.press('Enter');const file=await download;expect(readFileSync((await file.path())!)).toEqual(readFileSync('site'+await page.locator('.svg-download').first().getAttribute('href')));
  await page.addStyleTag({content:'html{font-size:200% !important}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`${dir}/${lang}-200.png`,fullPage:true});
  const c=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const p=await c.newPage();await p.goto(baseURL+route(lang));await expect(p.locator('figure')).toHaveCount(8);await expect(p.locator('table')).toHaveCount(2);await p.locator('.toc a').last().click();await expect(p).toHaveURL(/#understanding-check$/);await p.locator('.language').click();await expect(p.locator('html')).toHaveAttribute('lang',lang==='zh'?'en':'zh-Hant');await c.close();
 });
 test(`${lang}: discoverability and reciprocal reading`,async({page})=>{
  const prefix=lang==='en'?'/en':'';await page.goto(prefix+'/perspectives/');await page.getByRole('link',{name:article.text[lang].title,exact:true}).click();await expect(page).toHaveURL(/nas-cve-patching/);
  const back=page.locator('article a[href*="/nas-offline-recovery/"]');expect(await back.count()).toBe(1);const oldPath=new URL((await back.getAttribute('href'))!).pathname;await page.goto(oldPath);await expect(page.locator('article a[href*="/nas-cve-patching/"]')).toHaveCount(1);
  await page.goto(prefix+'/search/');await page.locator('#search-query').fill('CWE-331');await expect(page.locator('.reading-list').first().getByRole('link',{name:article.text[lang].title,exact:true})).toBeVisible();
 });
}
