<script lang="ts">
  import PolicyStage from './PolicyStage.svelte';
  import StageDiagram from './StageDiagram.svelte';
  import type { Locale } from '../model.ts';
  import type { TeachingScene } from '../aase/model.ts';
  import { attentionDemo, contextBudget, contextBudgetLimit, contextBudgetParts, evaluateGates, subjectLimit } from '../aase/simulations.ts';

  let { scene, lang, ready, fixture }: { scene: TeachingScene; lang: Locale; ready: boolean; fixture: 'm02-04' | 'm02-06' } = $props();
  const zh = $derived(lang === 'zh');
  let choice = $state(0);
  let first = $state(1);
  let second = $state(0);
  let logs = $state(500);
  let day = $state<'weekday' | 'weekend'>('weekday');
  let subjects = $state(3);
  let schema = $state(true);
  let authorized = $state(true);
  let toolSucceeded = $state(true);
  let verified = $state(false);
  const attention = $derived(attentionDemo(first, second));
  const budget = $derived(contextBudget(logs));
  const gates = $derived(evaluateGates({ schema, authorized, toolSucceeded, verified }));
  const limit = $derived(subjectLimit(day, subjects, fixture));
  const cards = $derived(scene.choices?.[choice]?.cards ?? scene.cards);
  const budgetLabels = $derived(zh ? ['規則', '需求與程式碼', '測試', '預留輸出', '額外日誌'] : ['Rules', 'Requirements and code', 'Tests', 'Output reserve', 'Extra logs']);
  const gateLabels = $derived(zh ? ['格式', '授權', '執行', '驗收'] : ['Schema', 'Authorization', 'Execution', 'Verification']);
  const gateStatus = $derived(zh ? { passed: '通過', failed: '失敗', skipped: '略過' } : { passed: 'Passed', failed: 'Failed', skipped: 'Skipped' });
</script>

