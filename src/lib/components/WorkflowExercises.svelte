<script lang="ts">
 import {onMount} from 'svelte';
 import type {Locale} from '$lib/model';
 let {lang='zh',mode}:{lang?:Locale;mode:'stale'|'walkthrough'}=$props();
 let ready=$state(false),amount=$state('100'),snapshot=$state('100'),valid=$state(true),exported=$state(''),active=$state(0),revealed=$state(false);
 onMount(()=>{ready=true;});
 const en=$derived(lang==='en');
 const cases=$derived(en?[
  {title:'Missing required information',event:'The user tries to continue before completing every required field.',answer:'List the missing fields, retain entered values and return to input. Check again after correction; do not export a complete report.'},
  {title:'Editing after a check',event:'The user changes information after previewing a passing result.',answer:'Invalidate the previous check and preview immediately. Return to input, then check and preview the current data before export.'},
  {title:'Cancelling',event:'The user cancels during input or declines export confirmation.',answer:'End this task without producing a new report. Whether drafts are retained or cleared needs a separate requirement.'},
  {title:'Confirmed export',event:'Required fields are complete, the current input matches the checked data and the user confirms export.',answer:'Produce a report tied to that checked input and state the outcome. Completeness does not establish correctness, authenticity or official acceptance.'}
 ]:[
  {title:'必填資訊缺漏',event:'使用者尚未填完全部必要欄位，就要求繼續。',answer:'列出缺少的欄位，保留已填資料，回到輸入。補齊後重新檢查，不能匯出完整報告。'},
  {title:'檢查後修改資料',event:'使用者預覽通過結果後，修改了會影響檢查的資料。',answer:'立即使舊檢查與預覽失效，回到輸入，再檢查與預覽目前資料，才能確認匯出。'},
  {title:'取消操作',event:'使用者在輸入階段取消，或在匯出確認時選擇取消。',answer:'結束本次任務，不產生新報告。取消後保留或清空草稿，仍須另外定義。'},
  {title:'確認匯出',event:'必要欄位完整，目前輸入對應已檢查資料，使用者確認匯出。',answer:'產出對應該次已檢查輸入的報告，明示結果。完整性不代表正確性、真實性或正式受理。'}
 ]);
 function edit(){valid=false;exported='';}
 function recheck(){snapshot=amount;valid=true;exported='';}
 function output(){if(!ready||!valid||snapshot!==amount)return;exported=en?`Simulated result: checked coverage ${snapshot} ten-thousand TWD. No premium calculation.`:`模擬結果：已檢查保障額度 ${snapshot} 萬元。未計算保費。`;}
 function move(delta:number){active=Math.max(0,Math.min(cases.length-1,active+delta));revealed=false;}
