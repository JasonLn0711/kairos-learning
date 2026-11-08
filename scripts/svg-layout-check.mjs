// Browser-owned geometry: static XML validation cannot measure rendered text.
import {chromium} from '@playwright/test';
import {readFileSync, readdirSync, mkdirSync, writeFileSync} from 'node:fs';

export async function checkSvgLayout({dir, out, select}) {
  mkdirSync(out, {recursive: true});
  const browser = await chromium.launch({channel: 'chrome'});
  const report = [];
  try {
    for (const file of readdirSync(dir).filter(select)) {
      const page = await browser.newPage({viewport: {width: 1100, height: 1600}});
      await page.setContent(readFileSync(`${dir}/${file}`, 'utf8'));
      await page.evaluate(() => document.fonts.ready);
      const issues = await page.evaluate(() => {
        const svg = document.querySelector('svg');
        const bounds = svg.getBoundingClientRect();
        const texts = [...svg.querySelectorAll('text')].map(element => ({
          text: element.textContent, r: element.getBoundingClientRect()
        }));
        const errors = [];
        for (const text of texts) {
          if (text.r.left < bounds.left || text.r.right > bounds.right + 1 ||
              text.r.top < bounds.top || text.r.bottom > bounds.bottom + 1) {
            errors.push(`bounds: ${text.text}`);
          }
        }
        for (let i = 0; i < texts.length; i++) {
          for (let j = i + 1; j < texts.length; j++) {
            const a = texts[i].r, b = texts[j].r;
            if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
                Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) {
              errors.push(`overlap: ${texts[i].text} / ${texts[j].text}`);
            }
          }
        }
        return errors;
      });
      report.push({file, issues});
      await page.locator('svg').screenshot({path: `${out}/${file}.png`});
      await page.close();
    }
    writeFileSync(`${out}/results.json`, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report.filter(row => row.issues.length), null, 2));
    if (report.some(row => row.issues.length)) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}
