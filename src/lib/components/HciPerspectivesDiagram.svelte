<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|4|5;lang:'zh'|'en'}=$props();
</script>
<figure class="hci-diagram" data-figure={number} class:flow={number===1} class:lenses={number===2} class:comparison={number===3} class:requirement={number===4} class:tasks={number===5}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===4}<p>{diagram.description}</p>{/if}
 <svelte:element this={number===1||number===5?'ol':'ul'} role="list">
 {#each diagram.items as item,i}
 <li>
 {#if number===2}<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">{#if i===0}<path d="M12 4c-3-5-9 0-6 4-5 1-3 8 0 8 0 5 6 5 6 1V4Zm0 0c3-5 9 0 6 4 5 1 3 8 0 8 0 5-6 5-6 1M8 8v5m8-5v5"/>{:else if i===1}<path d="m7 5 2 15 4-5 5-1L7 5Zm-3-3L2 0m10 3 1-3M3 10H0"/>{:else}<rect x="2" y="2" width="7" height="7" rx="1"/><rect x="15" y="15" width="7" height="7" rx="1"/><path d="M5 9v9h10"/>{/if}</svg>{/if}
 <div class="content"><strong class="item-title">{item.title}</strong>
 {#if number===1||number===5}<span class="sr-only">{item.body}</span>{:else}
 {#each item.body.split('\n\n') as p,j}
 <p class:screen-title={number===3&&j===0} class:action={number===3&&j===(i===0?2:3)} class:note={number===3&&j===item.body.split('\n\n').length-1}>
 {#if number===3&&j===0}<svg class="check" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 6-7"/></svg>{/if}{p}</p>
 {/each}{/if}</div>
 {#if (number===1||number===5)&&i<diagram.items.length-1}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 24"><path d="M3 12h17m-6-6 6 6-6 6"/></svg>{/if}
 </li>{/each}
 </svelte:element>
 {#if number!==4}<p class="interpretation">{diagram.description}</p>{/if}
 <a href={`/images/aase/m04-01-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:#fbfcfd;color:#18252c}figcaption{font-size:1rem;line-height:1.8;margin-bottom:1rem}ul,ol{list-style:none;padding:0;margin:0;display:grid;gap:1rem}li{min-width:0;margin:0;position:relative;overflow-wrap:anywhere;display:flex;gap:1rem;padding:1rem;border:1px solid #d5dce0;border-radius:.8rem}.content{min-width:0;flex:1}p{font-size:1rem;line-height:1.8;margin:.5rem 0;white-space:pre-line}.item-title{font-size:1rem;line-height:1.8}.icon{width:24px;height:24px;flex:none;fill:none;stroke:currentColor;stroke-width:1.6;margin-top:.3rem}.flow ol{grid-template-columns:repeat(4,minmax(0,1fr));gap:2rem}.flow li{border:0;padding:.8rem 0;text-align:center;align-items:center}.arrow{position:absolute;right:-1.7rem;top:calc(50% - 12px);width:24px;height:24px;stroke:#65757c;fill:none;stroke-width:1.6}.lenses li{border:0;border-radius:0;border-bottom:1px solid #d5dce0}.lenses li:last-child{border-bottom:0}.comparison ul{grid-template-columns:repeat(2,minmax(0,1fr))}.comparison .item-title{display:inline-block;color:#a32929;background:#fce1e1;padding:0 .5rem;border-radius:1rem}.comparison li+li .item-title{color:#146339;background:#d9efe1}.screen-title{font-weight:700;display:flex;align-items:center;gap:.5rem;margin-top:1.5rem}.check{width:22px;height:22px;flex:none;fill:none;stroke:#087337;stroke-width:1.8}.action{background:#f0f1f2;border-radius:.5rem;padding:.4rem;text-align:center;margin:1rem 0}.note{color:#505b61}.interpretation{margin-top:1rem}a{font-size:1rem;line-height:1.8}a:focus-visible{outline:3px solid #b15840;outline-offset:4px}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.tasks li{border:0;text-align:center;padding:.8rem 0;margin-bottom:1.5rem}.tasks li:last-child{margin-bottom:0}.tasks .arrow{right:calc(50% - 12px);top:auto;bottom:-1.6rem;transform:rotate(90deg)}.requirement ul{gap:.3rem;border-top:1px solid #d5dce0;padding-top:1rem}.requirement li{border:0;border-radius:0;padding:.2rem 0}.requirement .content{display:flex;gap:.75rem;align-items:baseline}.requirement .item-title{flex:none}.requirement li p{margin:0}
 @container(max-width:38rem){.comparison ul,.flow ol{grid-template-columns:1fr}.flow li{margin-bottom:1.5rem}.flow li:last-child{margin-bottom:0}.arrow{right:calc(50% - 12px);top:auto;bottom:-1.6rem;transform:rotate(90deg)}li{padding:.6rem}.requirement .content{display:block}.icon{width:20px;height:20px}}
</style>
