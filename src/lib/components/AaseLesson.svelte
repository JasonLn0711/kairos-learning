<script lang="ts">
  import type {AaseLesson,AaseSource} from '$lib/aase';
  import TeachingArticle from './TeachingArticle.svelte';
  import AaseBlocks from './AaseBlocks.svelte';
  let {lesson,sources,navigation,indexHref}:{lesson:AaseLesson;sources:AaseSource[];navigation:{title:string;href:string;pending:boolean;side:'previous'|'next';displayId:string}[];indexHref:string}=$props();
  const text=$derived(lesson.text.zh);
  const toc=$derived([{id:'objectives',heading:'學習目標'},...text.sections.map(s=>({id:s.id,heading:s.heading})),{id:'practice',heading:'最小實作'},{id:'checks',heading:'理解檢核'},{id:'sources',heading:'來源與延伸'}]);
  const neighbor=(side:'previous'|'next')=>{
    const n=navigation.find(n=>n.side===side);
    if(!n)return {href:indexHref,title:side==='previous'?'← 概念目錄（第一個概念）':'返回概念目錄 →'};
    const title=`${n.displayId} · ${n.title}${n.pending?' · 待整理':''}`;
    return {href:n.href,title:side==='previous'?'← '+title:'下一個：'+title+' →'};
  };
</script>
<TeachingArticle lang="zh" summary={text.summary} identifier={lesson.id.replace(/^AASE-(M\d{2})-C(\d{2})$/,'AASE $1-$2')} publishedOn={lesson.publishedOn} version={'v'+lesson.contentVersion} revisedOn={lesson.date} readingId={lesson.id} guide={text.readingGuide} {toc} qa={lesson.qa} previous={neighbor('previous')} next={neighbor('next')} lightCode>
<section><h2 id="objectives">學習目標</h2><ul>{#each text.objectives as objective}<li>{objective}</li>{/each}</ul></section>
{#each text.sections as s}<section><h2 id={s.id}>{s.heading}</h2>{#each s.paragraphs as p}<p>{p}</p>{/each}{#if s.blocks}<AaseBlocks blocks={s.blocks}/>{/if}{#if s.sourceIds?.length}<p>本節依據：{#each s.sourceIds as id}<a href={sources.find(x=>x.id===id)!.url}>{sources.find(x=>x.id===id)!.title}</a>{' '}{/each}</p>{/if}</section>{/each}
<section><h2 id="practice">最小實作</h2><p>環境：{text.exercise.environment}</p><ol>{#each text.exercise.steps as step}<li>{step}</li>{/each}</ol><h3>預期結果</h3><p>{text.exercise.expected}</p><h3>檢查方式</h3><p>{text.exercise.check}</p><h3>清理與保留</h3><p>{text.exercise.cleanup}</p></section>
<section><h2 id="checks">理解檢核</h2><p>先選擇答案並說明理由，再展開解析。本篇是閱讀型自我檢核，不記錄作答或實作完成。</p>{#each lesson.checks as q}{@const t=q.text.zh!}<section><h3 id={q.id}>{t.prompt}</h3><ol type="A">{#each t.options as option}<li>{option}</li>{/each}</ol><details><summary>參考答案與逐項解析</summary><p>答案：{String.fromCharCode(65+q.answer)}</p><ol type="A">{#each t.rationales as reason}<li>{reason}</li>{/each}</ol></details></section>{/each}</section>
<section><h2 id="sources">來源與延伸</h2><p>下列來源支持對應原理；合成案例、練習與檢核為本系列設計。</p><ul>{#each sources as source}<li><a href={source.url}>{source.title}</a> · 查核 <time datetime={source.checkedOn}>{source.checkedOn}</time></li>{/each}</ul><p><a href="/courses/aase/v1/workshop/">工作坊資源與成果檢查</a></p></section>
</TeachingArticle>
