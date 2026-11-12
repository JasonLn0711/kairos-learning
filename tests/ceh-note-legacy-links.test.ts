import test from 'node:test';
import assert from 'node:assert/strict';
import {watchLegacyNoteHash} from '../src/lib/ceh-note-legacy-links.ts';

function browser(hash='') {
  const events=new EventTarget();
  const replacements:string[]=[];
  const target={
    location:{hash,replace:(url:string)=>{replacements.push(url);}},
    addEventListener:(type:'hashchange',listener:()=>void)=>events.addEventListener(type,listener),
    removeEventListener:(type:'hashchange',listener:()=>void)=>events.removeEventListener(type,listener)
  };
  return {target,replacements,navigate:(hash:string)=>{target.location.hash=hash;events.dispatchEvent(new Event('hashchange'));}};
}

test('migrated bookmarks work on entry and later hash changes, with locale and cleanup',()=>{
  const zh=browser('#p1-c01-map');
  const cleanup=watchLegacyNoteHash('2026-11-10','zh',zh.target);
  assert.deepEqual(zh.replacements,['/ceh-notes/2026-11-12/#p1-c01-map']);
  zh.navigate('#p1-c06-hacker-types');
  assert.equal(zh.replacements.at(-1),'/ceh-notes/2026-11-12/#p1-c06-hacker-types');
  cleanup();zh.navigate('#p1-c01-map');assert.equal(zh.replacements.length,2);

  const en=browser();watchLegacyNoteHash('2026-11-10','en',en.target);
  en.navigate('#p1-c01-map');
  assert.deepEqual(en.replacements,['/en/ceh-notes/2026-11-12/#p1-c01-map']);
  for(const hash of ['#p1-cia','#part-2','#p1-c17-test','#p1-c01-','javascript:alert(1)'])en.navigate(hash);
  assert.equal(en.replacements.length,1);
  const current=browser('#p1-c01-map');watchLegacyNoteHash('2026-11-12','en',current.target);
  current.navigate('#p1-c06-hacker-types');assert.deepEqual(current.replacements,[]);
});
