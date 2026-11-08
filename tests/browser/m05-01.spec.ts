import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
const source=JSON.parse(readFileSync('content/concepts/ceh26-m05-c01.json','utf8'));
const norm=(s:string)=>s.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/\s+/g,' ').trim();
mkdirSync('.local/m05-01',{recursive:true});
for(const lang of ['zh','en']){
 const path=`${lang==='en'?'/en':''}/courses/ceh/v13/m05/concepts/m05-01/`;
 test(lang+': full body, four widths, text zoom, keyboard and no JS',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();expect((await page.goto(path))?.status()).toBe(200);
 await expect(page.locator('.article-metadata')).toContainText('v1.0.0');await expect(page.locator('.source-body h2')).toHaveCount(8);await expect(page.locator('.source-body details')).toHaveCount(1);
 const text=norm((await page.locator('.source-body').textContent())!);let cursor=0;
 for(const b of source.text[lang].sourceBody){for(const unit of b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:[b.text]){const value=norm(unit);const at=text.indexOf(value,cursor);expect(at,value).toBeGreaterThanOrEqual(cursor);cursor=at+value.length;}}
 for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await page.locator('.source-body p,.source-body li').evaluateAll(es=>es.filter(e=>e.getClientRects().length).some(e=>parseFloat(getComputedStyle(e).fontSize)<16))).toBe(false);await page.screenshot({path:`.local/m05-01/${lang}-${width}.png`,fullPage:true});}
 const answer=page.locator('#answer-m0501');await expect(answer).not.toHaveAttribute('open','');await answer.locator('summary').focus();expect(await answer.locator('summary').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');await page.keyboard.press('Enter');await expect(answer).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(answer).not.toHaveAttribute('open','');
 await page.setViewportSize({width:320,height:900});await page.locator('main').evaluate(main=>{const sizes=[main,...main.querySelectorAll('*')].map(e=>({e,size:parseFloat(getComputedStyle(e).fontSize),line:parseFloat(getComputedStyle(e).lineHeight)}));for(const {e,size,line} of sizes){(e as HTMLElement).style.fontSize=size*2+'px';if(Number.isFinite(line))(e as HTMLElement).style.lineHeight=line*2+'px';}});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`.local/m05-01/${lang}-320-200pct.png`,fullPage:true});await context.close();
 });
}
