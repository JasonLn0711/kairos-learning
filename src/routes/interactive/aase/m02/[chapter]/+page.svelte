<script lang="ts">
  import AaseAtlas from '#lib/interactive/components/AaseAtlas.svelte';
  import type { PageProps } from './$types';
  let {data}: PageProps = $props();
</script>
<AaseAtlas lang="zh" {...data} />
