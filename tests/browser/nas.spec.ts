import {test,expect} from '@playwright/test';
import {mkdirSync,readFileSync} from 'node:fs';
mkdirSync('.local/nas/screenshots',{recursive:true});
const path=(lang:string)=>`${lang==='en'?'/en':''}/perspectives/nas-offline-recovery/`;
for(const lang of ['zh','en'])for(const width of [320,390,768,1280])test(`${lang} ${width}px diagram readability and downloads`,async({page,request})=>{
 await page.setViewportSize({width,height:900});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path(lang));
 await expect(page.locator('.article-metadata')).toContainText('v'+JSON.parse(readFileSync('content/perspectives/nas-offline-recovery.json','utf8')).contentVersion);
 await expect(page.locator('.article-metadata')).not.toContainText(/v2(?:\s|$)/);
 await expect(page.locator('figure.teaching-diagram')).toHaveCount(6);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await page.locator('.node p').evaluateAll(es=>es.every(e=>parseFloat(getComputedStyle(e).fontSize)>=16&&e.scrollWidth<=e.clientWidth&&e.scrollHeight<=e.clientHeight))).toBe(true);
 await expect(page.locator('.cards').first()).toHaveJSProperty('childElementCount',3);
 for(const a of await page.locator('.svg-download').all()){const href=(await a.getAttribute('href'))!;const r=await request.get(href);expect(r.status()).toBe(200);expect(await r.body()).toEqual(readFileSync('site'+href));}
 await page.screenshot({path:`.local/nas/screenshots/${lang}-${width}.png`,fullPage:true});expect(errors).toEqual([]);
});
for(const lang of ['zh','en'])test(`${lang} keyboard, 200% text, no-JS and language navigation`,async({page,browser,baseURL})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(path(lang));await page.keyboard.press('Tab');await expect(page.locator('.skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();
 // Traverse the actual page order rather than assigning focus to the download.
 for(let n=0;n<80;n++){await page.keyboard.press('Tab');if(await page.locator('.svg-download').first().evaluate(e=>e===document.activeElement))break;}
 await expect(page.locator('.svg-download').first()).toBeFocused();expect(await page.locator('.svg-download').first().evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await expect(page.locator('.svg-download').first()).toBeFocused();
 const download=page.waitForEvent('download');await page.keyboard.press('Enter');const file=await download;const saved=await file.path();expect(readFileSync(saved!)).toEqual(readFileSync('site'+await page.locator('.svg-download').first().getAttribute('href')));
 await page.addStyleTag({content:'html {font-size:200% !important}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await page.locator('.node p').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth))).toBe(true);await page.screenshot({path:`.local/nas/screenshots/${lang}-text-200.png`,fullPage:true});
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const p=await context.newPage();await p.goto(baseURL+path(lang));await expect(p.locator('figure')).toHaveCount(6);await expect(p.locator('.node')).toHaveCount(26);await p.locator('.toc a').last().click();await expect(p).toHaveURL(/#understanding-check$/);await p.locator('.language').click();await expect(p.locator('html')).toHaveAttribute('lang',lang==='zh'?'en':'zh-Hant');await context.close();
});
test('NAS article is discoverable from list, search and related course',async({page})=>{
 await page.goto('/perspectives/');await page.getByRole('link',{name:'NAS 已經斷網，接下來該確認什麼？',exact:true}).click();await expect(page).toHaveURL(/nas-offline-recovery/);await page.locator('#related a').first().click();await page.getByRole('link',{name:'NAS 已經斷網，接下來該確認什麼？',exact:true}).click();await expect(page).toHaveURL(/nas-offline-recovery/);
 await page.goto('/search/');await page.locator('#search-query').fill('SMB');await expect(page.getByRole('link',{name:'NAS 已經斷網，接下來該確認什麼？',exact:true}).first()).toBeVisible();
});
