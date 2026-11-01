import diagrams from './m0206-network-diagrams.json' with {type:'json'};
export type NetworkDiagram = {caption:string;description:string;nodes:{title:string;body:string;tone:string}[];labels:string[];footer:string};
export type NetworkLayout = keyof typeof diagrams.zh;
export function networkDiagram(src:string):{layout:NetworkLayout;data:NetworkDiagram}|undefined {
 const match=/^\/images\/ceh\/m02-06-([a-z-]+)-(zh|en)\.svg$/.exec(src);
 if(!match || !Object.hasOwn(diagrams.zh,match[1])) return;
 const layout=match[1] as NetworkLayout;
 return {layout,data:diagrams[match[2] as 'zh'|'en'][layout]};
}
// The explorer deliberately fixes the example IP and supports /24 through /30 only.
export function examplePrefix(prefix:number) {
 if(!Number.isInteger(prefix)||prefix<24||prefix>30) throw new RangeError('Example prefix must be /24–/30');
 const count=2**(32-prefix),start=Math.floor(25/count)*count;
 return {network:`192.0.2.${start}/${prefix}`,count,start:`192.0.2.${start}`,end:`192.0.2.${start+count-1}`};
}
