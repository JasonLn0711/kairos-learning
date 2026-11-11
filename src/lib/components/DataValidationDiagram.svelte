<script lang="ts">
 import {onMount} from 'svelte';
 import type {ConceptVisual} from '$lib/concepts';
 import {validationIssue} from '$lib/validation-demo';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|4;lang:'zh'|'en'}=$props();
 let ready=$state(false);
 // svelte-ignore state_referenced_locally (Immutable lesson defaults initialize this local exercise.)
 let values=$state(diagram.items.map(i=>i.body));
 let checked=$state(false);
 let issues=$state<(null|'blank'|'length')[]>([]);
 onMount(()=>{ready=true;});
 function check(){issues=values.map(validationIssue);checked=true;}
 function reset(){values=diagram.items.map(i=>i.body);issues=[];checked=false;}
 const pending=()=>lang==='zh'?'尚未檢查目前的輸入。試著清空一欄、輸入空白，或輸入超過 80 字元的內容。':'Current input has not been checked. Clear a field, enter whitespace or try more than 80 characters.';
</script>
<figure data-validation-figure={number} class:branch={number===1} class:timeline={number===4}>
 <figcaption><strong>{diagram.caption}</strong><p>{diagram.description}</p></figcaption>
 {#if number===2}
  <form onsubmit={event=>{event.preventDefault();check();}}>
   {#each diagram.items as item,i}<label>{item.title}<input name={['application_id','applicant_code','document_type'][i]} bind:value={values[i]} oninput={()=>{checked=false;issues=[];}} disabled={!ready} autocomplete="off"/></label>{/each}
   <div class="actions"><button disabled={!ready} type="submit">{lang==='zh'?'檢查資料':'Check data'}</button><button disabled={!ready} type="button" onclick={reset}>{lang==='zh'?'重設':'Reset'}</button></div>
   <div role="status" aria-live="polite" class="result">
    {#if !checked}<p>{pending()}</p>
    {:else if issues.some(Boolean)}<p>{lang==='zh'?'檢核不通過，請修正後重新檢查。':'Validation failed. Correct the input and check again.'}</p><ul>{#each issues as issue,i}{#if issue}<li>{diagram.items[i].title}{lang==='zh'?(issue==='blank'?'不可為空白':'不可超過 80 字元'):(issue==='blank'?' must not be blank':' must not exceed 80 characters')}</li>{/if}{/each}</ul>
    {:else}<p>{lang==='zh'?'本次三欄完整性檢核通過；尚未提供報告預覽與匯出。':'The current three fields passed completeness checks; report preview and export are not provided.'}</p>{/if}
   </div>
  </form>
  {#if !ready}<p>{lang==='zh'?'互動需啟用 JavaScript；靜態範例三欄均非空且不超過 80 字元，重新檢查仍需啟用互動。':'Interaction requires JavaScript. The static example has three nonempty values within 80 characters; enable interaction to check changed values.'}</p>{/if}
 {:else}
  <svelte:element this={number===4?'ol':'ul'} class="nodes">{#each diagram.items as item,i}<li class:reject={number===1&&i===2} class:accept={number===1&&i===3}>
   {#if number===1&&i>=2}<span class="branch-label">{lang==='zh'?'檢核結果 → ':'Validation outcome → '}</span>{/if}
   <strong>{item.title}</strong><p>{item.body}</p>
   {#if number===4&&i<3||number===1&&i===0}<span class="connector" aria-hidden="true">↓</span>{/if}
  </li>{/each}</svelte:element>
 {/if}
 <a href={`/images/aase/m07-04-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1.25rem;border:1px solid #d5dce0;border-radius:.8rem;background:#fbfcfd;color:#18252c;min-width:0;overflow-wrap:anywhere}strong,p,a,label,input,button,li{font-size:1rem;line-height:1.8}figcaption>strong{font-size:1.15rem}p{margin:.5rem 0 0}figcaption{margin-bottom:1.25rem}.nodes{list-style:none;padding:0;margin:0;display:grid;gap:1rem}li{position:relative;padding:1rem;border:1px solid #d5dce0;border-radius:.6rem;background:#fff;min-width:0}.branch .nodes{grid-template-columns:1fr 1fr;gap:3rem 1rem}.branch li:nth-child(-n+2){grid-column:1/-1}.branch li:nth-child(2){background:#edf4fb;border-color:#6c96bc}.timeline li:last-child{border-color:#a63939;background:#fff5f5}.reject{border-color:#a63939}.accept{border-color:#16804d}.branch-label{display:block;font-size:1rem}.timeline .nodes{gap:3rem}.connector{position:absolute;top:calc(100% + .4rem);left:calc(50% - .5rem);font-size:1.3rem;line-height:1.7}form{display:grid;gap:1rem}label{display:grid;gap:.3rem}input{box-sizing:border-box;width:100%;min-width:0;border:1px solid #64748b;border-radius:1.5rem;padding:.5rem .8rem;background:#fff;color:#18252c}.actions{display:flex;flex-wrap:wrap;gap:.75rem}button{border:1px solid #64748b;border-radius:1.5rem;padding:.4rem 1rem;background:#fff;color:#18252c;cursor:pointer}.actions button:first-child{flex:1;background:#18252c;color:#fff}button:disabled,input:disabled{opacity:.7;cursor:default}.result ul{margin:.5rem 0;padding-left:1.5rem}.result li{border:0;padding:0;background:transparent}a{display:inline-block;margin-top:1.5rem}a:focus-visible,input:focus-visible,button:focus-visible{outline:3px solid #245fb0;outline-offset:3px}@container(max-width:28rem){.branch .nodes{grid-template-columns:1fr}.branch li{grid-column:1!important}}@media(max-width:540px){figure{padding:.75rem}}
</style>
