<script lang="ts">
  import type {TeachingScene,Card} from '../../aase/model.ts';
  import type {Locale} from '../../model.ts';
  let {scene,cards,lang}:{scene:TeachingScene;cards:Card[];lang:Locale}=$props();
  const id=$props.id();
  const rows=$derived(Object.fromEntries(cards.map(c=>[c.label.en,c.value[lang]])));
  const pieces=$derived((rows.Sequence??rows['Hypothetical split']??rows['Received text']).split(/\s*·\s*/u));
  const ids=$derived((rows['IDs in order']??'').split(/[,、]\s*/u));
  const zh=$derived(lang==='zh');
  const tileWidth=$derived(pieces.length<3?125:72);
</script>
<figure data-flow="tokenization" data-scene={scene.id}>
  <svg role="img" viewBox={'0 0 '+(pieces.length*tileWidth+22)+' '+(scene.id==='03'?136:86)} aria-labelledby={id+'-t '+id+'-d'}>
    <title id={id+'-t'}>{scene.title[lang]}</title><desc id={id+'-d'}>{scene.mechanism[lang]} {pieces.join(' · ')} {rows['IDs in order']??''}</desc>
    {#each pieces as piece,i}
      <g transform={'translate('+(11+i*tileWidth)+' 25)'} data-object="piece">
        <path d={'m0 8 7-7h'+(tileWidth-9)+'l-7 7z'} fill="#c8dfd8"/>
        <rect x="0" y="8" width={tileWidth-9} height="26" fill="#e4efeb"/>
        <path d={'m'+(tileWidth-9)+' 8 7-7v26l-7 7z'} fill="#9bbdb4"/>
        <text x={(tileWidth-9)/2} y="26">{piece}</text>
        {#if scene.id==='03'}
          <path d={'M'+((tileWidth-9)/2)+' 38v20m-4-4 4 4 4-4'} fill="none"/>
          <text x={(tileWidth-9)/2} y="77">ID {ids[i]}</text>
        {/if}
      </g>
    {/each}
    <text x={(pieces.length*tileWidth+22)/2} y={scene.id==='03'?127:79}>{scene.id==='01'?(zh?'原始文字':'Raw input'):scene.id==='03'?(zh?'依序查詞彙表':'Vocabulary lookup'):(zh?pieces.length+' 個詞元':pieces.length+' tokens')}</text>
  </svg>
</figure>
<style>
 figure{margin:0;background:var(--paper);border-block:1px solid var(--line);padding:.3rem}
 svg{height:8rem;width:100%;display:block}
 path,rect{stroke:#4c706a;stroke-width:1.25}
 text{font:600 13px system-ui,sans-serif;fill:var(--ink);text-anchor:middle}
</style>
