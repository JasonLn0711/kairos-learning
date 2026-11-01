<script lang="ts">
 import {diagramAsset,diagramIcons,diagramTones,type TeachingDiagram} from '$lib/perspective-diagrams';
 let {diagram:d,articleId,lang}:{diagram:TeachingDiagram;articleId:string;lang:'zh'|'en'}=$props();
 const captionId=$derived(`${articleId}-${d.id}-${lang}-caption`);
</script>
<figure class="teaching-diagram" aria-labelledby={captionId}>
 <figcaption id={captionId}>{d.caption}</figcaption>
 <p class="description">{d.description}</p>
 <div class="groups">
 {#each d.groups as group}
 <section class="diagram-group"><h3>{group.title}</h3>
 <svelte:element this={group.mode==='flow'?'ol':'ul'} class="nodes" class:flow={group.mode==='flow'} class:cards={group.mode==='cards'} role="list">
 {#each group.items as item,index}
 <li>
 {#if group.mode==='flow'&&index>0}<svg class="arrow" viewBox="0 0 24 32" aria-hidden="true"><path d="M12 2v25m-7-7 7 7 7-7"/></svg>{/if}
 <div class="node" style:background={diagramTones[item.tone]}>
 <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d={diagramIcons[item.icon]}/></svg>
 <div><h4>{item.title}</h4><p>{item.body}</p></div>
 </div></li>
 {/each}</svelte:element></section>
 {/each}
 </div>
 <p class="note">{d.note}</p>
 <a class="svg-download" href={diagramAsset(articleId,d,lang)} download>{lang==='zh'?'下載 SVG：':'Download SVG: '}{d.caption}</a>
</figure>
<style>
 .teaching-diagram{margin:2rem 0;padding:clamp(.8rem,3vw,1.6rem);border:1px solid #59697a;border-radius:1.25rem;background:#fff;color:#182b40;max-width:100%;overflow-wrap:anywhere}
 figcaption{font-size:1.25rem;font-weight:750;line-height:1.6}.description{margin:.6rem 0 1.4rem}.groups{display:grid;gap:1.5rem}.diagram-group{min-width:0}.diagram-group h3{font-size:1.05rem;margin:0 0 .8rem;line-height:1.7}.nodes{padding:0;margin:0;list-style:none}li{min-width:0}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr));gap:.8rem}.node{display:flex;gap:.8rem;border:1px solid #59697a;border-radius:.9rem;padding:1rem;min-width:0;height:100%;box-sizing:border-box}.node>div{min-width:0}h4{margin:0;font-size:1rem;line-height:1.7}.node p{margin:.35rem 0 0;font-size:1rem;line-height:1.8}.icon{width:2rem;height:2rem;flex-shrink:0}.icon,.arrow{fill:none;stroke:#243b53;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.arrow{display:block;width:1.5rem;height:2rem;margin:.35rem auto}.note{border-top:1px dashed #59697a;padding-top:1rem;font-size:1rem;line-height:1.8}.svg-download{font-size:.95rem;color:#164d85;display:inline-block;line-height:1.7}.svg-download:focus-visible{outline:3px solid #164d85;outline-offset:4px}
</style>
