import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m08-c03.json','utf8'));
const norm=(s:string)=>s.replace(/`/g,'').replace(/^\s*(?:[-*]|\d+\.)\s+/gm,'').replace(/\s+/g,' ').trim();
for(const lang of ['zh','en']){
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m08/concepts/m08-03/`;
 test(`${lang} full body, responsive diagrams, controls and downloads`,async({page,request})=>{
  await page.goto(path);await expect(page.locator('[data-rule-testing-figure]')).toHaveCount(3);expect(await page.locator('[data-rule-testing-figure] p').first().evaluate(e=>{const s=getComputedStyle(e);return parseFloat(s.fontSize)>=16&&parseFloat(s.lineHeight)/parseFloat(s.fontSize)>=1.7;})).toBeTruthy();
  for(const section of lesson.text[lang].sections){
   const node=page.locator(`h2#${section.id}`).locator('..');
   const text=norm(await node.innerText());
   for(const p of section.paragraphs)expect(text).toContain(norm(p.replace(/^### /gm,'')));
   for(const b of section.blocks??[]){
    if(b.kind==='prose')for(const p of b.paragraphs)expect(text).toContain(norm(p.replace(/^### /gm,'')));
    if(b.kind==='table')for(const row of b.rows)for(const cell of row)expect(text).toContain(norm(cell));
    if(b.code)await expect(node.locator('code').filter({hasText:b.code}).first()).toBeVisible();
   }
  }
  for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();for(let n=1;n<=3;n++)if(width===390||width===1280)await page.locator(`[data-rule-testing-figure="${n}"]`).screenshot({path:`.local/aase/m0803/${lang}-${width}-figure${n}.png`});await page.screenshot({path:`.local/aase/m0803/${lang}-${width}.png`,fullPage:true});}
  await page.setViewportSize({width:390,height:900});const codeRegion=page.locator('.code-region').first();await codeRegion.focus();await page.keyboard.press('ArrowRight');await expect.poll(()=>codeRegion.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
  for(const table of await page.locator('.rule-testing-section table').all())expect(await table.evaluate(e=>{const s=getComputedStyle(e);return parseFloat(s.fontSize)>=16&&parseFloat(s.lineHeight)/parseFloat(s.fontSize)>=1.7;})).toBeTruthy();await page.setViewportSize({width:320,height:900});const tableRegion=page.locator('.rule-testing-section .table-scroll').nth(1);await tableRegion.focus();await page.keyboard.press('ArrowRight');await expect.poll(()=>tableRegion.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
  await page.setViewportSize({width:390,height:900});const amount=page.locator('#delivery-amount');await amount.focus();await page.keyboard.press('ArrowRight');await expect(amount).toHaveValue('1000');await expect(page.locator('[data-rule-testing-figure="2"] .result')).toContainText('NT$ 0');await page.keyboard.press('Home');await expect(amount).toHaveValue('0');await page.keyboard.press('End');await expect(amount).toHaveValue('2000');
  const length=page.locator('#rule-length');await length.focus();await page.keyboard.press('ArrowRight');await expect(length).toHaveValue('81');await expect(page.locator('[data-rule-testing-figure="3"] .result')).toContainText(lang==='zh'?'超過':'Exceeds');await page.keyboard.press('ArrowLeft');await expect(length).toHaveValue('80');await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(length).toBeFocused();
  await page.setViewportSize({width:390,height:900});await page.addStyleTag({content:'html{font-size:200% !important}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  for(let n=1;n<=3;n++)await page.locator(`[data-rule-testing-figure="${n}"]`).screenshot({path:`.local/aase/m0803/${lang}-390-200-figure${n}.png`});
  await page.screenshot({path:`.local/aase/m0803/${lang}-390-200.png`,fullPage:true});
  for(let n=1;n<=3;n++){const asset=`/images/aase/m08-03-${n}-${lang}.svg`;const r=await request.get(asset);expect(r.ok()).toBeTruthy();expect(await r.body()).toEqual(readFileSync(`site${asset}`));}
  const summary=page.locator('summary').first();await summary.focus();await page.keyboard.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');
 });
 test(`${lang} static reading`,async({browser})=>{const c=await browser.newContext({javaScriptEnabled:false});const p=await c.newPage();await p.goto(path);await expect(p.locator('#delivery-amount')).toBeDisabled();await expect(p.locator('#rule-length')).toBeDisabled();await expect(p.locator('[data-rule-testing-figure]')).toHaveCount(3);for(const s of lesson.text[lang].sections)await expect(p.locator('h2#'+s.id)).toBeVisible();await c.close();});
}
test('all SVG label bounds and spacing',async({page})=>{
 for(const lang of ['zh','en'])for(let n=1;n<=3;n++){
  await page.goto(`/images/aase/m08-03-${n}-${lang}.svg`);
  const issues=await page.evaluate(()=>{
   const svg=document.querySelector('svg')!,v=svg.viewBox.baseVal;
   const boxes=Array.from(document.querySelectorAll('text')).map(t=>({label:t.textContent??'',b:t.getBBox()}));
   const failures:string[]=[];
   for(const {label,b}of boxes)if(b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height)failures.push('bounds: '+label);
   for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i].b,b=boxes[j].b;if(a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y)failures.push('overlap: '+boxes[i].label+' / '+boxes[j].label);}
   return failures;
  });expect(issues).toEqual([]);
 }
});
