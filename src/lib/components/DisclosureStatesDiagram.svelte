<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:number;lang:'zh'|'en'}=$props();
</script>
<figure class="disclosure-diagram" class:comparison={number===1||number===3} class:settings={number===2} class:accordion={number===4} class:states={number===5} class:invalidation={number===6} data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <ul role="list">
 {#each diagram.items as item,i}
  <li class:advanced={number===2&&i===2} class:incorrect={(number===3&&i===0)||(number===6&&i===2)} class:correct={(number===3&&i===1)||(number===6&&i===3)} class:expanded={number===4&&i===1}>
   <h3>{#if number===5}<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/>{#if i===3}<path d="m7 12 3 3 7-7"/>{:else if i===2}<path d="M12 6v8m0 3v1"/>{:else if i===1}<path d="M12 5v7l4 3"/>{:else}<path d="M7 12h10m-5-5v10"/>{/if}</svg>{/if}{item.title}</h3>
   {#each item.body.split('\n\n') as part,j}
    <p class:depicted-action={(number===1&&(part==='列印'||part==='Print'))||(number===5&&j===item.body.split('\n\n').length-2)} class:entry={(number===1&&j===3)||(number===3&&i===1&&j===3)} class:note={(number===1||number===5)&&j===item.body.split('\n\n').length-1}>{part}</p>
   {/each}
   {#if number===6&&i<2}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v17m-6-6 6 6 6-6"/></svg>{/if}
  </li>
 {/each}
 </ul>
 <p class="interpretation">{diagram.description}</p>
 <a href={`/images/aase/m04-05-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid #d4dce1;border-radius:1rem;background:#fbfcfd;color:#18252c}figcaption{font-size:1rem;line-height:1.8;margin-bottom:1rem}ul{display:grid;list-style:none;margin:0;padding:0;gap:1rem}li{min-width:0;position:relative;padding:1rem;margin:0;border:1px solid #d4dce1;border-radius:.8rem;background:#fff;overflow-wrap:anywhere}h3{display:flex;align-items:baseline;gap:.5rem;margin:0 0 1rem;font-size:1rem;line-height:1.8}p{font-size:1rem;line-height:1.8;margin:.5rem 0;white-space:pre-line}.comparison ul,.states ul{grid-template-columns:repeat(2,minmax(0,1fr))}.depicted-action{padding:.5rem;background:#f0f1f2;border-radius:.5rem;text-align:center;margin:1rem 0}.entry{border-top:1px solid #d4dce1;padding-top:.75rem}.note{color:#505b61;border-top:1px solid #d4dce1;padding-top:.75rem}.settings ul{max-width:38rem;margin:auto;border-radius:1.8rem;border:1px solid #d4dce1;gap:0;background:white;overflow:hidden}.settings li{border:0;border-bottom:1px solid #d4dce1;border-radius:0;padding:1.5rem}.settings .advanced{border:4px solid #ec874d;border-radius:1rem;margin:.5rem}.incorrect h3{color:#8e2424;background:#fce1e1;padding:.5rem}.correct h3{color:#145b38;background:#d9efe1;padding:.5rem}.accordion ul{gap:0;border:2px solid #18252c}.accordion li{border:0;border-bottom:2px solid #18252c;border-radius:0}.accordion li:last-child{border-bottom:0}.accordion h3{margin:0}.accordion p{color:#505b61}.accordion .expanded p{border-top:1px solid #d4dce1;margin-top:1rem;padding:1rem 0;color:#18252c}.invalidation ul{grid-template-columns:repeat(2,minmax(0,1fr))}.invalidation li:nth-child(-n+2){grid-column:1/-1;text-align:center;border:0;background:transparent;margin-bottom:1.5rem}.invalidation li:nth-child(-n+2) h3{justify-content:center}.arrow{position:absolute;width:24px;height:24px;left:calc(50% - 12px);bottom:-1.7rem;stroke:#65757c;fill:none;stroke-width:1.8}h3 svg{width:20px;height:20px;flex:none;fill:none;stroke:currentColor;stroke-width:1.7;align-self:center}.interpretation{margin-top:1rem}a{font-size:1rem;line-height:1.8}a:focus-visible{outline:3px solid #b15840;outline-offset:4px}
 @container(max-width:38rem){.comparison ul,.states ul,.invalidation ul{grid-template-columns:1fr}li{padding:.75rem}.settings li{padding:1rem}.settings .advanced{padding:.75rem}}
</style>
