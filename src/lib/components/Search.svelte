<script lang="ts">
  import type { Locale, SearchEntry } from '$lib/model';
  import { search } from '$lib/model';
  let { lang }: { lang: Locale } = $props();
  let query = $state(''); let entries = $state<SearchEntry[]>([]); let loaded = $state(false); let loading = $state(false); let failed = $state(false);
  const results = $derived(search(entries, query, lang));
  async function load() {
    if (loaded || loading) return;
    loading = true; failed = false;
    try { const res = await fetch('/search-index.json'); if (!res.ok) throw new Error('Search index unavailable'); entries = await res.json(); loaded = true; } catch { failed = true; } finally { loading = false; }
  }
</script>
<form role="search" onsubmit={(e) => { e.preventDefault(); load(); }}>
  <label for="search-query">{lang === 'zh' ? '搜尋概念、英文術語或章節（例如 SMB、M04、資料洩漏）' : 'Search concepts, terms or modules (for example SMB, M04, data leakage)'}</label>
  <div class="search-row"><input id="search-query" type="search" bind:value={query} oninput={load} maxlength="200" /><button type="submit">{lang === 'zh' ? '搜尋' : 'Search'}</button></div>
</form>
<p aria-live="polite">{loading ? (lang === 'zh' ? '正在載入搜尋索引…' : 'Loading search index…') : loaded && query.trim() ? `${results.length} ${lang === 'zh' ? '個結果' : 'results'}` : ''}</p>
{#if failed}<p role="status">{lang === 'zh' ? '搜尋索引暫時無法載入。請用下方完整目錄，或再按搜尋重試。' : 'The search index could not load. Use the complete catalog below or search again to retry.'}</p>{/if}
{#if loaded && query.trim()}<ul class="reading-list">{#each results as result}<li><span class="eyebrow">{result.label}</span><a href={result.href}>{result.title}</a><p>{result.summary}</p></li>{/each}</ul>{#if !results.length}<p>{lang === 'zh' ? '試試較短的關鍵字，或從下方課程目錄尋找。' : 'Try a shorter term or browse the course catalog below.'}</p>{/if}{/if}
<noscript><p>{lang === 'zh' ? '可直接使用下方完整目錄與瀏覽器的頁內搜尋。' : 'Use the complete catalog below and your browser’s Find command.'}</p></noscript>
