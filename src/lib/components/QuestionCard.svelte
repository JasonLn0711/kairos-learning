<script lang="ts">
  import { onMount } from 'svelte';
  import type { Question, Locale } from '$lib/model';
  import { readProgress, recordAnswer, STORAGE_KEY, type Attempt } from '$lib/progress';
  let { question, lang, directReading = false, onanswered = () => {} }: { question: Question; lang: Locale; directReading?: boolean; onanswered?: () => void } = $props();
  let choice = $state<number | undefined>();
  let confidence = $state<Attempt['confidence'] | ''>('');
  let submitted = $state(false);
  let ready = $state(false);
  let notice = $state('');
  const t = $derived(question.text[lang]);
  onMount(() => { ready = true; });
  function submit(event: SubmitEvent) {
    event.preventDefault();
    if (choice === undefined || !confidence) return;
    submitted = true;
    try {
      const current = readProgress(localStorage.getItem(STORAGE_KEY));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recordAnswer(current, question, choice, confidence, new Date().toISOString())));
      notice = lang === 'zh' ? '已儲存於此瀏覽器。' : 'Saved in this browser.';
    } catch { notice = lang === 'zh' ? '瀏覽器無法儲存紀錄；本次仍可作答與查看解析。' : 'Storage is unavailable. You can still answer and read the explanation in this session.'; }
    onanswered();
  }
  function retry() { submitted = false; choice = undefined; confidence = ''; notice = ''; }
</script>
<section class="question" aria-labelledby={question.id}>
  <div class="eyebrow">{question.id} · {lang === 'zh' ? '原創練習' : 'Original practice'}</div>
  <h3 id={question.id}>{t.prompt}</h3>
  <form onsubmit={submit}>
    <fieldset disabled={submitted}><legend class="sr-only">{t.prompt}</legend>
      {#each t.options as option, i}<label class="answer"><input type="radio" name={question.id} value={i} bind:group={choice} required /><span><b>{String.fromCharCode(65+i)}.</b> {option}</span></label>{/each}
    </fieldset>
    <label class="confidence">{lang === 'zh' ? '作答信心' : 'Confidence'}
      <select bind:value={confidence} required disabled={submitted}>
        <option value="">{lang === 'zh' ? '請選擇' : 'Choose'}</option>
        <option value="low">{lang === 'zh' ? '低：仍在猜測' : 'Low: still guessing'}</option>
        <option value="medium">{lang === 'zh' ? '中：能說明部分理由' : 'Medium: some reasoning'}</option>
        <option value="high">{lang === 'zh' ? '高：能解釋並排除其他選項' : 'High: can explain alternatives'}</option>
      </select>
    </label>
    {#if !submitted}<button disabled={!ready} type="submit">{lang === 'zh' ? '提交答案' : 'Check answer'}</button>{:else}<button class="secondary" type="button" onclick={retry}>{lang === 'zh' ? '重新作答' : 'Try again'}</button>{/if}
  </form>
  <div aria-live="polite">{#if submitted}
    <p class="result"><strong>{choice === question.answer ? (lang === 'zh' ? '判斷正確。' : 'Correct.') : (lang === 'zh' ? '再看一次判斷依據。' : 'Review the evidence.')}</strong> {lang === 'zh' ? '正確答案' : 'Correct answer'}: {String.fromCharCode(65+question.answer)}</p>
    <ol type="A" class="rationales">{#each t.rationales as rationale}<li>{rationale}</li>{/each}</ol><p class="muted small">{notice}</p>
  {/if}</div>
  <noscript>{#if directReading}<section><h4>{lang === 'zh' ? 'JavaScript 未啟用：查看答案與解析' : 'JavaScript is off: read the answer and explanation'}</h4><p>{String.fromCharCode(65+question.answer)}</p><ol type="A">{#each t.rationales as reason}<li>{reason}</li>{/each}</ol></section>{:else}<details><summary>{lang === 'zh' ? 'JavaScript 未啟用：查看答案與解析' : 'JavaScript is off: read the answer and explanation'}</summary><p>{String.fromCharCode(65+question.answer)}</p><ol type="A">{#each t.rationales as reason}<li>{reason}</li>{/each}</ol></details>{/if}</noscript>
</section>
