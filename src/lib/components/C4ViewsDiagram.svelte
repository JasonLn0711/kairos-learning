<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:number;lang:'zh'|'en'}=$props();
 const labels={zh:{deployment:'實際部署（Deployment）',ordering:'線上訂餐系統 — C4 Container 視角',backend:'訂單後端 API（同一個應用程式）',local:'本機收件完整性檢核系統',framework:'Streamlit 管理的通訊',database:'讀取／保存訂單與商品',payment:'訂單後端 ↔ 第三方支付平台',download:'瀏覽器前端 → 操作者裝置：下載 JSON',open:'開啟／下載原尺寸 SVG'},en:{deployment:'Actual deployment',ordering:'Online ordering system — C4 container view',backend:'Order backend API (one application)',local:'Local intake-completeness checker',framework:'Communication managed by Streamlit',database:'Read / save orders and products',payment:'Order backend ↔ third-party payment platform',download:'Browser frontend → operator device: JSON download',open:'Open / download full-size SVG'}};
 const l=$derived(labels[lang]);
</script>
{#snippet node(i:number)}<div class="node" data-node={i}><strong>{diagram.items[i].title}</strong><p>{diagram.items[i].body}</p></div>{/snippet}
{#snippet connector(label:string='',both:boolean=false)}<div class="connection"><svg aria-hidden="true" viewBox="0 0 24 32"><path d={both?'M7 3v24m-5-5 5 5 5-5M17 29V5m-5 5 5-5 5 5':'M12 3v24m-6-6 6 6 6-6'}/></svg>{#if label}<span>{label}</span>{/if}</div>{/snippet}
<figure class="c4-views" data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===1}
  <div class="zoom">{@render node(0)}<div class="zoom">{@render node(1)}<div class="zoom">{@render node(2)}<div class="zoom">{@render node(3)}</div></div></div></div>
 {:else if number===2}
  {@render node(0)}{@render connector(l.deployment)}<div class="replicas">{#each [1,2,3] as i}{@render node(i)}{/each}</div>
 {:else if number===3}
  {@render node(0)}{@render connector('',true)}<div class="boundary">{@render node(1)}</div>{@render connector('',true)}{@render node(2)}
 {:else if number===4}
  {@render node(0)}{@render connector()}
  <section class="boundary"><h3>{l.ordering}</h3>{@render node(1)}{@render connector('HTTPS / API',true)}{@render node(2)}{@render connector(l.database,true)}{@render node(3)}</section>
  <p class="relationship">{l.payment}</p>{@render node(4)}
 {:else if number===5}
  <section class="boundary"><h3>{l.backend}</h3><div class="components">{#each [0,1,2,3] as i}{@render node(i)}{/each}</div></section>
 {:else if number===6}
  {@render node(0)}{@render connector()}
  <section class="boundary"><h3>{l.local}</h3>{@render node(1)}{@render connector(l.framework,true)}<div class="process">{@render node(2)}<div class="internals">{@render node(3)}{@render node(4)}</div></div></section>
  <p class="relationship">{l.download}</p>{@render node(5)}
 {:else}
  <ol class="review">{#each diagram.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ol>
 {/if}
 <p class="interpretation">{diagram.description}</p>
 <a href={`/images/aase/m06-03-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{l.open}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid #d5dce0;border-radius:1rem;background:#fbfcfd;color:#18252c;min-width:0}figcaption,p,li,h3,a,strong,span{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}figcaption{margin-bottom:1rem}p{margin:.5rem 0;white-space:pre-line}h3{margin:0 0 1rem;font-weight:650}.node{padding:1rem;border:1px solid #a8bfda;border-radius:.7rem;min-width:0;background:#eaf1f7}.node strong{display:block}.connection{display:flex;align-items:center;justify-content:center;gap:.6rem;padding:.5rem;color:#46535f}.connection svg{width:1.5rem;height:2rem;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:1.5}.boundary{padding:1rem;border:1px dashed #7295bf;border-radius:.8rem}.zoom{padding:.5rem;border-radius:.7rem;background:#f1f3f5}.zoom>.zoom{margin-left:1rem}.zoom>.node{background:transparent;border:0}.replicas{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem}.replicas .node{text-align:center}.components{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.components .node{background:transparent;border:0}.process{padding:.5rem;background:#eaf1f7;border:1px solid #a8bfda;border-radius:.7rem}.process>.node{border:0}.internals{display:grid;gap:.5rem;padding:.5rem}.internals .node{background:#f1f3f5;border-color:#d5dce0}.relationship{padding:.7rem;border-left:3px solid #7295bf;margin:1rem 0}.review{list-style:none;margin:0;padding:0;display:grid;gap:1rem}.review li{padding:.7rem 0;border-bottom:1px solid #d5dce0}.interpretation{margin-top:1rem}a{color:#075f87;text-decoration:underline}a:focus-visible{outline:3px solid #b15840;outline-offset:4px}
 @container(max-width:36rem){figure{padding:.5rem}.node{padding:.5rem}.process,.internals{padding:.2rem}.zoom{padding:.1rem}.replicas,.components{grid-template-columns:1fr}.zoom>.zoom{margin-left:.2rem}.boundary{padding:.6rem}}
</style>
