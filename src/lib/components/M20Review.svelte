<script lang="ts">
 import type {M20Review} from '$lib/m20-review';
 import ArticleMetadata from './ArticleMetadata.svelte';
 import SourceBody from './SourceBody.svelte';
 import NoteDiagram from './NoteDiagram.svelte';
 let {review}:{review:M20Review}=$props();
</script>
<div class="m20-review">
 <p class="lead">{review.summary}</p>
 <p><a href="/courses/ceh/v13/m20/hash-encryption-and-signatures/">延伸閱讀：M20 雜湊、加密與數位簽章</a></p>
 <ArticleMetadata lang="zh" publishedOn={review.publishedOn} revisedOn={review.revisedOn} version={'v'+review.contentVersion} author="CS Kairos"/>
 <nav aria-label="本文導覽"><ol>{#each review.sections as section}<li><a href={'#'+section.id}>{section.heading}</a></li>{/each}<li><a href="#m20-sources">參考來源</a></li></ol></nav>
 <article class="prose">{#each review.sections as section}<section><h2 id={section.id}>{section.heading}</h2>{#each section.body as block}
 {#if block.kind==='diagram'}<NoteDiagram diagram={block} date={review.publishedOn} part={20} lang="zh"/>
 {:else if block.kind==='heading'}<h3 id={block.id}>{block.text}</h3>
 {:else if block.kind==='code'}<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard access to local horizontal scrolling.) --><pre tabindex="0" role="region" aria-label="可捲動程式碼範例"><code>{block.text}</code></pre>
 {:else}<SourceBody blocks={[block]} lang="zh"/>{/if}
 {/each}</section>{/each}</article>
 <section><h2 id="m20-sources">參考來源與查核界線</h2><p>{review.publishedOn==='2026-11-13'?'本次供稿提供觀念解說與題號對照，未附完整13題題幹及52個選項；以下一手來源支持技術解說。':'英文題幹、題號及選項來自本次供稿；以下一手來源支持技術解說。'}題庫預期答案未另附，不將編輯判斷稱為官方答案。本文提供閱讀與自我複習，學習完成與考試準備度須另外評估。</p><ul>{#each review.sources as source}<li><a href={source.url}>{source.title}</a> · 查核：{source.checkedOn}</li>{/each}</ul></section>
</div>
<style>
 .m20-review{overflow-wrap:anywhere;min-width:0}.m20-review :global(p),.m20-review :global(li),.m20-review :global(td),.m20-review :global(th){font-size:1rem;line-height:1.8}.m20-review :global(:focus-visible){outline:3px solid #175f91;outline-offset:3px}pre{max-width:100%;overflow:auto}h3{font-size:1.2rem;line-height:1.8}
</style>
