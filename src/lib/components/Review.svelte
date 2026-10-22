<script lang="ts">
  import { onMount } from 'svelte';
  import type { Question, Locale } from '$lib/model';
  import { emptyProgress, readProgress, wrongQuestions, STORAGE_KEY } from '$lib/progress';
  import QuestionCard from './QuestionCard.svelte';
  let { questions, lang }: { questions: Question[]; lang: Locale } = $props();
  let progress = $state(emptyProgress());
  let ready = $state(false); let confirmClear = $state(false); let message = $state('');
  let queue = $state<Question[]>([]);
  const remaining = $derived(wrongQuestions(progress, questions));
  function read() { try { progress = readProgress(localStorage.getItem(STORAGE_KEY)); } catch { message = lang === 'zh' ? '此瀏覽器未開放本機儲存。' : 'Browser storage is unavailable.'; } }
  function refresh() { read(); queue = wrongQuestions(progress,questions); }
  onMount(() => { ready = true; refresh(); const sync = () => refresh(); window.addEventListener('storage', sync); return () => window.removeEventListener('storage', sync); });
  function clear() {
    try { localStorage.removeItem(STORAGE_KEY); progress = emptyProgress(); queue = []; message = lang === 'zh' ? '已清除本網站的練習紀錄。' : 'Practice records for this site have been cleared.'; }
    catch { message = lang === 'zh' ? '無法清除：請使用瀏覽器網站資料設定。' : 'Unable to clear storage. Use your browser’s site data settings.'; }
    confirmClear = false;
  }
</script>
<p>{lang === 'zh' ? '這裡收集此瀏覽器最近一次仍答錯的題目。答對後可更新清單；它是自我練習紀錄，不代表通過認證或實作驗收。題目更新版本後，舊答案不列入本次複習。' : 'Review questions whose latest answer in this browser is incorrect. Refresh the list after correcting them. This is practice history, not certification or practical assessment. Answers to older question revisions are excluded.'}</p>
<p class="muted">{lang === 'zh' ? '不建立帳號、不傳送答案。清除網站資料或更換瀏覽器後，紀錄不會保留。' : 'No account and no answer uploads. Clearing site data or changing browsers removes access to these records.'}</p>
{#if ready}<p aria-live="polite">{lang === 'zh' ? '待複習' : 'To review'}: <strong>{remaining.length}</strong></p><div class="actions"><button class="secondary" onclick={refresh}>{lang === 'zh' ? '更新複習清單' : 'Refresh review list'}</button><button class="secondary" onclick={() => confirmClear = true}>{lang === 'zh' ? '清除練習紀錄' : 'Clear practice history'}</button></div>{/if}
{#if confirmClear}<div class="notice"><p>{lang === 'zh' ? '這會清除本網站所有練習答案與信心紀錄，無法復原。' : 'This clears all practice answers and confidence records for this site and cannot be undone.'}</p><button onclick={clear}>{lang === 'zh' ? '確認清除' : 'Confirm clear'}</button> <button class="secondary" onclick={() => confirmClear = false}>{lang === 'zh' ? '取消' : 'Cancel'}</button></div>{/if}
<p role="status">{message}</p>
{#if ready && !queue.length}<div class="notice">{lang === 'zh' ? '目前沒有待複習題目。從一個課程的 Q&A 開始；首次造訪不會預填任何成績。' : 'No questions are waiting for review. Start with a course Q&A; a first visit never receives a prefilled score.'}</div>{/if}
{#if queue.length}<h2>{lang === 'zh' ? '待複習題目' : 'Questions to revisit'}</h2>{/if}
{#each queue as question (question.id)}<QuestionCard {question} {lang} onanswered={read} />{/each}
<noscript><p>{lang === 'zh' ? '錯題複習需要 JavaScript 讀取本機紀錄；所有教材與答案解析仍可直接閱讀。' : 'Review needs JavaScript to read local records. Lessons and answer explanations remain available without it.'}</p></noscript>
