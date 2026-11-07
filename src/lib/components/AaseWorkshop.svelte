<script lang="ts">
 import checksum from '../../../site/downloads/aase/SHA256SUMS.txt?raw';
 const packageHash=checksum.trim().split(/\s+/)[0];
 import type {AaseCourse} from '$lib/aase';
 import {aaseUI} from '$lib/aase-ui';
 import {localized,type Locale} from '$lib/model';
 let {course,lang='zh'}:{course:Pick<AaseCourse,'modules'>;lang?:Locale}=$props();
 const l=$derived(aaseUI[lang]);
</script>
<p class="lead">{l.workshopLead}</p>
<p><a href={localized('/courses/aase/v1/',lang)}>{l.back}</a> · <a href={'/downloads/aase/aase-v1-workshop.zip?sha256='+packageHash} download>{l.download}</a> · <a data-sveltekit-reload href={'/downloads/aase/SHA256SUMS.txt?sha256='+packageHash}>{l.checksum}</a></p><p>{l.packageLanguage}</p>
<section><h2>{l.packageTitle}</h2><ul>{#each l.packageItems as item}<li>{item}</li>{/each}</ul><p>{l.packageNote}</p></section>
<section><h2>{l.scheduleTitle}</h2><p>{l.schedule}</p><ol>{#each course.modules as m}<li><a href={localized('/courses/aase/v1/'+m.id+'/',lang)}>{m.id.toUpperCase()}｜{m.title}</a>：{m.minutes} {l.minutes} ({l.including} {m.practiceMinutes} {l.practiceMinutes}). {l.artifact}：{m.artifact}。</li>{/each}</ol></section>
<section><h2>{l.preparationTitle}</h2><p>{l.preparation}</p><ol>{#each l.route as step}<li>{step}</li>{/each}</ol></section>
<section><h2>{l.scopeTitle}</h2>{#each l.scope as p}<p>{p}</p>{/each}</section>
<style>section{margin-block:2rem}p,li{line-height:1.8;overflow-wrap:anywhere}li{margin-block:.75rem}</style>
