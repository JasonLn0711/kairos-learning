import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import type { Concept } from '../../src/lib/interactive/aase/model.ts';

const root = '/interactive/aase/m02/';
const requestLesson = '/interactive/system-design/request-lifecycle/';
const chapters = JSON.parse(readFileSync('content/interactive/aase-m02/manifest.json', 'utf8')) as {
  id: string; slugs: string[]; sourceSlug: string;
}[];
const units = chapters.flatMap(chapter => {
  const data = JSON.parse(readFileSync('content/interactive/aase-m02/' + chapter.id + '.json', 'utf8')) as Concept[];
  const sourcePath = '/courses/aase/v1/m02/concepts/' + chapter.sourceSlug + '/';
  return data.map(concept => ({ chapter: chapter.id, concept, sourcePath, path: root + chapter.id + '/' + concept.slug + '/' }));
});
const representative = new Map<string, { kind: string; path: string }>();
const scenePaths = units.flatMap(unit => unit.concept.scenes.map((scene, index) => ({
  scene, path: unit.path + '?step=' + (index + 1)
})));
for (const { scene, path } of scenePaths) {
  if (!representative.has(scene.kind)) representative.set(scene.kind, { kind: scene.kind, path });
  if (scene.demo && !representative.has('demo-' + scene.demo)) {
    representative.set('demo-' + scene.demo, { kind: scene.kind, path });
  }
}

const screenshots = '.local/aase-m02-after/';
const desktop = [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }];
const mobile = [{ width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 320, height: 568 }];
const domain = 'https://learn.cs-kairos.com';

async function openFocus(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.status(), path).toBe(200);
  await expect(page.locator('main.immersive-lesson.focus')).toBeVisible();
}

async function verifyOverflow(page: Page, path: string, focus: boolean) {
  const area = await page.evaluate(() => ({
    width: document.scrollingElement!.scrollWidth,
    height: document.scrollingElement!.scrollHeight,
    innerWidth, innerHeight
  }));
  expect(area.width, path).toBeLessThanOrEqual(area.innerWidth + 2);
  if (focus) {
    expect(area.height, path).toBeLessThanOrEqual(area.innerHeight + 2);
    const stage = await page.locator('.scene-column').boundingBox();
    const rail = await page.locator('.lesson-rail').boundingBox();
    const explanation = await page.locator('.explanation').boundingBox();
    expect(stage, path).not.toBeNull();
    expect(rail, path).not.toBeNull();
    expect(explanation, path).not.toBeNull();
    expect(stage!.width, path).toBeGreaterThan(Math.max(rail!.width, explanation!.width));
    const clipped = await page.locator('.learning-stage').evaluateAll(stages => stages.flatMap(stage => {
      const bounds = stage.getBoundingClientRect();
      return [...stage.querySelectorAll('h2, dt, dd, label, output')].filter(label => {
        const box = label.getBoundingClientRect();
        return box.width > 0 && (box.top < bounds.top - 2 || box.bottom > bounds.bottom + 2 ||
          box.left < bounds.left - 2 || box.right > bounds.right + 2);
      }).map(label => label.textContent?.trim());
    }));
    expect(clipped, path + ' stage labels').toEqual([]);
    for (const button of await page.locator('.concept-controls :is(button, select, a), .lesson-controls button, .learning-stage :is(input, select, button)').all()) {
      const rect = await button.boundingBox();
      expect(rect, path).not.toBeNull();
      expect(rect!.y, path).toBeGreaterThanOrEqual(0);
      expect(rect!.y + rect!.height, path).toBeLessThanOrEqual(area.innerHeight + 2);
      expect(rect!.x + rect!.width, path).toBeLessThanOrEqual(area.innerWidth + 2);
    }
  }
}

const localeData = [
  { lang: 'zh', prefix: '', html: 'zh-Hant', read: '完整解說' },
  { lang: 'en', prefix: '/en', html: 'en', read: 'Read details' }
] as const;

