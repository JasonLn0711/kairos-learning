<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:number;lang:'zh'|'en'}=$props();
</script>
<figure class="session-access" data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===1}
  <dl class="factors">{#each diagram.items as item}<div><dt>{item.title}</dt><dd>{item.body}</dd></div>{/each}</dl>
 {:else if number===2}
  <div class="decision-flow">
   <div class="node"><strong>{diagram.items[0].title}</strong><p>{diagram.items[0].body}</p></div>
   <span class="arrow" aria-hidden="true">↓</span>
   <div class="node"><strong>{diagram.items[1].title}</strong><p>{diagram.items[1].body}</p></div>
   <p class="branch-label">{lang==='zh'?'工作階段檢查的兩種結果（擇一）':'Alternative outcomes of the session check'}</p><div class="split">
    <div class="node denied"><strong>{diagram.items[3].title}</strong><p>{diagram.items[3].body}</p></div>
    <div class="continuation"><span class="arrow">↳ {lang==='zh'?'有效':'Valid'}</span>
     <div class="node"><strong>{diagram.items[2].title}</strong><p>{diagram.items[2].body}</p></div>
     <p class="branch-label">{lang==='zh'?'權限檢查的兩種結果（擇一）':'Alternative outcomes of the permission check'}</p><div class="outcomes">{#each diagram.items.slice(4) as item,i}<div><span class="arrow">↳ {lang==='zh'?(i===0?'無權限':'有權限'):(i===0?'No permission':'Permission granted')}</span><div class="node" class:denied={i===0} class:allowed={i===1}><strong>{item.title}</strong><p>{item.body}</p></div></div>{/each}</div>
    </div>
   </div>
  </div>
 {:else}
  <div class="roles">{#each diagram.items.slice(0,2) as item}<div class="node"><strong>{item.title}</strong><p>{item.body}</p></div>{/each}</div>
  <p class="exchange">{lang==='zh'?'瀏覽器 → 伺服器：送出 Cookie；伺服器驗證 Session 是否有效。':'Browser → server: send the cookie; the server checks session validity.'}</p>
  <div class="record"><strong>{diagram.items[2].title}</strong><p>{diagram.items[2].body}</p></div>
 {/if}
 <p>{diagram.description}</p>
 <a href={`/images/aase/m06-05-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;padding:1rem;margin:1.5rem 0;background:#fbfcfd;border:1px solid #d5dce0;border-radius:1rem;color:#18252c}figcaption,p,dt,dd,a,strong,.arrow{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}figcaption{margin-bottom:1rem}p{margin:.5rem 0;white-space:pre-line}.factors{margin:0}.factors>div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1rem;border-bottom:1px solid #d5dce0;padding:.8rem 0}dt{font-weight:650}dd{margin:0}.node,.record{min-width:0;padding:1rem;border:1px solid #88969e;border-radius:1rem;background:#f3f4f5}.decision-flow{max-width:48rem;margin:auto}.decision-flow>.node{max-width:30rem;margin:auto;text-align:center}.arrow{display:block;text-align:center;margin:.4rem 0}.split{border-left:2px solid #88969e;padding-left:.75rem;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:1rem;align-items:start}.split>.denied{margin-top:1rem}.outcomes{border-left:2px solid #88969e;padding-left:.75rem}.branch-label{margin-top:1rem}.outcomes,.roles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.denied{background:#f9eaea;border-color:#b4444a}.allowed{background:#e8f3ec;border-color:#43815c}.exchange{text-align:center}.record{margin:1rem 0}a{color:#075f87;text-decoration:underline}a:focus-visible{outline:3px solid #b15840;outline-offset:4px}
 @container(max-width:38rem){.split,.outcomes,.roles,.factors>div{grid-template-columns:1fr}.factors>div{gap:.25rem}.split>.denied{margin-top:.5rem;border-left-width:5px}}
</style>
