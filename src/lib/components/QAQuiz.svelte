<script lang="ts">
 import QAInline from './QAInline.svelte';
 let {options,button,id,explanation,lang}:{options:string[];button:string;id:string;explanation:string[];lang:string}=$props();
 let choice=$state<number|null>(null);let submitted=$state<number|null>(null);
</script>
<form class="qa-test" onsubmit={e=>{e.preventDefault();if(choice!==null)submitted=choice;}}>
 <fieldset><legend class="sr-only">{lang==='zh'?'選擇答案':'Choose an answer'}</legend>
 {#each options as option,i}<label><input type="radio" name={id} value={i} bind:group={choice} required onchange={()=>submitted=null}/><span class="qa-source-text"><QAInline text={option}/></span></label>{/each}
 </fieldset>
 <button type="submit" class="qa-source-text">{button}</button>
 {#if submitted!==null}<div class="qa-explanation" aria-live="polite"><p><strong>{lang==='zh'?(submitted===2?'答案相符：C。':'本題建議答案：C。'):(submitted===2?'Your answer matches: C.':'Suggested answer: C.')}</strong></p>{#each explanation as text}<p><QAInline {text}/></p>{/each}<p>{lang==='zh'?'這是本頁測驗解析；選答不會送出給助理或更新理解狀態。':'This feedback stays on this page. It does not send an answer to the assistant or update your learning status.'}</p></div>{/if}
</form>
<style>
 fieldset{border:0;padding:0;min-width:0}label{display:flex;gap:.6rem;align-items:start;margin:1rem 0;cursor:pointer}input{margin-top:.4rem;flex-shrink:0}button{padding:.65rem 1rem;white-space:normal}button:focus-visible,input:focus-visible{outline:3px solid #17664b;outline-offset:3px}.qa-explanation{border-left:3px solid #17664b;padding-left:1rem;margin-top:1rem}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
</style>
