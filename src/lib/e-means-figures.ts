import models from './e-means-figures.json' with {type:'json'};
export const eMeansFigureNames=['clusters','lloyd','minima','batches','ema','components','cosine','ivf'] as const;
export type EMeansFigureName=typeof eMeansFigureNames[number];
export type EMeansLocale='zh'|'en';
export {models as eMeansModels};
export const cosineStep=(progress:number)=>{
 if(!Number.isFinite(progress)||progress<0||progress>1)throw Error('Invalid cosine progress');
 return .4*(.1+.9*(1+Math.cos(Math.PI*progress))/2);
};
export const emaPosition=(value:number)=>60+(value-40)*12;
export function eMeansFigureText(name:EMeansFigureName,lang:EMeansLocale){
 const m=models[name];return [m.title[lang],m.description[lang],...m.nodes.flatMap(n=>[n[lang].title,n[lang].body]),m.note[lang],...(name==='ivf'?models.ivf.flows[lang]:[])];
}
export function eMeansAsset(name:EMeansFigureName,lang:EMeansLocale){return `/images/perspectives/e-means-${name}-${lang}.svg`;}
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]!));
export function eMeansArtwork(name:EMeansFigureName):string {
 if(!eMeansFigureNames.includes(name))throw Error('Unknown e-means figure');
 const circle=(x:number,y:number,r:number,fill:string,stroke='none')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
 const path=(d:string,color:string)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`;
 if(name==='clusters')return [[150,90,'#2485b9'],[570,90,'#d65a42'],[360,230,'#299b76']].map(([x,y,color])=>{const a=Number(x),b=Number(y),c=String(color);return `<circle cx="${a}" cy="${b}" r="78" fill="${c}" fill-opacity=".08" stroke="${c}" stroke-dasharray="7 6"/>`+[[0,-48],[-38,-26],[40,-10],[-30,30],[28,40],[10,53]].map(([dx,dy])=>circle(a+dx,b+dy,4,c)).join('')+circle(a,b,14,'white',c)+path(`M${a-7} ${b}h14M${a} ${b-7}v14`,c);}).join('');
 if(name==='lloyd')return [70,220].map((y,row)=>path(`M60 ${y}H660`,'#9ca3af')+[1,2,3,8,9,10].map(v=>circle(60+(v-1)*600/9,y,6,v<4?'#2485b9':'#d65a42')).join('')+[2,row?9:8].map((v,i)=>{const x=60+(v-1)*600/9;return `<path d="M${x} ${y-28}l-12 22h24z" fill="${i?'#d65a42':'#2485b9'}"/>`;}).join('')).join('');
 if(name==='minima')return [0,360].map((x,i)=>`<g transform="translate(${x} 0)">`+path('M20 30C65 25 65 160 110 160C145 160 145 65 185 65C220 65 220 210 265 210C300 210 315 100 340 20',i?'#2485b9':'#d65a42')+circle(i?265:110,i?210:160,8,i?'#2485b9':'#d65a42')+'</g>').join('');
 if(name==='batches')return [10,5].map((n,row)=>Array.from({length:n},(_,i)=>`<rect x="${30+i*660/n}" y="${40+row*130}" width="${660/n-5}" height="38" rx="3" fill="${row?'#2485b9':i%2?'#e4a08f':'#d65a42'}"/>${row?path(`M${30+(i+.5)*660/n} 218v20m-5-5 5 5 5-5`,'#64748b'):''}`).join('')).join('');
 if(name==='ema')return path('M60 160H660','#9ca3af')+[40,50,60,70,80,90].map(v=>path(`M${emaPosition(v)} 151v18`,'#9ca3af')).join('')+circle(emaPosition(50),160,11,'#808080')+circle(emaPosition(56),160,11,'#2485b9')+circle(emaPosition(80),160,11,'#d65a42');
 if(name==='cosine')return path('M60 20V270H680','#64748b')+path(Array.from({length:101},(_,i)=>`${i?'L':'M'}${60+i*6.2} ${270-cosineStep(i/100)*600}`).join(' '),'#299b76')+Array.from({length:11},(_,i)=>circle(60+i*62,270-cosineStep(i/10)*600,4,'#299b76')).join('');
 return '';
}
export function renderEMeansSvg(name:EMeansFigureName,lang:EMeansLocale):string {
 const m=models[name];let y=380;const parts=[`<text x="30" y="36" font-size="23" font-weight="700">${esc(m.title[lang])}</text>`,`<g transform="translate(0 56)">${eMeansArtwork(name)}</g>`];
 const wrap=(text:string,size:number)=>{let line='',width=0;for(const ch of text){const w=ch.charCodeAt(0)>255?1:.58;if(width+w>37){parts.push(`<text x="30" y="${y}" font-size="${size}">${esc(line)}</text>`);y+=30;line='';width=0;}line+=ch;width+=w;}if(line){parts.push(`<text x="30" y="${y}" font-size="${size}">${esc(line)}</text>`);y+=30;}};
 if(!eMeansArtwork(name)){y=76;}
 wrap(m.description[lang],18);y+=12;
 for(const n of m.nodes){wrap(n[lang].title,19);wrap(n[lang].body,18);y+=16;}
 if(name==='ivf')for(const label of models.ivf.flows[lang])wrap(label,18);
 wrap(m.note[lang],17);y+=20;
 return `<svg xmlns="http://www.w3.org/2000/svg" lang="${lang}" viewBox="0 0 720 ${y}" role="img" aria-labelledby="title desc"><title id="title">${esc(m.title[lang])}</title><desc id="desc">${esc(m.description[lang])}</desc><rect width="720" height="${y}" fill="white"/><g font-family="system-ui,sans-serif" fill="#182b40">${parts.join('')}</g></svg>\n`;
}
