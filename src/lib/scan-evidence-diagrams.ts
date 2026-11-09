import type {ConceptVisual} from './concepts.ts';
export function validateScanEvidenceDiagram(id:string,src:string,v:ConceptVisual):void {
 if(!src.startsWith('/images/ceh/m05-06-'))return;
 const m=src.match(/^\/images\/ceh\/m05-06-(paths|gates|result)-(zh|en)-v1-0-0\.svg$/);
 const counts:Record<string,number>={paths:3,gates:5,result:4};
 if(!m||id!=='CEH26-M05-C06'||v.kind!==(m[1]==='gates'?'flow':'cards')||v.items.length!==counts[m[1]]||Object.keys(v).some(k=>!['kind','caption','description','items'].includes(k))||v.items.some(n=>Object.keys(n).some(k=>!['title','body'].includes(k))))throw new Error(`${id}: invalid scan evidence diagram`);
}
