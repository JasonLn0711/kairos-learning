import test from 'node:test';
import assert from 'node:assert/strict';
import {validatePerspectiveBody,perspectiveBodyText,perspectiveBodyShape,type PerspectiveBlock} from '../src/lib/perspective-body.ts';
const body:PerspectiveBlock[]=[{kind:'paragraph',text:'Before'},{kind:'heading',id:'sub-one',text:'One'},{kind:'code',text:'a\nb'},{kind:'paragraph',text:'Between'},{kind:'table',headers:['A','B'],rows:[['1','2']]},{kind:'code',text:'second example'},{kind:'list',items:['last']}];
test('ordered body preserves interleaved text, code, table and list in search',()=>{
 validatePerspectiveBody(body,new Set(['main']));
 assert.deepEqual(perspectiveBodyText(body),['Before','One','a\nb','Between','A','B','1','2','second example','last']);
});
test('rejects malformed blocks, injection fields and anchor collisions',()=>{
 for(const b of [[{kind:'html',text:'<script/>'}],[{kind:'paragraph',text:'x',html:'<b>x</b>'}],[{kind:'table',headers:['A'],rows:[['a','b']]}],[{kind:'list',items:[]}],[{kind:'heading',id:'main',text:'duplicate'}],[{kind:'code',text:''}]])assert.throws(()=>validatePerspectiveBody(b as PerspectiveBlock[],new Set(['main'])));
 assert.throws(()=>validatePerspectiveBody([...body,{kind:'heading',id:'sub-one',text:'Duplicate'}],new Set()));
});
test('bilingual shape distinguishes omitted examples and altered table dimensions',()=>{
 const translated=structuredClone(body);translated[0]={kind:'paragraph',text:'之前'};
 assert.equal(perspectiveBodyShape(translated),perspectiveBodyShape(body));
 assert.notEqual(perspectiveBodyShape(body.slice(0,-1)),perspectiveBodyShape(body));
});
test('fixed systems figures expose searchable labels and reject unknown layouts',()=>{
 validatePerspectiveBody([{kind:'systemsFigure',name:'git-dag'}],new Set());
 assert.ok(perspectiveBodyText([{kind:'systemsFigure',name:'git-dag'}]).some(t=>t.includes('父指標')));
 assert.throws(()=>validatePerspectiveBody([{kind:'systemsFigure',name:'arbitrary-url'}] as unknown as PerspectiveBlock[],new Set()));
 assert.notEqual(perspectiveBodyShape([{kind:'systemsFigure',name:'links'}]),perspectiveBodyShape([{kind:'systemsFigure',name:'cas'}]));
});
