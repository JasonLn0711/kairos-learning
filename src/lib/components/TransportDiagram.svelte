<script lang="ts">
 import models from '$lib/m0301-diagrams.json';
 import type {SourceBlock} from '$lib/concepts';
 let {block,lang='zh'}:{block:Extract<SourceBlock,{kind:'visual'}>;lang?:string}=$props();
 const diagram=$derived(models[block.src as keyof typeof models]);
</script>
<figure class="transport-figure" data-transport-diagram={diagram.layout}>
 <figcaption>{diagram.caption}</figcaption>
 <p>{diagram.description}</p>
 {#if diagram.layout==='overview'}
  <div class="route">
   {#each diagram.nodes as node,i}
    <section class="node"><svg aria-hidden="true" viewBox="0 0 80 60"><rect x="10" y="5" width="60" height="40" rx="6"/>{#if i===0}<path d="M40 45v10M25 55h30"/>{:else if i===1}<circle cx="25" cy="25" r="3"/><circle cx="40" cy="25" r="3"/><circle cx="55" cy="25" r="3"/>{:else}<path d="M20 17h40M20 28h40M20 39h40"/>{/if}</svg><h3>{node.title}</h3>{#each node.body as line}<p>{line}</p>{/each}</section>
    {#if i<2}<div class="connector"><span>{diagram.labels[i]}</span><span class="direction" aria-hidden="true">→</span></div>{/if}
   {/each}
  </div>
 {:else if diagram.layout==='handshake'}
  <div class="handshake"><div class="endpoints"><strong>{diagram.labels[0]}</strong><strong>{diagram.labels[1]}</strong></div>
  <ol>{#each diagram.nodes as node,i}<li class:reverse={i===1}><h3>{node.title}</h3><div class="message" aria-hidden="true">{i===1?'←':'→'}</div>{#each node.body as line}<p>{line}</p>{/each}</li>{/each}</ol></div>
 {:else if diagram.layout==='transport'}
  <div class="comparison">{#each diagram.nodes as node,i}<section class="node"><h3>{node.title}</h3><div class="packets">{#each node.body.slice(0,3) as packet,j}<div class="packet"><span>{packet}</span><span class:lost={i===1&&j===1} class="packet-arrow" aria-hidden="true">{i===1&&j===1?'×':'↓'}</span><small>{i===0&&j===1?diagram.labels[0]:"\u00a0"}</small><span>{node.body[j+3]}</span></div>{/each}</div>{#if i===1}<p>{diagram.labels[1]}</p>{/if}</section>{/each}</div>
 {:else}
  <div class="endpoints tuple-route"><div><h3>{diagram.labels[0]}</h3><p>{diagram.nodes[0].body[0]}:{diagram.nodes[1].body[0]}</p></div><div class="connector"><strong>{diagram.nodes[4].body[0]}</strong><span class="direction" aria-hidden="true">→</span></div><div><h3>{diagram.labels[1]}</h3><p>{diagram.nodes[2].body[0]}:{diagram.nodes[3].body[0]}</p></div></div>
  <dl class="tuple">{#each diagram.nodes as node}<div><dt>{node.title}</dt><dd>{node.body[0]}</dd></div>{/each}</dl>
 {/if}
 <div class="notes">{#each diagram.footer as note}<section class="node"><h3>{note.title}</h3>{#each note.body as line}<p>{line}</p>{/each}</section>{/each}</div>
 <p class="links"><a href={block.src}>{lang==='zh'?'開啟 SVG 原圖':'Open original SVG'}</a><a href={block.src} download>{block.downloadLabel}</a></p>
</figure>
<style>
 .transport-figure{container-type:inline-size;background:#f5f8fb;border:1px solid #d3dfed;border-radius:1rem;margin:1.5rem 0;padding:1rem;min-width:0;color:#172b49;font-size:1rem;line-height:1.75;overflow-wrap:anywhere}
 figcaption{font-size:1.25rem;font-weight:700}p{margin:.5rem 0}h3{font-size:1rem;line-height:1.75;margin:0 0 .5rem}.node{background:white;border:1px solid #b7c9df;border-radius:1rem;padding:1rem;min-width:0}
 .route{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;margin:1rem 0;gap:.6rem}.route .node{text-align:center;align-self:stretch}.node svg{width:5rem;height:4rem;stroke:#2464d9;stroke-width:2;fill:#edf6fc}
 .connector{display:flex;flex-direction:column;text-align:center;color:#086b89}.direction{font-size:2rem}.notes{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,12rem),1fr));gap:1rem;margin-top:1rem}.notes .node{background:#edf6fc}
 .handshake{background:white;padding:1rem;border-radius:1rem;margin-top:1rem}.endpoints{display:flex;justify-content:space-between;gap:1rem}.handshake ol{list-style:none;padding:0}.handshake li{text-align:center;border-left:2px dashed #9db3ce;border-right:2px dashed #9db3ce;padding:.5rem;margin:1rem 0}.handshake h3{color:#2464d9}.message{font-size:2rem;line-height:1;border-bottom:3px solid #2464d9;text-align:right}.reverse .message{text-align:left;border-color:#00849b}.comparison{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem}.packets{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem}.packet{display:flex;flex-direction:column;text-align:center;gap:.5rem;min-width:0}.packet>span:first-child,.packet>span:last-child{background:#edf6fc;border-radius:.5rem;padding:.5rem}.packet-arrow{font-size:2rem;color:#2464d9}.packet-arrow.lost{color:#c83243}.packet small{min-height:3.5em;font-size:1rem;color:#8b4608}
 .tuple-route{align-items:center;background:white;border:1px solid #b7c9df;border-radius:1rem;padding:1rem;margin-top:1rem}.tuple{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.5rem}.tuple>div{background:white;border:1px solid #b7c9df;border-radius:.5rem;padding:.75rem;min-width:0}.tuple dd{margin:0;color:#2464d9;font-weight:700}.links{display:flex;gap:1rem;flex-wrap:wrap}
 @container(min-width:651px){[data-transport-diagram="overview"] .notes{grid-template-columns:repeat(4,minmax(0,1fr))}}
 @container(max-width:650px){.route{grid-template-columns:1fr}.direction{transform:rotate(90deg)}.comparison{grid-template-columns:1fr}.tuple-route{flex-direction:column;align-items:stretch;text-align:center}.tuple{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @container(max-width:360px){.packets{grid-template-columns:1fr}.packet{display:grid;grid-template-columns:1fr auto 1fr;align-items:center}.packet-arrow{transform:rotate(-90deg)}.packet small{grid-column:1/-1;grid-row:2}.tuple{grid-template-columns:1fr}}
</style>
