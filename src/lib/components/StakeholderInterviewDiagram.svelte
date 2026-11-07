<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3;lang:'zh'|'en'}=$props();
 const icons=['statement','inference','requirement','test'];
</script>
<figure class="stakeholder-diagram" class:process={number===1} class:evidence={number===2} class:comparison={number===3} data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <svelte:element this={number===1?'ol':'ul'} role="list">
 {#each diagram.items as item,i}<li>
  {#if number===2}<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" data-icon={icons[i]}>
   {#if i===0}<path d="M4 4h16v12H9l-5 4V4Zm4 4h8M8 12h6"/>{:else if i===1}<path d="M12 4c-5-4-10 4-6 6-5 4 0 11 6 9V4Zm0 0c5-4 10 4 6 6 5 4 0 11-6 9M8 8v7m8-7v7"/>{:else if i===2}<path d="M9 5H5v16h14V5h-4M9 3h6v5H9V3ZM8 12h8m-8 4h8"/>{:else}<path d="M9 3h6m-4 0v7L5 21h14l-6-11V3M8 16h8"/>{/if}
  </svg>{/if}
  <div><strong>{item.title}</strong>{#each item.body.split('\n\n') as p}<p>{p}</p>{/each}</div>
  {#if number===1&&i<diagram.items.length-1}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-7-7 7 7 7-7"/></svg>{/if}
 </li>{/each}
 </svelte:element>
 <p class="interpretation">{diagram.description}</p>
 <a href={`/images/aase/m03-02-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;min-width:0;margin:1.5rem 0;padding:1.25rem;border:1px solid #d5dce0;border-radius:.8rem;background:#fbfcfd;color:#18252c;overflow-wrap:anywhere}figcaption{margin-bottom:1.3rem}strong,p,a{font-size:1rem;line-height:1.8}figcaption strong{font-size:1.1rem}ul,ol{list-style:none;padding:0;margin:0;display:grid;gap:1rem}li{min-width:0;margin:0;padding:1rem;position:relative}p{margin:.4rem 0 0}.process ol{gap:2.5rem;text-align:center}.process li:last-child{border:1px solid #91bca4;background:#eaf6ef;border-radius:.7rem}.arrow{position:absolute;top:calc(100% + .2rem);left:calc(50% - .6rem);width:1.2rem;height:2rem;fill:none;stroke:#637982;stroke-width:2}.evidence ul{gap:0}.evidence li{display:flex;gap:1rem;border-bottom:1px solid #e0e5e8;align-items:start}.evidence li:last-child{border-bottom:0}.icon{flex:none;width:1.4rem;height:1.4rem;margin-top:.3rem;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}.comparison ul{grid-template-columns:repeat(2,minmax(0,1fr));text-align:center}.interpretation{margin:1.25rem 0 .75rem}a{display:inline-block}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
 @container(max-width:30rem){.comparison ul{grid-template-columns:1fr}}
 @media(max-width:540px){figure{padding:.75rem}.evidence li{padding:.75rem 0}}
</style>
