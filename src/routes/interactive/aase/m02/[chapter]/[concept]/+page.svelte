<script lang="ts">
  import AaseConceptLearning from '#lib/interactive/components/AaseConceptLearning.svelte';
  import type { PageProps } from './$types';
  let {data}: PageProps = $props();
</script>
{#key data.concept.slug}
  <AaseConceptLearning lang="zh" {...data} />
{/key}
