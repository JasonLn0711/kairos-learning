<script lang="ts">
  import {fit,type Frame} from "../../chapter/frame.ts";
  import type {TeachingScene} from '../../aase/model.ts';
  import type {Locale} from '../../model.ts';
  let {frame,scene,lookup,lang,choice}:{frame:Frame;scene:TeachingScene;lookup:TeachingScene;lang:Locale;choice:number}=$props();
  const uid=$props.id();
  const width=$derived(frame.width);
  const narrow=$derived(width>0&&width<440);
  const rows=$derived((lookup.choices??[]).map(o=>({id:o.cards[0].value.en,vector:o.cards.slice(1).map(c=>c.value.en)})));
  const selected=$derived(scene.id==='02'?choice:0);
  const dimensions=[1,2,3,4];
</script>
<g transform={fit(frame,narrow?300:570,narrow?204:145)} data-flow="embeddings" data-scene={scene.id}>
    <title id={uid+'-t'}>{scene.title[lang]}</title><desc id={uid+'-d'}>{scene.mechanism[lang]} {scene.observe[lang]}</desc>
    <g transform={'translate('+(narrow?42:62)+' 43)'} data-object="matrix">
      <path d="m0 0 10-8h192l-10 8z" fill="#cbe3df" stroke="#486d70"/><path d="m192 0 10-8v52l-10 8z" fill="#85a9a8" stroke="#486d70"/>
      {#each dimensions as dim,i}<text x={i*48+24} y="-14">x{dim}</text>{/each}
      {#each rows as row,r}
        <g data-row={row.id} data-selected={selected===r}>
          <text x="-5" y={r*26+18} text-anchor="end">#{row.id}</text>
          {#each row.vector as v,i}
            <rect x={i*48} y={r*26} width="48" height="26" fill={scene.id==='03'&&i===2?'#efd29f':r===selected?'#b5dfd1':'#f0f5f1'} stroke="#688384"/>
            <text x={i*48+24} y={r*26+18}>{v}</text>
          {/each}
        </g>
      {/each}
    </g>
    {#if scene.id==='03'}
      <text x={narrow?145:280} y={narrow?135:127}>{lang==='zh'?'比較同一維：0.9 與 0.2':'Compare x3 across rows: 0.9 and 0.2'}</text>
    {:else}
      <path d={narrow?'M245 '+(56+26*selected)+'h23V166h-47m6-5-6 5 6 5':'M267 '+(56+26*selected)+'h25V76h39m-7-5 7 5-7 5'} fill="none" stroke="#497574" stroke-width="2"/>
      <g transform={'translate('+(narrow?43:350)+' '+(narrow?153:65)+')'} data-object="vector">
        <text x="86" y="-10">{lang==='zh'?'取出列':'Read row'} #{rows[selected].id}</text>
        {#each rows[selected].vector as v,i}<rect x={i*43} width="43" height="25" fill="#b5dfd1" stroke="#688384"/><text x={i*43+21} y="18">{v}</text>{/each}
      </g>
    {/if}
</g>
<style>


 text{font:600 13px system-ui,sans-serif;text-anchor:middle;fill:var(--ink)}
 text[text-anchor=end]{text-anchor:end}
</style>
