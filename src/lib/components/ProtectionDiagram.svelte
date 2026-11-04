<script lang="ts">
 import type {SourceBlock} from '$lib/concepts';
 let {block,lang='zh'}:{block:Extract<SourceBlock,{kind:'visual'}>;lang?:string}=$props();
 const roles=$derived(block.src.includes('-roles-'));
 const nodes=$derived(block.visual.items);
</script>
<figure class="source-visual protection-diagram" data-protection-diagram={roles?'roles':'evidence'}>
 <figcaption>{block.visual.caption}</figcaption><p>{block.visual.description}</p>
 {#if roles}
  <div class="packet-path">
   {#each nodes.slice(0,4) as node,i}
    <section><h3>{node.title}</h3><p>{node.body}</p></section>
    {#if i<3}<span class="arrow" aria-hidden="true">→</span>{/if}
   {/each}
  </div>
  <div class="mirror"><p class="branch">{lang==='zh'?'掃描端 → Firewall 之間 ┄→ IDS：防火牆前的鏡像副本':'Between Scanner → Firewall ┄→ IDS: copy before the firewall'}</p><section><h3>{nodes[4].title}</h3><p>{nodes[4].body}</p></section></div>
  <p class="limit">{lang==='zh'?'IDS 的 Alert ≠ IPS／Firewall 的 Drop。實際位置與可見範圍依現場架構確認。':'IDS Alert ≠ IPS/Firewall Drop. Verify actual placement and visibility in the deployed topology.'}</p>
 {:else}
  <h3>{lang==='zh'?'第一層：觀察到的現象':'Layer 1: observations'}</h3>
  <div class="pair">{#each nodes.slice(0,2) as node}<section><h3>{node.title}</h3><p>{node.body}</p></section>{/each}</div>
  <p class="crosscheck">{lang==='zh'?'兩項觀察 ↓ 共同核對下方兩種紀錄':'Both observations ↓ cross-check both records below'}</p>
  <h3>{lang==='zh'?'第二層：交叉核對防護與服務端':'Layer 2: protection and server corroboration'}</h3>
  <div class="pair">{#each nodes.slice(2,4) as node}<section><h3>{node.title}</h3><p>{node.body}</p></section>{/each}</div>
  <p class="crosscheck" aria-hidden="true">↓</p><section class="limit"><h3>{nodes[4].title}</h3><p>{nodes[4].body}</p></section>
 {/if}
 <p class="links"><a href={block.src}>{lang==='zh'?'開啟 SVG 原圖':'Open original SVG'}</a><a href={block.src} download>{block.downloadLabel}</a></p>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid #b7c9df;border-radius:1rem;background:#f5f8fb;color:#172b49;min-width:0;font-size:1rem;line-height:1.75;overflow-wrap:anywhere}figcaption{font-size:1.2rem;font-weight:700}h3,p{font-size:1rem;line-height:1.75;margin:.6rem 0}section{padding:1rem;border:1px solid #9db3cd;border-left:5px solid #2460ce;border-radius:.75rem;background:white;min-width:0}.packet-path{display:grid;grid-template-columns:1fr;gap:.5rem}.packet-path section:nth-of-type(2){border-left-color:#ad6700}.packet-path section:nth-of-type(3){border-left-color:#bd3443}.arrow{font-size:1.5rem;text-align:center;transform:rotate(90deg)}.mirror{margin-top:1rem;border-top:3px dashed #008475;padding-top:.5rem}.mirror section{border-left-color:#008475}.branch{color:#006a60;font-weight:600}.pair{display:grid;grid-template-columns:1fr;gap:1rem}.pair section:nth-child(2){border-left-color:#7650bb}.crosscheck{text-align:center;font-weight:600;color:#245ac5}.limit{margin-top:1rem;background:#e2f4ec;border:1px solid #70ab98;border-radius:.75rem;padding:1rem}.links{display:flex;flex-wrap:wrap;gap:1rem}
 @container(min-width:580px){.packet-path{grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;align-items:stretch}.arrow{transform:none;align-self:center}.pair{grid-template-columns:repeat(2,minmax(0,1fr))}.mirror{margin-left:12%;max-width:85%}}
</style>
