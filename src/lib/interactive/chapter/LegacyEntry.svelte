<script lang="ts">
  import {onMount} from 'svelte';
  import {SITE,localized} from '../../model.ts';
  import type {Locale} from '../model.ts';
  let {target,slug='',count=0,title,lang}:{target:string;slug?:string;count?:number;title:string;lang:Locale}=$props();
  const canonical=$derived(target.split('#')[0]);
  const path=$derived(canonical.replace(/^\/en\//,'/'));
  const first=$derived(slug?target+'#'+slug+'-01':target);
  onMount(()=>{
    const n=Number(new URL(location.href).searchParams.get('step'));
    const step=Number.isInteger(n)&&n>=1&&n<=count?n:1;
    location.replace(slug?target+'#'+slug+'-'+String(step).padStart(2,'0'):target);
  });
</script>
<svelte:head><title>{title} | CS Kairos Learn</title><link rel="canonical" href={SITE+canonical}/><meta name="robots" content="noindex"/>
  <link rel="alternate" hreflang="zh-Hant" href={SITE+path}/><link rel="alternate" hreflang="en" href={SITE+localized(path,'en')}/><link rel="alternate" hreflang="x-default" href={SITE+path}/>
</svelte:head>
<main id="main"><h1>{title}</h1><a href={first}>{lang==='zh'?'前往章節圖解':'Go to chapter diagrams'}</a></main>
