<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { localized } from '#lib/model.ts';
  import { explanationAt, sceneAt, type InteractiveLessonData, type Locale, type Scenario } from '../model.ts';
  import ImmersiveShell from './ImmersiveShell.svelte';
  import InteractiveStage from './InteractiveStage.svelte';

  let { lang, lesson }: { lang: Locale; lesson: InteractiveLessonData } = $props();
  const path = $derived('/interactive/system-design/' + lesson.id + '/');
  const zh = $derived(lang === 'zh');
  const labels = $derived(zh ? {
    problem: '這一步要解決什麼？', mechanism: '怎麼運作', observe: '看圖時留意', boundary: '適用界線'
  } : {
    problem: 'Problem', mechanism: 'Mechanism', observe: 'Observe', boundary: 'Boundary and trade-off'
  });

  let ready = $state(false);
  let reducedMotion = $state(false);
  let playing = $state(false);
  let replay = $state(0);
  const query=$derived((page.shallow?.url??page.url).searchParams);
  let scenario=$state<Scenario>({dnsCached:false,dbSlow:false});
  const invalidStep=$derived(ready && query.has('step') && String(parseStep(query.get('step')))!==query.get('step'));
  function rememberScenario(event:MouseEvent){
    const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a.language'):null;
    if(!link || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)return;
    try { sessionStorage.setItem('request-language-transfer',JSON.stringify({url:link.href,...scenario})); } catch { /* Storage can be disabled. */ }
  }
  let selectedAnswer = $state<number>();
  let checkedAnswer = $state<number>();

  function parseStep(raw: string | null) {
    const number = raw && /^[1-9]\d*$/.test(raw) ? Number(raw) : 1;
    return number <= lesson.steps.length ? number : 1;
  }

  const stepNumber = $derived(ready ? parseStep((page.shallow?.url ?? page.url).searchParams.get('step')) : 1);
  const step = $derived(lesson.steps[stepNumber - 1]);
  const scene = $derived(sceneAt(step, scenario));
  const stepExplanation = $derived(explanationAt(step, lang, scenario));
  const progress = $derived(zh
    ? `第 ${stepNumber} 步，共 ${lesson.steps.length} 步`
    : `Step ${stepNumber} of ${lesson.steps.length}`);

  onMount(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyPreference = () => { reducedMotion = preference.matches; };
    try {
      const key='request-language-transfer';
      const saved=sessionStorage.getItem(key);
      sessionStorage.removeItem(key);
      const transfer=saved && JSON.parse(saved);
      if(transfer?.url===location.href)scenario={dnsCached:transfer.dnsCached===true,dbSlow:transfer.dbSlow===true};
    } catch { /* Use the default scenario when storage is unavailable. */ }
    applyPreference();
    ready = true;
    preference.addEventListener('change', applyPreference);
    return () => preference.removeEventListener('change', applyPreference);
  });

  $effect(() => {
    // Each scene change starts a fresh animation. Media preference can disable it.
    if (scene) {
      playing = ready && !reducedMotion;
    }
  });

  async function setStep(number: number) {
    if (!ready || !Number.isInteger(number) || number === stepNumber || number < 1 || number > lesson.steps.length) return;
    const url = new URL(window.location.href);
    url.hash = '';
    url.searchParams.set('step', String(number));
    await goto(url, { shallow: true });
  }

  function chooseStep(event: MouseEvent, number: number) {
    if (!ready || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    void setStep(number);
  }

  function restartMotion() {
    replay += 1;
    playing = true;
  }
</script>

<svelte:window onclick={rememberScenario}/>

<ImmersiveShell {lang} {path} title={lesson.title[lang]} description={lesson.summary[lang]}
  step={stepNumber} stepId={step.id} {ready}
  onprevious={() => void setStep(stepNumber - 1)} onnext={() => void setStep(stepNumber + 1)}>
  {#snippet breadcrumbs()}
    <nav class="breadcrumbs" aria-label={zh ? '所在位置' : 'Breadcrumb'}>
      <a href={localized('/', lang)}>{zh ? '課程' : 'Courses'}</a>
      <a href={localized('/interactive/', lang)}>{zh ? '互動學習' : 'Interactive learning'}</a>
      <span aria-current="page">{zh ? '系統設計' : 'System design'}</span>
    </nav>
  {/snippet}
  {#snippet rail()}
      <nav class="step-rail" aria-label={zh ? '課程步驟' : 'Lesson steps'}>
        <ol>
          {#each lesson.steps as item (item.id)}
            <li>
              <a href={ready ? '?step=' + item.order : '#read-' + item.id} aria-current={item.order === stepNumber ? 'step' : undefined} onclick={(event) => chooseStep(event, item.order)}>
                <span class="step-ordinal">{String(item.order).padStart(2, '0')}</span><span>{item.title[lang]}</span>
              </a>
            </li>
          {/each}
        </ol>
      </nav>
  {/snippet}
  {#snippet stage()}
        {#if ready}
          <label class="step-select">
            <span>{zh ? '前往步驟' : 'Go to step'}</span>
            <select aria-label={zh ? '前往步驟' : 'Go to step'} value={stepNumber} onchange={(event) => void setStep(Number(event.currentTarget.value))}>
              {#each lesson.steps as item (item.id)}
                <option value={item.order}>{item.order} {item.title[lang]}</option>
              {/each}
            </select>
          </label>
        {/if}
        <div class="stage-label">
          <span>{zh ? 'HTTP/2 連線示意' : 'Illustrated HTTP/2 connection'}</span>
          <span>{zh ? '示意流程' : 'Illustration'}</span>
        </div>
        <InteractiveStage stepId={step.id} nodes={lesson.nodes} edges={lesson.edges} {scene} {lang} {playing} {replay} />
  {/snippet}
  {#snippet controls()}
        {#if ready}
          <div class="lesson-controls" role="group" aria-label={zh ? '示意流程控制' : 'Diagram controls'}>
            <div class="step-actions">
              <button type="button" class="secondary" onclick={() => void setStep(stepNumber - 1)} disabled={stepNumber <= 1}>{zh ? '上一步' : 'Previous'}</button>
              <button type="button" onclick={() => void setStep(stepNumber + 1)} disabled={stepNumber >= lesson.steps.length}>{zh ? '下一步' : 'Next'}</button>
            </div>
            <div class="motion-controls">
              {#if reducedMotion}
                <p>{zh ? '依照裝置的減少動態效果設定，圖解以靜態路徑呈現。' : 'Your reduced-motion preference is on. The diagram shows a static path.'}</p>
              {:else}
                <button type="button" class="secondary" onclick={restartMotion}>{zh ? '重播' : 'Replay'}</button>
                <button type="button" class="secondary" onclick={() => { playing = !playing; }}>{playing ? (zh ? '暫停動態' : 'Pause motion') : (zh ? '繼續動態' : 'Resume motion')}</button>
              {/if}
            </div>
          </div>
        {/if}
  {/snippet}
  {#snippet explanation()}
    {#if invalidStep}<p role="status">{zh?'此步驟不存在，顯示第一步。':'Unknown step. Showing the first step.'}</p>{/if}
      <section class="explanation" aria-labelledby="step-title">
        <div class="step-progress">
          <p class="step-position">{progress}</p>
          <progress max={lesson.steps.length} value={stepNumber} aria-label={progress}></progress>
        </div>
        <h2 id="step-title">{step.title[lang]}</h2>
        <dl>
          <div class="problem"><dt>{labels.problem}</dt><dd>{stepExplanation.problem}</dd></div>
          <div><dt>{labels.mechanism}</dt><dd>{stepExplanation.mechanism}</dd></div>
          <div><dt>{labels.observe}</dt><dd>{stepExplanation.observe}</dd></div>
          <div><dt>{labels.boundary}</dt><dd>{stepExplanation.boundary}</dd></div>
        </dl>
        {#if ready && step.variant?.when === 'dns-cached'}
          <fieldset class="variation">
            <legend>{zh ? 'DNS 查詢' : 'DNS lookup'}</legend>
            <label><input type="radio" name="dns-cache" checked={!scenario.dnsCached} onchange={() => { scenario.dnsCached = false; }} /> {zh ? '沒有快取結果' : 'No cached answer'}</label>
            <label><input type="radio" name="dns-cache" checked={scenario.dnsCached} onchange={() => { scenario.dnsCached = true; }} /> {zh ? '已有快取結果' : 'Cached answer'}</label>
          </fieldset>
        {:else if ready && step.variant?.when === 'db-slow'}
          <fieldset class="variation">
            <legend>{zh ? '資料庫查詢' : 'Database query'}</legend>
            <label><input type="radio" name="db-query" checked={!scenario.dbSlow} onchange={() => { scenario.dbSlow = false; }} /> {zh ? '一般查詢' : 'Normal query'}</label>
            <label><input type="radio" name="db-query" checked={scenario.dbSlow} onchange={() => { scenario.dbSlow = true; }} /> {zh ? '緩慢查詢' : 'Slow query'}</label>
          </fieldset>
        {/if}
      {#if ready}
        <p class="sr-only" role="status">{[progress, step.title[lang], scene.label[lang]].join(zh ? '。' : '. ')}</p>
      {/if}
      </section>
  {/snippet}
  {#snippet reading()}
    <div class="lesson-reading">
      {#if ready && stepNumber === lesson.steps.length}
        <section class="comprehension" aria-labelledby="check-title">
          <h2 id="check-title">{zh ? '理解檢查' : 'Comprehension check'}</h2>
          <form onsubmit={(event) => { event.preventDefault(); checkedAnswer = selectedAnswer; }}>
            <fieldset>
              <legend>{lesson.check.question[lang]}</legend>
              {#each lesson.check.options as option, index}
                <label class="answer">
                  <input type="radio" name="comprehension" value={index} bind:group={selectedAnswer} onchange={() => { checkedAnswer = undefined; }} />
                  <span>{option[lang]}</span>
                </label>
              {/each}
            </fieldset>
            <button type="submit" disabled={selectedAnswer === undefined}>{zh ? '檢查答案' : 'Check answer'}</button>
            {#if checkedAnswer !== undefined}
              <p role="status" class="feedback">
                <strong>{checkedAnswer === lesson.check.answer ? (zh ? '答對了。' : 'Correct.') : (zh ? '再想一想。' : 'Try again.')}</strong>
                {lesson.check.feedback[checkedAnswer][lang]}
              </p>
            {/if}
          </form>
        </section>
      {/if}

      <section class="assumptions">
        <h2>{zh ? '這個例子的設定' : 'Scenario assumptions'}</h2>
        <p>{lesson.objective[lang]}</p>
        <ul>{#each lesson.assumptions as assumption}<li>{assumption[lang]}</li>{/each}</ul>
      </section>

      <details id="written-walkthrough" open>
        <summary>{zh ? '閱讀完整十步文字版' : 'Read the complete ten-step walkthrough'}</summary>
        <p>{zh ? '這份文字版也可在停用 JavaScript 時閱讀。' : 'The written steps are also available with JavaScript disabled.'}</p>
        <ol class="reading-steps">
          {#each lesson.steps as item (item.id)}
            <li id={'read-' + item.id}>
              <h3>{item.title[lang]}</h3>
              <dl>
                <div><dt>{labels.problem}</dt><dd>{item.text[lang].problem}</dd></div>
                <div><dt>{labels.mechanism}</dt><dd>{item.text[lang].mechanism}</dd></div>
                <div><dt>{labels.observe}</dt><dd>{item.text[lang].observe}</dd></div>
                <div><dt>{labels.boundary}</dt><dd>{item.text[lang].boundary}</dd></div>
                {#if item.variant}
                  <div>
                    <dt>{item.variant.when === 'dns-cached' ? (zh ? '已有快取結果' : 'Cached answer') : (zh ? '緩慢查詢' : 'Slow query')}</dt>
                    <dd>{item.variant.text[lang].observe} {item.variant.text[lang].boundary}</dd>
                  </div>
                {/if}
              </dl>
            </li>
          {/each}
        </ol>
        <details>
          <summary>{lesson.check.question[lang]}</summary>
          <ol>{#each lesson.check.options as option}<li>{option[lang]}</li>{/each}</ol>
          <p><strong>{lesson.check.options[lesson.check.answer][lang]}</strong></p>
          <p>{lesson.check.feedback[lesson.check.answer][lang]}</p>
        </details>
      </details>

      <section class="sources" aria-labelledby="lesson-sources">
        <h2 id="lesson-sources">{zh ? '參考資料與延伸閱讀' : 'References and further reading'}</h2>
        <ul>{#each lesson.sources as source (source.id)}<li><a href={source.url}>{source.title[lang]}</a></li>{/each}</ul>
        <p><a href={localized('/courses/networking/', lang)}>{zh ? '延伸閱讀網路基礎' : 'Read the networking course'}</a></p>
        <p class="metadata">
          <span>CS Kairos</span>
          <span>{zh ? '初版' : 'First edition'} <time datetime={lesson.publishedOn}>{lesson.publishedOn}</time></span>
          <span>v{lesson.version} · {zh ? '修訂' : 'Revised'} <time datetime={lesson.revisedOn}>{lesson.revisedOn}</time></span>
        </p>
      </section>
    </div>
  {/snippet}
</ImmersiveShell>

<style>
  .breadcrumbs > :not(:first-child)::before { content: ' / '; margin-right: .55rem; color: var(--muted); }
  .step-rail ol { list-style: none; padding: 0; margin: 0; }
  .step-rail li { margin: 0; padding: 0; }
  .step-rail a {
    display: grid;
    grid-template-columns: 1.6em minmax(0, 1fr);
    gap: .45rem;
    align-items: baseline;
    min-height: 44px;
    padding: .48rem .48rem .48rem .65rem;
    border-inline-start: 2px solid var(--line);
    color: var(--ink);
    text-decoration: none;
    font-size: .86rem;
    line-height: 1.45;
  }
  .step-rail a:hover { text-decoration: underline; }
  .step-ordinal { font-variant-numeric: tabular-nums; color: var(--muted); }
  .step-rail a[aria-current='step'] { border-inline-start-color: var(--accent); background: var(--soft); color: var(--accent); font-weight: 700; }
  .stage-label { display: flex; justify-content: space-between; gap: .6rem; padding: .56rem .78rem; border-bottom: 1px solid var(--line); font-size: .77rem; line-height: 1.4; color: var(--muted); }
  .stage-label span:first-child { color: var(--ink); font-weight: 650; }
  .step-select { display: none; }
  .explanation { padding: 0 .1rem; border-top: 1px solid var(--line); }
  .step-progress { display: flex; flex-wrap: wrap; align-items: center; gap: .25rem .7rem; margin: .45rem 0; }
  .step-position { color: var(--accent); font-size: .81rem; font-variant-numeric: tabular-nums; margin: 0; font-weight: 650; }
  .step-progress progress { width: clamp(2.5rem, 8vw, 6rem); accent-color: var(--accent); }
  .explanation h2 { margin: 0; font-size: clamp(1.35rem, 2vw, 1.8rem); }
  .problem { margin-top: .45rem; }
  .explanation .problem dd { color: var(--ink); font-size: .96rem; }
  dl { margin: 0; }
  dl > div + div { margin-top: .65rem; }
  dt { font-weight: 700; }
  dd { margin: .1rem 0 0; }
  .explanation dl { font-size: .88rem; line-height: 1.6; }
  .explanation dd { color: var(--muted); }
  .variation, .comprehension fieldset { min-inline-size: 0; padding: 0; border: 0; }
  .variation { margin: .8rem 0 0; padding-block: .25rem; border-top: 1px solid var(--line); }
  .variation legend { font-size: .84rem; font-weight: 650; }
  .variation label { display: flex; gap: .4rem; align-items: center; min-height: 44px; font-size: .85rem; cursor: pointer; }
  .variation input { min-height: unset; margin: 0; width: 1.1rem; height: 1.1rem; accent-color: var(--accent); flex: 0 0 auto; }
  .lesson-controls { display: flex; flex-wrap: wrap; gap: .6rem 1rem; align-items: center; justify-content: space-between; padding: .8rem .85rem; }
  .step-actions {flex-wrap:nowrap !important}
  .step-actions, .motion-controls { display: flex; min-width: 0; flex-wrap: wrap; align-items: center; gap: .6rem; }
  .motion-controls p { margin: 0; color: var(--muted); font-size: .85rem; }
  .lesson-controls button { font-size: .85rem; }
  :is(a, button, input, select, summary):focus-visible { outline-offset: 3px; }
  button:not(:disabled):active { filter: brightness(.85); }
  button:disabled { border-style: dashed; }
  .lesson-reading { margin: 2.2rem auto 0; max-width: 75ch; }
  .lesson-reading h2 { margin: .3rem 0 .7rem; }
  .lesson-reading section { margin-bottom: 1.6rem; }
  .lesson-reading > details { border-block: 1px solid var(--line); padding-block: .45rem; margin-bottom: 1.6rem; }
  .reading-steps h3 { margin-top: .6rem; }
  .reading-steps > li { margin-bottom: 1.2rem; }
  .comprehension { padding: 1rem 1.1rem; background: var(--soft); border-radius: .45rem; }
  .feedback { margin: .8rem 0 0; }
  .metadata { display: flex; flex-wrap: wrap; gap: .7rem; }
  @media (max-width: 1020px) {
    .step-rail { display: none; }
    .step-select { display: flex; flex-wrap: wrap; gap: .5rem .8rem; align-items: center; padding: .6rem .78rem; border-bottom: 1px solid var(--line); color: var(--ink); font-size: .9rem; }
    .step-select select { flex: 1 1 15.5rem; min-width: 0; }
  }
  @media (max-width: 790px) {
    .explanation { padding-top: .35rem; }
    .lesson-reading { margin-top: 1.4rem; }
  }
  @media (forced-colors: active) {
    .step-rail a[aria-current='step'] { border-inline-start-color: Highlight; }
  }
</style>
