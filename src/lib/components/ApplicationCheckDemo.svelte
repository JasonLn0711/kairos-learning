<script lang="ts">
  import {onMount} from 'svelte';
  import {applicationScenarios,applicationReport} from '$lib/application-check-demo';
  import type {ConceptVisual} from '$lib/concepts';
  let {lang='zh',comparison}:{lang?:'zh'|'en';comparison?:ConceptVisual}=$props();
  let ready=$state(false), scenario=$state<'missing'|'complete'>('missing');
  onMount(()=>{ready=true;});
  const data=$derived(applicationScenarios[scenario]);
  const report=$derived(applicationReport(data));
  const t=$derived(lang==='zh'?{
    title:'互動示範：申請資料檢查',a:'情境 A：資料缺漏',b:'情境 B：資料齊全',id:'申請編號',code:'申請人代號',type:'文件類型',empty:'尚未填寫',value:'合成申請表',failed:'檢查未通過',passed:'欄位檢查通過',missing:'缺少必填欄位「文件類型」。請補齊後重新檢查。',complete:'三個必填欄位皆有值；可匯出本機合成示範報告。',export:'匯出完整報告',blocked:'此時匯出完整報告的操作必須被阻止。',limit:'僅切換固定合成資料，在瀏覽器中產生示範檔；不傳送、儲存申請或記錄成績，也不代表正式申請核准。',static:'未啟用 JavaScript 時，保留情境 A 與下表的兩情境結果；切換與下載停用。',appearance:'表單外觀示意，尚無檢核證據',outcome:'必填缺漏的回饋示意',submit:'送出',secondary:'次要操作',required:'請補齊所有必填欄位',field:'必填欄位',caption:'附圖的視覺關係重製：輸入框與操作並列；缺漏時增加錯誤摘要、欄位提示及匯出阻擋。',status:'結果',scenario:'情境'
  }:{title:'Interactive demo: application-data checking',a:'Scenario A: missing data',b:'Scenario B: complete data',id:'Application ID',code:'Applicant code',type:'Document type',empty:'Not provided',value:'Synthetic application form',failed:'Check failed',passed:'Field check passed',missing:'Required field “Document type” is missing. Complete it and check again.',complete:'All three required fields have values. A local synthetic demonstration report can be exported.',export:'Export complete report',blocked:'Complete-report export must be blocked in this state.',limit:'This switches fixed synthetic data and creates a demonstration file in your browser. It submits or stores no application and records no score; it is not official approval.',static:'Without JavaScript, scenario A and the two-scenario result table remain readable; switching and download are disabled.',appearance:'Form appearance, with no check evidence yet',outcome:'Feedback for missing required data',submit:'Submit',secondary:'Secondary action',required:'Please complete all required fields',field:'Required field',caption:'Recreating the supplied images’ relationships: fields and actions are grouped; missing data adds an error summary, field feedback and blocked export.',status:'Result',scenario:'Scenario'});
