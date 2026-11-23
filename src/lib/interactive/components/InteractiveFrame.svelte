<script lang="ts">
  import type { Snippet } from 'svelte';
  import { MAIN, SITE, localized } from '#lib/model.ts';
  import type { Locale } from '../model.ts';

  let { lang, path, title, description, step, immersive = false, children }: {
    lang: Locale;
    path: string;
    title: string;
    description: string;
    step?: number;
    immersive?: boolean;
    children: Snippet;
  } = $props();
  const zh = $derived(lang === 'zh');
  const localePath = $derived(localized(path, lang));
  const alternate = $derived(localized(path, zh ? 'en' : 'zh'));
  const switchPath = $derived(step && step > 1 ? alternate + '?step=' + step : alternate);
</script>

<svelte:head>
  <title>{title} | CS Kairos Learn</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={SITE + localePath} />
  <link rel="alternate" hreflang="zh-Hant" href={SITE + path} />
  <link rel="alternate" hreflang="en" href={SITE + localized(path, 'en')} />
  <link rel="alternate" hreflang="x-default" href={SITE + path} />
  <meta property="og:type" content={step ? 'article' : 'website'} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={SITE + localePath} />
</svelte:head>

<a class="skip" href="#main">{zh ? '跳至主要內容' : 'Skip to content'}</a>
<div class="interactive-frame" class:immersive>
<header class="site-header">
  <a class="brand" href={localized('/', lang)}>
    <span class="mark" aria-hidden="true">K</span><span>CS Kairos <em>Learn</em></span>
  </a>
  <nav aria-label={zh ? '主要導覽' : 'Main navigation'}>
    <a href={localized('/', lang)}>{zh ? '課程' : 'Courses'}</a>
    <a href={localized('/interactive/', lang)} aria-current={path === '/interactive/' ? 'page' : undefined}>{zh ? '互動學習' : 'Interactive learning'}</a>
    <a href={localized('/search/', lang)}>{zh ? '搜尋' : 'Search'}</a>
    <a class="language" data-sveltekit-reload href={switchPath} lang={zh ? 'en' : 'zh-Hant'} hreflang={zh ? 'en' : 'zh-Hant'}>{zh ? 'English' : '繁體中文'}</a>
  </nav>
</header>
{@render children()}
{#if !immersive}
<footer>
  <p><a href={MAIN}>CS Kairos</a></p>
  <nav aria-label={zh ? '頁尾導覽' : 'Footer navigation'}>
    <a href={localized('/', lang)}>{zh ? '返回課程' : 'Back to courses'}</a>
    <a href={localized('/standards/', lang)}>{zh ? '內容原則' : 'Content principles'}</a>
  </nav>
</footer>
{/if}
</div>

<style>
  .immersive > .site-header { max-width: none; margin: 0; padding: .3rem clamp(.75rem, 2vw, 2rem); gap: .75rem; }
  @media (min-width: 1120px) and (min-height: 660px) {
    .immersive { block-size: 100vh; block-size: 100dvh; min-block-size: 42rem; display: grid; grid-template-rows: auto minmax(0, 1fr); }
  }
  .site-header nav [aria-current='page'] { color: var(--accent); font-weight: 700; }
</style>
