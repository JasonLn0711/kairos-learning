<script lang="ts">
  import { onMount } from 'svelte';
  import type { ConceptTeaching } from '$lib/concepts';
  import type { Locale } from '$lib/model';
  import InlineText from './InlineText.svelte';
  let { qa, lang }: { qa: NonNullable<ConceptTeaching['qa']>; lang: Locale } = $props();
  let container: HTMLElement;
  onMount(() => {
    const revealHash = () => {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      const disclosure = target?.closest<HTMLDetailsElement>('details.concept-qa');
      if (target && disclosure && container.contains(disclosure)) {
        disclosure.open = true;
        target.scrollIntoView({ block: 'start' });
      }
    };
    revealHash();
    window.addEventListener('hashchange', revealHash);
    return () => window.removeEventListener('hashchange', revealHash);
  });
</script>
<div bind:this={container}>
  {#each qa as item}
    <details class="concept-qa" id={'qa-'+item.id}>
      <summary>{item.text[lang].question}</summary>
      {#each item.text[lang].answer as answer}<p><InlineText text={answer} /></p>{/each}
    </details>
  {/each}
</div>
<style>
  .concept-qa{border:1px solid var(--line);padding:1rem;margin:1.5rem 0;border-radius:4px}
  summary{font-weight:600;cursor:pointer;line-height:1.6}
</style>
