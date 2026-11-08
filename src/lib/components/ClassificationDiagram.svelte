<script lang="ts">
  import type {SourceBlock} from '$lib/concepts';
  let {block}:{block:Extract<SourceBlock,{kind:'visual'}>}=$props();
  const name=$derived(block.src.split('/').at(-1)!.split('-')[2]);
</script>
<figure data-classification-diagram={name} class:targets={name==='targets'} class:methods={name==='methods'} class:evidence={name==='evidence'}>
  <figcaption><strong>{block.visual.caption}</strong><p>{block.visual.description}</p></figcaption>
  {#if name==='evidence'}
    <ol>{#each block.visual.items as item,i}<li><span class="number" aria-hidden="true">{i+1}</span><div><strong>{item.title}</strong><p>{item.body}</p></div></li>{/each}</ol>
  {:else}
    <ul>{#each block.visual.items as item}<li><strong>{item.title}</strong>{#each item.body.split('\n\n') as paragraph}<p>{paragraph}</p>{/each}</li>{/each}</ul>
  {/if}
  <a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:var(--soft);min-width:0;overflow-wrap:anywhere}
figcaption>strong{font-size:1.125rem}p{font-size:1rem;line-height:1.8;margin:.5rem 0 0;overflow-wrap:anywhere}figcaption p{margin-bottom:1rem}
ul,ol{list-style:none;margin:0 0 1rem;padding:0;display:grid;gap:1rem}li{min-width:0;padding:1rem;background:var(--paper);border:1px solid #47748e;border-radius:.6rem;overflow-wrap:anywhere}strong{font-size:1rem;line-height:1.8}
.methods ul,.targets ul{grid-template-columns:repeat(2,minmax(0,1fr))}.targets li{position:relative}.targets li:first-child{grid-column:1/-1;background:#dbeafe}.targets li:nth-child(2){background:#e9d5ff}.targets li:nth-child(3){background:#d1fae5}.targets li:nth-child(4){background:#fef3c7}.targets li:nth-child(5){background:#ffe4e6}
.targets li:not(:first-child)::before{content:'';position:absolute;width:2px;height:1rem;background:#47748e;top:calc(-1rem - 1px);left:50%}
.evidence li{position:relative;display:flex;gap:1rem}.evidence li:not(:last-child)::after{content:'↓';position:absolute;bottom:-1.2rem;left:1.45rem;color:var(--ink);background:var(--soft);font-size:1rem;line-height:1rem}.number{flex:none;font-weight:700;font-size:1rem;line-height:1.8}.evidence li>div{min-width:0}
a{display:inline-block;line-height:1.8}
@container(max-width:32rem){.methods ul,.targets ul{grid-template-columns:1fr}.targets li::before{display:none}li{padding:.8rem}}
</style>
