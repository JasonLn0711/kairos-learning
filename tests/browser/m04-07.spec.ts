import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
const source=JSON.parse(readFileSync('content/concepts/ceh26-m04-c07.json','utf8'));
const norm=(s:string)=>s.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/`([^`]+)`/g,'$1').replace(/\s+/g,' ').trim();
mkdirSync('.local/m04-07',{recursive:true});
for(const lang of ['zh','en']){
 const path=(lang==='en'?'/en':'')+'/courses/ceh/v13/m04/concepts/m04-07/';
 test(lang+': complete body, reflow, keyboard, download and search',async({page,request})=>{
  expect((await page.goto(path))?.status()).toBe(200);await expect(page.locator('h1')).toContainText('M04-07');await expect(page.locator('h1')).not.toContainText('CEH26');await expect(page.locator('.article-metadata')).toContainText('v1.0.0');
  await expect(page.locator('.source-body h2')).toHaveCount(10);await expect(page.locator('.source-body h3')).toHaveCount(8);await expect(page.locator('.source-body table')).toHaveCount(9);
  const text=norm((await page.locator('article').textContent())!);let cursor=0;
  for(const b of source.text[lang].sourceBody){const units=b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap((n:any)=>[n.title,n.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:[b.text];for(const unit of units){const value=norm(unit);const at=text.indexOf(value,cursor);expect(at,value).toBeGreaterThanOrEqual(cursor);cursor=at+value.length;}}
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await expect(page.locator('[data-snmp-diagram] .devices li')).toHaveCount(3);
   const boxes=await page.locator('[data-snmp-diagram] .devices li').evaluateAll(es=>es.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y})));
   if(width===1280)expect(new Set(boxes.map(e=>e.y)).size).toBe(1);if(width===320)expect(new Set(boxes.map(e=>e.x)).size).toBe(1);
   expect(await page.locator('.source-body p,.source-body td,.source-body th').evaluateAll(es=>es.some(e=>parseFloat(getComputedStyle(e).fontSize)<16||parseFloat(getComputedStyle(e).lineHeight)/parseFloat(getComputedStyle(e).fontSize)<1.7))).toBe(false);
   expect(await page.locator('[data-snmp-diagram] p').evaluateAll(es=>es.some(e=>parseFloat(getComputedStyle(e).fontSize)<16))).toBe(false);
   await page.locator('[data-snmp-diagram]').screenshot({path:'.local/m04-07/'+lang+'-'+width+'.png'});
  }
  const download=page.locator('[data-snmp-diagram] a');await download.focus();expect(await download.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await expect(download).toBeFocused();
  const [file]=await Promise.all([page.waitForEvent('download'),page.keyboard.press('Enter')]);expect(file.suggestedFilename()).toBe('snmp-manager-'+lang+'.svg');
  const url='/images/ceh/snmp-manager-'+lang+'.svg';const response=await request.get(url);expect(response.status()).toBe(200);expect(await response.body()).toEqual(readFileSync('site'+url));
  // Inspect every exported SVG label at its own viewBox scale.
  await page.goto(url);expect(await page.locator('text').evaluateAll(es=>es.filter(e=>{const b=(e as SVGGraphicsElement).getBBox();return b.x<0||b.y<0||b.x+b.width>900||b.y+b.height>610}).length)).toBe(0);
  await page.goto(path);await page.setViewportSize({width:320,height:900});await page.locator('main').evaluate(main=>{const sizes=[main,...main.querySelectorAll('*')].map(e=>({e,size:parseFloat(getComputedStyle(e).fontSize),line:parseFloat(getComputedStyle(e).lineHeight)}));for(const {e,size,line} of sizes){(e as HTMLElement).style.fontSize=size*2+'px';if(Number.isFinite(line))(e as HTMLElement).style.lineHeight=line*2+'px';}});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.goto((lang==='en'?'/en':'')+'/search/');await page.locator('input[type=search]').fill('endOfMibView');await expect(page.locator('.reading-list a[href="'+path+'"]')).toBeVisible();
 });
 test(lang+': no JavaScript retains full teaching and parallel topology',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();await page.goto(path);await expect(page.locator('.source-body h2')).toHaveCount(10);await expect(page.locator('[data-snmp-diagram] .devices li')).toHaveCount(3);await expect(page.locator('.source-body details')).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
 });
}
