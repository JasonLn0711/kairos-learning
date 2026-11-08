<script lang="ts">
 import type {SourceBlock} from '$lib/concepts';
 let {block}:{block:Extract<SourceBlock,{kind:'visual'}>}=$props();
 const name=$derived(['inventory','scope','workflow','coverage'].find(n=>block.src.includes(`-${n}-`))!);
</script>
<figure data-scope-diagram={name} class={name}>
 <figcaption><strong>{block.visual.caption}</strong></figcaption>
 {#if name==='inventory'}
  <div class="cells" aria-hidden="true">{#each Array(100) as _,i}<span class:included={i<30}></span>{/each}</div>
 {:else if name==='coverage'}
  <div class="bar" aria-hidden="true"><span></span></div>
 {/if}
 {#if name==='workflow'}
  <ol>{#each block.visual.items as item,i}<li><span aria-hidden="true">{i+1}</span><div><strong>{item.title}</strong><p>{item.body}</p></div></li>{/each}</ol>
 {:else}
  <ul>{#each block.visual.items as item,i}<li class:authorized={name==='scope'&&i===0}><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
 {/if}
 <p>{block.visual.description}</p>
 <a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
figure{container-type:inline-size;min-width:0;overflow-wrap:anywhere;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:var(--soft);margin:1.5rem 0}strong,p,a,li{font-size:1rem;line-height:1.8}figcaption{margin-bottom:1rem}figcaption strong{font-size:1.125rem}p{margin:.5rem 0 1rem}ul,ol{list-style:none;padding:0;margin:0;display:grid;gap:1.5rem}li{position:relative;margin:0;min-width:0;padding:1rem;border:1px solid var(--line);border-radius:.75rem;background:var(--paper)}li p{margin:.5rem 0 0}.inventory ul{grid-template-columns:repeat(2,minmax(0,1fr))}.scope ul{grid-template-columns:repeat(2,minmax(0,1fr));gap:3rem 1rem}.scope li:first-child{grid-column:1/-1;background:#edf6f4;border:2px solid #26877e}.scope li:not(:first-child)::before{content:'↓';position:absolute;top:-2.9rem;left:50%;font-size:1.5rem;line-height:1.8}.scope li:not(:first-child)::after{content:'';position:absolute;top:-1.5rem;left:50%;width:calc(100% + 1rem);height:1px;background:var(--ink)}.scope li:last-child::after{left:auto;right:50%;width:calc(50% + .75rem)}.scope li:nth-child(2)::after{width:calc(50% + .75rem)}.scope li:first-child::after{content:'';position:absolute;bottom:-1.75rem;left:50%;height:1.75rem;border-left:1px solid var(--ink)}.workflow li{display:flex;gap:1rem}.workflow li:not(:last-child)::after{content:'↓';position:absolute;bottom:-1.5rem;left:1rem;background:var(--soft)}.workflow li>div{min-width:0}.cells{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:4px;margin:1rem 0}.cells span{height:12px;background:#e6e8e8;border-radius:2px}.cells .included{background:#20877f}.bar{height:24px;border-radius:1rem;background:#e6e8e8;margin-bottom:1rem}.bar span{display:block;width:80%;height:100%;background:#20877f;border-radius:1rem}.coverage strong{font-size:2rem}
@container(max-width:32rem){.inventory ul,.scope ul{grid-template-columns:1fr}.scope ul{position:relative;gap:1.5rem}.scope li:first-child{grid-column:auto}.scope li:not(:first-child){margin-left:1rem}.scope li:not(:first-child)::before{content:'A →';position:static;font-size:1rem;display:block}.scope li::after{display:none}.scope li:not(:first-child)::after{display:none}.scope li:first-child::after{display:none}}
</style>
