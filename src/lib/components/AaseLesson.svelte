<script lang="ts">
  import type { AaseLesson, AaseSource } from '$lib/aase';
  import ArticleMetadata from './ArticleMetadata.svelte';
  let {lesson,sources,navigation}:{lesson:AaseLesson;sources:AaseSource[];navigation:{title:string;href:string;pending:boolean}[]}=$props();
</script>
<article class="aase-lesson">
<p class="lead">{lesson.summary}</p>
<ArticleMetadata lang="zh" publishedOn={lesson.publishedOn} version={'v'+lesson.contentVersion} revisedOn={lesson.revisedOn} identifier={lesson.id} author="CS Kairos" />
<h2>讀完後，你應該能</h2><ul>{#each lesson.objectives as objective}<li>{objective}</li>{/each}</ul>
<nav aria-label="本篇目錄"><ul>{#each lesson.sections as s}<li><a href={'#'+s.id}>{s.heading}</a></li>{/each}<li><a href="#practice">最小實作</a></li><li><a href="#checks">理解檢核</a></li></ul></nav>
{#each lesson.sections as s}
<section id={s.id}><h2>{s.heading}</h2>{#each s.paragraphs as p}<p>{p}</p>{/each}
{#if s.figure}<figure><svelte:element this={s.figure.kind==='flow'?'ol':'ul'} class="diagram">{#each s.figure.items as item,i}<li class="node">{#if s.figure.kind==='flow'}<p class="step">步驟 {i+1}</p>{/if}<h3>{item.title}</h3><p>{item.body}</p></li>{/each}</svelte:element><figcaption>{s.figure.caption}</figcaption></figure>{/if}
{#if s.code}<!-- svelte-ignore a11y_no_noninteractive_tabindex --><div class="code-region" role="region" aria-label={s.heading+'範例'} tabindex="0"><pre><code>{s.code}</code></pre></div>{/if}
{#if s.sourceIds?.length}<p class="references">本節依據：{#each s.sourceIds as id}<a href={sources.find(x=>x.id===id)!.url}>{sources.find(x=>x.id===id)!.title}</a>{' '}{/each}</p>{/if}
</section>
{/each}
<section id="practice"><h2>最小實作</h2><p>環境：{lesson.exercise.environment}</p><ol>{#each lesson.exercise.steps as step}<li>{step}</li>{/each}</ol><h3>預期結果</h3><p>{lesson.exercise.expected}</p><h3>檢查方式</h3><p>{lesson.exercise.check}</p><h3>清理與保留</h3><p>{lesson.exercise.cleanup}</p></section>
<section id="checks"><h2>理解檢核</h2><p>先選擇答案並說明理由，再展開解析。本篇是閱讀型自我檢核，不記錄作答或實作完成。</p>{#each lesson.checks as q}<section aria-labelledby={q.id}><h3 id={q.id}>{q.prompt}</h3><ol type="A">{#each q.options as option}<li>{option}</li>{/each}</ol><details><summary>參考答案與逐項解析</summary><p>答案：{String.fromCharCode(65+q.answer)}</p><ol type="A">{#each q.rationales as reason}<li>{reason}</li>{/each}</ol></details></section>{/each}</section>
<section><h2>來源與延伸</h2><p>下列來源支持對應原理；合成案例、練習與檢核為本系列設計。</p><ul>{#each sources as source}<li><a href={source.url}>{source.title}</a> · 查核 <time datetime={source.checkedOn}>{source.checkedOn}</time></li>{/each}</ul><p><a href="/courses/aase/v1/workshop/">工作坊資源與成果檢查</a></p></section>
<nav aria-label="前後概念"><ul>{#each navigation as n}<li><a href={n.href}>{n.title}{n.pending?'（準備中，前往模組目錄）':''}</a></li>{/each}</ul></nav>
</article>
<style>
 .aase-lesson{overflow-wrap:anywhere}.aase-lesson p,.aase-lesson li{font-size:1rem;line-height:1.8}section{margin-block:2rem}.diagram{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:1rem}.node{margin:0;min-width:0;padding:1rem;border:1px solid #64748b;border-radius:.5rem;background:#f2f6f5}.node h3{line-height:1.8;font-size:1.125rem;margin-block:.2rem}.node p{margin-bottom:0}.step{margin-top:0;font-weight:600}figure{margin:1.5rem 0}figcaption{font-size:1rem;line-height:1.8;margin-top:.75rem}.code-region{max-width:100%;overflow:auto;border:1px solid #64748b;border-radius:.5rem}.code-region pre{margin:0;font-size:1rem;line-height:1.8;background:#f2f6f5;color:#18252c}.code-region code{background:transparent;color:inherit}.references a{display:inline-block}details{padding:1rem;border:1px solid #64748b}summary{cursor:pointer;line-height:1.8}:global(.aase-lesson :focus-visible){outline:3px solid #175f91;outline-offset:3px}
</style>
