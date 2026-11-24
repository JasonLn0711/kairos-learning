<script lang="ts">
  import type {Concept,TeachingScene} from '../aase/model.ts';
  import type {Locale} from '../model.ts';
  import type {Frame,Snapshot} from './frame.ts';
  import ConceptFlow from '../visual/aase/ConceptFlow.svelte';
  import SequenceFlow from '../visual/aase/SequenceFlow.svelte';
  import TokenRibbon from '../visual/aase/TokenRibbon.svelte';
  import EmbeddingLookup from '../visual/aase/EmbeddingLookup.svelte';
  import SoftmaxFlow from '../visual/aase/SoftmaxFlow.svelte';
  import CapacityTrack from '../visual/aase/CapacityTrack.svelte';
  import {chosenObject,lessonValues,scenarioStates,scenarioValues} from '../visual/aase/scene-values.ts';
  let {unit,scene,frame,lang,snapshot,run=false,paused=false}:{unit:Concept;scene:TeachingScene;frame:Frame;lang:Locale;snapshot?:Snapshot;run?:boolean;paused?:boolean}=$props();
  const slug=$derived(unit.slug);
  const choice=$derived(snapshot?.choice??0);
  const cards=$derived(scene.choices?.[choice]?.cards??scene.cards);
  const states=$derived(snapshot?.states??(scene.demo==='gates'?{schema:'passed',authorization:'passed',execution:'passed',verification:'failed'}:scenarioStates(slug,scene,choice)));
  const values=$derived(snapshot?.values??{...lessonValues(slug,scene,cards,lang),...scenarioValues(slug,scene,choice),...Object.fromEntries(Object.entries(states).map(([k,v])=>[k,lang==='zh'?({passed:'通過',failed:'失敗',skipped:'略過'}[v]??v):v]))});
</script>
{#if slug==='embeddings'}<EmbeddingLookup {frame} {scene} lookup={unit.scenes[1]} {lang} {choice}/>
{:else if slug==='softmax-weighted-sum'}<SoftmaxFlow {frame} {scene} {lang} a={snapshot?.a??1} b={snapshot?.b??0}/>
{:else if slug==='context-budget'}<CapacityTrack {frame} {scene} {lang} logs={snapshot?.logs??500} labels={lang==='zh'?['規則','需求與程式碼','測試','預留輸出','額外日誌']:['Rules','Requirements and code','Tests','Output reserve','Extra logs']}/>
{:else if slug==='position-information' || slug==='autoregressive-generation'}<SequenceFlow {frame} {unit} {scene} {lang} {choice} {run} {paused}/>
{:else if slug==='tokenization'}<TokenRibbon {frame} {scene} {cards} {lang}/>
{:else}<ConceptFlow {frame} {slug} {scene} {lang} {values} {states} active={snapshot?.active??chosenObject(slug,scene,choice)} {run} {paused}/>
{/if}
