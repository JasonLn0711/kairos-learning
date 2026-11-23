<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Locale } from '../model.ts';
  import InteractiveFrame from './InteractiveFrame.svelte';

  let { lang, path, title, description, step, stepId, ready, onprevious, onnext,
    breadcrumbs, rail, stage, controls, explanation, reading }: {
    lang: Locale;
    path: string;
    title: string;
    description: string;
    step: number;
    stepId?: string;
    ready: boolean;
    onprevious: () => void;
    onnext: () => void;
    breadcrumbs?: Snippet;
    rail: Snippet;
    stage: Snippet;
    controls: Snippet;
    explanation: Snippet;
    reading: Snippet;
  } = $props();

  const zh = $derived(lang === 'zh');
  let readButton: HTMLButtonElement | undefined = $state();
  let dialog: HTMLDialogElement | undefined = $state();

  function shortcuts(event: KeyboardEvent) {
    if (!ready || dialog?.open || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target;
    if (target instanceof Element && target.closest('a, button, input, select, textarea, summary, [role], [tabindex="0"], [contenteditable]')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      if (event.key === 'ArrowLeft') onprevious();
      else onnext();
    }
  }
</script>

<svelte:window onkeydown={shortcuts} />

<InteractiveFrame {lang} {path} {title} {description} {step} immersive={ready}>
  <main id="main" class="immersive-lesson" class:focus={ready} tabindex="-1">
    <div class="lesson-heading">
      <div class="lesson-title">
        {#if breadcrumbs}{@render breadcrumbs()}{/if}
        <h1>{title}</h1>
        {#if !ready}<p>{description}</p>{/if}
      </div>
      {#if ready}
        <div class="lesson-tools">
          <small>{zh ? '← → 換步' : '← → Change step'}</small>
          <button class="secondary" type="button" bind:this={readButton} onclick={() => dialog?.showModal()}>
            {zh ? '完整解說' : 'Read details'}
          </button>
        </div>
      {/if}
    </div>
    <section class="workspace" data-step={step} data-step-id={stepId} aria-label={zh ? '逐步教材' : 'Step-by-step lesson'}>
      <div class="lesson-rail">{@render rail()}</div>
      <div class="scene-column">
        <div class="scene-body">{@render stage()}</div>
        {@render controls()}
      </div>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (The desktop reading pane needs keyboard scrolling.) -->
      <div class="lesson-explainer" role="region" aria-label={zh ? '步驟說明' : 'Step explanation'} tabindex={ready ? 0 : undefined}>
        {@render explanation()}
      </div>
    </section>

    {#if ready}
      <dialog bind:this={dialog} aria-labelledby="reading-title" onclose={() => readButton?.focus()}>
        <header class="reading-header">
          <h2 id="reading-title">{zh ? '完整解說' : 'Read details'}</h2>
          <button class="secondary" type="button" onclick={() => dialog?.close()}>
            {zh ? '回到示意圖' : 'Return to diagram'}
          </button>
        </header>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex (reading panel needs keyboard scrolling) -->
        <div class="reading-body" role="region" aria-labelledby="reading-title" tabindex="0">{@render reading()}</div>
      </dialog>
    {:else}
      <div class="static-reading">{@render reading()}</div>
    {/if}
  </main>
</InteractiveFrame>

<style>
  .immersive-lesson { margin-inline: auto; width: min(100%, 1600px); padding: .6rem clamp(.7rem, 2vw, 1.8rem) 1rem; overflow-wrap: anywhere; min-inline-size: 0; }
  .lesson-heading { display: flex; align-items: end; justify-content: space-between; gap: .5rem 1rem; margin-bottom: .7rem; }
  h1 { max-width: none; margin: 0; font-size: clamp(1.4rem, 3vw, 2rem); text-wrap: balance; }
  .lesson-title { min-width: 0; }
  .lesson-title :global(.breadcrumbs) { margin-block: 0 .4rem; }
  .lesson-title p { color: var(--muted); margin: .45rem 0; }
  .lesson-tools { display: flex; align-items: center; gap: .65rem; flex: 0 0 auto; }
  .lesson-tools small { color: var(--muted); white-space: nowrap; }
  .workspace { display: grid; grid-template-columns: minmax(10rem, .8fr) minmax(0, 3fr) minmax(14rem, 1.4fr); gap: 1rem; align-items: start; }
  .lesson-explainer { position: relative; }
  .workspace > * { min-width: 0; min-height: 0; }
  .scene-column { border: 1px solid var(--line); border-radius: .5rem; }
  .static-reading { max-width: 75ch; margin: 1.5rem auto; }
  dialog { width: min(56rem, calc(100% - 1rem)); max-block-size: calc(100dvh - 1rem); padding: 0; border: 1px solid var(--line); border-radius: .6rem; background: var(--paper); color: var(--ink); }
  dialog[open] { display: grid; grid-template-rows: auto minmax(0, 1fr); }
  dialog::backdrop { background: rgb(19 33 33 / .55); }
  .reading-header { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; justify-content: space-between; padding: .6rem clamp(.5rem, 3vw, 1.5rem); border-bottom: 1px solid var(--line); }
  .reading-header h2 { margin: 0; font-size: 1.25rem; }
  .reading-body { overflow: auto; scrollbar-gutter: stable; padding: 0 clamp(.5rem, 3vw, 1.5rem) 1rem; }
  @media (min-width: 1120px) and (min-height: 660px) {
    .focus { display: grid; grid-template-rows: auto minmax(0, 1fr); min-height: 0; }
    .focus .workspace { align-items: stretch; }
    .focus .lesson-rail, .focus .lesson-explainer { overflow-y: auto; scrollbar-gutter: stable; }
    .focus .scene-column { display: grid; grid-template-rows: minmax(0, 1fr) auto; }
    .focus .scene-body { min-height: 0; display: flex; flex-direction: column; }
    .focus .scene-body > :global(.interactive-stage) { flex: 1 1 auto; min-height: 0; }
  }
  @media (max-width: 1020px) {
    .workspace { grid-template-columns: minmax(0, 1fr) minmax(14rem, .65fr); }
    .focus .lesson-rail { display: none; }
  }
  @media (max-width: 790px) {
    .workspace { grid-template-columns: minmax(0, 1fr); gap: .8rem; }
    .lesson-heading { flex-wrap: wrap; }
    .lesson-tools small { display: none; }
  }
</style>
