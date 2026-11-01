<script lang="ts">
 import {readingGuide} from '$lib/article-reading';
 let {id,lang}:{id:string;lang:string}=$props();
 const guide=$derived(readingGuide(id,lang));
</script>
{#if guide}<aside class="article-reading-guide" aria-label={lang==='zh'?'閱讀與練習導引':'Reading and practice guide'}>
 <h2>{lang==='zh'?'這篇要學會什麼':'What you will learn'}</h2><p class="goal">{guide.goal}</p>
 <dl><div><dt>{lang==='zh'?'從這裡開始':'Start here'}</dt><dd>{guide.startingPoint}</dd></div><div><dt>{lang==='zh'?'閱讀順序':'Reading route'}</dt><dd>{guide.route}</dd></div><div><dt>{lang==='zh'?'讀完留下的成果':'Your learning artifact'}</dt><dd>{guide.output}</dd></div></dl>
</aside>{/if}
<style>
 aside{background:#edf5f3;border:1px solid #54766c;border-radius:1rem;padding:clamp(.85rem,3vw,1.5rem);margin:1.5rem 0;color:#182b40;overflow-wrap:anywhere}h2{font-size:1.15rem;margin:0;line-height:1.7}.goal{font-size:1.05rem;line-height:1.8}dl{display:grid;gap:1rem;margin:0}dt{font-weight:700}dd{margin:.3rem 0 0;line-height:1.8}dl>div{min-width:0}
</style>
