<script lang="ts">
 import type {AaseSection} from '$lib/aase';
 import AaseBlocks from './AaseBlocks.svelte';
 import InlineText from './InlineText.svelte';
 let {section,lang}:{section:AaseSection;lang:'zh'|'en'}=$props();
 const paragraphs=(values:string[])=>values.flatMap(p=>p.split('\n\n'));
</script>
{#snippet inline(value:string)}{#each value.split(/(`[^`]+`)/g) as part}{#if part.startsWith('`')&&part.endsWith('`')}<code>{part.slice(1,-1)}</code>{:else}{part}{/if}{/each}{/snippet}
{#snippet prose(values:string[])}
 {#each paragraphs(values) as p}
  {#if p.startsWith('### ')}<h3>{p.slice(4)}</h3>
  {:else if p.startsWith('> ')}<blockquote><p>{@render inline(p.slice(2))}</p></blockquote>
  {:else if p.startsWith('- ')}<ul>{#each p.split('\n') as line}<li>{@render inline(line.slice(2))}</li>{/each}</ul>
  {:else}<p>{@render inline(p)}</p>{/if}
 {/each}
{/snippet}
<!-- Fixed comments preserve copyable synthetic email commands through Cloudflare. -->
{@html '<!--email_off-->'}
{@render prose(section.paragraphs)}
{#each section.blocks??[] as block}
 {#if block.kind==='prose'}{@render prose(block.paragraphs)}
 {:else if block.kind==='flow'||block.kind==='cards'}
 <figure class="git-figure" class:locations={block.kind==='flow'}>
  <figcaption><strong>{block.caption}</strong></figcaption>
  {#if block.kind==='flow'}
   <ol>{#each block.items as item,i}<li><div class="place" class:staging={i===1} class:local={i===2}><strong>{item.title}</strong><p>{item.body.split('\n')[0]}</p></div>{#if i<3}<div class="transition"><svg viewBox="0 0 20 24" aria-hidden="true"><path d="M10 2v18m-6-6 6 6 6-6"/></svg><span>{item.body.split('\n')[1]}</span></div>{/if}</li>{/each}</ol>
  {:else}
   <ul class="conditions">{#each block.items as item}<li><span aria-hidden="true">✓</span><div><strong><InlineText text={item.title}/></strong> <InlineText text={item.body}/></div></li>{/each}</ul>
  {/if}
  <p class="explanation">{block.description}</p>
  <a href={`/images/aase/m09-01-${block.kind==='flow'?1:2}-${lang}.svg`} download>{lang==='zh'?'下載 SVG 圖檔':'Download SVG figure'}</a>
 </figure>
 {:else}<AaseBlocks blocks={[block]} {lang}/>{/if}
{/each}
{@html '<!--/email_off-->'}
<style>
 .git-figure{margin:1.5rem 0;padding:1rem;border:1px solid #c6ced3;border-radius:.9rem;background:#fbfcfd;min-width:0;font-size:1rem;line-height:1.8;overflow-wrap:anywhere}
 figcaption{margin-bottom:1rem}ol,ul{list-style:none;margin:0;padding:0}li{min-width:0}.place{text-align:center;padding:1rem;border:1px solid transparent;border-radius:.7rem}.staging{background:#ecf3f8;border-color:#b6d1e8}.local{background:#ebf4f0;border-color:#b1d7c8}.place strong{font-weight:500}.place p{margin:.25rem 0 0}.transition{display:flex;justify-content:center;align-items:center;gap:.5rem;margin:.55rem 0;color:#4b5861;font-size:1rem}.transition svg{width:1.1rem;height:1.5rem;flex:none;fill:none;stroke:currentColor;stroke-width:2}.conditions{display:grid;gap:.6rem}.conditions li{display:flex;align-items:baseline;gap:.7rem}.conditions li>span{color:#17633c}.explanation{margin:1rem 0}.git-figure a{font-size:1rem}
</style>
