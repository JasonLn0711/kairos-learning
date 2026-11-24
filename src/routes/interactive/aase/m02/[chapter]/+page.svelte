<script lang="ts">
  import LearningDesk from '#lib/interactive/components/LearningDesk.svelte';
  import type {PageProps} from './$types';
  let {data}:PageProps=$props();
</script>
{#key data.id}<LearningDesk lang="zh" directory={data.directory} chapter={data} />{/key}
