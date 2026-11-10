<script lang="ts">
 import type {SourceBlock} from '$lib/concepts';
 let {block}:{block:Extract<SourceBlock,{kind:'visual'}>}=$props();
 const flow=$derived(block.visual.kind==='flow');
</script>
<figure data-remediation-diagram={flow?'workflow':'status'}>
 <figcaption><strong>{block.visual.caption}</strong><p>{block.visual.description}</p></figcaption>
 {#if flow}
  <ol>{#each block.visual.items as item,i}<li><strong>{item.title}</strong><p>{item.body}</p>{#if i<block.visual.items.length-1}<span class="arrow" aria-hidden="true">↓</span>{/if}</li>{/each}</ol>
 {:else}
  <ul>{#each block.visual.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
 {/if}
 <a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:var(--soft);min-width:0;overflow-wrap:anywhere}
figcaption>strong{font-size:1.125rem}p,strong,a{font-size:1rem;line-height:1.8}p{margin:.5rem 0 0;overflow-wrap:anywhere}figcaption p{margin-bottom:1rem}
ul,ol{list-style:none;margin:0 0 1rem;padding:0;display:grid;gap:1.5rem}ul{grid-template-columns:repeat(3,minmax(0,1fr))}li{position:relative;min-width:0;padding:1rem;background:var(--paper);border:1px solid #47748e;border-radius:.6rem;overflow-wrap:anywhere}.arrow{position:absolute;bottom:-1.5rem;left:1rem;font-size:1rem;line-height:1.5rem;color:var(--ink)}
a{display:inline-block}
@container(max-width:38rem){ul{grid-template-columns:1fr}li{padding:.8rem}}
</style>
