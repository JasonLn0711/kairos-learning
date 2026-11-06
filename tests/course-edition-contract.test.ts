import test from 'node:test';
import assert from 'node:assert/strict';
import {currentEdition,assertRenderedEdition,type HistoricalEdition} from './helpers/course-edition-contract.ts';

const row:HistoricalEdition={id:'fixture-concept',publishedOn:'2026-11-04',dateKey:'date',after:{revision:2,contentVersion:'1.0.1',date:'2026-11-05'}};
const current={id:row.id,publishedOn:row.publishedOn,revision:3,contentVersion:'1.1.0',date:'2026-11-06'};
const metadata=(version:string,publishedOn:string,revisedOn:string)=>'<span>v'+version+'</span><span>First published <time datetime="'+publishedOn+'">'+publishedOn+'</time></span><span>Version revised <time datetime="'+revisedOn+'">'+revisedOn+'</time></span>';

test('historical navigation patch accepts a later canonical edition and verifies its rendered version',()=>{
 const expected=currentEdition(row,current);
 assert.deepEqual(expected,{version:'1.1.0',publishedOn:'2026-11-04',revisedOn:'2026-11-06'});
 assert.doesNotThrow(()=>assertRenderedEdition(metadata('1.1.0',row.publishedOn,current.date),expected,'fixture'));
 const original=currentEdition(row,{...current,revision:2,contentVersion:'1.0.1',date:'2026-11-05'});
 assert.doesNotThrow(()=>assertRenderedEdition(metadata('1.0.1',row.publishedOn,'2026-11-05'),original,'original'));
});

test('a stale historical edition cannot pass for a newer canonical page',()=>{
 const expected=currentEdition(row,current);
 assert.throws(()=>assertRenderedEdition(metadata('1.0.1',row.publishedOn,'2026-11-05'),expected,'stale'),/current canonical edition/);
 assert.throws(()=>assertRenderedEdition(metadata('1.1.01',row.publishedOn,current.date),expected,'similar version'),/current canonical edition/);
});

test('rendered original publication and current revision dates must both remain exact',()=>{
 const expected=currentEdition(row,current);
 assert.throws(()=>assertRenderedEdition(metadata('1.1.0','2026-11-05',current.date),expected,'changed publication'),/publication and current revision/);
 assert.throws(()=>assertRenderedEdition(metadata('1.1.0',row.publishedOn,'2026-11-05'),expected,'stale revision'),/publication and current revision/);
});

test('an independent content-check date is allowed but cannot replace a revision date',()=>{
 const expected=currentEdition(row,current);
 const checked='<span>Content checked <time datetime="2026-10-23">2026-10-23</time></span>';
 assert.doesNotThrow(()=>assertRenderedEdition(metadata('1.1.0',row.publishedOn,current.date)+checked,expected,'checked'));
 assert.throws(()=>assertRenderedEdition(metadata('1.1.0',row.publishedOn,'2026-11-05')+checked,expected,'stale checked'),/publication and current revision/);
 const missingRevision='<span>v1.1.0</span><span>First published <time datetime="2026-11-04">2026-11-04</time></span><span>Content checked <time datetime="2026-11-06">2026-11-06</time></span>';
 assert.throws(()=>assertRenderedEdition(missingRevision,expected,'missing revision'),/publication and current revision/);
});

test('canonical changes cannot weaken identity, original publication or historical floors',()=>{
 assert.throws(()=>currentEdition(row,{...current,id:'another-concept'}),/canonical identity/);
 assert.throws(()=>currentEdition(row,{...current,publishedOn:'2026-11-05'}),/original publication/);
 assert.throws(()=>currentEdition(row,{...current,contentVersion:'1.0.0'}),/version below historical floor/);
 assert.throws(()=>currentEdition(row,{...current,revision:1}),/revision below historical floor/);
 assert.throws(()=>currentEdition(row,{...current,date:'2026-11-04'}),/revision date below historical floor/);
});

test('legacy lessons use their canonical revisedOn field',()=>{
 const lessonRow:HistoricalEdition={...row,dateKey:'revisedOn',after:{revision:2,contentVersion:'1.0.1',revisedOn:'2026-11-05'}};
 assert.deepEqual(currentEdition(lessonRow,{...current,date:undefined,revisedOn:'2026-11-06'}),{version:'1.1.0',publishedOn:row.publishedOn,revisedOn:'2026-11-06'});
});
