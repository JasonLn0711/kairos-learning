<script lang="ts">
 import {onMount} from 'svelte';
 import {riskScore,controlCounts} from '$lib/ceh-risk-score';
 import type {NoteDiagram} from '$lib/note-diagrams';
 import type {Locale} from '$lib/model';
 let {diagram,lang}:{diagram:NoteDiagram;lang:Locale}=$props();
 const zh=$derived(lang==='zh');
 let ready=$state(false),likelihood=$state(3),impact=$state(5);
 const result=$derived(riskScore(likelihood,impact));
 onMount(()=>{ready=true;});
 const level=$derived(zh?{low:'低風險',medium:'中風險',high:'高風險'}[result.level]:{low:'Low risk',medium:'Medium risk',high:'High risk'}[result.level]);
</script>
{#snippet card(i:number)}<div class="card"><strong>{diagram.items[i].title}</strong><p>{diagram.items[i].body}</p></div>{/snippet}
{#if diagram.name==='defenselayers'}
 <div class="layer"><strong>{diagram.items[0].title}</strong><p>{diagram.items[0].body}</p><div class="layer"><strong>{diagram.items[1].title}</strong><p>{diagram.items[1].body}</p><div class="layer"><strong>{diagram.items[2].title}</strong><p>{diagram.items[2].body}</p>{@render card(3)}</div></div></div>
{:else if diagram.name==='controlaxes'}
 <div class="groups">{#each diagram.items as item,i}<section class="axis"><strong>{item.title}</strong>{#if i<2}<div class:three={i===0} class="axis-cards">{#each item.body.split(zh?'／':' / ') as label}<div class="card">{label}</div>{/each}</div>{:else}<p>{item.body}</p>{/if}</section>{/each}</div>
{:else if diagram.name==='firewallpolicy'}
 <div class="boundary">{@render card(0)}<span aria-hidden="true">→</span>{@render card(1)}<span aria-hidden="true">→</span>{@render card(2)}</div><p>{zh?'政策檢查後的結果':'Results after policy checks'}</p><div class="policies">{@render card(3)}{@render card(4)}</div>
{:else if diagram.name==='pdcacycle'}
 <ol class="pdca">{#each diagram.items as item,i}<li style:grid-area={['plan','do','check','act'][i]}><strong>{item.title}</strong><p>{item.body}</p><p class="next">{['Plan → Do','Do → Check','Check → Act','Act → Plan'][i]}</p></li>{/each}</ol>
{:else if diagram.name==='controlcounts'}
 <div class="counts">{#each diagram.items as item,i}<div><strong>{item.title}</strong><div class="track"><div class="bar" style:width={`${controlCounts[i]/93*100}%`}></div></div><p>{item.body} · {(controlCounts[i]/93*100).toFixed(1)}%</p></div>{/each}<p>{zh?'總數：':'Total: '}37 + 8 + 14 + 34 = 93</p></div>
{:else if diagram.name==='riskmatrix'}
 <div class="risk"><div class="baseline"><strong>{zh?'預設範例（固定說明）':'Default example (fixed reference)'}</strong>{#each diagram.items as item}<p><strong>{item.title}</strong> — {item.body}</p>{/each}</div><p>{zh?'教學公式：分數 = L × I；L、I 均為 1–5 的整數。':'Teaching formula: score = L × I; L and I are integers from 1–5.'}</p>
 <label>{zh?'可能性 L':'Likelihood L'}: <output>{likelihood}</output><input type="range" min="1" max="5" step="1" bind:value={likelihood} disabled={!ready}/></label>
 <label>{zh?'衝擊 I':'Impact I'}: <output>{impact}</output><input type="range" min="1" max="5" step="1" bind:value={impact} disabled={!ready}/></label>
 <p class="result" aria-live="polite" aria-atomic="true">{likelihood} × {impact} = {result.score} / 25 · {level}</p>
 <button type="button" disabled={!ready} onclick={()=>{likelihood=3;impact=5;}}>{zh?'重設為 3 × 5':'Reset to 3 × 5'}</button>
 <p>{zh?'教學門檻：1–4 低、5–9 中、10–25 高。這是序位評分，不代表實際損失倍數；組織須自行建立風險準則。本互動不儲存學習成績。':'Illustrative thresholds: 1–4 low, 5–9 medium, 10–25 high. Ordinal scores do not express loss ratios; organizations must define their own criteria. This interaction does not save learner scores.'}</p><noscript><p>{zh?'靜態範例：3 × 5 = 15／25，高風險。啟用 JavaScript 後可操作滑桿。':'Static example: 3 × 5 = 15 / 25, high risk. Enable JavaScript to use the sliders.'}</p></noscript></div>
{:else}<div class="groups">{#each diagram.items as item}<div class="card"><strong>{item.title}</strong><p>{item.body}</p></div>{/each}</div>{/if}
<style>
.axis-cards{min-width:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.75rem;margin-top:.75rem}.axis-cards.three{grid-template-columns:repeat(3,minmax(0,1fr))}.axis{min-width:0;border-bottom:1px solid #ccd7d0;padding-bottom:1rem}.card,.layer,.pdca li{min-width:0;border:1px solid #adc8bc;border-radius:12px;background:#eef6f1;padding:1rem;overflow-wrap:anywhere}.card strong,.layer strong,.pdca strong{font-size:1.125rem}p{margin:.5rem 0 0;line-height:1.8}.layer{padding:1rem;background:#f2f5f8}.layer>.layer,.layer>.card{margin-top:1rem}.boundary{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:.5rem}.policies,.groups{display:grid;gap:1rem;margin-top:1rem}.policies>.card:last-child{background:#fff1f0;border-color:#c98e88}.pdca{list-style:none;padding:0;display:grid;gap:1rem;grid-template-areas:'plan do' 'act check';grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.next{font-weight:700}.counts>div{margin:1rem 0}.track{height:1.5rem;background:#e7ece9;margin-top:.5rem}.bar{height:100%;background:#3d7660}.risk{background:#f1f6f3;border:1px solid #adc8bc;border-radius:12px;padding:1rem}.risk label{display:block;margin:1rem 0;font-weight:700}.risk input{display:block;width:100%;min-height:44px}.result{font-weight:700;font-size:1.3rem}button{min-height:44px;padding:.5rem 1rem;font:inherit}button:focus-visible,input:focus-visible{outline:3px solid #28649c;outline-offset:3px}@container (max-width:520px){.axis-cards,.axis-cards.three{grid-template-columns:minmax(0,1fr)}.boundary{display:flex;flex-direction:column;align-items:stretch}.boundary>span{align-self:center;transform:rotate(90deg)}.pdca{display:flex;flex-direction:column}.layer{padding:.65rem}}
</style>
