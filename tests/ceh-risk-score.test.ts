import test from 'node:test';
import assert from 'node:assert/strict';
import {riskScore,controlCounts} from '../src/lib/ceh-risk-score.ts';
test('all 25 ordinal combinations use independently specified expected results',()=>{
 const expected=[[[1,'low'],[2,'low'],[3,'low'],[4,'low'],[5,'medium']],[[2,'low'],[4,'low'],[6,'medium'],[8,'medium'],[10,'high']],[[3,'low'],[6,'medium'],[9,'medium'],[12,'high'],[15,'high']],[[4,'low'],[8,'medium'],[12,'high'],[16,'high'],[20,'high']],[[5,'medium'],[10,'high'],[15,'high'],[20,'high'],[25,'high']]];
 for(let l=1;l<=5;l++)for(let i=1;i<=5;i++){const [score,level]=expected[l-1][i-1];assert.deepEqual(riskScore(l,i),{score,level});}
});
test('invalid input never becomes a score',()=>{
 const invalid=[0,6,-1,1.5,NaN,Infinity,-Infinity,'3',null,undefined,true,{},[]];
 for(const value of invalid){assert.throws(()=>riskScore(value as number,5),RangeError);assert.throws(()=>riskScore(3,value as number),RangeError);}
});
test('control proportions retain the authoritative count and total',()=>{assert.deepEqual(controlCounts,[37,8,14,34]);assert.equal(controlCounts.reduce((a,b)=>a+b,0),93);});
