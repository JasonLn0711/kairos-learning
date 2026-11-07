import test from 'node:test';
import assert from 'node:assert/strict';
import {attentionDemo} from '../src/lib/attention-demo.ts';
test('attention arithmetic matches worked examples and relative scores',()=>{
 const initial=attentionDemo(1,0);assert.ok(Math.abs(initial.weights[0]-0.7310585786300049)<1e-12);assert.ok(Math.abs(initial.value-3.0757656854799804)<1e-12);
 for(const score of [-4,0,4])assert.deepEqual(attentionDemo(score,score),{weights:[0.5,0.5],value:4});
 assert.deepEqual(attentionDemo(2,1),initial);
 assert.ok(attentionDemo(-4,4).value>5.99);assert.ok(attentionDemo(4,-4).value<2.01);
 assert.ok(Math.abs(attentionDemo(0,1).value+initial.value-8)<1e-12);
});
test('attention calculation rejects values outside its declared teaching domain',()=>{
 for(const value of [NaN,Infinity,-Infinity,-4.1,4.1]){assert.throws(()=>attentionDemo(value,0),RangeError);assert.throws(()=>attentionDemo(0,value),RangeError);}
});
