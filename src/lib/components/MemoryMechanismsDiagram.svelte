<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|4|5|6;lang:'zh'|'en'}=$props();
</script>
<figure class="memory-diagram" class:roles={number===1} class:tokens={number===2} class:summary={number===3} class:flow={number===4||number===6} class:handover={number===5} data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <ol>{#each diagram.items as item,i}<li class:cached={number===2&&i<4} class:new-token={number===2&&i===4} class:result-card={number===4&&i===2} class:new-day={number===6&&i===3}>
  <strong>{item.title}</strong><p>{item.body}</p>
  {#if ((number===3||number===4||number===6)&&i<diagram.items.length-1)||(number===2&&i===3)}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-7-7 7 7 7-7"/></svg>{/if}
 </li>{/each}</ol>
 <p class="description">{diagram.description}</p>
 <a href={`/images/aase/m02-03-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1.25rem;border:1px solid #d5dce0;border-radius:.8rem;background:#fbfcfd;color:#18252c;min-width:0;overflow-wrap:anywhere}figcaption{margin-bottom:1.25rem}strong{font-weight:650}figcaption strong{font-size:1.15rem}strong,p,a{font-size:1rem;line-height:1.8}ol{list-style:none;padding:0;margin:0;display:grid;gap:2.8rem}li{position:relative;margin:0;padding:1rem;min-width:0;border:1px solid #d5dce0;border-radius:.6rem;background:#fff}p{margin:.5rem 0 0}.roles ol{grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.handover ol{gap:0}.handover li{border:0;border-bottom:1px solid #d5dce0;border-radius:0;background:transparent}.tokens ol{grid-template-columns:repeat(5,minmax(0,1fr));gap:.8rem}.tokens li{padding:.6rem .3rem;text-align:center}.cached,.result-card{background:#e8f4ef;border-color:#90c7b9}.new-token{background:#eceffc;border-color:#a6b4ec}.description{margin:1.25rem 0 .75rem}.arrow{position:absolute;top:calc(100% + .3rem);left:calc(50% - .6rem);width:1.2rem;height:2rem;fill:none;stroke:#637982;stroke-width:2}.tokens .arrow{top:calc(50% - 1rem);left:calc(100% - .1rem);width:.8rem;transform:rotate(-90deg)}.summary ol{grid-template-columns:repeat(2,minmax(0,1fr));gap:2.8rem}.summary .arrow{top:calc(50% - 1rem);left:calc(100% + .7rem);transform:rotate(-90deg)}.new-day{border-top:3px solid #84999e}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
 @container(max-width:34rem){.tokens ol{grid-template-columns:1fr;gap:.7rem}.tokens li:nth-child(4){margin-bottom:2rem}.tokens .arrow{top:calc(100% + .2rem);left:calc(50% - .6rem);width:1.2rem;transform:none}.summary ol,.roles ol{grid-template-columns:1fr}.summary .arrow{top:calc(100% + .3rem);left:calc(50% - .6rem);transform:none}}
 @media(max-width:540px){figure{padding:.75rem}}
</style>
