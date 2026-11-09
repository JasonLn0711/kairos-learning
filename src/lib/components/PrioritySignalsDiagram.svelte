<script lang="ts">
  import type {SourceBlock} from '$lib/concepts';
  let {block}:{block:Extract<SourceBlock,{kind:'visual'}>}=$props();
</script>
<figure data-priority-signals="parallel">
  <figcaption><strong>{block.visual.caption}</strong><p>{block.visual.description}</p></figcaption>
  <ul>{#each block.visual.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
  <a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:var(--soft);min-width:0;overflow-wrap:anywhere}
figcaption>strong{font-size:1.125rem}p,strong,a{font-size:1rem;line-height:1.8}p{margin:.5rem 0 0;overflow-wrap:anywhere}figcaption p{margin-bottom:1rem}
ul{list-style:none;margin:0 0 1rem;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}li{min-width:0;padding:1rem;background:var(--paper);border:1px solid #47748e;border-radius:.6rem;overflow-wrap:anywhere}li:last-child{grid-column:1/-1;border-width:2px}
a{display:inline-block}
@container(max-width:38rem){ul{grid-template-columns:1fr}li{padding:.8rem}}
</style>
