<script lang="ts">
  import InteractiveLesson from '#lib/interactive/components/InteractiveLesson.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<InteractiveLesson lang="zh" lesson={data.lesson} />
