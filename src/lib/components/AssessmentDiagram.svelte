<script lang="ts">
  import type {SourceBlock} from '$lib/concepts';
  let {block}:{block:Extract<SourceBlock,{kind:'visual'}>}=$props();
  const names=['terms','scan','access','workflow'];
  const name=$derived(names.find(n=>block.src.includes(`-${n}-`))??'terms');
</script>
<figure data-assessment-diagram={name} class:terms={name==='terms'} class:scan={name==='scan'} class:access={name==='access'} class:workflow={name==='workflow'}>
  <figcaption><strong>{block.visual.caption}</strong><p>{block.visual.description}</p></figcaption>
  {#if name==='workflow'}
    <ol>{#each block.visual.items as item,i}<li><span class="number" aria-hidden="true">{i+1}</span><div><strong>{item.title}</strong><p>{item.body}</p></div></li>{/each}</ol>
  {:else}
    <ul>{#each block.visual.items as item,i}<li class:risk={name==='terms'&&i===5} class:allowed={name==='access'&&i===2} class:denied={name==='access'&&i===3}><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
  {/if}
  <a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:var(--soft);min-width:0;overflow-wrap:anywhere}
figcaption>strong{font-size:1.125rem}p{font-size:1rem;line-height:1.8;margin:.5rem 0 0;overflow-wrap:anywhere}figcaption p{margin-bottom:1rem}
ul,ol{list-style:none;margin:0 0 1rem;padding:0;display:grid;gap:1rem}li{min-width:0;padding:1rem;background:var(--paper);border:1px solid var(--line);border-radius:.6rem;overflow-wrap:anywhere}strong{font-size:1rem;line-height:1.8}
.terms ul,.access ul{grid-template-columns:repeat(2,minmax(0,1fr))}.terms li:nth-child(1),.terms li:nth-child(2),.terms li:nth-child(5),.risk{grid-column:1/-1}.risk{border:2px solid #8c5447;background:#fcf2ef}.allowed{border-left:4px solid #28724f}.denied{border-left:4px solid #a43434}
.workflow li{position:relative;display:flex;gap:1rem}.workflow li:not(:last-child)::after{content:'↓';position:absolute;bottom:-1.2rem;left:1.45rem;color:var(--ink);background:var(--soft);font-size:1rem;line-height:1rem}.number{flex:none;font-weight:700;font-size:1rem;line-height:1.8}.workflow li>div{min-width:0}
a{display:inline-block;line-height:1.8}
@container(max-width:32rem){.terms ul,.access ul{grid-template-columns:1fr}li{padding:.8rem}}
</style>
