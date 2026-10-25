<script lang="ts">
  import type { ConceptBlock } from '$lib/concepts';
  import InlineText from './InlineText.svelte';
  let { blocks }: {blocks:ConceptBlock[]} = $props();
</script>
{#each blocks as block}
  {#if block.kind === 'flow' || block.kind === 'cards'}
    <figure class:flow={block.kind==='flow'} class:cards={block.kind==='cards'}>
      <figcaption><strong>{block.caption}</strong><p>{block.description}</p></figcaption>
      {#if block.kind==='flow'}
        <ol>{#each block.items as item,i}<li><span class="step-number" aria-hidden="true">{i+1}</span><div><strong>{item.title}</strong><p>{item.body}</p></div></li>{/each}</ol>
      {:else}
        <ul>{#each block.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
      {/if}
    </figure>
  {:else if block.kind === 'table'}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable tables need keyboard access.) -->
    <div class="table-scroll" role="region" aria-label={block.caption} tabindex="0"><table><caption>{block.caption}</caption><thead><tr>{#each block.headers as header}<th scope="col">{header}</th>{/each}</tr></thead><tbody>{#each block.rows as row}<tr>{#each row as cell}<td><InlineText text={cell} /></td>{/each}</tr>{/each}</tbody></table></div>
  {:else if block.kind === 'details'}
    <section class="concept-detail"><h4>{block.heading}</h4>{#each block.paragraphs as p}<p><InlineText text={p} /></p>{/each}</section>
  {:else if block.kind === 'step'}
    <section><h3 id={block.id}>{block.heading}</h3>{#each block.paragraphs as p}<p><InlineText text={p} /></p>{/each}{#if block.code}<pre><code>{block.code}</code></pre>{/if}</section>
  {/if}
{/each}
<style>
  figure{margin:1.5rem 0;padding:1.25rem;background:var(--soft);border:1px solid var(--line);border-radius:6px}
  figcaption>strong{font-size:1.1rem;color:var(--ink)}
  figcaption p{font-size:.9rem;line-height:1.7;margin:.5rem 0 1rem}
  figure ol,figure ul{list-style:none;padding:0;margin:0}
  figure li{margin:0;padding:1rem;background:var(--paper);border:1px solid var(--line);border-radius:4px;min-width:0}
  figure li p{font-size:.9rem;line-height:1.7;margin:.4rem 0 0;overflow-wrap:anywhere}
  .flow ol{display:grid;gap:.65rem}
  .flow li{display:flex;gap:.85rem;align-items:flex-start;border-left:3px solid var(--accent)}
  .step-number{flex:none;display:grid;place-items:center;width:1.75rem;height:1.75rem;border-radius:50%;background:var(--accent);color:white;font-size:.8rem;font-weight:700}
  .cards ul{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem}
  @media(max-width:540px){figure{padding:.8rem}.cards ul{grid-template-columns:1fr}}

  .table-scroll{max-width:100%;overflow-x:auto;margin:1.5rem 0}
  table{border-collapse:collapse;width:100%;font-size:.9rem;line-height:1.65}
  caption{text-align:left;font-weight:650;margin-bottom:.6rem}
  th,td{text-align:left;vertical-align:top;border-bottom:1px solid var(--line);padding:.65rem;min-width:7rem}
  th{background:var(--soft)}
  .concept-detail{border:1px solid var(--line);padding:1rem;margin:1.5rem 0;border-radius:4px}
  h4{font-weight:600;line-height:1.6}
  @media print{.table-scroll{overflow:visible}th,td{min-width:0}}
</style>
