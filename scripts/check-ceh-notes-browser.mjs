import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';

const base = process.env.CEH_NOTES_BASE_URL || 'http://127.0.0.1:4227';
const output = '.local/ceh-notes';
mkdirSync(output, {recursive:true});
const browser = await chromium.launch({headless:true});
try {
  for (const lang of ['zh','en']) {
    const prefix = lang === 'en' ? '/en' : '';
    const title = lang === 'zh' ? 'CEH 考古題知識筆記' : 'CEH Exam Study Notes';
    const context = await browser.newContext({javaScriptEnabled:false});
    const page = await context.newPage();
    for (const width of [320,390,768,1280]) {
      await page.setViewportSize({width,height:900});
      await page.goto(base + prefix + '/');
      const entry = page.locator('.course-row').filter({hasText:title});
      assert.equal(await entry.count(),1);
      await entry.click();
      assert.equal(await page.locator('h1').textContent(),title);
      assert.ok(await page.locator('main').textContent().then(t=>t.includes(lang==='zh'?'目前尚無已發布筆記':'No notes have been published yet')));
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),`${lang} ${width} overflow`);
      await page.screenshot({path:`${output}/${lang}-${width}.png`,fullPage:true});
    }
    await page.evaluate(()=>document.documentElement.style.fontSize='200%');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),'200% overflow');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement?.className),'skip');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>document.activeElement?.id),'main');
    await context.close();
  }
  console.log('PASS: bilingual home links and notes pages, four widths, no JavaScript, 200% text, keyboard skip link');
} finally { await browser.close(); }