<section class="learning-stage" data-kind={scene.kind} aria-label={scene.title[lang]}>
  <h2>{scene.title[lang]}</h2>
  {#if scene.demo === 'governed-policy' || scene.demo === 'sandbox-policy' || scene.demo === 'scope-policy' || scene.demo === 'retry-policy' || scene.demo === 'required-field'}
    <PolicyStage demo={scene.demo} {lang} {ready} />
  {:else if scene.demo === 'softmax'}
    <div class="inputs">
      <label>{zh ? '分數' : 'Score'} A <input type="range" min="-4" max="4" step=".25" bind:value={first} disabled={!ready} /> {first}</label>
      <label>{zh ? '分數' : 'Score'} B <input type="range" min="-4" max="4" step=".25" bind:value={second} disabled={!ready} /> {second}</label>
    </div>
    <dl class="cards">
      {#each attention.weights as weight, index}
        <div><dt>{index === 0 ? 'A' : 'B'} · {zh ? '權重' : 'Weight'}</dt><dd>{weight.toFixed(3)} × {index === 0 ? 2 : 6}<meter min="0" max="1" value={weight} aria-label={index === 0 ? 'A' : 'B'}></meter></dd></div>
      {/each}
    </dl>
    <p class="formula">
      <span>{zh ? '權重' : 'Weight'} wᵢ = exp(sᵢ − max(s)) / Σⱼ exp(sⱼ − max(s))</span>
      <span>{zh ? '加權值' : 'Weighted value'} = 2wₐ + 6wᵦ</span>
    </p>
    <output aria-live="polite">{zh ? '加權結果' : 'Weighted result'} <strong>{attention.value.toFixed(3)}</strong></output>
  {:else if scene.demo === 'budget'}
    <div class="inputs"><label>{zh ? '額外日誌 token' : 'Extra log tokens'} <input type="range" min="0" max="3000" step="100" bind:value={logs} disabled={!ready} /> {logs}</label></div>
    <meter min="0" max={contextBudgetLimit} value={Math.min(contextBudgetLimit, budget.used)} aria-label={zh ? '使用量' : 'Used tokens'}></meter>
    <dl class="budget-breakdown">
      {#each [...contextBudgetParts, logs] as amount, part}
        <div><dt>{budgetLabels[part]}</dt><dd>{amount.toLocaleString('en-US')}</dd></div>
      {/each}
    </dl>
    <output aria-live="polite">{budget.used.toLocaleString('en-US')} / {contextBudgetLimit.toLocaleString('en-US')} · {zh ? '剩餘' : 'Remaining'} <strong>{budget.remaining.toLocaleString('en-US')}</strong>{#if !budget.fits} · {zh ? '超出' : 'Over by'} {budget.overflow.toLocaleString('en-US')}{/if}</output>
  {:else if scene.demo === 'workflow'}
    <div class="inputs">
      <label>{zh ? '日期類型' : 'Day type'} <select bind:value={day} disabled={!ready}><option value="weekday">{zh ? '平日' : 'Weekday'}</option><option value="weekend">{zh ? '週末' : 'Weekend'}</option></select></label>
      <label>{zh ? '科目數' : 'Subjects'} <select bind:value={subjects} disabled={!ready}>{#each [1,2,3,4,5,6] as value}<option {value}>{value}</option>{/each}</select></label>
    </div>
    <output aria-live="polite">{fixture.toUpperCase()} · {zh ? '上限' : 'Limit'} {limit.limit} · {limit.accepted ? (zh ? '接受' : 'Accepted') : (zh ? '拒絕' : 'Rejected')}</output>
  {:else if scene.demo === 'gates'}
    <div class="inputs checks">
      <label><input type="checkbox" bind:checked={schema} disabled={!ready} /> {zh ? '格式有效' : 'Schema valid'}</label>
      <label><input type="checkbox" bind:checked={authorized} disabled={!ready} /> {zh ? '已授權' : 'Authorized'}</label>
      <label><input type="checkbox" bind:checked={toolSucceeded} disabled={!ready} /> {zh ? '工具成功' : 'Tool succeeded'}</label>
      <label><input type="checkbox" bind:checked={verified} disabled={!ready} /> {zh ? '驗收通過' : 'Evidence verified'}</label>
    </div>
    <ol class="gates" role="list" aria-label={zh ? '依序檢查的四道關卡' : 'Four gates checked in order'}>
      {#each gates.stages as gate, index}
        <li data-outcome={gate}>
          <span class="gate-position">{index + 1}</span>
          <strong>{gateLabels[index]}</strong>
          <span class="gate-result"><span aria-hidden="true">{gate === 'passed' ? '✓' : gate === 'failed' ? '×' : '—'}</span> {gateStatus[gate]}</span>
        </li>
      {/each}
    </ol>
    <output aria-live="polite">{gates.executed ? (zh ? '已模擬執行' : 'Simulated execution attempted') : (zh ? '未執行' : 'No execution')} · {gates.accepted ? (zh ? '可驗收' : 'Accepted') : (zh ? '尚未驗收' : 'Acceptance pending')}</output>
  {:else}
    {#if scene.choices}
      <label class="choice">{zh ? '切換情境' : 'Choose scenario'} <select bind:value={choice} disabled={!ready}>{#each scene.choices as option, index}<option value={index}>{option.label[lang]}</option>{/each}</select></label>
    {/if}
    <StageDiagram {scene} {cards} {lang} />
    {#if scene.choices}<output aria-live="polite">{scene.choices[choice].result[lang]}</output>{/if}
  {/if}
</section>

<style>
  .learning-stage { min-width: 0; min-height: 0; flex: 1; display: grid; align-content: center; align-content: safe center; gap: .65rem; padding: clamp(.65rem, 2vw, 1.5rem); background: var(--soft); border: 1px solid var(--line); border-radius: .45rem; }
  h2 { margin: 0; font-size: clamp(1.15rem, 2vw, 1.65rem); }
  .inputs { display:flex; flex-wrap:wrap; gap:.4rem .8rem; }
  .inputs label, .choice { display:flex; align-items:center; gap:.4rem; flex-wrap:wrap; }
  input[type='checkbox'] { min-height: auto; accent-color: var(--accent); }
  input[type='range'] { min-height: 32px; max-width: 100%; accent-color: var(--accent); }
  select { min-width: 0; max-width: 100%; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(9rem, 100%), 1fr)); gap: .6rem; margin: 0; }
  .cards div { position: relative; min-width: 0; border: 1px solid var(--line); border-top: 3px solid var(--accent); background: var(--paper); border-radius: .3rem; padding: .55rem .65rem; }
  .cards dt { font-weight: 700; color: var(--accent); }
  .cards dd { margin: .15rem 0 0; overflow-wrap: anywhere; }
  .formula { display: grid; gap: .15rem; color: var(--muted); line-height: 1.45; overflow-wrap: anywhere; }
  .budget-breakdown { display: flex; flex-wrap: wrap; gap: .3rem .65rem; margin: 0; }
  .budget-breakdown > div { display: flex; gap: .25rem; align-items: baseline; border-inline-start: 2px solid var(--line); padding-inline-start: .4rem; }
  .budget-breakdown dd, .gates li { font-variant-numeric: tabular-nums; }
  .gates { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(8rem, 100%), 1fr)); gap: .45rem; margin: 0; padding: 0; list-style: none; }
  .gates li { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: baseline; gap: .15rem .4rem; min-inline-size: 0; padding: .45rem .56rem; margin: 0; overflow-wrap: anywhere; border: 1px solid var(--line); border-block-start: 3px solid var(--accent); border-radius: .35rem; background: var(--paper); }
  .gates [data-outcome='failed'] { border-block-start-style: double; }
  .gates [data-outcome='skipped'] { border-block-start-style: dashed; }
  .gate-position { color: var(--muted); font-weight: 650; }
  .gate-result { grid-column: 2; }
  output { font-weight: 650; overflow-wrap: anywhere; }
  meter { width: 100%; }
  p { margin: 0; }
  @media (min-width: 1120px) and (max-height: 800px) {
    .learning-stage { padding: .85rem; gap: .55rem; }
  }
</style>
