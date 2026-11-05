import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {assertArchitectureDiagram,architectureDiagramText,type ArchitectureDiagramModel} from '../src/lib/architecture-diagram.ts';
import {createAaseCatalog,type AaseCourse,type AaseLesson,type AaseSource} from '../src/lib/aase.ts';
const fixture=():ArchitectureDiagramModel=>({kind:'architecture',level:'context',caption:'Context',description:'Scope and directed data',boundary:'Receiving',nodes:[{id:'operator',title:'Operator',body:'Provides data',kind:'person',inside:false},{id:'system',title:'Receiving system',body:'Checks fields',kind:'software-system',inside:true}],relations:[{from:'operator',to:'system',label:'Supplies synthetic input'},{from:'system',to:'operator',label:'Returns current report'}]});
test('architecture model preserves directed relationship names in searchable text',()=>{
 const d=fixture();assertArchitectureDiagram(d);assert.ok(architectureDiagramText(d).includes('人／角色'));assert.ok(architectureDiagramText(d).includes('系統範圍外'));
 assert.deepEqual(architectureDiagramText(d).slice(-6),['Operator','Supplies synthetic input','Receiving system','Receiving system','Returns current report','Operator']);
});
test('architecture model rejects ambiguous, disconnected, oversized or executable-shaped data',()=>{
 const mutations:((d:any)=>void)[]=[d=>d.nodes[1].id='operator',d=>d.relations[0].to='missing',d=>d.relations[0].to='operator',d=>d.relations.push({...d.relations[0]}),d=>d.nodes.push({id:'orphan',title:'Orphan',body:'No relation',kind:'person',inside:false}),d=>{d.nodes.push({id:'external',title:'External',body:'Outside',kind:'software-system',inside:false});d.relations.push({from:'operator',to:'external',label:'Unrelated outside interaction'});},d=>d.nodes[0].href='javascript:alert(1)',d=>d.svg='<svg/>',d=>d.nodes[0].inside='false',d=>d.nodes[0].kind='iframe',d=>d.nodes[0].body=' ',d=>d.relations[0].label='',d=>d.relations[0].points=[0,1],d=>d.nodes=Array.from({length:9},(_,i)=>({...d.nodes[0],id:'n'+i})),d=>d.relations=Array.from({length:13},(_,i)=>({...d.relations[0],label:String(i)}))];
 for(const mutate of mutations){const d=fixture();mutate(d);assert.throws(()=>assertArchitectureDiagram(d),/Invalid architecture/);}
});
test('architecture abstraction levels cannot turn a component into a container or mix context internals',()=>{
 const d=fixture();d.nodes[1].kind='container';assert.throws(()=>assertArchitectureDiagram(d));
 d.level='container';assertArchitectureDiagram(d);
 (d.nodes[1] as any).kind='component';assert.throws(()=>assertArchitectureDiagram(d));
 const context=fixture();context.nodes[0].inside=true;assert.throws(()=>assertArchitectureDiagram(context));
});
test('AASE validates diagram references before publication and gates diagram search text',()=>{
 const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
 const course=read('content/aase/course.json') as AaseCourse;const sources=read('content/aase/sources.json') as AaseSource[];const lessons=readdirSync('content/aase/lessons').map(f=>read('content/aase/lessons/'+f)) as AaseLesson[];
 const c=createAaseCatalog(course,lessons,sources,'2026-11-05');const entry=c.searchEntries.find(e=>e.id==='AASE-M06-C02')!;assert.ok(entry.text.includes('收件人員'));assert.ok(entry.text.includes('要求檢查或匯出'));
 const draft=structuredClone(lessons);draft.find(l=>l.id==='AASE-M06-C02')!.status='draft';assert.ok(!createAaseCatalog(course,draft,sources,'2026-11-05').searchEntries.some(e=>e.id==='AASE-M06-C02'));
 const broken=structuredClone(lessons);const block=broken.find(l=>l.id==='AASE-M06-C02')!.text.zh.sections.flatMap(s=>s.blocks??[]).find(b=>b.kind==='architecture')!;if(block.kind==='architecture')block.relations[0].to='missing';assert.throws(()=>createAaseCatalog(course,broken,sources,'2026-11-05'),/Invalid architecture/);
});
