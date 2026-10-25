<script lang="ts">
 import specs from '$lib/m0402-diagrams.json';
 let {id,lang='zh'}:{id:keyof typeof specs;lang?:string}=$props();
 const spec=$derived(specs[id]);
 const locale=$derived(lang==='en'?'en':'zh');
 const d=$derived(spec[locale]);
</script>
<figure class="dns-diagram" data-dns-diagram={id} aria-label={d.title}>
 <figcaption><strong>{d.title}</strong><p>{d.caption}</p></figcaption>
 {#if id==='resolution'}
  {@const r=specs.resolution[locale]}
  <div class="endpoint">{r.client}</div>
  <p class="connector">↓ {locale==='zh'?'查詢':'Query'}</p>
  <div class="resolver"><strong>{r.resolver}</strong><span>{r.resolverEn}</span></div>
  <p class="cache">✓ {r.hit} → {r.result}</p>
  <p class="branch">{r.miss} ↓</p>
  <ol class="exchanges">{#each r.items as item,i}<li>
   <span class="step">{i+1}</span><div class="exchange"><span>{r.resolver} →</span><strong>{item.title} · {item.body}</strong><span>← {item.after}</span></div>
  </li>{/each}</ol>
  <p class="result">{r.resolver} → {r.client.split(locale==='zh'?'想查':' asks')[0]}：{r.result}</p>
  <p class="note">{r.note}</p>
 {:else}
  <ol class:cards={spec.layout==='cards'}>{#each d.items as item,i}<li>
   <div class="card" class:tint={(id==='lookup'&&i===1)||(id==='cname'&&i===2)}>
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">{#if id==='axfr'&&i===1}<rect x="7" y="7" width="14" height="15" rx="2"/><path d="M17 7V2H2v15h5M11 12h6M11 16h6"/>{:else if id==='axfr'}<path d="M13 21H3V2h14v7M6 6h8M6 10h5"/><circle cx="16" cy="15" r="4"/><path d="m19 18 3 4"/>{:else if id==='lookup'&&i===1}<path d="M12 5C9 2 5 2 2 3v17c4-1 7-1 10 1 3-2 6-2 10-1V3c-3-1-7-1-10 2Zm0 0v16"/>{:else if id==='lookup'&&i===2}<rect x="3" y="2" width="18" height="8" rx="2"/><rect x="3" y="14" width="18" height="8" rx="2"/><path d="M7 6h3M7 18h3"/>{:else}<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 22h8M12 18v4M7 9h10M7 13h6"/>{/if}</svg>
    <div><strong>{item.title}</strong><p>{item.body}</p></div>
   </div>
   {#if spec.layout==='cards'}<p class="analogy">{item.after}</p>{:else if i<d.items.length-1}<p class="connector">↓ {item.after}</p>{/if}
  </li>{/each}</ol>
 {/if}
 <a href={'/images/ceh/m04-02-'+id+'-'+locale+'.svg'} download>{locale==='zh'?'下載 SVG 圖解':'Download SVG diagram'} — {d.title}</a>
</figure>
<style>
 .dns-diagram{margin:1.5rem 0;padding:1.25rem;background:#f7f5ef;color:#303632;border:1px solid #778d80;border-radius:16px;line-height:1.65;overflow-wrap:anywhere}
 figcaption>strong{font-size:1.15rem}figcaption p,.note{font-size:.9rem;margin:.5rem 0 1rem}ol{padding:0;margin:1rem 0;list-style:none}li{margin:0;min-width:0}.card,.endpoint,.resolver{display:flex;align-items:center;gap:.8rem;padding:1rem;border:1px solid #778d80;border-radius:12px;background:#fffef9}.card strong{display:block}.card p{margin:.25rem 0 0}.card svg{width:24px;height:24px;flex-shrink:0;color:#24553c}.tint{background:#e8f0f5}.connector{text-align:center;margin:.45rem 0;font-size:.95rem;color:#24553c}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.cards li{border:1px solid #778d80;border-radius:12px;background:#fffef9;padding:.8rem}.cards .card{padding:0;border:0}.analogy{white-space:pre-line;margin:.8rem 0 0}.resolver{background:#dde3db;flex-wrap:wrap;justify-content:center}.resolver span{font-size:.9rem}.cache{padding:.8rem;border-left:3px solid #24553c;background:#e9f1e9}.branch{font-weight:650}.exchanges{display:grid;gap:.7rem}.exchanges li{display:flex;gap:.7rem;border:1px solid #778d80;background:#fffef9;padding:.9rem;border-radius:12px}.step{color:#24553c;font-weight:700}.exchange{display:flex;flex-direction:column;gap:.25rem}.exchange span{font-size:.9rem}.result{padding:.8rem;background:#dde3db;border-radius:10px}.note{border-left:3px solid #778d80;padding-left:.8rem}a{color:#17553c;display:inline-block;margin-top:.5rem}a:focus-visible{outline:3px solid #17664b;outline-offset:4px}@media(max-width:540px){.dns-diagram{padding:.8rem}.cards{grid-template-columns:1fr}.card{padding:.8rem}}
</style>
