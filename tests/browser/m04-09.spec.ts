import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const source=JSON.parse(readFileSync('content/concepts/ceh26-m04-c09.json','utf8'));
const norm=(s:string)=>s.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/\s+/g,' ').trim();
const dir='.local/m04-09/'+(process.env.M04_09_BASE_URL?'live':'local');mkdirSync(dir,{recursive:true});
for(const lang of ['zh','en']){
 const prefix=lang==='en'?'/en':'';const path=prefix+'/courses/ceh/v13/m04/concepts/m04-09/';
 test(lang+': full paired body, four widths, 200% text, keyboard and navigation',async({page})=>{
  expect((await page.goto(path))?.status()).toBe(200);await expect(page.locator('h1')).toContainText('M04-09');
  await expect(page.locator('h1')).not.toContainText('CEH26');await expect(page.locator('.article-metadata')).toContainText('v'+source.contentVersion);
  const dates=page.locator('.article-metadata time');await expect(dates).toHaveCount(2);await expect(dates.nth(0)).toHaveAttribute('datetime',source.publishedOn);await expect(dates.nth(1)).toHaveAttribute('datetime',source.date);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://learn.cs-kairos.com'+path);
  const body=source.text[lang].sourceBody;const text=norm((await page.locator('article').textContent())!);let cursor=0;
  for(const b of body)for(const unit of b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:[b.text]){const value=norm(unit);const at=text.indexOf(value,cursor);expect(at,value).toBeGreaterThanOrEqual(cursor);cursor=at+value.length;}
  const answer=page.locator('#answer-response-evidence');await expect(page.locator('article details')).toHaveCount(1);await expect(answer).not.toHaveAttribute('open','');
  for(const heading of await page.locator('.source-body h2').all())await expect(heading).toBeVisible();
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   expect(await page.locator('.source-body p,.source-body li').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7)}).length)).toBe(0);
   await page.screenshot({path:dir+'/'+lang+'-'+width+'.png',fullPage:true});
  }
  await page.setViewportSize({width:320,height:900});await page.addStyleTag({content:'html{font-size:200%!important}'});
  const zoom=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,articleRight:document.querySelector('article')!.getBoundingClientRect().right}));
  writeFileSync(dir+'/'+lang+'-zoom.json',JSON.stringify(zoom));expect(zoom.articleRight).toBeLessThanOrEqual(zoom.width);expect(zoom.scrollWidth).toBeLessThanOrEqual(zoom.width);
  await answer.locator('summary').focus();expect(await answer.locator('summary').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter');await expect(answer).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(answer).not.toHaveAttribute('open','');
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await expect(answer.locator('summary')).toBeFocused();
  await expect(page.locator('.next-links a').first()).toHaveAttribute('href',prefix+'/courses/ceh/v13/m04/concepts/m04-08/');
  await expect(page.locator('.next-links a').last()).toHaveAttribute('href',prefix+'/courses/ceh/v13/m04/#ceh26-m04-c10');
  await page.goto(prefix+'/search/');await page.locator('input[type=search]').fill('IKE_SA_INIT');await expect(page.locator('.reading-list a[href="'+path+'"]')).toBeVisible();
 });
 test(lang+': no JavaScript retains selectable body, sources and native answer',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();await page.goto(path);
  await expect(page.locator('.source-body h2')).toHaveCount(9);await expect(page.locator('.source-body a[href^="https://"]')).toHaveCount(16);
  const answer=page.locator('#answer-response-evidence');await expect(answer).not.toHaveAttribute('open','');await answer.locator('summary').focus();await page.keyboard.press('Enter');await expect(answer.locator('p').first()).toBeVisible();
  const selected=await page.locator('.source-body p').first().evaluate(e=>{const r=document.createRange();r.selectNodeContents(e);const s=getSelection()!;s.removeAllRanges();s.addRange(r);return s.toString();});expect(selected.length).toBeGreaterThan(30);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
 });
 test(lang+': actual article text doubles at 320px without clipping',async({page})=>{
  await page.setViewportSize({width:320,height:900});await page.goto(path);
  const baseline=await page.locator('.source-body p').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
  await page.locator('main').evaluate(main=>{
   const sizes=[main,...main.querySelectorAll('*')].map(e=>({e,size:parseFloat(getComputedStyle(e).fontSize),line:parseFloat(getComputedStyle(e).lineHeight)}));
   for(const {e,size,line} of sizes){(e as HTMLElement).style.fontSize=size*2+'px';if(Number.isFinite(line))(e as HTMLElement).style.lineHeight=line*2+'px';}
  });
  const resized=await page.locator('.source-body p').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));expect(resized).toBe(baseline*2);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const answer=page.locator('#answer-response-evidence');await answer.locator('summary').focus();await page.keyboard.press('Enter');await expect(answer.locator('p').first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('.source-body ul').nth(2).screenshot({path:dir+'/'+lang+'-case-text-200.png'});
  await page.locator('.toc').screenshot({path:dir+'/'+lang+'-toc-text-200.png'});
  writeFileSync(dir+'/'+lang+'-actual-text-200.json',JSON.stringify({baseline,resized,width:320,scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth)}));
 });
}
