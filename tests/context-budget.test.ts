import test from 'node:test';
import assert from 'node:assert/strict';
import {contextBudget} from '../src/lib/context-budget.ts';
test('the supplied context budget distinguishes spare space, exact capacity and overflow',()=>{
 assert.deepEqual(contextBudget(500),{used:9500,remaining:500,overflow:0,fits:true});
 assert.deepEqual(contextBudget(1800),{used:10800,remaining:-800,overflow:800,fits:false});
 assert.deepEqual(contextBudget(1000),{used:10000,remaining:0,overflow:0,fits:true});
 assert.equal(contextBudget(0).remaining,1000);assert.equal(contextBudget(3000).overflow,2000);
 for(const bad of [-1,3001,1.5,NaN,Infinity,-Infinity])assert.throws(()=>contextBudget(bad),RangeError);
});
