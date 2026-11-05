<script lang="ts">
  let {title,overview,overviewLabel,items,label}:{title:string;overview:string;overviewLabel:string;items:{id:string;title:string;href:string;current:boolean}[];label:string}=$props();
</script>
<aside class="module-rail"><div class="rail-content"><p class="rail-title">{title}</p><nav aria-label={label}><a href={overview}>{overviewLabel}</a>{#each items as item}<a href={item.href} aria-current={item.current?'page':undefined}><span>{item.id.toUpperCase()}</span>{item.title}</a>{/each}</nav></div></aside>
