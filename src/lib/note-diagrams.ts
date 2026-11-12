import specs from './note-diagram-specs.json' with {type:'json'};
/** Reviewed reference relationships. Data contains text only, never arbitrary SVG/HTML. */
export type NoteDiagramSpec = {count:number;layout:string;rows?:number[][];edges?:[number,number,string,string?][]};
export const noteDiagramSpecs = specs;
export type NoteDiagramName = keyof typeof noteDiagramSpecs;
export type NoteDiagram = {kind:'diagram';name:NoteDiagramName;caption:string;description:string;items:{title:string;body:string}[]};
/** Fixed endpoints preserve TLS direction in HTML and SVG, including mobile reflow. */
export const tlsDirections = ['to-server','to-client','both','to-client','to-client','to-client','client','to-server','to-server','to-client'] as const;
const referenceNumbers:Record<string,number>={overview:1,cia:2,encryption:3,defense:4,hats:5,roe:6,testing:7,decision:8,hash:9,compare:10,tls:11};
export function noteReferenceImage(date:string,name:string):string|null {
  if(date==='2026-11-12'&&name==='m20gcmflow')return 'https://github.com/JasonLn0711/kairos-learning/blob/main/docs/sources/ceh-m20-review/2026-11-12/four-concepts-supplement/image-1.png';
  const m20Names=['map','cia','aead','symmetric','asymmetric','hybrid','transforms','sizes','finalists','mounted'].map(n=>'m20'+n);
  if(date==='2026-11-12'&&m20Names.includes(name))return `https://github.com/JasonLn0711/kairos-learning/blob/main/docs/sources/ceh-m20-review/2026-11-12/image-${m20Names.indexOf(name)+1}.png`;
  if(!['2026-11-10','2026-11-12'].includes(date))return null;
  const socNames=['socgovernance','alerttriage','incidentcoordination','recoverytimeline'];
  const socIndex=socNames.indexOf(name);
  if(date==='2026-11-12'&&socIndex>=0)return `https://github.com/JasonLn0711/kairos-learning/blob/main/docs/sources/ceh-notes/2026-11-12/c30-c38-supplement/image-${socIndex+1}.png`;
  const day01Names=['lifecyclecontrols','controlaxes','defenselayers','firewallpolicy','sanitizationmethods','ssdremapping','sanitizationprogram','standardsmap','riskassessment','riskmatrix','pdcacycle','controlcounts','riskgovernance'];
  const day01Index=day01Names.indexOf(name);
  if(date==='2026-11-12'&&day01Index>=0)return `https://github.com/JasonLn0711/kairos-learning/blob/main/docs/sources/ceh-notes/2026-11-12/controls-risk-supplement/image-${day01Index+1}.png`;
  const roeNames=['securityframeworks','itotrisks','validationevidence','authorizationgates'];
  const roeIndex=roeNames.indexOf(name);
  if(roeIndex>=0)return `https://github.com/JasonLn0711/kairos-learning/blob/main/docs/sources/ceh-notes/2026-11-10/c06-c16-supplement-2026-11-12/image-${roeIndex+1}.png`;
  const ciaNames=['ciaobjectives','transactiontampering','serviceavailability','signatureevidence','transportprotection'];
  const ciaIndex=ciaNames.indexOf(name);
  if(ciaIndex>=0)return `https://github.com/JasonLn0711/kairos-learning/blob/main/docs/sources/ceh-notes/2026-11-10/c01-c05-replacement-2026-11-12/image-${ciaIndex+1}.png`;
  const continuationNames=['authorization','soc','blocksize','hybrid','digest','certificate','tasks','bytes','aeshistory','storage','hidden','response','keymethods','mitm','tlsroles','signverify','reasoning'];
  const index=continuationNames.indexOf(name);
  if(index>=0)return `https://github.com/JasonLn0711/kairos-learning/blob/main/docs/sources/ceh-notes/2026-11-10/continuation-17-reference/image-${index+1}.png`;
  if(!Object.hasOwn(referenceNumbers,name))return null;
  return `https://github.com/JasonLn0711/kairos-learning/blob/main/docs/sources/ceh-notes/2026-11-10/reconstruction/image-${referenceNumbers[name]}.png`;
}
export function validateNoteDiagram(block:NoteDiagram):void {
  const fail=():never=>{throw Error('CEH notes: invalid reference diagram');};
  if(!Object.hasOwn(noteDiagramSpecs,block.name)||Object.keys(block).sort().join(',')!=='caption,description,items,kind,name')fail();
  if(![block.caption,block.description].every(s=>typeof s==='string'&&s.trim()))fail();
  if(!Array.isArray(block.items)||block.items.length!==noteDiagramSpecs[block.name].count)fail();
  for(const item of block.items)if(Object.keys(item).sort().join(',')!=='body,title'||![item.title,item.body].every(s=>typeof s==='string'&&s.trim()))fail();
}
