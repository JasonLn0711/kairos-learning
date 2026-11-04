<script lang="ts">
  import ProtectionDiagram from "./ProtectionDiagram.svelte";
  import NmapPositions from "./NmapPositions.svelte";
  import ScanDiagram from "./ScanDiagram.svelte";
  import scanDiagrams from "$lib/m0303-scan-diagrams.json";
  import DiscoveryDiagram from "./DiscoveryDiagram.svelte";
  import discoveryDiagrams from "$lib/m0302-discovery-diagrams.json";
  import TransportDiagram from "./TransportDiagram.svelte";
  import transportDiagrams from "$lib/m0301-diagrams.json";
  import NetworkDiagram from './NetworkDiagram.svelte';
  import {networkDiagram} from '$lib/m0206-network';
  import ReadableDiagramText from './ReadableDiagramText.svelte';
  import {readingGuide} from '$lib/article-reading';
  import type { SourceBlock } from '$lib/concepts';
  import ConceptBlocks from './ConceptBlocks.svelte';
  import ReviewedSvgVisual from './ReviewedSvgVisual.svelte';
  import { reviewedSvgMarkup } from '$lib/reviewed-svg';
  import InlineText from './InlineText.svelte';
  let { blocks, conceptId='', lang='zh' }: {blocks: SourceBlock[];conceptId?:string;lang?:string} = $props();
</script>
<div class="source-body">
  {#each blocks as block,i}
    {#if block.kind === 'sourceImage'}
      <figure class="original-image">
        <img src={block.src} alt={block.alt} width={block.width} height={block.height} loading="lazy" />
        <p class="image-links"><a href={block.src}>{block.openLabel}</a><a href={block.src} download>{block.downloadLabel}</a></p>
        <ReadableDiagramText src={block.src} {lang}/>
        <figcaption>{block.caption}</figcaption>
      </figure>
    {:else if block.kind === 'visual' && ['/images/ceh/m03-08-roles-zh-v1-1-0.svg','/images/ceh/m03-08-roles-en-v1-1-0.svg','/images/ceh/m03-08-evidence-zh-v1-1-0.svg','/images/ceh/m03-08-evidence-en-v1-1-0.svg'].includes(block.src)}<ProtectionDiagram {block} {lang}/>{:else if block.kind === 'visual' && ['/images/ceh/m03-07-positions-zh.svg','/images/ceh/m03-07-positions-en.svg'].includes(block.src)}<NmapPositions {block}/>{:else if block.kind === 'visual' && block.src in scanDiagrams}<ScanDiagram {block} {lang}/>{:else if block.kind === 'visual' && block.src in discoveryDiagrams}<DiscoveryDiagram {block} {lang}/>{:else if block.kind === 'visual' && block.src in transportDiagrams}<TransportDiagram {block} {lang}/>{:else if block.kind === 'visual' && networkDiagram(block.src)}<NetworkDiagram {block} {lang}/>{:else if block.kind === 'visual' && reviewedSvgMarkup(block.src)}<ReviewedSvgVisual {block} {lang}/>{:else if block.kind === 'visual'}<div class="source-visual"><ConceptBlocks blocks={[block.visual]}/><a href={block.src} download>{block.downloadLabel}</a></div>

    {:else if block.kind === 'heading'}<h2 id={block.id}><InlineText text={block.text} /></h2>
    {:else if block.kind === 'paragraph' && block.id}<h3 id={block.id}><InlineText text={block.text}/></h3>
    {:else if block.kind === 'paragraph'}<p><InlineText text={block.text} /></p>
    {:else if block.kind === 'code'}{#if conceptId==='CEH26-M04-C01'||readingGuide(conceptId,lang)||conceptId==='M03-02'||conceptId==='M03-03'||conceptId==='M03-04'||conceptId==='M03-05'||conceptId==='M03-06'||conceptId==='M03-08'}<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard access to horizontally scrolling code.) --><pre tabindex="0" role="region" aria-label={lang==='zh'?'可捲動程式碼或文字範例':'Scrollable code or text example'}><code>{block.text}</code></pre>{:else}<pre><code>{block.text}</code></pre>{/if}
    {:else if block.kind === 'answer'}<details class="reference-answer" id={block.id}><summary><InlineText text={block.summary}/></summary>{#each block.paragraphs as paragraph}<p><InlineText text={paragraph}/></p>{/each}</details>
    {:else if block.kind === 'list'}<ul>{#each block.items as item}<li><InlineText text={item} /></li>{/each}</ul>
    {:else if block.kind === 'table'}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable tables need keyboard access.) -->
      <div class="table-scroll" role="region" aria-label={block.headers.join('、')} tabindex="0"><table><thead><tr>{#each block.headers as header}<th scope="col">{header}</th>{/each}</tr></thead><tbody>{#each block.rows as row}<tr>{#each row as cell}<td><InlineText text={cell} /></td>{/each}</tr>{/each}</tbody></table></div>
    {/if}
  {/each}
</div>
<style>
  .original-image{margin:1.5rem 0;max-width:100%;min-width:0}
  .original-image img{display:block;width:100%;height:auto;max-width:100%}
  .original-image figcaption{margin-top:.6rem;overflow-wrap:anywhere}
  .image-links{display:flex;flex-wrap:wrap;gap:.6rem 1.2rem}

  .reference-answer{border:1px solid var(--line);border-radius:8px;padding:1rem;margin:1.5rem 0;background:var(--soft)}
  .reference-answer summary{cursor:pointer;font-weight:600}
  .table-scroll{max-width:100%;overflow-x:auto;margin:1.5rem 0}
  table{border-collapse:collapse;width:100%;font-size:.9rem;line-height:1.65}
  th,td{text-align:left;vertical-align:top;border-bottom:1px solid var(--line);padding:.65rem;min-width:7rem}
  th{background:var(--soft)}
  @media print{.table-scroll{overflow:visible}th,td{min-width:0}}
</style>
