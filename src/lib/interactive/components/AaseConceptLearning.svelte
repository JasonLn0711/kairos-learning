<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { localized } from '#lib/model.ts';
  import type { Locale, Localized } from '../model.ts';
  import type { Concept } from '../aase/model.ts';
  import ImmersiveShell from './ImmersiveShell.svelte';
  import LearningStage from './LearningStage.svelte';

  let { lang, concept, chapter, sourceHref, nextHref, concepts }: {
    lang: Locale; concept: Concept; chapter: string; sourceHref: string; nextHref?: string;
    concepts: Pick<Concept, 'slug' | 'title'>[];
  } = $props();
  const zh = $derived(lang === 'zh');
  const groupPath = $derived('/interactive/aase/m02/' + chapter + '/');
  const path = $derived(groupPath + concept.slug + '/');
  let ready = $state(false);
  let replay = $state(0);
  let selected = $state<number>();
  let answered = $state<number>();
  const step = $derived.by(() => {
    const raw = ready ? (page.shallow?.url ?? page.url).searchParams.get('step') ?? '' : '';
    return /^[1-6]$/.test(raw) && Number(raw) <= concept.scenes.length ? Number(raw) : 1;
  });
  const scene = $derived(concept.scenes[step - 1]);
  const progress = $derived(zh ? `第 ${step} 步，共 ${concept.scenes.length} 步` : `Step ${step} of ${concept.scenes.length}`);
  const headings: Record<string, Localized> = {
    problem: { zh:'問題', en:'Problem' }, mechanism: { zh:'怎麼運作', en:'Mechanism' },
    observe: { zh:'觀察', en:'Observe' }, boundary: { zh:'適用界線', en:'Boundary' }
  };

  onMount(() => { ready = true; });

  function move(number: number) {
    if (!ready || !Number.isInteger(number) || number < 1 || number > concept.scenes.length || number === step) return;
    const url = new URL(window.location.href);
    url.searchParams.set('step', String(number));
    url.hash = '';
    void goto(url, { shallow: true });
  }
</script>

