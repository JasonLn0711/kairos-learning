<script lang="ts">
 import SystemsFigure from './SystemsFigure.svelte';
 import type {PerspectiveBlock} from '$lib/perspective-body';
 import QAInline from './QAInline.svelte';
 let {blocks,lang,heading}:{blocks:PerspectiveBlock[];lang:'zh'|'en';heading:string}=$props();
</script>
<div class="longform">
{#each blocks as b}
 {#if b.kind==='systemsFigure'}<SystemsFigure name={b.name} {lang}/>{:else if b.kind==='heading'}<h3 id={b.id}>{b.text}</h3>
 {:else if b.kind==='paragraph'}<p><QAInline text={b.text}/></p>
 {:else if b.kind==='list'}<ul>{#each b.items as item}<li><QAInline text={item}/></li>{/each}</ul>
 {:else if b.kind==='code'}<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard scrolling for long examples.) -->
 <pre tabindex="0" role="region" aria-label={(lang==='zh'?'程式碼或示意流程：':'Code or illustrative flow: ')+heading}><code>{b.text}</code></pre>
 {:else if b.kind==='table'}<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard scrolling for wide tables.) -->
 <div class="table-scroll" tabindex="0" role="region" aria-label={(lang==='zh'?'表格：':'Table: ')+heading}><table><thead><tr>{#each b.headers as h}<th scope="col">{h}</th>{/each}</tr></thead><tbody>{#each b.rows as row}<tr>{#each row as cell}<td><QAInline text={cell}/></td>{/each}</tr>{/each}</tbody></table></div>
 {/if}
{/each}
</div>
<style>
 .longform{min-width:0;overflow-wrap:anywhere;font-size:1rem;line-height:1.8}h3{margin-top:2rem;line-height:1.7}pre{max-width:100%;overflow:auto;font-size:1rem;line-height:1.8;background:#f2f6f5;color:#18252c;padding:1rem;white-space:pre}pre code{font-size:inherit}.table-scroll{overflow-x:auto;max-width:100%;margin:1.5rem 0}table{border-collapse:collapse;width:100%;font-size:1rem;line-height:1.8}th,td{min-width:7rem;padding:.6rem;text-align:left;border-bottom:1px solid var(--line)}:focus-visible{outline:3px solid #147d72;outline-offset:3px}
</style>
