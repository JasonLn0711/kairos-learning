<script lang="ts">
 import visuals from '$lib/m0401-visuals.json';
 let {id,lang}:{id:keyof typeof visuals;lang:string}=$props();
 const spec=$derived(visuals[id]);const d=$derived(spec[lang==='zh'?'zh':'en']);
</script>
<details class="visual-supplement" data-visual={id}>
 <summary>{lang==='zh'?'輔助圖解：':'Visual aid: '}{d.title}</summary>
 <figure>
  <figcaption>{d.caption}</figcaption>
  {#if spec.layout==='flow'}<ol>{#each d.items as item,i}<li><span class="symbol" aria-hidden="true">{i+1}</span><div><strong>{item.title}</strong><p>{item.body}</p></div></li>{/each}</ol>
  {:else}<ul>{#each d.items as item}<li><span class="symbol" aria-hidden="true">◇</span><div><strong>{item.title}</strong><p>{item.body}</p></div></li>{/each}</ul>{/if}
  <a href={'/images/ceh/m04-01-'+id+'-'+lang+'.svg'} download>{lang==='zh'?'下載 SVG 圖解':'Download SVG diagram'}</a>
 </figure>
</details>
<style>
 .visual-supplement{margin:1rem 0;border:1px solid #778d80;border-radius:12px;background:#f7f5ef;color:#303632;padding:.85rem}summary{cursor:pointer;font-weight:650;line-height:1.6}summary:focus-visible,a:focus-visible{outline:3px solid #17664b;outline-offset:3px}figure{margin:1rem 0 0}figcaption{line-height:1.7;margin-bottom:.8rem;overflow-wrap:anywhere}ul,ol{list-style:none;padding:0;margin:0 0 1rem;display:grid;gap:.7rem}ul{grid-template-columns:repeat(2,minmax(0,1fr))}li{display:flex;gap:.6rem;min-width:0;padding:.8rem;background:#fffef9;border:1px solid #778d80;border-radius:8px}li p{margin:.4rem 0 0;line-height:1.65;overflow-wrap:anywhere}.symbol{color:#24553c}strong{overflow-wrap:anywhere}a{color:#17553c}@media(max-width:540px){ul{grid-template-columns:1fr}}
</style>
