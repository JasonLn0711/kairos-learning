<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3;lang:'zh'|'en'}=$props();
</script>
<figure data-tdd-figure={number} class:cycle={number===1} class:results={number===2}>
 <figcaption><strong>{diagram.caption}</strong><p>{diagram.description}</p></figcaption>
 <div class="nodes">
  <ol>{#each diagram.items as item,i}<li class:red={number!==3&&i===0} class:green={number!==3&&i===1} class:blue={number!==3&&i===2}><strong>{item.title}</strong><p>{item.body}</p>{#if number!==2&&i<diagram.items.length-1}<span class="arrow" aria-hidden="true">↓</span>{/if}</li>{/each}</ol>
  {#if number===1}<div class="return" aria-hidden="true"><span>←</span></div>{/if}
 </div>
 {#if number===1}<p class="next">{lang==='zh'?'選下一個小要求，回到 Red，重複循環。':'Select the next small requirement, return to Red and repeat.'}</p>{/if}
 <a href={`/images/aase/m08-02-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1.25rem;border:1px solid #d5dce0;border-radius:.8rem;background:#fbfcfd;color:#18252c;min-width:0;overflow-wrap:anywhere}strong,p,a,li{font-size:1rem;line-height:1.8}figcaption>strong{font-size:1.15rem}p{margin:.5rem 0 0}figcaption{margin-bottom:1.25rem}.nodes{position:relative}ol{display:grid;gap:3rem;list-style:none;padding:0;margin:0}li{position:relative;padding:1rem;border:1px solid #d5dce0;border-radius:.8rem;background:#fff;min-width:0}.arrow{position:absolute;top:calc(100% + .4rem);left:calc(50% - .5rem);font-size:1.4rem;line-height:1.7}.cycle ol{margin-right:2rem}.return{position:absolute;right:0;top:2rem;bottom:2rem;width:1.5rem;border:2px dashed #7c8792;border-left:0;border-radius:0 1rem 1rem 0;pointer-events:none}.return span{position:absolute;top:-1rem;left:-.2rem;font-size:1.3rem}.next{text-align:center;font-weight:650}.red{border-color:#c43c46;background:#fcf1f2}.green{border-color:#16804d;background:#edf8f2}.blue{border-color:#3477c6;background:#eef4fc}.results ol{grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.results li{text-align:center}.results li p{font-weight:650}a{display:inline-block;margin-top:1.5rem}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}@container(max-width:30rem){.results ol{grid-template-columns:1fr}.cycle ol{margin-right:1.5rem}.return{width:1rem}}@media(max-width:540px){figure{padding:.75rem}}
</style>
