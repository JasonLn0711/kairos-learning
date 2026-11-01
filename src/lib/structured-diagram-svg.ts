import type {TeachingDiagram} from './perspective-diagrams.ts';
const palette={blue:['#eff6ff','#2864db','#1746ad'],teal:['#edfcf5','#008459','#006747'],orange:['#fff9eb','#c46500','#994600'],red:['#fff0f3','#d63d60','#a80e36'],purple:['#f0eaff','#7351a8','#472675'],gray:['#eef1f4','#59697a','#243b53']};
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]!));
function lines(s:string,width:number,size:number){const result:string[]=[];let line='',used=0;for(const word of s.match(/[A-Za-z0-9_()/.-]+|\s+|[^\s]/gu)??[]){const weight=[...word].reduce((a,c)=>a+(c.charCodeAt(0)>255?1:.62),0)*size;if(used+weight>width&&line){result.push(line.trim());line='';used=0;}for(const c of word){const w=(c.charCodeAt(0)>255?1:.62)*size;if(used+w>width&&line){result.push(line.trim());line='';used=0;}if(!line&&!c.trim())continue;line+=c;used+=w;}}if(line)result.push(line.trim());return result;}
export function renderStructuredDiagramSvg(d:TeachingDiagram,lang:string){
 const parts:string[]=[];const text=(s:string,x:number,y:number,w:number,size=20,bold=false,color='#25374c',center=false)=>{const ls=lines(s,w,size);for(const [i,l] of ls.entries())parts.push(`<text x="${center?x+w/2:x}" y="${y+i*size*1.55}" font-size="${size}" fill="${color}"${bold?' font-weight="700"':''}${center?' text-anchor="middle"':''}>${esc(l)}</text>`);return ls.length*size*1.55;};
 const rect=(x:number,y:number,w:number,h:number,fill:string,stroke:string,dash=false)=>parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="2"${dash?' stroke-dasharray="8 5"':''}/>`);
 const arrow=(x1:number,y1:number,x2:number,y2:number,dash=false)=>{const horizontal=y1===y2;parts.push(`<path d="M${x1} ${y1}${horizontal?`H${x2}`:`V${y2}`}m${horizontal?'-10 -8':'-8 -10'} ${horizontal?'10 8 -10 8':'8 10 8 -10'}" fill="none" stroke="#596b82" stroke-width="3"${dash?' stroke-dasharray="8 5"':''}/>`);};
 type Node=TeachingDiagram['groups'][number]['items'][number];
 const height=(n:Node,w:number)=>28+lines(n.title,w-40,24).length*37.2+(n.cells?94:0)+lines(n.body,w-40,20).length*31+22;
 const node=(n:Node,x:number,y:number,w:number,h:number)=>{const [fill,edge,ink]=palette[n.tone];rect(x,y,w,h,fill,edge);let yy=y+34;yy+=text(n.title,x+20,yy,w-40,24,true,ink,true);if(n.cells){const gap=10,cw=(w-40-gap*(n.cells.length-1))/n.cells.length;for(const [i,c] of n.cells.entries()){rect(x+20+i*(cw+gap),yy+8,cw,68,'#ffffff',edge,n.state==='released');text(c,x+20+i*(cw+gap),yy+53,cw,34,true,ink,true);}yy+=94;}text(n.body,x+20,yy+8,w-40,20,false,ink,true);};
 let y=42;y+=text(d.caption,32,y,1136,28,true);y+=text(d.description,32,y+12,1136,20)+36;
 if(d.layout==='layers'){
  for(const [index,g] of d.groups.entries()){
   if(index){arrow(880,y,880,y+54,true);y+=74;}
   const cols=g.items.length,w=(1072-(cols-1)*48)/cols,h=Math.max(...g.items.map(n=>height(n,w)));
   const titleH=lines(g.title,1072,24).length*37.2;rect(32,y,1136,h+titleH+60,index?'#edfcf5':'#eff6ff',index?'#20ab66':'#5795ff');
   text(g.title,64,y+34,1072,24,true);const top=y+titleH+46;
   g.items.forEach((n,i)=>{node(n,64+i*(w+48),top,w,h);if(i)arrow(64+i*(w+48)-44,top+h/2,64+i*(w+48)-4,top+h/2);});y+=h+titleH+60;
  }
 }else{
  const g=d.groups[0];y+=text(g.title,32,y,1136,24,true)+18;
  if(d.layout==='reference'){
   const [pointer,memory,error]=g.items,w=500,ph=height(pointer,w),mh=height(memory,w),eh=height(error,w),total=Math.max(ph+36+eh,mh);
   node(pointer,32,y,w,ph);node(error,32,y+ph+36,w,eh);node(memory,668,y+(total-mh)/2,w,mh);
   const start=y+ph/2,end=y+total/2;parts.push(`<path d="M532 ${start}H600V${end}H660m-10-8 10 8-10 8" fill="none" stroke="#c62828" stroke-width="3" stroke-dasharray="8 5"/>`);y+=total;
  }else{
   const cols=g.items.length,gap=40,w=(1136-gap*(cols-1))/cols,h=Math.max(...g.items.map(n=>height(n,w)));
   g.items.forEach((n,i)=>{node(n,32+i*(w+gap),y,w,h);if(i&&d.layout==='stages')arrow(32+i*(w+gap)-36,y+h/2,32+i*(w+gap)-4,y+h/2);});y+=h;
  }
 }
 y+=48;y+=text(d.note,32,y,1136,21,true);y+=20;
 return `<svg xmlns="http://www.w3.org/2000/svg" lang="${esc(lang)}" viewBox="0 0 1200 ${Math.ceil(y)}" role="img" aria-labelledby="title description"><title id="title">${esc(d.caption)}</title><desc id="description">${esc(d.description)}</desc><rect width="1200" height="${Math.ceil(y)}" fill="#ffffff"/><g font-family="system-ui, sans-serif">${parts.join('')}</g></svg>\n`;
}
