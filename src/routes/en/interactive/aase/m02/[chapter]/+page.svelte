<script lang="ts">
  import ChapterLesson from '#lib/interactive/chapter/ChapterLesson.svelte';
  import type { PageProps } from './$types';
  let {data}: PageProps = $props();
</script>
{#key data.id}<ChapterLesson lang="en" chapter={data} />{/key}
