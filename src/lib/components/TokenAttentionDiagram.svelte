<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 import AttentionDemo from './AttentionDemo.svelte';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|4|5|6;lang:'zh'|'en'}=$props();
</script>
<figure class="token-diagram" class:flow={number===1||number===6} class:tokens={number===2} class:vector={number===3} class:qkv={number===4} data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===5}<AttentionDemo {lang}/><h3>{lang==='zh'?'下載圖的靜態預設值':'Static defaults in the downloadable diagram'}</h3>{/if}
 <ol>{#each diagram.items as item,i}<li class:teal={(number===1&&i===3)||(number===2&&i===1)||(number===4&&i===1)} class:orange={(number===6&&i===2)||(number===4&&i===2)||(number===5&&i===1)}>
  {#if number===4}<span class="badge" aria-hidden="true">{['Q','K','V'][i]}</span>{/if}
  <div><strong>{item.title}</strong><p>{item.body}</p></div>
  {#if (number===1||number===6)&&i<diagram.items.length-1}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-7-7 7 7 7-7"/></svg>{/if}
 </li>{/each}</ol>
 <p class="description">{diagram.description}</p>
 <a href={`/images/aase/m02-01-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1.25rem;border:1px solid #cbd7df;border-radius:1rem;background:#fbfcfd;color:#18252c;min-width:0;overflow-wrap:anywhere}figcaption{margin-bottom:1.25rem}figcaption strong{font-size:1.15rem}strong,p,a{font-size:1rem;line-height:1.8}ol{list-style:none;padding:0;margin:0;display:grid;gap:1rem}li{position:relative;margin:0;padding:1rem;min-width:0;border:1px solid #9bb9dd;border-radius:.7rem;background:#edf4ff}p{margin:.5rem 0 0}.teal{background:#edf8f5;border-color:#79aaa0}.orange{background:#fff4e9;border-color:#c8a17c}.description{margin:1.25rem 0 .75rem}.flow ol{gap:2.7rem;text-align:center}.arrow{position:absolute;top:calc(100% + .3rem);left:calc(50% - .6rem);width:1.2rem;height:2rem;fill:none;stroke:#5a7186;stroke-width:2}.tokens ol{grid-template-columns:repeat(2,minmax(0,1fr))}.tokens li{text-align:center}.tokens li p{font-size:1.25rem}.vector ol{grid-template-columns:repeat(4,minmax(0,1fr));text-align:center}.vector li{padding:.8rem .3rem}.vector li strong{font-size:1.4rem}.qkv li{display:flex;gap:1rem;align-items:center}.badge{font-size:1.5rem;font-weight:700;flex:none;padding:.6rem;background:#dbe9fc;border-radius:.5rem}.teal .badge{background:#cee9df}.orange .badge{background:#f9dfc6}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
 @container(max-width:30rem){.tokens ol{grid-template-columns:1fr}.vector ol{grid-template-columns:repeat(2,minmax(0,1fr))}.qkv li{align-items:flex-start;gap:.5rem}}
 @media(max-width:540px){figure{padding:.75rem}}
</style>
