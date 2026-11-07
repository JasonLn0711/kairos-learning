<script lang="ts">
 import models from '$lib/m0303-scan-diagrams.json';
 import type {SourceBlock} from '$lib/concepts';
 let {block,lang='zh'}:{block:Extract<SourceBlock,{kind:'visual'}>;lang?:string}=$props();
 const model=$derived(models[block.src as keyof typeof models]);
</script>
<figure data-scan-diagram={model.layout}>
 <figcaption>{model.caption}</figcaption><p>{model.description}</p>
 {#if model.layout==='connect'||model.layout==='syn'}<div class="endpoints"><strong>{model.labels[0]}</strong><strong>{model.labels[1]}</strong></div>{/if}
 <div class="rows" class:states={model.layout==='udp'}>
 {#each model.rows as row}
  <section class:left={row.direction==='left'}>
   <h3>{row.title}</h3>
   {#if row.direction!=='none'}<svg class="arrow" aria-hidden="true" viewBox="0 0 300 20" preserveAspectRatio="none"><path d={row.direction==='left'?'M298 10H2L12 2M2 10L12 18':'M2 10H298L288 2M298 10L288 18'}/></svg>{/if}
   <p>{row.body}</p>
  </section>
 {/each}
 </div>
 <h3>{lang==='zh'?'判讀提醒':'Interpretation'}</h3><p>{model.footer}</p><p class="links"><a href={block.src}>{lang==='zh'?'開啟 SVG 原圖':'Open original SVG'}</a><a href={block.src} download>{block.downloadLabel}</a></p>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid #b7c9df;border-radius:1rem;background:#f5f8fb;color:#172b49;min-width:0;font-size:1rem;line-height:1.75;overflow-wrap:anywhere}figcaption{font-size:1.2rem;font-weight:700}p{margin:.6rem 0}h3{font-size:1rem;line-height:1.75;margin:0}.endpoints{display:flex;justify-content:space-between;gap:1rem;margin:1rem 0}.endpoints strong{padding:.5rem;background:#e5efff;border-radius:.5rem}.rows{display:grid;gap:1rem}.rows.states{grid-template-columns:1fr 1fr}section{padding:1rem;border:1px solid #b7c9df;border-radius:.75rem;background:white;min-width:0}.arrow{display:block;width:100%;height:1.25rem;stroke:#245ac5;stroke-width:2;fill:none}.left .arrow{stroke:#007d5c}.left{background:#ecfaf4}.states section:nth-child(1){background:#ecfaf4}.states section:nth-child(2){background:#fff0f0}.states section:nth-child(3){background:#f2efff}.states section:nth-child(4){background:#fff7df}.links{display:flex;flex-wrap:wrap;gap:1rem}@container(max-width:540px){.rows.states{grid-template-columns:1fr}}
</style>
