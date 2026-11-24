<script lang="ts">
  import LegacyEntry from '#lib/interactive/chapter/LegacyEntry.svelte';
  import type {PageProps} from './$types';
  let {data}:PageProps=$props();
</script>
<LegacyEntry lang="en" target={data.target} slug={data.slug} count={data.count} title={data.title}/>
