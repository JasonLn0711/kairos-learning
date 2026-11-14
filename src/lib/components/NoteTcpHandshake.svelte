<script lang="ts">
 import type {NoteDiagram} from '$lib/note-diagrams';
 let {diagram}:{diagram:NoteDiagram}=$props();
</script>
<div class="tcp">
 <div class="peers" aria-hidden="true"><strong>Client</strong><strong>Server</strong></div>
 <ol>{#each diagram.items as item,i}<li class:reply={i===1}>
  <strong>{item.title}</strong><p>{item.body}</p>
  <svg aria-hidden="true" viewBox="0 0 600 75" preserveAspectRatio="none"><path d={i===1?'M590 8 10 62m18-16L10 62l24 5':'M10 8 590 62m-24 5 24-5-18-16'}/></svg>
 </li>{/each}</ol>
</div>
<style>
 .tcp{container-type:inline-size;margin:1rem 0}.peers{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:25%;text-align:center}.peers strong{padding:1rem;border:2px solid #94a3b8;border-radius:1rem;background:#e8ecef;font-size:1.25rem}ol{list-style:none;margin:0 12%;padding:1rem 0;border-inline:2px dashed #94a3b8}li{text-align:center;padding:1rem 0;color:#245fe8}li.reply{color:#008c83}li strong{font-size:1.2rem}p{color:#18252c;margin:.4rem 0;font-size:1rem;line-height:1.8}svg{width:100%;height:75px;display:block;fill:none;stroke:currentColor;stroke-width:3}
 @container(max-width:30rem){.peers{gap:1rem}.peers strong{font-size:1rem;padding:.5rem}ol{margin:0;border:0}li{padding:1rem 0}svg{height:48px}}
</style>
