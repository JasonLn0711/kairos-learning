<script lang="ts">
  import type { Card, TeachingScene } from '../aase/model.ts';
  import type { Locale } from '../model.ts';

  let { scene, cards, lang }: { scene: TeachingScene; cards: Card[]; lang: Locale } = $props();
  const zh = $derived(lang === 'zh');
  const positions = [1, 2, 3];
  const supportLocations = [[50, 50], [250, 50], [50, 150], [250, 150], [50, 250], [250, 250]];

  const coordinates = $derived.by(() => {
    if (scene.kind !== 'vector-inspector' || cards.length !== 5 || cards[0].label.en !== 'ID') return [];
    return cards.slice(1).every((card, index) => card.label.en === 'Dimension ' + (index + 1) &&
      /^[+-]?\d+(?:\.\d+)?$/u.test(card.value[lang]) && Number.isFinite(Number(card.value[lang])))
      ? cards.slice(1)
      : [];
  });
  const coordinateExtent = $derived(Math.max(1, ...coordinates.map(card => Math.abs(Number(card.value[lang])))));

  function tokens(card: Card) {
    const value = card.value[lang];
    if (/\s+[·→]\s+/u.test(value)) return value.split(/\s+[·→]\s+/u);
    if (!['Same pieces', 'Known prefix', 'Next prefix', 'Previous prefix'].includes(card.label.en)) return [];
    return value.split(/,\s+|、/u);
  }
</script>

