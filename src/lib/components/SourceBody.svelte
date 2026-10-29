<script lang="ts">
  import FtpDiagram from './FtpDiagram.svelte';
  import FtpEditorial from './FtpEditorial.svelte';
  import DigWalkthrough from './DigWalkthrough.svelte';
  import DnsDiagram from './DnsDiagram.svelte';
  import M0401Visual from './M0401Visual.svelte';
  import type { SourceBlock } from '$lib/concepts';
  import ConceptBlocks from './ConceptBlocks.svelte';
  import ReviewedSvgVisual from './ReviewedSvgVisual.svelte';
  import { reviewedSvgMarkup } from '$lib/reviewed-svg';
  import AccessDiagram from './AccessDiagram.svelte';
  import InlineText from './InlineText.svelte';
  let { blocks, conceptId='', lang='zh' }: {blocks: SourceBlock[];conceptId?:string;lang?:string} = $props();
  const placements:Record<number,'questions'|'entry-evidence'|'permissions'|'protocols'>={8:'questions',23:'entry-evidence',47:'permissions',79:'protocols'};
</script>
<div class="source-body" class:ftp={conceptId==='M04-03'}>
  {#each blocks as block,i}
    {#if conceptId==='M04-02' && lang==='zh' && block.kind==='paragraph' && block.text==='步驟三：依序查詢不同類型'}<DigWalkthrough {lang}/>{/if}
    {#if conceptId==='M04-03' && block.kind==='code' && block.id==='ftp-ascii-login'}<FtpDiagram id="login" {lang}/>{/if}
    {#if conceptId==='M04-03' && block.kind==='code' && block.id==='ftp-ascii-download'}<FtpDiagram id="download" {lang}/>{/if}
    {#if block.kind === 'sourceImage'}
      <figure class="original-image">
        <img src={block.src} alt={block.alt} width={block.width} height={block.height} loading="lazy" />
        <p class="image-links"><a href={block.src}>{block.openLabel}</a><a href={block.src} download>{block.downloadLabel}</a></p>
        <figcaption>{block.caption}</figcaption>
      </figure>
    {:else if block.kind === 'dnsDiagram'}<DnsDiagram id={block.id} {lang}/>{:else if block.kind === 'visual' && reviewedSvgMarkup(block.src)}<ReviewedSvgVisual {block} {lang}/>{:else if block.kind === 'visual'}<div class="source-visual"><ConceptBlocks blocks={[block.visual]}/><a href={block.src} download>{block.downloadLabel}</a></div>
    {:else if block.kind === 'accessDiagram'}<AccessDiagram texts={block.texts} src={block.src} />
    {:else if block.kind === 'heading'}<h2 id={block.id}><InlineText text={block.text} /></h2>
    {:else if block.kind === 'paragraph' && block.id}<h3 id={block.id}><InlineText text={block.text}/></h3>
    {:else if block.kind === 'paragraph'}<p><InlineText text={block.text} /></p>
    {:else if block.kind === 'code'}{#if conceptId==='M04-03' && block.id?.startsWith('ftp-ascii')}<div class="ascii"><!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard access to horizontal ASCII scrolling.) -->
<pre role="region" aria-label={lang==='zh'?'可捲動文字示意':'Scrollable text schematic'} tabindex="0"><code>{block.text}</code></pre></div>{:else}<pre><code>{block.text}</code></pre>{/if}
    {:else if block.kind === 'answer'}<details class="reference-answer" id={block.id}><summary><InlineText text={block.summary}/></summary>{#each block.paragraphs as paragraph}<p><InlineText text={paragraph}/></p>{/each}</details>
    {:else if block.kind === 'list'}<ul>{#each block.items as item}<li><InlineText text={item} /></li>{/each}</ul>
    {:else if block.kind === 'table'}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable tables need keyboard access.) -->
      <div class="table-scroll" role="region" aria-label={block.headers.join('、')} tabindex="0"><table><thead><tr>{#each block.headers as header}<th scope="col">{header}</th>{/each}</tr></thead><tbody>{#each block.rows as row}<tr>{#each row as cell}<td><InlineText text={cell} /></td>{/each}</tr>{/each}</tbody></table></div>
    {/if}
    {#if conceptId==='M04-03' && block.kind==='heading' && block.id==='modes'}<FtpDiagram id="modes" {lang}/>{/if}
    {#if conceptId==='M04-03' && block.kind==='heading' && ['replies','lab','check'].includes(block.id??'')}<FtpEditorial id={block.id??''} {lang}/>{/if}
    {#if conceptId==='M04-01'&&lang==='zh'&&placements[i]}<M0401Visual id={placements[i]} {lang}/>{/if}
  {/each}
</div>
<style>
  .original-image{margin:1.5rem 0;max-width:100%;min-width:0}
  .original-image img{display:block;width:100%;height:auto;max-width:100%}
  .original-image figcaption{margin-top:.6rem;overflow-wrap:anywhere}
  .image-links{display:flex;flex-wrap:wrap;gap:.6rem 1.2rem}

  .reference-answer{border:1px solid var(--line);border-radius:8px;padding:1rem;margin:1.5rem 0;background:var(--soft)}
  .reference-answer summary{cursor:pointer;font-weight:600}
  .ascii{margin:1rem 0;border:1px solid var(--line);border-radius:8px;padding:.7rem}.ascii pre{max-width:100%;overflow:auto}
  .source-body.ftp :global(p){white-space:pre-line}
  .table-scroll{max-width:100%;overflow-x:auto;margin:1.5rem 0}
  table{border-collapse:collapse;width:100%;font-size:.9rem;line-height:1.65}
  th,td{text-align:left;vertical-align:top;border-bottom:1px solid var(--line);padding:.65rem;min-width:7rem}
  th{background:var(--soft)}
  @media print{.table-scroll{overflow:visible}th,td{min-width:0}}
</style>
