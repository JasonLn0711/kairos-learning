import {readdirSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {diagramAsset,renderDiagramSvg} from '../src/lib/perspective-diagrams.ts';
import type {Perspective} from '../src/lib/perspectives.ts';
mkdirSync('site/images/perspectives',{recursive:true});
for(const file of readdirSync('content/perspectives').filter(f=>f.endsWith('.json'))){
 const p=JSON.parse(readFileSync(`content/perspectives/${file}`,'utf8')) as Perspective;
 // Assets are publicly copied: only published, public-safe article diagrams are exported.
 if(p.status!=='published')continue;
 for(const lang of ['zh','en'] as const)for(const s of p.text[lang].sections)if(s.diagram){
 const svg=renderDiagramSvg(s.diagram,lang==='zh'?'zh-Hant':'en');
 if(Buffer.byteLength(svg)>=100000)throw Error('Diagram exceeds image budget');
 writeFileSync('site'+diagramAsset(p.id,s.diagram,lang),svg);
 }
}
