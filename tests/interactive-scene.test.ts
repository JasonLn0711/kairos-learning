import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {networkStage,teachingStage} from '../src/lib/interactive/visual/scene.ts';
import {sceneLinks} from '../src/lib/interactive/geometry.ts';
import {validateInteractiveLesson} from '../src/lib/interactive/validate.ts';
import {sceneAt,type InteractiveLessonData} from '../src/lib/interactive/model.ts';
import type {Concept} from '../src/lib/interactive/aase/model.ts';
const read=(path:string)=>JSON.parse(readFileSync(new URL('../content/interactive/'+path,import.meta.url),'utf8'));
const lesson:InteractiveLessonData=read('request-lifecycle.json');
test('both cameras frame the same authored routes in either language, including cached DNS',()=>{
  validateInteractiveLesson(lesson);
  for(const mode of ['wide','compact'] as const)for(const step of lesson.steps)for(const enabled of [false,true]){
    const source=sceneAt(step,{dnsCached:enabled,dbSlow:enabled});
    const make=(lang:'zh'|'en')=>networkStage(step.id,lesson.nodes,lesson.edges,source,lang,mode);
    const zh=make('zh'),en=make('en');
    assert.deepEqual(zh.camera,en.camera);
    assert.deepEqual(sceneLinks(zh.layout,source).map(s=>s.to),source.route.slice(1));
    for(const n of zh.layout.nodes){
      assert.ok(n.bounds.left>=zh.camera.x-zh.camera.width/2 && n.bounds.right<=zh.camera.x+zh.camera.width/2);
      assert.ok(n.bounds.top>=zh.camera.y-zh.camera.height/2 && n.bounds.bottom<=zh.camera.y+zh.camera.height/2);
    }
    assert.equal(en.caption,source.label.en);
  }
});
test('catalog rejects undeclared roles, edges, NaN, raw markup and duplicate nodes before adaptation',()=>{
  for(const mutate of [
    (x:any)=>x.nodes[0].kind='unknown',(x:any)=>x.edges[0].from='missing',
    (x:any)=>x.nodes[0].x=NaN,(x:any)=>x.steps[0].scene.label.en='<svg>',
    (x:any)=>x.nodes[1].id=x.nodes[0].id,(x:any)=>x.nodes[0].port='custom'
  ]){
    const input=structuredClone(lesson);mutate(input);assert.throws(()=>validateInteractiveLesson(input));
  }
});
test('specialized authored demos and visuals take precedence over narrative kinds',()=>{
  let count=0;
  for(const chapter of read('aase-m02/manifest.json'))for(const concept of read('aase-m02/'+chapter.id+'.json') as Concept[]){
    for(const scene of concept.scenes){
      for(const lang of ['en','zh'] as const){
        const stage=teachingStage(scene,lang);
        assert.equal(stage.caption,scene.title[lang]);assert.deepEqual(stage.sourceAnchors,scene.sourceAnchors);
        assert.equal(stage.renderer,scene.demo??scene.visual??scene.kind);
      }
      count++;
    }
  }
  assert.equal(count,120);
});

import {createPlayback} from '../src/lib/interactive/visual/playback.ts';
test('pause, seek, resume and replay preserve deterministic path phase',()=>{
  const p=createPlayback(),plan=[{travelMs:100,holdMs:100}];
  assert.equal(p.tick(500,plan).position,0);
  assert.equal(p.tick(550,plan).position,.5);
  p.pause();assert.equal(p.tick(5000,plan).position,.5);
  assert.equal(p.tick(5050,plan).waiting,true);
  p.seek(200);assert.equal(p.tick(8000,plan).done,true);
  p.reset();assert.equal(p.tick(9000,plan).position,0);
});

import {attentionDemo,evaluateGates} from '../src/lib/interactive/aase/simulations.ts';
test('all slider ticks normalize before rounding; failed gates skip every later check',()=>{
  for(let a=-4;a<=4;a+=.25)for(let b=-4;b<=4;b+=.25){
    const {weights,value}=attentionDemo(a,b);
    assert.ok(Math.abs(weights[0]+weights[1]-1)<1e-12);
    assert.equal(value,2*weights[0]+6*weights[1]);
    if(a===b)assert.equal(value,4);
  }
  for(let mask=0;mask<16;mask++){
    const flags=[1,2,4,8].map(bit=>Boolean(bit&mask));
    const [schema,authorized,toolSucceeded,verified]=flags;
    const result=evaluateGates({schema,authorized,toolSucceeded,verified});
    assert.deepEqual(result.stages,flags.map((v,i)=>flags.slice(0,i).every(Boolean)?v?'passed':'failed':'skipped'));
    assert.equal(result.accepted,mask===15);
  }
});