<ImmersiveShell {lang} {path} title={concept.title[lang]} description={concept.objective[lang]} {step} stepId={scene.id} {ready}
  onprevious={() => move(step - 1)} onnext={() => move(step + 1)}>
  {#snippet breadcrumbs()}
    <nav class="breadcrumbs" aria-label={zh ? '頁面路徑' : 'Breadcrumb'}>
      <a href={localized('/interactive/aase/m02/', lang)}>AASE M02</a>
      <a href={localized(groupPath, lang)}>{chapter.toUpperCase()}</a>
    </nav>
  {/snippet}
  {#snippet rail()}
    <nav class="concept-rail" aria-label={zh ? '本章概念' : 'Concepts in this chapter'}>
      <ol>
        {#each concepts as sibling (sibling.slug)}
          <li><a href={localized(groupPath + sibling.slug + '/', lang)} aria-current={sibling.slug === concept.slug ? 'page' : undefined}>{sibling.title[lang]}</a></li>
        {/each}
      </ol>
    </nav>
  {/snippet}
  {#snippet stage()}
    <div class="concept-stage">
      {#key concept.slug + ':' + scene.id + ':' + replay}
        <LearningStage {concept} slug={concept.slug} {scene} {lang} {ready} fixture={chapter === 'm02-06' ? 'm02-06' : 'm02-04'} />
      {/key}
    </div>
  {/snippet}
  {#snippet controls()}
    {#if ready}
      <div class="concept-controls" role="group" aria-label={zh ? '場景控制' : 'Scene controls'}>
        <button class="secondary" type="button" onclick={() => move(step - 1)} disabled={step === 1}>{zh ? '上一步' : 'Previous'}</button>
        {#if scene.demo || scene.choices}
          <button class="secondary" type="button" onclick={() => { replay++; }}>{zh ? '重設場景' : 'Reset scene'}</button>
        {/if}
        <label><span class="sr-only">{zh ? '前往步驟' : 'Go to step'}</span><select value={step} onchange={event => move(Number(event.currentTarget.value))}>
          {#each concept.scenes as item, index (item.id)}<option value={index + 1}>{index + 1} / {concept.scenes.length}</option>{/each}
        </select></label>
        {#if nextHref && step === concept.scenes.length}
          <a class="next-concept" href={nextHref}>{zh ? '下一概念' : 'Next concept'} →</a>
        {:else}
          <button type="button" onclick={() => move(step + 1)} disabled={step === concept.scenes.length}>{zh ? '下一步' : 'Next'}</button>
        {/if}
      </div>
    {/if}
  {/snippet}
  {#snippet explanation()}
    {#if ready && (page.shallow?.url??page.url).searchParams.has('step') && (page.shallow?.url??page.url).searchParams.get('step')!==String(step)}
      <p role="status">{zh?'此步驟不存在，顯示第一步。':'Unknown step. Showing the first step.'}</p>
    {/if}
    <section class="explanation" aria-labelledby="concept-step-title">
      <div class="lesson-progress">
        <p class="position" role="status">{progress}</p>
        <progress value={step} max={concept.scenes.length} aria-label={progress}></progress>
      </div>
      <h2 id="concept-step-title">{scene.title[lang]}</h2>
      <dl>
        {#each Object.entries(headings) as [key, label]}
          <dt>{label[lang]}</dt><dd>{scene[key as 'problem' | 'mechanism' | 'observe' | 'boundary'][lang]}</dd>
        {/each}
      </dl>
      <a href={sourceHref + '#' + scene.sourceAnchors[0]}>{zh ? '閱讀課文原節' : 'Read source section'}</a>
    </section>
  {/snippet}
  {#snippet reading()}
    <section class="concept-reading">
      <p>{concept.objective[lang]}</p>
      <p>{zh ? '原創教學整合，使用合成、確定性的示例。' : 'Original educational synthesis with deterministic, synthetic examples.'} <a href={sourceHref}>{zh ? '閱讀完整原始課文' : 'Read the complete canonical article'}</a></p>
      {#each concept.scenes as item, index (item.id)}
        <section>
          <h3>{index + 1}. {item.title[lang]}</h3>
          <dl>
            {#each Object.entries(headings) as [key, label]}
              <dt>{label[lang]}</dt><dd>{item[key as 'problem' | 'mechanism' | 'observe' | 'boundary'][lang]}</dd>
            {/each}
          </dl>
          <dl class="reading-values">
            {#each item.cards as card}
              <dt>{card.label[lang]}</dt><dd>{card.value[lang]}</dd>
            {/each}
          </dl>
          {#if item.choices}
            <ul>
              {#each item.choices as choice}
                <li>
                  <strong>{choice.label[lang]}</strong> · {choice.result[lang]}
                  <dl class="reading-values">
                    {#each choice.cards as card}
                      <dt>{card.label[lang]}</dt><dd>{card.value[lang]}</dd>
                    {/each}
                  </dl>
                </li>
              {/each}
            </ul>
          {/if}
          <ul>{#each item.sourceAnchors as anchor}<li><a href={sourceHref + '#' + anchor}>{anchor}</a></li>{/each}</ul>
        </section>
      {/each}
      <section aria-labelledby="aase-interactive-check">
        <h3 id="aase-interactive-check">{zh ? '理解檢查' : 'Knowledge check'}</h3>
        {#if ready}
          <form onsubmit={event => { event.preventDefault(); answered = selected; }}>
            <fieldset>
              <legend>{concept.check.question[lang]}</legend>
              {#each concept.check.options as option, index}
                <label class="check-option"><input type="radio" name="aase-concept-check" value={index} bind:group={selected} onchange={() => { answered = undefined; }} /> {option[lang]}</label>
              {/each}
            </fieldset>
            <button type="submit" disabled={selected === undefined}>{zh ? '檢查答案' : 'Check answer'}</button>
            {#if answered !== undefined}
              <p role="status">{answered === concept.check.answer ? (zh ? '正確。' : 'Correct. ') : (zh ? '再想想。' : 'Try again. ')}{concept.check.feedback[answered][lang]}</p>
            {/if}
          </form>
        {:else}
          <p>{concept.check.question[lang]}</p>
          <ol>{#each concept.check.options as option}<li>{option[lang]}</li>{/each}</ol>
          <details><summary>{zh ? '參考答案' : 'Reference answer'}</summary><p>{concept.check.feedback[concept.check.answer][lang]}</p></details>
        {/if}
      </section>
    </section>
  {/snippet}
</ImmersiveShell>

<style>
  .concept-rail ol { list-style: none; padding: 0; margin: 0; }
  .concept-rail a { display: block; min-height: 44px; padding: .4rem .6rem; border-inline-start: 2px solid var(--line); }
  .concept-rail a[aria-current='page'] { border-inline-start-color: var(--accent); background: var(--soft); font-weight: 650; }
  .concept-stage { display: flex; flex: 1; min-height: 0; }
  .concept-controls { display: flex; flex-wrap: wrap; align-items: center; gap: .45rem; padding: .55rem; }
  .next-concept { padding: .45rem; }
  .explanation { font-size: .91rem; min-height: 0; }
  .explanation h2 { margin: 0 0 .55rem; font-size: 1.35rem; }
  .lesson-progress { display: flex; flex-wrap: wrap; align-items: center; gap: .35rem .7rem; margin-block-end: .35rem; }
  .lesson-progress progress { inline-size: min(6rem, 100%); accent-color: var(--accent); }
  .position { margin: 0; color: var(--accent); font-weight: 650; }
  dt { font-weight: 700; }
  dd { margin: 0 0 .55rem; }
  .reading-values { padding-inline-start: .7rem; border-inline-start: 2px solid var(--line); }
  .check-option { display: block; padding: .25rem; }
  .check-option input { min-height: auto; accent-color: var(--accent); }
</style>
