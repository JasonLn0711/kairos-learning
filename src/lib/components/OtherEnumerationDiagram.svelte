<script lang="ts">
 import type {SourceBlock} from '$lib/concepts';
 let {block,lang}:{block:Extract<SourceBlock,{kind:'visual'}>;lang:string}=$props();
 const name=$derived(block.src.match(/m04-09-(.+)-(?:zh|en)-v1-[01]-0/)![1]);
 const v=$derived(block.visual);
 const groups=$derived([v.items.slice(0,1),v.items.slice(1,3),v.items.slice(3,5),v.items.slice(5,9),v.items.slice(9,14)]);
</script>
<figure data-other-enumeration={name}>
 <figcaption>{v.caption}</figcaption>
 <p class="description">{v.description}</p>
 {#if name==='ntp-network'}
  <div class="hierarchy">
   {#each groups as group,n}
    {#if n>0}<div class="down" aria-hidden="true">↓</div>{/if}
    <section class="stratum" aria-label={'Stratum '+n}>
     <h4>Stratum {n}{n>0&&n<4?' ↔':''}</h4>
     <ul class="peers">
      {#each group as node}<li><strong>{node.title}</strong><p>{node.body}</p></li>{/each}
     </ul>
    </section>
   {/each}
  </div>
 {:else}
  <svelte:element this={v.kind==='flow'?'ol':'ul'} class="nodes" class:flow={v.kind==='flow'} class:diamond={name==='bgp'&&v.items.length===4} class:bgp={name==='bgp'&&v.items.length===5} class:parallel={['roles','telnet','tftp'].includes(name)} class:columns={name==='ike'||name==='stages'} role="list">
   {#each v.items as node,i}
    {#if name==='bgp'&&v.items.length===4&&i===0}
     <li class="connections" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><marker id={'bgp-'+lang} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="#47748e"/></marker></defs><path d="M15 50L32.5 32.5L50 15M50 15L67.5 32.5L85 50M85 50L67.5 67.5L50 85M50 85L32.5 67.5L15 50" fill="none" stroke="#47748e" stroke-width=".4" marker-mid={'url(#bgp-'+lang+')'}/></svg></li>
     {/if}
    <li class:selected={name==='bgp'&&v.items.length===5&&i<3}>
     {#if v.kind==='flow'&&i>0}<span class="arrow" aria-hidden="true">→</span>{/if}
     {#if name==='bgp'&&v.items.length===5&&[1,2,4].includes(i)}<span class="peer horizontal" aria-hidden="true">↔</span>{/if}
     {#if name==='bgp'&&v.items.length===5&&i>2}<span class="peer vertical" aria-hidden="true">↕</span>{/if}
     <strong>{node.title}</strong>
     {#each node.body.split('\n\n') as paragraph}<p>{paragraph}</p>{/each}
    </li>
   {/each}
  </svelte:element>
 {/if}
 <a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
 figure{container-type:inline-size;min-width:0;margin:2rem 0;padding:1rem;border:1px solid #9bb1bd;border-radius:1rem;background:#fafcfc;overflow-wrap:anywhere}
 figcaption{font-size:1.15rem;font-weight:700;line-height:1.7;color:#183b59}p,strong{font-size:1rem;line-height:1.8}p{margin:.5rem 0 0;white-space:pre-line}.description{margin:.6rem 0 1.4rem}
 .nodes li.connections{display:none}.nodes,.peers{list-style:none;display:grid;gap:1.25rem;padding:0;margin:0}.nodes li,.peers li{min-width:0;padding:1rem;border:2px solid #47748e;background:#eff5fa;border-radius:.8rem;position:relative;color:#183b59}
 .nodes li.selected{border-color:#387c65;background:#e4f3eb}.nodes:not(.bgp) li:last-child{background:#e4f3eb}.flow{gap:3rem}.arrow{position:absolute;left:calc(50% - .5rem);top:-2.65rem;transform:rotate(90deg);font-size:1.5rem;color:#47748e}
 a{display:inline-block;margin-top:1rem;font-size:1rem;line-height:1.8}.stratum{padding:1rem;border:2px dashed #47748e;border-radius:1rem}.stratum h4{margin:0 0 .75rem;font-size:1rem;line-height:1.8}.down{text-align:center;font-size:1.8rem;color:#47748e}.peer{display:none}.peers li{background:white}.stratum:first-child .peers{grid-template-columns:1fr}
 @container(min-width:620px){.diamond li.connections{display:block;grid-area:1/1/4/4;padding:0;border:0;background:none;position:relative}.connections svg{position:absolute;width:100%;height:100%}.diamond li:not(.connections){z-index:1}.parallel{grid-template-columns:repeat(2,minmax(0,1fr))}.diamond{grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));align-items:stretch;gap:3rem}.diamond li:nth-child(2){grid-area:2/1}.diamond li:nth-child(3){grid-area:1/2}.diamond li:nth-child(4){grid-area:2/3}.diamond li:nth-child(5){grid-area:3/2}.columns{grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem}.columns .arrow{top:calc(50% - 1rem);left:-1.75rem;transform:none}.bgp{grid-template-columns:repeat(3,minmax(0,1fr));gap:3rem}.bgp .peer{display:block;position:absolute;font-size:1.8rem;color:#47748e}.horizontal{left:-2.35rem;top:calc(50% - 1rem)}.vertical{left:calc(50% - .7rem);top:-2.7rem}.peers{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @container(min-width:900px){.peers{grid-template-columns:repeat(auto-fit,minmax(8rem,1fr))}}
</style>
