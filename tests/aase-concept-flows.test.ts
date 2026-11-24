import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {feedback, isAssociation, outlines, storyboard} from '../src/lib/interactive/visual/aase/storyboards.ts';
import {objects} from '../src/lib/interactive/visual/aase/objects.ts';
import {chosenObject} from '../src/lib/interactive/visual/aase/scene-values.ts';
import type {Concept} from '../src/lib/interactive/aase/model.ts';

function read<T>(file:string):T {
  return JSON.parse(readFileSync(new URL('../content/interactive/aase-m02/'+file+'.json',import.meta.url),'utf8'));
}
const units=read<{id:string}[]>('manifest').flatMap(chapter=>read<Concept[]>(chapter.id));

test('all published scenes and every scenario selection address defined, localized diagram objects',()=>{
  assert.equal(units.length,40);
  assert.deepEqual(Object.keys(outlines).sort(),units.map(unit=>unit.slug).sort());
  for(const unit of units){
    assert.equal(unit.scenes.length,3);
    for(const [i,scene] of unit.scenes.entries()){
      const graph=storyboard(unit.slug,i+1),keys=graph.columns.flat();
      assert.equal(new Set(keys).size,keys.length);
      for(const key of keys){
        assert.ok(objects[key]?.zh && objects[key].en,unit.slug+' / '+key);
      }
      for(const [from,to] of graph.links){
        assert.ok(keys.includes(from) && keys.includes(to) && from!==to,unit.slug+' / '+scene.id);
      }
      for(const [choice] of (scene.choices??[]).entries()){
        const key=chosenObject(unit.slug,scene,choice);
        assert.ok(keys.includes(key),unit.slug+' / '+scene.id+' / '+key);
      }
    }
  }
});
test('parallel harness responsibilities, generation feedback, and ordered gate semantics stay distinct',()=>{
  assert.equal(isAssociation('llm-vs-harness',1),true);
  assert.equal(storyboard('llm-vs-harness',1).links.length,6);
  assert.deepEqual(feedback['autoregressive-generation'].to,'prefix');
  assert.deepEqual(storyboard('four-gates',2).columns.flat(),['schema','authorization','execution','verification']);
  assert.deepEqual(storyboard('context-and-tools',2).links,[]);
});
