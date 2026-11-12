import {notePath} from './ceh-notes.ts';
import type {Locale} from './model.ts';

type HashNavigation = {
  location:{hash:string;replace:(url:string)=>void};
  addEventListener:(type:'hashchange',listener:()=>void)=>void;
  removeEventListener:(type:'hashchange',listener:()=>void)=>void;
};

/** Follow migrated chapter bookmarks on entry and same-document navigation. */
export function watchLegacyNoteHash(date:string,lang:Locale,target:HashNavigation):()=>void {
  const redirect=()=>{
    const hash=target.location.hash;
    if(date==='2026-11-10' && /^#p1-c(?:01|06)-[a-z0-9-]+$/.test(hash)) {
      target.location.replace(notePath('2026-11-12',lang)+hash);
    }
  };
  target.addEventListener('hashchange',redirect);
  redirect();
  return ()=>target.removeEventListener('hashchange',redirect);
}
