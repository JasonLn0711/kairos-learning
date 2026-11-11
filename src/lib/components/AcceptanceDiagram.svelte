<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3;lang:'zh'|'en'}=$props();
</script>
<figure class:scenario-list={number===2} class:evidence-chain={number===3} data-acceptance-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <ol>{#each diagram.items as item,i}<li>
  {#if number===2}<span class="status" aria-hidden="true">{['✓','!','□','↻'][i]}</span>{/if}
  <div><strong>{item.title}</strong><p>{item.body}</p></div>
  {#if number!==2&&i<diagram.items.length-1}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-7-7 7 7 7-7"/></svg>{/if}
 </li>{/each}</ol>
 <p class="description">{diagram.description}</p>
 <a href={`/images/aase/m05-03-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{margin:1.5rem 0;padding:1.25rem;border:1px solid #d5dce0;border-radius:.8rem;background:#fbfcfd;color:#18252c;min-width:0;overflow-wrap:anywhere}figcaption{margin-bottom:1.25rem}strong,p,a{font-size:1rem;line-height:1.8}figcaption strong{font-size:1.15rem}ol{list-style:none;padding:0;margin:0;display:grid;gap:2.8rem}li{position:relative;margin:0;padding:.5rem;min-width:0}p{margin:.5rem 0 0}.arrow{position:absolute;top:calc(100% + .3rem);left:calc(50% - .6rem);width:1.2rem;height:2rem;fill:none;stroke:#637982;stroke-width:2}.scenario-list ol{gap:0}.scenario-list li{display:flex;gap:1rem;padding:1.2rem 0;border-bottom:1px solid #d5dce0}.scenario-list li:last-child{border:0}.status{flex:none;width:1.2rem;font-size:1.2rem;line-height:1.8}.scenario-list li:first-child .status{color:#176841}.scenario-list li:nth-child(2) .status{color:#a12e23}.evidence-chain li{text-align:center}.description{margin:1.25rem 0 .75rem}a{display:inline-block;margin-top:.5rem}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
 @media(max-width:540px){figure{padding:.75rem}.scenario-list li{gap:.6rem}}
</style>
