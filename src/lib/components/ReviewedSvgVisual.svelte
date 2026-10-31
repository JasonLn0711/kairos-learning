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
  <p class="reading-hint">{(block.src.startsWith('/images/ceh/m02-01-') || block.src.startsWith('/images/ceh/m02-02-') || block.src.startsWith('/images/ceh/m02-03-') || block.src.startsWith('/images/ceh/m02-04-') || block.src.startsWith('/images/ceh/m02-05-')) ? (lang==='en'?'The largest diagram text is capped at body size. Narrower columns shrink the whole diagram; open the original SVG to zoom.':'圖中文字最大不超過內文；欄寬不足時整張圖等比縮小，可開啟原圖放大。') : lang==='en'?'The whole diagram scales proportionally to this column. Small screens also shrink its text; open the original SVG to zoom, or read the explanation below.':'整張圖依欄位寬度等比縮放，不裁切。小螢幕的圖中文字也會變小，可開啟原圖放大，或閱讀下方會自動換行的文字解說。'}</p>
  <div class="diagram-viewport">
    <div class="diagram-canvas" class:compact-text={block.src.startsWith("/images/ceh/m02-03-") || block.src.startsWith("/images/ceh/m02-04-") || block.src.startsWith("/images/ceh/m02-05-")} class:body-sized={block.src.startsWith("/images/ceh/m02-01-") || block.src.startsWith("/images/ceh/m02-02-") || block.src.startsWith("/images/ceh/m02-03-") || block.src.startsWith("/images/ceh/m02-04-") || block.src.startsWith("/images/ceh/m02-05-")}>
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
  .diagram-viewport{width:100%;max-width:100%;min-width:0;border:1px solid #cbd5e1;border-radius:12px;background:white}
  .diagram-canvas{width:100%;max-width:100%;min-width:0;margin:auto}
  .diagram-canvas :global(svg){display:block;width:100%;max-width:100%;height:auto}
  .diagram-canvas.body-sized{width:min(100%,23.076923em)}
  .diagram-canvas.compact-text{width:min(100%,33.333333em)}
  a:focus-visible{outline:3px solid #175f91;outline-offset:3px}
  .text-equivalent{margin:1rem 0 0;display:grid;gap:.65rem}.text-equivalent>div{min-width:0;padding:.65rem .8rem;background:#fff;border-radius:8px;border:1px solid #cbd5e1}dt{font-weight:650}dd{margin:.25rem 0 0;line-height:1.75;overflow-wrap:anywhere}
  .diagram-links{display:flex;flex-wrap:wrap;gap:.65rem 1.2rem;margin:1rem 0 0}a{color:#145685}
  @media(max-width:540px){.spatial-diagram{padding:.6rem}.text-equivalent>div{padding:.6rem}}
  @media print{.reading-hint{display:none}}
</style>
