import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m01-c01.json','utf8'));
for(const lang of ['zh','en'] as const)test(`${lang}: complete replacement, form semantics, interaction and static fallback`,async({page,browser,baseURL})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m01/concepts/m01-01/`;
 const t=lesson.text[lang];await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');
 for(const s of t.sections){const section=page.locator('h2#'+s.id).locator('..');await expect(section).toContainText(s.heading);for(const p of s.paragraphs)await expect(section).toContainText(p);}
 await expect(page.locator('.form-comparison .panel')).toHaveCount(2);
 await expect(page.locator('.form-comparison .panel').nth(1).locator('.invalid')).toHaveCount(1);
 const demo=page.locator('.application-demo');const controls=demo.locator('.scenario-controls button');
 await expect(demo.locator('a.report-export')).toHaveCount(0);await expect(demo.locator('button').last()).toBeDisabled();
 await controls.nth(1).focus();await controls.nth(1).press('Enter');await expect(controls.nth(1)).toHaveAttribute('aria-pressed','true');
 const downloadEvent=page.waitForEvent('download');await demo.locator('a.report-export').focus();await page.keyboard.press('Enter');const download=await downloadEvent;
 const saved=await download.path();expect(JSON.parse(readFileSync(saved!,'utf8')).documentType).toBe('合成申請表');
 await controls.first().focus();await controls.first().press('Space');await expect(demo.locator('a.report-export')).toHaveCount(0);
 await controls.first().press('Tab');await expect(controls.nth(1)).toBeFocused();await page.keyboard.press('Shift+Tab');await expect(controls.first()).toBeFocused();
 for(const width of [320,390,768,1280])for(const scale of [1,2]){await page.setViewportSize({width,height:900});await page.evaluate(scale=>document.documentElement.style.fontSize=scale*100+'%',scale);expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale}`).toBeLessThanOrEqual(width);}
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));
 for(const width of [390,1280]){await page.setViewportSize({width,height:900});await page.locator('.form-comparison').screenshot({path:`.local/aase/m0101/${lang}-comparison-${width}.png`});await demo.screenshot({path:`.local/aase/m0101/${lang}-demo-${width}.png`});}
 const summary=page.locator('#checks').locator('..').locator('summary').first();await summary.focus();await summary.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');await summary.press('Space');await expect(summary.locator('..')).not.toHaveAttribute('open','');
 const context=await browser.newContext({baseURL,javaScriptEnabled:false});try{const p=await context.newPage();await p.goto(path);await expect(p.locator('.application-demo .scenario-controls button').first()).toBeDisabled();await expect(p.locator('.application-demo noscript')).toBeVisible();await expect(p.locator('.application-demo tbody tr')).toHaveCount(2);await expect(p.locator('.form-comparison .panel')).toHaveCount(2);const answer=p.locator('#checks').locator('..').locator('summary').first();await answer.press('Enter');await expect(answer.locator('..')).toHaveAttribute('open','');}finally{await context.close();}
});
