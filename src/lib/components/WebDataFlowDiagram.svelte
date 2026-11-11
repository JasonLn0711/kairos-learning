<script lang="ts">
 import type {ConceptVisual,ConceptBlock} from '$lib/concepts';
 import ConceptBlocks from './ConceptBlocks.svelte';
 let {diagram,number,lang}:{diagram:ConceptVisual|Extract<ConceptBlock,{kind:'table'}>;number:1|2|3|4;lang:'zh'|'en'}=$props();
</script>
<figure class="web-data-flow" data-figure={number} class:process={number===1} class:layers={number===2} class:paths={number===3}>
 {#if diagram.kind==='table'}
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <div class="devtools"><strong>▣ Developer Tools</strong><p class="tabs">Elements　 <strong>Network</strong>　 Console</p><p class="filters">All　 Fetch/XHR　 WS　 Doc</p><ConceptBlocks blocks={[diagram]}/></div>
 <p>{lang==='zh'?'僅作說明的模擬紀錄，不是從教材網站擷取的封包；101 示意協定升級，不表示業務完成。':'Illustrative simulated entries, not traffic captured from the teaching website. 101 illustrates a protocol upgrade, not business completion.'}</p>
 {:else}
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <svelte:element this={number===1?'ol':'ul'} role="list">
 {#each diagram.items as item,i}<li class:result={number===1&&i===5}>
 {#if number!==3}<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">{#if number===2}{#if i===0}<path d="M2 8c5-5 15-5 20 0M5 12c4-4 10-4 14 0m-11 4c2-2 6-2 8 0"/><circle cx="12" cy="20" r="1"/>{:else if i===1}<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V2h6v4H9m0 8 2 2 4-5"/>{:else}<circle cx="10" cy="7" r="4"/><path d="M2 22v-3c0-7 13-7 13 0m1-4 2 2 4-5"/>{/if}{:else if i===0}<path d="m6 3 2 16 4-5 6-2L6 3Z"/>{:else if i===1}<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8m-4-5v5"/>{:else if i===2}<path d="M3 7h18m-5-4 5 4-5 4M21 17H3m5-4-5 4 5 4"/>{:else if i===3}<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M6 7h2m-2 11h2"/>{:else if i===4}<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v14c0 4 14 4 14 0V5M5 12c0 4 14 4 14 0"/>{:else}<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>{/if}</svg>{/if}
 <div class="node"><strong>{item.title}</strong>{#if number===3}<ol class="path" aria-label={item.title}>{#each item.body.split(' → ') as node,j}<li><span>{node}</span>{#if j<3}<svg class="path-arrow" aria-hidden="true" viewBox="0 0 24 24"><path d="M3 12h17m-6-6 6 6-6 6"/></svg>{/if}</li>{/each}</ol>{:else}<p>{item.body}</p>{/if}</div>
 {#if number===1&&i<5}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v17m-6-6 6 6 6-6"/></svg>{/if}
 </li>{/each}</svelte:element>
 <p>{diagram.description}</p>
 {/if}
 <a href={`/images/aase/m06-04-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:#fbfcfd;color:#18252c;margin:1.5rem 0}figcaption{font-size:1rem;line-height:1.8;margin-bottom:1rem}p,li,strong,a{font-size:1rem;line-height:1.8}p{margin:.5rem 0;overflow-wrap:anywhere}ul,ol{list-style:none;margin:0;padding:0}li{min-width:0;position:relative}.icon{width:24px;height:24px;flex:none;stroke:currentColor;fill:none;stroke-width:1.6}.process>ol>li{text-align:center;display:flex;flex-direction:column;align-items:center;padding:1rem;margin-bottom:2rem}.process>ol>li:last-child{margin-bottom:0}.process .result{background:#eaf6ef;border-radius:.8rem;color:#175c36}.arrow{position:absolute;bottom:-1.9rem;left:calc(50% - 12px);width:24px;height:24px;stroke:#65757c;fill:none;stroke-width:1.6}.layers>ul>li{display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid #d5dce0}.layers>ul>li:last-child{border:0}.layers .icon{margin-top:.3rem}.node{min-width:0}.paths>ul>li{padding:1rem 0;border-bottom:1px solid #d5dce0}.paths>ul>li:last-child{border:0}.path{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:2rem;margin:1rem 0}.path li{padding:.5rem;background:#f0f2f3;overflow-wrap:anywhere}.path-arrow{position:absolute;right:-1.8rem;top:calc(50% - 12px);width:24px;height:24px;stroke:#65757c;fill:none;stroke-width:1.6}.tabs{color:#505b61}.tabs strong{text-decoration:underline;text-underline-offset:.4rem}.filters{font-size:.875rem;margin:1.5rem 0}.devtools :global(caption){position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}.devtools :global(table){font-size:1rem;line-height:1.8}.devtools :global(th),.devtools :global(td){min-width:5rem}a:focus-visible{outline:3px solid #b15840;outline-offset:4px}@container(max-width:36rem){.path{grid-template-columns:1fr;gap:2rem}.path-arrow{right:calc(50% - 12px);top:auto;bottom:-1.8rem;transform:rotate(90deg)}.layers>ul>li{gap:.5rem}}
</style>
