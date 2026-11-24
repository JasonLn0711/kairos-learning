<script lang="ts">
  import {onMount,tick} from 'svelte';
  import {goto} from '$app/navigation';
  import {page} from '$app/state';
  import InteractiveFrame from '../components/InteractiveFrame.svelte';
  import LearningStage from '../components/LearningStage.svelte';
  import ChapterChart from './ChapterChart.svelte';

  import type {Locale} from '../model.ts';
  import type {Concept} from '../aase/model.ts';
  import type {Snapshot} from './frame.ts';
  let {chapter,lang,embedded=false}:{embedded?:boolean;chapter:{id:string;title:string;summary:string;sourceHref:string;units:Concept[];siblings:{id:string;title:string;href:string}[]};lang:Locale}=$props();
  const zh=$derived(lang==='zh');
  const path=$derived('/interactive/aase/m02/'+chapter.id+'/');
  const scenes=$derived(chapter.units.flatMap((unit,i)=>unit.scenes.map((scene,j)=>({unit,scene,i,j,key:unit.slug+'-'+scene.id}))));
  let ready=$state(false),paused=$state(false),reduced=$state(false),reset=$state(0);
  let snapshot=$state<{key:string;value:Snapshot}>();
  let localScene=$state('');
  const hash=$derived(embedded?localScene:ready?(page.shallow?.url??page.url).hash.slice(1):'');
  const index=$derived(scenes.findIndex(row=>row.key===hash));
  const mode=$derived(index>=0?'scene':hash==='poster'?'poster':'chapter');
  const row=$derived(scenes[Math.max(0,index)]);
  const nextChapter=$derived(chapter.siblings[chapter.siblings.findIndex(c=>c.id===chapter.id)+1]);
  let answer=$state<number>(),submitted=$state<number>();
  $effect(()=>{void row.key;answer=undefined;submitted=undefined;});
  onMount(()=>{
    ready=true;
    if(!embedded && location.hash && scenes.some(s=>'#'+s.key===location.hash)){
      void tick().then(()=>{
        const transcript=document.querySelector<HTMLDetailsElement>('.transcript');
        if(transcript)transcript.open=false;
        if(window.scrollY>document.querySelector('.board')!.getBoundingClientRect().height)document.querySelector('.tools')?.scrollIntoView({block:'start'});
      });
    }
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>reduced=media.matches;
    update();media.addEventListener('change',update);return ()=>media.removeEventListener('change',update);
  });
  function move(key:string){
    if(hash===key)return;
    if(embedded){localScene=key;return;}
    const url=new URL(location.href);url.hash=key;url.search='';
    void goto(url,{shallow:true,reset:false});
  }
  function select(i:number,j:number){move(chapter.units[i].slug+'-'+chapter.units[i].scenes[j].id);}
  function save(key:string,value:Snapshot){snapshot={key,value};}
  function navigateKey(event:KeyboardEvent){
    const target=event.target;
    if(embedded && !(target instanceof Element && target.closest('.chapter-page')))return;
    if(!ready || event.altKey || event.metaKey || event.ctrlKey || event.shiftKey || !(target instanceof HTMLElement) || target.closest('input,select,textarea,button,a,summary,[contenteditable]'))return;
    if(event.key==='ArrowRight' && index<scenes.length-1){event.preventDefault();move(scenes[index+1].key);}
    if(event.key==='ArrowLeft' && index>=0){event.preventDefault();move(scenes[index-1]?.key??'');}
  }
