<script lang="ts">
 import type {SourceBlock} from '$lib/concepts';
 import groups from '$lib/rpc-diagram-groups.json';
 let {block,lang='zh'}:{block:Extract<SourceBlock,{kind:'visual'}>;lang?:string}=$props();
 const name=$derived(block.src.includes('-roles-')?'roles':block.src.includes('-families-')?'families':'evidence');
 const panels=$derived(groups[name][lang==='en'?'en':'zh']);
</script>
<figure class="rpc-evidence" data-rpc-evidence={name}>
 <figcaption><strong>{block.visual.caption}</strong><p>{block.visual.description}</p></figcaption>
 {#each panels as panel}
  <section class:band={panel.kind==='band'}>
   <h4>{panel.title}</h4>
   <ul class:flow={panel.kind==='flow'} class:cards={panel.kind==='cards'} style:--columns={panel.count}>
    {#each block.visual.items.slice(panel.start,panel.start+panel.count) as item,i}
     <li><div class="node" class:tint={i%3===1} class:purple={i%3===2}><strong>{item.title}</strong><p>{item.body}</p></div>
     {#if panel.kind==='flow'&&i<panel.count-1}<span class="arrow" aria-hidden="true">→</span>{/if}</li>
    {/each}
   </ul>
  </section>
 {/each}
 <a href={block.src} download>{block.downloadLabel} — {block.visual.caption}</a>
</figure>
<style>
 .rpc-evidence{container-type:inline-size;margin:1.5rem 0;padding:1rem;background:#f5f8fc;color:#183b59;border:1px solid #8098ae;border-radius:16px;overflow-wrap:anywhere}
 figcaption>strong{font-size:1.15rem}p{margin:.5rem 0 0;font-size:1rem;line-height:1.8}section{margin:1rem 0;padding:1rem;border:1px solid #8098ae;border-radius:14px;background:white}h4{margin:0 0 1rem;font-size:1.05rem;line-height:1.8}ul{list-style:none;padding:0;margin:0;display:grid;gap:1rem}li{min-width:0;margin:0}.node{padding:1rem;background:#e9f2ff;border:1px solid #8098ae;border-radius:12px;height:100%}.tint{background:#e5f5f2}.purple{background:#f2edfc}.flow li{display:flex;align-items:center;gap:.6rem}.flow .node{flex:1;min-width:0}.arrow{color:#365b7a;font-size:1.7rem}.band{background:#183b59;color:white}.band .node{background:transparent;color:inherit;border:0;padding:0}.band h4{margin-bottom:.5rem}a{display:inline-block;color:#174d77;line-height:1.8}a:focus-visible{outline:3px solid #17664b;outline-offset:4px}
 @container(min-width:620px){.flow,.cards{grid-template-columns:repeat(var(--columns),minmax(0,1fr))}.flow{gap:1.2rem}.flow li{display:block;position:relative}.flow .arrow{position:absolute;right:-.9rem;top:45%;font-size:1.2rem}.flow .node{padding:.5rem .35rem;overflow-wrap:normal}.flow strong{font-size:16px;overflow-wrap:anywhere}.cards .node{padding:.8rem}}
 @container(max-width:619px){.flow li{flex-direction:column}.flow .node{width:100%}.arrow{transform:rotate(90deg)}}
 
 @container(max-width:350px){section{padding:.6rem}.node{padding:.7rem}}
</style>
