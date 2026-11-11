<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,lang}:{diagram:ConceptVisual;number:1|2;lang:'zh'|'en'}=$props();
 // Validated graph shapes select layouts without changing the shared caller’s legacy hint.
 const number=$derived(diagram.kind==='flow'&&diagram.items.length===5?1:diagram.items.length);
</script>
<figure class="mvp-diagram" class:states={number===3} class:decision={number===5} class:stale={number===4} class:sequence={diagram.kind==='flow'} data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===5}
 <div class="change-flow">
  {#each diagram.items.slice(0,2) as item}<div class="node"><strong>{item.title}</strong><p>{item.body}</p></div><span class="connector" aria-hidden="true">↓</span>{/each}
  <div class="alternatives"><p class="branch-label">{lang==='zh'?'依判斷選擇一條分支':'Choose one branch based on the decision'}</p><ul class="nodes">{#each diagram.items.slice(2,4) as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul></div>
  <span class="connector" aria-hidden="true">↓</span>
  <div class="node"><strong>{diagram.items[4].title}</strong><p>{diagram.items[4].body}</p></div>
 </div>
 {:else}
 <svelte:element this={diagram.kind==='flow'?'ol':'ul'} class="nodes" role="list">
 {#each diagram.items as item,i}<li>
  <strong>{item.title}</strong><p>{item.body}</p>
  {#if (diagram.kind==='flow'&&i<diagram.items.length-1)||(number===4&&i===0)}<span class="arrow" aria-hidden="true">↓</span>{/if}
 </li>{/each}
 </svelte:element>
 {/if}
 <p class="interpretation">{diagram.description}</p>
 <a href={`/images/aase/m03-04-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;min-width:0;margin:1.5rem 0;padding:1.25rem;border:1px solid #718188;border-radius:.8rem;background:#fbfcfd;color:#18252c;overflow-wrap:anywhere}figcaption{margin-bottom:1.3rem}strong,p,a{font-size:1rem;line-height:1.8}figcaption strong{font-size:1.1rem}.nodes{list-style:none;padding:0;margin:0;display:grid;gap:2.5rem}li{min-width:0;margin:0;padding:1rem;position:relative;border:1px solid #718188;border-radius:.6rem}p{margin:.4rem 0 0;white-space:pre-line}.arrow{position:absolute;top:100%;left:calc(50% - .6rem);font-size:1.3rem;line-height:2.5rem;color:#526770}.states .nodes{grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.states li:first-child{background:#eaf6ef}.stale li:nth-child(3){background:#faeef0}.stale li:nth-child(4){background:#eaf6ef}.change-flow{text-align:center}.node{padding:1rem;border:1px solid #718188;border-radius:.6rem}.connector{display:block;line-height:2.5rem;font-size:1.3rem;color:#526770}.alternatives{padding:1rem;border:1px dashed #718188;border-radius:.6rem}.branch-label{margin:0 0 1rem}.alternatives .nodes{grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.interpretation{margin:1.25rem 0 .75rem}a{display:inline-block}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
 @container(max-width:32rem){.states .nodes,.alternatives .nodes{grid-template-columns:1fr}}
 @media(max-width:540px){figure{padding:.75rem}li{padding:.75rem}}
</style>
