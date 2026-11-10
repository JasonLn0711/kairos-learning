import type {ConceptVisual} from './concepts';
export function validateRemediationDiagram(id:string,src:string,v:ConceptVisual):void {
 if(!src.startsWith('/images/ceh/m05-08-'))return;
 const match=src.match(/^\/images\/ceh\/m05-08-(workflow|status)-(zh|en)-v1-0-0\.svg$/);
 const fail=()=>{throw new Error(`${id}: invalid remediation diagram`);};
 if(id!=='CEH26-M05-C08'||!match||!v||Object.keys(v).some(k=>!['kind','caption','description','items'].includes(k)))fail();
 const name=match![1];
 if(v.kind!==(name==='workflow'?'flow':'cards')||!Array.isArray(v.items)||v.items.length!==(name==='workflow'?4:3)||![v.caption,v.description].every(s=>typeof s==='string'&&s.trim().length>0))fail();
 for(const i of v.items)if(!i||Object.keys(i).some(k=>!['title','body'].includes(k))||![i.title,i.body].every(s=>typeof s==='string'&&s.trim().length>0))fail();
}
