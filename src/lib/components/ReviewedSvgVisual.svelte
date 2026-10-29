<script lang="ts">
  import { reviewedSvgMarkup } from '$lib/reviewed-svg';
  import type { SourceBlock } from '$lib/concepts';
  let { block, lang='zh' }: {block:Extract<SourceBlock,{kind:'visual'}>;lang?:string} = $props();
  const svg=$derived.by(()=>{
    const markup=reviewedSvgMarkup(block.src);
    if(!markup) throw new Error('Unreviewed SVG source');
    return markup;
  });
</script>
<figure class="spatial-diagram" data-reviewed-svg={block.src}>
  <figcaption><strong>{block.visual.caption}</strong><p>{block.visual.description}</p></figcaption>
  <p class="reading-hint">{lang==='en'?'Spatial diagram: on a narrow screen, scroll sideways in the frame or open the full-size SVG. The text explanation below reflows.':'空間圖保留角色位置：窄螢幕可在圖框內左右捲動，或開啟原圖放大。下方文字說明會自動換行。'}</p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard access to the bounded horizontal diagram scroller.) -->
  <div class="diagram-viewport" role="region" aria-label={lang==='en'?'Scrollable diagram — '+block.visual.caption:'可左右捲動的圖解：'+block.visual.caption} tabindex="0">
    <div class="diagram-canvas">
      <!-- Generated only by scripts/m0903_svg.py: strict element/attribute allowlist,
           local unique IDs, no scripts, styles, links or external resources. -->
      {@html svg}
    </div>
  </div>
  <dl class="text-equivalent">{#each block.visual.items as item}<div><dt>{item.title}</dt><dd>{item.body}</dd></div>{/each}</dl>
  <p class="diagram-links"><a href={block.src}>{lang==='en'?'Open full-size SVG':'開啟原尺寸 SVG'}</a><a href={block.src} download>{block.downloadLabel}</a></p>
</figure>
<style>
  .spatial-diagram{max-width:100%;min-width:0;margin:1.5rem 0;padding:1rem;border:1px solid #64748b;border-radius:16px;background:#f8fafc;color:#172b3a}
  figcaption>strong{font-size:1.1rem}figcaption p,.reading-hint{font-size:.9rem;line-height:1.7}
  .reading-hint{padding:.6rem .8rem;border-left:3px solid #2563a6;background:#edf5ff}
  .diagram-viewport{max-width:100%;overflow-x:auto;border:1px solid #cbd5e1;border-radius:12px;background:white}
  .diagram-canvas{min-width:800px;max-width:900px;margin:auto}
  .diagram-canvas :global(svg){display:block;width:100%;height:auto}
  .diagram-viewport:focus-visible,a:focus-visible{outline:3px solid #175f91;outline-offset:3px}
  .text-equivalent{margin:1rem 0 0;display:grid;gap:.65rem}.text-equivalent>div{min-width:0;padding:.65rem .8rem;background:#fff;border-radius:8px;border:1px solid #cbd5e1}dt{font-weight:650}dd{margin:.25rem 0 0;line-height:1.75;overflow-wrap:anywhere}
  .diagram-links{display:flex;flex-wrap:wrap;gap:.65rem 1.2rem;margin:1rem 0 0}a{color:#145685}
  @media(max-width:540px){.spatial-diagram{padding:.6rem}.text-equivalent>div{padding:.6rem}}
  @media print{.diagram-viewport{overflow:visible}.diagram-canvas{min-width:0}.reading-hint{display:none}}
</style>
