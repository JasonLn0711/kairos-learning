<script lang="ts">
 import type {SourceBlock} from '$lib/concepts';
 let {block}:{block:Extract<SourceBlock,{kind:'visual'}>}=$props();
 const name=$derived(block.src.match(/m05-05-([a-z]+)-/)![1]);
 const icons=['M3 18a9 9 0 1 1 18 0 M12 14l5-7 M5 19h14','M12 2l9 4v7c0 5-4 8-9 10-5-2-9-5-9-10V6z M12 7v6 M12 16v1','M3 21v-5 M8 21V12 M13 21v-8 M18 21V7 M2 12l6-6 5 3 8-7'];
</script>
<figure data-prioritization-diagram={name}>
 <figcaption>{block.visual.caption}</figcaption>
 <p class="description">{block.visual.description}</p>
 {#if name==='workflow'}
  <ol>{#each block.visual.items as item,i}<li>
   {#if i}<svg class="arrow" viewBox="0 0 24 32" aria-hidden="true"><path d="M12 2v25m-6-6 6 6 6-6"/></svg>{/if}
   <div class="node" class:final={i===3}><strong>{item.title}</strong><p>{item.body}</p></div>
  </li>{/each}</ol>
 {:else}
  <ul class:signals={name==='signals'} class:probability={name==='probability'}>{#each block.visual.items as item,i}<li>
   {#if name==='signals'}<svg class="icon" viewBox="0 0 24 25" aria-hidden="true"><path d={icons[i]}/></svg>{/if}
   <div class="node"><strong>{item.title}</strong>
    {#if name==='probability'}<div class="probability-track" aria-hidden="true"><span></span></div>{/if}
    {#each item.body.split('\n\n') as paragraph}<p>{paragraph}</p>{/each}
   </div>
  </li>{/each}</ul>
 {/if}
 <a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
 figure{container-type:inline-size;min-width:0;margin:1.5rem 0;padding:1rem;border:1px solid #94a3b8;border-radius:1rem;background:#fff;color:#18252c;overflow-wrap:anywhere}
 figcaption{font-size:1.125rem;line-height:1.8;font-weight:700}
 p,strong,a{font-size:1rem;line-height:1.8}p{margin:.4rem 0 0}.description{margin:.5rem 0 1rem}
 ul,ol{list-style:none;margin:0 0 1rem;padding:0}.node{min-width:0;padding:1rem}ul li+li{border-top:1px solid #cbd5e1}
 .signals li{display:grid;grid-template-columns:2rem minmax(0,1fr);gap:.75rem;align-items:start}.signals .node{padding-left:0}
 .icon{width:1.5rem;height:1.5rem;margin-top:1.4rem;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
 ol .node{border:1px solid #94a3b8;border-radius:.75rem;text-align:center}ol .final{background:#edf4fc;border-color:#3268a3}
 .arrow{width:24px;height:32px;display:block;margin:.5rem auto;fill:none;stroke:#59616b;stroke-width:2}
 .probability strong{font-size:1.5rem}.probability-track{height:.75rem;border-radius:1rem;margin:.6rem 0;background:#e2e8f0;overflow:hidden}.probability-track span{display:block;width:20%;height:100%;background:#3268a3;border-radius:1rem}
 @container(max-width:22rem){.signals li{grid-template-columns:1.5rem minmax(0,1fr);gap:.5rem}.node{padding:.75rem}.icon{margin-top:1.1rem}}
</style>