<div class="diagram" data-scene-view={scene.visual ?? scene.kind}>
  {#if scene.visual === 'causal-mask'}
    <table class="causal-mask">
      <caption>{zh ? '因果遮罩範例' : 'Illustrative causal mask'}</caption>
      <thead>
        <tr>
          <th scope="col">{zh ? '查詢／鍵' : 'Query / key'}</th>
          {#each positions as key}<th scope="col">{key}</th>{/each}
        </tr>
      </thead>
      <tbody>
        {#each positions as query}
          <tr>
            <th scope="row">{cards[query - 1].label[lang]}</th>
            {#each positions as key}
              <td data-visible-key={key <= query}>
                <span aria-hidden="true">{key <= query ? '✓' : '—'}</span>
                <span class="sr-only">{key <= query ? (zh ? '可見' : 'Visible') : (zh ? '遮蔽' : 'Masked')}</span>
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    <p class="legend">{zh ? '✓ 可見，— 遮蔽。查詢只能看見自己與先前的位置。' : '✓ Visible, — Masked. Each query can see its own position and earlier positions.'}</p>
  {:else if scene.visual === 'support-network'}
    <p class="legend">{zh ? '六個平行的支援面向共同協助模型。連線表示支援關係。' : 'Six parallel functions support the model. Lines indicate those support relationships.'}</p>
    <div class="support-figure">
      <svg viewBox="0 0 300 300" preserveAspectRatio="none" role="img" aria-labelledby="support-title support-desc">
        <title id="support-title">{scene.title[lang]}</title>
        <desc id="support-desc">{zh ? '六個支援面向與中央模型相連，沒有指定流程順序。' : 'Six supporting functions connect to the central model. Each connection represents support without a sequence.'}</desc>
        {#each supportLocations as [x, y]}
          <line x1="150" y1="150" x2={x} y2={y} vector-effect="non-scaling-stroke" />
        {/each}
      </svg>
      <dl class="support-network">
        {#each cards as card, index}
          <div data-support-position={index}>
            <dt>{card.label[lang]}</dt>
            <dd>{card.value[lang]}</dd>
          </div>
        {/each}
      </dl>
    </div>
  {:else if coordinates.length}
    <dl class="vector">
      <div class="vector-id"><dt>{cards[0].label[lang]}</dt><dd>{cards[0].value[lang]}</dd></div>
      {#each coordinates as card}
        {@const value = Number(card.value[lang])}
        <div class="coordinate-row">
          <dt>{card.label[lang]}</dt>
          <dd>
            <span class="track" aria-hidden="true"><span class:negative={value < 0} style:inline-size={50 * Math.abs(value) / coordinateExtent + '%'}></span></span>
            <span class="coordinate">{card.value[lang]}</span>
          </dd>
        </div>
      {/each}
    </dl>
  {:else if scene.kind === 'attention-matrix'}
    <table class="attention">
      <caption>{zh ? '這個查詢的注意力資料' : 'Attention inputs and outputs for this query'}</caption>
      <thead><tr><th scope="col">{zh ? '項目' : 'Item'}</th><th scope="col">{zh ? '數值與狀態' : 'Value and state'}</th></tr></thead>
      <tbody>
        {#each cards as card}<tr><th scope="row">{card.label[lang]}</th><td>{card.value[lang]}</td></tr>{/each}
      </tbody>
    </table>
  {:else if scene.kind === 'comparison' || scene.kind === 'evidence-check'}
    <dl class="ledger" data-family={scene.kind}>
      {#each cards as card}
        <div><dt>{card.label[lang]}</dt><dd>{card.value[lang]}</dd></div>
      {/each}
    </dl>
  {:else if scene.kind === 'document-retrieval'}
    <dl class="sources-grid">
      {#each cards as card}
        <div><dt>{card.label[lang]}</dt><dd>{card.value[lang]}</dd></div>
      {/each}
    </dl>
  {:else if scene.kind === 'timeline-trace' || scene.kind === 'trust-boundary'}
    <dl class="observations" data-family={scene.kind}>
      {#each cards as card}
        <div><dt>{card.label[lang]}</dt><dd>{card.value[lang]}</dd></div>
      {/each}
    </dl>
  {:else}
    <dl class="cards" data-card-layout={scene.kind}>
      {#each cards as card}
        {@const pieces = scene.kind === 'token-stream' ? tokens(card) : []}
        <div>
          <dt>{card.label[lang]}</dt>
          {#if pieces.length > 1}
            <dd><ol class="tokens" role="list">{#each pieces as piece}<li>{piece}</li>{/each}</ol></dd>
          {:else}
            <dd>{card.value[lang]}</dd>
          {/if}
        </div>
      {/each}
    </dl>
  {/if}
</div>

<style>
  .ledger,.observations,.sources-grid { margin:0; min-inline-size:0; }
  .ledger { border-block:2px solid var(--accent); background:var(--paper); }
  .ledger > div { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,2fr); }
  .ledger > div + div { border-block-start:1px solid var(--line); }
  .ledger :is(dt,dd) { margin:0; padding:.48rem .65rem; overflow-wrap:anywhere; }
  .ledger dt { border-inline-end:1px solid var(--line); }
  .ledger[data-family='evidence-check'] dt { color:var(--ink); border-inline-start:4px double var(--accent); }
  .sources-grid {display:grid;grid-template-columns:repeat(auto-fit,minmax(min(10rem,100%),1fr));gap:.7rem}
  .sources-grid > div {position:relative;border:1px solid var(--line);padding:.65rem .8rem;background:var(--paper);box-shadow:2px 3px 0 var(--line);overflow-wrap:anywhere}
  .sources-grid dt {padding-inline-end:1rem;border-block-end:1px solid var(--line);padding-block-end:.3rem}
  .sources-grid > div::after {content:'';position:absolute;inset:.28rem .28rem auto auto;border-inline-end:2px solid var(--accent);border-block-start:2px solid var(--accent);inline-size:.6rem;block-size:.6rem}
  .observations {display:grid;gap:.45rem}
  .observations > div {position:relative;border-inline-start:2px solid var(--accent);padding:.35rem .8rem;background:var(--paper);overflow-wrap:anywhere}
  .observations[data-family='timeline-trace'] > div::before {content:'';position:absolute;inset-inline-start:-.32rem;inset-block-start:.65rem;inline-size:.5rem;block-size:.5rem;border-radius:50%;background:var(--accent)}
  .observations[data-family='trust-boundary'] > div {border:1px dashed var(--muted);border-inline-start:4px solid var(--accent)}
  @container (max-width:21rem) { .ledger > div {grid-template-columns:1fr} .ledger dt{border-inline-end:0;padding-block-end:0} }
  .diagram { display: grid; gap: .55rem; min-inline-size: 0; container-type: inline-size; }
  .cards, .support-network { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(11rem, 100%), 1fr)); gap: .55rem; margin: 0; }
  .cards > div, .support-network > div { min-inline-size: 0; min-block-size: 0; overflow-wrap: anywhere; border: 1px solid var(--line); background: var(--paper); border-radius: .35rem; padding: .55rem .7rem; }
  dt { color: var(--accent); font-weight: 680; }
  dd { margin: .15rem 0 0; }
  .legend { margin: 0; line-height: 1.5; color: var(--muted); }
  .cards[data-card-layout='token-stream'] > div, .cards[data-card-layout='vector-inspector'] > div { border-inline-start: 4px solid var(--accent); }
  .cards[data-card-layout='evidence-check'] > div, .cards[data-card-layout='timeline-trace'] > div { border-block-start: 4px solid var(--muted); }
  .cards[data-card-layout='trust-boundary'] > div { border-inline-start: 4px solid var(--ink); }
  .cards[data-card-layout='document-retrieval'] > div { border-block-start: 4px solid var(--accent); }
  .coordinate { font-variant-numeric: tabular-nums; }
  .tokens { list-style: none; display: flex; flex-wrap: wrap; gap: .28rem; margin: 0; padding: 0; }
  .tokens li { margin: 0; padding: .12rem .38rem; color: var(--ink); border: 1px solid var(--line); border-radius: .25rem; background: var(--soft); }
  .vector { display: grid; gap: 1px; margin: 0; padding: 1px; background: var(--line); border-radius: .35rem; }
  .vector > div { background: var(--paper); padding: .28rem .55rem; }
  .vector-id { display: flex; align-items: baseline; gap: .5rem; }
  .coordinate-row { display: grid; grid-template-columns: minmax(0, 8rem) minmax(4ch, 1fr); gap: .4rem; }
  .coordinate-row dd { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: .65rem; margin: 0; }
  .coordinate { min-inline-size: 4ch; text-align: end; overflow-wrap: anywhere; }
  .track { position: relative; display: block; block-size: .6rem; background: var(--soft); border-radius: .15rem; }
  .track::before { content: ''; position: absolute; inset-block: 0; inset-inline-start: 50%; border-inline-start: 1px solid var(--muted); }
  .track > span { display: block; position: absolute; inset-block: 0; inset-inline-start: 50%; background: var(--accent); border-block: 1px solid var(--accent); }
  .track > .negative { inset-inline-start: auto; inset-inline-end: 50%; background: var(--muted); border-color: var(--muted); }
  table { width: 100%; table-layout: fixed; border-collapse: collapse; background: var(--paper); }
  caption { text-align: start; color: var(--accent); font-weight: 700; }
  th, td { border: 1px solid var(--line); padding: .24rem .4rem; overflow-wrap: anywhere; }
  .causal-mask th:first-child { inline-size: 34%; }
  .causal-mask th, .causal-mask td { text-align: center; font-variant-numeric: tabular-nums; }
  .causal-mask [data-visible-key='true'] { color: var(--accent); font-weight: 700; }
  .causal-mask [data-visible-key='false'] { background: var(--soft); color: var(--ink); }
  .attention th:first-child { width: 30%; text-align: start; }
  .attention thead { background: var(--soft); }
  .support-figure { position: relative; isolation: isolate; }
  .support-network > div { padding: .4rem .58rem; line-height: 1.5; }
  .support-network dt, .support-network dd { line-height: inherit; }
  .support-figure svg { display: none; }
  .support-network [data-support-position='0'] { grid-column: 1 / -1; justify-self: center; text-align: center; border: 2px solid var(--accent); }
  @container (min-width: 31rem) {
    .support-network { grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-areas: 'a . b' 'c model d' 'e . f'; row-gap: .18rem; }
    .support-network [data-support-position='0'] { grid-area: model; justify-self: stretch; align-self: center; }
    .support-network [data-support-position='1'] { grid-area: a; }
    .support-network [data-support-position='2'] { grid-area: b; }
    .support-network [data-support-position='3'] { grid-area: c; }
    .support-network [data-support-position='4'] { grid-area: d; }
    .support-network [data-support-position='5'] { grid-area: e; }
    .support-network [data-support-position='6'] { grid-area: f; }
    .support-figure svg { display: block; position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; stroke: var(--accent); stroke-width: 1.5; }
  }
</style>
