import test from 'node:test';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';
import data from '../src/lib/footprint-diagrams.json' with {type:'json'};
import {searchEntries} from '../src/lib/server/catalog.ts';
test('footprint semantic cards preserve shared SVG labels, explicit flows and search',()=>{
 const r=spawnSync('python3',['scripts/build-footprint-diagrams.py','--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);assert.equal(Object.keys(data).length,32);
 for(const [src,d] of Object.entries(data)){assert.equal(d.nodes.length,4);assert.equal(typeof d.flow,'boolean');const id=src.includes('m03-02-')?'M03-02':src.includes('m03-03-')?'M03-03':src.includes('m03-04-')?'M03-04':src.includes('m02-07-')?'M02-07':src.includes('m02-08-')?'M02-08':'M03-01';const lang=src.endsWith('-en.svg')?'en':'zh';const text=searchEntries.find(e=>e.id===id&&e.lang===lang)!.text;for(const n of d.nodes){assert.equal(n.body.length,2);for(const t of [n.title,...n.body])assert.ok(text.includes(t));}}
});
