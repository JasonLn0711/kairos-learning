import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const normalized=(s:string)=>s.replace(/`/g,'').replace(/### /g,'').replace(/^\s*(?:[-*]|\d+\.)\s+/gm,'').replace(/\s+/g,' ').trim();
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m07-c04.json','utf8'));
for(const lang of ['zh','en']){
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m07/concepts/m07-04/`;
 test(`${lang} full body, reflow, reference answers and exports`,async({page,request})=>{
  await page.goto(path);await expect(page.locator('[data-validation-figure]')).toHaveCount(4);
  for(const section of lesson.text[lang].sections){
   const node=page.locator(`h2#${section.id}`).locator('..');await expect(node).toBeVisible();
   const body=normalized(await node.innerText());
   for(const paragraph of section.paragraphs)expect(body).toContain(normalized(paragraph));
   for(const block of section.blocks??[]){
    if(block.kind==='prose')for(const p of block.paragraphs)expect(body).toContain(normalized(p));
    if(block.kind==='table')for(const row of [block.headers,...block.rows])for(const cell of row)expect(body).toContain(normalized(cell));
    if(block.kind==='step'){for(const p of block.paragraphs)expect(body).toContain(normalized(p));if(block.code)expect(await node.locator('code').allTextContents()).toContain(block.code);}
    if(['cards','flow'].includes(block.kind)){expect(body).toContain(block.description);for(const item of block.items){expect(body).toContain(item.title);if(section.id!=='cases')expect(body).toContain(item.body);}}
   }
  }
  for(const q of lesson.text[lang].openChecks){const node=page.locator(`#${q.id}`).locator('..');await expect(node).toContainText(q.prompt);await node.locator('summary').click();for(const a of q.answer)await expect(node).toContainText(a);}
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   if([390,1280].includes(width))for(let n=1;n<=4;n++)await page.locator(`[data-validation-figure="${n}"]`).screenshot({path:`.local/aase/m0704/${lang}-${width}-figure-${n}.png`});
   await page.screenshot({path:`.local/aase/m0704/${lang}-${width}.png`,fullPage:true});
  }
  await page.setViewportSize({width:390,height:900});await page.addStyleTag({content:'html{font-size:200% !important}'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:`.local/aase/m0704/${lang}-200-percent.png`,fullPage:true});
  const code=page.locator('#implementation').locator('..').locator('.code-region').first();await code.focus();await page.keyboard.press('ArrowRight');await expect(code).toBeFocused();await expect.poll(()=>code.evaluate(e=>e.scrollWidth<=e.clientWidth||e.scrollLeft>0)).toBeTruthy();
  for(let n=1;n<=4;n++){
   const asset=`/images/aase/m07-04-${n}-${lang}.svg`,r=await request.get(asset);expect(r.ok()).toBeTruthy();expect(await r.body()).toEqual(readFileSync(`site${asset}`));
  }
  const search=await request.get('/search-index.json');expect(search.ok()).toBeTruthy();const entry=(await search.json()).find((e:any)=>e.id==='AASE-M07-C04'&&e.lang===lang);expect(entry).toBeTruthy();for(const q of lesson.text[lang].openChecks)expect(entry.text).toContain(q.answer[0]);
 });
 test(`${lang} validation, correction, invalidation and keyboard reset`,async({page})=>{
  await page.goto(path);const demo=page.locator('[data-validation-figure="2"]'),inputs=demo.locator('input'),status=demo.getByRole('status');const check=demo.getByRole('button').first();
  await expect(check).toBeEnabled();await inputs.first().focus();await page.keyboard.press('Tab');await expect(inputs.nth(1)).toBeFocused();await page.keyboard.press('Shift+Tab');await expect(inputs.first()).toBeFocused();
  await check.click();await expect(status).toContainText(lang==='zh'?'本次三欄完整性檢核通過':'current three fields passed');
  await inputs.first().fill('   ');await expect(status).toContainText(lang==='zh'?'尚未檢查':'has not been checked');await check.click();await expect(status).toContainText(lang==='zh'?'不可為空白':'must not be blank');await expect(inputs.nth(1)).toHaveValue('DEMO-A');
  for(const [value,valid] of [['X'.repeat(80),true],['X'.repeat(81),false],['😀'.repeat(80),true],['😀'.repeat(81),false],['  SYN-001  ',true]] as const){await inputs.first().fill(value);await check.click();await expect(status).toContainText(lang==='zh'?(valid?'本次三欄完整性檢核通過':'不可超過 80 字元'):(valid?'current three fields passed':'must not exceed 80 characters'));}
  await demo.getByRole('button').last().focus();await page.keyboard.press('Enter');await expect(inputs.first()).toHaveValue('SYN-001');await expect(status).toContainText(lang==='zh'?'尚未檢查':'has not been checked');
 });
 test(`${lang} no-JavaScript body and native reference disclosure`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();await page.goto(path);
  await expect(page.locator('[data-validation-figure]')).toHaveCount(4);await expect(page.locator('[data-validation-figure="2"] button').first()).toBeDisabled();await expect(page.locator('input[name="application_id"]')).toHaveValue('SYN-001');
  for(const section of lesson.text[lang].sections){const body=normalized(await page.locator(`h2#${section.id}`).locator('..').innerText());for(const p of section.paragraphs)expect(body).toContain(normalized(p));}
  const summary=page.locator('#AASE-M07-C04-Q04').locator('..').locator('summary');await summary.focus();await page.keyboard.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await context.close();
 });
 test(`${lang} SVG label bounds`,async({page})=>{
  for(let n=1;n<=4;n++){
   await page.goto(`/images/aase/m07-04-${n}-${lang}.svg`);
   const errors=await page.evaluate(()=>{const svg=document.querySelector('svg')!;const v=svg.viewBox.baseVal;return [...svg.querySelectorAll('text')].filter(t=>{const b=t.getBBox();return b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height;}).map(t=>t.textContent);});expect(errors).toEqual([]);
   const overlaps=await page.evaluate(()=>{const ts=[...document.querySelectorAll('svg text')];return ts.flatMap((t,i)=>ts.slice(i+1).filter(u=>{const a=t.getBoundingClientRect(),b=u.getBoundingClientRect();return a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1;}).map(u=>[t.textContent,u.textContent]));});expect(overlaps).toEqual([]);
  }
 });
}