</script>
{#if comparison}
<figure class="form-comparison">
 <figcaption><strong>{comparison.caption}</strong><p>{comparison.description}</p></figcaption>
 <div class="panels">
  {#each comparison.items as item,i}
  <section class="panel"><h3>{item.title}</h3><p>{item.body}</p>
   <p class="illustration">{i===0?t.appearance:t.outcome}</p>
   {#if i===1}<p class="error"><strong>! {t.required}</strong></p>{/if}
   <div class="mock-field"><strong>{t.id}{i===1?' *':''}</strong><div class="box">SYN-001</div></div>
   <div class="field-pair"><div class="mock-field"><strong>{t.code}{i===1?' *':''}</strong><div class="box">DEMO-A</div></div><div class="mock-field"><strong>{t.type}{i===1?' *':''}</strong><div class:invalid={i===1} class="box">{t.empty}</div>{#if i===1}<p class="field-error">! {t.field}</p>{/if}</div></div>
   <div class="mock-actions"><span>{i===0?t.submit:t.export}</span>{#if i===0}<span>{t.secondary}</span>{/if}</div>
   {#if i===1}<p>{t.blocked}</p>{/if}
  </section>
  {/each}
 </div><p>{t.caption}</p>
</figure>
{:else}
<section class="application-demo" aria-label={t.title}>
 <h3>{t.title}</h3><p>{t.limit}</p>
 <div class="scenario-controls"><button disabled={!ready} aria-pressed={scenario==='missing'} onclick={()=>scenario='missing'}>{t.a}</button><button disabled={!ready} aria-pressed={scenario==='complete'} onclick={()=>scenario='complete'}>{t.b}</button></div>
 <dl><div><dt>{t.id}</dt><dd>{data.applicationId}</dd></div><div><dt>{t.code}</dt><dd>{data.applicantCode}</dd></div><div><dt>{t.type}</dt><dd>{report?t.value:t.empty}</dd></div></dl>
 <div role="status" class:error={!report} class="result"><strong>{report?t.passed:t.failed}</strong><p>{report?t.complete:t.missing}</p></div>
 {#if ready&&report}<a class="report-export" href={'data:application/json;charset=utf-8,'+encodeURIComponent(report)} download="synthetic-application-report.json">{t.export}</a>{:else}<button disabled>{t.export}</button>{/if}
 {#if !report}<p>{t.blocked}</p>{/if}
 <noscript><p>{t.static}</p></noscript>
 <!-- svelte-ignore a11y_no_noninteractive_tabindex (The local table needs keyboard scrolling.) -->
 <div class="table-scroll" role="region" aria-label={t.title} tabindex="0"><table><caption>{t.scenario} → {t.status}</caption><thead><tr><th scope="col">{t.scenario}</th><th scope="col">{t.type}</th><th scope="col">{t.status}</th></tr></thead><tbody><tr><th scope="row">{t.a}</th><td>{t.empty}</td><td>{t.failed}；{t.blocked}</td></tr><tr><th scope="row">{t.b}</th><td>{t.value}</td><td>{t.passed}；{t.complete}</td></tr></tbody></table></div>
</section>
{/if}
<style>
 figure,.application-demo{margin:1.5rem 0;padding:1rem;border:1px solid var(--line);border-radius:6px;background:var(--soft);container-type:inline-size}
 .panels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.panel{min-width:0;padding:1rem;border:1px solid var(--line);background:var(--paper,#fff);border-radius:6px;overflow-wrap:anywhere}.panel h3{font-size:1.1rem}.field-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem}.mock-field{min-width:0;margin:1rem 0}.box{padding:.8rem;border:2px solid #64748b;min-height:3rem;overflow-wrap:anywhere}.box.invalid{border-bottom:3px solid #ad1818}.error{border-left:4px solid #ad1818;background:#fff1f0;padding:.8rem;color:#7e1515}.field-error{color:#7e1515}.mock-actions,.scenario-controls{display:flex;flex-wrap:wrap;gap:.75rem;margin:1rem 0}.mock-actions span{padding:.65rem;border:2px solid #224d87;color:#173d70}.illustration{font-style:italic}.result{padding:1rem;border:1px solid var(--line);margin:1rem 0}.result p{margin-bottom:0}button,.report-export{font:inherit;white-space:normal;overflow-wrap:anywhere;padding:.7rem;border:1px solid #45617d;border-radius:4px;background:#fff;color:#183d68;line-height:1.7}button[aria-pressed=true]{background:#183d68;color:#fff}button:disabled{color:#535c68;background:#e9edf1;border-color:#8893a0}.report-export{display:inline-block}button:focus-visible,a:focus-visible{outline:3px solid #d66b00;outline-offset:3px}dl>div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1rem;margin:.6rem 0}dt{font-weight:650}dd{margin:0;overflow-wrap:anywhere}.table-scroll{overflow:auto;max-width:100%;margin-top:1rem}table{border-collapse:collapse;width:100%}caption{text-align:left}td,th{padding:.6rem;text-align:left;vertical-align:top;border-bottom:1px solid var(--line);min-width:7rem}@container(max-width:640px){.panels{grid-template-columns:1fr}.field-pair{grid-template-columns:1fr}}@media(max-width:540px){.panels{grid-template-columns:1fr}.field-pair{grid-template-columns:1fr}}
</style>
