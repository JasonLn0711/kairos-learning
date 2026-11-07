<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|4|5|6|7;lang:'zh'|'en'}=$props();
</script>
<figure class="problem-statement" class:parallel={number===1||number===5} class:workflow={number===4} class:artifacts={number===6} class:sequence={number===7} data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <ol>{#each diagram.items as item,i}<li class:changed={number===4&&i===4} class:new-flow={number===4&&i===3}>
  <strong>{item.title}</strong><p>{item.body}</p>
  {#if ((number===4&&i!==2)||(number===6)||(number===7))&&i<diagram.items.length-1}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-7-7 7 7 7-7"/></svg>{/if}
 </li>{/each}</ol>
 <p class="description">{diagram.description}</p>
 <a href={`/images/aase/m03-01-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1.25rem;background:#fbfcfd;border:1px solid #d5dce0;border-radius:.8rem;color:#18252c;min-width:0;overflow-wrap:anywhere}figcaption{margin-bottom:1.25rem}strong,p,a{font-size:1rem;line-height:1.8}figcaption strong{font-size:1.15rem}ol{list-style:none;padding:0;margin:0;display:grid;gap:1rem}li{position:relative;padding:1rem;margin:0;border:1px solid #d5dce0;border-radius:.5rem;background:white;min-width:0}p{margin:.5rem 0 0}.parallel ol{grid-template-columns:repeat(2,minmax(0,1fr))}.workflow ol,.sequence ol{gap:2.8rem}.arrow{position:absolute;top:calc(100% + .3rem);left:calc(50% - .6rem);width:1.2rem;height:2rem;fill:none;stroke:#637982;stroke-width:2}.workflow .new-flow{margin-top:1.8rem}.workflow .changed{background:#e7f2ef;border-color:#81b7aa}.artifacts ol{grid-template-columns:repeat(2,minmax(0,1fr));gap:3rem 2.8rem}.artifacts li:last-child{grid-column:1/-1}.artifacts li:first-child .arrow{top:calc(50% - 1rem);left:calc(100% + .8rem);transform:rotate(-90deg)}.artifacts li:nth-child(2) .arrow{left:0}.description{margin:1.25rem 0 .75rem}a{display:inline-block}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
 @container(max-width:32rem){.parallel ol,.artifacts ol{grid-template-columns:1fr}.artifacts li:first-child .arrow,.artifacts li:nth-child(2) .arrow{top:calc(100% + .3rem);left:calc(50% - .6rem);transform:none}}
 @media(max-width:540px){figure{padding:.75rem}}
</style>
