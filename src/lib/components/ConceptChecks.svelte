<script lang="ts">
  import type { ConceptCheck } from '$lib/concepts';
  import type { Locale } from '$lib/model';
  let { checks, lang }: {checks:ConceptCheck[];lang:Locale} = $props();
</script>
{#each checks.filter(q=>q.text[lang]) as check}
{@const text = check.text[lang]!}
<section class="question"><h3 id={'test-'+check.id}>{check.id}．{text.prompt}</h3>
<ol type="A">{#each text.options as option}<li>{option}</li>{/each}</ol>
<section><h4>{lang==='zh'?'答案與教材解析':'Answer and teaching explanation'}</h4>
<p><strong>{lang==='zh'?'答案':'Answer'}：{String.fromCharCode(65+check.answer)}</strong></p>
{#each text.rationales as rationale}<p>{rationale}</p>{/each}</section></section>
{/each}
<style>h4{font-weight:600;padding:.6rem 0}li{margin:.6rem 0}</style>
