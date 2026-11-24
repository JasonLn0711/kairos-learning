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
async function openFocus(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('.chapter-svg')).toHaveAttribute('data-view','scene');
}

for(const locale of ['', '/en']){
  test(locale+' six original lessons enter their complete chapter drawings',async({page,request})=>{
    for(const chapter of chapters){
      const chapterPath=locale+root+chapter.id+'/';
      const lesson=units.find(u=>u.chapter===chapter.id)!;
      expect(await (await request.get(locale+lesson.sourcePath)).text()).toContain(chapterPath);
      await page.goto(chapterPath);
      await expect(page.locator('.chart svg')).toHaveCount(1);
      await expect(page.locator('[data-band]')).toHaveCount(chapter.slugs.length);
      await expect(page.locator('[data-panel]')).toHaveCount(chapter.slugs.length*3);
      for(const width of [320,1280]){
        await page.setViewportSize({width,height:800});
        await page.getByRole('button',{name:locale?'Full diagram':'完整大圖'}).click();
        await expect(page.locator('.chapter-svg')).toHaveAttribute('data-view','poster');
        const overflow=await page.locator('.chapter-svg foreignObject').evaluateAll(nodes=>nodes.filter(node=>{
          const child=node.lastElementChild;
          return child && child.getBoundingClientRect().bottom>node.getBoundingClientRect().bottom+3;
        }).map(node=>node.textContent?.slice(0,55)));
        expect(overflow,chapterPath+' at '+width).toEqual([]);
        expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
        await page.locator('.canvas-tools button').first().click();
      }
    }
  });
}
test('scene navigation preserves the same drawing and adjacent buttons',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await openFocus(page,'/en'+root+'m02-01/tokenization/?step=3');
  const svg=page.locator('.chapter-svg');
  await svg.evaluate(el=>el.setAttribute('data-retained','yes'));
  await page.getByRole('button',{name:'Step notes'}).click();
  const [prev,next]=await Promise.all([page.getByRole('button',{name:/Back/}).boundingBox(),page.getByRole('button',{name:/Next concept/}).boundingBox()]);
  expect(prev!.y).toBe(next!.y);
  expect(next!.x-prev!.x-prev!.width).toBeLessThan(12);
  await page.getByRole('button',{name:/Next concept/}).click();
  await expect(page).toHaveURL(/#embeddings-01$/);
  await expect(svg).toHaveAttribute('data-retained','yes');
  await page.goBack();
  await expect(page).toHaveURL(/#tokenization-03$/);
  await page.goForward();
  await expect(page).toHaveURL(/#embeddings-01$/);
});
test('original lesson embeds the same working reader',async({page})=>{
  await page.goto('/en'+units[0].sourcePath);
  await page.getByText('Explore the diagram in this lesson',{exact:true}).click();
  await page.locator('.step-pair .advance').click();
  await expect(page.locator('.chapter-svg')).toHaveAttribute('data-view','scene');
  await expect(page).toHaveURL('/en'+units[0].sourcePath);
});
test('retired atlas opens the chapter entries',async({page})=>{
  await page.goto(root);
  await expect(page).toHaveURL(/interactive\/#aase$/);
  await expect(page.locator('#aase details').filter({has:page.locator('a[href*="/aase/m02/"]')})).toHaveCount(chapters.length);
});
test('scene evidence remains readable without JavaScript',async({browser,baseURL})=>{
  const context=await browser.newContext({javaScriptEnabled:false,baseURL});
  const page=await context.newPage();
  await page.goto(root+'m02-01/');
  await page.locator('.static-open').click();
  await expect(page.locator('#desk-reading article')).toHaveCount(24);
  await expect(page.locator('#embeddings-02')).toBeVisible();
  await context.close();
});
test('flow animation loops, pauses and respects reduced motion',async({page})=>{
  await openFocus(page,'/en'+root+'m02-06/tool-intent-and-result/?step=2');
  const pulse=page.locator('[data-flow-pulse] circle');
  await expect(pulse).toHaveAttribute('data-hold','true');
  const lap=Number(await pulse.getAttribute('data-lap'));
  await expect(pulse).toHaveAttribute('data-lap',String(lap+1));
  await page.getByRole('button',{name:/Pause/}).click();
  const x=await pulse.getAttribute('cx');
  await page.waitForTimeout(150);
  expect(await pulse.getAttribute('cx')).toBe(x);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(pulse).toHaveCount(0);
});
function demoPath(slug: string, demo: string) {
  const unit = units.find(unit => unit.concept.slug === slug)!;
  const scene = unit.concept.scenes.findIndex(scene => scene.demo === demo);
  expect(scene, slug).toBeGreaterThanOrEqual(0);
  return '/en' + unit.path + '?step=' + (scene + 1);
}

test('segmentation, row lookup, mask and support use distinct graphical operations',async({page})=>{
  await openFocus(page,'/en'+root+'m02-01/tokenization/?step=2');
  const pieces=page.locator('[data-panel="tokenization-02"] [data-object="piece"]');
  await expect(pieces).toHaveCount(2);
  await page.getByRole('combobox',{name:'Choose scenario'}).selectOption({label:'Finer segmentation'});
  await expect(pieces).toHaveCount(4);
  await openFocus(page,'/en'+root+'m02-01/embeddings/?step=2');
  await page.getByRole('combobox',{name:'Choose scenario'}).selectOption({label:'Choose application #42'});
  await expect(page.locator('[data-panel="embeddings-02"] [data-row="42"]')).toHaveAttribute('data-selected','true');
  await expect(page.locator('[data-panel="embeddings-02"] [data-object="vector"] text')).toHaveText(['Read row #42','-0.1','0.5','0.2','-0.4']);
  await openFocus(page,'/en'+root+'m02-01/attention-qkv/?step=2');
  await page.getByRole('combobox',{name:'Choose scenario'}).selectOption({index:1});
  await expect(page.locator('[data-panel="attention-qkv-02"] [data-to="valueB"]')).toHaveAttribute('data-blocked','true');
  await openFocus(page,'/en'+root+'m02-01/attention-qkv/?step=3');
  const mask=page.getByRole('table',{name:'Illustrative causal mask'});
  await expect(mask.locator('[data-visible-key="true"]')).toHaveCount(6);
  await expect(mask.locator('[data-visible-key="false"]')).toHaveCount(3);
  await openFocus(page,'/en'+root+'m02-05/llm-vs-harness/');
  await expect(page.locator('[data-panel="llm-vs-harness-01"] .association')).toHaveCount(6);
});
test('softmax input updates the weighted output and reset restores defaults', async ({ page }) => {
  await openFocus(page, demoPath('softmax-weighted-sum', 'softmax'));
  const result = page.locator('.learning-stage output');
  await expect(result).toContainText('3.076');
  const slider = page.getByRole('slider', { name: /Score A/ });
  await slider.focus();
  for (let i = 0; i < 4; i++) await slider.press('ArrowLeft');
  await expect(result).toContainText('4.000');
  await page.getByRole('button', { name: 'Reset conditions' }).click();
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

test('language switching retains the scene and the quiz resets on navigation',async({page})=>{
  await openFocus(page,root+'m02-01/tokenization/?step=3');
  await page.locator('.language').click();
  await expect(page).toHaveURL('/en'+root+'m02-01/#tokenization-03');
  await page.getByRole('button',{name:/Practice/}).click();
  const quiz=page.locator('.desk-sheet');
  await quiz.getByRole('radio').first().check();
  await quiz.getByRole('button',{name:'Check answer'}).click();
  await expect(quiz.getByRole('status')).toBeVisible();
  await page.locator('main').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/#tokenization-02$/);
  await page.locator('main').focus();
  await page.keyboard.press('ArrowRight');
  await expect(quiz.getByRole('button',{name:'Check answer'})).toBeDisabled();
});
test('swapping actors crosses the tracks while word identity is preserved',async({page})=>{
  await openFocus(page,'/en'+root+'m02-01/position-information/?step=2');
  const words=page.locator('[data-panel="position-information-02"] [data-object="slot"]');
  await page.getByRole('combobox',{name:'Choose scenario'}).selectOption({index:1});
  await expect(words.locator('text')).toHaveText(['Ana','helps','Bo','Bo','helps','Ana']);
  const original=await words.first().locator('rect').getAttribute('fill');
  await expect(words.last().locator('rect')).toHaveAttribute('fill',original!);
});
