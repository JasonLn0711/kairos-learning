<script lang="ts">
  import { localized } from '#lib/model.ts';
  import type { Locale, Localized } from '../model.ts';
  import InteractiveFrame from './InteractiveFrame.svelte';
  type Group = { id: string; title: string; summary: string; objectives: string[]; href: string; sourceHref: string;
    concepts: { slug: string; title: Localized; objective: Localized; href: string }[] };
  let { lang, groups, selected }: { lang: Locale; groups: Group[]; selected?: string } = $props();
  const zh = $derived(lang === 'zh');
  const root = '/interactive/aase/m02/';
  const group = $derived(groups.find(item => item.id === selected));
  const path = $derived(group ? root + group.id + '/' : root);
  const title = $derived(group ? group.title : zh ? 'AASE M02 互動概念圖譜' : 'AASE M02 interactive atlas');
  const description = $derived(group?.summary ?? (zh
    ? '從模型如何處理文字，一路追蹤到工具怎麼執行、在哪裡停下，以及用什麼證據驗收。'
    : 'Trace how a model handles text, then follow how tools run, where they stop, and what evidence supports acceptance.'));
</script>

<InteractiveFrame {lang} {path} {title} {description}>
  <main class="atlas" id="main" tabindex="-1">
    <nav class="breadcrumbs" aria-label={zh ? '頁面路徑' : 'Breadcrumb'}>
      <a href={localized('/interactive/', lang)}>{zh ? '互動學習' : 'Interactive learning'}</a>
      {#if group}<a href={localized(root, lang)}>AASE M02</a>{/if}
    </nav>
    <h1>{title}</h1>
    <p class="intro">{description}</p>
    {#if group}
      <p>{zh ? '先備閱讀' : 'Prerequisite'} · <a href={group.sourceHref}>{zh ? '原始 AASE 課文及學習目標' : 'Canonical article and learning objectives'}</a></p>
      <ul>{#each group.objectives as objective}<li>{objective}</li>{/each}</ul>
    {:else if groups.length}
      <p><a href={localized('/courses/aase/v1/m02/', lang)}>{zh ? '閱讀原始 AASE M02 課綱' : 'Read the canonical AASE M02 curriculum'}</a></p>
    {:else}
      <p>{zh ? '目前沒有已發布的互動概念。' : 'There are no published interactive concepts yet.'}</p>
    {/if}
    {#each group ? [group] : groups as section (section.id)}
      <section class="group">
        {#if !group}
          <h2><a href={section.href}>{section.title}</a></h2>
          <p>{section.summary}</p>
        {/if}
        <ol>
          {#each section.concepts as concept (concept.slug)}
            <li><a href={concept.href}>{concept.title[lang]}</a><p>{concept.objective[lang]}</p></li>
          {/each}
        </ol>
      </section>
    {/each}
  </main>
</InteractiveFrame>

<style>
  .atlas { max-inline-size: 72rem; padding: 1rem clamp(1rem,4vw,3rem) 3rem; overflow-wrap: anywhere; }
  h1 { max-inline-size: none; }
  .intro { max-inline-size: 58ch; }
  .group { border-block-start: 1px solid var(--line); margin-block: 2rem; padding-block-start: .6rem; }
  h2 { margin: .65rem 0; }
  ol { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(14rem,100%),1fr)); gap: .75rem; padding-inline-start: 1.6rem; }
  li { padding: .55rem .75rem; background: var(--soft); }
  li a { font-weight: 700; }
  li p { margin: .2rem 0; }
</style>