</script>
<svelte:window onkeydown={navigateKey}/>
{#snippet reader()}
  <section class="chapter-page" aria-label={chapter.title}>
    {#if !embedded}<nav class="chapters" aria-label={zh?'章節':'Chapters'}>{#each chapter.siblings as sibling}<a href={sibling.href} aria-current={sibling.id===chapter.id?'page':undefined}>{sibling.id.toUpperCase()}</a>{/each}</nav>
    <header><div><p class="chapter-id">{chapter.id.toUpperCase()}</p><h1>{chapter.title}</h1></div><a href={chapter.sourceHref}>{zh?'原始教材':'Source lesson'} ↗</a></header>{/if}
    <p class="summary">{chapter.summary}</p>
    <div class="reading-layout">
      <section class="board" aria-label={zh?'章節流程':'Chapter flow'}>
        <div class="tools">
          <button type="button" disabled={!ready} aria-pressed={mode==='chapter'} onclick={()=>move('')}>{zh?'章節脈絡':'Chapter flow'}</button>
          <button type="button" disabled={!ready} aria-pressed={mode==='poster'} onclick={()=>move('poster')}>{zh?'完整大圖':'Full diagram'}</button>
          {#if !reduced}<button type="button" disabled={!ready} onclick={()=>paused=!paused}>{paused?(zh?'繼續動畫':'Resume animation'):(zh?'暫停動畫':'Pause animation')}</button>{/if}
        </div>
        <div class="controls">
          <div class="step-pair">
            <button type="button" disabled={!ready || index<0} onclick={()=>move(scenes[index-1]?.key??'')}>{zh?'上一步':'Previous'}</button>
            {#if index===scenes.length-1 && nextChapter}<a class="advance" href={nextChapter.href}>{zh?'下一章':'Next chapter'} →</a>
            {:else}<button type="button" class="advance" disabled={!ready || index===scenes.length-1} onclick={()=>move(scenes[index+1].key)}>{index>=0 && scenes[index+1]?.i!==row.i?(zh?'下一概念':'Next concept'):(zh?'下一步':'Next')}</button>{/if}
          </div>
          <label>{zh?'分鏡':'Scene'} <select disabled={!ready} value={index} onchange={e=>move(scenes[Number(e.currentTarget.value)]?.key??'')}><option value="-1">{zh?'章節脈絡':'Chapter flow'}</option>{#each scenes as s,k}<option value={k}>{s.i+1}.{s.j+1} · {s.scene.title[lang]}</option>{/each}</select></label>
        </div>
        <ChapterChart chapter={chapter.id} title={chapter.title} units={chapter.units} {lang} {mode} unitIndex={row.i} step={row.j} snapshot={snapshot?.key===row.key?snapshot.value:undefined} paused={paused||reduced} {select}/>
        <p class="legend">{zh?'實線箭頭：資料或控制流　虛線箭頭：查驗　點線：平行支援':'Solid arrows carry data or control · Dashed arrows indicate checks · Dotted lines show parallel support'}</p>
      </section>
      <aside>
        {#if mode==='scene'}
          <h2>{row.unit.title[lang]}</h2>
          <p>{row.scene.problem[lang]}</p><p>{row.scene.mechanism[lang]}</p>
          {#key row.key+':'+reset}
            <LearningStage slug={row.unit.slug} scene={row.scene} {lang} {ready} fixture={chapter.id==='m02-06'?'m02-06':'m02-04'} onchange={value=>save(row.key,value)}/>
          {/key}
          {#if row.scene.choices||row.scene.demo}<button class="reset" type="button" onclick={()=>reset++}>{zh?'重設條件':'Reset conditions'}</button>{/if}
          <p><strong>{zh?'判讀界線':'Evidence boundary'}</strong><br/>{row.scene.boundary[lang]}</p>
          <a href={chapter.sourceHref+'#'+row.scene.sourceAnchors[0]}>{zh?'對照原文':'Read the source'}</a>
          {#if row.j===row.unit.scenes.length-1}
            <fieldset><legend>{row.unit.check.question[lang]}</legend>{#each row.unit.check.options as opt,k}<label><input type="radio" name="concept-answer" value={k} bind:group={answer}/> {opt[lang]}</label>{/each}
              <button type="button" disabled={answer===undefined} onclick={()=>submitted=answer}>{zh?'核對答案':'Check answer'}</button>
              {#if submitted!==undefined}<p role="status">{submitted===row.unit.check.answer?(zh?'正確':'Correct'):(zh?'再想想':'Try again')} · {row.unit.check.feedback[submitted][lang]}</p>{/if}
            </fieldset>
          {/if}
        {:else}
          <h2>{zh?'本章概念':'Chapter concepts'}</h2>
          <ol>{#each chapter.units as unit,i}<li><a href={'#'+unit.slug+'-01'} onclick={e=>{e.preventDefault();select(i,0)}}>{unit.title[lang]}</a><p>{unit.objective[lang]}</p></li>{/each}</ol>
        {/if}
      </aside>
    </div>
    <details class="transcript"><summary>{zh?'逐幕文字與來源':'Scene descriptions and sources'}</summary>
      {#each chapter.units as unit}<section><h2>{unit.title[lang]}</h2>{#each unit.scenes as scene}<article id={(embedded?'diagram-':'')+unit.slug+'-'+scene.id}><h3>{scene.title[lang]}</h3><p>{scene.mechanism[lang]}</p><p>{scene.observe[lang]}</p><p>{scene.boundary[lang]}</p>
      {#each scene.cards as card}<p><b>{card.label[lang]}</b> · {card.value[lang]}</p>{/each}
      {#each scene.choices??[] as choice}<p><b>{choice.label[lang]}</b> · {choice.result[lang]}</p>{/each}
      <a href={chapter.sourceHref+'#'+scene.sourceAnchors[0]}>{zh?'原文':'Source lesson'}</a></article>{/each}</section>{/each}
    </details>
  </section>
{/snippet}
{#if embedded}
  {@render reader()}
{:else}
  <InteractiveFrame {lang} {path} title={chapter.title} description={chapter.summary} fragment={hash?'#'+hash:''}>
    <main id="main" tabindex="-1">{@render reader()}</main>
  </InteractiveFrame>
{/if}
<style>
 .chapter-page{width:min(100%,96rem);margin:auto;padding:clamp(.75rem,2vw,2rem);--ink:#203b38;--muted:#53685e;--line:#b7c8bb;--paper:#fffef8;--soft:#eef3eb;--accent:#29685b}
 .chapters,.tools,.controls,.step-pair,header{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}
 .chapters a,.tools button,.controls button,.controls a,.reset{padding:.45rem .75rem;min-height:44px;display:inline-flex;align-items:center}
 .tools button{background:#eff4ed;color:#224b42;border:1px solid #adbeb1;border-radius:.25rem}
 .chapters [aria-current],.tools [aria-pressed=true]{color:var(--accent);border-bottom:3px solid var(--accent)}
 header{justify-content:space-between;margin-top:1rem}h1{margin:0;font-size:clamp(1.6rem,3vw,3rem)}.chapter-id,.legend{color:var(--muted);margin:.45rem 0}
 .summary{max-width:85ch;margin:.45rem 0}.chapter-id{margin:0}.chapter-page header{margin-top:.3rem}.chapters a{min-height:36px}.reading-layout{display:grid;grid-template-columns:minmax(0,2.8fr) minmax(16rem,1fr);gap:1.2rem;align-items:start}
 .board,aside,.controls label{min-width:0}.tools,.controls{margin:.55rem 0}.step-pair{flex-wrap:nowrap}.advance{background:#235d52;color:white;border-radius:.3rem}
 select{max-width:100%;min-width:0;min-height:44px}.controls label{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:.3rem;max-width:100%}
 aside{padding:1rem;background:var(--soft);border-radius:.4rem}aside h2{margin:0}aside ol{padding-left:1.3rem}aside li p{margin:.18rem 0 .6rem}fieldset label{display:block}fieldset{margin:1rem 0;min-width:0}
 .transcript{margin-block:1.3rem}.transcript summary{cursor:pointer;font-weight:bold}.transcript article{max-width:75ch}
 @media(max-width:850px){.reading-layout{grid-template-columns:minmax(0,1fr)}}
</style>
