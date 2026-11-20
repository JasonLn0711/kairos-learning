import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {eMeansFigureNames,eMeansFigureText,eMeansArtwork,eMeansAsset,renderEMeansSvg,cosineStep,emaPosition,type EMeansFigureName} from '../src/lib/e-means-figures.ts';
import {validatePerspectiveBody,perspectiveBodyText,perspectiveBodyShape,type PerspectiveBlock} from '../src/lib/perspective-body.ts';
import {validatePerspectives,type Perspective} from '../src/lib/perspectives.ts';
import {getPage,searchEntries} from '../src/lib/server/catalog.ts';
const article=JSON.parse(readFileSync('content/perspectives/e-means-clustering.json','utf8')) as Perspective;
test('e-means figures are allowlisted and cannot introduce arbitrary markup',()=>{
 for(const name of eMeansFigureNames){const b:PerspectiveBlock[]=[{kind:'eMeansFigure',name}];validatePerspectiveBody(b,new Set());assert.ok(perspectiveBodyText(b).length>5);assert.ok(eMeansFigureText(name,'zh').length>5);assert.ok(!/<script|foreignObject|onload=|https?:/i.test(eMeansArtwork(name)));}
 for(const b of [{kind:'eMeansFigure',name:'<script>'},{kind:'eMeansFigure',name:'ema',html:'<svg>'}])assert.throws(()=>validatePerspectiveBody([b] as PerspectiveBlock[],new Set()));
 assert.throws(()=>eMeansArtwork('arbitrary-url' as EMeansFigureName));
 assert.notEqual(perspectiveBodyShape([{kind:'eMeansFigure',name:'ema'}]),perspectiveBodyShape([{kind:'eMeansFigure',name:'cosine'}]));
});
test('numeric chart endpoints, EMA geometry and exact figure exports agree',()=>{
 assert.equal(cosineStep(0),.4);assert.ok(Math.abs(cosineStep(.5)-.22)<1e-12);assert.ok(Math.abs(cosineStep(1)-.04)<1e-12);
 for(const x of [-1,1.1,NaN,Infinity])assert.throws(()=>cosineStep(x));
 assert.equal((emaPosition(56)-emaPosition(50))/(emaPosition(80)-emaPosition(50)),.2);
 for(const name of eMeansFigureNames)for(const lang of ['zh','en'] as const){const svg=renderEMeansSvg(name,lang);assert.ok(Buffer.byteLength(svg)<100000);assert.equal(readFileSync('site'+eMeansAsset(name,lang),'utf8'),svg);assert.match(svg,/<title/);assert.match(svg,/<desc/);}
});
test('the complete bilingual article is published, searchable and tied to model evaluation',()=>{
 validatePerspectives([article],{lesson:new Set(['ai-data-splits']),concept:new Set()});
 assert.equal(article.text.zh.sections.length,15);
 for(const lang of ['zh','en'] as const){const path=(lang==='zh'?'':'/en')+'/perspectives/e-means-clustering/';assert.equal(getPage(path)?.perspective?.id,article.id);const body=article.text[lang].sections.flatMap(s=>s.body??[]);assert.equal(body.filter(b=>b.kind==='eMeansFigure').length,8);assert.equal(body.filter(b=>b.kind==='heading').length,32);assert.ok(searchEntries.some(e=>e.lang===lang&&e.id===article.id&&e.text.includes('190/17')));}
 const missing=structuredClone(article);missing.text.en.sections[5].body!.pop();assert.throws(()=>validatePerspectives([missing],{lesson:new Set(['ai-data-splits']),concept:new Set()}),/body mismatch/);
});
