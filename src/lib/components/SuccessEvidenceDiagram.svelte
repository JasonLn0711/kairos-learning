<script lang="ts">
 import {onMount} from 'svelte';
 import type {ConceptVisual} from '$lib/concepts';
 import {successMetrics} from '$lib/success-metrics';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:number;lang:'zh'|'en'}=$props();
 let blocked=$state(3),falseBlocked=$state(0),ready=$state(false);
 const result=$derived(successMetrics(blocked,falseBlocked));
 const zh=$derived(lang==='zh');
 onMount(()=>{ready=true;});
</script>
<figure class="success-diagram" data-figure={number} class:chain={number===1} class:comparison={number===2}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===3}
 <label for="blocking-count">{diagram.items[0].title} <strong>{blocked} / 4</strong></label>
 <input id="blocking-count" type="range" min="0" max="4" step="1" bind:value={blocked} disabled={!ready}/>
 <label for="false-blocking-count">{diagram.items[1].title} <strong>{falseBlocked} / 2</strong></label>
 <input id="false-blocking-count" type="range" min="0" max="2" step="1" bind:value={falseBlocked} disabled={!ready}/>
 <div class="result" aria-live="polite" aria-atomic="true">
 <p>{diagram.items[2].title}<br/><strong class="rate">{result.blockingRate}%</strong><br/>{zh?`${result.missed} 件瑕疵品漏擋`:`${result.missed} defective product(s) missed`}</p>
 <p>{diagram.items[3].title}<br/><strong class="rate">{result.releaseRate}%</strong><br/>{zh?`${result.falseBlocked} 件良品誤擋`:`${result.falseBlocked} good product(s) incorrectly blocked`}</p>
 <p class="verdict">{result.missed>0?(zh?'目前仍有瑕疵產品漏擋。如果事先規定四件瑕疵測試品都必須攔下，就不能宣稱通過驗收。':'Defects are still missed. If all four defective test products must be blocked, this does not pass acceptance.'):(zh?'四件瑕疵測試品已全數攔下；仍須檢查良品誤擋與其他驗收要求，不能推論整體可靠性。':'All four defective test products are blocked. Still check false blocks and other acceptance requirements; overall reliability is not established.')}
 {result.falseBlocked>0?(zh?'目前有良品被誤擋；只提高阻擋率會隱藏這項代價。':'Good products are being incorrectly blocked; reporting only the blocking rate hides that cost.'):''}</p>
 </div>
 <p>{zh?'公式：瑕疵阻擋率＝成功阻擋數／4 × 100%；良品正確放行率＝(2－良品誤擋數)／2 × 100%。':'Formulas: defect blocking rate = blocked / 4 × 100%; correct release rate = (2 − false blocks) / 2 × 100%.'}</p>
 <button type="button" disabled={!ready} onclick={()=>{blocked=4;falseBlocked=2;}}>{zh?'試試「全部阻擋」會發生什麼事':'Try blocking every product'}</button>
 <noscript><p>{zh?'JavaScript 未啟用：預設瑕疵阻擋3／4＝75%、良品放行2／2＝100%；互動停用，全部阻擋會變成100%與0%。':'JavaScript disabled: defaults are 3/4 = 75% defects blocked and 2/2 = 100% good products released. Controls are disabled; blocking everything would produce 100% and 0%.'}</p></noscript>
 {:else if number===6}
 <div class="claims"><strong>{diagram.items[0].title}</strong>{#each diagram.items[0].body.split('\n\n') as p}<p>{p}</p>{/each}</div>
 <dl>{#each diagram.items.slice(1) as item}<div><dt>{item.title}</dt><dd>{item.body}</dd></div>{/each}</dl>
 {:else}
 <svelte:element this={number===1||number===5?'ol':'ul'} role="list">
 {#each diagram.items as item,i}<li class:highlight={number===1&&i===3} class:decision={number===1&&i===5} class:warning={number===5&&i===2}>
 {#if number===2}<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">{#if i===0}<path d="m9 2 6 0 1 4 4 1v6l-4 1-1 4H9l-1-4-4-1V7l4-1 1-4Z"/><circle cx="12" cy="10" r="3"/>{:else if i===1}<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>{:else}<path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Zm-4 10 3 3 5-6"/>{/if}</svg>{/if}
 <div><strong>{item.title}</strong>{#each item.body.split('\n\n') as p}<p>{p}</p>{/each}</div>
 {#if number===1&&i<5}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-7-7 7 7 7-7"/></svg>{/if}
 </li>{/each}
 </svelte:element>
 {/if}
 <p class="interpretation">{diagram.description}</p>
 <a href={`/images/aase/m03-05-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{zh?'開啟／下載原尺寸 SVG（預設案例）':'Open / download full-size SVG (default case)'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:#fbfcfd;color:#18252c}
 figcaption{margin-bottom:1rem;font-size:1rem;line-height:1.8}ul,ol{list-style:none;padding:0;margin:0;display:grid;gap:.8rem}li{position:relative;min-width:0;margin:0;padding:1rem;border:1px solid #d5dce0;border-radius:.75rem;overflow-wrap:anywhere;display:flex;gap:1rem}li>div{min-width:0}p{font-size:1rem;line-height:1.8;margin:.4rem 0;overflow-wrap:anywhere}.chain li{text-align:center;justify-content:center;margin-bottom:2rem}.chain .highlight{background:#e9f2f7;border-color:#a8c8ed}.chain .decision{background:#e9f7f2;border-color:#82ccb7}.chain li:last-child{margin-bottom:0}.warning{border-color:#b15840}.arrow{position:absolute;bottom:-2rem;left:calc(50% - 12px);width:24px;height:30px;fill:none;stroke:#647782;stroke-width:1.6}.icon{flex:none;width:24px;height:24px;margin-top:.4rem;fill:none;stroke:currentColor;stroke-width:1.6}.comparison ul{grid-template-columns:repeat(3,minmax(0,1fr))}.interpretation{margin-top:1rem}label{display:flex;justify-content:space-between;gap:1rem;line-height:1.8}label>strong{flex:none;white-space:nowrap}input{width:100%;accent-color:#34617b;margin:1rem 0}.result{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between}.rate{font-size:1.5rem}.verdict{flex-basis:100%}dl{margin:1rem 0}dl>div{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:1rem;border-bottom:1px solid #d5dce0;padding:.7rem 0;font-size:1rem;line-height:1.8}dt,dd{margin:0;overflow-wrap:anywhere}dd{text-align:right}a{display:inline-block;line-height:1.8;overflow-wrap:anywhere}button{font:inherit;line-height:1.8;padding:.5rem 1rem;max-width:100%;border:1px solid #647782;border-radius:.6rem;background:white;color:inherit;cursor:pointer}:is(a,input,button):focus-visible{outline:3px solid #b15840;outline-offset:4px}
 @container(max-width:38rem){.comparison ul{grid-template-columns:1fr}li{padding:.7rem}.icon{width:20px;height:20px}}
</style>
