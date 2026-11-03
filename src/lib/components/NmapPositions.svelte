<script lang="ts">
  import type {SourceBlock} from '$lib/concepts';
  let {block}:{block:Extract<SourceBlock,{kind:'visual'}>}=$props();
  const target=$derived(block.visual.items[0]);
  const sources=$derived(block.visual.items.slice(1));
</script>
<figure class="source-visual nmap-positions">
  <figcaption>{block.visual.caption}</figcaption>
  <p>{block.visual.description}</p>
  <section class="target"><h3>{target.title}</h3><p>{target.body}</p></section>
  <svg class="connections" viewBox="0 0 600 90" aria-hidden="true">
    <defs><marker id="nmap-position-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
    <path d="M150 89L280 5" fill="none" stroke="#287255" stroke-width="2.5" marker-end="url(#nmap-position-arrow)"/>
    <path d="M450 89L320 5" fill="none" stroke="#995a45" stroke-width="2.5" stroke-dasharray="7 5" marker-end="url(#nmap-position-arrow)"/>
  </svg>
  <div class="sources">{#each sources as item,i}<section class:filtered={i===1}>
    <h3>{item.title}</h3><p class="relation" class:dashed={i===1}>→ {target.title}</p><p>{item.body}</p>
  </section>{/each}</div>
  <a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
  .nmap-positions{container-type:inline-size;background:#f5f8fb;border:1px solid #b5c8d6;border-radius:1rem;padding:1rem;margin:1.5rem 0;min-width:0;color:#172b3a;font-size:1rem;line-height:1.75}
  figcaption{font-weight:700}h3,p{font-size:1rem;line-height:1.75;margin:.5rem 0;overflow-wrap:anywhere}section{min-width:0;padding:1rem;border:1px solid #8eafa2;background:#edf7f0;border-radius:.6rem}
  .target{max-width:24rem;margin:1rem auto 0;background:#eaf3ff;border-color:#77a2d6;text-align:center}.connections{display:block;width:100%;height:90px}.sources{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.filtered{background:#fff1ea;border-color:#c17862}.relation{border-top:2px solid #287255;padding-top:.4rem}.relation.dashed{border-top:2px dashed #995a45}a{display:inline-block;margin-top:1rem}
  @container(max-width:520px){.sources{grid-template-columns:1fr;margin-top:1rem}.connections{display:none}.target{max-width:none}}
</style>
