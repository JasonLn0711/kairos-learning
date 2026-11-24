import assert from 'node:assert/strict';
import {chromium,webkit} from '@playwright/test';

const origin=process.env.VISUAL_ORIGIN??'http://127.0.0.1:4653';
const root=origin+'/en/interactive/aase/m02/';
for(const engine of [chromium,webkit]){
  const browser=await engine.launch();
  try{
    const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
    const open=async (path,step)=>{
      await page.goto(root+path+'/?step='+step);
      await page.locator('main.focus figure[data-scene="0'+step+'"]').waitFor();
    };
    const figure=page.locator('figure[data-flow]');
    await open('m02-01/tokenization',2);
    await page.getByRole('combobox',{name:'Choose scenario'}).selectOption('1');
    assert.equal(await figure.locator('[data-object="piece"]').count(),4);
    await open('m02-01/embeddings',2);
    await page.getByRole('combobox',{name:'Choose scenario'}).selectOption('1');
    assert.equal(await figure.locator('[data-row][data-selected="true"]').getAttribute('data-row'),'42');
    assert.deepEqual(await figure.locator('[data-object="vector"] text').allTextContents(),['Read row #42','-0.1','0.5','0.2','-0.4']);
    await open('m02-01/softmax-weighted-sum',3);
    await page.getByRole('slider',{name:/Score A/}).focus();
    for(let i=0;i<4;i++)await page.keyboard.press('ArrowLeft');
    assert.equal(await figure.locator('[data-object="weighted"] .number').textContent(),'4.000');
    await open('m02-02/context-budget',2);
    await page.getByRole('slider').focus();await page.keyboard.press('End');
    assert.equal(await figure.locator('[data-object="logs"]').getAttribute('data-tokens'),'3000');
    await open('m02-06/four-gates',2);
    await page.getByRole('checkbox',{name:'Authorized',exact:true}).uncheck();
    assert.equal(await figure.locator('[data-object="authorization"]').getAttribute('data-state'),'failed');
    assert.equal(await figure.locator('[data-state="skipped"]').count(),2);
    await open('m02-01/attention-qkv',2);
    await page.getByRole('combobox',{name:'Choose scenario'}).selectOption('1');
    assert.equal(await figure.locator('[data-object="valueB"]').getAttribute('data-state'),'skipped');
    assert.equal(await figure.locator('[data-object="mixed"] .value').textContent(),'[2, 1]');
    console.log(engine.name(),'passed token segmentation, row lookup, softmax, capacity, gate stop and causal masking');
  }finally{await browser.close();}
}
