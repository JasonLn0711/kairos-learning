import { expect, test } from '@playwright/test';
import { search, type SearchEntry } from '../../src/lib/model.ts';

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

  test(locale.lang+' complete lesson with JavaScript disabled',async({browser,baseURL})=>{
    const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:700}});
    const page=await context.newPage();
    await page.goto(path);
    await page.locator('.static-open').click();
    await expect(page.locator('#desk-reading article')).toHaveCount(10);
    await expect(page.locator('#desk-reading')).toBeVisible();
    await context.close();
  });
  test(locale.lang+' workspace fits every viewport from hub through chapters',async({page})=>{
    for(const [width,height] of [[320,568],[390,844],[844,390],[768,1024],[1024,768],[1280,720],[1440,900]]){
      await page.setViewportSize({width,height});
      for(const url of [locale.path+'/interactive/',path+'?step=5',...Array.from({length:6},(_,i)=>locale.path+'/interactive/aase/m02/m02-0'+(i+1)+'/')]){
        await page.goto(url);
        await expect(page.locator('.desk-art')).toBeVisible();
        await page.mouse.wheel(0,800);
        const dims=await page.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.scrollHeight,window.scrollY]);
        expect(dims,url+' '+width).toEqual([width,height,0]);
        const box=await page.locator('.desk-timeline').boundingBox();
        expect(box!.y+box!.height).toBeLessThanOrEqual(height);
      }
    }
  });

  test(`${locale.lang} homepage distinguishes the course and interactive paths`, async ({ page }) => {
    const browse = locale.lang === 'zh' ? '瀏覽課程' : 'Browse courses';
    const interactive = locale.lang === 'zh' ? '開始互動教材' : 'Start an interactive lesson';
    const ceh = locale.lang === 'zh' ? '從 CEH M01 開始' : 'Begin with CEH M01';
    const returnLabel = locale.lang === 'zh' ? '課程首頁' : 'Course home';

    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 700 });
      await page.goto(locale.path + '/');
      await expect(page.getByRole('link', { name: browse })).toBeInViewport();
      await expect(page.getByRole('link', { name: interactive })).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    }

    await page.getByRole('link', { name: browse }).press('Enter');
    await expect(page).toHaveURL(/#learning-paths$/);
    await expect(page.getByRole('link', { name: ceh })).toHaveAttribute('href', locale.path + '/courses/ceh/v13/m01/');
    await page.getByRole('link', { name: interactive }).click();
    await expect(page.getByRole('heading', { level: 1, name: locale.title })).toBeVisible();
    await page.getByRole('link', { name: returnLabel }).click();
    await expect(page.getByRole('link', { name: browse })).toBeVisible();
  });

  test(`${locale.lang} search downloads only its localized, ordered index`, async ({ page, request }) => {
    const indexPath = `/search-index-${locale.lang}.json`;
    const combined: SearchEntry[] = await (await request.get('/search-index.json')).json();
    const local: SearchEntry[] = await (await request.get(indexPath)).json();
    expect(local).toEqual(combined.filter(entry => entry.lang === locale.lang));

    const fetched: string[] = [];
    page.on('request', (pending) => {
      const path = new URL(pending.url()).pathname;
      if (path.startsWith('/search-index')) fetched.push(path);
    });
    await page.goto(locale.path + '/search/');
    expect(fetched).toEqual([]);
    const input = page.getByRole('searchbox');
    const query = locale.lang === 'zh' ? '資料洩漏' : 'data leakage';
    const expected = search(combined, query, locale.lang).length;
    expect(expected).toBeGreaterThan(0);
    await input.fill(query);
    await expect(page.getByRole('status')).toHaveText(
      locale.lang === 'zh' ? `${expected} 個結果` : `${expected} ${expected === 1 ? 'result' : 'results'}`,
    );
    await input.fill('there-are-no-matching-kairos-lessons');
    await expect(page.getByRole('status')).toHaveText(locale.lang === 'zh' ? '0 個結果' : '0 results');
    expect(fetched).toEqual([indexPath]);
  });
}

test('search times out, offers a catalog jump, and recovers from timeout and HTTP failure', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.clock.install();
  await page.goto('/search/');
  let releaseResponse: () => void = () => {};
  const stalled = new Promise<void>((resolve) => { releaseResponse = resolve; });
  let attempts = 0;
  await page.route('**/search-index-zh.json', async (route) => {
    attempts++;
    if (attempts === 1) {
      await stalled;
      return;
    }
    if (attempts === 2) await route.fulfill({ status: 503 });
    else await route.continue();
  });

  const input = page.getByRole('searchbox');
  await input.fill('資料洩漏');
  await expect(page.getByRole('status')).toHaveText('正在載入搜尋索引…');
  await expect.poll(() => attempts).toBe(1);
  await page.clock.runFor(8_000);
  await expect(page.getByRole('status')).toContainText('搜尋索引載入逾時');
  releaseResponse();
  await page.getByRole('link', { name: '瀏覽教材目錄' }).press('Enter');
  await expect(page.getByRole('heading', { name: '完整教材目錄' })).toBeFocused();

  const retry = page.getByRole('button', { name: '重試搜尋' });
  await retry.click();
  await expect(page.getByRole('status')).toContainText('搜尋索引暫時無法載入');
  await retry.click();
  await expect(page.getByRole('status')).toHaveText(/^[1-9]\d* 個結果$/);
  await expect(input).toHaveValue('資料洩漏');
  expect(attempts).toBe(3);
});

