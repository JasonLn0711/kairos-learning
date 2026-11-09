<script lang="ts">
 import type {SourceBlock} from '$lib/concepts';
 let {block}:{block:Extract<SourceBlock,{kind:'visual'}>}=$props();
 const name=$derived(block.src.match(/m05-06-([a-z]+)-/)![1]);
</script>
<figure data-scan-evidence-diagram={name}>
 <figcaption>{block.visual.caption}</figcaption>
 <p>{block.visual.description}</p>
 {#if name==='result'}
 <dl>{#each block.visual.items as item,i}<div><dt>{item.title}</dt><dd>{#if i===1}<span aria-hidden="true">✓ </span>{:else if i===2}<span aria-hidden="true">⚠ </span>{/if}{item.body}</dd></div>{/each}</dl>
 {:else if name==='paths'}
 <div class="paths">{#each block.visual.items as item,i}<div class="node" class:root={i===0}><strong>{item.title}</strong>{#each item.body.split('\n\n') as p}<p>{p}</p>{/each}</div>{/each}</div>
 {:else}
 <ol>{#each block.visual.items as item,i}<li>{#if i}<svg class="arrow" viewBox="0 0 24 32" aria-hidden="true"><path d="M12 2v25m-6-6 6 6 6-6"/></svg>{/if}<div class="node"><strong>{item.title}</strong>{#each item.body.split('\n\n') as p}<p>{p}</p>{/each}</div></li>{/each}</ol>
 {/if}
 <a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
 figure{container-type:inline-size;min-width:0;margin:1.5rem 0;padding:1rem;border:1px solid #94a3b8;border-radius:1rem;background:#fff;color:#18252c;overflow-wrap:anywhere}figcaption{font-size:1.125rem;font-weight:700;line-height:1.8}p,strong,a,dt,dd{font-size:1rem;line-height:1.8}p{margin:.5rem 0 1rem}.node{padding:1rem;border:1px solid #94a3b8;border-radius:.75rem;min-width:0}.node p:last-child{margin-bottom:0}.paths{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1rem;margin-bottom:1rem;text-align:center}.root{grid-column:1/-1;border:0}ol{list-style:none;padding:0;margin:0 0 1rem}.arrow{display:block;width:24px;height:32px;margin:.5rem auto;fill:none;stroke:#59616b;stroke-width:2}dl{margin:1rem 0}dl div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1rem;padding:1rem 0;border-bottom:1px solid #cbd5e1}dd{margin:0;text-align:right;font-weight:600}@container(max-width:30rem){.paths{grid-template-columns:minmax(0,1fr)}dl div{grid-template-columns:minmax(0,1fr);gap:.25rem}dd{text-align:left}}
</style>
