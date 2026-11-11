<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|4;lang:'zh'|'en'}=$props();
</script>
<figure class="hci-diagram" data-figure={number} class:lenses={number===1} class:overlap={number===2} class:journey={number===3} class:comparison={number===4}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <div class="diagram-body">
 {#if number===2}
 <svg class="circles" aria-hidden="true" viewBox="0 0 700 540"><circle cx="245" cy="220" r="190" fill="#d9efe1"/><circle cx="455" cy="220" r="190" fill="#f9dfd9"/><circle cx="350" cy="350" r="190" fill="#e5dff5"/><path d="M350 62C279 110 245 183 245 220c0 58 47 108 105 130 58-22 105-72 105-130 0-37-34-110-105-158Z" fill="#fbfcfd" stroke="#65757c" stroke-dasharray="5 5"/></svg>
 {/if}
 <ul role="list">
 {#each diagram.items as item,i}
 <li class:shared={number===2&&i===3}>
 {#if number===1}<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">{#if i===0}<rect x="2" y="3" width="15" height="12" rx="2"/><path d="M7 19h7m-4-4v4m10-9h3v10h-6V10h3"/>{:else if i===1}<path d="M12 4c-3-5-9 0-6 4-5 1-3 8 0 8 0 5 6 5 6 1V4Zm0 0c3-5 9 0 6 4 5 1 3 8 0 8 0 5-6 5-6 1M8 8v5m8-5v5"/>{:else}<path d="m4 17 4 4 4-4-4-4-4 4Zm6-7 4 4 4-4-4-4-4 4Zm6-6 4 4 3-3-4-4-3 3Z"/>{/if}</svg>{/if}
 <div class="content"><strong class="item-title">{item.title}</strong>
 {#each item.body.split('\n\n') as p,j}
 <p class:screen-title={number===4&&j===0} class:action={number===4&&j===(i===0?2:3)} class:note={number===4&&j===item.body.split('\n\n').length-1}>
 {#if number===4&&j===0}<svg class="check" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 6-7"/></svg>{/if}{p}</p>
 {/each}</div>
 {#if number===3&&[0,2,3].includes(i)}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v17m-6-6 6 6 6-6"/></svg>{/if}
 </li>{/each}
 </ul>
 </div>
 <p class="interpretation">{diagram.description}</p>
 <a href={`/images/aase/m04-01-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:#fbfcfd;color:#18252c}figcaption{font-size:1rem;line-height:1.8;margin-bottom:1rem}.diagram-body{position:relative}ul{list-style:none;padding:0;margin:0;display:grid;gap:1rem}li{min-width:0;margin:0;position:relative;overflow-wrap:anywhere;display:flex;gap:1rem;padding:1rem;border:1px solid #d5dce0;border-radius:.8rem}.content{min-width:0;flex:1}p{font-size:1rem;line-height:1.8;margin:.5rem 0;white-space:pre-line}.item-title{font-size:1rem;line-height:1.8}.icon{width:24px;height:24px;flex:none;fill:none;stroke:currentColor;stroke-width:1.6;margin-top:.3rem}.lenses li{border:0;border-radius:0;border-bottom:1px solid #d5dce0}.lenses li:last-child{border-bottom:0}.comparison ul{grid-template-columns:repeat(2,minmax(0,1fr))}.comparison .item-title{color:#505b61}.screen-title{font-weight:700;display:flex;align-items:center;gap:.5rem;margin-top:1.5rem}.check{width:22px;height:22px;flex:none;fill:none;stroke:#087337;stroke-width:1.8}.action{background:#f0f1f2;border-radius:.5rem;padding:.4rem;text-align:center;margin:1rem 0}.note{color:#505b61}.interpretation{margin-top:1rem}a{font-size:1rem;line-height:1.8}a:focus-visible{outline:3px solid #b15840;outline-offset:4px}
 .circles{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.overlap ul{position:relative;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:auto auto auto;gap:.8rem;min-height:32rem;align-items:center}.overlap li{border:0;padding:.6rem;background:#fbfcfde8}.overlap li:nth-child(1){grid-area:1/1}.overlap li:nth-child(2){grid-area:1/3}.overlap li:nth-child(3){grid-area:3/2}.overlap li.shared{grid-area:2/2;border:1px dashed #65757c;text-align:center;background:#fbfcfd}.journey ul{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:3rem}.journey li:nth-child(1),.journey li:nth-child(4),.journey li:nth-child(5){grid-column:1/-1;text-align:center}.journey li:nth-child(1),.journey li:nth-child(4){border:0}.journey li:nth-child(3) .arrow{left:-1.5rem}.arrow{position:absolute;left:calc(50% - 12px);bottom:-2.5rem;width:24px;height:24px;stroke:#65757c;fill:none;stroke-width:1.6}
 @container(max-width:38rem){.comparison ul,.overlap ul,.journey ul{grid-template-columns:1fr}.overlap ul{min-height:0}.overlap li:nth-child(n){grid-area:auto;border:1px solid #65757c}.overlap li:nth-child(1){background:#d9efe1}.overlap li:nth-child(2){background:#f9dfd9}.overlap li:nth-child(3){background:#e5dff5}.circles{display:none}.journey li:nth-child(n){grid-column:auto}.journey li:nth-child(2),.journey li:nth-child(3){border-left:4px solid #65757c}.journey li:nth-child(2){margin-bottom:-2rem}.journey li:nth-child(3) .arrow{left:calc(50% - 12px)}li{padding:.6rem}}
</style>
