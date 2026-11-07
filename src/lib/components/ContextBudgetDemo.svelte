<script lang="ts">
 import {onMount} from 'svelte';
 import type {ConceptVisual} from '$lib/concepts';
 import {contextBudget,contextBudgetParts,contextBudgetLimit} from '$lib/context-budget';
 let {diagram,lang}:{diagram:ConceptVisual;lang:'zh'|'en'}=$props();
 let extra=$state(500),ready=$state(false);
 onMount(()=>{ready=true;});
 const result=$derived(contextBudget(extra));
 const parts=$derived([...contextBudgetParts,extra]);
 const zh=$derived(lang==='zh');
 const format=(n:number)=>n.toLocaleString('en-US');
 const colors=['#637e8d','#618d7b','#b9914d','#92799f','#bd735e'];
</script>
<div data-context-budget>
 <p>{zh?'已使用 Token（含預留回答）':'Tokens used, including reserved output'}<br/><strong data-budget-used>{format(result.used)} / {format(contextBudgetLimit)}</strong></p>
 <div class="bar" aria-hidden="true">{#each parts as value,i}<span style:width={`${value/contextBudgetLimit*100}%`} style:background={colors[i]}></span>{/each}</div>
 <ul>{#each parts as value,i}<li><span class="key" aria-hidden="true" style:background={colors[i]}></span>{diagram.items[i].title}: {format(value)}</li>{/each}</ul>
 <label>{zh?'額外加入的日誌':'Extra logs'}: <output>{format(extra)} Token</output><input type="range" min="0" max="3000" step="100" bind:value={extra} disabled={!ready}/></label>
 <p>{zh?'滑桿範圍：0–3,000 Token；每格 100。':'Slider range: 0–3,000 tokens; increments of 100.'}</p>
 <div aria-live="polite" aria-atomic="true">
  <p data-budget-status>{result.fits?(zh?'容量範圍內':'Within capacity'):(zh?'超出容量':'Over capacity')} · {result.fits?(zh?'剩餘 ':'Remaining '):(zh?'超出 ':'Overflow ')}{format(result.fits?result.remaining:result.overflow)} Token</p>
  <p>{zh?'計算':'Calculation'}: 1,000 + 2,000 + 4,500 + 1,500 + {format(extra)} = {format(result.used)}</p>
  <p>{result.fits?(zh?'目前在假設的預算內，但這不保證模型一定能正確使用所有資訊。':'This fits the assumed budget, but does not guarantee correct use of every item.'):(zh?'目前已超出假設的預算；應選取必要資料、摘要或分段，並依實際服務規則處理。':'This exceeds the assumed budget. Select necessary material, summarize or divide the work, and follow the actual service’s rules.')}</p>
 </div>
 <div class="buttons"><button onclick={()=>{extra=1800;}} disabled={!ready}>{zh?'試試加入 1,800 Token 日誌':'Try 1,800 log tokens'}</button><button onclick={()=>{extra=500;}} disabled={!ready}>{zh?'重設為 500':'Reset to 500'}</button></div>
 <noscript><p>{zh?'目前顯示 500 Token 日誌的預設結果；啟用 JavaScript 後可操作，也可用正文公式或 Python 離線計算。':'The default uses 500 log tokens. Enable JavaScript to adjust it, or calculate offline with the formula or Python example.'}</p></noscript>
</div>
<style>
 p,label,li,button{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}strong{font-size:1.4rem}.bar{display:flex;width:100%;height:1.25rem;background:#e9ebed;border-radius:.4rem;overflow:hidden}.bar span{flex-shrink:0}ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.3rem 1rem}li{margin:0;min-width:0}.key{display:inline-block;width:.65rem;height:.65rem;margin-right:.5rem}label{display:block;border-top:1px solid #ccd3d7;padding-top:1rem}input{display:block;width:100%;min-width:0;accent-color:#9c5b45;margin:1rem 0}.buttons{display:flex;flex-wrap:wrap;gap:.6rem}button{font:inherit;line-height:1.8;padding:.4rem .8rem;border:1px solid #7e8c91;border-radius:.5rem;background:white;color:#244d3f;cursor:pointer}button:disabled{opacity:.65;cursor:default}button:focus-visible,input:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
 @container(max-width:30rem){ul{grid-template-columns:1fr}}
</style>
