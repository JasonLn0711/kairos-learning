<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,lang}:{diagram:ConceptVisual;lang:'zh'|'en'}=$props();
 const number=$derived(diagram.kind==='flow'?1:2);
</script>
<figure class="acceptance-evidence" data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if diagram.kind==='flow'}
  <ol>{#each diagram.items as item,i}<li><div class:observed={i===3}><strong>{i+1}. {item.title}</strong><p>{item.body}</p></div>{#if i<diagram.items.length-1}<span class="arrow" aria-hidden="true">↓</span>{/if}</li>{/each}</ol>
 {:else}
  <ul>{#each diagram.items as item,i}<li><span class="symbol" aria-hidden="true">{['⊗','✓','↻'][i]}</span><div><strong>{item.title}</strong>{#each item.body.split('\n') as paragraph}<p>{paragraph}</p>{/each}</div></li>{/each}</ul>
 {/if}
 <p>{diagram.description}</p>
 <a href={`/images/aase/m09-03-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{margin:1.5rem 0;padding:1rem;border:1px solid #d6dddd;border-radius:1rem;background:#fbfcfc;color:#18252c}figcaption,p,strong,a{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}figcaption{margin-bottom:1rem}ul,ol{list-style:none;padding:0;margin:0}ol li{text-align:center;margin:0}ol li>div{padding:1rem;border:1px solid transparent;border-radius:.8rem}.observed{background:#eaf3f0;border-color:#a6cdc4!important}p{margin:.4rem 0}.arrow{display:block;color:#526367;font-size:1.5rem;line-height:1.8}ul li{display:flex;gap:.8rem;padding:1rem 0;border-bottom:1px solid #d6dddd}ul li:last-child{border-bottom:0}.symbol{flex:none;font-size:1.3rem;line-height:1.8;color:#526367}ul li:first-child .symbol{color:#a42b30}ul li:nth-child(2) .symbol{color:#246b45}li div{min-width:0}a{color:#075f87;text-decoration:underline}a:focus-visible{outline:3px solid #b15840;outline-offset:4px}
</style>
