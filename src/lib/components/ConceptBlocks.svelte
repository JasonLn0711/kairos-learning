<script lang="ts">
  import type { ConceptBlock } from '$lib/concepts';
  import InlineText from './InlineText.svelte';
  let { blocks }: {blocks:ConceptBlock[]} = $props();
</script>
{#each blocks as block}
  {#if block.kind === 'table'}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable tables need keyboard access.) -->
    <div class="table-scroll" role="region" aria-label={block.caption} tabindex="0"><table><caption>{block.caption}</caption><thead><tr>{#each block.headers as header}<th scope="col">{header}</th>{/each}</tr></thead><tbody>{#each block.rows as row}<tr>{#each row as cell}<td><InlineText text={cell} /></td>{/each}</tr>{/each}</tbody></table></div>
  {:else if block.kind === 'details'}
    <details class="concept-detail"><summary>{block.heading}</summary>{#each block.paragraphs as p}<p><InlineText text={p} /></p>{/each}</details>
  {:else}
    <section><h3 id={block.id}>{block.heading}</h3>{#each block.paragraphs as p}<p><InlineText text={p} /></p>{/each}{#if block.code}<pre><code>{block.code}</code></pre>{/if}</section>
  {/if}
{/each}
<style>
  .table-scroll{max-width:100%;overflow-x:auto;margin:1.5rem 0}
  table{border-collapse:collapse;width:100%;font-size:.9rem;line-height:1.65}
  caption{text-align:left;font-weight:650;margin-bottom:.6rem}
  th,td{text-align:left;vertical-align:top;border-bottom:1px solid var(--line);padding:.65rem;min-width:7rem}
  th{background:var(--soft)}
  .concept-detail{border:1px solid var(--line);padding:1rem;margin:1.5rem 0;border-radius:4px}
  summary{font-weight:600;cursor:pointer;line-height:1.6}
  @media print{.table-scroll{overflow:visible}th,td{min-width:0}}
</style>
