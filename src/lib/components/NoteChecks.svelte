<script lang="ts">
  import {onMount} from 'svelte';
  import type {NoteChecks} from '$lib/ceh-notes';
  import type {Locale} from '$lib/model';
  let {block,lang}:{block:NoteChecks;lang:Locale}=$props();
  let ready=$state(false),submitted=$state(false),answers=$state<Record<string,number>>({});
  onMount(()=>{ready=true;});
  const zh=$derived(lang==='zh');
  const complete=$derived(block.items.every(q=>Number.isInteger(answers[q.id])));
</script>
<form onsubmit={event=>{event.preventDefault();submitted=complete;}}>
  {#each block.items as question,i}
    <fieldset id={question.id}>
      <legend>{i+1}. {question.prompt}</legend>
      {#each question.options as option,j}<label><input type="radio" name={question.id} value={j} bind:group={answers[question.id]} disabled={!ready} onchange={()=>submitted=false}/>{option}</label>{/each}
      <details><summary>{zh?'參考答案與逐項解析':'Reference answer and option explanations'}</summary><p>{zh?'參考答案：':'Reference answer: '}{question.options[question.answer]}</p><ul>{#each question.rationales as rationale,j}<li>{question.options[j]}：{rationale}</li>{/each}</ul></details>
    </fieldset>
  {/each}
  <button type="submit" disabled={!ready||!complete}>{zh?'提交答案並取得解析':'Check answers and explanations'}</button>
  {#if submitted}<div class="feedback" aria-live="polite">{#each block.items as q,i}<section><h3>{i+1}. {answers[q.id]===q.answer?(zh?'判斷正確':'Correct'):(zh?'再檢查理由':'Review your reasoning')}</h3><p>{q.rationales[answers[q.id]]}</p><p>{zh?'參考答案：':'Reference answer: '}{q.options[q.answer]} — {q.rationales[q.answer]}</p></section>{/each}</div>{/if}
</form>
<style>
fieldset{min-width:0;border:1px solid var(--line);border-radius:10px;padding:1rem;margin:1.5rem 0}legend{font-weight:600;line-height:1.8;padding:0 .4rem;max-width:100%}label{display:flex;align-items:flex-start;gap:.65rem;padding:.6rem 0;cursor:pointer}input{flex-shrink:0;margin-top:.5rem}details{margin-top:1rem}summary{cursor:pointer;font-weight:600}.feedback{margin:1rem 0;padding:1rem;border-left:3px solid var(--accent);background:var(--soft)}button:disabled{opacity:.55}
</style>
