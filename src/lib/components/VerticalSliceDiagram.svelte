<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|3;lang:'zh'|'en'}=$props();
</script>
<figure class="slice-diagram" data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===1}
 <div class="comparison">
  <section><h3>{diagram.items[0].title}</h3><ul>{#each diagram.items[0].body.split('\n') as layer}<li>{layer}</li>{/each}</ul></section>
  <section><h3>{lang==='zh'?'垂直切片開發':'Vertical slices'}</h3><div class="slices">{#each diagram.items.slice(1) as item,i}<div class:active={i===0}><strong>{item.title}</strong><ul>{#each item.body.split('\n') as layer}<li>{layer}</li>{/each}</ul></div>{/each}</div></section>
 </div>
 {:else}
 <ol>{#each diagram.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ol>
 {/if}
 <p>{diagram.description}</p>
 <a href={`/images/aase/m07-03-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;border:1px solid #d5dce0;background:#fbfcfd;color:#18252c;padding:1rem;border-radius:1rem;margin:1.5rem 0}figcaption,h3,strong,p,a,li{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}figcaption{margin-bottom:1rem}h3{margin:0 0 .5rem}.comparison{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}.comparison section{min-width:0}.comparison ul{list-style:none;padding:0;margin:0;display:grid;gap:.4rem}.comparison li{background:#e2e6e9;text-align:center;border-radius:.3rem;padding:.4rem}.slices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.4rem}.slices>div{padding:.4rem;background:#eceef0;border-radius:.4rem;min-width:0;text-align:center}.slices .active{background:#def1e6}.slices .active li{background:#b3dfc8}.slices li{background:#d5dbe0}ol{padding-left:1.7rem}ol li{padding:0 0 1rem .4rem}ol li:last-child{padding-bottom:0}ol p{margin:.3rem 0}p{margin:1rem 0}a:focus-visible{outline:3px solid #b15840;outline-offset:4px}@container(max-width:38rem){.comparison{grid-template-columns:1fr}.slices{grid-template-columns:1fr}.slices>div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:.6rem;align-items:center}}
</style>