for (const locale of localeData) {
  test.describe(locale.lang, () => {
    test('atlas inventories all 40 concepts and both locale outputs are directly navigable', async ({ page, request }) => {
      expect(units).toHaveLength(40);
      for (const source of ['/interactive/', '/courses/aase/v1/m02/']) {
        await page.goto(locale.prefix + source);
        await expect(page.locator('main a[href="' + locale.prefix + root + '"]')).toBeVisible();
      }
      await page.goto(locale.prefix + root);
      const links = await page.locator('main a[href]').evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')));
      for (const unit of units) expect(links, unit.path).toContain(locale.prefix + unit.path);
      expect(new Set(links.filter(href => href && units.some(unit => href === locale.prefix + unit.path))).size).toBe(40);
      const [searchResponse, sitemapResponse] = await Promise.all([
        request.get('/search-index.json'), request.get('/sitemap.xml')
      ]);
      expect(searchResponse.ok()).toBe(true);
      expect(sitemapResponse.ok()).toBe(true);
      const entries = await searchResponse.json() as { id: string; lang: string; href: string; title: string }[];
      const sitemap = [...(await sitemapResponse.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
      const chapterUrls = chapters.map(chapter => root + chapter.id + '/');
      for (const path of [root, ...chapterUrls, ...units.map(unit => unit.path)]) {
        expect(sitemap.filter(loc => loc === domain + locale.prefix + path), 'sitemap ' + path).toHaveLength(1);
      }
      for (const chapter of chapters) {
        const path = locale.prefix + root + chapter.id + '/';
        expect(links).toContain(path);
        await page.goto(path);
        await expect(page.locator('main a[href="' + locale.prefix + '/courses/aase/v1/m02/concepts/' + chapter.sourceSlug + '/"]')).toBeVisible();
      }
      const sourceAnchors = new Map<string, string[]>();
      for (const unit of units) {
        const path = locale.prefix + unit.path;
        const response = await request.get(path);
        expect(response.status(), unit.path).toBe(200);
        const metadata = await page.evaluate(html => {
          const document = new DOMParser().parseFromString(html, 'text/html');
          return {
            lang: document.documentElement.lang,
            title: document.title,
            description: document.querySelector('head meta[name="description"]')?.getAttribute('content'),
            canonical: document.querySelector('head link[rel="canonical"]')?.getAttribute('href'),
            english: document.querySelector('head link[rel="alternate"][hreflang="en"]')?.getAttribute('href'),
            chinese: document.querySelector('head link[rel="alternate"][hreflang="zh-Hant"]')?.getAttribute('href'),
            fallback: [...document.querySelectorAll('.static-reading .concept-reading > section > h3')].map(heading => heading.textContent?.trim()),
            links: [...document.querySelectorAll('.static-reading a[href]')].map(link => link.getAttribute('href'))
          };
        }, await response.text());
        expect(metadata, unit.path).toMatchObject({
          lang: locale.html, title: unit.concept.title[locale.lang] + ' | CS Kairos Learn',
          description: unit.concept.objective[locale.lang], canonical: domain + path,
          english: domain + '/en' + unit.path, chinese: domain + unit.path
        });
        expect(metadata.fallback.slice(0, -1), unit.path).toEqual(
          unit.concept.scenes.map((scene, index) => (index + 1) + '. ' + scene.title[locale.lang])
        );
        expect(entries.filter(entry => entry.lang === locale.lang && entry.href === path), 'search ' + unit.path).toMatchObject([
          { id: 'interactive-aase-' + unit.concept.slug, title: unit.concept.title[locale.lang] }
        ]);

        const sourcePath = locale.prefix + unit.sourcePath;
        if (!sourceAnchors.has(sourcePath)) {
          const article = await request.get(sourcePath);
          expect(article.ok(), sourcePath).toBe(true);
          sourceAnchors.set(sourcePath, await page.evaluate(html => {
            const document = new DOMParser().parseFromString(html, 'text/html');
            return [...document.querySelectorAll('[id]')].map(node => node.id);
          }, await article.text()));
        }
        expect(metadata.links, unit.path).toContain(sourcePath);
        for (const anchor of new Set(unit.concept.scenes.flatMap(scene => scene.sourceAnchors))) {
          expect(metadata.links, unit.path).toContain(sourcePath + '#' + anchor);
          expect(sourceAnchors.get(sourcePath), 'canonical anchor ' + sourcePath).toContain(anchor);
        }
      }
    });

    for (const viewport of desktop) {
      test('focus geometry at ' + viewport.width + '×' + viewport.height, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        for (const [sample, { kind, path }] of representative) {
          await openFocus(page, locale.prefix + path);
          await expect(page.locator('[data-kind="' + kind + '"]')).toBeVisible();
          await verifyOverflow(page, path, true);
          await page.screenshot({ path: screenshots + locale.lang + '-' + sample + '-' + viewport.width + '.png' });
        }
        const length = ({scene}: typeof scenePaths[number]) => [scene.title, scene.problem, scene.mechanism, scene.observe, scene.boundary]
          .reduce((total, text) => total + text[locale.lang].length, 0);
        const longScene = scenePaths.reduce((longest, scene) => length(scene) > length(longest) ? scene : longest);
        await openFocus(page, locale.prefix + longScene.path);
        await verifyOverflow(page, longScene.path, true);
        if (viewport.width === 1440) {
          await page.screenshot({ path: screenshots + locale.lang + '-longest-explanation-1440.png' });
        }
        const selected = new Set<string>();
        for (const unit of units) if (!selected.has(unit.chapter)) {
          selected.add(unit.chapter);
          await openFocus(page, locale.prefix + unit.path);
          await verifyOverflow(page, unit.path, true);
          if (viewport.width === 1440) await page.screenshot({ path: screenshots + locale.lang + '-' + unit.chapter + '-1440.png' });
        }
        await openFocus(page, locale.prefix + requestLesson);
        await verifyOverflow(page, requestLesson, true);
        await expect(page.locator('.interactive-stage')).toBeVisible();
        await page.screenshot({ path: screenshots + locale.lang + '-request-' + viewport.width + '.png' });
      });
    }

    test('small widths and increased text retain reachable detail and controls', async ({ page }) => {
      const path = locale.prefix + root + 'm02-01/softmax-weighted-sum/';
      for (const viewport of mobile) {
        await page.setViewportSize(viewport);
        await openFocus(page, path);
        await verifyOverflow(page, path, false);
        await expect(page.locator('.concept-controls select')).toBeVisible();
        const read = page.getByRole('button', { name: locale.read });
        await read.click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(read).toBeFocused();
        if (viewport.width < 400) {
          await page.screenshot({ path: screenshots + locale.lang + '-mobile-' + viewport.width + '.png', fullPage: true });
          await openFocus(page, locale.prefix + requestLesson);
          await verifyOverflow(page, requestLesson, false);
          await page.screenshot({ path: screenshots + locale.lang + '-request-' + viewport.width + '.png' });
          await openFocus(page, path);
        }
      }
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await verifyOverflow(page, path + ' (200% text)', false);
      await expect(page.locator('.concept-controls select')).toBeVisible();
      await page.getByRole('button', { name: locale.read }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.screenshot({ path: screenshots + locale.lang + '-text-zoom.png', fullPage: true });
      await page.setViewportSize({ width: 1280, height: 720 });
      await openFocus(page, path + '?step=2');
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await verifyOverflow(page, path + ' (desktop 200% text)', false);
      const controls = page.locator('.concept-controls select');
      await expect(controls).toBeVisible();
      await controls.selectOption('3');
      await expect(page.locator('.workspace')).toHaveAttribute('data-step', '3');
    });

    test('all concept steps and article link remain readable without JavaScript', async ({ browser, baseURL }) => {
      const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 320, height: 568 } });
      try {
        const page = await context.newPage();
        const unit = units.find(unit => unit.concept.slug === 'softmax-weighted-sum')!;
        await page.goto(locale.prefix + unit.path + '?step=2');
        await expect(page.locator('.static-reading .concept-reading > section > h3')).toHaveCount(unit.concept.scenes.length + 1);
        await expect(page.locator('.static-reading a[href*="/courses/aase/v1/m02/"]').first()).toBeVisible();
        await expect(page.getByRole('button', { name: locale.read })).toHaveCount(0);
        await verifyOverflow(page, unit.path, false);
      } finally {
        await context.close();
      }
    });
  });
}

