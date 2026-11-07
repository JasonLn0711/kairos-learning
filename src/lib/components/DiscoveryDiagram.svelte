<script lang="ts">
 import models from '$lib/m0302-discovery-diagrams.json';
 import type {SourceBlock} from '$lib/concepts';
 let {block,lang='zh'}:{block:Extract<SourceBlock,{kind:'visual'}>;lang?:string}=$props();
 const diagram=$derived(models[block.src as keyof typeof models]);
</script>
<figure class="discovery" data-discovery-diagram={diagram.layout}>
 <figcaption>{diagram.caption}</figcaption>
 <p>{diagram.description}</p>
 <div class="panels">
 {#each diagram.panels as panel,index}
  <section class="panel" class:icmp-error={diagram.layout==='outcomes'&&index===1} class:unknown={diagram.layout==='outcomes'&&index===2}>
   <h3>{panel.title}</h3>
   <div class="route" class:three={panel.nodes.length===3}>
    {#each panel.nodes as node,i}
     <div class="endpoint"><strong>{node.title}</strong><span>{node.address}</span></div>
     {#if i<panel.nodes.length-1}
      <div class="messages">
       {#each panel.edges.filter(e=>Math.min(e.source,e.target)===i) as edge}
        <div class="message"><span>{edge.label}</span><svg class:reverse={edge.source>edge.target} class:dashed={edge.style==='dashed'} aria-hidden="true" viewBox="0 0 60 20"><path d="M2 10H56M46 2L56 10L46 18"/></svg></div>
       {/each}
      </div>
     {/if}
    {/each}
   </div>
   <p class="claim">{panel.claim}</p>
   {#each panel.notes as note}<p>{note}</p>{/each}
  </section>
 {/each}
 </div>
 <p>{diagram.footer}</p>
 <p class="links"><a href={block.src}>{lang==='zh'?'開啟 SVG 原圖':'Open original SVG'}</a><a href={block.src} download>{block.downloadLabel}</a></p>
</figure>
<style>
 .icmp-error .claim{background:#fff3df;color:#87500a}.unknown .claim{background:#fcebef;color:#a12b3a}
 .discovery{container:discovery / inline-size;background:#f2f6fc;border:1px solid #b7c9df;border-top:5px solid #2464d9;border-radius:1rem;padding:1rem;margin:1.5rem 0;color:#172b49;min-width:0;font-size:1rem;line-height:1.75;overflow-wrap:anywhere}
 figcaption{font-size:1.25rem;font-weight:700}h3{font-size:1rem;line-height:1.75;margin:0 0 1rem}p{margin:.75rem 0}.panels{display:grid;grid-template-columns:1fr;gap:1rem}.panel{container:panel / inline-size;background:white;border:1px solid #b7c9df;border-radius:1rem;padding:1rem;min-width:0}.claim{background:#e6f5f1;color:#00645f;border-radius:.6rem;padding:.75rem;font-weight:600}.route{display:grid;grid-template-columns:minmax(0,1fr) minmax(3rem,.8fr) minmax(0,1fr);align-items:center;gap:.25rem;min-width:0}.route.three{grid-template-columns:minmax(0,1fr) minmax(2rem,.6fr) minmax(0,1fr) minmax(2rem,.6fr) minmax(0,1fr)}.endpoint{border:1px solid #9db3ce;background:#edf6fc;border-radius:.75rem;padding:.6rem;display:flex;flex-direction:column;gap:.4rem;min-width:0;text-align:center}.endpoint span{color:#445d73}.message{text-align:center;color:#1854bb}.message svg{width:100%;max-width:4rem;height:1.5rem;stroke:currentColor;stroke-width:2;fill:none;display:block;margin:auto}.message svg.reverse{transform:rotate(180deg)}.message svg.dashed path{stroke-dasharray:5 3}.links{display:flex;flex-wrap:wrap;gap:1rem}
 @container discovery (min-width:650px){[data-discovery-diagram="outcomes"] .panels{grid-template-columns:repeat(3,minmax(0,1fr))}}
 @container discovery (min-width:650px){[data-discovery-diagram="next-hop"] .panels{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @container panel (max-width:360px){.route,.route.three{grid-template-columns:1fr}.message{display:flex;flex-direction:column;align-items:center;margin:.5rem 0}.message svg{transform:rotate(90deg);width:2rem;height:2rem}.message svg.reverse{transform:rotate(-90deg)}.messages{display:flex;justify-content:space-evenly;gap:.5rem}.endpoint{padding:.75rem}}
</style>
