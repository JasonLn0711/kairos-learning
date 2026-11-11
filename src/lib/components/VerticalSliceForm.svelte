<script lang="ts">
 import {onMount,untrack} from 'svelte';
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,lang}:{diagram:ConceptVisual;lang:'zh'|'en'}=$props();
 let ready=$state(false);
 let application_id=$state(untrack(()=>diagram.items[0].body)),applicant_code=$state(untrack(()=>diagram.items[1].body)),document_type=$state('');
 let preview=$state<{application_id:string;applicant_code:string;document_type:string}|null>(null);
 onMount(()=>{ready=true;});
 const labels=$derived(diagram.items.map(item=>item.title));
</script>
<figure class="slice-form" data-figure="2">
 <figcaption><strong>{diagram.caption}</strong><span>{lang==='zh'?'教學示範':'Teaching demo'}</span></figcaption>
 <p>{diagram.description}</p>
 <form onsubmit={(event)=>{event.preventDefault();preview={application_id,applicant_code,document_type};}}>
  <label for="slice-application">{labels[0]}</label><input id="slice-application" bind:value={application_id} oninput={()=>preview=null} disabled={!ready}/>
  <label for="slice-applicant">{labels[1]}</label><input id="slice-applicant" bind:value={applicant_code} oninput={()=>preview=null} disabled={!ready}/>
  <label for="slice-document">{labels[2]}</label><input id="slice-document" bind:value={document_type} oninput={()=>preview=null} placeholder={lang==='zh'?'例如 申請書':'For example, application form'} disabled={!ready}/>
  <button disabled={!ready}>{lang==='zh'?'查看本次輸入（未檢核）':'View current input (unvalidated)'}</button>
 </form>
 <div aria-live="polite" aria-atomic="true" class="result">
 {#if preview}<p>{lang==='zh'?'以下資料尚未經過完整性檢核':'The following data has not been checked for completeness'}</p><dl>{#each Object.entries(preview) as [key,value]}<dt>{key}</dt><dd>{value===''?(lang==='zh'?'（空白）':'(blank)'):value}</dd>{/each}</dl>
 {:else}<p>{lang==='zh'?'目前沒有預覽結果':'No preview yet'}</p><p>{lang==='zh'?'按下查看按鈕才會顯示；修改任一欄位會清除舊預覽。':'Press the button to show a preview. Editing any field clears the previous preview.'}</p>{/if}
 </div>
 <noscript><p>{lang==='zh'?'啟用 JavaScript 後可操作。靜態例：SYN-001、DEMO-A、文件類型空白仍可預覽；修改申請編號會清除舊結果。本示範不保存資料。':'Enable JavaScript to operate the demo. Static example: SYN-001, DEMO-A and a blank document type can be previewed. Changing the application ID clears the old result. This demo does not persist data.'}</p></noscript>
 <a href={`/images/aase/m07-03-2-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載預設狀態 SVG':'Open / download default-state SVG'}</a>
</figure>
<style>
 figure{border:1px solid #d5dce0;background:#fbfcfd;color:#18252c;border-radius:1rem;padding:1rem;margin:1.5rem 0}figcaption{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}span{background:#f0f1f2;border-radius:1rem;padding:0 .5rem}p,label,input,button,dt,dd,a,figcaption{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}p{margin:.7rem 0}label{display:block;margin-top:.8rem}input{display:block;width:100%;box-sizing:border-box;padding:.45rem 1rem;border:1px solid #87949c;border-radius:1.5rem;background:#fff;color:#18252c}button{width:100%;padding:.6rem 1rem;border:1px solid #18252c;border-radius:1.5rem;background:#18252c;color:#fff;margin-top:1rem;cursor:pointer}button:disabled{opacity:.6;cursor:default}.result{margin:1rem 0}dt{font-weight:650}dd{white-space:pre-wrap;margin:0 0 .6rem}input:focus-visible,button:focus-visible,a:focus-visible{outline:3px solid #b15840;outline-offset:4px}
</style>
