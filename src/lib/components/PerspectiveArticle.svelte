<script lang="ts">
 import ArticleMetadata from './ArticleMetadata.svelte';
 import type {Perspective} from '$lib/perspectives';
 import type {Locale} from '$lib/model';
 import TeachingDiagram from './TeachingDiagram.svelte';
 import QAInline from './QAInline.svelte';
 let {article,lang,related}:{article:Perspective;lang:Locale;related:{title:string;href:string}[]}=$props();
 const t=$derived(article.text[lang]);const zh=$derived(lang==='zh');
</script>
<p class="eyebrow">{({analysis:zh?'議題解讀':'Analysis','field-notes':zh?'實作手記':'Field notes',reflection:zh?'觀點反思':'Reflection'})[article.category]} · {article.topics.map(t=>({cs:zh?'資工':'Computing',ai:'AI',security:zh?'資安':'Security'})[t]).join(' / ')}</p>
<p class="lead">{t.summary}</p>
<ArticleMetadata {lang} author={t.author} publishedOn={article.publishedOn} version={'v'+article.revision} revisedOn={article.updatedOn} observedAt={article.observedAt}/>
<nav class="toc" aria-label={zh?'本文導覽':'On this page'}><ol>{#each t.sections as s}<li><a href={'#'+s.id}>{s.heading}</a></li>{/each}</ol></nav>
<article class="prose">{#each t.sections as s}<section><h2 id={s.id}>{s.heading}</h2>{#each s.paragraphs as paragraph}<p><QAInline text={paragraph}/></p>{/each}{#if s.diagram}<TeachingDiagram diagram={s.diagram} articleId={article.id} {lang}/>{/if}{#if s.list}<ul>{#each s.list as item}<li><QAInline text={item}/></li>{/each}</ul>{/if}{#if s.code}<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard scrolling for long code.) -->
<pre tabindex="0" role="region" aria-label={(zh?'程式碼：':'Code: ')+s.heading}><code>{s.code}</code></pre>{/if}{#if s.table}<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard scrolling for wide tables.) -->
<div class="table-scroll" tabindex="0" role="region" aria-label={(zh?'表格：':'Table: ')+s.heading}><table><thead><tr>{#each s.table.headers as h}<th scope="col">{h}</th>{/each}</tr></thead><tbody>{#each s.table.rows as row}<tr>{#each row as cell}<td><QAInline text={cell}/></td>{/each}</tr>{/each}</tbody></table></div>{/if}{#each s.sourceIds??[] as id}{@const source=article.sources.find(s=>s.id===id)!}<p class="source-note"><a href={source.url}>{source.title}</a></p>{/each}</section>{/each}</article>
{#if related.length}<section id="related"><h2>{zh?'延伸學習':'Further learning'}</h2><ul>{#each related as r}<li><a href={r.href}>{r.title}</a></li>{/each}</ul></section>{/if}
<section id="sources"><h2>{zh?'參考來源':'Sources'}</h2><ul>{#each article.sources as s}<li><a href={s.url}>{s.title}</a> · {s.checkedOn}</li>{/each}</ul></section>
{#if article.updates.length}<section id="updates"><h2>{zh?'更新紀錄':'Updates'}</h2>{#each article.updates as u}<p>{u.date} · {u.text[lang]}</p>{/each}</section>{/if}
<a href={zh?'/perspectives/':'/en/perspectives/'}>{zh?'返回觀點':'Back to perspectives'}</a>
<style>.prose{max-width:72ch}pre{background:#f2f6f5;color:#18252c}.table-scroll{overflow-x:auto;max-width:100%}table{border-collapse:collapse;width:100%}th,td{min-width:7rem;padding:.6rem;text-align:left;border-bottom:1px solid var(--line)}</style>