test('search catalog remains reachable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/en/search/');
    await page.getByRole('link', { name: 'Browse the lesson catalog' }).press('Enter');
    await expect(page).toHaveURL(/#search-catalog$/);
    await expect(page.getByRole('heading', { name: 'Complete lesson catalog' })).toBeFocused();
  } finally {
    await context.close();
  }
});

test('search resumes with text entered before the page becomes interactive', async ({ page }) => {
  let allowStart: () => void = () => {};
  const beforeHydration = new Promise<void>((resolve) => { allowStart = resolve; });
  await page.route('**/_app/immutable/entry/start.*.js', async (route) => {
    await beforeHydration;
    await route.continue();
  });
  try {
    await page.goto('/search/', { waitUntil: 'commit' });
    await page.getByRole('searchbox').fill('資料洩漏');
    await expect(page.getByRole('status')).toBeEmpty();
  } finally {
    allowStart();
  }
  await expect(page.getByRole('status')).toHaveText(/^[1-9]\d* 個結果$/);
});

test('compact timeline shows the full active scene and opens a keyboard-accessible scene list', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    await page.goto('/en/interactive/?step=2');
    const current = page.getByRole('status');
    await expect(current).toContainText('2 / 10');
    const open = page.getByRole('button', { name: 'All scenes' });
    expect((await open.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await open.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'All scenes' });
    await expect(dialog.getByRole('listitem')).toHaveCount(10);
    await expect(dialog.locator('[aria-current="step"]')).toHaveText(/^2\./);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
    await open.press('Space');
    const scene = dialog.getByRole('button', { name: /^4\./ });
    const label = (await scene.innerText()).replace(/^4\.\s*/, '');
    await scene.press('Enter');
    await expect(page).toHaveURL(/\?step=4$/);
    await expect(current).toContainText('4 / 10');
    await expect(current).toContainText(label);
    await expect(open).toBeFocused();
    await page.getByRole('button', { name: 'Step notes' }).click();
    await expect(page.locator('#step-title')).toHaveText(label);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);

    await page.goto('/en/interactive/aase/m02/m02-01/');
    await page.getByRole('button', { name: 'All concepts' }).click();
    const concepts = page.getByRole('dialog', { name: 'All concepts' });
    await concepts.getByRole('button', { name: /^1\./ }).click();
    await expect(page.getByRole('button', { name: 'All scenes' })).toBeFocused();
  } finally {
    await context.close();
  }
});
test('search, language, lab, practice, cheatsheets and browser history',async({page})=>{
  await page.goto('/en/interactive/');
  await page.getByRole('button',{name:/Design Lab/}).click();
  await page.getByRole('checkbox',{name:'DNS cache hit'}).check();
  await expect(page.locator('[data-scene-signal]')).toHaveAttribute('data-scene-signal','local');
  await page.locator('.language').click();
  await expect(page.locator('.lab-tools input').first()).toBeChecked();
  await page.getByRole('button',{name:/練習/}).click();
  await page.getByRole('radio').first().check();
  await page.getByRole('button',{name:'核對答案'}).click();
  await expect(page.getByRole('status')).toBeVisible();
  await page.getByRole('button',{name:/速查表/}).click();
  await expect(page.locator('.desk-sheet details')).toHaveCount(10);
  await page.keyboard.press('Control+k');
  await page.getByRole('textbox',{name:'關鍵字'}).fill('Softmax');
  await page.locator('.search-results a').first().click();
  await expect(page).toHaveURL(/#softmax-weighted-sum-01$/);
  await page.getByRole('button',{name:/下一步/}).click();
  await expect(page).toHaveURL(/#softmax-weighted-sum-02$/);
  await page.goBack();await expect(page).toHaveURL(/#softmax-weighted-sum-01$/);
});
test('touch panels and reduced motion remain usable',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/en/interactive/?step=11');
  await expect(page.locator('[data-step="1"]')).toBeVisible();
  await page.getByRole('button', { name: 'All scenes' }).click();
  await page.getByRole('dialog', { name: 'All scenes' }).getByRole('button', { name: /^8\./ }).click();
  await page.getByRole('button',{name:'Step notes'}).click();
  await page.getByRole('checkbox',{name:'Slow database'}).check();
  await page.getByRole('button',{name:'Diagram',exact:true}).click();
  await expect(page.locator('[data-packet-state]')).toHaveAttribute('data-packet-state','static');
  await page.getByRole('button',{name:'Directory',exact:true}).click();
  await page.locator('.tree details').nth(1).locator('summary').click();
  await page.locator('.tree a[href$="#embeddings-01"]').click();
  await expect(page.locator('.desk-art')).toBeVisible();
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
  await page.getByRole('button',{name:/Practice/}).evaluate((btn:HTMLButtonElement)=>btn.click());
  await page.clock.runFor(200);
  await expect(page.locator('.interactive-stage')).toHaveCount(0);
});
