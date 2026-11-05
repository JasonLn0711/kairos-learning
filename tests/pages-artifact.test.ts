import test from 'node:test';
import assert from 'node:assert/strict';
import {waitForPagesArtifact} from '../scripts/pages-artifact.mjs';
const artifact={id:17,name:'github-pages-2',size_in_bytes:1000,expired:false};
test('Pages waits for the current attempt and ignores previous attempt artifacts',async()=>{
 let calls=0;const waits:number[]=[],logs:string[]=[];
 const result=await waitForPagesArtifact({name:'github-pages-2',list:async()=>{calls++;return calls<3?[{...artifact,name:'github-pages-1'}]:[{...artifact,name:'github-pages-1'},artifact];},sleep:async(ms:number)=>{waits.push(ms);},log:(s:string)=>{logs.push(s);},clock:()=>0});
 assert.equal(result.id,17);assert.equal(calls,3);assert.deepEqual(waits,[2000,2000]);assert.ok(logs.some(s=>s.includes('1/6: 0 matching')));assert.ok(logs.at(-1)!.includes('1000 bytes'));
});
test('Pages refuses duplicate names and propagates API failures without deployment retries',async()=>{
 let waits=0;
 await assert.rejects(waitForPagesArtifact({name:'github-pages-2',list:async()=>[artifact,artifact],sleep:async()=>{waits++;}}),/ambiguous Pages deployment/);
 await assert.rejects(waitForPagesArtifact({name:'github-pages-2',list:async()=>{throw Error('API unavailable');},sleep:async()=>{waits++;}}),/API unavailable/);
 assert.equal(waits,0);
});
test('Pages visibility waiting is bounded and reports that deployment has not started',async()=>{
 let calls=0,waits=0;
 await assert.rejects(waitForPagesArtifact({name:'github-pages-2',list:async()=>{calls++;return [];},maxChecks:3,sleep:async()=>{waits++;}}),/after 3 metadata checks; deployment has not started/);
 assert.equal(calls,3);assert.equal(waits,2);
});
test('Pages rejects invalid wait settings, expired artifacts and malformed responses',async()=>{
 for(const name of ['github-pages','github-pages-0','../github-pages-2'])await assert.rejects(waitForPagesArtifact({name,list:async()=>[artifact]}),/configuration/);
 for(const patch of [{expired:true},{expired:undefined},{id:0},{size_in_bytes:0}])await assert.rejects(waitForPagesArtifact({name:'github-pages-2',list:async()=>[{...artifact,...patch}]}),/Invalid or expired/);
 await assert.rejects(waitForPagesArtifact({name:'github-pages-2',list:async()=>null}),/Invalid Pages artifact list/);
});
