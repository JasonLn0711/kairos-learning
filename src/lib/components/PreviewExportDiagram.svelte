<script lang="ts">
 import {onMount} from 'svelte';
 import type {ConceptVisual} from '$lib/concepts';
 import {checkedPreviewReport,validPreviewRecord,type PreviewRecord} from '$lib/preview-export';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2;lang:'zh'|'en'}=$props();
 let ready=$state(false),documentType=$state('收入證明'),snapshot=$state<PreviewRecord|null>(null),attempted=$state(false);
 const en=$derived(lang==='en');
 const record=$derived({application_id:'A001',applicant_code:'C123',document_type:documentType});
 const report=$derived(snapshot&&validPreviewRecord(record)?checkedPreviewReport(record,snapshot):null);
 onMount(()=>{ready=true;});
 function edit(){snapshot=null;attempted=false;}
 function check(){attempted=true;snapshot=validPreviewRecord(record)?{...record}:null;}
 function reset(){documentType='收入證明';snapshot=null;attempted=false;}
</script>
<figure data-preview-export={number}>
 <figcaption><strong>{diagram.caption}</strong><p>{diagram.description}</p></figcaption>
 {#if number===1}
  <p class="badge">{en?'Teaching simulation':'教學模擬'}</p>
  <dl class="pair">{#each diagram.items.slice(0,2) as item}<div><dt>{item.title}</dt><dd>{item.body}</dd></div>{/each}</dl>
  <label for="preview-document">{diagram.items[2].title} {en?'(try deleting or editing; at most 80 characters)':'（請試著刪除或修改，最多 80 字元）'}</label>
  <input id="preview-document" maxlength="80" disabled={!ready} bind:value={documentType} oninput={edit}/>
  <div class="actions"><button disabled={!ready} onclick={check}>{en?'Check data':'檢查資料'}</button><button disabled={!ready} onclick={reset}>{en?'Reset':'重設'}</button></div>
  <div aria-live="polite" aria-atomic="true"><p>{report?(en?'Current data matches the checked snapshot. The three teaching fields are complete.':'目前資料對應檢查快照，三個教學欄位完整。'):attempted?(en?'Document type is missing or invalid. Correct it and check again.':'文件類型缺漏或不合法，請補正後重新檢查。'):diagram.items[3].body}</p></div>
  {#if report}
   <!-- svelte-ignore a11y_no_noninteractive_tabindex (The JSON preview needs keyboard scrolling.) -->
   <pre tabindex="0" role="region" aria-label={en?'Checked JSON preview':'已檢查 JSON 預覽'}><code>{report}</code></pre>
   <a href={'data:application/json;charset=utf-8,'+encodeURIComponent(report)} download="synthetic-report.json">{en?'Download checked report':'下載已檢查報告'}</a>
  {/if}
  <p>{en?'Static example: check A001 / C123 / 收入證明, then edit to 戶籍謄本. The old preview and download disappear; check again before export. The report uses status=complete, a teaching-completeness scope and only three allowed fields.':'靜態範例：檢查 A001／C123／收入證明後，改成戶籍謄本，舊預覽與下載入口消失，重檢後才能匯出。報告含 status=complete、教學完整性 scope 與三個允許欄位。'}</p>
  <noscript><p>{en?'JavaScript is disabled. Controls are unavailable; the static example remains readable.':'JavaScript 已關閉，控制項停用；請閱讀上方靜態範例。'}</p></noscript>
 {:else}
  <div class="sequence">
   {#each diagram.items.slice(0,3) as item}<div class="node"><strong>{item.title}</strong><p>{item.body}</p></div><span class="arrow" aria-hidden="true">↓</span>{/each}
   <div class="pair branches">{#each diagram.items.slice(3,5) as item,i}<div class="node" class:returning={i===0}><strong>{item.title}</strong><p>{item.body}</p></div>{/each}</div>
   <p class="condition">{en?'Only the unchanged-data branch proceeds ↓':'只有「資料沒有變」分支繼續 ↓'}</p>
   {#each diagram.items.slice(5) as item,i}<div class="node"><strong>{item.title}</strong><p>{item.body}</p></div>{#if i===0}<span class="arrow" aria-hidden="true">↓</span>{/if}{/each}
  </div>
 {/if}
 <a class="svg-link" href={`/images/aase/m07-05-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{en?'Open / download static SVG':'開啟／下載靜態 SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1.25rem;border:1px solid #c4cdd1;border-radius:.8rem;background:#fbfcfd;color:#18252c;min-width:0;overflow-wrap:anywhere;font-size:1rem;line-height:1.8}figcaption>strong{font-size:1.15rem}p{margin:.6rem 0}figcaption{margin-bottom:1.25rem}.badge{font-size:.9rem}.pair{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.pair>div{min-width:0}dt{font-weight:600}dd{margin:.4rem 0}label{display:block;margin-top:1rem}input,button{font:inherit;line-height:1.7;color:inherit;background:white;border:1px solid #64748b;border-radius:.65rem;padding:.5rem .8rem}input{width:100%;box-sizing:border-box;min-width:0}button{min-height:44px;cursor:pointer}button:disabled,input:disabled{opacity:.6}.actions{display:flex;flex-wrap:wrap;gap:.7rem;margin:1rem 0}button:focus-visible,input:focus-visible,a:focus-visible,pre:focus-visible{outline:3px solid #245fb0;outline-offset:3px}pre{overflow:auto;max-width:100%;padding:1rem;border:1px solid #c4cdd1;background:#f2f6f5;line-height:1.8}.sequence{text-align:center}.node{border:1px solid #c4cdd1;border-radius:.65rem;padding:1rem;background:white;min-width:0}.returning{background:#f7f2eb}.branches .node:last-child{background:#eef6f3}.arrow{display:block;margin:.4rem 0;font-size:1.3rem}.condition{margin:.8rem 0;font-weight:600}.svg-link{display:block;margin-top:1.25rem}@container(max-width:32rem){.pair{grid-template-columns:1fr}}@media(max-width:540px){figure{padding:.75rem}}
</style>
