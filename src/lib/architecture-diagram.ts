/** Bounded, text-only C4 teaching data. No markup, paths, styles or executable content. */
export type ArchitectureNode = {id:string;title:string;body:string;kind:'person'|'software-system'|'container'|'data-store';inside:boolean};
export type ArchitectureDiagramModel = {kind:'architecture';level:'context'|'container';caption:string;description:string;boundary:string;nodes:ArchitectureNode[];relations:{from:string;to:string;label:string}[]};
export const architectureDiagramLabels={zh:{outside:'系統範圍外',inside:'系統範圍內',relations:'有方向的關係',to:'流向',person:'人／角色','software-system':'軟體系統',container:'應用程式／容器','data-store':'資料儲存'},en:{outside:'Outside the system scope',inside:'Inside the system scope',relations:'Directed relationships',to:'to',person:'Person / role','software-system':'Software system',container:'Application / container','data-store':'Data store'}};
export function assertArchitectureDiagram(value:unknown):asserts value is ArchitectureDiagramModel {
 const fail=():never=>{throw new Error('Invalid architecture diagram');};
 const object=(x:unknown):x is Record<string,unknown>=>typeof x==='object'&&x!==null&&!Array.isArray(x);
 const keys=(x:Record<string,unknown>,allowed:string[])=>Object.keys(x).length===allowed.length&&Object.keys(x).every(k=>allowed.includes(k));
 const text=(x:unknown)=>typeof x==='string'&&x.trim().length>0&&x.length<=1200;
 const id=(x:unknown)=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,39}$/.test(x);
 if(!object(value)||!keys(value,['kind','level','caption','description','boundary','nodes','relations']))fail();
 const d=value as Record<string,unknown>;
 if(d.kind!=='architecture'||!['context','container'].includes(String(d.level))||![d.caption,d.description,d.boundary].every(text)||!Array.isArray(d.nodes)||d.nodes.length<2||d.nodes.length>8||!Array.isArray(d.relations)||d.relations.length<1||d.relations.length>12)fail();
 const nodes=d.nodes as unknown[];const relations=d.relations as unknown[];const ids=new Set<string>(),insideIds=new Set<string>();let inside=0,outside=0;
 for(const n of nodes){
  if(!object(n)||!keys(n,['id','title','body','kind','inside'])||!id(n.id)||!text(n.title)||!text(n.body)||!['person','software-system','container','data-store'].includes(String(n.kind))||typeof n.inside!=='boolean'||ids.has(n.id as string))fail();
  const node=n as unknown as ArchitectureNode;ids.add(node.id);node.inside?inside++:outside++;if(node.inside)insideIds.add(node.id);
  if(node.inside&&node.kind==='person'||d.level==='context'&&node.kind!=='person'&&node.kind!=='software-system'||d.level==='context'&&node.inside&&node.kind!=='software-system'||d.level==='container'&&node.inside&&node.kind!=='container'&&node.kind!=='data-store')fail();
 }
 if(!inside||!outside||d.level==='context'&&inside!==1)fail();
 const seen=new Set<string>(),connected=new Set<string>(),direct=new Set<string>();
 for(const r of relations){
  if(!object(r)||!keys(r,['from','to','label'])||!id(r.from)||!id(r.to)||!text(r.label)||!ids.has(r.from as string)||!ids.has(r.to as string)||r.from===r.to)fail();
  const edge=r as {from:string;to:string;label:string};if(insideIds.has(edge.from))direct.add(edge.to);if(insideIds.has(edge.to))direct.add(edge.from);const key=JSON.stringify([edge.from,edge.to,edge.label]);if(seen.has(key))fail();seen.add(key);connected.add(edge.from);connected.add(edge.to);
 }
 if(connected.size!==ids.size||d.level==='context'&&nodes.some(n=>{const node=n as ArchitectureNode;return !node.inside&&!direct.has(node.id);}))fail();
}
export function architectureDiagramText(d:ArchitectureDiagramModel,lang:'zh'|'en'='zh'):string[]{
 const l=architectureDiagramLabels[lang];
 const title=(id:string)=>d.nodes.find(n=>n.id===id)!.title;
 return [d.caption,d.description,d.boundary,l.inside,l.outside,l.relations,...d.nodes.flatMap(n=>[n.title,n.body,l[n.kind],n.inside?l.inside:l.outside]),...d.relations.flatMap(r=>[title(r.from),r.label,title(r.to)])];
}
