import { expect, test } from '@playwright/test';

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
}
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
  await page.locator('.stops button').nth(7).click();
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
