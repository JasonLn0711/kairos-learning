<script lang="ts">
 import {onMount} from 'svelte';
 import {attentionDemo} from '$lib/attention-demo';
 let {lang='zh'}:{lang?:'zh'|'en'}=$props();
 let a=$state(1),b=$state(0),ready=$state(false);
 onMount(()=>{ready=true;});
 const result=$derived(attentionDemo(a,b));
 const zh=$derived(lang==='zh');
 function reset(){a=1;b=0;}
</script>
<div class="attention-demo" data-attention-demo>
 <h3>{zh?'互動教具：調整 Attention 分數':'Interactive example: adjust attention scores'}</h3>
 <p>{zh?'固定 Value 為 2、6；分數範圍為 −4 至 4。這是純數學教具，沒有執行真實模型、向量或縮放點積運算。':'Values are fixed at 2 and 6; scores range from −4 to 4. This is an arithmetic teaching tool, not execution of a model, vector representation or scaled dot product.'}</p>
 <div class="controls">
  <label>A {zh?'的匹配分數':'match score'}: <output>{a}</output><input aria-label={zh?'A 的匹配分數':'A match score'} type="range" min="-4" max="4" step="0.1" bind:value={a} disabled={!ready}/></label>
  <label>B {zh?'的匹配分數':'match score'}: <output>{b}</output><input aria-label={zh?'B 的匹配分數':'B match score'} type="range" min="-4" max="4" step="0.1" bind:value={b} disabled={!ready}/></label>
 </div>
 <div aria-live="polite" aria-atomic="true" class="result">
  <p>{zh?'經過 Softmax 後的權重':'Weights after softmax'}</p>
  {#each result.weights as weight,i}<div class="weight" class:second={i===1}><span>{i===0?'A':'B'}</span><meter min="0" max="1" value={weight} aria-label={(i===0?'A':'B')+(zh?' 的權重':' weight')}>{weight}</meter><span>{(weight*100).toFixed(1)}%</span></div>{/each}
  <p>{zh?'加權組合結果':'Weighted result'}: <strong data-weighted-result>{result.value.toFixed(3)}</strong></p>
  <p class="formula">{result.weights[0].toFixed(3)} × 2 + {result.weights[1].toFixed(3)} × 6 ≈ {result.value.toFixed(3)}</p>
 </div>
 <div class="buttons"><button onclick={reset} disabled={!ready}>{zh?'重設':'Reset'}</button><button onclick={()=>{a=0;b=0;}} disabled={!ready}>{zh?'兩邊都設為 0':'Set both to 0'}</button><button onclick={()=>{b=Math.min(4,b+1);}} disabled={!ready||b>=4}>{zh?'提高 B 的分數':'Increase B score'}</button></div>
 <p>{zh?'權重與結果先用完整精度計算，再四捨五入顯示。分數 0 不等於權重 0；分數相同時各為 50%，結果為 4。':'Weights and the result are calculated at full precision, then rounded for display. A score of 0 does not imply a weight of 0; equal scores yield 50% each and a result of 4.'}</p>
 <noscript><p>{zh?'目前顯示分數 [1, 0] 的預設範例。啟用 JavaScript 後可調整分數；也可用正文公式或 Python 範例計算。':'The default example uses scores [1, 0]. Enable JavaScript to adjust scores, or calculate using the formula or Python example in the lesson.'}</p></noscript>
</div>
<style>
 .attention-demo{margin:2rem 0;padding:1rem;border:1px solid #7e999c;border-radius:1rem;background:#f9fbfb;overflow-wrap:anywhere;min-width:0}h3{font-size:1.15rem;font-weight:700;line-height:1.7}p,label,button,.weight{font-size:1rem;line-height:1.8}.controls{display:grid;gap:1rem}label{display:block}input{display:block;width:100%;min-width:0;margin:.8rem 0;accent-color:#2265bb}.result{margin:1.25rem 0;border-top:1px solid #c6d4d6}.weight{display:grid;grid-template-columns:1rem minmax(0,1fr) 4.5rem;align-items:center;gap:.5rem}meter{width:100%;height:1.25rem}meter::-webkit-meter-optimum-value{background:#2265bb}.second meter::-webkit-meter-optimum-value{background:#b86420}meter::-moz-meter-bar{background:#2265bb}.second meter::-moz-meter-bar{background:#b86420}label:nth-child(2) input{accent-color:#b86420}.buttons{display:flex;flex-wrap:wrap;gap:.6rem}button{padding:.4rem .8rem;border:1px solid #6b8287;border-radius:.5rem;background:white;color:#183b59;cursor:pointer}button:disabled{opacity:.6;cursor:default}strong{font-size:1.4rem}button:focus-visible,input:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
</style>
