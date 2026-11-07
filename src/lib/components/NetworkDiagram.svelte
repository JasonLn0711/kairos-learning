<script lang="ts">
 import type {SourceBlock} from '$lib/concepts';
 import {networkDiagram} from '$lib/m0206-network';
 import CidrExplorer from './CidrExplorer.svelte';
 let {block,lang}:{block:Extract<SourceBlock,{kind:'visual'}>;lang:string}=$props();
 const diagram=$derived(networkDiagram(block.src)!);
 const d=$derived(diagram.data);
 const layout=$derived(diagram.layout);
</script>
{#snippet node(i:number)}<div class="node" data-tone={d.nodes[i].tone}><strong>{d.nodes[i].title}</strong><p>{d.nodes[i].body}</p></div>{/snippet}
{#snippet arrow(label='',up=false,dashed=false)}<div class="connection" class:up class:dashed><svg viewBox="0 0 24 40" aria-hidden="true"><path d="M12 2V35M4 27L12 35L20 27"/></svg>{#if label}<span>{label}</span>{/if}</div>{/snippet}
<figure class="network-diagram" data-network-layout={layout}>
 <figcaption><strong>{d.caption}</strong><p>{d.description}</p></figcaption>
 {#if layout==='network-map'}
  <div class="map">{#each d.nodes as _,i}{#if i>0}{@render arrow()}{/if}{@render node(i)}{/each}</div>
 {:else if layout==='prefix-bits'}
  <div class="bits"><div class="prefix"><div class="octets">{#each [0,1,2] as i}{@render node(i)}{/each}</div><p class="bit-label">{d.labels[0]}</p></div><div class="host">{@render node(3)}<p class="bit-label">{d.labels[1]}</p></div></div>
 {:else if layout==='private-network'}
  <div class="private"><h3>{d.labels[0]}</h3><div class="peers">{@render node(0)}{@render node(1)}</div><div class="merge" aria-hidden="true"></div><p class="connection-label">{d.labels[1]}</p>{@render node(2)}</div>{@render arrow(d.labels[2])}{@render node(3)}
 {:else if layout==='bgp-routing'}
  {@render node(0)}{@render arrow(d.labels[0])}{@render node(1)}
  <div class="bgp-exchange">{@render arrow(d.labels[1],true,true)}{@render arrow(d.labels[0])}</div>{@render node(2)}
 {:else if layout==='cdn-origin'}
  <div class="dns-pair">{@render node(0)}<div class="dns-exchange"><svg viewBox="0 0 100 48" aria-hidden="true"><path d="M2 10H96L84 2M96 10L84 18M98 36H4L16 28M4 36L16 44"/></svg><span>{d.labels[0]}</span></div>{@render node(1)}</div>
  {@render arrow(d.labels[1])}{@render node(2)}<div class="origin-link">{@render arrow(d.labels[2])}</div>{@render node(3)}
 {:else if layout==='proxy-modes'}
  <div class="comparison"><section><h3>{d.labels[0]}</h3>{@render node(0)}<div class="direct">{@render arrow(d.labels[1])}</div>{@render node(1)}</section><section><h3>{d.labels[2]}</h3>{@render node(2)}{@render arrow()}{@render node(3)}{@render arrow(d.labels[3])}{@render node(4)}</section></div>
 {/if}
 <p class="footer">{d.footer}</p>
 <a class="network-download" href={block.src} download>{block.downloadLabel}：{d.caption}</a>
</figure>
{#if layout==='prefix-bits'}<CidrExplorer {lang}/>{/if}
<style>
 .network-diagram{container-type:inline-size;margin:1.8rem 0;padding:clamp(.7rem,2vw,1.3rem);border:1px solid #64748b;border-radius:1rem;background:#fcfcfd;color:#162a3a;max-width:100%;overflow-wrap:anywhere}
 figcaption>strong{font-size:1.15rem}figcaption p,.footer{font-size:1rem;line-height:1.8}figcaption{margin-bottom:1.2rem}.node{border:2px solid var(--stroke);background:var(--fill);border-radius:1rem;padding:1rem;text-align:center;min-width:0}.node strong{font-size:1.15rem;line-height:1.7}.node p{font-size:1rem;line-height:1.8;margin:.3rem 0 0;white-space:pre-line}
 [data-tone=blue]{--fill:#e5effc;--stroke:#689ee9}[data-tone=teal]{--fill:#e3f2f0;--stroke:#59b6b1}[data-tone=orange]{--fill:#fcf0e6;--stroke:#dc9a60}[data-tone=purple]{--fill:#f0eafa;--stroke:#ac85ed}[data-tone=gray]{--fill:#eef0f3;--stroke:#a1aebb}
 .connection{display:flex;align-items:center;justify-content:center;gap:.6rem;min-height:3rem;color:#075bc5;font-size:1rem;line-height:1.7}.connection svg{flex:none;width:1.5rem;height:2.7rem;fill:none;stroke:currentColor;stroke-width:2.7}.connection.up svg{transform:rotate(180deg)}.connection.dashed{color:#a74705}.connection.dashed svg{stroke-dasharray:5 3}.bgp-exchange{display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:.4rem 0}.origin-link{color:#a74705}.origin-link .connection{color:inherit}
 .peers,.comparison{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.comparison>section{min-width:0;border:1px solid #cbd5e1;padding:.8rem;border-radius:1rem;display:flex;flex-direction:column}.comparison h3,.private h3{font-size:1rem;line-height:1.8;margin:0 0 .7rem}.direct{flex:1;display:grid;align-content:center;min-height:5rem}.direct .connection{color:#52677f}.private{border:2px dashed #84c4c0;border-radius:1rem;padding:1rem;background:#f0f8f7}.merge{height:2rem;width:50%;margin:auto;border:solid #14817b;border-width:0 3px 3px;position:relative}.merge:after{content:'';position:absolute;left:50%;top:100%;height:1rem;border-left:3px solid #14817b}.connection-label{text-align:center;margin:1.2rem 0 .4rem;font-size:1rem}
 .bits{display:grid;grid-template-columns:3fr 1fr;gap:1rem}.octets{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem}.bits .node{padding:.7rem .2rem}.bits .node strong{font-size:1.5rem}.bit-label{text-align:center;border-top:.55rem solid #075bc5;padding-top:.6rem;font-size:1rem;line-height:1.7}.host .bit-label{border-color:#b85b10}
 .dns-pair{display:grid;grid-template-columns:1fr 8rem 1fr;gap:.4rem;align-items:center}.dns-exchange{text-align:center;color:#52677f;min-width:0;font-size:1rem;line-height:1.7}.dns-exchange svg{display:block;width:100%;fill:none;stroke:currentColor;stroke-width:3;stroke-dasharray:6 4}
 .footer{border-top:1px dashed #94a3b8;padding-top:1rem;margin-top:1.2rem}.network-download{display:inline-block;font-size:1rem;line-height:1.7;color:#164d85}.network-download:focus-visible{outline:3px solid #175f91;outline-offset:4px}
 @container(max-width:560px){.comparison,.peers,.dns-pair{grid-template-columns:1fr}.dns-exchange svg{width:5rem;height:3rem;margin:1rem 0;transform:rotate(90deg)}.dns-exchange{display:flex;flex-direction:column;align-items:center;gap:1rem;padding:1rem 0}.merge{width:0;border-width:0 0 0 3px}.merge:after{left:0}.bits{grid-template-columns:1fr}.octets{grid-template-columns:repeat(3,minmax(0,1fr))}.bgp-exchange{grid-template-columns:1fr}.direct{min-height:3rem}.dns-pair .node{width:100%}}
 @container(max-width:300px){.octets{grid-template-columns:1fr}}
</style>
