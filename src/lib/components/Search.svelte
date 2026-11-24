<script lang="ts">
  import { onMount } from 'svelte';
  import { prepareSearch, type Locale, type SearchEntry } from '#lib/model.ts';

  let { lang }: { lang: Locale } = $props();
  const zh = $derived(lang === 'zh');
  let query = $state('');
  let status = $state<'idle' | 'loading' | 'ready' | 'timeout' | 'failed'>('idle');
  let searchIndex = $state<ReturnType<typeof prepareSearch>>();
  const results = $derived(searchIndex?.(query, lang) ?? []);
  const retry = $derived(status === 'timeout' || status === 'failed');
  let searchField: HTMLInputElement;
  let activeRequest: AbortController | undefined;

  onMount(() => {
    if (searchField.value.trim()) void load();
    return () => activeRequest?.abort();
  });

  async function load() {
    if (status === 'loading' || status === 'ready') return;

    const request = new AbortController();
    activeRequest = request;
    status = 'loading';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      request.abort();
    }, 8_000);

    try {
      const response = await fetch(`/search-index-${lang}.json`, { signal: request.signal });
      if (!response.ok) throw new Error('Search index unavailable');
      const entries: SearchEntry[] = await response.json();
      searchIndex = prepareSearch(entries);
      status = 'ready';
    } catch {
      if (timedOut) status = 'timeout';
      else if (!request.signal.aborted) status = 'failed';
    } finally {
      clearTimeout(timer);
      activeRequest = undefined;
    }
  }
</script>

<form role="search" action="#search-catalog" onsubmit={(event) => {
  event.preventDefault();
  if (query.trim()) void load();
}}>
  <label for="search-query">{zh ? '搜尋概念、英文術語或章節' : 'Search concepts, terms or modules'}</label>
  <p class="search-hint" id="search-hint">{zh ? '例如 SMB、M04、資料洩漏' : 'For example SMB, M04 or data leakage'}</p>
  <div class="search-row">
    <input
      id="search-query"
      type="search"
      aria-describedby="search-hint"
      bind:this={searchField}
      bind:value={query}
      maxlength="200"
      oninput={(event) => {
        if (event instanceof InputEvent && event.isComposing) return;
        if (!retry && event.currentTarget.value.trim()) void load();
      }}
    />
    <button type="submit">{retry ? (zh ? '重試搜尋' : 'Retry search') : (zh ? '搜尋' : 'Search')}</button>
  </div>
</form>

<p class="search-status" role="status">
  {#if status === 'loading'}{zh ? '正在載入搜尋索引…' : 'Loading search index…'}
  {:else if status === 'timeout'}{zh ? '搜尋索引載入逾時。你可以重試或瀏覽教材目錄。' : 'The search index took too long to load. Retry or browse the lesson catalog.'}
  {:else if status === 'failed'}{zh ? '搜尋索引暫時無法載入。你可以重試或瀏覽教材目錄。' : 'The search index could not load. Retry or browse the lesson catalog.'}
  {:else if status === 'ready' && query.trim()}{zh ? `${results.length} 個結果` : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}{/if}
</p>
<a class="catalog-link" href="#search-catalog">{zh ? '瀏覽教材目錄' : 'Browse the lesson catalog'}</a>

{#if status === 'ready' && query.trim()}
  {#if results.length}
    <ul class="reading-list">
      {#each results as result}
        <li><span class="eyebrow">{result.label}</span><a href={result.href}>{result.title}</a><p>{result.summary}</p></li>
      {/each}
    </ul>
  {:else}
    <p>{zh ? '試試較短的關鍵字。' : 'Try a shorter term.'}</p>
  {/if}
{/if}

<style>
  .search-hint {
    margin: .2rem 0;
    color: var(--muted);
    font-size: .9rem;
  }
  .search-row input {
    flex: 1 1 0;
    width: auto;
    min-inline-size: 0;
  }
  .search-row input, .search-row button, .catalog-link {
    min-block-size: 2.75rem;
  }
  .search-row button {
    max-inline-size: 50%;
    padding-inline: .9rem;
  }
  .search-status { margin: .6rem 0 0; }
  .search-status:empty { margin: 0; }
  .catalog-link {
    display: inline-flex;
    align-items: center;
  }
</style>
