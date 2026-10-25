<script lang="ts">
  import type { SourceBlock } from '$lib/concepts';
  import AccessDiagram from './AccessDiagram.svelte';
  import InlineText from './InlineText.svelte';
  let { blocks }: {blocks: SourceBlock[]} = $props();
</script>
<div class="source-body">
  {#each blocks as block}
    {#if block.kind === 'accessDiagram'}<AccessDiagram texts={block.texts} src={block.src} />
    {:else if block.kind === 'heading'}<h2 id={block.id}><InlineText text={block.text} /></h2>
    {:else if block.kind === 'paragraph'}<p><InlineText text={block.text} /></p>
    {:else if block.kind === 'code'}<pre><code>{block.text}</code></pre>
    {:else if block.kind === 'list'}<ul>{#each block.items as item}<li><InlineText text={item} /></li>{/each}</ul>
    {:else if block.kind === 'table'}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable tables need keyboard access.) -->
      <div class="table-scroll" role="region" aria-label={block.headers.join('、')} tabindex="0"><table><thead><tr>{#each block.headers as header}<th scope="col">{header}</th>{/each}</tr></thead><tbody>{#each block.rows as row}<tr>{#each row as cell}<td><InlineText text={cell} /></td>{/each}</tr>{/each}</tbody></table></div>
    {/if}
  {/each}
</div>
<style>
  .table-scroll{max-width:100%;overflow-x:auto;margin:1.5rem 0}
  table{border-collapse:collapse;width:100%;font-size:.9rem;line-height:1.65}
  th,td{text-align:left;vertical-align:top;border-bottom:1px solid var(--line);padding:.65rem;min-width:7rem}
  th{background:var(--soft)}
  @media print{.table-scroll{overflow:visible}th,td{min-width:0}}
</style>
