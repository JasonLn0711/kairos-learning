import type {ConceptVisual} from './concepts.ts';

// Only reviewed, fixed teaching layouts enter this renderer. No score input or markup.
export function validatePrioritizationDiagram(id:string,src:string,v:ConceptVisual):void {
 if(!src.startsWith('/images/ceh/m05-05-'))return;
 const match=src.match(/^\/images\/ceh\/m05-05-(signals|groups|probability|workflow)-(zh|en)-v1-0-0\.svg$/);
 const counts:Record<string,number>={signals:3,groups:4,probability:1,workflow:4};
 const fail=()=>{throw new Error(`${id}: invalid prioritization diagram`);};
 if(!match||id!=='CEH26-M05-C05')fail();
 const name=match![1];
 if(v.kind!==(name==='workflow'?'flow':'cards')||v.items.length!==counts[name])fail();
 if(Object.keys(v).some(k=>!['kind','caption','description','items'].includes(k)))fail();
 if(v.items.some(item=>Object.keys(item).some(k=>!['title','body'].includes(k))))fail();
 if(name==='probability'&&v.items[0].title!=='0.20 = 20%')fail();
}
