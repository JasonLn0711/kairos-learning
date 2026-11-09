<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2;lang:'zh'|'en'}=$props();
 const icons=['M4 3h10l6 6v12H4V3Zm10 0v6h6M1 13h10m-4-4 4 4-4 4','M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 6 6M7 10l2 2 4-5','m3 17-1 5 5-1L21 7l-5-5L3 17Zm10-12 5 5','M4 3h10l6 6v12H4V3Zm10 0v6h6M8 14l3 3 5-6','M12 2v14m-5-5 5 5 5-5M4 17v5h16v-5'];
</script>
<figure class="mvp-diagram" class:branch={number===1} data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <ol role="list">
 {#each diagram.items as item,i}<li class:outcome={number===1&&i>=2}>
  {#if number===2}<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d={icons[i]}/></svg>{/if}
  <div><strong>{item.title}</strong><p>{item.body}</p></div>
  {#if (number===1&&i<2)||(number===2&&i<4)}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-7-7 7 7 7-7"/></svg>{/if}
 </li>{/each}
 </ol>
 <p class="interpretation">{diagram.description}</p>
 <a href={`/images/aase/m03-04-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;min-width:0;margin:1.5rem 0;padding:1.25rem;border:1px solid #d5dce0;border-radius:.8rem;background:#fbfcfd;color:#18252c;overflow-wrap:anywhere}figcaption{margin-bottom:1.3rem}strong,p,a{font-size:1rem;line-height:1.8}figcaption strong{font-size:1.1rem}ol{list-style:none;padding:0;margin:0;display:grid;gap:2.5rem}li{min-width:0;margin:0;padding:1rem;position:relative;display:flex;gap:1rem}p{margin:.4rem 0 0}.arrow{position:absolute;top:calc(100% + .2rem);left:calc(50% - .6rem);width:1.2rem;height:2rem;fill:none;stroke:#637982;stroke-width:2}.icon{flex:none;width:1.4rem;height:1.4rem;margin-top:.3rem;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}.branch ol{grid-template-columns:repeat(2,minmax(0,1fr));text-align:center}.branch li{justify-content:center}.branch li:nth-child(-n+2){grid-column:1/-1}.outcome{border:1px solid #d5dce0;border-radius:.7rem}.outcome:nth-child(3) strong{color:#006b32}.outcome:nth-child(4) strong{color:#a52e25}.interpretation{margin:1.25rem 0 .75rem}a{display:inline-block}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
 @container(max-width:30rem){.branch ol{grid-template-columns:1fr}.branch li:nth-child(-n+2){grid-column:auto}.branch .outcome{margin-top:0}.branch .outcome:last-child{margin-top:-1.5rem}}
 @media(max-width:540px){figure{padding:.75rem}li{padding:.75rem 0}}
</style>
