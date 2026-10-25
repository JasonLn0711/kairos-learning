<script lang="ts">
  import walkthrough from '$lib/m0402-dig-walkthrough.json';
  let { lang = 'zh' }: { lang?: string } = $props();
  const text = $derived(lang === 'zh' ? walkthrough.zh : walkthrough.en);
  const reference = (key: string) => walkthrough.refs[key as keyof typeof walkthrough.refs];
</script>

<aside class="dig-walkthrough" data-dig-walkthrough aria-labelledby="dig-observation">
  <h3 id="dig-observation">{text.title}</h3>
  <p class="provenance">{text.provenance}</p>
  <p class="overview">{text.overview}</p>
  <details class="raw">
    <summary>{text.rawLabel}</summary>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users can scroll verbatim terminal text.) -->
    <pre tabindex="0" aria-label={text.rawLabel}><code data-dig-original>{walkthrough.raw}</code></pre>
  </details>
  {#each text.sections as section}
    <details id={'dig-line-' + section.id}>
      <summary>{section.title}</summary>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users can scroll verbatim terminal text.) -->
      <pre tabindex="0" aria-label={section.title}><code>{section.code}</code></pre>
      {#each section.paragraphs as paragraph}<p>{paragraph}</p>{/each}
      {#if section.refs.length}
        <p class="references">{lang === 'zh' ? '依據：' : 'References: '}
          {#each section.refs as key, i}{#if i > 0} · {/if}<a href={reference(key).url}>{reference(key).label}</a>{/each}
        </p>
      {/if}
    </details>
  {/each}
  <details>
    <summary>{text.followupTitle}</summary>
    <ul>{#each text.followup as paragraph}<li>{paragraph}</li>{/each}</ul>
    <p><a href={walkthrough.refs.status.url}>{walkthrough.refs.status.label}</a> · <a href="#layers">{lang === 'zh' ? '回到分層檢查' : 'Continue to layered checks'}</a></p>
  </details>
</aside>

<style>
  .dig-walkthrough{margin:2rem 0;padding:clamp(.75rem,3vw,1.5rem);border:1px solid var(--line);border-radius:14px;background:#f8f7f2;min-width:0;color:#24332e;overflow-wrap:anywhere}
  h3{scroll-margin-top:2rem;margin-top:0}
  .provenance{font-size:.9rem;color:#4a5a53}
  .overview{padding:.8rem 1rem;border-left:3px solid #346a52;background:#e9f1ed;border-radius:4px}
  details{margin-top:.8rem;border:1px solid #91a399;border-radius:8px;padding:.75rem;background:#fff}
  summary{cursor:pointer;font-weight:650;line-height:1.65}
  summary:focus-visible,pre:focus-visible{outline:3px solid #17664b;outline-offset:4px}
  pre{max-width:100%;overflow-x:auto;white-space:pre;font-size:.8rem;line-height:1.7;padding:.8rem}
  p,li{line-height:1.8}.references{font-size:.85rem}a{color:#24553c}
  @media print{details{break-inside:avoid}pre{white-space:pre-wrap;overflow-wrap:anywhere}}
</style>
