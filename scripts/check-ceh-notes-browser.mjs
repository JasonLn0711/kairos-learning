import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';

const base = process.env.CEH_NOTES_BASE_URL || 'http://127.0.0.1:4227';
const outputRoot = '.local/ceh-notes';
const clean = text => text.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/[\s·]/g,'');
const texts = block => (block.kind==='figure'||block.kind==='diagram') ? [block.caption,block.description,...block.items.flatMap((i,index)=>[i.title,...(block.name==='controlaxes'&&index<2?i.body.split('／').flatMap(v=>v.split(' / ')):[i.body])])] : block.kind==='recall' ? [block.caption,block.description,...block.cards.flatMap(c=>[c.question,c.references,...c.answer])] : block.kind==='checks' ? block.items.flatMap(q=>[q.prompt,...q.options,...q.rationales]) : block.kind==='list' ? block.items : block.kind==='table' ? [...block.headers,...block.rows.flat()] : block.kind==='answer' ? [block.summary,...block.paragraphs] : [block.text];
const overflow = page => page.evaluate(()=>document.documentElement.scrollWidth > innerWidth);
mkdirSync(outputRoot, {recursive:true});
const browser = await chromium.launch({headless:true});
try {
 for (const date of ['2026-11-10','2026-11-12']) {
  const output = `${outputRoot}/${date}`;mkdirSync(output,{recursive:true});
  const note = JSON.parse(readFileSync(`content/ceh-notes/${date}.json`,'utf8'));
  const blocksFor = lang => note.parts.flatMap(p=>p.text[lang].sections.flatMap(s=>s.body));
  for (const lang of ['zh','en']) {
    const prefix = lang === 'en' ? '/en' : '';
    const title = lang === 'zh' ? 'CEH 考古題知識筆記' : 'CEH Exam Study Notes';
    const context = await browser.newContext({javaScriptEnabled:false,acceptDownloads:true});
    const page = await context.newPage();
    for (const width of [320,390,768,1280]) {
      await page.setViewportSize({width,height:900});
      await page.goto(base + prefix + '/');
      const entry = page.locator('.course-row').filter({hasText:title});
      assert.equal(await entry.count(),1);await entry.click();
      assert.equal(await page.locator('h1').textContent(),title);
      await page.locator(`.reading-list a[href="${prefix}/ceh-notes/${note.date}/"]`).click();
      await page.waitForLoadState('load');
      assert.equal(await page.locator('h1').textContent(),note.text[lang].title);
      if(width===320){
        const bootstrap=(await page.locator('script').allTextContents()).find(s=>s.includes('kit.start'));
        assert.ok(bootstrap,'Missing application bootstrap');
        const identifier=bootstrap.match(/__sveltekit_[a-z0-9]+/)?.[0];
        const entry=bootstrap.match(/import\("([^"]*\/entry\/start\.[^"]+\.js)"\)/)?.[1];
        assert.ok(identifier&&entry,'Unknown bootstrap contract');
        const response=await page.request.get(new URL(entry,page.url()).href);assert.equal(response.status(),200);
        assert.ok((await response.text()).includes(identifier),'HTML/client initialization identifiers differ; finish all sync/SSR fixture work before the final production build');
      }
      const body=clean(await page.locator('main').textContent());
      for(const part of note.parts)for(const section of part.text[lang].sections){
        assert.ok(body.includes(clean(section.heading)),section.id);
        for(const block of section.body)for(const text of texts(block))assert.ok(body.includes(clean(text)),`${lang}: missing ${text}`);
      }
      if(date==='2026-11-10'){
        assert.equal(await page.locator('.note-diagram[data-diagram="testing"] .numbered>li').count(),5);
        assert.equal(await page.locator('#part-1 .cia li').count(),3);
      }
      assert.equal(await page.locator('.recall-card').count(),blocksFor(lang).filter(b=>b.kind==='recall').reduce((n,b)=>n+b.cards.length,0));
      assert.equal(await page.locator('.daily-note input[type="radio"]').count(),blocksFor(lang).filter(b=>b.kind==='checks').flatMap(b=>b.items).reduce((n,q)=>n+q.options.length,0));
      assert.ok(!await overflow(page),`${lang} ${width} overflow`);
      await page.screenshot({path:`${output}/daily-${lang}-${width}.png`});
      for(const name of ['ciaobjectives','transactiontampering','serviceavailability','signatureevidence','transportprotection']){
        const figure=page.locator(`[data-diagram="${name}"]`);
        if(!await figure.count())continue;
        await figure.evaluate(el=>el.scrollIntoView({block:'start'}));
        await page.screenshot({path:`${output}/c01-${name}-${lang}-${width}.png`});
      }
      if(width===320||width===1280)for(const part of note.parts){
        await page.evaluate(number=>document.getElementById('part-'+number).scrollIntoView({block:'start'}),part.number);
        await page.screenshot({path:`${output}/part-${part.number}-${lang}-${width}.png`});
      }
      if(await page.locator('.recall-card details').count()){
      await page.locator('.recall-card details').first().locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('.recall-card details').first().getAttribute('open'),'');
      await page.keyboard.press('Space');
      assert.equal(await page.locator('.recall-card details').first().getAttribute('open'),null);
      }
      const table=page.locator('.table-scroll').first();await table.focus();await page.keyboard.press('ArrowRight');
      assert.equal(await table.evaluate(el=>el===document.activeElement),true);
      const textStyle=await page.locator('.daily-note .source-body p').first().evaluate(el=>{const s=getComputedStyle(el);return {size:parseFloat(s.fontSize),line:parseFloat(s.lineHeight)};});
      assert.ok(textStyle.size>=16&&textStyle.line/textStyle.size>=1.7);
      await page.evaluate(()=>document.documentElement.style.fontSize='200%');
      assert.ok(!await overflow(page),`${lang} ${width} 200% overflow`);
      await page.screenshot({path:`${output}/daily-${lang}-${width}-200.png`});
      if(width===320||width===1280)for(const part of note.parts){
        await page.evaluate(number=>document.getElementById('part-'+number).scrollIntoView({block:'start'}),part.number);
        await page.screenshot({path:`${output}/part-${part.number}-${lang}-${width}-200.png`});
      }
      await page.evaluate(()=>document.documentElement.style.fontSize='');
    }
    const figures=note.parts.flatMap(part=>part.text[lang].sections.flatMap(s=>s.body).filter(b=>['figure','diagram','recall'].includes(b.kind)).map(b=>({part:part.number,name:b.kind==='recall'?'recall':b.name})));
    for(const {part,name} of figures){
      const path=`/images/ceh-notes/${note.date}-part-${part}-${name}-${lang}.svg`;
      const link=page.locator(`a[href="${path}"]`);
      await link.focus();
      const [download]=await Promise.all([page.waitForEvent('download'),page.keyboard.press('Enter')]);
      assert.deepEqual(readFileSync(await download.path()),readFileSync('site'+path));
      assert.ok(readFileSync('site'+path).length<100000);
      await page.goto(base+path);
      const geometry=await page.evaluate(()=>{
        const root=document.querySelector('svg'),v=root.viewBox.baseVal;
        const labels=[...root.querySelectorAll('text')].map(el=>({text:el.textContent,b:el.getBBox()}));
        return {outside:labels.filter(({b})=>b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height).map(t=>t.text),overlap:labels.flatMap((a,i)=>labels.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&a.b.x+a.b.width>c.b.x&&a.b.y<c.b.y+c.b.height&&a.b.y+a.b.height>c.b.y).map(c=>[a.text,c.text]))};
      });
      assert.deepEqual(geometry,{outside:[],overlap:[]},path);
      await page.locator('svg').screenshot({path:`${output}/svg-${name}-${lang}.png`});
      await page.goto(base+prefix+`/ceh-notes/${note.date}/`);
    }
    const indexResponse=await page.goto(base+'/search-index.json');
    const entries=JSON.parse(await indexResponse.text());
    const searchEntry=entries.find(e=>e.id==='CEH-NOTES-'+note.date&&e.lang===lang);
    assert.ok(searchEntry);
    const searchBody=clean(searchEntry.text);
    for(const part of note.parts)for(const section of part.text[lang].sections){
      assert.ok(searchBody.includes(clean(section.heading)),`search: ${section.id}`);
      for(const block of section.body)for(const text of texts(block))assert.ok(searchBody.includes(clean(text)),`search: ${lang} ${text}`);
    }
    await context.close();
    const interactive=await browser.newContext();const active=await interactive.newPage();
    await active.goto(base+prefix+`/ceh-notes/${note.date}/`);
    if(blocksFor(lang).some(b=>b.kind==='recall'))await active.waitForFunction(()=>document.querySelector('.recall .controls button:last-child')?.disabled===false);
    const recallGroups=blocksFor(lang).filter(b=>b.kind==='recall');
    assert.equal(await active.locator('.recall-card').count(),recallGroups.length);
    for(const [index,group] of recallGroups.entries()){
      const figure=active.locator('.recall').nth(index),next=figure.locator('.controls button').last(),previous=figure.locator('.controls button').first();
      assert.equal(await previous.isDisabled(),true);
      for(let i=1;i<group.cards.length;i++){
        await next.focus();await active.keyboard.press(i%2?'Enter':'Space');
        assert.equal((await figure.locator('.count').innerText()).trim(),`${i+1} / ${group.cards.length}`);
      }
      assert.equal(await next.isDisabled(),true);
      if(group.cards.length>1){await previous.focus();await active.keyboard.press('Enter');assert.equal((await figure.locator('.count').innerText()).trim(),`${group.cards.length-1} / ${group.cards.length}`);}
    }
    for(const [index,group] of blocksFor(lang).filter(b=>b.kind==='checks').entries()){
      const form=active.locator('.daily-note form').nth(index),submit=form.locator('button[type="submit"]');
      assert.equal(await submit.isDisabled(),true);
      for(const [i,q] of group.items.entries())await form.locator('fieldset').nth(i).locator('input').nth(q.answer).check();
      await submit.click();assert.equal(await form.locator('.feedback section').count(),group.items.length);
      assert.equal(await form.locator('.feedback').textContent().then(t=>t.includes(lang==='zh'?'再檢查理由':'Review your reasoning')),false);
      await form.locator('fieldset').first().locator('input').nth((group.items[0].answer+1)%group.items[0].options.length).check();assert.equal(await form.locator('.feedback').count(),0);
      await submit.click();assert.ok(await form.locator('.feedback').textContent().then(t=>t.includes(lang==='zh'?'再檢查理由':'Review your reasoning')));
    }
    assert.equal(await active.evaluate(()=>localStorage.length),0);
    if(date==='2026-11-10'){
      for(const hash of ['#p1-c01-map','#p1-c06-intro']){
        await active.goto(base+prefix+`/ceh-notes/2026-11-10/${hash}`);
        await active.waitForURL(base+prefix+`/ceh-notes/2026-11-12/${hash}`);
        assert.equal(await active.locator(hash).count(),1);
      }
      await active.goto(base+prefix+'/ceh-notes/2026-11-10/#part-2');
      await active.waitForFunction(()=>document.querySelector('.recall .controls button:last-child')?.disabled===false);
      assert.equal(new URL(active.url()).pathname,prefix+'/ceh-notes/2026-11-10/');
      await active.locator(`.notice a[href="${prefix}/ceh-notes/2026-11-12/"]`).click();
      await active.waitForURL(base+prefix+'/ceh-notes/2026-11-12/');
      await active.locator(`.notice a[href="${prefix}/ceh-notes/2026-11-10/"]`).click();
      await active.waitForURL(base+prefix+'/ceh-notes/2026-11-10/');
      await active.evaluate(()=>{location.hash='#p1-c01-map';});
      await active.waitForURL(base+prefix+'/ceh-notes/2026-11-12/#p1-c01-map');
    }
    await interactive.close();
  }
 }
  console.log('PASS: complete bilingual body; 4 widths and 200%; no-JS answers; keyboard; recall and checks; all published SVG geometry/downloads; search');
} finally { await browser.close(); }
