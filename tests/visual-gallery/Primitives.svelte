<script lang="ts">
  import Primitive from '../../src/lib/interactive/visual/Primitive.svelte';
  const kinds=['tile','box','cylinder','shadow','focus','label','grid','connector','arrow'] as const;
</script>
<h1>Geometry · 幾何圖元</h1>
<main>{#each kinds as kind}
<section><h2>{kind}</h2><svg viewBox="-55 -50 110 90" role="img" aria-label={kind}>
  <Primitive {kind} tone="teal" text="資料" points={[{x:-40,y:12},{x:-5,y:-12},{x:35,y:-12}]}/>
</svg><svg viewBox="-55 -50 110 90" role="img" aria-label={kind+' compact'}><g transform="translate(2 3) rotate(-8) scale(.7)">
  <Primitive {kind} tone="violet" text="Data" points={[{x:-40,y:12},{x:-5,y:-12},{x:35,y:-12}]}/>
</g></svg></section>{/each}</main>
<style>
  main{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
  section{border:1px solid;border-radius:8px;padding:12px}
  h2{font-size:1rem}svg{width:48%;color:inherit}
</style>
