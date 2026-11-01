<script lang="ts">
 let {lang,publishedOn,version,revisedOn,identifier,author,reviewedOn,observedAt}:{lang:string;publishedOn:string;version:string;revisedOn?:string;identifier?:string;author?:string;reviewedOn?:string;observedAt?:string}=$props();
 const zh=$derived(lang==='zh');
</script>
<p class="metadata article-metadata">
 {#if identifier}<span>{identifier}</span>{/if}
 {#if author}<span>{author}</span>{/if}
 <span>{zh?'原發布':'First published'} <time datetime={publishedOn}>{publishedOn}</time></span>
 <span>{version}</span>
 {#if revisedOn}<span>{zh?'版本修訂':'Version revised'} <time datetime={revisedOn}>{revisedOn}</time></span>{/if}
 {#if reviewedOn}<span>{zh?'內容校對':'Content checked'} <time datetime={reviewedOn}>{reviewedOn}</time></span>{/if}
 {#if observedAt}<span>{zh?'觀察截至':'Observed through'} {observedAt}</span>{/if}
</p>
<style>
 .article-metadata{display:flex;flex-wrap:wrap;gap:.25rem 0;font-size:.875rem;line-height:1.8;overflow-wrap:anywhere}
 span{min-width:0}span+span::before{content:'·';margin:0 .6em}time{white-space:nowrap}
</style>
