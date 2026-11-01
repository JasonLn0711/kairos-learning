/** Text-first diagrams: no arbitrary markup, URLs, CSS or SVG paths in content. */
export const diagramTones = {blue:'#eaf1ff',teal:'#e2f5f2',orange:'#fff1dd',red:'#ffe9e9',purple:'#f0eaff',gray:'#eef1f4'} as const;
export const diagramIcons = {
 computer:'M3 3h18v13H3z M8 21h8 M12 16v5',
 nas:'M5 2h14v20H5z M8 6h2v10H8z M14 6h2v10h-2z M15 19h1',
 shield:'M12 2 21 6v6c0 5-9 10-9 10S3 17 3 12V6z M8 12l3 3 5-6',
 network:'M9 2h6v6H9z M2 16h6v6H2z M16 16h6v6h-6z M12 8v4H5v4 M12 12h7v4',
 data:'M4 3h16v18H4z M8 7h8 M8 12h8 M8 17h5',
 check:'M4 12l5 5L20 5',
 warning:'M12 2 23 21H1z M12 8v6 M12 17v1'
} as const;
export type TeachingDiagram = {id:string;caption:string;description:string;groups:{title:string;mode:'flow'|'cards';items:{title:string;body:string;icon:keyof typeof diagramIcons;tone:keyof typeof diagramTones}[]}[];note:string};
export function diagramText(d:TeachingDiagram):string[]{return [d.caption,d.description,...d.groups.flatMap(g=>[g.title,...g.items.flatMap(i=>[i.title,i.body])]),d.note]}
export function validateDiagram(d:TeachingDiagram):void {
 const text=(s:unknown)=>typeof s==='string'&&s.trim().length>0&&s.length<=800;
 if(!d||!(/^[a-z][a-z0-9-]*$/).test(d.id)||![d.caption,d.description,d.note].every(text)||!Array.isArray(d.groups)||!d.groups.length||d.groups.length>6)throw Error('invalid diagram');
 for(const g of d.groups){if(!text(g.title)||!['flow','cards'].includes(g.mode)||!Array.isArray(g.items)||!g.items.length||g.items.length>6)throw Error('invalid diagram group');for(const i of g.items)if(!text(i.title)||!text(i.body)||!Object.hasOwn(diagramIcons,i.icon)||!Object.hasOwn(diagramTones,i.tone))throw Error('invalid diagram node');}
}
export function diagramAsset(articleId:string,d:TeachingDiagram,lang:string){return `/images/perspectives/${articleId}-${d.id}-${lang}.svg`}
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]!));
// Conservative character-width wrapping keeps standalone SVG labels readable without foreignObject.
function wrap(s:string,max:number){
 const lines:string[]=[];let line='',width=0;
 const tokens=s.match(/[A-Za-z0-9’'\/-]+|\s+|[^\s]/gu)??[];
 for(const token of tokens){const w=[...token].reduce((n,c)=>n+(c.charCodeAt(0)>255?1:.58),0);
  if(width+w>max&&line){lines.push(line.trimEnd());line='';width=0;}
  if(!line&&!token.trim())continue;
  for(const c of token){const cw=c.charCodeAt(0)>255?1:.58;if(width+cw>max&&line){lines.push(line.trimEnd());line='';width=0;}line+=c;width+=cw;}
 }if(line.trim())lines.push(line.trimEnd());return lines;
}
export function renderDiagramSvg(d:TeachingDiagram,lang:string):string {
 validateDiagram(d);let y=36;const parts:string[]=[];
 const text=(s:string,x:number,size:number,max:number,bold=false)=>{for(const line of wrap(s,max)){parts.push(`<text x="${x}" y="${y}" font-size="${size}"${bold?' font-weight="700"':''}>${escape(line)}</text>`);y+=size*1.65;}};
 text(d.caption,28,24,28,true);text(d.description,28,18,37);y+=12;
 for(const g of d.groups){text(g.title,28,21,32,true);for(const [index,i] of g.items.entries()){
  if(index&&g.mode==='flow'){parts.push(`<path d="M360 ${y-12}v20m-6-6 6 6 6-6" fill="none" stroke="#425466" stroke-width="2"/>`);y+=24;}
  const top=y-18;const n=wrap(i.title,28).length*33+wrap(i.body,33).length*29.7+40;
  parts.push(`<rect x="28" y="${top}" width="664" height="${n}" rx="16" fill="${diagramTones[i.tone]}" stroke="#59697a"/><path d="${diagramIcons[i.icon]}" transform="translate(44 ${y-5}) scale(1.3)" fill="none" stroke="#243b53" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`);
  y+=12;text(i.title,92,20,28,true);text(i.body,92,18,33);y=top+n+28;
 }y+=12;}text(d.note,28,18,37);y+=12;
 return `<svg xmlns="http://www.w3.org/2000/svg" lang="${escape(lang)}" viewBox="0 0 720 ${Math.ceil(y)}" role="img" aria-labelledby="title description"><title id="title">${escape(d.caption)}</title><desc id="description">${escape(d.description)}</desc><rect width="720" height="${Math.ceil(y)}" fill="#ffffff"/><g font-family="system-ui, sans-serif" fill="#182b40">${parts.join('')}</g></svg>\n`;
}
