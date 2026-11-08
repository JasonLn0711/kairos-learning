<script lang="ts">
 import type {SourceBlock} from '$lib/concepts';
 let {block}:{block:Extract<SourceBlock,{kind:'visual'}>}=$props();
 const icons=['M4 2h10l6 6v14H4z M14 2v6h6 M7 13h7 M7 17h4','M20 3a6 6 0 0 1-7 8L5 20l-3-3 9-8a6 6 0 0 1 9-6z','M3 6l9-5 9 5v12l-9 5-9-5z M3 6l9 5 9-5 M12 11v12'];
 const name=$derived(block.src.match(/m05-04-([a-z]+)-/)![1]);
</script>
{#snippet node(i:number)}{@const n=block.visual.items[i]}<div class="node" class:final={name==='lookup'&&i===3}>{#if name==='roles'&&i<3}<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" style:color={['#006bc7','#59616b','#006d32'][i]}><path d={icons[i]}/></svg>{/if}<strong>{n.title}</strong><p>{n.body}</p></div>{/snippet}
{#snippet arrow()}<svg class="arrow" viewBox="0 0 24 32" aria-hidden="true"><path d="M12 2v25m-6-6 6 6 6-6"/></svg>{/snippet}
<figure data-identification-diagram={name}>
 <figcaption>{block.visual.caption}</figcaption>
 <p>{block.visual.description}</p>
 {#if name==='roles'}<div class="parallel">{#each [0,1,2] as i}{@render node(i)}{/each}</div>{@render arrow()}{@render node(3)}{@render arrow()}{@render node(4)}
 {:else if name==='identifier'}<div class="parallel identifier">{#each [0,1,2] as i}{@render node(i)}{/each}</div>
 {:else if name==='lookup'}<ol class="flow">{#each block.visual.items as _,i}<li>{#if i}{@render arrow()}{/if}{@render node(i)}</li>{/each}</ol>
 {:else if name==='finding'}<dl>{#each block.visual.items as item}<div><dt>{item.title}</dt><dd>{item.body}</dd></div>{/each}</dl>
 {:else}<ol class="evidence">{#each block.visual.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ol>{/if}
 <a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid #94a3b8;border-radius:1rem;background:#fff;color:#18252c;min-width:0;overflow-wrap:anywhere}figcaption{font-size:1.125rem;font-weight:700;line-height:1.8}p,strong,a,dt,dd{font-size:1rem;line-height:1.8}p{margin:.5rem 0 1rem}.parallel{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.icon{display:block;width:32px;height:32px;fill:none;stroke:currentColor;stroke-width:2;margin:0 auto 1rem}.node.final{border:1px solid #cbd5e1;border-radius:.75rem}.identifier .node{position:relative}.identifier .node:not(:last-child)::after{content:"−";position:absolute;right:-.6rem;top:1rem}.node{padding:1rem;min-width:0}.parallel .node{text-align:center}.identifier strong{font-size:1.75rem}.arrow{display:block;width:24px;height:32px;margin:.5rem auto;fill:none;stroke:#64748b;stroke-width:2}.flow{list-style:none;padding:0}.evidence{padding-left:1.75rem}.evidence li{padding:.5rem .5rem 1rem}.evidence li p{border-left:3px solid #cbd5e1;padding-left:1rem;margin-top:.75rem}dl>div{display:grid;grid-template-columns:1fr 2fr;gap:1rem;border-bottom:1px solid #cbd5e1;padding:.75rem 0}dd{margin:0}@container(max-width:35rem){.parallel{grid-template-columns:1fr}.identifier{grid-template-columns:repeat(3,minmax(0,1fr));gap:.25rem}.identifier .icon{display:block;width:32px;height:32px;fill:none;stroke:currentColor;stroke-width:2;margin:0 auto 1rem}.node.final{border:1px solid #cbd5e1;border-radius:.75rem}.identifier .node{position:relative}.identifier .node:not(:last-child)::after{content:"−";position:absolute;right:-.6rem;top:1rem}.node{padding:.25rem}.identifier strong{font-size:1.15rem}dl>div{grid-template-columns:1fr;gap:.25rem}}
</style>
