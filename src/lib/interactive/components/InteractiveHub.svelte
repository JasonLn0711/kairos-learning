<script lang="ts">
  import { localized } from '#lib/model.ts';
  import type { InteractiveSummary, Locale } from '../model.ts';
  import InteractiveFrame from './InteractiveFrame.svelte';

  let { lang, lessons, chapters }: { lang: Locale; lessons: InteractiveSummary[]; chapters: {id:string;href:string;title:string}[] } = $props();
  const zh = $derived(lang === 'zh');
  const heading = $derived(zh ? '互動學習' : 'Interactive learning');
  const description = $derived(zh ? '沿著圖解看系統怎麼運作，改變條件，比較結果。' : 'Follow a system diagram, change a condition, and compare what happens.');
</script>

<InteractiveFrame {lang} path="/interactive/" title={heading} {description}>
  <main id="main" class="hub" data-theme="interactive-atlas" tabindex="-1">
    <nav class="breadcrumbs" aria-label={zh ? '所在位置' : 'Breadcrumb'}>
      <a href={localized('/', lang)}>{zh ? '課程' : 'Courses'}</a><span aria-current="page">{heading}</span>
    </nav>
    <h1>{heading}</h1>
    <p class="intro">{description}</p>
    {#if chapters.length}
      <section class="m02-discovery" id="aase">
        <h2>{zh?'AASE M02 章節圖解':'AASE M02 chapter diagrams'}</h2>
        <ul>{#each chapters as chapter}<li><a href={chapter.href}>{chapter.id.toUpperCase()} · {chapter.title}</a></li>{/each}</ul>
      </section>
    {/if}
    {#each lessons as lesson (lesson.id)}
      <article class="feature">
        <div class="feature-copy">
          <h2><a href={lesson.href[lang]}>{lesson.title[lang]}</a></h2>
          <p>{lesson.summary[lang]}</p>
          <a class="action" href={lesson.href[lang]}>{zh ? '開始這一課' : 'Start the lesson'}</a>
          <p class="count">{zh ? `${lesson.stepCount} 個步驟，可隨時回查` : `${lesson.stepCount} steps you can revisit`}</p>
        </div>
        <svg class="atlas" viewBox="0 0 510 300" aria-hidden="true">
          <defs>
            <pattern id={'atlas-grid-' + lesson.id} width="32" height="18" patternUnits="userSpaceOnUse">
              <path d="M0 9 16 0 32 9 16 18Z" fill="none" class="grid-line"/>
            </pattern>
          </defs>
          <path d="M0 0h510v300H0z" fill={'url(#atlas-grid-' + lesson.id + ')'} />
          <path class="track" d="M82 195 195 132 252 163 396 81" />
          <path class="track branch" d="M195 132 143 104 226 57" />
          <path class="platform" d="m53 196 29-17 30 17-30 17z m105-64 37-21 36 21-36 21z m56 31 38-21 37 21-37 22z m145-82 37-21 36 21-36 21z m-164-24 31-18 32 18-32 18z" />
          <path class="solid" d="M63 184v-20l19-11 19 11v20l-19 11z m113-66V90l19-11 19 11v28l-19 11z m57 34v-28l19-11 19 11v28l-19 11z m144-78V46l19-11 19 11v28l-19 11z m-164-24V27l13-7 13 7v23l-13 7z" />
          <path class="crease" d="m63 164 19 11 19-11m-19 11v20m94-105 19 11 19-11m-19 11v28m38-5 19 11 19-11m-19 11v28m125-117 19 11 19-11m-19 11v28M213 27l13 8 13-8m-13 8v22" />
          <circle class="signal" cx="321" cy="124" r="7" />
        </svg>
      </article>
    {:else}
      <p>{zh ? '目前尚無可開始的互動教材。' : 'Interactive lessons will appear here when available.'}</p>
    {/each}
    <section class="method">
      <h2>{zh ? '怎麼學' : 'How it works'}</h2>
      <p>{zh ? '每一步先提出一個問題，再用同一張圖追蹤路徑。你可以暫停、重播，或切換條件，觀察哪些事改變。每課也提供可直接閱讀的逐步文字。' : 'Each step poses a question and traces a path across the same diagram. Pause, replay, or switch conditions to see what changes. A written walkthrough accompanies the scene.'}</p>
      <p><a href={localized('/courses/networking/', lang)}>{zh ? '延伸閱讀網路基礎' : 'Read the networking course'}</a></p>
    </section>
  </main>
</InteractiveFrame>

<style>
  /* Hallmark v2.0.0 | custom CS Kairos technical editorial | signature: physical request map */
  /* The diagram and the single lesson action carry the page. */
  [data-theme='interactive-atlas'] {
    --atlas-paper: #edf2e8;
    --atlas-grid: #d3dfd1;
    --atlas-side: #bdd1bf;
    --atlas-track: #6e897e;
    --atlas-signal: #ad492e;
  }
  .hub {
    width: min(100%, 1120px);
    margin-inline: auto;
    padding: clamp(1.4rem, 4vw, 3.4rem) clamp(1rem, 4vw, 2.6rem) 4rem;
  }
  .breadcrumbs { align-items: baseline; margin-bottom: 1rem; }
  .breadcrumbs [aria-current]::before { content: ' / '; margin-right: .55rem; color: var(--muted); }
  .hub h1 { margin: .3rem 0 .55rem; font-size: clamp(2.45rem, 6vw, 4.4rem); max-width: 24ch; text-wrap: balance; }
  .m02-discovery { border-block: 1px solid var(--line); margin-block: 1rem; }
  .m02-discovery h2 { margin: .75rem 0 0; }
  .intro { margin: 0 0 2rem; max-width: 62ch; color: var(--muted); font-size: 1.08rem; }
  .feature {
    background: var(--atlas-paper);
    border: 1px solid var(--line);
    border-radius: .6rem;
    display: grid;
    grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr);
    align-items: stretch;
    overflow: clip;
  }
  .feature-copy { padding: clamp(1.15rem, 4vw, 2.45rem); }
  .feature h2 { font-size: clamp(1.55rem, 3vw, 2.45rem); margin: 0; max-width: 22ch; }
  .feature h2 a { color: var(--ink); text-decoration: none; }
  .feature h2 a:hover { text-decoration: underline; }
  .action { display: inline-flex; min-height: 44px; align-items: center; background: var(--accent); color: var(--paper); border-radius: .3rem; padding: .32rem .9rem; text-decoration: none; font-weight: 650; }
  .action:hover { color: var(--paper); text-decoration: underline; }
  .feature a:focus-visible { outline-color: var(--accent); }
  .feature a:active { filter: brightness(.85); }
  .count { margin-bottom: 0; font-size: .84rem; color: var(--muted); font-variant-numeric: tabular-nums; }
  .atlas { width: 100%; height: 100%; min-width: 0; align-self: stretch; display: block; }
  .grid-line { stroke: var(--atlas-grid); }
  .track { stroke: var(--atlas-track); fill: none; stroke-width: 2; }
  .branch { stroke-dasharray: 6 6; }
  .platform { fill: var(--atlas-side); stroke: var(--atlas-track); }
  .solid { fill: var(--paper); stroke: var(--accent); stroke-width: 1.5; }
  .crease { fill: none; stroke: var(--accent); }
  .signal { fill: var(--atlas-signal); stroke: var(--paper); stroke-width: 2; }
  .method { max-width: 67ch; margin-top: 2rem; }
  .method h2 { margin: 0; }
  @media (max-width: 680px) {
    .feature { grid-template-columns: minmax(0, 1fr); }
    .atlas { height: auto; max-height: 15rem; }
  }
</style>