</script>
{#if mode==='stale'}
 <figure class="workflow-exercise" aria-labelledby="stale-title">
  <figcaption id="stale-title">{en?'Figure 4 · Simulating a result after input changes':'圖 4｜模擬資料修改後的狀態'}</figcaption>
  <p>{en?'Teaching simulation with two synthetic coverage values; no real premium calculation or insurance business rules.':'此為教學模擬，只有兩個合成保障額度，沒有真實保費計算或保險業務規則。'}</p>
  <fieldset disabled={!ready}><legend>{en?'Coverage':'保障額度'}</legend>
   {#each ['100','300'] as value}<label><input type="radio" name="workflow-coverage" {value} bind:group={amount} onchange={edit}/>{value} {en?'ten-thousand TWD':'萬元'}</label>{/each}
  </fieldset>
  <div aria-live="polite" aria-atomic="true">
   <p><strong>{en?'Current result status':'目前試算狀態'}：{valid?(en?'Valid':'有效'):(en?'Invalid — check again':'已失效，請重新檢查')}</strong></p>
   <p>{en?'Current input':'目前輸入'}：{amount} {en?'ten-thousand TWD':'萬元'}</p>
   <p>{en?'Last checked input':'上次檢查資料'}：{snapshot} {en?'ten-thousand TWD':'萬元'}</p>
   <p>{valid?(en?'The result corresponds to the checked input.':'目前輸入與上次檢查一致，可依此結果操作。'):(en?'An edit invalidated the previous result. Even changing back requires a new check in this simulation.':'資料修改已使舊結果失效；本模擬即使改回原值，也必須重新檢查。')}</p>
  </div>
  <div class="actions"><button disabled={!ready} onclick={recheck}>{en?'Check again':'重新檢查'}</button><button disabled={!ready||!valid} onclick={output}>{en?'Show simulated result':'顯示模擬結果'}</button></div>
  {#if exported}<p role="status">{exported}</p>{/if}
  <p>{en?'Static example: coverage 100 ten-thousand TWD with a hypothetical annual premium of TWD 12,000 belongs to the first input only. Changing coverage to 300 invalidates it; this exercise does not calculate a new premium.':'靜態範例：保障額度 100 萬元與假設每年 12,000 元的保費，只對應第一次輸入。改成 300 萬元後舊結果失效；此練習不計算新保費。'}</p>
  <noscript><p>{en?'JavaScript is disabled. Controls are unavailable; read the static example and the rule: edit → invalidate → check again → output.':'JavaScript 已關閉，控制項停用；請閱讀靜態範例與「修改 → 失效 → 重查 → 輸出」規則。'}</p></noscript>
 </figure>
{:else}
 <figure class="workflow-exercise" aria-labelledby="walkthrough-title">
  <figcaption id="walkthrough-title">{en?'Figure 7 · Workflow walkthrough':'圖 7｜流程走讀練習（Walkthrough）'}</figcaption>
  <p>{en?'Four minimum cases, not exhaustive coverage. Cases 2–4 are editorial additions based on the supplied flow; the reference screenshot displays case 1.':'四個最小走讀案例，並非完整測試覆蓋。第 2–4 案例依供稿流程補充；參考截圖顯示第 1 案例。'}</p>
  <div aria-live="polite" aria-atomic="true"><p>{active+1} / {cases.length}</p><h3>{cases[active].title}</h3><p>{cases[active].event}</p><p><strong>{en?'Where should the user go next, and what should the system show?':'使用者下一步應該去哪裡？系統應顯示什麼？'}</strong></p></div>
  <div class="actions"><button disabled={!ready||active===0} onclick={()=>move(-1)}>{en?'Previous':'上一個'}</button><button disabled={!ready} aria-expanded={revealed} aria-controls="walkthrough-answer" onclick={()=>{revealed=!revealed;}}>{en?'Toggle review points':'查看／收起檢核重點'}</button><button disabled={!ready||active===cases.length-1} onclick={()=>move(1)}>{en?'Next':'下一個'}</button></div>
  <div id="walkthrough-answer">{#if revealed}<p>{cases[active].answer}</p>{/if}</div>
  <details><summary>{en?'All four cases and reference reasoning (available without JavaScript)':'四個案例與參考判讀（無 JavaScript 也可閱讀）'}</summary>{#each cases as c}<h3>{c.title}</h3><p>{c.event}</p><p>{c.answer}</p>{/each}</details>
 </figure>
{/if}
<style>
 .workflow-exercise{margin:1.5rem 0;padding:1.25rem;border:1px solid #94a3b8;border-radius:1rem;min-width:0;background:#f8fafc;color:#172033;overflow-wrap:anywhere;font-size:1rem;line-height:1.8}
 figcaption{font-weight:700}p{margin:.75rem 0}fieldset{border:0;padding:0;margin:1rem 0}label{display:flex;align-items:center;gap:.65rem;padding:.3rem 0}input{width:1.15rem;height:1.15rem;accent-color:#166534}
 .actions{display:flex;flex-wrap:wrap;gap:.65rem;margin:1rem 0}button{font:inherit;line-height:1.7;min-height:44px;flex:1 1 10rem;border:1px solid #64748b;border-radius:.75rem;padding:.5rem .8rem;background:white;color:#172033;cursor:pointer}button:disabled{opacity:.55;cursor:default}button:focus-visible,input:focus-visible,summary:focus-visible{outline:3px solid #2563eb;outline-offset:3px}summary{cursor:pointer}h3{font-size:1.05em}
</style>
