<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:number;lang:'zh'|'en'}=$props();
</script>
<figure class:comparison={number===1} data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if diagram.kind==='flow'}
  <ol>{#each diagram.items as item,i}<li><div><span class="badge" aria-hidden="true">{i+1}</span><div><strong>{item.title}</strong><p>{item.body}</p></div></div>{#if i<diagram.items.length-1}<span class="arrow" aria-hidden="true">↓</span>{/if}</li>{/each}</ol>
 {:else}
  <ul>{#each diagram.items as item}<li><strong>{item.title}</strong>{#if number===1}<ul>{#each item.body.split('\n') as line}<li>{line}</li>{/each}</ul>{:else}<p>{item.body}</p>{/if}</li>{/each}</ul>
 {/if}
 <p>{diagram.description}</p>
 <a href={`/images/aase/m09-04-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid #d6dddd;border-radius:1rem;background:#fbfcfc;color:#18252c}figcaption,p,strong,a,li{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}figcaption{margin-bottom:1rem}ul,ol{list-style:none;padding:0;margin:0}li{min-width:0}figure>ul>li{padding:1rem 0;border-bottom:1px solid #d6dddd}figure>ul>li:last-child{border-bottom:0}.comparison>ul{display:grid;gap:1.5rem}.comparison>ul>li{padding:.5rem;border:0}ol li>div{display:flex;gap:1rem;padding:.6rem 0}.badge{flex:none;display:grid;place-items:center;width:2rem;height:2rem;background:#edf1f1;border-radius:.7rem}.arrow{display:block;text-align:center;color:#526367;font-size:1.5rem}p{margin:.4rem 0}a{color:#075f87;text-decoration:underline}a:focus-visible{outline:3px solid #b15840;outline-offset:4px}@container(min-width:36rem){.comparison>ul{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>
