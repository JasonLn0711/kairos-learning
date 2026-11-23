<script lang="ts">
  import InteractiveHub from '#lib/interactive/components/InteractiveHub.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<InteractiveHub lang="en" lessons={data.lessons} hasAaseAtlas={data.hasAaseAtlas} />
