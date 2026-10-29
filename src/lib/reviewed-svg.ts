// Register only build-serialized, independently reviewed repository assets.
// Each lesson must test its generated map against the strict SVG allowlist.
// This is not a registry for runtime/user HTML or external image URLs.
import m0903 from './m0903-inline-svg.json' with { type: 'json' };

import m0904 from './m0904-inline-svg.json' with { type: 'json' };

const reviewed:Readonly<Record<string,string>>=Object.freeze({...m0903,...m0904});
export function reviewedSvgMarkup(src:string):string|undefined {
  return Object.hasOwn(reviewed,src) ? reviewed[src] : undefined;
}
