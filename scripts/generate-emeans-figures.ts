import {writeFileSync} from 'node:fs';
import {eMeansFigureNames,eMeansAsset,renderEMeansSvg} from '../src/lib/e-means-figures.ts';
for(const name of eMeansFigureNames)for(const lang of ['zh','en'] as const){const svg=renderEMeansSvg(name,lang);if(Buffer.byteLength(svg)>=100000)throw Error('Figure exceeds asset limit');writeFileSync('site'+eMeansAsset(name,lang),svg);}
console.log('Generated 16 reviewed e-means SVGs.');
