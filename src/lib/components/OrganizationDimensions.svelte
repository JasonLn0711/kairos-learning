<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram}:{diagram:ConceptVisual}=$props();
</script>
<figure class="organization-dimensions">
 <figcaption><strong>{diagram.caption}</strong><p>{diagram.description}</p></figcaption>
 <div class="organization-map">
  <div class="dimensions">{#each diagram.items.slice(0,5) as item,i}<div class="dimension" class:permission={i===1}><strong>{item.title}</strong><p>{item.body}</p></div>{/each}</div>
  <div class="collective"><strong>{diagram.items[5].title}</strong><p>{diagram.items[5].body}</p></div>
 </div>
</figure>
<style>
 .organization-dimensions{container-type:inline-size;margin:1.5rem 0;padding:1rem;background:#fafafa;border:1px solid #c6cbd2;border-radius:12px;color:#17212b;overflow-wrap:anywhere}figcaption{text-align:center}figcaption>strong{font-size:1.2rem;line-height:1.75}p,strong{font-size:1rem;line-height:1.8}.dimensions{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1rem;padding-bottom:2rem;position:relative}.dimension{position:relative;min-width:0;background:#e9ebee;text-align:center;border-radius:18px;padding:1rem .5rem}.dimension strong{font-size:1.2rem}.dimension p{margin:.5rem 0 0}.dimension strong:lang(en){font-size:1rem}.permission{background:#b15840;color:white}.dimension::after{content:'';position:absolute;left:50%;top:100%;height:2rem;border-left:2px solid #a5a5a5}.dimensions::after{content:'';position:absolute;left:calc((100% - 4rem)/10);right:calc((100% - 4rem)/10);bottom:0;border-top:2px solid #a5a5a5}.collective{position:relative;margin:2rem auto 0;padding:1rem;max-width:34rem;text-align:center;background:#f2e7e2;border:2px solid #b65e46;border-radius:22px}.collective strong{font-size:1.3rem}.collective p{margin:.5rem 0 0}.collective::before{content:'';position:absolute;left:50%;top:-2rem;height:2rem;border-left:2px solid #888}@container(max-width:42rem){.organization-map{margin-left:.5rem;padding-left:1.5rem;border-left:2px solid #a5a5a5}.dimensions{grid-template-columns:1fr;padding-bottom:0}.dimensions::after{display:none}.dimension::after{left:-1.5rem;top:50%;height:0;width:1.5rem;border-left:0;border-top:2px solid #a5a5a5}.collective{max-width:none;margin:1rem 0 0}.collective::before{left:-1.5rem;top:50%;height:0;width:1.5rem;border-left:0;border-top:2px solid #888}}
</style>
