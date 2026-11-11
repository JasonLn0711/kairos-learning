<script lang="ts">
  import type {DailyNote} from '$lib/ceh-notes';
  import type {Locale} from '$lib/model';
  import ArticleMetadata from './ArticleMetadata.svelte';
  import SourceBody from './SourceBody.svelte';
  import NoteFigure from './NoteFigure.svelte';
  import NoteRecall from './NoteRecall.svelte';
  import NoteChecks from './NoteChecks.svelte';
  import NoteDiagram from './NoteDiagram.svelte';
  let {note,lang}:{note:DailyNote;lang:Locale}=$props();
  const zh=$derived(lang==='zh');
</script>
<div class="daily-note">
  <p class="lead">{note.text[lang].summary}</p>
  <ArticleMetadata {lang} publishedOn={note.publishedOn} revisedOn={note.revisedOn} version={'v'+(note.contentVersion??'1.0.0')} author="CS Kairos"/>
  <p class="notice">{zh?`同一天的筆記集中於本頁；目前已整理 ${note.parts.length} / ${note.expectedParts} 部分。`:`Notes for this date share this page; ${note.parts.length} / ${note.expectedParts} parts are currently available.`}</p>
  <nav class="toc" aria-label={zh?'本文導覽':'On this page'}><ol>{#each note.parts as part}<li><a href={'#part-'+part.number}>{part.text[lang].title}</a><ul>{#each part.text[lang].sections as section}<li><a href={'#'+section.id}>{section.heading}</a></li>{/each}</ul></li>{/each}<li><a href="#note-sources">{zh?'參考來源':'References'}</a></li></ol></nav>
  <article class="prose">{#each note.parts as part}<section id={'part-'+part.number}><h2>{part.text[lang].title}</h2>{#each part.text[lang].sections as section}<section><h3 id={section.id}>{section.heading}</h3>{#each section.body as block}
    {#if block.kind==='figure'}<NoteFigure figure={block} date={note.date} part={part.number} {lang}/>
    {:else if block.kind==='diagram'}<NoteDiagram diagram={block} date={note.date} part={part.number} {lang}/>
    {:else if block.kind==='recall'}<NoteRecall {block} date={note.date} part={part.number} {lang}/>
    {:else if block.kind==='checks'}<NoteChecks {block} {lang}/>
    {:else if (block.kind==='paragraph'||block.kind==='heading')&&block.id}<h4 id={block.id}>{block.text}</h4>
    {:else}<SourceBody blocks={[block]} {lang}/>{/if}
  {/each}</section>{/each}</section>{/each}</article>
  <section class="sources"><h2 id="note-sources">{zh?'參考來源與查核界線':'References and verification boundaries'}</h2><p>{zh?'以下來源支持觀念解說；題號與參考答案取自本次供稿，尚未核對未提供的原題全文。':'These sources support the concept explanations. Question references and proposed answers come from the supplied notes; the missing original question texts have not been verified.'}</p><ul>{#each note.sources as source}<li><a href={source.url}>{source.title}</a> · {source.checkedOn}</li>{/each}</ul></section>
</div>
<style>
.daily-note{overflow-wrap:anywhere}h4{font-size:1.125rem;line-height:1.8;margin-top:2rem}.daily-note :global(.source-body h3){font-size:1.125rem;line-height:1.8}.daily-note :global(.source-body table){font-size:1rem;line-height:1.8}.daily-note :global(p),.daily-note :global(li),.daily-note :global(td),.daily-note :global(th){font-size:1rem;line-height:1.8}.daily-note :global(:focus-visible){outline:3px solid #175f91;outline-offset:3px}.toc ol{columns:1}.toc ul{margin:.5rem 0;padding-left:1.3rem}
</style>
