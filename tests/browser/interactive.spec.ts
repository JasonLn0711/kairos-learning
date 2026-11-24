import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const locales = [
  { lang: 'zh', path: '', htmlLang: 'zh-Hant', title: '一個網頁請求的旅程' },
  { lang: 'en', path: '/en', htmlLang: 'en', title: 'How an HTTPS Request Travels' }
] as const;
const lessonPath = '/interactive/system-design/request-lifecycle/';

for (const locale of locales) {
  const path = locale.path + lessonPath;

  test(`${locale.lang} routes, step changes and accessible references`, async ({ page, request, baseURL }) => {
    const errors: string[] = [];
    const externalRequests: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('request', pending => {
      const url = new URL(pending.url());
      if (['http:', 'https:'].includes(url.protocol) && url.origin !== baseURL) externalRequests.push(url.href);
    });
    const hub = locale.path + '/interactive/';
    expect((await page.goto(hub))?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.htmlLang);
    await page.locator(`main a[href="${path}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(path + '$'));
    await expect(page.getByRole('heading', { level: 1, name: locale.title })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://learn.cs-kairos.com' + path);
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', 'https://learn.cs-kairos.com/en' + lessonPath);
    await expect(page.locator('meta[http-equiv="content-security-policy" i]')).toHaveAttribute('content', /script-src[^;]*sha256-/);
    const headings: string[] = [];
    const scenes: string[] = [];
    for (let i = 1; i <= 10; i++) {
      expect((await page.goto(path + '?step=' + i))?.status()).toBe(200);
      await expect(page.locator(`[data-step="${i}"]`)).toBeVisible();
      headings.push(await page.locator('#step-title').innerText());
      const diagram = page.locator('main svg[role="img"]:visible').first();
      await expect(diagram).toBeVisible();
      scenes.push(await diagram.innerHTML());
    }
    expect(new Set(headings).size).toBe(10);
    expect(new Set(scenes).size).toBe(10);
    expect((await request.get('/courses/networking/')).ok()).toBeTruthy();
    expect(errors).toEqual([]);
    expect(externalRequests).toEqual([]);
  });

  test(`${locale.lang} complete lesson with JavaScript disabled`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
    try {
      const page = await context.newPage();
      expect((await page.goto(path + '?step=8'))?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: locale.title })).toBeVisible();
      await expect(page.locator('main svg[role="img"]:visible').first()).toBeVisible();
      await expect(page.locator('#written-walkthrough h3')).toHaveCount(10);
      await expect(page.locator('#written-walkthrough h3').last()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    } finally {
      await context.close();
    }
  });

  test(`${locale.lang} diagram controls sit below the stage and progress stays with the explanation`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(path);

    const zh = locale.lang === 'zh';
    const diagram = page.locator('.scene-column');
    const controls = diagram.getByRole('group', { name: zh ? '示意流程控制' : 'Diagram controls', exact: true });
    const explanation = page.locator('.explanation');
    const buttonNames = zh
      ? ['上一步', '下一步', '重播', '暫停動態']
      : ['Previous', 'Next', 'Replay', 'Pause motion'];
    await expect(controls.getByRole('button', { name: buttonNames[3], exact: true })).toBeEnabled();
    await expect(explanation.locator('.step-position')).toHaveText(zh ? '第 1 步，共 10 步' : 'Step 1 of 10');
    await expect(explanation.getByRole('progressbar')).toBeVisible();

    for (const width of [1280, 900, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const [figure, toolbar, details, stepPosition] = await Promise.all([
        diagram.locator('.interactive-stage').boundingBox(),
        controls.boundingBox(),
        explanation.boundingBox(),
        explanation.locator('.step-position').boundingBox()
      ]);
      if (!figure || !toolbar || !details || !stepPosition) throw new Error(`Missing lesson layout at ${width}px`);
      const figureBottom = figure.y + figure.height;
      expect(toolbar.y).toBeGreaterThanOrEqual(figureBottom - 1);
      expect(toolbar.y).toBeLessThanOrEqual(figureBottom + 16);
      expect(toolbar.x).toBeGreaterThanOrEqual(figure.x - 1);
      expect(toolbar.x + toolbar.width).toBeLessThanOrEqual(figure.x + figure.width + 1);

      for (const name of buttonNames) {
        const button = controls.getByRole('button', { name, exact: true });
        await expect(button).toBeVisible();
        const bounds = await button.boundingBox();
        if (!bounds) throw new Error(`Missing ${name} bounds at ${width}px`);
        expect(bounds.x).toBeGreaterThanOrEqual(toolbar.x - 1);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(toolbar.x + toolbar.width + 1);
      }

      if (width > 320) {
        expect(details.x).toBeGreaterThanOrEqual(figure.x + figure.width);
        expect(stepPosition.x).toBeGreaterThanOrEqual(details.x);
        expect(stepPosition.y).toBeLessThan(toolbar.y);
      } else {
        expect(details.y).toBeGreaterThanOrEqual(toolbar.y + toolbar.height - 1);
      }
    }
  });

  test(`${locale.lang} focus mode fits desktop and reading returns focus`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const read = page.getByRole('button', { name: locale.lang === 'zh' ? '完整解說' : 'Read details', exact: true });
    await expect(read).toBeVisible();
    for (const [width, height] of [[1280, 720], [1366, 768], [1440, 900], [1920, 1080]]) {
      await page.setViewportSize({ width, height });
      expect(await page.evaluate(() => {
        const root = document.scrollingElement!;
        return { vertical: root.scrollHeight - innerHeight, horizontal: root.scrollWidth - innerWidth };
      })).toEqual({ vertical: 0, horizontal: 0 });
      const stage = await page.locator('.interactive-stage').boundingBox();
      const controls = await page.locator('.lesson-controls').boundingBox();
      if (!stage || !controls) throw new Error('Missing focus workspace at ' + width);
      expect(stage.height).toBeGreaterThan(height * .45);
      await expect.poll(() => page.locator('.interactive-stage svg:visible').evaluate(svg => {
        const { width, height } = svg.getBoundingClientRect();
        const { width: viewWidth, height: viewHeight } = (svg as SVGSVGElement).viewBox.baseVal;
        return Math.abs(width / height - viewWidth / viewHeight);
      })).toBeLessThan(.01);
      expect(controls.y + controls.height).toBeLessThanOrEqual(height);
    }
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-step="2"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(720);
    await read.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('#written-walkthrough h3').last()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(read).toBeFocused();
  });

  test(`${locale.lang} screenshot matrix and responsive article`, async ({ page }) => {
    const evidence = '.local/interactive-evidence';
    await mkdir(evidence, { recursive: true });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const screens = [
        { name: 'hub', url: locale.path + '/interactive/' },
        { name: 'lesson', url: path + '?step=4' }
      ];
      for (const screen of screens) {
        await page.goto(screen.url);
        if (screen.name === 'lesson') {
          await expect(page.locator('[data-step="4"]')).toBeVisible();
          const stage = page.locator('main svg[role="img"]:visible');
          await expect(stage.locator('.entity-label')).toHaveCount(5);
          const labelsFit = await stage.evaluate(svg => {
            const frame = svg.getBoundingClientRect();
            const labels = Array.from(svg.querySelectorAll('.entity-label'), label => label.getBoundingClientRect());
            return labels.every((label, index) =>
              label.left >= frame.left && label.right <= frame.right &&
              label.top >= frame.top && label.bottom <= frame.bottom &&
              labels.slice(index + 1).every(other =>
                label.right <= other.left || other.right <= label.left ||
                label.bottom <= other.top || other.bottom <= label.top));
          });
          expect(labelsFit, `${locale.lang} label placement at ${width}px`).toBeTruthy();
          if (width === 320) {
            const stepTitlesFit = await page.locator('.step-select select').evaluate(element => {
              const select = element as HTMLSelectElement;
              const measure = document.createElement('canvas').getContext('2d')!;
              const style = getComputedStyle(select);
              measure.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
              const textWidth = select.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 18;
              return Array.from(select.options).every(option => measure.measureText(option.text).width <= textWidth);
            });
            expect(stepTitlesFit, `${locale.lang} step titles at ${width}px`).toBeTruthy();
          }
        }
        await expect(page.locator('main')).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        await page.screenshot({ path: `${evidence}/${locale.lang}-${screen.name}-${width}.png`, fullPage: true });
      }
    }
  });
}

test('step history, keyboard controls, scenarios and comprehension feedback', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/en' + lessonPath);
  const current = (step: number) => page.locator(`[data-step="${step}"]`);
  const previous = page.getByRole('button', { name: 'Previous', exact: true });
  const next = page.getByRole('button', { name: 'Next', exact: true });
  await expect(previous).toBeDisabled();
  await next.focus();
  await expect(next).toBeFocused();
  expect(await next.evaluate(element => element.matches(':focus-visible'))).toBeTruthy();
  await page.keyboard.press('Enter');
  await expect(current(2)).toBeVisible();
  await expect(page).toHaveURL(/step=2/);
  await page.getByRole('radio', { name: 'Cached answer', exact: true }).check();
  await expect(page.getByRole('radio', { name: 'Cached answer', exact: true })).toBeChecked();
  await expect(page.locator('figure[data-scene-signal]')).toHaveAttribute('data-scene-signal', 'local');
  await expect(page.locator('main svg[role="img"]:visible [data-edge]')).toHaveCount(0);
  await page.goBack();
  await expect(current(1)).toBeVisible();
  await page.goForward();
  await expect(current(2)).toBeVisible();
  await page.locator('a[hreflang="zh-Hant"]').click();
  await expect(page).toHaveURL(/\/interactive\/system-design\/request-lifecycle\/\?step=2$/);
  await expect(current(2)).toBeVisible();
  await expect(page.getByRole('radio', {name:'已有快取結果',exact:true})).toBeChecked();

  await page.goto('/en' + lessonPath + '?step=8');
  await expect(current(8)).toBeVisible();
  await page.getByRole('radio', { name: 'Slow query', exact: true }).check();
  await expect(page.getByRole('radio', { name: 'Slow query', exact: true })).toBeChecked();
  const replay = page.getByRole('button', { name: 'Replay', exact: true });
  await replay.click();
  const pause = page.getByRole('button', { name: 'Pause motion', exact: true });
  await pause.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('figure[data-packet-state]')).toHaveAttribute('data-packet-state', 'paused');
  await expect(page.getByRole('button', { name: 'Resume motion', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(replay).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await expect(page.locator('figure[data-packet-state]')).toHaveAttribute('data-packet-state', 'waiting');
  expect((await page.reload())?.status()).toBe(200);
  await expect(current(8)).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Normal query', exact: true })).toBeChecked();
  await page.goto('/en' + lessonPath + '?step=10');
  await expect(current(10)).toBeVisible();
  await expect(next).toBeDisabled();
  await page.getByRole('button', { name: 'Read details', exact: true }).click();
  await page.locator('main input[type="radio"]').first().check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.locator('main .feedback[role="status"]')).not.toBeEmpty();
});

test('touch jump, invalid step, reduced motion and zoomed forced colors', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    await page.goto('/en' + lessonPath + '?step=11');
    await expect(page.locator('[data-step="1"]')).toBeVisible();
    await page.getByRole('combobox', { name: 'Go to step' }).selectOption('8');
    await expect(page).toHaveURL(/step=8$/);
    await page.getByRole('radio', { name: 'Slow query', exact: true }).tap();
    await expect(page.getByRole('radio', { name: 'Slow query', exact: true })).toBeChecked();
    await expect(page.locator('figure[data-packet-state]')).toHaveAttribute('data-packet-state', 'static');
    await page.emulateMedia({ forcedColors: 'active' });
    await page.setViewportSize({ width: 768, height: 900 });
    for (const { lang, path } of locales) {
      await page.goto(path + lessonPath + '?step=8');
      await page.evaluate(() => { document.body.style.zoom = '200%'; });
      await expect(page.locator('#step-title')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(768);
      await page.screenshot({ path: `.local/interactive-evidence/${lang}-lesson-200-percent-forced-colors.png`, fullPage: true });
    }
  } finally {
    await context.close();
  }
});

test('interactive pages coexist with the established learning routes and download', async ({ page, request }) => {
  const established = [
    '/', '/en/', '/courses/aase/v1/', '/courses/ceh/v13/',
    '/courses/matlab-practice/index.html', '/search/', '/review/',
    '/en/courses/ceh/v13/m04/concepts/m04-01/'
  ];
  for (const url of established) {
    expect((await page.goto(url))?.status(), url).toBe(200);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  }
  for (const { path } of locales) {
    expect((await request.get(path + '/')).ok()).toBeTruthy();
    await page.goto(path + '/');
    await expect(page.locator(`main a[href="${path}/interactive/"]`)).toBeVisible();
  }
  const search = await (await request.get('/search-index.json')).json();
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const { path } of locales) {
    expect(JSON.stringify(search)).toContain(path + lessonPath);
    expect(sitemap).toContain(`<loc>https://learn.cs-kairos.com${path + lessonPath}</loc>`);
  }
  const checksum = await request.get('/courses/matlab-practice/downloads/SHA256SUMS.txt');
  expect(checksum.ok()).toBeTruthy();
  const [sha256, filename] = (await checksum.text()).trim().split(/\s+/);
  const download = await request.get('/courses/matlab-practice/downloads/' + filename);
  expect(download.ok()).toBeTruthy();
  const { createHash } = await import('node:crypto');
  expect(createHash('sha256').update(await download.body()).digest('hex')).toBe(sha256);
});

test('hidden lesson suspends its advancing packet and navigation releases the animation frame', async ({page})=>{
  await page.clock.install();
  await page.goto('/en'+lessonPath+'?step=5');
  const svg=page.locator('svg.wide-svg:visible');
  await expect(page.locator('[data-step="5"]')).toBeVisible();
  await page.clock.pauseAt(new Date(await page.evaluate(()=>Date.now()+1000)));
  await page.getByRole('button',{name:'Replay',exact:true}).evaluate((btn:HTMLButtonElement)=>btn.click());
  await page.clock.runFor(80);
  await page.evaluate(()=>{
    Object.defineProperty(document,'visibilityState',{value:'hidden',configurable:true});
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const point=()=>svg.locator('[data-packet]').getAttribute('transform');
  const paused=await point();
  await page.clock.runFor(500);expect(await point()).toBe(paused);
  await page.evaluate(()=>{
    Object.defineProperty(document,'visibilityState',{value:'visible',configurable:true});
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.runFor(120);expect(await point()).not.toBe(paused);
  await page.locator('.breadcrumbs a').first().evaluate((link:HTMLAnchorElement)=>link.click());
  await page.clock.runFor(200);
  await expect(page.locator('.interactive-stage')).toHaveCount(0);
});
