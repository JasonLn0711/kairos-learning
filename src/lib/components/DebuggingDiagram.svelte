<script lang="ts">
 import {onMount,untrack} from 'svelte';
 import type {ConceptVisual} from '$lib/concepts';
 import {checkReport,reportAvailable,type ReportForm,type ReportMode} from '$lib/stale-report';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:number;lang:'zh'|'en'}=$props();
 let ready=$state(false),mode=$state<ReportMode>('bug'),snapshot=$state<ReportForm|null>(null),copyStatus=$state(''),checkFailed=$state(false);
 const en=$derived(lang==='en');
 const initial=$derived({name:diagram.items[1]?.body??'',taxId:diagram.items[2]?.body??'',docType:diagram.items[3]?.body??''});
 let form=$state<ReportForm>(untrack(()=>({...initial})));
 const available=$derived(reportAvailable(form,snapshot,mode));
 const task=$derived(diagram.items.map(item=>`${item.title}：${item.body}`).join('\n\n'));
 const report=$derived(snapshot?JSON.stringify({simulation:true,checkedInput:snapshot},null,2):'');
 onMount(()=>{ready=true;});
 function edit(key:keyof ReportForm,value:string){form={...form,[key]:value};if(mode==='fixed')snapshot=null;checkFailed=false;}
 function reset(next:ReportMode){mode=next;form={...initial};snapshot=null;checkFailed=false;}
 function check(){snapshot=checkReport(form);checkFailed=snapshot===null;}
 async function copy(){
  try{await navigator.clipboard.writeText(task);copyStatus=en?'Copied.':'已複製。';}
  catch{copyStatus=en?'Copy unavailable. Select the template text to copy manually.':'未能複製，請選取下方範本文字手動複製。';}
 }
</script>
<figure class="debugging-diagram" data-debugging-figure={number}>
 <figcaption><strong>{diagram.caption}</strong>{#if number===4}<button class="copy" disabled={!ready} onclick={copy}>{en?'Copy template':'複製範本'}</button>{/if}</figcaption>
 {#if number===2}
  <fieldset disabled={!ready} class="simulation">
   <legend>{diagram.items[0].title}</legend>
   <div class="modes">{#each ['bug','fixed'] as value,i}<label><input type="radio" name={'report-mode-'+lang} value={value} checked={mode===value} onchange={()=>reset(value as ReportMode)}/>{diagram.items[0].body.split('｜')[i]}</label>{/each}</div>
   <div class="fields">{#each ['name','taxId','docType'] as key,i}<label class:wide={i===0}>{diagram.items[i+1].title}<input type="text" value={form[key as keyof ReportForm]} oninput={event=>edit(key as keyof ReportForm,event.currentTarget.value)}/></label>{/each}</div>
   <button class="check" onclick={check}>{diagram.items[4].title}</button>
  </fieldset>
  <div class="result" role="status" aria-atomic="true">
   {#if available}<p><strong>{en?'Check passed':'檢查通過'}</strong></p><p>{en?'Last checked input':'上次檢查資料'}：{snapshot?.name} / {snapshot?.taxId} / {snapshot?.docType}</p>
    <a href={'data:text/plain;charset=utf-8,'+encodeURIComponent(report)} download="synthetic-report.txt" onclick={event=>{if(!ready||!reportAvailable(form,snapshot,mode))event.preventDefault();}}>{en?'Download synthetic report':'下載合成報告'}</a>
   {:else}<p>{checkFailed?(en?'Complete all three fields before checking.':'請填妥三個欄位後再檢查。'):diagram.items[5].body}</p>{/if}
  </div>
  <p class="static-example">{en?'Static comparison: check all three fields, then clear document type. Bug retains the old success and report. Fixed invalidates both; complete and check the input again before export.':'靜態比較：三欄完整並檢查後，清空文件種類。有 Bug 模式仍保留舊成功與報告；已修復模式使兩者失效，須補齊並重新檢查後才能匯出。'}</p>
  <noscript><p>{en?'JavaScript is disabled. Controls are unavailable; read the static comparison.':'JavaScript 已關閉，控制項停用；可閱讀靜態比較。'}</p></noscript>
 {:else if number===4}
  <dl>{#each diagram.items as item}<div><dt>{item.title}</dt><dd>{item.body}</dd></div>{/each}</dl>
  <p role="status">{copyStatus}</p>
  <noscript><p>{en?'Select the template text to copy it manually.':'請選取範本文字手動複製。'}</p></noscript>
 {:else}
  <ol class:six={number===1} class:repair={number===3}>{#each diagram.items as item,i}<li><span class="marker" aria-hidden="true">{number===1?String(i+1).padStart(2,'0'):['⊗','✓','↻'][i]}</span><div><strong>{item.title}</strong><p>{item.body}</p></div>{#if number===3&&i<diagram.items.length-1}<span class="arrow" aria-hidden="true">→</span>{/if}</li>{/each}</ol>
 {/if}
 <p class="description">{diagram.description}</p>
 <a href={`/images/aase/m07-07-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{en?'Open / download full-size SVG':'開啟／下載原尺寸 SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;min-width:0;margin:1.5rem 0;padding:1rem;border:1px solid #94a3b8;border-radius:1rem;background:#fbfcfd;color:#18252c;font-size:1rem;line-height:1.8;overflow-wrap:anywhere}figcaption{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:1rem}figcaption>strong{flex:1 1 16rem}p{margin:.5rem 0}ol{list-style:none;margin:0;padding:0;display:grid;gap:1rem}.six{grid-template-columns:repeat(2,minmax(0,1fr))}li{display:flex;gap:.8rem;min-width:0;padding:.5rem}.marker{flex:none;color:#475569}.repair{grid-template-columns:repeat(3,minmax(0,1fr))}.repair li{position:relative;text-align:center;display:flex;flex-direction:column;align-items:center;padding:1rem 1.5rem}.repair .marker{font-size:1.3rem;color:#18252c}.arrow{position:absolute;right:-.8rem;top:50%;color:#475569}dl{margin:0}dl>div{margin:.75rem 0}dt{font-weight:700;display:inline}dt::after{content:'：'}dd{display:inline;margin:0}fieldset{border:0;margin:0;padding:0;min-width:0}.modes{display:flex;flex-wrap:wrap;gap:1.5rem;margin:.5rem 0 1rem}.modes label{display:flex;align-items:center;gap:.5rem}input[type=radio]{width:1.1rem;height:1.1rem}.fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.fields label{display:flex;flex-direction:column;min-width:0}.wide{grid-column:1/-1}input[type=text]{box-sizing:border-box;min-width:0;width:100%;padding:.5rem .75rem;border:1px solid #64748b;border-radius:1.5rem;background:white;color:#18252c;font:inherit;line-height:1.7}button{font:inherit;line-height:1.7;min-height:44px;padding:.5rem 1rem;border:1px solid #64748b;border-radius:1rem;background:white;color:#18252c;cursor:pointer;white-space:normal}.check{width:100%;margin:1rem 0;background:#18252c;color:white}.copy{flex:0 1 auto}button:disabled{opacity:.6;cursor:default}.result{padding:.5rem 0}.description,.static-example{margin-top:1rem}a{color:#075f87;text-decoration:underline}a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid #b15840;outline-offset:4px}
 @container(max-width:34rem){.six,.repair,.fields{grid-template-columns:1fr}.repair .arrow{right:auto;top:auto;bottom:-1.1rem;transform:rotate(90deg)}.repair li{padding:1rem}.wide{grid-column:auto}}
</style>
