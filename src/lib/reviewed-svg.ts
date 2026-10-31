import m0204 from './m0204-inline-svg.json' with { type: 'json' };
import m0203 from './m0203-inline-svg.json' with { type: 'json' };
import m0202 from './m0202-inline-svg.json' with { type: 'json' };
import m0201 from './m0201-inline-svg.json' with { type: 'json' };
import m0906 from './m0906-inline-svg.json' with { type: 'json' };
// Register only build-serialized, independently reviewed repository assets.
// Each lesson must test its generated map against the strict SVG allowlist.
// This is not a registry for runtime/user HTML or external image URLs.
import m0903 from './m0903-inline-svg.json' with { type: 'json' };

import m0904 from './m0904-inline-svg.json' with { type: 'json' };

import m0905 from './m0905-inline-svg.json' with { type: 'json' };

const reviewed:Readonly<Record<string,string>>=Object.freeze({...m0903,...m0904,...m0905,...m0906,...m0201,...m0202,...m0203,...m0204});
export function reviewedSvgMarkup(src:string):string|undefined {
  return Object.hasOwn(reviewed,src) ? reviewed[src] : undefined;
}
