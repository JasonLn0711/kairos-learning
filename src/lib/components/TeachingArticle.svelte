<script lang="ts">
  import type {Snippet} from 'svelte';
  import type {Locale} from '$lib/model';
  import type {ConceptDiscussion} from '$lib/concepts';
  import type {ReadingGuide} from '$lib/article-reading';
  import ArticleMetadata from './ArticleMetadata.svelte';
  import ArticleReadingGuide from './ArticleReadingGuide.svelte';
  import ConceptQA from './ConceptQA.svelte';
  let {lang,summary,identifier,publishedOn,version,revisedOn,readingId,guide,toc,qa=[],previous,next,lightCode=false,children}:{lang:Locale;summary:string;identifier:string;publishedOn:string;version:string;revisedOn:string;readingId:string;guide?:ReadingGuide;toc:{id:string;heading:string}[];qa?:ConceptDiscussion[];previous?:{href:string;title:string};next?:{href:string;title:string};lightCode?:boolean;children:Snippet}=$props();
</script>
<p class="lead">{summary}</p>
<ArticleMetadata {lang} {identifier} {publishedOn} {version} {revisedOn}/>
<ArticleReadingGuide id={readingId} {lang} {guide}/>
<nav class="toc" aria-label={lang==='zh'?'本文導覽':'On this page'}><ol>{#each toc as section}<li><a href={'#'+section.id}>{section.heading}</a></li>{/each}<li><a href="#discussion">Q&A</a></li></ol></nav>
<article class="prose" class:light-code={lightCode}>
  {@render children()}
  <section><h2 id="discussion">{lang==='zh'?'概念 Q&A':'Concept Q&A'}</h2>{#if qa.some(q=>q.text[lang])}<ConceptQA {qa} {lang}/>{:else}<p>{lang==='zh'?'待補：收到相關問題後，會整理為匿名教學版。':'Pending: related questions will be edited into anonymous teaching notes when available.'}</p>{/if}</section>
</article>
<nav class="next-links" aria-label={lang==='zh'?'前後概念':'Adjacent concepts'}>{#if previous}<a href={previous.href}>{previous.title}</a>{/if}{#if next}<a href={next.href}>{next.title}</a>{/if}</nav>
<style>.light-code :global(pre){background:#f2f6f5;color:#18252c}</style>
