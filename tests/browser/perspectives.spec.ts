import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
const artifact='.local/perspectives-browser/screenshots';mkdirSync(artifact,{recursive:true});
for(const width of [320,390,768,1280])for(const lang of ['zh','en']){
 const prefix=lang==='en'?'/en':'';
 test(`${lang} ${width}px list/article/navigation`,async({page})=>{
  await page.setViewportSize({width,height:900});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${prefix}/perspectives/`);
  const title=lang==='zh'?'合成版型示範（非真實事件）':'Synthetic template preview (not a real incident)';
  await page.getByRole('link',{name:title,exact:true}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText(title);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('table')).toBeVisible();
  expect(await page.locator('pre').evaluate(e=>e.scrollWidth>e.clientWidth)).toBe(true);
  expect(await page.locator('.table-scroll').evaluate(e=>e.scrollWidth>e.clientWidth)).toBe(true);
  await page.screenshot({path:`${artifact}/${lang}-${width}.png`,fullPage:true});
  await page.locator('.language').click();
  await expect(page.locator('html')).toHaveAttribute('lang',lang==='zh'?'en':'zh-Hant');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
 });
}
for(const lang of ['zh','en'])test(`${lang} keyboard skip link, toc, scrolling, language and course roundtrip`,async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(`${lang==='en'?'/en':''}/perspectives/preview-perspective/`);
 await page.keyboard.press('Tab');await expect(page.locator('.skip')).toBeFocused();await expect(page.locator('.skip')).toBeInViewport();
 await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();
 for(let i=0;i<3;i++)await page.keyboard.press('Tab');
 await expect(page.locator('.toc a').first()).toBeFocused();await page.keyboard.press('Enter');await expect(page).toHaveURL(/#context$/);
 await page.keyboard.press('Tab');await expect(page.locator('pre')).toBeFocused();
 expect(await page.locator('pre').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 await page.keyboard.press('ArrowRight');await expect.poll(()=>page.locator('pre').evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
 await page.keyboard.press('Tab');await expect(page.locator('.table-scroll')).toBeFocused();await page.keyboard.press('ArrowRight');await expect.poll(()=>page.locator('.table-scroll').evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
 await page.screenshot({path:`${artifact}/${lang}-keyboard-table-focus.png`,fullPage:true});
 await page.locator('#related a').click();await page.getByRole('link',{name:lang==='zh'?'合成版型示範（非真實事件）':'Synthetic template preview (not a real incident)',exact:true}).click();await expect(page).toHaveURL(/perspectives\/preview-perspective\/$/);
});
for(const lang of ['zh','en'])test(`${lang} no JavaScript reading and fallback navigation`,async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();const prefix=lang==='en'?'/en':'';
 await page.goto(`http://127.0.0.1:4186${prefix}/perspectives/preview-perspective/`);
 await expect(page.locator('article')).toContainText(lang==='zh'?'合成資料':'Synthetic data');await expect(page.locator('table')).toBeVisible();
 await page.locator('.toc a').first().click();await expect(page).toHaveURL(/#context$/);
 await page.goto(`http://127.0.0.1:4186${prefix}/search/`);
 await page.getByRole('link',{name:lang==='zh'?'合成版型示範（非真實事件）':'Synthetic template preview (not a real incident)',exact:true}).click();await expect(page).toHaveURL(/preview-perspective\/$/);await context.close();
});
for(const lang of ['zh','en'])test(`${lang} search failure, fallback and recovery`,async({page})=>{
 const prefix=lang==='en'?'/en':'';let broken=true;await page.route('**/search-index.json',route=>broken?route.abort():route.continue());
 await page.goto(`${prefix}/search/`);await page.locator('#search-query').fill(lang==='zh'?'合成':'Synthetic');
 await expect(page.getByRole('status')).toContainText(lang==='zh'?'無法載入':'could not load');
 await expect(page.getByRole('link',{name:lang==='zh'?'合成版型示範（非真實事件）':'Synthetic template preview (not a real incident)',exact:true})).toBeVisible();
 broken=false;await page.getByRole('button',{name:lang==='zh'?'搜尋':'Search',exact:true}).click();await expect(page.getByRole('status')).toHaveCount(0);
 await expect(page.getByRole('link',{name:lang==='zh'?'合成版型示範（非真實事件）':'Synthetic template preview (not a real incident)',exact:true})).toHaveCount(2);
});
test('normal build publishes NAS article without synthetic route',async({page})=>{
 for(const prefix of ['','/en']){await page.goto(`http://127.0.0.1:4187${prefix}/perspectives/`);await expect(page.getByRole('link',{name:prefix?'The NAS Is Offline. What Should We Verify Next?':'NAS 已經斷網，接下來該確認什麼？',exact:true})).toBeVisible();expect((await page.goto(`http://127.0.0.1:4187${prefix}/perspectives/preview-perspective/`))?.status()).toBe(404);}
});

test('touch-emulated phone follows list, article, language and back',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3});
 const page=await context.newPage();await page.goto('http://127.0.0.1:4186/perspectives/');
 await page.getByRole('link',{name:'合成版型示範（非真實事件）',exact:true}).tap();
 await page.locator('.language').tap();await expect(page.locator('html')).toHaveAttribute('lang','en');
 await page.getByRole('link',{name:'Back to perspectives',exact:true}).tap();await expect(page).toHaveURL(/\/en\/perspectives\/$/);await context.close();
});