test('step links, shortcuts, history, focus restoration and language preserve identity', async ({ page }) => {
  const stem = root + 'm02-01/softmax-weighted-sum/';
  await openFocus(page, '/en' + stem);
  const workspace = page.locator('.workspace');
  await expect(workspace).toHaveAttribute('data-step', '1');
  await page.locator('main').focus();
  await page.keyboard.press('ArrowRight');
  await expect(workspace).toHaveAttribute('data-step', '2');
  await expect(page).toHaveURL(/\?step=2$/);
  await page.goBack();
  await expect(workspace).toHaveAttribute('data-step', '1');
  await page.goForward();
  await expect(workspace).toHaveAttribute('data-step', '2');
  const read = page.getByRole('button', { name: 'Read details' });
  await read.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(workspace).toHaveAttribute('data-step', '2');
  await dialog.getByRole('radio').first().check();
  await dialog.getByRole('button', { name: 'Check answer' }).click();
  await expect(dialog.getByRole('status')).toHaveText(/Correct|Try again/);
  await page.keyboard.press('Escape');
  await expect(read).toBeFocused();
  await page.locator('a[hreflang="zh-Hant"]').click();
  await expect(page).toHaveURL(new RegExp(stem + '\\?step=2$'));
  await expect(workspace).toHaveAttribute('data-step', '2');
  await page.reload();
  await expect(workspace).toHaveAttribute('data-step', '2');
});

