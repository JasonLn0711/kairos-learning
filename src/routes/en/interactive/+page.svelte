<script lang="ts">
  import LearningDesk from '#lib/interactive/components/LearningDesk.svelte';
  import type {PageProps} from './$types';
  let {data}:PageProps=$props();
</script>
<LearningDesk lang="en" directory={data.directory} lesson={data.lesson} home />
