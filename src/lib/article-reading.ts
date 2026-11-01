import guides from '../../content/reading-support/ceh-m01-m02.json' with {type:'json'};
import diagrams from './m01-m02-readable-diagrams.json' with {type:'json'};
export type ReadingGuide={goal:string;startingPoint:string;route:string;output:string};
export type ReadableDiagram={description:string;rows:string[][]};
export function readingGuide(id:string,lang:string):ReadingGuide|undefined {return (guides as Record<string,Record<string,ReadingGuide>>)[id]?.[lang]}
export function readableDiagram(src:string,lang:string):ReadableDiagram|undefined{return (diagrams as Record<string,Record<string,ReadableDiagram>>)[src]?.[lang]}
export function readingText(id:string,lang:string):string[]{const g=readingGuide(id,lang);return g?Object.values(g):[]}