test('adjacent concept navigation starts with fresh learner state', async ({ page }) => {
  const first = '/en' + root + 'm02-01/tokenization/';
  const second = '/en' + root + 'm02-01/embeddings/';
  await openFocus(page, first + '?step=0');
  const workspace = page.locator('.workspace');
  await expect(workspace).toHaveAttribute('data-step', '1');
  await page.getByRole('button', { name: 'Read details' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radio').first().check();
  await dialog.getByRole('button', { name: 'Check answer' }).click();
  await expect(dialog.getByRole('status')).toContainText('Correct');
  await page.keyboard.press('Escape');
  await page.getByRole('combobox', { name: 'Go to step' }).selectOption('3');
  await page.getByRole('link', { name: /Next concept/ }).click();
  await expect(page).toHaveURL(second);
  await expect(workspace).toHaveAttribute('data-step', '1');
  await page.getByRole('button', { name: 'Read details' }).click();
  await expect(dialog.getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(dialog.getByRole('status')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.goBack();
  await expect(workspace).toHaveAttribute('data-step', '3');
  await page.goForward();
  await expect(workspace).toHaveAttribute('data-step', '1');
});

function demoPath(slug: string, demo: string) {
  const unit = units.find(unit => unit.concept.slug === slug)!;
  const scene = unit.concept.scenes.findIndex(scene => scene.demo === demo);
  expect(scene, slug).toBeGreaterThanOrEqual(0);
  return '/en' + unit.path + '?step=' + (scene + 1);
}

test('scene diagrams encode segmentation, coordinates, causal visibility and parallel support', async ({ page }) => {
  await openFocus(page, '/en' + root + 'm02-01/tokenization/?step=2');
  const tokens = page.locator('.tokens li');
  await expect(tokens).toHaveText(['application', 'form']);
  await page.getByRole('combobox', { name: 'Choose scenario' }).selectOption({ label: 'Finer segmentation' });
  await expect(tokens).toHaveText(['ap', 'pli', 'cation', 'form']);

  await openFocus(page, '/en' + root + 'm02-01/embeddings/?step=2');
  const coordinates = page.locator('.vector .coordinate');
  await expect(coordinates).toHaveText(['0.4', '-0.2', '0.9', '0.1']);
  await page.getByRole('combobox', { name: 'Choose scenario' }).selectOption({ label: 'Choose application #42' });
  await expect(coordinates).toHaveText(['-0.1', '0.5', '0.2', '-0.4']);

  await openFocus(page, '/en' + root + 'm02-01/attention-qkv/?step=3');
  const mask = page.getByRole('table', { name: 'Illustrative causal mask' });
  await expect(mask.locator('[data-visible-key="true"]')).toHaveCount(6);
  await expect(mask.locator('[data-visible-key="false"]')).toHaveCount(3);
  const maskRows = await mask.locator('tbody tr').evaluateAll(rows => rows.map(row =>
    [...row.querySelectorAll('td')].map(cell => cell.getAttribute('data-visible-key'))
  ));
  expect(maskRows).toEqual([['true', 'false', 'false'], ['true', 'true', 'false'], ['true', 'true', 'true']]);

  await openFocus(page, '/en' + root + 'm02-05/llm-vs-harness/');
  const support = page.locator('[data-scene-view="support-network"]');
  await expect(support.locator('[data-support-position]')).toHaveCount(7);
  await expect(support.locator('[data-support-position="0"] dt')).toHaveText('LLM');
  await expect(support.locator('svg line')).toHaveCount(6);
});

test('softmax input updates the weighted output and reset restores defaults', async ({ page }) => {
  await openFocus(page, demoPath('softmax-weighted-sum', 'softmax'));
  const result = page.locator('.learning-stage output');
  await expect(result).toContainText('3.076');
  const slider = page.getByRole('slider', { name: /Score A/ });
  await slider.focus();
  for (let i = 0; i < 4; i++) await slider.press('ArrowLeft');
  await expect(result).toContainText('4.000');
  await page.getByRole('button', { name: 'Reset scene' }).click();
  await expect(result).toContainText('3.076');
});

test('authorization stops execution and a tool result alone cannot pass verification', async ({ page }) => {
  await openFocus(page, demoPath('four-gates', 'gates'));
  const output = page.locator('.learning-stage output');
  await expect(output).toContainText('Acceptance pending');
  await page.getByRole('checkbox', { name: 'Authorized' }).uncheck();
  await expect(output).toContainText('No execution');
  await expect(page.locator('.learning-stage [data-outcome="skipped"]')).toHaveCount(2);
  await page.getByRole('checkbox', { name: 'Authorized' }).check();
  await page.getByRole('checkbox', { name: 'Evidence verified' }).check();
  await expect(output).toContainText('Accepted');
});

test('governed actions honor scope, review, time and action budgets', async ({ page }) => {
  await openFocus(page, demoPath('governed-autonomy', 'governed-policy'));
  const policy = page.locator('[data-policy="governed-policy"]');
  const output = policy.locator('output');
  await expect(output).toHaveText('No execution · Human review is required');
  await policy.getByRole('checkbox', { name: 'Human review approved' }).check();
  await expect(output).toHaveText('Simulated execution · Policy permits this action');
  await policy.getByRole('checkbox', { name: 'Within task scope' }).uncheck();
  await expect(output).toHaveText('No execution · Outside the approved scope');
  await policy.getByRole('checkbox', { name: 'Within task scope' }).check();
  await policy.getByRole('combobox', { name: 'Actions remaining' }).selectOption('0');
  await expect(output).toHaveText('No execution · Action budget exhausted');
  await policy.getByRole('combobox', { name: 'Actions remaining' }).selectOption('1');
  await policy.getByRole('checkbox', { name: 'Time budget remains' }).uncheck();
  await expect(output).toHaveText('No execution · Time limit reached');
});

test('sandbox policy independently controls paths, writes and outbound networking', async ({ page }) => {
  await openFocus(page, demoPath('sandbox-boundary', 'sandbox-policy'));
  const policy = page.locator('[data-policy="sandbox-policy"]');
  const output = policy.locator('output');
  await expect(output).toHaveText('No execution · Workspace is read-only');
  await policy.getByRole('checkbox', { name: 'Workspace is writable' }).check();
  await expect(output).toHaveText('Simulated execution · Policy permits this action');
  await policy.getByRole('checkbox', { name: 'Path is within approved workspace' }).uncheck();
  await expect(output).toHaveText('No execution · Outside the approved scope');
  await policy.getByRole('combobox', { name: 'Proposed action' }).selectOption('network');
  await expect(output).toHaveText('No execution · Outbound networking is disabled');
  await policy.getByRole('checkbox', { name: 'Outbound networking allowed' }).check();
  await expect(output).toHaveText('Simulated execution · Policy permits this action');
});

test('a fictional document claim cannot grant access to a restricted resource', async ({ page }) => {
  await openFocus(page, demoPath('prompt-injection-boundary', 'scope-policy'));
  const policy = page.locator('[data-policy="scope-policy"]');
  const output = policy.locator('output');
  const claim = policy.getByRole('checkbox', { name: 'Document claims extra permission' });
  await expect(claim).toBeChecked();
  await expect(output).toHaveText('No execution · Outside the approved scope');
  await claim.uncheck();
  await expect(output).toHaveText('No execution · Outside the approved scope');
  await policy.getByRole('combobox', { name: 'Requested fictional resource' }).selectOption('summary');
  await expect(output).toHaveText('Simulated execution · Policy permits this action');
});

test('retry after an unknown outcome separates observed results from service effects', async ({ page }) => {
  await openFocus(page, demoPath('timeout-retry-idempotency', 'retry-policy'));
  const policy = page.locator('[data-policy="retry-policy"]');
  const output = policy.locator('output');
  await expect(output).toHaveText('Simulated write count · 1 → 1. No retry.');
  await policy.getByRole('checkbox', { name: 'Simulate a retry with the same key' }).check();
  await expect(output).toHaveText('Simulated write count · 1 → 2. Retry simulated.');
  await policy.getByRole('checkbox', { name: 'Service enforces same-key deduplication' }).check();
  await expect(output).toHaveText('Simulated write count · 1 → 1. Retry simulated.');
  await policy.getByRole('combobox', { name: 'Client-visible outcome' }).selectOption('confirmed-no-effect');
  await expect(output).toHaveText('Simulated write count · 0 → 1. Retry simulated.');
  await policy.getByRole('combobox', { name: 'Client-visible outcome' }).selectOption('confirmed-success');
  await expect(output).toHaveText('Simulated write count · 1 → 1. No retry.');
});

test('required-field validation changes with the data independently of the model claim', async ({ page }) => {
  await openFocus(page, demoPath('verification-boundary', 'required-field'));
  const policy = page.locator('[data-policy="required-field"]');
  const output = policy.locator('output');
  await expect(output).toHaveText('Validation failed: documentType is missing. The model claims completeness.');
  await policy.getByRole('textbox', { name: 'Document type' }).fill('Evidence summary');
  await expect(output).toHaveText('Required fields are present. The model claims completeness.');
  await policy.getByRole('checkbox', { name: 'Model claims the fields are complete' }).uncheck();
  await expect(output).toHaveText('Required fields are present. The model makes no completeness claim.');
});

test('illustrative budget and M02-04 workflow branch produce exact outputs', async ({ page }) => {
  await openFocus(page, demoPath('context-budget', 'budget'));
  const output = page.locator('.learning-stage output');
  await expect(output).toContainText('Remaining 500');
  const logs = page.getByRole('slider', { name: /Extra log tokens/ });
  await logs.focus();
  for (let i = 0; i < 13; i++) await logs.press('ArrowRight');
  await expect(output).toContainText('Remaining -800');
  await openFocus(page, demoPath('deterministic-workflow', 'workflow'));
  await expect(output).toContainText('Limit 2 · Rejected');
  await page.getByRole('combobox', {name:'Day type'}).selectOption('weekend');
  await expect(output).toContainText('Limit 3 · Accepted');
});

test('scenario branches preserve version, scope, execution and evidence distinctions', async ({ page }) => {
  const cases = [
    ['rag', 'Select stale v1', /old clause.*does not apply/],
    ['rag', 'Select current v3', /three on weekends/],
    ['memory', 'Saved but not loaded', /model did not receive/],
    ['orchestration-and-execution', 'Sample workspace', /target remains unverified/],
    ['mcp-tool-calling', 'Tool reports failure', /tool result with an error flag/],
    ['timeout-retry-idempotency', 'Timeout with unknown outcome', /Do not assume non-execution/],
    ['prompt-injection-boundary', 'Check out-of-scope resource', /No tool action takes place/]
  ] as const;
  for (const [slug, label, outcome] of cases) {
    const unit = units.find(unit => unit.concept.slug === slug)!;
    const index = unit.concept.scenes.findIndex(scene => scene.choices?.some(choice => choice.label.en === label));
    expect(index, slug).toBeGreaterThanOrEqual(0);
    await openFocus(page, '/en' + unit.path + '?step=' + (index + 1));
    await page.getByRole('combobox', { name: 'Choose scenario' }).selectOption({ label });
    await expect(page.locator('.learning-stage output')).toContainText(outcome);
  }
  await openFocus(page, demoPath('partial-success-verification', 'workflow'));
  await page.getByRole('combobox', { name: 'Day type' }).selectOption('weekend');
  await expect(page.locator('.learning-stage output')).toContainText('M02-06 · Limit 2 · Rejected');
});

test('mobile touch can advance, open details and return to the active stage', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await openFocus(page, root + 'm02-03/rag/');
    await page.getByRole('button', { name: '下一步' }).tap();
    await expect(page.locator('.workspace')).toHaveAttribute('data-step', '2');
    await page.getByRole('button', { name: '完整解說' }).tap();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: '回到示意圖' }).tap();
    await expect(dialog).not.toBeVisible();
    await expect(page.locator('.workspace')).toHaveAttribute('data-step', '2');
  } finally {
    await context.close();
  }
});

test('long focus explanations scroll by keyboard inside their pane', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await openFocus(page, '/en' + root + 'm02-01/transformer-block/?step=3');
  const pane = page.getByRole('region', { name: 'Step explanation' });
  await pane.focus();
  await expect(pane).toBeFocused();
  await page.keyboard.press('End');
  await expect.poll(() => pane.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
  await verifyOverflow(page, 'long keyboard-scroll explanation', true);
});

test('the expanded compaction result fits the stage at a compact desktop height', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await openFocus(page, '/en' + root + 'm02-03/compaction/?step=2');
  await page.getByRole('combobox', { name: 'Choose scenario' }).selectOption({ label: 'Structured summary' });
  const stage = page.locator('.scene-body');
  expect(await stage.evaluate(node => node.scrollHeight - node.clientHeight)).toBeLessThanOrEqual(2);
  await verifyOverflow(page, 'compaction with retained requirements', true);
});
