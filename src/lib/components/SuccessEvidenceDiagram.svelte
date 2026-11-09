<script lang="ts">
 import {onMount} from 'svelte';
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:number;lang:'zh'|'en'}=$props();
 let blocked=$state(3),ready=$state(false);
 onMount(()=>{ready=true;});
 const zh=$derived(lang==='zh');
</script>
<figure class="success-diagram" data-figure={number} class:chain={number===1} class:comparison={number===4}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===3}
 <label for="blocking-count">{diagram.items[0].title} <strong>{blocked} / 4</strong></label>
 <input id="blocking-count" type="range" min="0" max="4" step="1" bind:value={blocked} disabled={!ready}/>
 <div class="ticks" aria-hidden="true"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></div>
 <div class="result" aria-live="polite" aria-atomic="true"><p>{diagram.items[1].title}<br/><strong class="rate">{blocked*25}%</strong></p><p><strong>{blocked===4?(zh?'達成本版阻擋要求':'Blocking requirement met'):diagram.items[2].title}</strong><br/>{diagram.items[2].body}</p>
 <p class="verdict">{zh?`還有 ${4-blocked} 筆缺漏案例沒有成功阻擋。`:`${4-blocked} missing-input case(s) remain unblocked.`} {zh?'不能因其他正常案例成功，就宣稱這項規則已經通過。':'Successful complete-input cases do not make this rule pass.'}</p></div>
 <p>{zh?'公式：成功阻擋數／4 × 100%。':'Formula: successfully blocked cases / 4 × 100%.'}</p>
 <noscript><p>{zh?'JavaScript 未啟用：預設 3／4＝75%，尚未達 4／4 要求。':'JavaScript disabled: the default 3/4 = 75% does not meet the 4/4 requirement.'}</p></noscript>
 {:else}
 <svelte:element this={number===1||number===5?'ol':'ul'} role="list">
 {#each diagram.items as item,i}<li class:highlight={number===1&&(i===2||i===3)} class:rule={number===5&&i===4}>
 {#if number===2}<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">{#if i===0}<path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Zm-4 10 3 3 5-6"/>{:else}<circle cx="9" cy="7" r="3"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M17 4a3 3 0 0 1 0 6m1 4a5 5 0 0 1 4 5"/>{/if}</svg>{/if}
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
 figcaption{margin-bottom:1rem;font-size:1rem;line-height:1.8}ul,ol{list-style:none;padding:0;margin:0;display:grid;gap:.8rem}li{position:relative;min-width:0;margin:0;padding:1rem;border:1px solid #d5dce0;border-radius:.75rem;overflow-wrap:anywhere;display:flex;gap:1rem}li>div{min-width:0}p{font-size:1rem;line-height:1.8;margin:.4rem 0;overflow-wrap:anywhere}.chain li{text-align:center;justify-content:center;margin-bottom:2rem}.chain .highlight{background:#e9f2f7;border-color:#d9eaf4}.chain li:last-child{margin-bottom:0}.arrow{position:absolute;bottom:-2rem;left:calc(50% - 12px);width:24px;height:30px;fill:none;stroke:#647782;stroke-width:1.6}.icon{flex:none;width:24px;height:24px;margin-top:.4rem;fill:none;stroke:currentColor;stroke-width:1.6}.comparison ul{grid-template-columns:repeat(2,minmax(0,1fr))}.rule{background:#fff2ea;border-color:#b15840}.interpretation{margin-top:1rem}label{display:flex;justify-content:space-between;gap:1rem;line-height:1.8}label>strong{flex:none;white-space:nowrap}input{width:100%;accent-color:#34617b;margin:1rem 0}.ticks{display:flex;justify-content:space-between}.result{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between}.rate{font-size:1.5rem}.verdict{flex-basis:100%}a{display:inline-block;line-height:1.8;overflow-wrap:anywhere}:is(a,input):focus-visible{outline:3px solid #b15840;outline-offset:4px}
 @container(max-width:38rem){.comparison ul{grid-template-columns:1fr}li{padding:.7rem}.icon{width:20px;height:20px}}
</style>
