import {test} from 'node:test';
import assert from 'node:assert/strict';
import {deliveryFee,acceptsLength} from '../src/lib/rule-testing-demo.ts';
test('delivery threshold and invalid types follow the independent specification',()=>{
 for(const [input,fee]of [[0,60],[999,60],[1000,0],[1001,0],[2000,0]])assert.equal(deliveryFee(input),fee);
 for(const input of [-1,1.5,'1000',true,null,NaN,Infinity])assert.throws(()=>deliveryFee(input));
});
test('length-only comparison preserves the inclusive upper limit',()=>{
 for(const input of [0,79,80])assert.equal(acceptsLength(input),true);
 for(const input of [81,100])assert.equal(acceptsLength(input),false);
 for(const input of [-1,1.5,'80',null,NaN])assert.throws(()=>acceptsLength(input));
});
